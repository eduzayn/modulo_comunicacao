'use client'

import { useState, useMemo } from 'react'
import { Button } from './button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from './scroll-area'
import { Search, MessageSquare, Zap, StickyNote } from 'lucide-react'
import { Input } from './input'

interface QuickPhrase {
  id: string
  shortcut: string
  phrase: string
  type: 'text' | 'voice' | 'template'
  category?: string
}

interface QuickPhrasesProps {
  onPhraseSelect: (phrase: string) => void
  phrases?: QuickPhrase[]
  className?: string
}

// Exemplos de frases rápidas padrão
const defaultPhrases: QuickPhrase[] = [
  {
    id: '1',
    shortcut: '/iniciar',
    phrase: 'Olá! Obrigado por entrar em contato. Como posso ajudar você hoje?',
    type: 'text',
    category: 'saudação'
  },
  {
    id: '2',
    shortcut: '/encerrar',
    phrase: 'Agradeço imensamente pela confiança depositada em nossa equipe. Estou à disposição para qualquer outra dúvida.',
    type: 'text',
    category: 'encerramento'
  },
  {
    id: '3',
    shortcut: '/aguarde',
    phrase: 'Por favor, aguarde um momento enquanto verifico essas informações para você.',
    type: 'text',
    category: 'atendimento'
  },
  {
    id: '4',
    shortcut: '/certificação',
    phrase: 'Informamos que seu processo de certificação já foi iniciado e tem previsão de conclusão em até 3 dias úteis.',
    type: 'text',
    category: 'documentos'
  },
  {
    id: '5',
    shortcut: '/diploma',
    phrase: 'Olá! Seu diploma está sendo processado e ficará disponível em até 60 dias após a conclusão do curso.',
    type: 'text',
    category: 'documentos'
  },
  {
    id: '6',
    shortcut: '/pagamento',
    phrase: 'Para regularizar seu pagamento, você pode acessar o portal do aluno ou utilizar o código de barras que enviarei a seguir.',
    type: 'text',
    category: 'financeiro'
  },
  {
    id: '7',
    shortcut: '/obrigado',
    phrase: 'Muito obrigado pelo seu contato! Fico feliz em poder ajudar.',
    type: 'text',
    category: 'saudação'
  },
  {
    id: '8',
    shortcut: '/atraso',
    phrase: 'Compreendemos sua situação. Vamos verificar as opções disponíveis para regularização dos pagamentos em atraso.',
    type: 'text',
    category: 'financeiro'
  }
]

export function QuickPhrases({
  onPhraseSelect,
  phrases: providedPhrases,
  className
}: QuickPhrasesProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  
  // Usar os exemplos se não for fornecido
  const allPhrases = providedPhrases || defaultPhrases
  
  // Extrair categorias únicas das frases usando useMemo
  const categories = useMemo(() => {
    return ['all', ...Array.from(new Set(allPhrases.map(p => p.category || 'outros')))]
  }, [allPhrases])
  
  // Filtrar frases com base na busca e categoria
  const filteredPhrases = useMemo(() => {
    let filtered = allPhrases

    // Filtrar por categoria se não for 'all'    
    if (activeCategory !== 'all') {
      filtered = filtered.filter(phrase => phrase.category === activeCategory)
    }
    
    // Aplicar busca textual
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        phrase =>
          phrase.phrase.toLowerCase().includes(query) ||
          phrase.shortcut.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [searchQuery, allPhrases, activeCategory])
  
  const handleSelectPhrase = (phrase: QuickPhrase) => {
    onPhraseSelect(phrase.phrase)
    setIsOpen(false)
    setSearchQuery('')
  }
  
  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'saudação':
        return <MessageSquare className="h-4 w-4" />
      case 'encerramento':
        return <Zap className="h-4 w-4" />
      case 'documentos':
        return <StickyNote className="h-4 w-4" />
      case 'financeiro':
        return <StickyNote className="h-4 w-4" />
      case 'atendimento':
        return <MessageSquare className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }
  
  const formatCategoryName = (category: string) => {
    if (category === 'all') return 'Todas'
    return category.charAt(0).toUpperCase() + category.slice(1)
  }
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <Zap className="h-4 w-4" />
          <span className="hidden sm:inline">Frases Rápidas</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" sideOffset={5}>
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar frase rápida..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9 text-sm"
            />
          </div>
        </div>
        
        <div>
          <div className="flex w-full border-b overflow-x-auto">
            {categories.map(category => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`text-xs px-3 py-1.5 rounded-none ${
                  activeCategory === category ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'
                }`}
              >
                {formatCategoryName(category)}
              </button>
            ))}
          </div>
          
          <ScrollArea className="max-h-64">
            <div className="p-2">
              {filteredPhrases.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-500">
                  <MessageSquare className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p>Nenhuma frase encontrada</p>
                </div>
              ) : (
                <ul className="space-y-1">
                  {filteredPhrases.map((phrase) => (
                    <li key={phrase.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectPhrase(phrase)}
                        className="w-full text-left p-2 rounded hover:bg-gray-100 flex items-start gap-2"
                      >
                        <div className="mt-0.5 text-gray-500">
                          {getCategoryIcon(phrase.category)}
                        </div>
                        <div>
                          <p className="font-medium text-xs text-gray-500">
                            {phrase.shortcut}
                          </p>
                          <p className="text-sm line-clamp-2">{phrase.phrase}</p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  )
} 