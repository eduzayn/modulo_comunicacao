/**
 * Alert component for displaying notifications and messages
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
        module: "border-module/50 text-module dark:border-module [&>svg]:text-module",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  moduleColor?: { light: string; dark: string };
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, moduleColor, ...props }, ref) => {
    const style: React.CSSProperties = {};
    
    if (variant === 'module' && moduleColor) {
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

export { Alert, alertVariants };
