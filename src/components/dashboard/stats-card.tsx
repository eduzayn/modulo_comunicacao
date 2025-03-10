'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  change?: number;
  changeLabel?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  change,
  changeLabel,
}: StatsCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || change) && (
          <p className="text-xs text-muted-foreground">
            {description}
            {change && (
              <span className={`inline-flex items-center ml-2 ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-500'}`}>
                {isPositive && <ArrowUpIcon className="h-3 w-3 mr-1" />}
                {isNegative && <ArrowDownIcon className="h-3 w-3 mr-1" />}
                {Math.abs(change)}% {changeLabel || ''}
              </span>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
