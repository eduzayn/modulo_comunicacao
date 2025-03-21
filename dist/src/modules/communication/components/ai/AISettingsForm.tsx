import React, { useState } from "react";
import { AISettings } from "../../types";

interface AISettingsFormProps {
  settings: AISettings;
  onSave: (settings: AISettings) => void;
}

export const AISettingsForm: React.FC<AISettingsFormProps> = ({
  settings,
  onSave,
}) => {
  const [formData, setFormData] = useState<AISettings>(settings);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData({
      ...formData,
      [name]: type === "checkbox" 
        ? (e.target as HTMLInputElement).checked 
        : type === "number" 
          ? parseFloat(value) 
          : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Configurações de IA</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Modelo de IA
            </label>
            <select
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="gpt-4">GPT-4</option>
              <option value="claude-2">Claude 2</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Temperatura
            </label>
            <input
              type="range"
              name="temperature"
              min="0"
              max="1"
              step="0.1"
              value={formData.temperature}
              onChange={handleChange}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Mais preciso (0)</span>
              <span>Mais criativo (1)</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Máximo de Tokens
            </label>
            <input
              type="number"
              name="maxTokens"
              min="100"
              max="4000"
              value={formData.maxTokens}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="autoRespond"
              checked={formData.autoRespond}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Responder automaticamente
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="sentimentAnalysis"
              checked={formData.sentimentAnalysis}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Análise de sentimento
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="suggestResponses"
              checked={formData.suggestResponses}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Sugerir respostas
            </label>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Salvar Configurações
          </button>
        </div>
      </form>
    </div>
  );
};
