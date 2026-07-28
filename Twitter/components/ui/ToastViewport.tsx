"use client";

import {
  CircleAlert,
  CircleCheck,
  Info,
  X,
} from "lucide-react";
import type { ToastMessage } from "@/types";

export type ToastTone = "info" | "success" | "error";

export interface ToastItem extends ToastMessage {
  tone?: ToastTone;
  actionLabel?: string;
}

export interface ToastViewportProps {
  toasts: readonly ToastItem[];
  onDismiss?: (toastId: string) => void;
  onAction?: (toastId: string) => void;
  ariaLabel?: string;
  className?: string;
}

const toneIcons = {
  info: Info,
  success: CircleCheck,
  error: CircleAlert,
} satisfies Record<ToastTone, typeof Info>;

export function ToastViewport({
  toasts,
  onDismiss,
  onAction,
  ariaLabel = "Notifications",
  className = "",
}: ToastViewportProps) {
  if (!toasts.length) {
    return null;
  }

  return (
    <section
      className={["twitter-app-toast-viewport", className]
        .filter(Boolean)
        .join(" ")}
      aria-label={ariaLabel}
      aria-live="polite"
      aria-relevant="additions removals"
    >
      {toasts.map((toast) => {
        const tone = toast.tone ?? "info";
        const ToneIcon = toneIcons[tone];
        return (
          <div
            className={[
              "twitter-app-toast",
              `twitter-app-toast--${tone}`,
            ].join(" ")}
            role={tone === "error" ? "alert" : "status"}
            key={toast.id}
          >
            <ToneIcon
              className="twitter-app-toast-icon"
              size={19}
              aria-hidden="true"
            />
            <p className="twitter-app-toast-message">{toast.message}</p>
            {toast.actionLabel && onAction ? (
              <button
                className="twitter-app-toast-action"
                type="button"
                onClick={() => onAction(toast.id)}
              >
                {toast.actionLabel}
              </button>
            ) : null}
            {onDismiss ? (
              <button
                className="twitter-app-toast-dismiss"
                type="button"
                aria-label="Dismiss notification"
                onClick={() => onDismiss(toast.id)}
              >
                <X size={17} aria-hidden="true" />
              </button>
            ) : null}
          </div>
        );
      })}
    </section>
  );
}
