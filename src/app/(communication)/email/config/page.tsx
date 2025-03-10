"use client";

import React, { useEffect, useState } from "react";
import { EmailConfigForm } from "../../../../components/email/email-config-form";
import { getEmailConfig, updateEmailConfig } from "../../../../app/actions/email-actions";
import { EmailConfig } from "../../../../services/email/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Skeleton } from "../../../../components/ui/skeleton";

export default function EmailConfigPage() {
  const [config, setConfig] = useState<EmailConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchConfig() {
      try {
        setLoading(true);
        const result = await getEmailConfig();
        
        if (result.success && result.data) {
          setConfig(result.data);
        } else {
          setError(result.error || "Failed to load email configuration");
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error("Error fetching email config:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchConfig();
  }, []);

  async function handleSaveConfig(data: any) {
    try {
      const result = await updateEmailConfig(data);
      
      if (result.success && result.data) {
        setConfig(result.data);
        return { success: true };
      } else {
        return { 
          success: false, 
          error: result.error || "Failed to update email configuration" 
        };
      }
    } catch (err) {
      console.error("Error updating email config:", err);
      return { 
        success: false, 
        error: "An unexpected error occurred" 
      };
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Email Configuration</h1>
      
      {loading ? (
        <Card>
          <CardHeader>
            <CardTitle><Skeleton className="h-8 w-1/3" /></CardTitle>
            <CardDescription><Skeleton className="h-4 w-2/3" /></CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Failed to load email configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      ) : (
        <EmailConfigForm config={config || undefined} onSave={handleSaveConfig} />
      )}
    </div>
  );
}
