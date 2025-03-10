"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useToast } from "../ui/use-toast";
import { EmailConfig } from "../../services/email/types";

// Email configuration schema
const formSchema = z.object({
  id: z.string().optional(),
  smtp_host: z.string().min(1, "SMTP host is required"),
  smtp_port: z.number().int().min(1, "SMTP port is required"),
  smtp_user: z.string().min(1, "SMTP username is required"),
  smtp_password: z.string().optional(),
  from_email: z.string().email("Valid email is required"),
  from_name: z.string().min(1, "From name is required"),
  is_default: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface EmailConfigFormProps {
  config?: EmailConfig;
  onSave: (data: FormValues) => Promise<{ success: boolean; error?: string }>;
}

export function EmailConfigForm({ config, onSave }: EmailConfigFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with existing config or defaults
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: config?.id || undefined,
      smtp_host: config?.smtp_host || "",
      smtp_port: config?.smtp_port || 587,
      smtp_user: config?.smtp_user || "",
      smtp_password: "", // Don't pre-fill password
      from_email: config?.from_email || "",
      from_name: config?.from_name || "",
      is_default: config?.is_default !== undefined ? config.is_default : true,
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    try {
      // Only include password if it was provided
      const submitData = {
        ...data,
        smtp_password: data.smtp_password?.trim() ? data.smtp_password : undefined,
      };

      const result = await onSave(submitData);

      if (result.success) {
        toast({
          title: "Configuration saved",
          description: "Email configuration has been updated successfully.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to save configuration",
          description: result.error || "An error occurred while saving the configuration.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
      console.error("Error saving email config:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Email Configuration</CardTitle>
        <CardDescription>
          Configure the SMTP settings for sending emails from the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="smtp_host"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SMTP Host</FormLabel>
                    <FormControl>
                      <Input placeholder="smtp.example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      The hostname of your SMTP server
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="smtp_port"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SMTP Port</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="587" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Common ports: 25, 465 (SSL), 587 (TLS)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="smtp_user"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SMTP Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="smtp_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SMTP Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder={config?.id ? "••••••••" : "Enter password"} 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      {config?.id ? "Leave empty to keep current password" : ""}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="from_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Email</FormLabel>
                    <FormControl>
                      <Input placeholder="noreply@example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      The email address that will appear in the From field
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="from_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Company Name" {...field} />
                    </FormControl>
                    <FormDescription>
                      The name that will appear in the From field
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <CardFooter className="px-0 pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Configuration"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
