import { forwardRef } from "react";
import { clsx } from "clsx";
import { BaseComponentProps } from "@/lib/types";

// Heading Components
export const H1 = forwardRef<HTMLHeadingElement, BaseComponentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h1
        ref={ref}
        className={clsx(
          "text-h1 text-neutral-900 dark:text-dark-text-primary",
          "mb-4",
          className
        )}
        {...props}
      >
        {children}
      </h1>
    );
  }
);

H1.displayName = "H1";

export const H2 = forwardRef<HTMLHeadingElement, BaseComponentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h2
        ref={ref}
        className={clsx(
          "text-h2 text-neutral-900 dark:text-dark-text-primary",
          "mb-3",
          className
        )}
        {...props}
      >
        {children}
      </h2>
    );
  }
);

H2.displayName = "H2";

export const H3 = forwardRef<HTMLHeadingElement, BaseComponentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={clsx(
          "text-h3 text-neutral-900 dark:text-dark-text-primary",
          "mb-2",
          className
        )}
        {...props}
      >
        {children}
      </h3>
    );
  }
);

H3.displayName = "H3";

// Text Components
interface TextProps extends BaseComponentProps {
  variant?: "body" | "small" | "muted" | "error" | "success";
  as?: "p" | "span" | "div";
}

export const Text = forwardRef<HTMLElement, TextProps>(
  ({ className, children, variant = "body", as: Component = "p", ...props }, ref) => {
    const variants = {
      body: "text-body text-neutral-700 dark:text-dark-text-secondary",
      small: "text-small text-neutral-600 dark:text-dark-text-muted",
      muted: "text-body text-neutral-500 dark:text-neutral-400",
      error: "text-body text-error-600 dark:text-error-400",
      success: "text-body text-success-600 dark:text-success-400",
    };

    return (
      <Component
        ref={ref as any}
        className={clsx(variants[variant], className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Text.displayName = "Text";

// Label Component
interface LabelProps extends BaseComponentProps {
  htmlFor?: string;
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={clsx(
          "block text-small font-medium text-neutral-700 dark:text-neutral-300",
          "mb-2",
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-error-600 dark:text-error-400 ms-1">*</span>}
      </label>
    );
  }
);

Label.displayName = "Label";

// MBTI Code Component (Always LTR)
interface MBTICodeProps extends BaseComponentProps {
  code: string;
  size?: "small" | "medium" | "large";
}

export const MBTICode = forwardRef<HTMLSpanElement, MBTICodeProps>(
  ({ className, code, size = "medium", ...props }, ref) => {
    const sizes = {
      small: "text-lg",
      medium: "text-h3",
      large: "text-h1",
    };

    return (
      <span
        ref={ref}
        className={clsx(
          "mbti-code",
          sizes[size],
          "font-mono tracking-wider",
          "text-primary-600 dark:text-primary-400",
          className
        )}
        dir="ltr"
        {...props}
      >
        {code}
      </span>
    );
  }
);

MBTICode.displayName = "MBTICode";

// Small text component for convenience
export const Small = forwardRef<HTMLElement, Omit<TextProps, 'variant'>>(
  ({ ...props }, ref) => {
    return <Text ref={ref} variant="small" {...props} />;
  }
);

Small.displayName = "Small";