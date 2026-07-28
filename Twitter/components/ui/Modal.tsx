"use client";

import {
  useEffect,
  useId,
  useRef,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { X } from "lucide-react";

export type ModalSize = "sm" | "md" | "lg" | "full";

export interface ModalProps {
  open: boolean;
  title: ReactNode;
  children: ReactNode;
  onClose: () => void;
  description?: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  closeLabel?: string;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  lockScroll?: boolean;
  initialFocusRef?: RefObject<HTMLElement | null>;
  className?: string;
}

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
  "[contenteditable='true']",
].join(",");

export function Modal({
  open,
  title,
  children,
  onClose,
  description,
  footer,
  size = "md",
  closeLabel = "Close dialog",
  closeOnBackdrop = true,
  closeOnEscape = true,
  lockScroll = true,
  initialFocusRef,
  className = "",
}: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }
    const activeDialog: HTMLDivElement = dialog;

    previousActiveElementRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const bodyOverflow = document.body.style.overflow;
    if (lockScroll) {
      document.body.style.overflow = "hidden";
    }

    const focusFrame = window.requestAnimationFrame(() => {
      const firstFocusable =
        initialFocusRef?.current ??
        activeDialog.querySelector<HTMLElement>(focusableSelector);
      (firstFocusable ?? activeDialog).focus();
    });

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && closeOnEscape) {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = Array.from(
        activeDialog.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter(
        (element) =>
          !element.hasAttribute("disabled") &&
          element.getAttribute("aria-hidden") !== "true",
      );

      if (!focusableElements.length) {
        event.preventDefault();
        activeDialog.focus();
        return;
      }

      const firstElement = focusableElements[0]!;
      const lastElement = focusableElements[focusableElements.length - 1]!;
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === lastElement
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      if (lockScroll) {
        document.body.style.overflow = bodyOverflow;
      }
      previousActiveElementRef.current?.focus();
    };
  }, [
    closeOnEscape,
    initialFocusRef,
    lockScroll,
    onClose,
    open,
  ]);

  if (!open) {
    return null;
  }

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (closeOnBackdrop && event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className="twitter-app-modal-backdrop"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        className={[
          "twitter-app-modal",
          `twitter-app-modal--${size}`,
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
      >
        <header className="twitter-app-modal-header">
          <h2 className="twitter-app-modal-title" id={titleId}>
            {title}
          </h2>
          <button
            className="twitter-app-modal-close"
            type="button"
            aria-label={closeLabel}
            onClick={onClose}
          >
            <X size={21} aria-hidden="true" />
          </button>
        </header>
        {description ? (
          <div className="twitter-app-modal-description" id={descriptionId}>
            {description}
          </div>
        ) : null}
        <div className="twitter-app-modal-body">{children}</div>
        {footer ? (
          <footer className="twitter-app-modal-footer">{footer}</footer>
        ) : null}
      </div>
    </div>
  );
}
