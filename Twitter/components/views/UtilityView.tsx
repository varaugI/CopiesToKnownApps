"use client";

import {
  type FormEvent,
  useState,
} from "react";
import {
  BadgeCheck,
  Bell,
  Bot,
  Check,
  ChevronRight,
  Crown,
  Eye,
  Image as ImageIcon,
  KeyRound,
  List,
  LockKeyhole,
  MessageCircle,
  Palette,
  Pin,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { useTwitter } from "@/components/AppContext";
import { PageHeader } from "@/components/layout/PageHeader";

export type UtilityViewKind = "premium" | "grok" | "lists" | "settings";

export interface UtilityViewProps {
  kind: UtilityViewKind;
  onNavigate: (path: string) => void;
  onBack?: () => void;
}

interface UtilityFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const PREMIUM_FEATURES: UtilityFeature[] = [
  {
    icon: BadgeCheck,
    title: "Stand out in replies",
    description: "Get a verified badge and prioritized replies.",
  },
  {
    icon: Zap,
    title: "Create more",
    description: "Write longer posts and upload longer videos.",
  },
  {
    icon: Eye,
    title: "See less noise",
    description: "Enjoy fewer ads and more control over your feed.",
  },
];

const LISTS = [
  {
    id: "design",
    title: "Design worth studying",
    description: "Product craft, thoughtful interfaces, and useful systems.",
    members: "142 members",
    followers: "8.4K followers",
  },
  {
    id: "technology",
    title: "Calm technology",
    description: "Clear reporting and practical conversations about tech.",
    members: "87 members",
    followers: "5.1K followers",
  },
  {
    id: "weekend",
    title: "The weekend list",
    description: "Photography, trails, books, food, and places to wander.",
    members: "64 members",
    followers: "3.7K followers",
  },
] as const;

const SETTINGS_GROUPS: ReadonlyArray<{
  title: string;
  items: ReadonlyArray<{
    id: string;
    label: string;
    description: string;
    icon: LucideIcon;
  }>;
}> = [
  {
    title: "Your account",
    items: [
      {
        id: "account",
        label: "Account information",
        description: "Review your profile, email, and account creation data.",
        icon: UserRound,
      },
      {
        id: "security",
        label: "Security and account access",
        description: "Manage sign-in methods, apps, and active sessions.",
        icon: KeyRound,
      },
    ],
  },
  {
    title: "Your experience",
    items: [
      {
        id: "privacy",
        label: "Privacy and safety",
        description: "Control the information you see and share.",
        icon: ShieldCheck,
      },
      {
        id: "notifications",
        label: "Notifications",
        description: "Choose which activities can interrupt you.",
        icon: Bell,
      },
      {
        id: "accessibility",
        label: "Accessibility and display",
        description: "Adjust contrast, motion, type, and appearance.",
        icon: Palette,
      },
    ],
  },
];

function FeatureGrid({ features }: { features: UtilityFeature[] }) {
  return (
    <div className="tw-utility-feature-grid">
      {features.map((feature) => {
        const Icon = feature.icon;
        return (
          <article className="tw-utility-feature-card" key={feature.title}>
            <span className="tw-utility-feature-icon" aria-hidden="true">
              <Icon size={22} />
            </span>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </article>
        );
      })}
    </div>
  );
}

function PremiumContent({
  onNavigate,
}: Pick<UtilityViewProps, "onNavigate">) {
  return (
    <>
      <section className="tw-utility-hero tw-utility-premium-hero">
        <span className="tw-utility-hero-icon" aria-hidden="true">
          <Crown size={34} />
        </span>
        <span className="tw-utility-kicker">Chirp Premium</span>
        <h2>More signal. More ways to create.</h2>
        <p>
          Unlock the tools that make conversations easier to follow and your
          work easier to share.
        </p>
        <button
          type="button"
          className="tw-utility-primary-action"
          onClick={() => onNavigate("/premium/subscribe")}
        >
          Upgrade
        </button>
      </section>

      <FeatureGrid features={PREMIUM_FEATURES} />

      <section className="tw-utility-card tw-premium-plan">
        <div>
          <span className="tw-utility-kicker">Most popular</span>
          <h3>Premium</h3>
          <p>Everything you need to participate, publish, and be discovered.</p>
        </div>
        <div className="tw-premium-price">
          <strong>₹650</strong>
          <span>/ month</span>
        </div>
        <ul>
          <li>
            <Check size={16} aria-hidden="true" /> Verification badge
          </li>
          <li>
            <Check size={16} aria-hidden="true" /> Edit posts and longer posts
          </li>
          <li>
            <Check size={16} aria-hidden="true" /> Fewer ads in your timelines
          </li>
        </ul>
        <button
          type="button"
          className="tw-utility-secondary-action"
          onClick={() => onNavigate("/premium/subscribe")}
        >
          View all plans
        </button>
      </section>
    </>
  );
}

function GrokContent() {
  const { showToast } = useTwitter();
  const [prompt, setPrompt] = useState("");
  const suggestions = [
    "Catch me up on today’s technology news",
    "What are people saying about design systems?",
    "Help me write a concise launch post",
  ];

  const submitPrompt = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!prompt.trim()) {
      showToast("Ask a question to start a conversation.");
      return;
    }
    showToast("AI chat is a polished demo in this clone.");
  };

  return (
    <>
      <section className="tw-utility-hero tw-grok-hero">
        <span className="tw-utility-hero-icon" aria-hidden="true">
          <Sparkles size={34} />
        </span>
        <span className="tw-utility-kicker">AI assistant</span>
        <h2>Understand what’s happening, faster.</h2>
        <p>
          Ask about live conversations, explore an idea, or get help shaping
          your next post.
        </p>
      </section>

      <form className="tw-grok-prompt" onSubmit={submitPrompt}>
        <label className="tw-visually-hidden" htmlFor="tw-grok-prompt-input">
          Ask anything
        </label>
        <textarea
          id="tw-grok-prompt-input"
          value={prompt}
          rows={3}
          placeholder="Ask anything"
          onChange={(event) => setPrompt(event.currentTarget.value)}
        />
        <div className="tw-grok-prompt-footer">
          <div>
            <button
              type="button"
              aria-label="Attach an image"
              title="Attach an image"
              onClick={() => showToast("Image attachments are coming soon.")}
            >
              <ImageIcon size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Search posts"
              title="Search posts"
              onClick={() => showToast("Live search is represented in this demo.")}
            >
              <Search size={18} aria-hidden="true" />
            </button>
          </div>
          <button
            type="submit"
            className="tw-utility-primary-action"
            disabled={!prompt.trim()}
          >
            Ask
          </button>
        </div>
      </form>

      <section className="tw-grok-suggestions" aria-labelledby="tw-grok-ideas">
        <h3 id="tw-grok-ideas">Try asking</h3>
        <div>
          {suggestions.map((suggestion) => (
            <button
              type="button"
              onClick={() => setPrompt(suggestion)}
              key={suggestion}
            >
              <MessageCircle size={17} aria-hidden="true" />
              <span>{suggestion}</span>
              <ChevronRight size={17} aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>

      <FeatureGrid
        features={[
          {
            icon: Search,
            title: "Search conversations",
            description: "Turn a fast-moving timeline into a useful summary.",
          },
          {
            icon: Bot,
            title: "Think through ideas",
            description: "Brainstorm, rewrite, and refine without leaving Chirp.",
          },
          {
            icon: ImageIcon,
            title: "Work with images",
            description: "Explore visual concepts from a simple description.",
          },
        ]}
      />
    </>
  );
}

function ListsContent({
  onNavigate,
}: Pick<UtilityViewProps, "onNavigate">) {
  const { showToast } = useTwitter();

  return (
    <>
      <section className="tw-utility-hero tw-lists-hero">
        <span className="tw-utility-hero-icon" aria-hidden="true">
          <List size={32} />
        </span>
        <span className="tw-utility-kicker">Curate your timeline</span>
        <h2>Keep the conversations you care about together.</h2>
        <p>
          Lists create focused feeds from selected accounts without changing
          who you follow.
        </p>
        <button
          type="button"
          className="tw-utility-primary-action"
          onClick={() => showToast("Your new list composer is ready soon.")}
        >
          <Plus size={18} aria-hidden="true" />
          New List
        </button>
      </section>

      <section className="tw-utility-section" aria-labelledby="tw-pinned-lists">
        <div className="tw-utility-section-heading">
          <div>
            <span className="tw-utility-kicker">Suggested for you</span>
            <h2 id="tw-pinned-lists">Discover Lists</h2>
          </div>
          <Pin size={19} aria-hidden="true" />
        </div>
        <div className="tw-list-card-grid">
          {LISTS.map((list) => (
            <button
              type="button"
              className="tw-list-card"
              onClick={() => onNavigate(`/lists/${list.id}`)}
              key={list.id}
            >
              <span className="tw-list-card-icon" aria-hidden="true">
                <Users size={22} />
              </span>
              <strong>{list.title}</strong>
              <span>{list.description}</span>
              <span className="tw-list-card-meta">
                {list.members} · {list.followers}
              </span>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}

function SettingsContent({
  onNavigate,
}: Pick<UtilityViewProps, "onNavigate">) {
  const { currentUser, theme, toggleTheme } = useTwitter();

  return (
    <>
      <section className="tw-settings-account-summary">
        <span className="tw-settings-account-icon" aria-hidden="true">
          <Settings size={24} />
        </span>
        <div>
          <strong>{currentUser.name}</strong>
          <span>@{currentUser.handle}</span>
        </div>
        <span>Signed in</span>
      </section>

      {SETTINGS_GROUPS.map((group) => (
        <section
          className="tw-settings-group"
          aria-labelledby={`tw-settings-${group.title
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
          key={group.title}
        >
          <h2
            id={`tw-settings-${group.title.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {group.title}
          </h2>
          <div className="tw-settings-list">
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  type="button"
                  onClick={() => onNavigate(`/settings/${item.id}`)}
                  key={item.id}
                >
                  <span className="tw-settings-item-icon" aria-hidden="true">
                    <Icon size={20} />
                  </span>
                  <span className="tw-settings-item-copy">
                    <strong>{item.label}</strong>
                    <span>{item.description}</span>
                  </span>
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </section>
      ))}

      <section className="tw-utility-card tw-settings-appearance">
        <span className="tw-settings-item-icon" aria-hidden="true">
          <Palette size={20} />
        </span>
        <div>
          <strong>Dark mode</strong>
          <span>Use a pure-black theme for lower-light environments.</span>
        </div>
        <button
          type="button"
          className="tw-settings-toggle"
          role="switch"
          aria-checked={theme === "dark"}
          onClick={toggleTheme}
        >
          <span />
        </button>
      </section>

      <section className="tw-settings-security-note">
        <LockKeyhole size={18} aria-hidden="true" />
        <p>
          This demo stores preferences locally in your browser. It never asks
          for or sends credentials to another service.
        </p>
      </section>
    </>
  );
}

const TITLES: Record<UtilityViewKind, string> = {
  premium: "Premium",
  grok: "Grok",
  lists: "Lists",
  settings: "Settings",
};

export function UtilityView({
  kind,
  onNavigate,
  onBack,
}: UtilityViewProps) {
  return (
    <section
      className={`tw-view tw-utility-view tw-utility-view--${kind}`}
      aria-label={TITLES[kind]}
    >
      <PageHeader title={TITLES[kind]} onBack={onBack} />
      <div className="tw-utility-content">
        {kind === "premium" && <PremiumContent onNavigate={onNavigate} />}
        {kind === "grok" && <GrokContent />}
        {kind === "lists" && <ListsContent onNavigate={onNavigate} />}
        {kind === "settings" && <SettingsContent onNavigate={onNavigate} />}
      </div>
    </section>
  );
}

export default UtilityView;
