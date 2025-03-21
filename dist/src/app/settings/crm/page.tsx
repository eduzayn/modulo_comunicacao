'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CRMSettingsPage() {
  const router = useRouter();
  
  const settingsModules = [
    {
      title: "Funis de Vendas",
      description: "Configurar pipelines e etapas de vendas para seu negócio",
      href: "/settings/pipelines",
    },
    {
      title: "Campos Personalizados",
      description: "Adicionar campos específicos para prospectos e oportunidades",
      href: "/settings/custom-fields",
    },
    {
      title: "Regras de Atribuição",
      description: "Definir como leads e negociações são atribuídos à equipe",
      href: "/settings/assignment-rules",
    },
    {
      title: "Automações",
      description: "Configurar fluxos automáticos para processos de vendas",
      href: "/settings/automations",
    },
  ];

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Configurações do CRM</h1>
      
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