"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ConversationWithDetails, InboxFilters } from "../types";
import { inboxService } from "../services/inbox-service";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ConversationListProps {
  filters?: InboxFilters;
  onSelect?: (conversation: ConversationWithDetails) => void;
}

export function ConversationList({ filters, onSelect }: ConversationListProps) {
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadConversations = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await inboxService.getConversations(filters);
        setConversations(data);
      } catch (err) {
        console.error("Erro ao carregar conversas:", err);
        setError("Não foi possível carregar as conversas. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();
  }, [filters]);

  const handleSelectConversation = (conversation: ConversationWithDetails) => {
    if (onSelect) {
      onSelect(conversation);
    } else {
      router.push(`/inbox/${conversation.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Carregando conversas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
        <h3 className="font-medium">Erro</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-8 px-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
        <h3 className="font-medium text-lg mb-2">Nenhuma conversa encontrada</h3>
        <p className="text-gray-500 dark:text-gray-400">
          {filters && Object.keys(filters).length > 0
            ? "Tente ajustar os filtros para ver mais resultados."
            : "Não há conversas disponíveis no momento."}
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700 border rounded-lg overflow-hidden">
      {conversations.map((conversation) => (
        <button
          key={conversation.id}
          onClick={() => handleSelectConversation(conversation)}
          className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-start space-x-4"
        >
          {/* Avatar */}
          <div className="relative">
            <img
              src={conversation.contact.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.contact.name)}`}
              alt={conversation.contact.name}
              className="h-12 w-12 rounded-full"
            />
            {conversation.unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {conversation.unreadCount}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h3 className="font-medium truncate">{conversation.contact.name}</h3>
              <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                {conversation.lastMessage
                  ? formatDistanceToNow(new Date(conversation.lastMessage.createdAt), {
                      addSuffix: true,
                      locale: ptBR,
                    })
                  : formatDistanceToNow(new Date(conversation.createdAt), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
              </span>
            </div>

            {/* Channel type and status */}
            <div className="flex gap-2 items-center text-xs mt-1">
              <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 capitalize">
                {conversation.channelType}
              </span>
              {conversation.status !== 'active' && (
                <span className={`px-2 py-0.5 rounded-full capitalize ${
                  conversation.status === 'archived' 
                    ? 'bg-gray-200 dark:bg-gray-600' 
                    : 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100'
                }`}>
                  {conversation.status}
                </span>
              )}
            </div>

            {/* Last message */}
            {conversation.lastMessage && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                {conversation.lastMessage.senderType === 'user' ? 'Você: ' : ''}
                {conversation.lastMessage.content}
              </p>
            )}

            {/* Tags */}
            {conversation.tagObjects && conversation.tagObjects.length > 0 && (
              <div className="flex mt-2 gap-1 flex-wrap">
                {conversation.tagObjects.slice(0, 3).map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center text-xs px-2 py-0.5 rounded-full"
                    style={{ 
                      backgroundColor: `${tag.color}20`, 
                      color: tag.color 
                    }}
                  >
                    {tag.name}
                  </span>
                ))}
                {conversation.tagObjects.length > 3 && (
                  <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700">
                    +{conversation.tagObjects.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
} 