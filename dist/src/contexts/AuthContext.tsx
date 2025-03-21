/**
 * AuthContext.tsx
 * 
 * Contexto para compartilhar o estado de autenticação e funções relacionadas
 */

'use client';

import React, { createContext, useContext } from 'react';
import { useAuth, User, AuthState } from '@/hooks/useAuth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string | string[]) => boolean;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
}

// Criar o contexto com valores padrão
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Usar o hook para obter o estado e funções de autenticação
  const auth = useAuth();

  // Fornecer o estado e funções para todos os componentes filhos
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para acessar o contexto
export function useAuthContext() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}
