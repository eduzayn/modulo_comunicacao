'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChannelService } from '@/services/supabase/channels';
import type { Channel } from '@/types/index';

// Inicializa o serviço de canais
const channelService = new ChannelService();

/**
 * Hook para gerenciar os canais no módulo de configurações
 */
export function useChannels() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [filteredChannels, setFilteredChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  /**
   * Busca todos os canais
   */
  const fetchChannels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await channelService.getChannels();
      setChannels(data);
      setFilteredChannels(data);
    } catch (err) {
      setError('Erro ao carregar os canais. Por favor, tente novamente.');
      console.error('Error fetching channels:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Busca um canal por ID
   */
  const getChannelById = useCallback(async (id: string) => {
    try {
      return await channelService.getChannelById(id);
    } catch (err) {
      console.error('Error fetching channel by ID:', err);
      throw err;
    }
  }, []);

  /**
   * Cria um novo canal
   */
  const createChannel = useCallback(async (channelData: any) => {
    try {
      const newChannel = await channelService.createChannel(channelData);
      setChannels(prev => [...prev, newChannel]);
      setFilteredChannels(prev => [...prev, newChannel]);
      return newChannel;
    } catch (err) {
      console.error('Error creating channel:', err);
      throw err;
    }
  }, []);

  /**
   * Atualiza um canal existente
   */
  const updateChannel = useCallback(async (id: string, channelData: any) => {
    try {
      const updatedChannel = await channelService.updateChannel(id, channelData);
      setChannels(prev => prev.map(channel => channel.id === id ? updatedChannel : channel));
      setFilteredChannels(prev => prev.map(channel => channel.id === id ? updatedChannel : channel));
      return updatedChannel;
    } catch (err) {
      console.error('Error updating channel:', err);
      throw err;
    }
  }, []);

  /**
   * Deleta um canal
   */
  const deleteChannel = useCallback(async (id: string) => {
    try {
      await channelService.deleteChannel(id);
      setChannels(prev => prev.filter(channel => channel.id !== id));
      setFilteredChannels(prev => prev.filter(channel => channel.id !== id));
    } catch (err) {
      console.error('Error deleting channel:', err);
      throw err;
    }
  }, []);

  /**
   * Filtra os canais com base na consulta de pesquisa
   */
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredChannels(channels);
      return;
    }
    
    const lowercaseQuery = query.toLowerCase();
    const filtered = channels.filter(channel => 
      channel.name.toLowerCase().includes(lowercaseQuery) || 
      channel.type.toLowerCase().includes(lowercaseQuery)
    );
    
    setFilteredChannels(filtered);
  }, [channels]);

  // Carrega os canais na montagem do componente
  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  return {
    channels: filteredChannels,
    allChannels: channels,
    isLoading,
    error,
    searchQuery,
    setSearchQuery: handleSearch,
    fetchChannels,
    getChannelById,
    createChannel,
    updateChannel,
    deleteChannel
  };
} 