import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface StatsCardProps {
  title: string
  value: string | number | ReactNode
  description?: string
  icon?: ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
  testId?: string
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
  testId
}: StatsCardProps) {
  return (
    <Card className={cn("", className)} data-testid={testId}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon && (
          <div className="h-4 w-4 text-muted-foreground">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
        {trend && (
          <div className={cn(
            "mt-2 flex items-center text-xs",
            trend.isPositive ? "text-green-600" : "text-red-600"
          )}>
            <span className="mr-1">
              {trend.isPositive ? "↑" : "↓"}
            </span>
            {trend.value}%
          </div>
        )}
      </CardContent>
    </Card>
  )
} 