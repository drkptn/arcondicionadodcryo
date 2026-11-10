"use client";

import type { ReactNode } from "react";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/cn";

const control =
  "peer w-full rounded-2xl border bg-(--field) px-4 pb-2.5 pt-6 text-[0.9375rem] text-fg outline-none transition-[border-color,box-shadow,background-color] duration-300 placeholder:text-transparent focus:border-accent focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--accent)_16%,transparent)]";

type BaseProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
};

function Shell({ id, label, error, hint, optional, className, children }: BaseProps & { children: ReactNode }) {
  return (
    <div className={cn("relative [--field:color-mix(in_srgb,var(--surface)_70%,transparent)]", className)}>
      {children}
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-4 top-2 text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-muted transition-colors peer-focus:text-accent"
      >
        {label}
        {optional && <span className="ml-1.5 normal-case tracking-normal text-muted/70">(opcional)</span>}
      </label>
      {error ? (
        <p id={`${id}-erro`} role="alert" className="mt-1.5 flex items-center gap-1.5 px-1 text-xs font-medium text-(--danger)">
          <span aria-hidden className="inline-block size-1 rounded-full bg-current" />
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-dica`} className="mt-1.5 px-1 text-xs text-muted">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

const describedBy = (id: string, error?: string, hint?: string) => (error ? `${id}-erro` : hint ? `${id}-dica` : undefined);
const borderClass = (error?: string) => (error ? "border-(--danger)" : "border-line-strong hover:border-accent/60");

type InputProps = BaseProps & {
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "tel" | "email";
  autoComplete?: string;
  inputMode?: "text" | "tel" | "email" | "numeric";
  required?: boolean;
  name?: string;
  maxLength?: number;
};

export function TextField({ id, label, error, hint, optional, className, value, onChange, type = "text", required, name, ...rest }: InputProps) {
  return (
    <Shell id={id} label={label} error={error} hint={hint} optional={optional} className={className}>
      <input
        id={id}
        name={name ?? id}
        type={type}
        value={value}
        required={required}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        placeholder={label}
        onChange={(event) => onChange(event.target.value)}
        className={cn(control, "h-[3.75rem]", borderClass(error))}
        {...rest}
      />
    </Shell>
  );
}

type SelectProps = BaseProps & {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
  required?: boolean;
};

export function SelectField({ id, label, error, hint, optional, className, value, onChange, options, placeholder = "Selecione", required }: SelectProps) {
  return (
    <Shell id={id} label={label} error={error} hint={hint} optional={optional} className={className}>
      <select
        id={id}
        name={id}
        value={value}
        required={required}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        onChange={(event) => onChange(event.target.value)}
        className={cn(control, "h-[3.75rem] appearance-none pr-11", !value && "text-muted", borderClass(error))}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-surface text-fg">
            {option}
          </option>
        ))}
      </select>
      <Icon name="chevronDown" size={16} className="pointer-events-none absolute right-4 top-[1.375rem] text-muted" />
    </Shell>
  );
}

type TextAreaProps = BaseProps & {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  maxLength?: number;
};

export function TextAreaField({ id, label, error, hint, optional, className, value, onChange, rows = 4, maxLength }: TextAreaProps) {
  return (
    <Shell id={id} label={label} error={error} hint={hint} optional={optional} className={className}>
      <textarea
        id={id}
        name={id}
        rows={rows}
        value={value}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        placeholder={label}
        onChange={(event) => onChange(event.target.value)}
        className={cn(control, "resize-y pt-7", borderClass(error))}
      />
    </Shell>
  );
}

type ChipGroupProps<T extends string> = {
  legend: string;
  name: string;
  options: readonly { id: T; label: string; hint?: string }[];
  value: T | "";
  onChange: (value: T) => void;
  error?: string;
  columns?: string;
};

/** Grupo de opções em "chips" (rádio acessível). */
export function ChipGroup<T extends string>({ legend, name, options, value, onChange, error, columns = "sm:grid-cols-2" }: ChipGroupProps<T>) {
  return (
    <fieldset>
      <legend className="eyebrow mb-3">{legend}</legend>
      <div className={cn("grid gap-2.5", columns)}>
        {options.map((option) => {
          const checked = value === option.id;
          return (
            <label
              key={option.id}
              className={cn(
                "relative flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3.5 transition-[border-color,background-color,box-shadow] duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent",
                checked
                  ? "border-accent bg-accent/12 shadow-[0_0_0_4px_color-mix(in_srgb,var(--accent)_10%,transparent)]"
                  : "border-line-strong hover:border-accent/60",
              )}
            >
              <input type="radio" name={name} value={option.id} checked={checked} onChange={() => onChange(option.id)} className="sr-only" />
              <span
                aria-hidden
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-full border transition-colors duration-300",
                  checked ? "border-accent bg-accent text-on-accent" : "border-line-strong",
                )}
              >
                {checked && <Icon name="check" size={12} strokeWidth={2.4} />}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-fg">{option.label}</span>
                {option.hint && <span className="block text-xs text-muted">{option.hint}</span>}
              </span>
            </label>
          );
        })}
      </div>
      {error && (
        <p role="alert" className="mt-2 flex items-center gap-1.5 px-1 text-xs font-medium text-(--danger)">
          <span aria-hidden className="inline-block size-1 rounded-full bg-current" />
          {error}
        </p>
      )}
    </fieldset>
  );
}
