import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle } from "lucide-react"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        default: "h-10 text-sm",
        sm: "h-8 text-xs px-2.5",
        lg: "h-12 text-base"
      },
      variant: {
        default: "border-input",
        error: "border-destructive focus-visible:ring-destructive/50 placeholder:text-destructive/50",
      },
      leftIconPadding: {
        true: "pl-9",
      },
      rightIconPadding: {
        true: "pr-9",
      }
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    }
  }
)

export interface InputProps 
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  wrapperClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    size,
    variant,
    error,
    leftIcon,
    rightIcon,
    leftIconPadding,
    rightIconPadding,
    wrapperClassName,
    ...props 
  }, ref) => {
    // Determinar padding para ícones automaticamente se não for explícito
    const hasLeftIconPadding = leftIconPadding ?? Boolean(leftIcon);
    const hasRightIconPadding = rightIconPadding ?? Boolean(rightIcon || error);
    
    // Definir variante como erro quando há uma mensagem de erro
    const inputVariant = error ? "error" : variant;

    return (
      <div className={cn("relative", wrapperClassName)}>
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}
        
        <input
          type={type}
          className={cn(
            inputVariants({ 
              size, 
              variant: inputVariant,
              leftIconPadding: hasLeftIconPadding, 
              rightIconPadding: hasRightIconPadding,
              className 
            })
          )}
          ref={ref}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
        
        {(rightIcon || error) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {error ? (
              <AlertCircle className="h-4 w-4 text-destructive" />
            ) : (
              rightIcon
            )}
          </div>
        )}
        
        {error && (
          <p
            id={`${props.id}-error`}
            className="mt-1.5 text-xs text-destructive"
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
