import React from "react";
import { Channel } from "../../types";

interface ChannelListProps {
  channels: Channel[];
  onSelectChannel: (channel: Channel) => void;
}

export const ChannelList: React.FC<ChannelListProps> = ({
  channels,
  onSelectChannel,
}) => {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Canais de Comunicação</h2>
      <div className="space-y-2">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className="flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-gray-50"
            onClick={() => onSelectChannel(channel)}
          >
            <div className="flex items-center">
              <div className="mr-3">
                {channel.type === "whatsapp" && (
                  <span className="text-green-500">WhatsApp</span>
                )}
                {channel.type === "email" && (
                  <span className="text-blue-500">Email</span>
                )}
                {channel.type === "chat" && (
                  <span className="text-purple-500">Chat</span>
                )}
                {channel.type === "sms" && (
                  <span className="text-orange-500">SMS</span>
                )}
                {channel.type === "push" && (
                  <span className="text-red-500">Push</span>
                )}
              </div>
              <div>
                <h3 className="font-medium">{channel.name}</h3>
              </div>
            </div>
            <div>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  channel.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {channel.status === "active" ? "Ativo" : "Inativo"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
