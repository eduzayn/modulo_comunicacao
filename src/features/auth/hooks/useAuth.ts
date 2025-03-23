import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth-service';
import { LoginCredentials, RegisterCredentials, AuthenticatedUser } from '../types';

interface UseAuthReturn {
  user: AuthenticatedUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Verificar se o usuário está autenticado
  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { success, data, error } = await authService.getCurrentUser();
      
      if (success && data) {
        setUser(data);
        return;
      }
      
      if (error) {
        setError(error.message);
      }
      
      setUser(null);
    } catch (err) {
      setUser(null);
      setError('Erro ao carregar usuário');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carregar dados do usuário quando o componente montar
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Login
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.login.execute(credentials);
      
      if (result.success) {
        await refreshUser();
        return true;
      }
      
      if (result.error) {
        setError(result.error.message);
      }
      
      return false;
    } catch (err) {
      setError('Erro ao realizar login');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Registro
  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.register.execute(credentials);
      
      if (result.success) {
        await refreshUser();
        return true;
      }
      
      if (result.error) {
        setError(result.error.message);
      }
      
      return false;
    } catch (err) {
      setError('Erro ao realizar cadastro');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.logout.execute();
      
      if (result.success) {
        setUser(null);
        router.push('/login');
        return true;
      }
      
      if (result.error) {
        setError(result.error.message);
      }
      
      return false;
    } catch (err) {
      setError('Erro ao realizar logout');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset de senha
  const resetPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.resetPassword.execute({ email });
      
      if (result.success) {
        return true;
      }
      
      if (result.error) {
        setError(result.error.message);
      }
      
      return false;
    } catch (err) {
      setError('Erro ao solicitar redefinição de senha');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Atualização de senha
  const updatePassword = async (newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.updatePassword.execute({ newPassword });
      
      if (result.success) {
        return true;
      }
      
      if (result.error) {
        setError(result.error.message);
      }
      
      return false;
    } catch (err) {
      setError('Erro ao atualizar senha');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    login,
    register,
    logout,
    resetPassword,
    updatePassword,
    refreshUser,
  };
} 