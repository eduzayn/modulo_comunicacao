"use client";

import React from "react";
import { cn } from "./utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  module?: "communication" | "student" | "content" | "enrollment";
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, module = "communication", variant = "default", size = "default", ...props }, ref) => {
    // Module-specific colors
    const moduleColors = {
      communication: {
        default: "bg-blue-500 hover:bg-blue-600 text-white",
        secondary: "bg-blue-100 hover:bg-blue-200 text-blue-700",
        outline: "border border-blue-500 text-blue-500 hover:bg-blue-50",
        destructive: "bg-red-500 hover:bg-red-600 text-white",
      },
      student: {
        default: "bg-green-500 hover:bg-green-600 text-white",
        secondary: "bg-green-100 hover:bg-green-200 text-green-700",
        outline: "border border-green-500 text-green-500 hover:bg-green-50",
        destructive: "bg-red-500 hover:bg-red-600 text-white",
      },
      content: {
        default: "bg-purple-500 hover:bg-purple-600 text-white",
        secondary: "bg-purple-100 hover:bg-purple-200 text-purple-700",
        outline: "border border-purple-500 text-purple-500 hover:bg-purple-50",
        destructive: "bg-red-500 hover:bg-red-600 text-white",
      },
      enrollment: {
        default: "bg-amber-500 hover:bg-amber-600 text-white",
        secondary: "bg-amber-100 hover:bg-amber-200 text-amber-700",
        outline: "border border-amber-500 text-amber-500 hover:bg-amber-50",
        destructive: "bg-red-500 hover:bg-red-600 text-white",
      },
    };

    // Variant styles
    const variantStyles = {
      default: moduleColors[module].default,
      secondary: moduleColors[module].secondary,
      outline: moduleColors[module].outline,
      ghost: "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300",
      link: "text-blue-500 dark:text-blue-400 underline-offset-4 hover:underline",
      destructive: moduleColors[module].destructive,
    };

    // Size styles
    const sizeStyles = {
      default: "h-10 px-4 py-2 text-sm",
      sm: "h-8 px-3 text-xs",
      lg: "h-12 px-6 text-base",
      icon: "h-10 w-10",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export default Button;
