import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: 
          "border-transparent bg-green-500 text-white hover:bg-green-600",
        warning:
          "border-transparent bg-yellow-500 text-white hover:bg-yellow-600",
        info:
          "border-transparent bg-blue-500 text-white hover:bg-blue-600",
        "subtle-default": 
          "border-transparent bg-primary/15 text-primary hover:bg-primary/25",
        "subtle-secondary": 
          "border-transparent bg-secondary/15 text-secondary-foreground hover:bg-secondary/25",
        "subtle-destructive": 
          "border-transparent bg-red-100 text-red-800 hover:bg-red-200",
        "subtle-success": 
          "border-transparent bg-green-100 text-green-800 hover:bg-green-200",
        "subtle-warning": 
          "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        "subtle-info": 
          "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200",
        "outlined-default": 
          "border-primary bg-transparent text-primary hover:bg-primary/10",
        "outlined-success": 
          "border-green-500 bg-transparent text-green-700 hover:bg-green-50",
        "outlined-warning": 
          "border-yellow-500 bg-transparent text-yellow-700 hover:bg-yellow-50",
        "outlined-info": 
          "border-blue-500 bg-transparent text-blue-700 hover:bg-blue-50",
        "outlined-destructive": 
          "border-red-500 bg-transparent text-red-700 hover:bg-red-50",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[0.625rem]",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
}

function Badge({ 
  className, 
  variant, 
  size,
  dismissible = false,
  onDismiss,
  icon,
  children,
  ...props 
}: BadgeProps) {
  return (
    <div 
      className={cn(
        badgeVariants({ variant, size }), 
        dismissible && "pr-1.5", 
        icon && "pl-1.5",
        className
      )} 
      {...props} 
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
      {dismissible && (
        <button
          type="button"
          className="ml-1 rounded-full p-0.5 hover:bg-background/30"
          onClick={onDismiss}
          aria-label="Remover badge"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}

export { Badge, badgeVariants }
