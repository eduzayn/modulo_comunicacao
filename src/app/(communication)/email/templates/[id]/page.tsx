"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EmailTemplateForm } from "../../../../../components/email/email-template-form";
import { getEmailTemplate, updateEmailTemplate, createEmailTemplate } from "../../../../../app/actions/email-actions";
import { EmailTemplate } from "../../../../../services/email/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Skeleton } from "../../../../../components/ui/skeleton";
import { Button } from "../../../../../components/ui/button";
import Link from "next/link";

export default function EmailTemplateEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const isNew = params.id === "new";
  const [template, setTemplate] = useState<EmailTemplate | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTemplate() {
      if (isNew) return;
      
      try {
        setLoading(true);
        const result = await getEmailTemplate(params.id);
        
        if (result.success && result.data) {
          setTemplate(result.data);
        } else {
          setError(result.error || "Failed to load email template");
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error("Error fetching email template:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTemplate();
  }, [params.id, isNew]);

  async function handleSaveTemplate(data: any) {
    try {
      let result;
      
      if (isNew) {
        result = await createEmailTemplate(data);
      } else {
        result = await updateEmailTemplate({
          ...data,
          id: params.id
        });
      }
      
      if (result.success && result.data) {
        if (isNew) {
          // Redirect to the edit page for the newly created template
          router.push(`/email/templates/${result.data.id}`);
        } else {
          setTemplate(result.data);
        }
        return { success: true };
      } else {
        return { 
          success: false, 
          error: result.error || "Failed to save email template" 
        };
      }
    } catch (err) {
      console.error("Error saving email template:", err);
      return { 
        success: false, 
        error: "An unexpected error occurred" 
      };
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {isNew ? "Create Email Template" : "Edit Email Template"}
        </h1>
        <Link href="/email/templates" passHref>
          <Button variant="outline">Back to Templates</Button>
        </Link>
      </div>
      
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
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Failed to load email template</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
            <Link href="/email/templates" passHref>
              <Button className="mt-4">Back to Templates</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <EmailTemplateForm template={template || undefined} onSave={handleSaveTemplate} />
      )}
    </div>
  );
}
