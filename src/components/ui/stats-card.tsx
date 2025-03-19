import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatsCardProps {
  title: string
  value: string | number
  icon: ReactNode
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  module?: 'communication' | 'student' | 'content' | 'enrollment'
}

export function StatsCard({ 
  title, 
  value, 
  icon, 
  description, 
  trend, 
  module = 'communication' 
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <div className={cn(
          'rounded-full p-2',
          {
            'bg-communication/10 text-communication': module === 'communication',
            'bg-student/10 text-student': module === 'student',
            'bg-content/10 text-content': module === 'content',
            'bg-enrollment/10 text-enrollment': module === 'enrollment',
          }
        )}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
            {trend && (
              <span className={cn(
                'ml-2 font-medium',
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              )}>
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  )
} 