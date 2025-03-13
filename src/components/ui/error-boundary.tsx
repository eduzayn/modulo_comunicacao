/**
 * Error Boundary component for handling errors in React components
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertTitle, AlertDescription } from './alert';
import { Button } from './button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: unknown[];
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component that catches JavaScript errors in its child component tree
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Component error:', error, errorInfo);
    
    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // If any of the resetKeys changed, reset the error boundary
    if (
      this.state.hasError &&
      this.props.resetKeys &&
      prevProps.resetKeys &&
      this.props.resetKeys.some((key, index) => key !== prevProps.resetKeys?.[index])
    ) {
      this.reset();
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Render the fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Otherwise, render a default error message
      return (
        <Alert variant="destructive">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription className="mt-2">
            {this.state.error?.message || 'An unexpected error occurred'}
          </AlertDescription>
          <Button 
            onClick={this.reset}
            className="mt-4"
            variant="outline"
          >
            Try again
          </Button>
        </Alert>
      );
    }

    // If there's no error, render the children
    return this.props.children;
  }
}

/**
 * Error message component for displaying error messages
 */
export function ErrorMessage({ 
  error, 
  className,
  onRetry
}: { 
  error: Error | string | null | undefined;
  className?: string;
  onRetry?: () => void;
}) {
  if (!error) return null;
  
  const errorMessage = typeof error === 'string' ? error : error.message;
  
  return (
    <Alert variant="destructive" className={className}>
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="mt-2">
        {errorMessage || 'An unexpected error occurred'}
      </AlertDescription>
      {onRetry && (
        <Button 
          onClick={onRetry}
          className="mt-4"
          variant="outline"
          size="sm"
        >
          Retry
        </Button>
      )}
    </Alert>
  );
}
