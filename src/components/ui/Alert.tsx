/**
 * Alert.tsx
 * 
 * Description: Alert component for displaying messages with different variants.
 * 
 * @module components/ui/Alert
 * @author Devin AI
 * @created 2025-03-12
 */
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';
// Import colors with semantic properties
import { colors } from './colors';

// Define semantic colors if they don't exist in the imported colors
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
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success: "border-success/50 text-success dark:border-success [&>svg]:text-success",
        warning: "border-warning/50 text-warning dark:border-warning [&>svg]:text-warning",
        error: "border-error/50 text-error dark:border-error [&>svg]:text-error",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants> & { module?: string }
>(({ className, variant, module, style = {}, ...props }, ref) => {
    // Apply custom styling based on variant and module
    if (module) {
      const moduleColor = colors.modules[module] || colors.modules.default;
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
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        style={style}
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
