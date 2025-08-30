import { forwardRef } from "react";
import { clsx } from "clsx";
import { BaseComponentProps } from "@/lib/types";

interface CardProps extends BaseComponentProps {
  variant?: "default" | "interactive" | "selected";
  noPadding?: boolean;
  onClick?: () => void;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, variant = "default", noPadding, onClick, ...props }, ref) => {
    const baseClasses = clsx(
      "bg-white dark:bg-dark-card",
      "rounded-xl shadow-md dark:shadow-dark-md",
      "border border-neutral-200 dark:border-dark-border",
      "transition-all duration-200 ease-out",
      !noPadding && "p-6 tablet:p-8"
    );

    const variants = {
      default: "",
      interactive: clsx(
        "cursor-pointer",
        "hover:shadow-lg dark:hover:shadow-dark-lg",
        "hover:border-primary-300 dark:hover:border-primary-700",
        "hover:-translate-y-0.5"
      ),
      selected: clsx(
        "border-2 border-primary-600 dark:border-primary-500",
        "bg-primary-50 dark:bg-primary-950/20",
        "shadow-lg dark:shadow-dark-lg"
      ),
    };

    const Component = onClick ? "button" : "div";

    return (
      <Component
        ref={ref as any}
        onClick={onClick}
        className={clsx(
          baseClasses,
          variants[variant],
          onClick && "w-full text-left",
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = "Card";

// Card sub-components for better composition
export const CardHeader = forwardRef<HTMLDivElement, BaseComponentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "mb-4 pb-4 border-b border-neutral-200 dark:border-neutral-700",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<HTMLHeadingElement, BaseComponentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={clsx(
          "text-h3 text-neutral-900 dark:text-dark-text-primary",
          className
        )}
        {...props}
      >
        {children}
      </h3>
    );
  }
);

CardTitle.displayName = "CardTitle";

export const CardContent = forwardRef<HTMLDivElement, BaseComponentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={clsx("text-body", className)} {...props}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<HTMLDivElement, BaseComponentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = "CardFooter";