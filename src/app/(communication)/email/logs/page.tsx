"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card";
import { getEmailLogs } from "../../../../app/actions/email-actions";
import { Skeleton } from "../../../../components/ui/skeleton";
import { Badge } from "../../../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";

interface EmailLog {
  id: string;
  email_to: string;
  email_from: string;
  subject: string;
  template_id?: string;
  status: 'pending' | 'sent' | 'failed';
  error_message?: string;
  sent_at: string;
  created_at: string;
}

export default function EmailLogsPage() {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;

  useEffect(() => {
    fetchLogs();
  }, [page]);

  async function fetchLogs() {
    try {
      setLoading(true);
      const result = await getEmailLogs(limit, page * limit);
      
      if (result.success && result.data) {
        setLogs(prev => page === 0 ? result.data : [...prev, ...result.data]);
        setHasMore(result.data.length === limit);
      } else {
        setError(result.error || "Failed to load email logs");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Error fetching email logs:", err);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'sent':
        return <Badge className="bg-green-500">Enviado</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      case 'failed':
        return <Badge className="bg-red-500">Falhou</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Email Logs</h1>
        <Link href="/email" passHref>
          <Button variant="outline">Back to Email Dashboard</Button>
        </Link>
      </div>
      
      {loading && page === 0 ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Failed to load email logs</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      ) : logs.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Logs</CardTitle>
            <CardDescription>No email logs found</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Send an email to see logs here</p>
            <Link href="/email/send" passHref>
              <Button className="mt-4">Send Email</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Email Logs</CardTitle>
              <CardDescription>
                History of all emails sent from the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{formatDate(log.sent_at)}</TableCell>
                      <TableCell>{log.email_to}</TableCell>
                      <TableCell className="max-w-xs truncate">{log.subject}</TableCell>
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
                      <TableCell>
                        <Link href={`/email/logs/${log.id}`} passHref>
                          <Button variant="outline" size="sm">View</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {loading && page > 0 && (
                <div className="mt-4 space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              )}
              
              {hasMore && (
                <div className="mt-4 flex justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setPage(prev => prev + 1)}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Load More"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
