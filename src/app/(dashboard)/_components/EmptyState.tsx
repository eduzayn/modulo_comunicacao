import React from 'react';
import { Card, CardContent } from "../../../components/ui/card";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  height?: string;
}

export function EmptyState({ 
  title, 
  description, 
  icon, 
  height = "h-[400px]" 
}: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className={`${height} flex flex-col items-center justify-center p-6 text-center`}>
        {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-md">{description}</p>
      </CardContent>
    </Card>
  );
} 