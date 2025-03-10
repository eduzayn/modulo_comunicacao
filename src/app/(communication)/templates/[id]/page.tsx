'use client';

import { useTemplate } from '@/app/hooks/use-templates';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../../../../components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

const templateSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  channelType: z.enum(['whatsapp', 'email', 'sms', 'chat', 'push']),
  category: z.string().optional(),
  status: z.enum(['draft', 'active', 'archived']),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

export default function TemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { template, isLoading, error, updateTemplate } = useTemplate(params?.id as string);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: '',
      content: '',
      channelType: 'whatsapp',
      category: '',
      status: 'draft',
    },
  });
  
  // Update form when template is loaded
  if (template && !form.formState.isDirty) {
    form.reset({
      name: template.name,
      content: template.content,
      channelType: template.channelType,
      category: template.category || '',
      status: template.status,
    });
  }
  
  const onSubmit = async (data: TemplateFormValues) => {
    setSaveStatus('saving');
    
    try {
      // Extract variables from content (text between {{ and }})
      const variables: string[] = [];
      const regex = /{{(.*?)}}/g;
      let match;
      
      while ((match = regex.exec(data.content)) !== null) {
        variables.push(match[1].trim());
      }
      
      try {
        await updateTemplate({
          ...data,
          variables: Array.from(new Set(variables)), // Remove duplicates
        });
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } catch (error) {
        setSaveStatus('error');
      }
    } catch (error) {
      setSaveStatus('error');
    }
  };
  
  if (isLoading) {
    return <div className="text-center py-10">Carregando template...</div>;
  }
  
  if (error || !template) {
    return <div className="text-center py-10 text-red-500">Erro ao carregar template</div>;
  }
  
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Editar Template</h1>
          <p className="mt-1 text-sm text-gray-500">
            Edite o template para mensagens automáticas.
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Voltar
        </Button>
      </div>
      
      <div className="mt-6">
        <Card className="overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Template</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Nome descritivo para identificar o template.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="channelType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Canal</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um canal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="chat">Chat</SelectItem>
                          <SelectItem value="push">Push</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Canal onde o template será utilizado.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Categoria para organizar os templates (opcional).
                      </FormDescription>
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
                            <SelectValue placeholder="Selecione um status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Rascunho</SelectItem>
                          <SelectItem value="active">Ativo</SelectItem>
                          <SelectItem value="archived">Arquivado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Status atual do template.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conteúdo</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          rows={8}
                          placeholder="Digite o conteúdo do template. Use {{variavel}} para variáveis dinâmicas."
                        />
                      </FormControl>
                      <FormDescription>
                        Conteúdo do template. Use {'{{'} variável {'}}'}  para variáveis dinâmicas.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700">Variáveis Detectadas</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {template.variables.map((variable) => (
                      <span 
                        key={variable}
                        className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                      >
                        {variable}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={saveStatus === 'saving'}>
                    {saveStatus === 'saving' ? 'Salvando...' : 'Salvar Template'}
                  </Button>
                </div>
                
                {saveStatus === 'success' && (
                  <div className="p-3 bg-green-100 text-green-800 rounded-md">
                    Template salvo com sucesso!
                  </div>
                )}
                
                {saveStatus === 'error' && (
                  <div className="p-3 bg-red-100 text-red-800 rounded-md">
                    Erro ao salvar template. Tente novamente.
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
