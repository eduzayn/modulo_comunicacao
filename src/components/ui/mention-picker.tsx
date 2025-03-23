'use client'

import { useState, useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from './button'
import { AtSign, UserPlus, Search } from 'lucide-react'
import { Input } from './input'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  status?: 'online' | 'away' | 'busy' | 'offline'
  department?: string
}

interface MentionPickerProps {
  onMentionSelect: (user: User) => void
  trigger?: React.ReactNode
  users?: User[]
  className?: string
}

export function MentionPicker({
  onMentionSelect,
  trigger,
  users = [],
  className
}: MentionPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users)
  
  // Mock users se não fornecidos como prop
  const defaultUsers: User[] = [
    {
      id: '1',
      name: 'Ana Silva',
      email: 'ana.silva@exemplo.com',
      avatar: '',
      status: 'online',
      department: 'Atendimento'
    },
    {
      id: '2',
      name: 'Carlos Oliveira',
      email: 'carlos.oliveira@exemplo.com',
      status: 'away',
      department: 'Suporte Técnico'
    },
    {
      id: '3',
      name: 'Juliana Martins',
      email: 'juliana.martins@exemplo.com',
      avatar: '',
      status: 'online',
      department: 'Vendas'
    },
    {
      id: '4',
      name: 'Roberto Almeida',
      email: 'roberto.almeida@exemplo.com',
      avatar: '',
      status: 'busy',
      department: 'Administrativo'
    },
    {
      id: '5',
      name: 'Maria Costa',
      email: 'maria.costa@exemplo.com',
      status: 'offline',
      department: 'Financeiro'
    }
  ]
  
  const allUsers = users.length > 0 ? users : defaultUsers
  
  // Atualizar usuários filtrados quando a busca mudar
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(allUsers)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredUsers(
        allUsers.filter(
          (user) =>
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            (user.department && user.department.toLowerCase().includes(query))
        )
      )
    }
  }, [searchQuery, allUsers])
  
  // Focar no input de busca quando o popover abrir
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])
  
  const handleSelectUser = (user: User) => {
    onMentionSelect(user)
    setIsOpen(false)
    setSearchQuery('')
  }
  
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500'
      case 'away':
        return 'bg-yellow-500'
      case 'busy':
        return 'bg-red-500'
      case 'offline':
      default:
        return 'bg-gray-400'
    }
  }
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {trigger || (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <AtSign className="h-5 w-5" />
            <span className="sr-only">Mencionar colega</span>
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              ref={searchInputRef}
              placeholder="Buscar colega..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9 text-sm"
            />
          </div>
        </div>
        
        <div className="max-h-72 overflow-auto">
          {filteredUsers.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">
              <UserPlus className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p>Nenhum usuário encontrado</p>
            </div>
          ) : (
            <ul className="py-1">
              {filteredUsers.map((user) => (
                <li key={user.id}>
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => handleSelectUser(user)}
                  >
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        {user.avatar ? (
                          <AvatarImage src={user.avatar} alt={user.name} />
                        ) : (
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {user.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <span
                        className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${getStatusColor(
                          user.status
                        )}`}
                      />
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-medium text-sm truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.department || user.email}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
} 