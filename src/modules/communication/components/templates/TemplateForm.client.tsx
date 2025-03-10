'use client';

import React, { useState } from "react";
import { Template } from "../../types";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Textarea } from "../../../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { Label } from "../../../../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";

interface TemplateFormProps {
  template?: Template;
  onSave: (template: Omit<Template, 'id' | 'version'>) => void;
}

export const TemplateForm: React.FC<TemplateFormProps> = ({
  template,
  onSave,
}) => {
  const [formData, setFormData] = useState<Omit<Template, 'id' | 'version'>>({
    name: template?.name || '',
    content: template?.content || '',
    variables: template?.variables || [],
    channelType: template?.channelType || 'whatsapp',
    category: template?.category || '',
    status: template?.status || 'draft',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (
    name: keyof Omit<Template, 'id' | 'version'>,
    value: string | string[]
  ) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Extract variables from content (text between {{ and }})
      const variables: string[] = [];
      const regex = /{{(.*?)}}/g;
      let match;
      
      while ((match = regex.exec(formData.content)) !== null) {
        variables.push(match[1].trim());
      }
      
      await onSave({
        ...formData,
        variables: Array.from(new Set(variables)), // Remove duplicates
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{template ? 'Editar Template' : 'Novo Template'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Template</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("name", e.target.value)}
              placeholder="Nome do template"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="channelType">Canal</Label>
            <Select
              value={formData.channelType}
              onValueChange={(value: string) => handleChange("channelType", value as 'whatsapp' | 'email' | 'sms' | 'chat' | 'push')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um canal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="chat">Chat</SelectItem>
                <SelectItem value="push">Push</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("category", e.target.value)}
              placeholder="Categoria (opcional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: string) => handleChange("status", value as 'draft' | 'active' | 'archived')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="archived">Arquivado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange("content", e.target.value)}
              placeholder="Digite o conteúdo do template. Use {{variavel}} para variáveis dinâmicas."
              rows={8}
            />
            <p className="text-sm text-gray-500">
              Use {'{{'} variável {'}}'}  para variáveis dinâmicas.
            </p>
          </div>

          {formData.variables.length > 0 && (
            <div className="space-y-2">
              <Label>Variáveis Detectadas</Label>
              <div className="flex flex-wrap gap-2">
                {formData.variables.map((variable) => (
                  <span 
                    key={variable}
                    className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                  >
                    {variable}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar Template"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
