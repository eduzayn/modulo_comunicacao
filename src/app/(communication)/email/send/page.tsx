"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { Label } from "../../../../components/ui/label";
import { useToast } from "../../../../components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { getEmailTemplates, getEmailTemplate, sendEmail } from "../../../../app/actions/email-actions";
import { EmailTemplate } from "../../../../services/email/types";
import { Skeleton } from "../../../../components/ui/skeleton";

export default function SendEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");
  const { toast } = useToast();
  
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [textContent, setTextContent] = useState("");
  const [variables, setVariables] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchTemplates() {
      try {
        setLoading(true);
        const result = await getEmailTemplates();
        
        if (result.success && result.data) {
          setTemplates(result.data);
          
          // If template ID is provided in URL, load that template
          if (templateId) {
            const templateResult = await getEmailTemplate(templateId);
            if (templateResult.success && templateResult.data) {
              setSelectedTemplate(templateResult.data);
              setSubject(templateResult.data.subject);
              setHtmlContent(templateResult.data.body_html);
              setTextContent(templateResult.data.body_text || "");
              
              // Initialize variables
              const initialVars: Record<string, string> = {};
              templateResult.data.variables.forEach(v => {
                initialVars[v] = "";
              });
              setVariables(initialVars);
            }
          }
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
  }, [templateId]);

  function handleTemplateChange(value: string) {
    if (!value) {
      setSelectedTemplate(null);
      setSubject("");
      setHtmlContent("");
      setTextContent("");
      setVariables({});
      return;
    }
    
    const template = templates.find(t => t.id === value);
    if (template) {
      setSelectedTemplate(template);
      setSubject(template.subject);
      setHtmlContent(template.body_html);
      setTextContent(template.body_text || "");
      
      // Initialize variables
      const initialVars: Record<string, string> = {};
      template.variables.forEach(v => {
        initialVars[v] = "";
      });
      setVariables(initialVars);
    }
  }

  function handleVariableChange(name: string, value: string) {
    setVariables(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function previewContent() {
    let previewHtml = htmlContent;
    let previewText = textContent;
    
    // Replace variables in content
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      previewHtml = previewHtml.replace(regex, value);
      previewText = previewText.replace(regex, value);
    });
    
    return { previewHtml, previewText };
  }

  async function handleSendEmail(e: React.FormEvent) {
    e.preventDefault();
    
    if (!to || !subject || !htmlContent) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all required fields",
      });
      return;
    }
    
    setSending(true);
    
    try {
      const { previewHtml, previewText } = previewContent();
      
      const result = await sendEmail({
        to,
        subject,
        html: previewHtml,
        text: previewText || undefined,
        templateId: selectedTemplate?.id,
        variables: selectedTemplate ? variables : undefined,
      });
      
      if (result.success) {
        toast({
          title: "Email sent",
          description: "Your email has been sent successfully",
        });
        
        // Reset form
        setTo("");
        if (!selectedTemplate) {
          setSubject("");
          setHtmlContent("");
          setTextContent("");
        }
        
        // Redirect to logs
        router.push("/email/logs");
      } else {
        toast({
          variant: "destructive",
          title: "Failed to send email",
          description: result.error || "An error occurred while sending the email",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
      console.error("Error sending email:", error);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Send Email</h1>
        <Link href="/email" passHref>
          <Button variant="outline">Back to Email Dashboard</Button>
        </Link>
      </div>
      
      {loading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </CardContent>
        </Card>
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
      ) : (
        <form onSubmit={handleSendEmail}>
          <Card>
            <CardHeader>
              <CardTitle>Send Email</CardTitle>
              <CardDescription>
                Send an email using a template or custom content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="template">Template (Optional)</Label>
                <Select
                  value={selectedTemplate?.id || ""}
                  onValueChange={handleTemplateChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template or create custom email" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Custom Email</SelectItem>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="to">Recipient Email *</Label>
                <Input
                  id="to"
                  type="email"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="recipient@example.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Email subject"
                  required
                  disabled={!!selectedTemplate}
                />
              </div>
              
              {selectedTemplate && selectedTemplate.variables.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Template Variables</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedTemplate.variables.map((variable) => (
                      <div key={variable} className="space-y-2">
                        <Label htmlFor={`var-${variable}`}>{variable}</Label>
                        <Input
                          id={`var-${variable}`}
                          value={variables[variable] || ""}
                          onChange={(e) => handleVariableChange(variable, e.target.value)}
                          placeholder={`Value for ${variable}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {!selectedTemplate && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="html-content">HTML Content *</Label>
                    <Textarea
                      id="html-content"
                      value={htmlContent}
                      onChange={(e) => setHtmlContent(e.target.value)}
                      placeholder="<html><body><h1>Hello!</h1><p>Your email content here.</p></body></html>"
                      className="min-h-[200px] font-mono"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="text-content">Plain Text Content (Optional)</Label>
                    <Textarea
                      id="text-content"
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      placeholder="Hello! Your email content here."
                      className="min-h-[100px]"
                    />
                  </div>
                </>
              )}
              
              {selectedTemplate && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Preview</h3>
                  <div className="border rounded-md p-4 bg-gray-50">
                    <h4 className="font-medium mb-2">Subject: {subject}</h4>
                    <div className="prose max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: previewContent().previewHtml }} />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={sending}>
                {sending ? "Sending..." : "Send Email"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      )}
    </div>
  );
}
