'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Template } from '@/types/index';

interface TemplatePreviewProps {
  template: Template;
  variables?: Record<string, string>;
}

export function TemplatePreview({ template, variables = {} }: TemplatePreviewProps) {
  const [previewVariables, setPreviewVariables] = useState<Record<string, string>>(
    template.variables.reduce((acc, variable) => {
      acc[variable] = variables[variable] || '';
      return acc;
    }, {} as Record<string, string>)
  );
  
  const handleVariableChange = (variable: string, value: string) => {
    setPreviewVariables((prev) => ({
      ...prev,
      [variable]: value,
    }));
  };
  
  const renderPreview = () => {
    let content = template.content;
    
    // Replace variables in the content
    Object.entries(previewVariables).forEach(([key, value]) => {
      content = content.replace(new RegExp(`{{${key}}}`, 'g'), value || `[${key}]`);
    });
    
    return content;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visualização do Template</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {template.variables.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Variáveis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {template.variables.map((variable) => (
                  <div key={variable} className="flex items-center space-x-2">
                    <span className="text-sm font-medium min-w-24">{variable}:</span>
                    <input
                      type="text"
                      value={previewVariables[variable] || ''}
                      onChange={(e) => handleVariableChange(variable, e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder={`Valor para ${variable}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Resultado</h3>
            <div className="p-4 border rounded-md whitespace-pre-wrap">
              {renderPreview()}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => 
                setPreviewVariables(
                  template.variables.reduce((acc, variable) => {
                    acc[variable] = '';
                    return acc;
                  }, {} as Record<string, string>)
                )
              }
            >
              Limpar Variáveis
            </Button>
            <Button
              variant="outline"
              onClick={() => 
                setPreviewVariables(
                  template.variables.reduce((acc, variable) => {
                    acc[variable] = `[Exemplo de ${variable}]`;
                    return acc;
                  }, {} as Record<string, string>)
                )
              }
            >
              Preencher com Exemplos
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
