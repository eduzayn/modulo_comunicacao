/**
 * AuthContext.tsx
 * 
 * Description: This module provides authentication context for the application.
 * It manages user authentication state, login/logout functionality, and session persistence.
 * 
 * @module auth
 * @author Devin AI
 * @created 2025-03-13
 */

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * User type definition
 */
type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
};

/**
 * Mock users for testing authentication
 */
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@edunexia.com',
    password: 'admin123',
    name: 'Administrador',
    role: 'admin' as const,
  },
  {
    id: '2',
    email: 'user@edunexia.com',
    password: 'user123',
    name: 'Usuário Teste',
    role: 'user' as const,
  },
  {
    id: '3',
    email: 'teste@edunexia.com.br',
    password: 'Teste@123',
    name: 'Usuário Temporário',
    role: 'admin' as const,
  },
];

/**
 * Authentication context type definition
 */
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
};

/**
 * Create the authentication context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider - Provides authentication context to the application
 * 
 * This component manages authentication state, handles login/logout operations,
 * and persists user sessions using localStorage.
 * 
 * @param props - Component props including children
 * @returns Authentication context provider with the provided children
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  /**
   * Login function - Authenticates a user by email
   * 
   * @param email - User's email address
   * @returns Promise resolving to boolean indicating success/failure
   */
  const login = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = MOCK_USERS.find(
      u => u.email === email
    );
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  /**
   * Logout function - Signs out the current user
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth - Custom hook to access the authentication context
 * 
 * @returns Authentication context with user state and auth functions
 * @throws Error if used outside of an AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
