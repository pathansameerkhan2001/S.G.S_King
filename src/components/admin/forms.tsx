"use client";

import { Download, Loader2, Trash2 } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { useFormStatus } from "react-dom";

import { dangerButton, primaryButton, secondaryButton } from "./ui";

export type ActionState = { ok?: boolean; message?: string; errors?: Record<string, string> };
export const initialActionState: ActionState = {};

/** Submit button; pending state comes from the form status or an explicit prop (manual dispatch). */
export function SubmitButton({ children, className = primaryButton, pending: pendingProp }: { children: ReactNode; className?: string; pending?: boolean }) {
  const status = useFormStatus();
  const pending = pendingProp ?? status.pending;
  return (
    <button type="submit" disabled={pending} aria-busy={pending || undefined} className={className}>
      {pending && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
      {children}
    </button>
  );
}

/** Form-level message (success / error) announced to screen readers. */
export function FormMessage({ state }: { state: ActionState }) {
  if (!state.message && !state.errors?._form) return null;
  const error = !state.ok;
  return (
    <p role={error ? "alert" : "status"} className={`rounded-xl px-4 py-3 font-sans text-sm font-semibold ${error ? "bg-[#fde8e6] text-burgundy" : "bg-[#e7f4ea] text-[#2f7a3d]"}`}>
      {state.errors?._form ?? state.message}
    </p>
  );
}

export function FieldError({ state, name }: { state: ActionState; name: string }) {
  const message = state.errors?.[name];
  if (!message) return null;
  return (
    <p id={`${name}-error`} className="mt-1 font-sans text-xs font-semibold text-burgundy">
      {message}
    </p>
  );
}

export const inputClass =
  "h-11 w-full rounded-xl border border-gold/45 bg-white/70 px-3 font-sans text-sm text-ink focus:border-burgundy focus:outline-none focus:ring-2 focus:ring-gold/40 aria-[invalid=true]:border-burgundy";
export const labelClass = "mb-1 block font-sans text-xs font-semibold uppercase tracking-[0.08em] text-umber";

export function Toggle({ name, label, defaultChecked, checked, onChange }: { name?: string; label: string; defaultChecked?: boolean; checked?: boolean; onChange?: (v: boolean) => void }) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-2.5 font-sans text-sm text-ink">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        checked={checked}
        onChange={onChange ? (e) => onChange(e.target.checked) : undefined}
        className="size-4 accent-[#650a16]"
      />
      {label}
    </label>
  );
}

/**
 * Destructive action guarded by a confirmation dialog (native <dialog>:
 * focus trap, Escape to cancel). The confirm button submits `action`.
 */
export function ConfirmSubmit({
  action,
  label,
  title,
  description,
  hidden,
  confirmLabel = "Delete",
  compact = false,
  icon = "delete",
}: {
  action: (formData: FormData) => void | Promise<void>;
  label: string;
  title: string;
  description: string;
  hidden: Record<string, string | number>;
  confirmLabel?: string;
  compact?: boolean;
  icon?: "delete" | "import";
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const Icon = icon === "import" ? Download : Trash2;
  return (
    <>
      <button type="button" onClick={() => ref.current?.showModal()} className={compact ? "grid size-10 place-items-center rounded-xl text-burgundy hover:bg-[#fde8e6]" : icon === "import" ? secondaryButton : dangerButton} aria-label={compact ? label : undefined}>
        <Icon aria-hidden="true" className="size-4" />
        {!compact && label}
      </button>
      <dialog
        ref={ref}
        aria-labelledby="confirm-title"
        className="m-auto w-[min(92vw,440px)] rounded-2xl border border-gold/40 bg-ivory p-0 shadow-card backdrop:bg-ink/50"
      >
        <form action={action} className="p-6">
          {Object.entries(hidden).map(([k, v]) => (
            <input key={k} type="hidden" name={k} value={v} />
          ))}
          <h2 id="confirm-title" className="font-display text-[1.5rem] font-bold text-burgundy">
            {title}
          </h2>
          <p className="mt-2 font-sans text-sm text-ink/85">{description}</p>
          <div className="mt-6 flex justify-end gap-2">
            <button type="button" onClick={() => ref.current?.close()} className={secondaryButton} autoFocus>
              Cancel
            </button>
            <SubmitButton className={primaryButton}>{confirmLabel}</SubmitButton>
          </div>
        </form>
      </dialog>
    </>
  );
}
