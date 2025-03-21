'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InstallationSection } from './installation-section'
import { AppearanceSection } from './appearance-section'
import { TextsSection } from './texts-section'
import { FormSection } from './form-section'
import { SettingsSection } from './settings-section'

export default function WidgetSettings() {
  return (
    <Tabs defaultValue="installation" className="space-y-4">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="installation">Instalação</TabsTrigger>
        <TabsTrigger value="appearance">Aparência</TabsTrigger>
        <TabsTrigger value="texts">Textos</TabsTrigger>
        <TabsTrigger value="form">Formulário</TabsTrigger>
        <TabsTrigger value="settings">Ajustes</TabsTrigger>
      </TabsList>
      
      <TabsContent value="installation" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Instalação Manual</CardTitle>
            <CardDescription>
              Copie e cole este código antes da tag &lt;/body&gt; em todas as páginas do seu site.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InstallationSection />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="appearance" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Aparência</CardTitle>
            <CardDescription>
              Personalize a aparência do seu widget de chat.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AppearanceSection />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="texts" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Textos</CardTitle>
            <CardDescription>
              Personalize os textos exibidos no widget.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TextsSection />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="form" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Formulário</CardTitle>
            <CardDescription>
              Configure o formulário pré-chat que permite coletar informações do visitante antes do início do chat.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormSection />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="settings" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Ajustes</CardTitle>
            <CardDescription>
              Configure opções adicionais para o seu widget.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SettingsSection />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
} 