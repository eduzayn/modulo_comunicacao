'use client'

import { useEffect } from 'react'
import { useContacts } from '../hooks/use-contacts'
import type { Contact, ContactFilters } from '../types/crm.types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Search, Plus, Pencil, Trash2 } from 'lucide-react'

interface ContactListProps {
  initialFilters?: ContactFilters
  onSelectContact?: (id: string) => void
  onAddContact?: () => void
  onEditContact?: (id: string) => void
  onDeleteContact?: (id: string) => void
}

/**
 * Componente para listar contatos com filtros e ações
 */
export function ContactList({
  initialFilters,
  onSelectContact,
  onAddContact,
  onEditContact,
  onDeleteContact
}: ContactListProps) {
  const {
    contacts,
    isLoading,
    error,
    filters,
    fetchContacts,
    updateFilters,
    removeContact
  } = useContacts(initialFilters)

  // Carregar contatos na inicialização
  useEffect(() => {
    fetchContacts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Manipular mudança no filtro de tipo
  const handleTypeFilterChange = (value: string) => {
    const newType = value === 'all' ? undefined : value as Contact['type']
    updateFilters({ type: newType })
    fetchContacts({ ...filters, type: newType })
  }

  // Manipular mudança na busca
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ search: e.target.value })
  }

  // Executar busca ao pressionar Enter
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      fetchContacts()
    }
  }

  // Manipular a exclusão de um contato
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este contato?')) {
      try {
        await removeContact(id)
        if (onDeleteContact) onDeleteContact(id)
      } catch (error) {
        console.error('Erro ao excluir contato:', error)
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* Cabeçalho e filtros */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Input
            placeholder="Buscar contatos..."
            value={filters.search || ''}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            className="w-full sm:w-64"
          />
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => fetchContacts()}
            disabled={isLoading}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Select 
            value={filters.type || 'all'} 
            onValueChange={handleTypeFilterChange}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tipo</SelectLabel>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Aluno">Aluno</SelectItem>
                <SelectItem value="Professor">Professor</SelectItem>
                <SelectItem value="Parceiro">Parceiro</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button onClick={onAddContact} className="whitespace-nowrap">
            <Plus className="h-4 w-4 mr-2" />
            Novo Contato
          </Button>
        </div>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md">
          {error}
        </div>
      )}

      {/* Tabela de contatos */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  Nenhum contato encontrado
                </TableCell>
              </TableRow>
            ) : (
              contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell 
                    className="font-medium cursor-pointer hover:underline"
                    onClick={() => onSelectContact && onSelectContact(contact.id)}
                  >
                    {contact.name}
                  </TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>{contact.type}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditContact && onEditContact(contact.id)}
                      title="Editar contato"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(contact.id)}
                      title="Excluir contato"
                      className="hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 