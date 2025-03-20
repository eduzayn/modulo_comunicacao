'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ReportsSettingsPage() {
  const router = useRouter();
  
  const settingsModules = [
    {
      title: "Painéis Personalizados",
      description: "Configurar dashboards e métricas específicas para sua empresa",
      href: "/settings/reports/dashboards",
    },
    {
      title: "Integrações",
      description: "Conectar o sistema com ferramentas de análise e BI",
      href: "/settings/integrations",
    },
    {
      title: "Relatórios Agendados",
      description: "Configurar entrega automática de relatórios por e-mail",
      href: "/settings/reports/schedule",
    },
    {
      title: "Exportação de Dados",
      description: "Definir formatos e opções para exportação de relatórios",
      href: "/settings/reports/export",
    },
  ];

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Configurações de Relatórios</h1>
      
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