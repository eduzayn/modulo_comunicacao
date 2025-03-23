'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function InboxSettingsPage() {
  const router = useRouter();
  
  const settingsModules = [
    {
      title: "Canais",
      description: "Configurar canais de comunicação como WhatsApp, E-mail, Facebook, etc.",
      href: "/settings/channels",
    },
    {
      title: "Frases Rápidas",
      description: "Gerenciar respostas prontas para uso rápido em atendimentos",
      href: "/settings/quick-phrases",
    },
    {
      title: "Tags",
      description: "Configurar etiquetas para categorizar e organizar conversas",
      href: "/settings/tags",
    },
    {
      title: "Horários de Atendimento",
      description: "Definir períodos de funcionamento e mensagens automáticas",
      href: "/settings/business-hours",
    },
  ];

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Configurações da Caixa de Entrada</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {settingsModules.map((module) => (
          <Card key={module.href} className="border hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle className="text-lg">{module.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm mb-4">{module.description}</CardDescription>
              <Button 
                variant="outline" 
                className="w-full justify-between" 
                onClick={() => router.push(module.href)}
              >
                Configurar
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 