/**
 * Alert component for displaying notifications and messages
 */

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';
import { colors } from './colors';

// Define semantic colors for the component
const semanticColors = {
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444'
};

const alertVariants = cva(
  "relative w-full rounded-lg border p-4",
  {
    variants: {
      variant: {
        default: "bg-white border-neutral-200 text-neutral-950",
        destructive: "border-red-500/50 text-red-500 dark:border-red-500 [&>svg]:text-red-500",
        success: "border-green-500/50 text-green-500 dark:border-green-500 [&>svg]:text-green-500",
        warning: "border-yellow-500/50 text-yellow-500 dark:border-yellow-500 [&>svg]:text-yellow-500",
        info: "border-blue-500/50 text-blue-500 dark:border-blue-500 [&>svg]:text-blue-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  module?: string;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", module, ...props }, ref) => {
    const style: React.CSSProperties = {};
    
    // Apply module-specific or semantic colors
    if (module && colors.primary[module as keyof typeof colors.primary]) {
      const moduleColor = colors.primary[module as keyof typeof colors.primary];
      style.backgroundColor = `${moduleColor.light}10`; // 10% opacity
      style.borderColor = moduleColor.light;
    } else if (variant === 'success') {
      style.backgroundColor = `${semanticColors.success}10`; // 10% opacity
      style.borderColor = semanticColors.success;
    } else if (variant === 'warning') {
      style.backgroundColor = `${semanticColors.warning}10`; // 10% opacity
      style.borderColor = semanticColors.warning;
    } else if (variant === 'error') {
      style.backgroundColor = `${semanticColors.error}10`; // 10% opacity
      style.borderColor = semanticColors.error;
    }
    
    return (
      <div
        ref={ref}
        style={style}
        className={cn(alertVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
