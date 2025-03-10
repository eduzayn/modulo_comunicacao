import React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

export default function EmailDashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Email Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>
              Manage SMTP settings for sending emails
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Configure your email server settings, including SMTP host, port, 
              authentication credentials, and sender information.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/email/config" passHref>
              <Button>Manage Configuration</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Templates</CardTitle>
            <CardDescription>
              Create and manage email templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Design reusable email templates with variables for personalized 
              content. Supports both HTML and plain text formats.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/email/templates" passHref>
              <Button>Manage Templates</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Logs</CardTitle>
            <CardDescription>
              View email sending history and logs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Track all sent emails, delivery status, and any errors that 
              occurred during the sending process.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/email/logs" passHref>
              <Button>View Logs</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Send Email</CardTitle>
            <CardDescription>
              Send emails directly or using templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Send individual emails or batch emails using templates with 
              variable substitution for personalized content.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/email/send" passHref>
              <Button>Send Email</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Test Connection</CardTitle>
            <CardDescription>
              Test your email server connection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Verify that your SMTP settings are correct by sending a test 
              email and checking the connection to your email server.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/email/test" passHref>
              <Button>Test Connection</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
