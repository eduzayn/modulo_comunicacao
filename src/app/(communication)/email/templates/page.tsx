"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card";
import { getEmailTemplates } from "../../../../app/actions/email-actions";
import { EmailTemplate } from "../../../../services/email/types";
import { Skeleton } from "../../../../components/ui/skeleton";
import { Badge } from "../../../../components/ui/badge";

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        setLoading(true);
        const result = await getEmailTemplates();
        
        if (result.success && result.data) {
          setTemplates(result.data);
        } else {
          setError(result.error || "Failed to load email templates");
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error("Error fetching email templates:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTemplates();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Email Templates</h1>
        <Link href="/email/templates/new" passHref>
          <Button>Create Template</Button>
        </Link>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Failed to load email templates</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      ) : templates.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Templates</CardTitle>
            <CardDescription>You haven't created any email templates yet</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Create your first template to start sending emails</p>
            <Link href="/email/templates/new" passHref>
              <Button className="mt-4">Create Template</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{template.name}</CardTitle>
                  <Badge variant={template.is_active ? "default" : "outline"}>
                    {template.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <CardDescription>{template.subject}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-1">Variables:</h4>
                  <div className="flex flex-wrap gap-1">
                    {template.variables && template.variables.length > 0 ? (
                      template.variables.map((variable) => (
                        <Badge key={variable} variant="secondary" className="text-xs">
                          {variable}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No variables</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Link href={`/email/templates/${template.id}`} passHref>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Link>
                  <Link href={`/email/send?template=${template.id}`} passHref>
                    <Button size="sm">Use Template</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
