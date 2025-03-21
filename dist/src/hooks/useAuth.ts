/**
 * useAuth.ts
 * 
 * Hook para gerenciar estado de autenticação e permissões do usuário
 * utilizando Supabase e integrado com TanStack Query.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

// Tipos para autenticação
export type UserRole = Database['public']['Enums']['user_role'];

export interface User {
  id: string;
  email: string;
  full_name?: string | null;
  role: string;
  avatar_url?: string | null;
  last_sign_in?: string | null;
  is_active: boolean;
  permissions: string[];
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

// Armazenar permissões por papel (role)
const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: ['admin', '*'],
  manager: [
    'users.read', 'messages.read', 'messages.write', 
    'contacts.read', 'contacts.write', 'reports.read'
  ],
  user: [
    'messages.read', 'messages.write', 
    'contacts.read', 'contacts.write'
  ],
  guest: ['messages.read', 'contacts.read']
};

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Obter permissões baseadas no papel (role) do usuário
  const getPermissions = useCallback((role: string): string[] => {
    return ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS] || [];
  }, []);

  // Carregar usuário da sessão do Supabase
  const loadUser = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Verificar se existe sessão ativa no Supabase
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      
      if (session) {
        // Buscar dados completos do usuário no banco
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (userError) throw userError;
        
        if (userData) {
          const permissions = getPermissions(userData.role);
          
          const user: User = {
            id: userData.id,
            email: userData.email,
            full_name: userData.full_name,
            role: userData.role,
            avatar_url: userData.avatar_url,
            last_sign_in: userData.last_sign_in,
            is_active: userData.is_active,
            permissions
          };
          
          setState({
            user,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });
          
          // Atualizar cache do TanStack Query com os dados do usuário
          queryClient.setQueryData(['currentUser'], user);
          
          // Salvar no localStorage para recuperação rápida
          localStorage.setItem('user', JSON.stringify(user));
          
          return user;
        }
      }
      
      // Nenhuma sessão encontrada
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
      
      localStorage.removeItem('user');
      return null;
    } catch (error: any) {
      console.error('Erro ao carregar usuário:', error);
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: error.message || 'Falha ao carregar dados do usuário',
      });
      
      localStorage.removeItem('user');
      return null;
    }
  }, [getPermissions, queryClient]);

  // Carregar usuário no carregamento inicial
  useEffect(() => {
    loadUser();
    
    // Escutar mudanças na sessão do Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        loadUser();
      } else {
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: null,
        });
        
        localStorage.removeItem('user');
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [loadUser]);

  // Login do usuário usando Supabase
  const login = useCallback(async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Autenticar com Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.session) {
        // Carregar dados completos do usuário
        await loadUser();
        
        // Redirecionar para a página inicial ou página solicitada
        const redirectTo = new URLSearchParams(window.location.search).get('redirect') || '/';
        router.push(redirectTo);
        
        toast({
          title: 'Login realizado com sucesso',
          description: `Bem-vindo, ${state.user?.full_name || email}!`,
        });
        
        return true;
      }
      
      throw new Error('Falha na autenticação');
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Credenciais inválidas',
      }));
      
      toast({
        title: 'Falha ao fazer login',
        description: error.message || 'Email ou senha incorretos',
        variant: 'destructive',
      });
      
      return false;
    }
  }, [router, toast, loadUser, state.user]);

  // Logout do usuário
  const logout = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Logout do Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Limpar cache do TanStack Query
      queryClient.removeQueries({ queryKey: ['currentUser'] });
      
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
      
      // Remover dados do localStorage
      localStorage.removeItem('user');
      
      // Redirecionar para a página de login
      router.push('/login');
      
      toast({
        title: 'Logout realizado',
        description: 'Sua sessão foi encerrada com sucesso',
      });
      
      return true;
    } catch (error: any) {
      console.error('Erro ao fazer logout:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Erro ao finalizar sessão',
      }));
      
      toast({
        title: 'Erro ao finalizar sessão',
        description: 'Ocorreu um erro ao encerrar sua sessão',
        variant: 'destructive',
      });
      
      return false;
    }
  }, [router, toast, queryClient]);

  // Verificar se o usuário tem determinada permissão
  const hasPermission = useCallback((permission: string | string[]) => {
    if (!state.user || !state.isAuthenticated) return false;
    
    // Administradores têm todas as permissões
    if (state.user.role === 'admin' || state.user.permissions.includes('admin') || state.user.permissions.includes('*')) {
      return true;
    }
    
    // Verificar permissões específicas
    if (Array.isArray(permission)) {
      return permission.some(p => state.user?.permissions.includes(p));
    }
    
    return state.user.permissions.includes(permission);
  }, [state.user, state.isAuthenticated]);

  // Atualizar perfil do usuário
  const updateProfile = useCallback(async (userData: Partial<User>) => {
    try {
      if (!state.user) throw new Error('Usuário não autenticado');
      
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Atualizar no Supabase
      const { data, error } = await supabase
        .from('users')
        .update({
          full_name: userData.full_name,
          avatar_url: userData.avatar_url,
        })
        .eq('id', state.user.id)
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        const updatedUser = {
          ...state.user,
          ...data,
        };
        
        // Atualizar estado e cache
        setState(prev => ({
          ...prev,
          user: updatedUser,
          isLoading: false,
        }));
        
        queryClient.setQueryData(['currentUser'], updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        toast({
          title: 'Perfil atualizado',
          description: 'Seus dados foram atualizados com sucesso',
        });
        
        return true;
      }
      
      throw new Error('Falha ao atualizar perfil');
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Falha ao atualizar perfil',
      }));
      
      toast({
        title: 'Erro ao atualizar perfil',
        description: error.message || 'Ocorreu um erro ao salvar seus dados',
        variant: 'destructive',
      });
      
      return false;
    }
  }, [state.user, toast, queryClient]);

  return {
    ...state,
    login,
    logout,
    hasPermission,
    updateProfile,
    refreshUser: loadUser,
  };
} 