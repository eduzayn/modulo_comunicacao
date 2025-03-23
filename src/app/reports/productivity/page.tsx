import { PageContainer } from '@/components/page-container/page-container'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AreaChart, BarChart, BarChartHorizontal } from '@/components/ui/charts'
import { ActivityLog } from '@/components/reports/activity-log'
import { 
  AvatarImage, 
  AvatarFallback, 
  Avatar 
} from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CalendarIcon, ArrowUpRight, ArrowDownRight, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Dados de exemplo para o relatório de produtividade
const weeklyData = [
  { dia: 'Segunda', atendimentos: 45, tempoMedio: 12 },
  { dia: 'Terça', atendimentos: 52, tempoMedio: 10 },
  { dia: 'Quarta', atendimentos: 49, tempoMedio: 11 },
  { dia: 'Quinta', atendimentos: 60, tempoMedio: 9 },
  { dia: 'Sexta', atendimentos: 55, tempoMedio: 14 },
  { dia: 'Sábado', atendimentos: 40, tempoMedio: 8 },
  { dia: 'Domingo', atendimentos: 28, tempoMedio: 7 },
]

const monthlyData = [
  { mes: 'Jan', atendimentos: 320, tempoMedio: 14 },
  { mes: 'Fev', atendimentos: 310, tempoMedio: 13 },
  { mes: 'Mar', atendimentos: 350, tempoMedio: 12 },
  { mes: 'Abr', atendimentos: 380, tempoMedio: 11 },
  { mes: 'Mai', atendimentos: 400, tempoMedio: 10 },
  { mes: 'Jun', atendimentos: 390, tempoMedio: 11 },
]

// Dados de produtividade por operador
const operatorsData = [
  { nome: 'Ana Silva', atendimentos: 78, tempoMedio: 8, satisfacao: 92 },
  { nome: 'Carlos Santos', atendimentos: 65, tempoMedio: 12, satisfacao: 88 },
  { nome: 'Juliana Lima', atendimentos: 82, tempoMedio: 7, satisfacao: 95 },
  { nome: 'Roberto Alves', atendimentos: 71, tempoMedio: 9, satisfacao: 90 },
  { nome: 'Fernanda Costa', atendimentos: 68, tempoMedio: 10, satisfacao: 89 },
]

export const metadata = {
  title: 'Relatório de Produtividade | Sistema de Comunicação',
  description: 'Análise de produtividade dos atendentes e performance do sistema'
}

export default function ProductivityPage() {
  return (
    <PageContainer
      title="Produtividade"
      description="Análise de produtividade dos operadores e tempos de atendimento"
      breadcrumbItems={[
        { href: '/reports', label: 'Relatórios' },
        { href: '/reports/productivity', label: 'Produtividade' }
      ]}
    >
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Relatório de Produtividade</h1>
          <p className="text-muted-foreground">
            Análise de desempenho da equipe e métricas de produtividade do sistema
          </p>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Select defaultValue="30">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 dias</SelectItem>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="90">Últimos 90 dias</SelectItem>
                <SelectItem value="year">Este ano</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm" className="gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>Escolher data</span>
            </Button>
          </div>
          
          <Button>Exportar Relatório</Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Total de Atendimentos</CardTitle>
              <CardDescription>Conversas atendidas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">4.752</div>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <ArrowUpRight className="h-4 w-4" />
                    <span>12%</span>
                    <span className="text-muted-foreground">vs período anterior</span>
                  </div>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <AreaChart
                className="h-24 mt-4"
                data={[120, 130, 145, 150, 165, 142, 139, 155, 170, 180, 175, 190, 185, 195, 220, 210, 215, 225, 205, 215, 230, 235, 220, 225, 240, 235, 250, 260, 250, 255]}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Tempo Médio de Atendimento</CardTitle>
              <CardDescription>Em minutos por atendimento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">8,5</div>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <ArrowDownRight className="h-4 w-4" />
                    <span>5%</span>
                    <span className="text-muted-foreground">vs período anterior</span>
                  </div>
                </div>
                <CalendarIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <AreaChart
                className="h-24 mt-4"
                data={[13.2, 12.8, 12.5, 12.0, 11.5, 10.8, 10.2, 9.8, 9.5, 9.2, 9.0, 8.8, 8.5, 8.7, 8.5]}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Taxa de Resolução</CardTitle>
              <CardDescription>Atendimentos resolvidos no primeiro contato</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">72%</div>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <ArrowUpRight className="h-4 w-4" />
                    <span>3%</span>
                    <span className="text-muted-foreground">vs período anterior</span>
                  </div>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <AreaChart
                className="h-24 mt-4"
                data={[62, 63, 65, 68, 67, 69, 70, 71, 72]}
                color="hsl(var(--success))"
              />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="team" className="space-y-4">
          <TabsList>
            <TabsTrigger value="team">Desempenho da Equipe</TabsTrigger>
            <TabsTrigger value="channels">Canais</TabsTrigger>
            <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
            <TabsTrigger value="logs">Logs de Atividade</TabsTrigger>
          </TabsList>
          
          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Desempenho dos Atendentes</CardTitle>
                <CardDescription>
                  Métricas de produtividade por atendente no período selecionado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Atendente</TableHead>
                      <TableHead>Atendimentos</TableHead>
                      <TableHead>Tempo Médio</TableHead>
                      <TableHead>Avaliação</TableHead>
                      <TableHead>Resolução</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                          <span>João Silva</span>
                        </div>
                      </TableCell>
                      <TableCell>648</TableCell>
                      <TableCell>7,2 min</TableCell>
                      <TableCell>4,8 ★</TableCell>
                      <TableCell>82%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                            <AvatarFallback>MC</AvatarFallback>
                          </Avatar>
                          <span>Maria Carvalho</span>
                        </div>
                      </TableCell>
                      <TableCell>572</TableCell>
                      <TableCell>8,1 min</TableCell>
                      <TableCell>4,7 ★</TableCell>
                      <TableCell>78%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                            <AvatarFallback>AS</AvatarFallback>
                          </Avatar>
                          <span>André Santos</span>
                        </div>
                      </TableCell>
                      <TableCell>534</TableCell>
                      <TableCell>7,8 min</TableCell>
                      <TableCell>4,9 ★</TableCell>
                      <TableCell>85%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                            <AvatarFallback>CB</AvatarFallback>
                          </Avatar>
                          <span>Carolina Barbosa</span>
                        </div>
                      </TableCell>
                      <TableCell>498</TableCell>
                      <TableCell>9,2 min</TableCell>
                      <TableCell>4,6 ★</TableCell>
                      <TableCell>76%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                            <AvatarFallback>LP</AvatarFallback>
                          </Avatar>
                          <span>Lucas Pereira</span>
                        </div>
                      </TableCell>
                      <TableCell>462</TableCell>
                      <TableCell>8,5 min</TableCell>
                      <TableCell>4,7 ★</TableCell>
                      <TableCell>79%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="channels">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Volume por Canal</CardTitle>
                  <CardDescription>Distribuição de atendimentos por canal</CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChartHorizontal
                    className="h-80"
                    data={[
                      { name: "WhatsApp", value: 2547 },
                      { name: "Chat Web", value: 1238 },
                      { name: "Email", value: 685 },
                      { name: "Facebook", value: 210 },
                      { name: "Instagram", value: 72 }
                    ]}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Tempo Médio por Canal</CardTitle>
                  <CardDescription>Tempo médio de resolução por canal (minutos)</CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChartHorizontal
                    className="h-80"
                    data={[
                      { name: "Email", value: 18.2 },
                      { name: "Facebook", value: 12.4 },
                      { name: "Instagram", value: 9.8 },
                      { name: "Chat Web", value: 7.5 },
                      { name: "WhatsApp", value: 6.3 }
                    ]}
                    color="hsl(var(--warning))"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Período</CardTitle>
                <CardDescription>Volume de atendimentos por hora do dia</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  height={250}
                  showLabels={true}
                  showGrid={true}
                  data={[
                    32, 28, 15, 8, 5, 12, 45, 86, 132, 178, 215, 232, 
                    208, 197, 210, 225, 198, 165, 142, 105, 82, 64, 53, 42
                  ]}
                />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i}>{`${i * 2}h`}</div>
                  ))}
                  <div>22h</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Registros de Atividade</CardTitle>
                <CardDescription>
                  Logs relacionados à produtividade do sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ActivityLog limit={15} showFilters={true} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  )
} 