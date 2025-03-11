'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  SkipLink, 
  VisuallyHidden, 
  LiveRegion, 
  AccessibleIcon,
  FocusTrap,
  FormLabel,
  ErrorMessage,
  Description
} from './a11y-improvements';

/**
 * Example component showcasing accessibility improvements
 */
export function AccessibilityExamples() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formStatus, setFormStatus] = React.useState<string | null>(null);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setFormStatus('Formulário enviado com sucesso!');
      
      // Clear status after 3 seconds
      setTimeout(() => {
        setFormStatus(null);
      }, 3000);
    }, 1500);
  };
  
  const simulateError = () => {
    setFormErrors({
      name: 'O nome é obrigatório',
      email: 'O email informado não é válido'
    });
  };
  
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Exemplos de Acessibilidade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Skip Link Example */}
          <section className="border-b pb-4">
            <h3 className="text-lg font-medium mb-2">Skip Link</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Links de salto permitem que usuários de teclado pulem diretamente para o conteúdo principal.
              Pressione Tab para ver o link de salto.
            </p>
            <div className="relative border p-4 rounded-md">
              <SkipLink href="#main-content" />
              <div className="mb-4">Conteúdo de cabeçalho</div>
              <div id="main-content" tabIndex={-1} className="p-4 bg-muted rounded-md">
                Conteúdo principal
              </div>
            </div>
          </section>
          
          {/* Visually Hidden Example */}
          <section className="border-b pb-4">
            <h3 className="text-lg font-medium mb-2">Conteúdo Visualmente Oculto</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Texto visualmente oculto que é acessível para leitores de tela.
            </p>
            <div className="border p-4 rounded-md">
              <Button>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="mr-2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <VisuallyHidden>Baixar</VisuallyHidden>
                Arquivo
              </Button>
            </div>
          </section>
          
          {/* Live Region Example */}
          <section className="border-b pb-4">
            <h3 className="text-lg font-medium mb-2">Região Dinâmica (Live Region)</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Regiões dinâmicas anunciam mudanças para leitores de tela.
            </p>
            <div className="border p-4 rounded-md">
              <div className="mb-4">
                <Button 
                  onClick={() => {
                    setIsSubmitting(true);
                    setTimeout(() => setIsSubmitting(false), 1500);
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processando...' : 'Simular Processamento'}
                </Button>
              </div>
              
              <LiveRegion aria-live="polite" className="text-sm">
                {isSubmitting && <p>Processando sua solicitação...</p>}
                {formStatus && <p className="text-green-600">{formStatus}</p>}
              </LiveRegion>
            </div>
          </section>
          
          {/* Accessible Icon Example */}
          <section className="border-b pb-4">
            <h3 className="text-lg font-medium mb-2">Ícones Acessíveis</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Ícones com rótulos acessíveis para leitores de tela.
            </p>
            <div className="border p-4 rounded-md flex space-x-4">
              <Button variant="outline" size="icon">
                <AccessibleIcon label="Configurações">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                </AccessibleIcon>
              </Button>
              
              <Button variant="outline" size="icon">
                <AccessibleIcon label="Notificações">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </AccessibleIcon>
              </Button>
            </div>
          </section>
          
          {/* Enhanced Form Example */}
          <section>
            <h3 className="text-lg font-medium mb-2">Formulário Acessível</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Formulário com melhorias de acessibilidade.
            </p>
            <div className="border p-4 rounded-md">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <FormLabel htmlFor="name" required>Nome</FormLabel>
                  <Input 
                    id="name" 
                    aria-describedby="name-description name-error"
                    aria-invalid={!!formErrors.name}
                  />
                  <Description id="name-description">
                    Informe seu nome completo
                  </Description>
                  {formErrors.name && (
                    <ErrorMessage id="name-error">
                      {formErrors.name}
                    </ErrorMessage>
                  )}
                </div>
                
                <div className="space-y-2">
                  <FormLabel htmlFor="email" required>Email</FormLabel>
                  <Input 
                    id="email" 
                    type="email" 
                    aria-describedby="email-description email-error"
                    aria-invalid={!!formErrors.email}
                  />
                  <Description id="email-description">
                    Usaremos seu email para contato
                  </Description>
                  {formErrors.email && (
                    <ErrorMessage id="email-error">
                      {formErrors.email}
                    </ErrorMessage>
                  )}
                </div>
                
                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox id="terms" />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="terms" className="text-sm font-medium leading-none">
                      Aceito os termos e condições
                    </Label>
                  </div>
                </div>
                
                <div className="flex space-x-2 pt-2">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Enviando...' : 'Enviar'}
                  </Button>
                  <Button type="button" variant="outline" onClick={simulateError}>
                    Simular Erro
                  </Button>
                </div>
              </form>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
