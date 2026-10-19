import type * as React from "react";
import { cn } from "../../lib/utils";
import { Button } from "./button";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export function Dialog({ isOpen, onClose, title, description, className, children }: DialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" aria-modal="true" role="dialog">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          "relative bg-[var(--pw-card)] border border-[var(--pw-border)] rounded-[var(--pw-radius)] shadow-lg w-full max-w-lg mx-4 p-6 text-[var(--pw-text)]",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h2 className="text-lg font-semibold text-[var(--pw-text)] mb-2">{title}</h2>}
        {description && <p className="text-sm text-[var(--pw-text-muted)] mb-6">{description}</p>}
        <div className="flex justify-end space-x-3">{children}</div>
      </div>
    </div>
  );
}

interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "default" | "danger";
}

export function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "default",
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <Dialog isOpen={true} onClose={onCancel} title={title} description={message}>
      <Button variant="ghost" size="sm" onClick={onCancel}>
        {cancelText}
      </Button>
      <Button
        variant={confirmVariant === "danger" ? "danger" : "primary"}
        size="sm"
        onClick={onConfirm}
      >
        {confirmText}
      </Button>
    </Dialog>
  );
}
