'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useChannels, useChannel } from '@/hooks/use-channels';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Channel, ChannelType } from '@/types/channels';

const channelFormSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  type: z.enum(['whatsapp', 'email', 'sms', 'chat', 'push']),
  status: z.enum(['active', 'inactive', 'pending']),
  config: z.record(z.unknown()).optional(),
});

type ChannelFormValues = z.infer<typeof channelFormSchema>;

interface ChannelFormProps {
  channelId?: string;
  onSuccess?: (channel: Channel) => void;
}

export function ChannelForm({ channelId, onSuccess }: ChannelFormProps) {
  const router = useRouter();
  const { createChannel } = useChannels();
  const { channel, isLoading, updateChannel } = useChannel(channelId || '');

  const form = useForm<ChannelFormValues>({
    resolver: zodResolver(channelFormSchema),
    defaultValues: {
      name: '',
      type: 'whatsapp',
      status: 'active',
      config: {},
    },
  });

  React.useEffect(() => {
    if (channel) {
      form.reset({
        name: channel.name,
        type: channel.type as ChannelType,
        status: channel.status as unknown,
        config: channel.config || {},
      });
    }
  }, [channel, form]);

  const onSubmit = async (values: ChannelFormValues) => {
    try {
      if (channelId) {
        // Update existing channel
        const updated = await updateChannel.mutateAsync(values);
        if (onSuccess) onSuccess(updated);
      } else {
        // Create new channel
        const created = await createChannel.mutateAsync(values);
        if (onSuccess) onSuccess(created);
      }
      
      router.push('/channels');
    } catch (error) {
      console.error('Failed to save channel:', error);
    }
  };

  if (channelId && isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Loading Channel...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 bg-muted rounded-md animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{channelId ? 'Edit Channel' : 'Create Channel'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Channel Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter channel name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Channel Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select channel type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="chat">Chat</SelectItem>
                      <SelectItem value="push">Push Notification</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/channels')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createChannel.isPending || updateChannel.isPending}
              >
                {createChannel.isPending || updateChannel.isPending
                  ? 'Saving...'
                  : channelId
                  ? 'Update Channel'
                  : 'Create Channel'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
