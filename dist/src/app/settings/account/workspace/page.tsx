'use client'

import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { UploadAvatar } from '@/components/ui/upload-avatar'

interface WorkspacePreference {
  id: string
  title: string
  description: string
  defaultChecked: boolean
}

const preferences: WorkspacePreference[] = [
  {
    id: 'resolve-message',
    title: 'Mensagem ao resolver conversa',
    description: 'Envia um texto automaticamente quando o agente resolve a conversa',
    defaultChecked: false,
  },
  {
    id: 'preserve-tags',
    title: 'Preservar tags ao resolver uma conversa',
    description: 'Nova sessão do mesmo contato automaticamente herda tags da sessão anterior',
    defaultChecked: true,
  },
  {
    id: 'agent-name',
    title: 'Enviar nome do agente em cada mensagem',
    description: 'Disponível para WhatsApp e Facebook',
    defaultChecked: false,
  },
  {
    id: 'auto-assign',
    title: 'Sempre atribuir ao agente que responder',
    description: 'Atribui para quem responder mesmo se já estiver atribuído',
    defaultChecked: false,
  },
  {
    id: 'unassign-offline',
    title: 'Desatribuir ao reabrir se agente offline',
    description: 'Ao reabrir conversa se agente estiver offline, retira atribuição.',
    defaultChecked: false,
  },
  {
    id: 'public-rating',
    title: 'Nota de avaliação pública',
    description: 'Mostrar a nota de avaliação de cada agente para os demais nas salas',
    defaultChecked: true,
  },
  {
    id: 'dynamic-pending',
    title: 'Indicação dinâmica de conversa pendente',
    description: 'A cada nova mensagem não lida, o contador volta para o tempo zero, aguardando atendimento',
    defaultChecked: true,
  },
]

export default function WorkspacePage() {
  const handleUpload = async (file: File) => {
    // Aqui você implementaria a lógica de upload do arquivo
    console.log('Uploading file:', file)
  }

  const handleRemove = async () => {
    // Aqui você implementaria a lógica de remoção do arquivo
    console.log('Removing logo')
  }

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-xl font-semibold">Seu ambiente</h1>
      </div>

      <div className="space-y-6">
        <UploadAvatar
          defaultImage="/logo-zayn.png"
          fallback="ZE"
          onUpload={handleUpload}
          onRemove={handleRemove}
        />

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nome da organização</label>
            <Input
              className="mt-2"
              defaultValue="Grupo Zayn Educacional"
            />
          </div>

          <div className="space-y-4 pt-4">
            <h2 className="text-lg font-medium">Preferências</h2>
            {preferences.map((pref) => (
              <div
                key={pref.id}
                className="flex items-center justify-between space-x-4"
              >
                <div className="space-y-0.5">
                  <div className="text-sm">{pref.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {pref.description}
                  </div>
                </div>
                <Switch defaultChecked={pref.defaultChecked} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 