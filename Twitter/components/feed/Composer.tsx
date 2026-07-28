"use client";

import {
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BarChart3,
  CalendarClock,
  ChevronDown,
  Globe2,
  Image as ImageIcon,
  MapPin,
  Smile,
  X,
} from "lucide-react";

import { Avatar } from "@/components/layout/Avatar";
import type { User } from "@/types";

const DEFAULT_MAX_LENGTH = 280;
const MAX_MEDIA_FILES = 4;

export type ComposerReplyContext =
  | string
  | Pick<User, "id" | "name" | "handle">;

export interface ComposerDraft {
  text: string;
  media: File[];
  replyTo?: ComposerReplyContext;
}

export interface ComposerProps {
  currentUser: User;
  onSubmit: (draft: ComposerDraft) => void | Promise<void>;
  value?: string;
  defaultValue?: string;
  onTextChange?: (text: string) => void;
  onMediaChange?: (files: File[]) => void;
  replyTo?: ComposerReplyContext;
  onCancelReply?: () => void;
  onAudienceClick?: () => void;
  onGifClick?: () => void;
  onPollClick?: () => void;
  onEmojiClick?: () => void;
  onScheduleClick?: () => void;
  onLocationClick?: () => void;
  placeholder?: string;
  submitLabel?: string;
  maxLength?: number;
  autoFocus?: boolean;
  disabled?: boolean;
  submitting?: boolean;
  compact?: boolean;
  error?: string;
  className?: string;
}

interface MediaPreview {
  file: File;
  url: string;
}

function replyHandle(replyTo?: ComposerReplyContext): string | undefined {
  if (!replyTo) {
    return undefined;
  }
  return typeof replyTo === "string" ? replyTo.replace(/^@/, "") : replyTo.handle;
}

function isVideoFile(file: File): boolean {
  return file.type.startsWith("video/");
}

function ComposerIconButton({
  label,
  disabled,
  children,
  onClick,
}: {
  label: string;
  disabled?: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className="tw-composer-tool"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function CharacterCounter({
  length,
  maxLength,
}: {
  length: number;
  maxLength: number;
}) {
  const radius = 9;
  const circumference = 2 * Math.PI * radius;
  const ratio = Math.min(length / maxLength, 1);
  const remaining = maxLength - length;
  const nearLimit = remaining <= 20;
  const overLimit = remaining < 0;

  return (
    <div
      className={[
        "tw-composer-counter",
        nearLimit ? "is-near-limit" : "",
        overLimit ? "is-over-limit" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      role="meter"
      aria-label={`${length} of ${maxLength} characters`}
      aria-valuemin={0}
      aria-valuemax={maxLength}
      aria-valuenow={Math.min(length, maxLength)}
      title={`${remaining} characters remaining`}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle
          className="tw-composer-counter-track"
          cx="12"
          cy="12"
          r={radius}
        />
        <circle
          className="tw-composer-counter-progress"
          cx="12"
          cy="12"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - ratio)}
        />
      </svg>
      {nearLimit && (
        <span className="tw-composer-counter-value">{remaining}</span>
      )}
    </div>
  );
}

export function Composer({
  currentUser,
  onSubmit,
  value,
  defaultValue = "",
  onTextChange,
  onMediaChange,
  replyTo,
  onCancelReply,
  onAudienceClick,
  onGifClick,
  onPollClick,
  onEmojiClick,
  onScheduleClick,
  onLocationClick,
  placeholder,
  submitLabel,
  maxLength = DEFAULT_MAX_LENGTH,
  autoFocus = false,
  disabled = false,
  submitting = false,
  compact = false,
  error,
  className = "",
}: ComposerProps) {
  const [uncontrolledText, setUncontrolledText] = useState(defaultValue);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [localSubmitting, setLocalSubmitting] = useState(false);
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const text = value ?? uncontrolledText;
  const handle = replyHandle(replyTo);
  const isBusy = disabled || submitting || localSubmitting;
  const isOverLimit = text.length > maxLength;
  const canSubmit =
    !isBusy && !isOverLimit && (text.trim().length > 0 || mediaFiles.length > 0);

  const previews = useMemo<MediaPreview[]>(() => {
    const canCreateObjectUrl =
      typeof URL !== "undefined" &&
      typeof URL.createObjectURL === "function";

    return mediaFiles.map((file) => ({
      file,
      url: canCreateObjectUrl ? URL.createObjectURL(file) : "",
    }));
  }, [mediaFiles]);

  useEffect(
    () => () => {
      if (typeof URL.revokeObjectURL !== "function") {
        return;
      }
      previews.forEach((preview) => {
        if (preview.url) {
          URL.revokeObjectURL(preview.url);
        }
      });
    },
    [previews],
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }
    textarea.style.height = "0px";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [text]);

  const setText = (nextText: string) => {
    if (value === undefined) {
      setUncontrolledText(nextText);
    }
    onTextChange?.(nextText);
  };

  const updateMedia = (nextMedia: File[]) => {
    setMediaFiles(nextMedia);
    onMediaChange?.(nextMedia);
  };

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    const room = Math.max(0, MAX_MEDIA_FILES - mediaFiles.length);
    const existingFileKeys = new Set(
      mediaFiles.map(
        (file) => `${file.name}-${file.lastModified}-${file.size}-${file.type}`,
      ),
    );
    const uniqueFiles = selectedFiles.filter((file) => {
      const fileKey = `${file.name}-${file.lastModified}-${file.size}-${file.type}`;
      if (existingFileKeys.has(fileKey)) {
        return false;
      }
      existingFileKeys.add(fileKey);
      return true;
    });

    updateMedia([...mediaFiles, ...uniqueFiles.slice(0, room)]);
    event.target.value = "";
  };

  const removeMedia = (
    event: MouseEvent<HTMLButtonElement>,
    mediaIndex: number,
  ) => {
    event.preventDefault();
    updateMedia(mediaFiles.filter((_, index) => index !== mediaIndex));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    setLocalSubmitting(true);
    try {
      await onSubmit({ text: text.trim(), media: mediaFiles, replyTo });
      if (value === undefined) {
        setUncontrolledText("");
      }
      updateMedia([]);
    } finally {
      setLocalSubmitting(false);
    }
  };

  const composerClassName = [
    "tw-composer",
    compact ? "tw-composer--compact" : "",
    handle ? "tw-composer--reply" : "",
    isBusy ? "is-busy" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <form className={composerClassName} onSubmit={handleSubmit}>
      {handle && (
        <div className="tw-composer-reply-context">
          <span>
            Replying to <strong>@{handle}</strong>
          </span>
          {onCancelReply && (
            <button
              type="button"
              aria-label="Cancel reply"
              title="Cancel reply"
              onClick={onCancelReply}
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      )}

      <div className="tw-composer-grid">
        <div className="tw-composer-avatar">
          <Avatar user={currentUser} size="md" />
        </div>

        <div className="tw-composer-content">
          {!handle && (
            <button
              type="button"
              className="tw-composer-audience"
              aria-label="Choose audience"
              onClick={onAudienceClick}
            >
              Everyone
              <ChevronDown size={14} aria-hidden="true" />
            </button>
          )}

          <textarea
            ref={textareaRef}
            className="tw-composer-textarea"
            value={text}
            rows={1}
            autoFocus={autoFocus}
            disabled={isBusy}
            aria-invalid={isOverLimit || Boolean(error)}
            aria-describedby={error ? `${fileInputId}-error` : undefined}
            placeholder={
              placeholder ?? (handle ? "Post your reply" : "What is happening?!")
            }
            onChange={(event) => setText(event.target.value)}
          />

          {!compact && (
            <button
              type="button"
              className="tw-composer-reply-permission"
              onClick={onAudienceClick}
            >
              <Globe2 size={14} aria-hidden="true" />
              Everyone can reply
            </button>
          )}

          {previews.length > 0 && (
            <div
              className={`tw-composer-media tw-composer-media--${previews.length}`}
            >
              {previews.map((preview, index) => (
                <div
                  className="tw-composer-media-item"
                  key={`${preview.file.name}-${preview.file.lastModified}-${preview.file.size}`}
                >
                  {!preview.url ? (
                    <span className="tw-composer-media-fallback">
                      {preview.file.name}
                    </span>
                  ) : isVideoFile(preview.file) ? (
                    <video
                      src={preview.url}
                      aria-label={`Video preview: ${preview.file.name}`}
                      controls
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={preview.url}
                      alt={`Preview of ${preview.file.name}`}
                    />
                  )}
                  <button
                    type="button"
                    className="tw-composer-media-remove"
                    aria-label={`Remove ${preview.file.name}`}
                    title="Remove"
                    onClick={(event) => removeMedia(event, index)}
                  >
                    <X size={18} aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {error && (
            <p
              id={`${fileInputId}-error`}
              className="tw-composer-error"
              role="alert"
            >
              {error}
            </p>
          )}

          <div className="tw-composer-footer">
            <div className="tw-composer-tools" aria-label="Add to your post">
              <input
                ref={fileInputRef}
                id={fileInputId}
                className="tw-composer-file-input"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
                multiple
                tabIndex={-1}
                aria-hidden="true"
                onChange={handleFiles}
              />
              <ComposerIconButton
                label="Add photos or video"
                disabled={isBusy || mediaFiles.length >= MAX_MEDIA_FILES}
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon size={19} aria-hidden="true" />
              </ComposerIconButton>
              <ComposerIconButton
                label="Add a GIF"
                disabled={isBusy}
                onClick={onGifClick}
              >
                <span className="tw-composer-gif-icon" aria-hidden="true">
                  GIF
                </span>
              </ComposerIconButton>
              <ComposerIconButton
                label="Add a poll"
                disabled={isBusy || mediaFiles.length > 0}
                onClick={onPollClick}
              >
                <BarChart3 size={19} aria-hidden="true" />
              </ComposerIconButton>
              <ComposerIconButton
                label="Add emoji"
                disabled={isBusy}
                onClick={onEmojiClick}
              >
                <Smile size={19} aria-hidden="true" />
              </ComposerIconButton>
              <ComposerIconButton
                label="Schedule post"
                disabled={isBusy || Boolean(handle)}
                onClick={onScheduleClick}
              >
                <CalendarClock size={19} aria-hidden="true" />
              </ComposerIconButton>
              <ComposerIconButton
                label="Add location"
                disabled={isBusy}
                onClick={onLocationClick}
              >
                <MapPin size={19} aria-hidden="true" />
              </ComposerIconButton>
            </div>

            <div className="tw-composer-submit-group">
              {(text.length > 0 || mediaFiles.length > 0) && (
                <CharacterCounter length={text.length} maxLength={maxLength} />
              )}
              <button
                type="submit"
                className="tw-composer-submit"
                disabled={!canSubmit}
              >
                {localSubmitting || submitting
                  ? "Posting…"
                  : submitLabel ?? (handle ? "Reply" : "Post")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default Composer;
