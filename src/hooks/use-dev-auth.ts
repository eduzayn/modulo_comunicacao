/**
 * Hook for development authentication
 * 
 * This hook provides authentication utilities for development environments.
 */

import { useState, useEffect } from 'react';

interface DevAuthState {
  isAuthenticated: boolean;
  userId: string | null;
  role: string | null;
}

/**
 * Hook for development authentication
 */
export function useDevAuth() {
  const [authState, setAuthState] = useState<DevAuthState>({
    isAuthenticated: false,
    userId: null,
    role: null,
  });

  useEffect(() => {
    // In development mode, we'll auto-authenticate
    if (process.env.NODE_ENV === 'development') {
      setAuthState({
        isAuthenticated: true,
        userId: 'dev-user',
        role: 'admin',
      });
    }
  }, []);

  /**
   * Get authentication headers for API requests
   */
  const getAuthHeaders = () => {
    if (process.env.NODE_ENV === 'development') {
      return { 'x-dev-auth': 'true' };
    }
    
    return {};
  };

  /**
   * Login with development credentials
   */
  const login = () => {
    setAuthState({
      isAuthenticated: true,
      userId: 'dev-user',
      role: 'admin',
    });
  };

  /**
   * Logout
   */
  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      userId: null,
      role: null,
    });
  };

  return {
    ...authState,
    getAuthHeaders,
    login,
    logout,
  };
}
