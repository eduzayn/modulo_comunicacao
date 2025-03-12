import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/skeleton';
import TestBackupClient from './page.client';

export default function TestBackupPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Backup System Test</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Backup Functionality</CardTitle>
            <CardDescription>Verify that the backup system is working correctly</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
              <TestBackupClient />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
