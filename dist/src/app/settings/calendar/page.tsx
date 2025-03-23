'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"

const formSchema = z.object({
  diasUteis: z.array(z.string()).min(1, {
    message: "Selecione pelo menos um dia útil.",
  }),
  inicioExpediente: z.string(),
  fimExpediente: z.string(),
  duracaoSlots: z.string(),
  enviarLembretes: z.boolean(),
  antecedenciaLembrete: z.string(),
  permitirAgendamentoExterno: z.boolean(),
  sincronizacaoGoogle: z.boolean(),
  sincronizacaoOutlook: z.boolean(),
  exibirFeriadosNacionais: z.boolean(),
  fusoHorario: z.string(),
})

export default function CalendarSettings() {
  const [tabValue, setTabValue] = useState<string>('geral')
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      diasUteis: ["segunda", "terca", "quarta", "quinta", "sexta"],
      inicioExpediente: "09:00",
      fimExpediente: "18:00",
      duracaoSlots: "30",
      enviarLembretes: true,
      antecedenciaLembrete: "30",
      permitirAgendamentoExterno: true,
      sincronizacaoGoogle: false,
      sincronizacaoOutlook: false,
      exibirFeriadosNacionais: true,
      fusoHorario: "America/Sao_Paulo",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // Aqui seria implementada a lógica para salvar as configurações
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Configurações do Calendário</h1>
      
      <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="integracao">Integrações</TabsTrigger>
          <TabsTrigger value="disponibilidade">Disponibilidade</TabsTrigger>
        </TabsList>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TabsContent value="geral">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações Gerais</CardTitle>
                  <CardDescription>
                    Configure as opções gerais do calendário do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="fusoHorario"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fuso Horário</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um fuso horário" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="America/Sao_Paulo">
                                Brasília (GMT-3)
                              </SelectItem>
                              <SelectItem value="America/Manaus">
                                Manaus (GMT-4)
                              </SelectItem>
                              <SelectItem value="America/Rio_Branco">
                                Rio Branco (GMT-5)
                              </SelectItem>
                              <SelectItem value="America/Noronha">
                                Fernando de Noronha (GMT-2)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Selecione o fuso horário padrão para o calendário
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="exibirFeriadosNacionais"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Exibir Feriados Nacionais
                            </FormLabel>
                            <FormDescription>
                              Mostra os feriados nacionais no calendário
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="duracaoSlots"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duração Padrão dos Slots</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a duração" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="15">15 minutos</SelectItem>
                              <SelectItem value="30">30 minutos</SelectItem>
                              <SelectItem value="45">45 minutos</SelectItem>
                              <SelectItem value="60">1 hora</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Determine a duração padrão dos slots de horário
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="integracao">
              <Card>
                <CardHeader>
                  <CardTitle>Integrações de Calendário</CardTitle>
                  <CardDescription>
                    Configure a sincronização com outros serviços de calendário
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="sincronizacaoGoogle"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Google Calendar
                          </FormLabel>
                          <FormDescription>
                            Sincronize eventos com o Google Calendar
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="sincronizacaoOutlook"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Microsoft Outlook
                          </FormLabel>
                          <FormDescription>
                            Sincronize eventos com o Microsoft Outlook
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="disponibilidade">
              <Card>
                <CardHeader>
                  <CardTitle>Disponibilidade e Agendamento</CardTitle>
                  <CardDescription>
                    Configure os horários disponíveis para agendamento
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <h3 className="text-lg font-medium">Dias úteis</h3>
                  <FormField
                    control={form.control}
                    name="diasUteis"
                    render={() => (
                      <FormItem>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {diasSemana.map((dia) => (
                            <FormField
                              key={dia.value}
                              control={form.control}
                              name="diasUteis"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={dia.value}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(dia.value)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, dia.value])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== dia.value
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {dia.label}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Separator className="my-4" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="inicioExpediente"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Início do Expediente</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormDescription>
                            Horário de início da disponibilidade
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="fimExpediente"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fim do Expediente</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormDescription>
                            Horário de fim da disponibilidade
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <h3 className="text-lg font-medium">Lembretes</h3>
                  
                  <FormField
                    control={form.control}
                    name="enviarLembretes"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Enviar Lembretes
                          </FormLabel>
                          <FormDescription>
                            Notificar automaticamente antes dos eventos
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {form.watch('enviarLembretes') && (
                    <FormField
                      control={form.control}
                      name="antecedenciaLembrete"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Antecedência do Lembrete</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a antecedência" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="10">10 minutos antes</SelectItem>
                              <SelectItem value="30">30 minutos antes</SelectItem>
                              <SelectItem value="60">1 hora antes</SelectItem>
                              <SelectItem value="120">2 horas antes</SelectItem>
                              <SelectItem value="1440">1 dia antes</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <Button type="submit" className="mt-6">Salvar Configurações</Button>
          </form>
        </Form>
      </Tabs>
    </div>
  )
}

const diasSemana = [
  { label: "Segunda-feira", value: "segunda" },
  { label: "Terça-feira", value: "terca" },
  { label: "Quarta-feira", value: "quarta" },
  { label: "Quinta-feira", value: "quinta" },
  { label: "Sexta-feira", value: "sexta" },
  { label: "Sábado", value: "sabado" },
  { label: "Domingo", value: "domingo" },
] 