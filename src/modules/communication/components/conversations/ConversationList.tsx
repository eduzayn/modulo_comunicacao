import React from "react";
import { Conversation } from "../../types";

interface ConversationListProps {
  conversations: Conversation[];
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversationId?: string;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  onSelectConversation,
  selectedConversationId,
}) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Conversas</h2>
      </div>
      <div className="divide-y">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`p-4 cursor-pointer hover:bg-gray-50 ${
              selectedConversationId === conversation.id
                ? "bg-blue-50 border-l-4 border-blue-500"
                : ""
            }`}
            onClick={() => onSelectConversation(conversation)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">
                  {conversation.participants.join(", ")}
                </h3>
                <p className="text-sm text-gray-500">
                  {conversation.messages.length > 0
                    ? conversation.messages[conversation.messages.length - 1].content.substring(0, 50) + "..."
                    : "Sem mensagens"}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-500">
                  {new Date(conversation.updatedAt).toLocaleTimeString()}
                </span>
                <span
                  className={`mt-1 px-2 py-1 text-xs rounded-full ${
                    conversation.status === "open"
                      ? "bg-green-100 text-green-800"
                      : conversation.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {conversation.status === "open"
                    ? "Aberta"
                    : conversation.status === "pending"
                    ? "Pendente"
                    : "Fechada"}
                </span>
                <span
                  className={`mt-1 px-2 py-1 text-xs rounded-full ${
                    conversation.priority === "high"
                      ? "bg-red-100 text-red-800"
                      : conversation.priority === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {conversation.priority === "high"
                    ? "Alta"
                    : conversation.priority === "medium"
                    ? "Média"
                    : "Baixa"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
