"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-button text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary-500 text-white shadow-soft hover:bg-primary-600 hover:shadow-card",
        secondary: "bg-surface-muted text-content-primary hover:bg-stone-300",
        outline: "border border-stone-300 bg-surface-elevated text-content-primary hover:bg-surface-muted",
        ghost: "text-content-secondary hover:bg-surface-muted hover:text-content-primary",
        link: "text-primary-600 underline-offset-4 hover:underline",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        emergency: "bg-emergency-red text-white hover:bg-red-700",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-button px-3 text-sm",
        lg: "h-12 rounded-button px-8 text-base font-semibold",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
