'use client'

import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { 
  Users,
  Laptop,
  UserX,
  Music,
  GraduationCap,
  Award,
  Clock,
  HelpCircle,
  Wallet,
  Timer,
  Scroll
} from 'lucide-react'

const groups = [
  {
    id: 'sem-grupo',
    name: 'Sem grupo',
    icon: Users
  },
  {
    id: 'plataforma-unicv',
    name: 'PLATAFORMA UNICV',
    icon: Laptop
  },
  {
    id: 'desqualificados',
    name: 'DESQUALIFICADOS',
    icon: UserX
  },
  {
    id: 'secretaria-musica',
    name: 'SECRETÁRIA DE MÚSICA',
    icon: Music
  },
  {
    id: 'primeira-graduacao',
    name: 'PRIMEIRA GRADUAÇÃO UNICV',
    icon: GraduationCap
  },
  {
    id: 'analise-certificacao',
    name: 'ANÁLISE CERTIFICAÇÃO',
    icon: Award
  },
  {
    id: 'certificacao-andamento',
    name: 'CERTIFICAÇÃO EM ANDAMENTO',
    icon: Clock
  },
  {
    id: 'suporte',
    name: 'SUPORTE',
    icon: HelpCircle
  },
  {
    id: 'financeiro',
    name: 'FINANCEIRO',
    icon: Wallet
  },
  {
    id: 'apressamentos',
    name: 'APRESSAMENTOS',
    icon: Timer
  },
  {
    id: 'aguardando-diploma',
    name: 'AGUARDANDO DIPLOMA',
    icon: Scroll
  }
]

export function GroupTransfer() {
  return (
    <div className="w-full max-w-sm">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">
          Mover para grupo
        </h2>

        <Input 
          type="search"
          placeholder="Pesquisar"
          className="h-9"
        />

        <ScrollArea className="h-[400px]">
          <div className="space-y-1">
            {groups.map((group) => (
              <Button
                key={group.id}
                variant="ghost"
                className="w-full justify-start gap-2 h-12"
              >
                <group.icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{group.name}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
} 