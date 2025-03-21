'use client';

import React, { useState } from "react";
import { AISettings } from "../../types";
import { Button } from "../../../../../components/ui/Button";
import { Input } from "../../../../../components/ui/input";
import { Checkbox } from "../../../../../components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { Label } from "../../../../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/Card";
import { Slider } from "../../../../../components/ui/slider";

interface AISettingsFormProps {
  settings: AISettings;
  onSave: (settings: AISettings) => void;
}

export const AISettingsForm: React.FC<AISettingsFormProps> = ({
  settings,
  onSave,
}) => {
  const [formData, setFormData] = useState<AISettings>(settings);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (
    name: keyof AISettings,
    value: string | number | boolean
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
      await onSave(formData);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de IA</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="model">Modelo de IA</Label>
            <Select
              value={formData.model}
              onValueChange={(value: string) => handleChange("model", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um modelo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="temperature">
              Temperatura: {formData.temperature}
            </Label>
            <Slider
              id="temperature"
              min={0}
              max={1}
              step={0.1}
              value={[formData.temperature]}
              onValueChange={(values: number[]) => handleChange("temperature", values[0])}
            />
            <p className="text-sm text-gray-500">
              Controla a aleatoriedade das respostas. Valores mais baixos são mais determinísticos.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxTokens">Máximo de Tokens</Label>
            <Input
              id="maxTokens"
              type="number"
              value={formData.maxTokens}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("maxTokens", Number(e.target.value))}
            />
            <p className="text-sm text-gray-500">
              Limite máximo de tokens para respostas geradas.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="autoRespond"
              checked={formData.autoRespond}
              onCheckedChange={(checked) => handleChange("autoRespond", !!checked)}
            />
            <Label htmlFor="autoRespond">Resposta Automática</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="sentimentAnalysis"
              checked={formData.sentimentAnalysis}
              onCheckedChange={(checked) => handleChange("sentimentAnalysis", !!checked)}
            />
            <Label htmlFor="sentimentAnalysis">Análise de Sentimento</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="suggestResponses"
              checked={formData.suggestResponses}
              onCheckedChange={(checked) => handleChange("suggestResponses", !!checked)}
            />
            <Label htmlFor="suggestResponses">Sugestões de Resposta</Label>
          </div>

          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
