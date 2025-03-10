'use client';

import { useAISettings } from '@/hooks/use-ai-settings';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';

const aiSettingsSchema = z.object({
  model: z.string().min(1, 'Modelo é obrigatório'),
  temperature: z.number().min(0).max(1),
  maxTokens: z.number().min(1),
  autoRespond: z.boolean(),
  sentimentAnalysis: z.boolean(),
  suggestResponses: z.boolean(),
});

type AISettingsFormValues = z.infer<typeof aiSettingsSchema>;

export default function AISettingsPage() {
  const { settings, isLoading, error, updateSettings } = useAISettings();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  
  const form = useForm<AISettingsFormValues>({
    resolver: zodResolver(aiSettingsSchema),
    defaultValues: {
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 2000,
      autoRespond: false,
      sentimentAnalysis: true,
      suggestResponses: true,
    },
  });
  
  // Update form when settings are loaded
  if (settings && !form.formState.isDirty) {
    form.reset(settings);
  }
  
  const onSubmit = async (data: AISettingsFormValues) => {
    setSaveStatus('saving');
    
    try {
      await updateSettings(data);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
    }
  };
  
  if (isLoading) {
    return <div className="text-center py-10">Carregando configurações...</div>;
  }
  
  if (error) {
    return <div className="text-center py-10 text-red-500">Erro ao carregar configurações</div>;
  }
  
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Configurações de IA</h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure os modelos de IA para automação de respostas e análise de sentimento.
          </p>
        </div>
      </div>
      
      <div className="mt-6">
        <Card className="overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modelo de IA</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um modelo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                          <SelectItem value="gpt-4">GPT-4</SelectItem>
                          <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Selecione o modelo de IA para processamento de mensagens.
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
                      <FormLabel>Temperatura: {field.value}</FormLabel>
                      <FormControl>
                        <Slider
                          min={0}
                          max={1}
                          step={0.1}
                          value={[field.value]}
                          onValueChange={(values) => field.onChange(values[0])}
                        />
                      </FormControl>
                      <FormDescription>
                        Controla a aleatoriedade das respostas. Valores mais baixos são mais determinísticos.
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
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Limite máximo de tokens para respostas geradas.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="autoRespond"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Resposta Automática</FormLabel>
                        <FormDescription>
                          Ativar respostas automáticas para mensagens recebidas.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="sentimentAnalysis"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Análise de Sentimento</FormLabel>
                        <FormDescription>
                          Analisar o sentimento das mensagens recebidas.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="suggestResponses"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Sugestões de Resposta</FormLabel>
                        <FormDescription>
                          Sugerir respostas rápidas para mensagens recebidas.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={saveStatus === 'saving'}>
                    {saveStatus === 'saving' ? 'Salvando...' : 'Salvar Configurações'}
                  </Button>
                </div>
                
                {saveStatus === 'success' && (
                  <div className="p-3 bg-green-100 text-green-800 rounded-md">
                    Configurações salvas com sucesso!
                  </div>
                )}
                
                {saveStatus === 'error' && (
                  <div className="p-3 bg-red-100 text-red-800 rounded-md">
                    Erro ao salvar configurações. Tente novamente.
                  </div>
                )}
              </form>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
}
