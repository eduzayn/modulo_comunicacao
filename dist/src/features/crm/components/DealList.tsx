'use client'

import { useEffect } from 'react'
import { useDeals } from '../hooks/use-deals'
import { formatCurrency, getStageLabel } from '../types/crm.types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Plus, Trash2 } from 'lucide-react'

interface DealListProps {
  contactId: string
  onAddDeal?: () => void
  onDeleteDeal?: (id: string) => void
}

/**
 * Componente para listar negociações de um contato
 */
export function DealList({ contactId, onAddDeal, onDeleteDeal }: DealListProps) {
  const {
    deals,
    isLoading,
    error,
    fetchDealsByContact,
    changeDealStage,
    removeDeal
  } = useDeals()

  // Carregar negociações ao inicializar ou mudar o contato
  useEffect(() => {
    if (contactId) {
      fetchDealsByContact(contactId)
    }
  }, [contactId, fetchDealsByContact])

  // Manipular a mudança de estágio
  const handleStageChange = async (dealId: string, stage: string) => {
    try {
      await changeDealStage(dealId, stage)
    } catch (error) {
      console.error('Erro ao atualizar estágio:', error)
    }
  }

  // Manipular a exclusão de uma negociação
  const handleDelete = async (dealId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta negociação?')) {
      try {
        await removeDeal(dealId)
        if (onDeleteDeal) onDeleteDeal(dealId)
      } catch (error) {
        console.error('Erro ao excluir negociação:', error)
      }
    }
  }

  // Obter a cor do badge de acordo com o estágio
  const getStageBadgeVariant = (stage: string) => {
    const stageMap: Record<string, 'default' | 'secondary' | 'outline' | 'destructive' | 'success'> = {
      'lead': 'default',
      'qualification': 'secondary',
      'proposal': 'outline',
      'negotiation': 'secondary',
      'closed-won': 'success',
      'closed-lost': 'destructive'
    }
    
    return stageMap[stage] || 'default'
  }

  // Badge customizado para estágios
  const StageBadge = ({ stage }: { stage: string }) => {
    // Definindo cores personalizadas para cada estágio
    let className = 'text-xs'
    
    switch(stage) {
      case 'lead':
        className += ' bg-blue-100 text-blue-800'
        break
      case 'qualification':
        className += ' bg-purple-100 text-purple-800'
        break
      case 'proposal':
        className += ' bg-amber-100 text-amber-800'
        break
      case 'negotiation':
        className += ' bg-cyan-100 text-cyan-800'
        break
      case 'closed-won':
        className += ' bg-green-100 text-green-800'
        break
      case 'closed-lost':
        className += ' bg-red-100 text-red-800'
        break
      default:
        className += ' bg-gray-100 text-gray-800'
    }
    
    return (
      <Badge variant="outline" className={className}>
        {getStageLabel(stage)}
      </Badge>
    )
  }

  return (
    <div className="space-y-4">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Negociações</h3>
        <Button onClick={onAddDeal} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nova Negociação
        </Button>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md">
          {error}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {/* Lista vazia */}
      {!isLoading && deals.length === 0 && (
        <div className="text-center py-8 text-muted-foreground border rounded-md">
          <p>Nenhuma negociação encontrada para este contato.</p>
          <Button 
            variant="link" 
            onClick={onAddDeal} 
            className="mt-2"
          >
            Criar nova negociação
          </Button>
        </div>
      )}

      {/* Lista de negociações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deals.map((deal) => (
          <Card key={deal.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{deal.name}</CardTitle>
                  <CardDescription>{formatCurrency(deal.value)}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(deal.id)}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <StageBadge stage={deal.stage} />
                
                <Select 
                  value={deal.stage} 
                  onValueChange={(value) => handleStageChange(deal.id, value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Mudar estágio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="qualification">Qualificação</SelectItem>
                    <SelectItem value="proposal">Proposta</SelectItem>
                    <SelectItem value="negotiation">Negociação</SelectItem>
                    <SelectItem value="closed-won">Ganho</SelectItem>
                    <SelectItem value="closed-lost">Perdido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 