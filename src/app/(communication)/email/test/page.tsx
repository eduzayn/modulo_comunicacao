"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { useToast } from "../../../../components/ui/use-toast";
import { sendTestEmail } from "../../../../app/actions/email-actions";

export default function TestEmailPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    id?: string;
  } | null>(null);

  async function handleSendTestEmail(e: React.FormEvent) {
    e.preventDefault();
    
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email required",
        description: "Please enter an email address to send the test email to",
      });
      return;
    }
    
    setIsSending(true);
    setResult(null);
    
    try {
      const response = await sendTestEmail(email);
      
      if (response.success) {
        setResult({
          success: true,
          message: "Test email sent successfully!",
          id: response.data?.id,
        });
        
        toast({
          title: "Test email sent",
          description: "The test email was sent successfully",
        });
      } else {
        setResult({
          success: false,
          message: response.error || "Failed to send test email",
        });
        
        toast({
          variant: "destructive",
          title: "Failed to send test email",
          description: response.error || "An error occurred while sending the test email",
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: "An unexpected error occurred",
      });
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
      console.error("Error sending test email:", error);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Test Email Connection</h1>
        <Link href="/email" passHref>
          <Button variant="outline">Back to Email Dashboard</Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Send Test Email</CardTitle>
            <CardDescription>
              Test your email configuration by sending a test email
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSendTestEmail}>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Recipient Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>
                    This will send a test email to the specified address using your
                    configured SMTP settings. The email will contain information about
                    your email configuration.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSending}>
                {isSending ? "Sending..." : "Send Test Email"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        {result && (
          <Card className={result.success ? "border-green-500" : "border-red-500"}>
            <CardHeader>
              <CardTitle className={result.success ? "text-green-500" : "text-red-500"}>
                {result.success ? "Success" : "Error"}
              </CardTitle>
              <CardDescription>
                Test email result
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>{result.message}</p>
                
                {result.success && result.id && (
                  <div className="text-sm">
                    <p>Email ID: {result.id}</p>
                    <p className="mt-2">
                      Check your inbox to confirm receipt of the test email.
                      If you don't see it, check your spam folder.
                    </p>
                  </div>
                )}
                
                {!result.success && (
                  <div className="text-sm">
                    <p className="font-medium mt-2">Troubleshooting:</p>
                    <ul className="list-disc list-inside space-y-1 mt-1">
                      <li>Verify your SMTP server settings</li>
                      <li>Check that your SMTP credentials are correct</li>
                      <li>Ensure your SMTP server allows connections from our IP</li>
                      <li>Check if your SMTP server requires SSL/TLS</li>
                      <li>Verify that the port is correct and not blocked</li>
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              {result.success ? (
                <Link href="/email/logs" passHref>
                  <Button variant="outline">View Email Logs</Button>
                </Link>
              ) : (
                <Link href="/email/config" passHref>
                  <Button variant="outline">Check Configuration</Button>
                </Link>
              )}
            </CardFooter>
          </Card>
        )}
      </div>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Email Configuration Information</CardTitle>
          <CardDescription>
            Current email configuration details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              The test uses your default email configuration from the database.
              If the test fails, you may need to update your configuration.
            </p>
            
            <div className="text-sm">
              <p className="font-medium">Common SMTP Settings:</p>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li>Gmail: smtp.gmail.com (Port 587)</li>
                <li>Outlook/Office 365: smtp.office365.com (Port 587)</li>
                <li>Amazon SES: email-smtp.{region}.amazonaws.com (Port 587)</li>
                <li>SendGrid: smtp.sendgrid.net (Port 587)</li>
                <li>Mailgun: smtp.mailgun.org (Port 587)</li>
              </ul>
            </div>
            
            <div className="text-sm">
              <p className="font-medium">Note:</p>
              <p>
                For services like Gmail, you may need to use an App Password
                instead of your regular password if you have 2FA enabled.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Link href="/email/config" passHref>
            <Button variant="outline">Edit Configuration</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
