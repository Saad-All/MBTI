import { forwardRef } from "react";
import { clsx } from "clsx";
import { BaseComponentProps } from "@/lib/types";

interface ButtonProps extends BaseComponentProps {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  'aria-label'?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      disabled,
      loading,
      fullWidth,
      onClick,
      type = "button",
      ...props
    },
    ref
  ) => {
    // Base classes using design system tokens
    const baseClasses = clsx(
      "inline-flex items-center justify-center",
      "font-medium transition-all duration-200 ease-out",
      "rounded-lg touch-target no-select",
      "focus:outline-none focus:ring-2 focus:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "active:scale-[0.98]",
      fullWidth && "w-full"
    );

    // Variant styles using design system colors
    const variants = {
      primary: clsx(
        "bg-primary-600 text-white",
        "hover:bg-primary-700",
        "focus:ring-primary-500",
        "dark:bg-primary-500 dark:hover:bg-primary-600"
      ),
      secondary: clsx(
        "bg-neutral-200 text-neutral-700",
        "hover:bg-neutral-300",
        "focus:ring-neutral-500",
        "dark:bg-neutral-700 dark:text-neutral-300",
        "dark:hover:bg-neutral-600"
      ),
      accent: clsx(
        "bg-accent-600 text-white",
        "hover:bg-accent-700",
        "focus:ring-accent-500",
        "dark:bg-accent-500 dark:hover:bg-accent-600"
      ),
      outline: clsx(
        "border-2 border-neutral-300 bg-transparent text-neutral-700",
        "hover:bg-neutral-50 hover:border-neutral-400",
        "focus:ring-neutral-500",
        "dark:border-neutral-600 dark:text-neutral-300",
        "dark:hover:bg-neutral-800 dark:hover:border-neutral-500"
      ),
      ghost: clsx(
        "bg-transparent text-neutral-700",
        "hover:bg-neutral-100",
        "focus:ring-neutral-500",
        "dark:text-neutral-300",
        "dark:hover:bg-neutral-800"
      ),
      destructive: clsx(
        "bg-error-600 text-white",
        "hover:bg-error-700",
        "focus:ring-error-500",
        "dark:bg-error-500 dark:hover:bg-error-600"
      ),
    };

    // Size variants using design system spacing
    const sizes = {
      sm: "h-8 px-3 text-small gap-2",
      md: "h-10 px-6 text-body gap-2",
      lg: "h-12 px-8 text-lg gap-3",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        onClick={onClick}
        className={clsx(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";