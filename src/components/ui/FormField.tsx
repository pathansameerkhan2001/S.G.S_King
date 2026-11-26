import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const control =
  "w-full rounded-xl border bg-ivory px-3.5 font-sans text-[0.95rem] text-ink placeholder:text-umber/60 focus:outline-none focus:ring-2 focus:ring-gold/40 aria-[invalid=true]:border-burgundy aria-[invalid=true]:bg-[#fff5f5]";

type FieldShellProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
};

function FieldShell({ id, label, error, hint, required, className = "", children }: FieldShellProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block font-sans text-[0.82rem] font-semibold text-ink">
        {label}
        {required ? <span aria-hidden="true" className="text-burgundy"> *</span> : <span className="font-normal text-umber"> (optional)</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1 font-sans text-xs text-umber">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1 font-sans text-xs font-semibold text-burgundy">
          {error}
        </p>
      )}
    </div>
  );
}

const describedBy = (id: string, error?: string, hint?: string) => (error ? `${id}-error` : hint ? `${id}-hint` : undefined);

type InputFieldProps = Omit<FieldShellProps, "children"> & InputHTMLAttributes<HTMLInputElement>;

export function InputField({ id, label, error, hint, required, className, ...input }: InputFieldProps) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required} className={className}>
      <input
        id={id}
        name={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={`${control} h-12 border-gold/45 focus:border-burgundy`}
        {...input}
      />
    </FieldShell>
  );
}

type TextareaFieldProps = Omit<FieldShellProps, "children"> & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextareaField({ id, label, error, hint, required, className, ...input }: TextareaFieldProps) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required} className={className}>
      <textarea
        id={id}
        name={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={`${control} min-h-36 border-gold/45 py-3 focus:border-burgundy`}
        {...input}
      />
    </FieldShell>
  );
}

type SelectFieldProps = Omit<FieldShellProps, "children"> & SelectHTMLAttributes<HTMLSelectElement> & { options: string[] };

export function SelectField({ id, label, error, hint, required, className, options, ...input }: SelectFieldProps) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required} className={className}>
      <select
        id={id}
        name={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={`${control} h-12 border-gold/45 focus:border-burgundy`}
        {...input}
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}
