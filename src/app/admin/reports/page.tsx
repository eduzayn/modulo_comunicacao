import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, AreaChart } from '@/components/ui/charts';
import { CalendarDays, Download, Filter, Share2 } from 'lucide-react';

export const metadata = {
  title: 'Administrative Reports | Communication System',
  description: 'View and export system reports and metrics',
};

export default function ReportsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Relatórios Administrativos</h1>
          <p className="text-muted-foreground">
            Visualize e exporte métricas e estatísticas do sistema
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span>Este mês</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total de Mensagens</CardTitle>
            <CardDescription>Últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12.543</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao período anterior
            </p>
            <AreaChart
              className="h-32 mt-4"
              data={[10, 24, 18, 42, 36, 29, 42, 55, 44, 38, 52, 46, 55, 62, 58, 60, 65, 59, 53, 68, 72, 80, 76, 83, 78, 84, 88, 92, 98, 110]}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Usuários Ativos</CardTitle>
            <CardDescription>Diariamente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">
              +8% em relação ao período anterior
            </p>
            <BarChart
              className="h-32 mt-4"
              data={[30, 28, 35, 32, 34, 28, 36, 38, 39, 40, 35, 42, 44, 40, 42]}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Tempo Médio de Resposta</CardTitle>
            <CardDescription>Em minutos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5,2</div>
            <p className="text-xs text-muted-foreground">
              -8% em relação ao período anterior
            </p>
            <BarChart
              className="h-32 mt-4"
              data={[8.1, 7.8, 7.2, 6.9, 7.1, 6.5, 6.2, 5.9, 6.1, 5.8, 5.6, 5.4, 5.7, 5.3, 5.2]}
            />
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="mensagens" className="space-y-4">
        <TabsList>
          <TabsTrigger value="mensagens">Mensagens</TabsTrigger>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mensagens" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Mensagens</CardTitle>
              <CardDescription>
                Volume de mensagens por canal de comunicação
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">Gráfico detalhado de mensagens</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">Atualizado em: 15/03/2023</p>
              <Button variant="outline" size="sm">Exportar Dados</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="usuarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Usuários</CardTitle>
              <CardDescription>
                Atividade e engajamento dos usuários no sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">Gráfico detalhado de usuários</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">Atualizado em: 15/03/2023</p>
              <Button variant="outline" size="sm">Exportar Dados</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Performance</CardTitle>
              <CardDescription>
                Métricas de performance e disponibilidade do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">Gráfico detalhado de performance</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">Atualizado em: 15/03/2023</p>
              <Button variant="outline" size="sm">Exportar Dados</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="financeiro" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatório Financeiro</CardTitle>
              <CardDescription>
                Análise financeira e custos operacionais
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">Gráfico financeiro detalhado</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">Atualizado em: 15/03/2023</p>
              <Button variant="outline" size="sm">Exportar Dados</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Relatórios Programados</CardTitle>
            <CardDescription>
              Relatórios configurados para geração automática
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Relatório Semanal de Atividades</h3>
                    <p className="text-sm text-muted-foreground">Enviado toda segunda-feira às 08:00</p>
                  </div>
                  <Button variant="outline" size="sm">Editar</Button>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Relatório Mensal de Performance</h3>
                    <p className="text-sm text-muted-foreground">Enviado no primeiro dia do mês às 07:00</p>
                  </div>
                  <Button variant="outline" size="sm">Editar</Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Criar Novo Relatório Programado</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Relatórios Recentes</CardTitle>
            <CardDescription>
              Últimos relatórios gerados pelo sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Relatório de Mensagens - Março 2023</h3>
                    <p className="text-sm text-muted-foreground">Gerado em 01/04/2023</p>
                  </div>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Relatório de Usuários - Março 2023</h3>
                    <p className="text-sm text-muted-foreground">Gerado em 01/04/2023</p>
                  </div>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Relatório Financeiro - Março 2023</h3>
                    <p className="text-sm text-muted-foreground">Gerado em 01/04/2023</p>
                  </div>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 