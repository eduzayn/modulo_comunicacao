"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useToast } from "../ui/use-toast";
import { Switch } from "../ui/switch";
import { EmailTemplate } from "../../services/email/types";

// Email template schema
const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Template name is required"),
  subject: z.string().min(1, "Subject is required"),
  body_html: z.string().min(1, "HTML content is required"),
  body_text: z.string().optional(),
  variables: z.array(z.string()).default([]),
  is_active: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface EmailTemplateFormProps {
  template?: EmailTemplate;
  onSave: (data: FormValues) => Promise<{ success: boolean; error?: string }>;
}

export function EmailTemplateForm({ template, onSave }: EmailTemplateFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [variableInput, setVariableInput] = useState("");

  // Initialize form with existing template or defaults
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: template?.id || undefined,
      name: template?.name || "",
      subject: template?.subject || "",
      body_html: template?.body_html || "",
      body_text: template?.body_text || "",
      variables: template?.variables || [],
      is_active: template?.is_active !== undefined ? template.is_active : true,
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    try {
      const result = await onSave(data);

      if (result.success) {
        toast({
          title: "Template saved",
          description: "Email template has been saved successfully.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to save template",
          description: result.error || "An error occurred while saving the template.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
      console.error("Error saving email template:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  function addVariable() {
    if (variableInput.trim() === "") return;
    
    const currentVariables = form.getValues("variables") || [];
    if (!currentVariables.includes(variableInput.trim())) {
      form.setValue("variables", [...currentVariables, variableInput.trim()]);
    }
    setVariableInput("");
  }

  function removeVariable(variable: string) {
    const currentVariables = form.getValues("variables") || [];
    form.setValue(
      "variables",
      currentVariables.filter((v) => v !== variable)
    );
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>{template ? "Edit Template" : "Create Template"}</CardTitle>
        <CardDescription>
          {template
            ? "Update an existing email template"
            : "Create a new email template with variables"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Welcome Email" {...field} />
                    </FormControl>
                    <FormDescription>
                      A descriptive name for this template
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Welcome to {{company_name}}" {...field} />
                    </FormControl>
                    <FormDescription>
                      The subject line of the email
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="body_html"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>HTML Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="<html><body><h1>Welcome, {{name}}!</h1></body></html>"
                      className="min-h-[200px] font-mono"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    HTML content of the email. Use &#123;&#123;variable&#125;&#125; for dynamic content.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="body_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plain Text Content (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Welcome, {{name}}!"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Plain text version of the email for clients that don't support HTML
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Template Variables</h3>
                <p className="text-sm text-muted-foreground">
                  Define variables that can be used in the template
                </p>
              </div>

              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Variable name (e.g. name, company_name)"
                    value={variableInput}
                    onChange={(e) => setVariableInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addVariable();
                      }
                    }}
                  />
                </div>
                <Button type="button" onClick={addVariable}>
                  Add Variable
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {form.watch("variables").map((variable) => (
                  <div
                    key={variable}
                    className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-md"
                  >
                    <span>{variable}</span>
                    <button
                      type="button"
                      onClick={() => removeVariable(variable)}
                      className="text-secondary-foreground/70 hover:text-secondary-foreground"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Template</FormLabel>
                    <FormDescription>
                      Make this template available for use
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <CardFooter className="px-0 pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Template"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
