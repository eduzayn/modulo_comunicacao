import { Channel } from "../types";

export const getChannels = async (): Promise<Channel[]> => {
  // This would be replaced with an actual API call
  return [
    {
      id: "1",
      name: "WhatsApp Institucional",
      type: "whatsapp",
      status: "active",
      config: {
        phoneNumber: "+5511999999999",
        apiKey: "sample-api-key",
      },
    },
    {
      id: "2",
      name: "Email Marketing",
      type: "email",
      status: "active",
      config: {
        smtpServer: "smtp.example.com",
        username: "marketing@example.com",
      },
    },
    {
      id: "3",
      name: "Chat do Site",
      type: "chat",
      status: "active",
      config: {
        widgetId: "chat-widget-123",
      },
    },
    {
      id: "4",
      name: "SMS Notificações",
      type: "sms",
      status: "inactive",
      config: {
        provider: "twilio",
        accountSid: "sample-account-sid",
      },
    },
  ];
};

export const createChannel = async (channel: Omit<Channel, "id">): Promise<Channel> => {
  // This would be replaced with an actual API call
  return {
    id: Math.random().toString(36).substring(7),
    ...channel,
  };
};

export const updateChannel = async (channel: Channel): Promise<Channel> => {
  // This would be replaced with an actual API call
  return channel;
};

export const deleteChannel = async (channelId: string): Promise<boolean> => {
  // This would be replaced with an actual API call
  return true;
};
