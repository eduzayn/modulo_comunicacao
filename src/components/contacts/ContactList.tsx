import { Contact } from '@/types/contacts';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MoreVertical, Edit, Trash2, MessageSquare } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ContactListProps {
  contacts: Contact[];
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  selectedId?: string;
}

export function ContactList({ contacts, onSelect, onEdit, onDelete, selectedId }: ContactListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="contact-grid">
      {contacts.map((contact) => (
        <Card
          key={contact.id}
          className={`p-4 cursor-pointer ${
            selectedId === contact.id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => onSelect(contact.id)}
          data-testid="contact-card"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-medium" data-testid="contact-initial">
                  {contact.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-medium" data-testid="contact-name">
                  {contact.name}
                </h3>
                <p className="text-sm text-muted-foreground" data-testid="contact-email">
                  {contact.email}
                </p>
              </div>
            </div>

            {/* Menu de ações para mobile */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    data-testid="contact-actions-menu"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(contact.id)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onDelete(contact.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Botões de ação para desktop */}
            <div className="hidden md:flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(contact.id);
                }}
                data-testid="edit-contact-button"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(contact.id);
                }}
                data-testid="delete-contact-button"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm" data-testid="contact-phone">
              {contact.phone}
            </p>
            <p className="text-sm text-muted-foreground" data-testid="contact-type">
              {contact.type}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
} 