"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import {
  ArrowLeft,
  Image as ImageIcon,
  Info,
  Mail,
  Search,
  Send,
  Settings,
  Smile,
} from "lucide-react";

import { useTwitter } from "@/components/AppContext";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Conversation, User } from "@/types";

export interface MessagesViewProps {
  conversationId?: string;
  onNavigate: (path: string) => void;
}

function profilePath(user: User): string {
  return `/${encodeURIComponent(user.handle)}`;
}

function conversationPath(conversation: Conversation): string {
  return `/messages/${encodeURIComponent(conversation.id)}`;
}

function conversationUsers(
  conversation: Conversation,
  currentUserId: string,
  getUserById: (userId: string) => User,
): User[] {
  return conversation.participantIds
    .filter((participantId) => participantId !== currentUserId)
    .map(getUserById);
}

function conversationTitle(participants: User[]): string {
  return participants.map((participant) => participant.name).join(", ");
}

function conversationHandle(participants: User[]): string {
  return participants.map((participant) => `@${participant.handle}`).join(", ");
}

export function MessagesView({
  conversationId,
  onNavigate,
}: MessagesViewProps) {
  const {
    currentUser,
    conversations,
    getUserById,
    sendMessage,
    markConversationRead,
    showToast,
  } = useTwitter();
  const [searchQuery, setSearchQuery] = useState("");
  const [messageDraft, setMessageDraft] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  const activeConversation = useMemo(
    () =>
      conversationId
        ? conversations.find(
            (conversation) => conversation.id === conversationId,
          )
        : undefined,
    [conversationId, conversations],
  );

  const conversationRows = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return conversations.filter((conversation) => {
      if (!normalizedQuery) return true;
      const participants = conversationUsers(
        conversation,
        currentUser.id,
        getUserById,
      );
      const lastMessage = conversation.messages.at(-1);
      const searchableText = [
        conversationTitle(participants),
        conversationHandle(participants),
        lastMessage?.text ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return searchableText.includes(normalizedQuery);
    });
  }, [conversations, currentUser.id, getUserById, searchQuery]);

  const activeParticipants = useMemo(
    () =>
      activeConversation
        ? conversationUsers(activeConversation, currentUser.id, getUserById)
        : [],
    [activeConversation, currentUser.id, getUserById],
  );
  const activePrimaryParticipant = activeParticipants[0];

  useEffect(() => {
    if (activeConversation?.unread) {
      markConversationRead(activeConversation.id);
    }
  }, [activeConversation?.id, activeConversation?.unread, markConversationRead]);

  useEffect(() => {
    setMessageDraft("");
    if (!conversationId) return;
    const focusFrame = window.requestAnimationFrame(() => {
      messageInputRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(focusFrame);
  }, [conversationId]);

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeConversation) return;
    const message = sendMessage(activeConversation.id, messageDraft);
    if (message) {
      setMessageDraft("");
    }
  };

  const handleMessageKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  const hasRequestedConversation = Boolean(conversationId);
  const activeConversationMissing =
    hasRequestedConversation && !activeConversation;
  const messagesClassName = [
    "tw-view-page",
    "tw-view-messages",
    activeConversation ? "has-active-conversation" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={messagesClassName}>
      <aside className="tw-messages-inbox" aria-label="Message inbox">
        <header className="tw-messages-inbox-header">
          <div>
            <h1>Messages</h1>
            <span>@{currentUser.handle}</span>
          </div>
          <div className="tw-messages-inbox-actions">
            <button
              type="button"
              aria-label="Message settings"
              title="Settings"
              onClick={() => showToast("Message settings are coming soon.")}
            >
              <Settings size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Start a new message"
              title="New message"
              onClick={() => {
                searchInputRef.current?.focus();
                showToast("Search your conversations to start chatting.");
              }}
            >
              <Mail size={20} aria-hidden="true" />
            </button>
          </div>
        </header>

        <label className="tw-messages-search">
          <Search size={18} aria-hidden="true" />
          <span className="tw-messages-search-label">Search direct messages</span>
          <input
            ref={searchInputRef}
            type="search"
            value={searchQuery}
            placeholder="Search Direct Messages"
            autoComplete="off"
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </label>

        <div className="tw-messages-conversation-list">
          {conversationRows.length > 0 ? (
            conversationRows.map((conversation) => {
              const participants = conversationUsers(
                conversation,
                currentUser.id,
                getUserById,
              );
              const primaryParticipant = participants[0] ?? currentUser;
              const title = conversationTitle(participants) || "Conversation";
              const handles = conversationHandle(participants);
              const lastMessage = conversation.messages.at(-1);
              const isActive = conversation.id === activeConversation?.id;

              return (
                <button
                  type="button"
                  className={[
                    "tw-messages-conversation",
                    isActive ? "is-active" : "",
                    conversation.unread ? "is-unread" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => onNavigate(conversationPath(conversation))}
                  key={conversation.id}
                >
                  <Avatar user={primaryParticipant} size="md" />
                  <span className="tw-messages-conversation-copy">
                    <span className="tw-messages-conversation-heading">
                      <strong>{title}</strong>
                      {handles ? <span>{handles}</span> : null}
                      {conversation.unread ? (
                        <span
                          className="tw-messages-unread-dot"
                          aria-label="Unread conversation"
                        />
                      ) : null}
                    </span>
                    <span className="tw-messages-conversation-preview">
                      {lastMessage
                        ? `${
                            lastMessage.senderId === currentUser.id ? "You: " : ""
                          }${lastMessage.text}`
                        : "Start a conversation"}
                    </span>
                    {lastMessage ? (
                      <span className="tw-messages-conversation-time">
                        {lastMessage.timestamp}
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })
          ) : (
            <EmptyState
              compact
              className="tw-messages-search-empty"
              icon={Search}
              title="No conversations found"
              description={
                searchQuery.trim()
                  ? `Nothing matched “${searchQuery.trim()}”.`
                  : "Your conversations will show up here."
              }
              actionLabel={searchQuery ? "Clear search" : undefined}
              onAction={
                searchQuery
                  ? () => {
                      setSearchQuery("");
                      searchInputRef.current?.focus();
                    }
                  : undefined
              }
            />
          )}
        </div>
      </aside>

      <main className="tw-messages-thread" aria-live="polite">
        {activeConversation ? (
          <>
            <header className="tw-messages-thread-header">
              <button
                type="button"
                className="tw-messages-thread-back"
                aria-label="Back to messages"
                onClick={() => onNavigate("/messages")}
              >
                <ArrowLeft size={21} aria-hidden="true" />
              </button>

              {activePrimaryParticipant ? (
                <button
                  type="button"
                  className="tw-messages-thread-person"
                  onClick={() =>
                    onNavigate(profilePath(activePrimaryParticipant))
                  }
                >
                  <Avatar user={activePrimaryParticipant} size="sm" />
                  <span>
                    <strong>{conversationTitle(activeParticipants)}</strong>
                    <span>{conversationHandle(activeParticipants)}</span>
                  </span>
                </button>
              ) : (
                <div className="tw-messages-thread-person">
                  <strong>Conversation</strong>
                </div>
              )}

              <button
                type="button"
                className="tw-messages-thread-info"
                aria-label="Conversation information"
                title="Conversation information"
                onClick={() =>
                  showToast("Conversation information is coming soon.")
                }
              >
                <Info size={20} aria-hidden="true" />
              </button>
            </header>

            <div className="tw-messages-thread-scroll">
              {activePrimaryParticipant ? (
                <button
                  type="button"
                  className="tw-messages-person-summary"
                  onClick={() =>
                    onNavigate(profilePath(activePrimaryParticipant))
                  }
                >
                  <Avatar user={activePrimaryParticipant} size="lg" />
                  <strong>{conversationTitle(activeParticipants)}</strong>
                  <span>{conversationHandle(activeParticipants)}</span>
                  <p>{activePrimaryParticipant.bio}</p>
                  <small>
                    {numberFormatter(activePrimaryParticipant.followers)} followers
                  </small>
                </button>
              ) : null}

              <div
                className="tw-messages-message-list"
                aria-label={`Conversation with ${conversationTitle(
                  activeParticipants,
                )}`}
              >
                {activeConversation.messages.length > 0 ? (
                  activeConversation.messages.map((message) => {
                    const isOwnMessage = message.senderId === currentUser.id;
                    const sender = getUserById(message.senderId);
                    return (
                      <div
                        className={[
                          "tw-messages-message-row",
                          isOwnMessage ? "is-own" : "is-received",
                        ].join(" ")}
                        key={message.id}
                      >
                        {!isOwnMessage ? (
                          <Avatar
                            user={sender}
                            size="xs"
                            className="tw-messages-message-avatar"
                          />
                        ) : null}
                        <div className="tw-messages-message-copy">
                          <div className="tw-messages-message-bubble">
                            {message.text}
                          </div>
                          <time className="tw-messages-message-time">
                            {message.timestamp}
                          </time>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <EmptyState
                    compact
                    className="tw-messages-thread-empty"
                    icon={Mail}
                    title="Start the conversation"
                    description="Send a message below to say hello."
                  />
                )}
              </div>
            </div>

            <form
              className="tw-messages-composer"
              onSubmit={handleSendMessage}
            >
              <button
                type="button"
                aria-label="Add a photo"
                title="Add a photo"
                onClick={() => showToast("Photo messages are coming soon.")}
              >
                <ImageIcon size={20} aria-hidden="true" />
              </button>
              <label className="tw-messages-composer-field">
                <span>Write a message</span>
                <textarea
                  ref={messageInputRef}
                  rows={1}
                  value={messageDraft}
                  maxLength={1000}
                  placeholder="Start a new message"
                  onChange={(event) => setMessageDraft(event.target.value)}
                  onKeyDown={handleMessageKeyDown}
                />
              </label>
              <button
                type="button"
                aria-label="Add emoji"
                title="Add emoji"
                onClick={() => showToast("Emoji picker is coming soon.")}
              >
                <Smile size={20} aria-hidden="true" />
              </button>
              <button
                type="submit"
                className="tw-messages-send"
                aria-label="Send message"
                disabled={!messageDraft.trim()}
              >
                <Send size={20} aria-hidden="true" />
              </button>
            </form>
          </>
        ) : activeConversationMissing ? (
          <EmptyState
            className="tw-messages-empty"
            icon={Mail}
            title="Conversation not found"
            description="This conversation may no longer be available."
            actionLabel="Back to messages"
            onAction={() => onNavigate("/messages")}
          />
        ) : (
          <EmptyState
            className="tw-messages-empty"
            icon={Mail}
            title="Select a message"
            description="Choose from your existing conversations, or search for someone you know."
            actionLabel="Focus search"
            onAction={() => searchInputRef.current?.focus()}
          />
        )}
      </main>
    </section>
  );
}

function numberFormatter(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export default MessagesView;
