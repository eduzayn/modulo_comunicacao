/**
 * API client utilities for making authenticated requests
 * 
 * This module provides functions for making authenticated API requests
 * with consistent error handling and response formatting.
 */

/**
 * Options for API requests
 */
export interface ApiRequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

/**
 * Make an authenticated JSON fetch request
 */
export async function authenticatedJsonFetch<T>(
  url: string,
  options: ApiRequestOptions = {},
  authHeaders: Record<string, string> = {}
): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...authHeaders,
    ...options.headers,
  };

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const error = new Error(
      errorData?.error || `API request failed with status ${response.status}`
    );
    (error as any).status = response.status;
    (error as any).data = errorData;
    throw error;
  }

  return response.json();
}

/**
 * Make an authenticated fetch request (non-JSON)
 */
export async function authenticatedFetch(
  url: string,
  options: ApiRequestOptions = {},
  authHeaders: Record<string, string> = {}
): Promise<Response> {
  const headers = {
    ...authHeaders,
    ...options.headers,
  };

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body,
  });

  if (!response.ok) {
    const error = new Error(`API request failed with status ${response.status}`);
    (error as any).status = response.status;
    throw error;
  }

  return response;
}
