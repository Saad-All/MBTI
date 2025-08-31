"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const inputVariants = cva(
  `
  w-full rounded-lg border bg-surface-primary px-4 py-3
  text-content-primary placeholder:text-content-tertiary
  transition-all duration-200 ease-out
  focus:outline-none focus:ring-2 focus:ring-offset-2
  disabled:cursor-not-allowed disabled:opacity-50
  dark:focus:ring-offset-surface-primary
  `,
  {
    variants: {
      variant: {
        default: `
          border-border-primary hover:border-border-secondary
          focus:border-primary focus:ring-primary
        `,
        error: `
          border-error hover:border-error
          focus:border-error focus:ring-error
        `,
        success: `
          border-success hover:border-success
          focus:border-success focus:ring-success
        `,
      },
      size: {
        sm: "text-sm py-2 px-3",
        md: "text-base py-3 px-4",
        lg: "text-lg py-4 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, variant, size, label, error, success, hint, id, ...props },
    ref
  ) => {
    const inputId = id || props.name;
    const hasError = !!error;
    const hasSuccess = !!success && !hasError;

    const currentVariant = hasError
      ? "error"
      : hasSuccess
      ? "success"
      : variant;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-content-primary mb-2"
          >
            {label}
            {props.required && (
              <span className="text-error ml-1" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={inputVariants({
            variant: currentVariant,
            size,
            className,
          })}
          aria-invalid={hasError}
          aria-describedby={
            hasError
              ? `${inputId}-error`
              : hasSuccess
              ? `${inputId}-success`
              : hint
              ? `${inputId}-hint`
              : undefined
          }
          {...props}
        />

        {(error || success || hint) && (
          <div className="mt-2 text-sm">
            {error && (
              <p id={`${inputId}-error`} className="text-error" role="alert">
                {error}
              </p>
            )}
            {success && !error && (
              <p id={`${inputId}-success`} className="text-success">
                {success}
              </p>
            )}
            {hint && !error && !success && (
              <p id={`${inputId}-hint`} className="text-content-tertiary">
                {hint}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
