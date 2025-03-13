'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { useAISettings } from '@/hooks/use-ai-settings';

const aiSettingsSchema = z.object({
  model: z.string().min(1, { message: 'O modelo é obrigatório' }),
  temperature: z.number().min(0).max(1),
  maxTokens: z.number().min(1).max(4000),
  autoRespond: z.boolean(),
  sentimentAnalysis: z.boolean(),
  suggestResponses: z.boolean(),
});

type AISettingsFormValues = z.infer<typeof aiSettingsSchema>;

export function AISettingsForm() {
  const { aiSettings, isLoading, error, updateAISettings } = useAISettings();
  const { toast } = useToast();
  
  const form = useForm<AISettingsFormValues>({
    resolver: zodResolver(aiSettingsSchema),
    defaultValues: {
      model: aiSettings?.model || 'gpt-3.5-turbo',
      temperature: aiSettings?.temperature || 0.7,
      maxTokens: aiSettings?.maxTokens || 1000,
      autoRespond: aiSettings?.autoRespond || false,
      sentimentAnalysis: aiSettings?.sentimentAnalysis || true,
      suggestResponses: aiSettings?.suggestResponses || true,
    },
  });
  
  React.useEffect(() => {
    if (aiSettings) {
      form.reset({
        model: aiSettings.model,
        temperature: aiSettings.temperature,
        maxTokens: aiSettings.maxTokens,
        autoRespond: aiSettings.autoRespond,
        sentimentAnalysis: aiSettings.sentimentAnalysis,
        suggestResponses: aiSettings.suggestResponses,
      });
    }
  }, [aiSettings, form]);
  
  const onSubmit = async (data: AISettingsFormValues) => {
    try {
      await updateAISettings(data);
      toast({
        title: 'Configurações salvas',
        description: 'As configurações de IA foram atualizadas com sucesso.',
      });
    } catch (error) {
      console.error('Error updating AI settings:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar as configurações de IA.',
        variant: 'destructive',
      });
    }
  };
  
  if (isLoading) {
    return <div className="flex justify-center p-8">Carregando configurações...</div>;
  }
  
  if (error) {
    return <div className="text-red-500 p-8">Erro ao carregar configurações: {error.message}</div>;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Inteligência Artificial</CardTitle>
        <CardDescription>
          Configure os parâmetros da IA para personalizar o comportamento do assistente virtual.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo de IA</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Modelo de linguagem a ser utilizado (ex: gpt-3.5-turbo, gpt-4)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="temperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperatura: {field.value.toFixed(1)}</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={1}
                      step={0.1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                  <FormDescription>
                    Controla a aleatoriedade das respostas (0 = mais determinístico, 1 = mais criativo)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="maxTokens"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Máximo de Tokens</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={4000}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Limite máximo de tokens para as respostas geradas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="autoRespond"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Respostas Automáticas</FormLabel>
                      <FormDescription>
                        Ativar respostas automáticas para mensagens recebidas
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sentimentAnalysis"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Análise de Sentimento</FormLabel>
                      <FormDescription>
                        Analisar o sentimento das mensagens recebidas
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="suggestResponses"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Sugestões de Resposta</FormLabel>
                      <FormDescription>
                        Gerar sugestões de resposta para mensagens recebidas
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit">Salvar Configurações</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
