'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/progress';

export default function TestBackupClient() {
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState({
    includeMessages: true,
    includeAttachments: false,
    format: 'json',
    compressionLevel: 5,
  });

  async function runBackupTest() {
    try {
      setLoading(true);
      setError(null);
      
      // Initialize backup system first
      const initResponse = await fetch('/api/communication/backups/init', {
        method: 'POST',
      });
      
      if (!initResponse.ok) {
        const initData = await initResponse.json();
        throw new Error(`Failed to initialize backup system: ${initData.error || initResponse.statusText}`);
      }
      
      // Run test backup
      const response = await fetch('/api/communication/backups/test-backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Backup test failed: ${errorData.error || response.statusText}`);
      }
      
      const result = await response.json();
      setTestResult(result);
      
      toast({
        title: 'Test completed',
        description: result.success ? 'Backup test completed successfully!' : 'Backup test failed',
        variant: result.success ? 'default' : 'destructive',
      });
    } catch (err) {
      console.error('Error running backup test:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      
      toast({
        title: 'Test failed',
        description: err instanceof Error ? err.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function verifyBackupSystem() {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/communication/backups/verify');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`System verification failed: ${errorData.error || response.statusText}`);
      }
      
      const result = await response.json();
      setTestResult(result);
      
      toast({
        title: 'Verification completed',
        description: result.success ? 'Backup system verification passed!' : 'Backup system verification failed',
        variant: result.success ? 'default' : 'destructive',
      });
    } catch (err) {
      console.error('Error verifying backup system:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      
      toast({
        title: 'Verification failed',
        description: err instanceof Error ? err.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Test Configuration</h2>
        
        <div className="space-y-4 p-4 border rounded-md">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="include-messages" 
              checked={options.includeMessages}
              onCheckedChange={(checked) => 
                setOptions({...options, includeMessages: checked as boolean})
              }
            />
            <label htmlFor="include-messages">Include messages</label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="include-attachments" 
              checked={options.includeAttachments}
              onCheckedChange={(checked) => 
                setOptions({...options, includeAttachments: checked as boolean})
              }
            />
            <label htmlFor="include-attachments">Include attachments</label>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Format</h3>
            <div className="flex space-x-4">
              {['json', 'csv'].map((format) => (
                <div key={format} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`format-${format}`}
                    name="format"
                    value={format}
                    checked={options.format === format}
                    onChange={(e) => setOptions({...options, format: e.target.value as any})}
                    className="h-4 w-4"
                  />
                  <label htmlFor={`format-${format}`} className="uppercase">{format}</label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <h3 className="font-medium">Compression Level</h3>
              <span>{options.compressionLevel}</span>
            </div>
            <Slider
              value={[options.compressionLevel]}
              min={1}
              max={9}
              step={1}
              onValueChange={(value) => setOptions({...options, compressionLevel: value[0]})}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Faster</span>
              <span>Smaller</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-4">
        <Button 
          onClick={runBackupTest} 
          disabled={loading}
        >
          {loading ? 'Running Test...' : 'Run Backup Test'}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={verifyBackupSystem} 
          disabled={loading}
        >
          Verify Backup System
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-50 p-4 rounded-md text-red-800">
          <h3 className="font-bold">Error</h3>
          <p>{error}</p>
        </div>
      )}
      
      {testResult && (
        <div className="space-y-4 mt-6">
          <h2 className="text-xl font-semibold">Test Results</h2>
          
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Badge variant={testResult.success ? "success" : "destructive"}>
                {testResult.success ? 'Success' : 'Failed'}
              </Badge>
              <span>{testResult.message}</span>
            </div>
            
            {testResult.backup && (
              <div className="space-y-2">
                <h3 className="font-medium">Backup Details</h3>
                <div className="bg-muted p-3 rounded-md overflow-x-auto">
                  <pre className="text-xs">{JSON.stringify(testResult.backup, null, 2)}</pre>
                </div>
              </div>
            )}
            
            {testResult.database && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Database</h3>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${testResult.database.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span>{testResult.database.connected ? 'Connected' : 'Disconnected'}</span>
                  </div>
                  {testResult.database.error && (
                    <p className="text-red-600 text-sm mt-1">{testResult.database.error}</p>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Storage</h3>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${testResult.storage.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span>{testResult.storage.connected ? 'Connected' : 'Disconnected'}</span>
                  </div>
                  {testResult.storage.error && (
                    <p className="text-red-600 text-sm mt-1">{testResult.storage.error}</p>
                  )}
                </div>
              </div>
            )}
            
            {testResult.recentBackups && testResult.recentBackups.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Recent Backups</h3>
                <div className="space-y-2">
                  {testResult.recentBackups.map((backup: any, index: number) => (
                    <div key={index} className="bg-muted/50 p-2 rounded-md text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">{new Date(backup.created_at).toLocaleString()}</span>
                        <Badge>{backup.status}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {backup.file_size ? `${(backup.file_size / 1024).toFixed(2)} KB` : 'Size unknown'} 
                        {backup.options && ` • ${backup.options.format.toUpperCase()}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
