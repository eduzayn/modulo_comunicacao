import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    label: string
    positive?: boolean
  }
  className?: string
  onClick?: () => void
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
  onClick,
}: StatsCardProps) {
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all", 
        onClick && "cursor-pointer hover:shadow-md",
        className
      )} 
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="h-5 w-5 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <div className="mt-1 flex items-center text-xs">
            {trend && (
              <span 
                className={`mr-1 inline-flex items-center rounded-md px-1 py-0.5 font-medium ${
                  trend.positive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                }`}
              >
                {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            )}
            {description && (
              <span className="text-muted-foreground">{description}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 