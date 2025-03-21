import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Gerenciamento de Usuários | Sistema de Comunicação',
  description: 'Gerencie os usuários, permissões e acessos do sistema',
};

// Dados simulados de usuários
const usuarios = [
  {
    id: 1,
    nome: 'Ana Silva',
    email: 'ana.silva@exemplo.com',
    cargo: 'Administradora',
    departamento: 'TI',
    status: 'Ativo',
    ultimoAcesso: '2023-03-15T10:30:00',
    avatar: '/avatars/ana.jpg',
  },
  {
    id: 2,
    nome: 'Carlos Mendes',
    email: 'carlos.mendes@exemplo.com',
    cargo: 'Atendente',
    departamento: 'Suporte',
    status: 'Ativo',
    ultimoAcesso: '2023-03-15T09:15:00',
    avatar: null,
  },
  {
    id: 3,
    nome: 'Juliana Costa',
    email: 'juliana.costa@exemplo.com',
    cargo: 'Gerente',
    departamento: 'Comercial',
    status: 'Inativo',
    ultimoAcesso: '2023-03-10T14:22:00',
    avatar: '/avatars/juliana.jpg',
  },
  {
    id: 4,
    nome: 'Roberto Alves',
    email: 'roberto.alves@exemplo.com',
    cargo: 'Atendente',
    departamento: 'Suporte',
    status: 'Ativo',
    ultimoAcesso: '2023-03-14T16:45:00',
    avatar: null,
  },
  {
    id: 5,
    nome: 'Luciana Santos',
    email: 'luciana.santos@exemplo.com',
    cargo: 'Analista',
    departamento: 'Financeiro',
    status: 'Ativo',
    ultimoAcesso: '2023-03-15T11:20:00',
    avatar: '/avatars/luciana.jpg',
  },
];

// Dados simulados de perfis
const perfis = [
  {
    id: 1,
    nome: 'Administrador',
    descricao: 'Acesso completo a todas as funcionalidades do sistema',
    permissoes: 'Todas as permissões',
    usuarios: 3,
  },
  {
    id: 2,
    nome: 'Gerente',
    descricao: 'Acesso gerencial sem algumas configurações administrativas',
    permissoes: 'Gerenciar equipes, visualizar relatórios, editar conteúdos',
    usuarios: 8,
  },
  {
    id: 3,
    nome: 'Atendente',
    descricao: 'Acesso para atendimento ao cliente e comunicações',
    permissoes: 'Responder mensagens, cadastrar contatos, registrar chamados',
    usuarios: 15,
  },
  {
    id: 4,
    nome: 'Visitante',
    descricao: 'Acesso limitado para visualização',
    permissoes: 'Visualizar conteúdos públicos, sem permissão de edição',
    usuarios: 5,
  },
];

export default function UsuariosPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Usuários</h1>
        <p className="text-muted-foreground">
          Gerencie os usuários, permissões e acessos do sistema
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
        <div className="flex gap-4">
          <Input 
            className="w-full md:w-80" 
            placeholder="Buscar usuários..." 
            type="search"
          />
          <Button variant="outline">Filtrar</Button>
        </div>
        
        <Button>
          Adicionar Usuário
        </Button>
      </div>

      <Tabs defaultValue="usuarios" className="space-y-4">
        <TabsList>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="perfis">Perfis de Acesso</TabsTrigger>
          <TabsTrigger value="logs">Logs de Atividade</TabsTrigger>
        </TabsList>
        
        <TabsContent value="usuarios" className="space-y-4">
          <div className="grid gap-4">
            {usuarios.map((usuario) => (
              <Card key={usuario.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <div className="bg-muted h-full w-full rounded-full flex items-center justify-center">
                        {usuario.avatar ? (
                          <img 
                            src={usuario.avatar} 
                            alt={usuario.nome} 
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-xl font-medium">{usuario.nome.charAt(0)}</span>
                        )}
                      </div>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <h3 className="font-semibold">{usuario.nome}</h3>
                          <p className="text-sm text-muted-foreground">{usuario.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={usuario.status === 'Ativo' ? 'default' : 'secondary'}>
                            {usuario.status}
                          </Badge>
                          <Button variant="outline" size="sm">Ver detalhes</Button>
                          <Button variant="outline" size="sm">Editar</Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Cargo</p>
                          <p className="text-sm">{usuario.cargo}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Departamento</p>
                          <p className="text-sm">{usuario.departamento}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Último acesso</p>
                          <p className="text-sm">
                            {new Date(usuario.ultimoAcesso).toLocaleString('pt-BR')}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Status</p>
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${
                              usuario.status === 'Ativo' ? 'bg-green-500' : 'bg-gray-400'
                            }`} />
                            <p className="text-sm">{usuario.status}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center">
            <Button variant="outline">Carregar mais</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="perfis" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {perfis.map((perfil) => (
              <Card key={perfil.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{perfil.nome}</CardTitle>
                      <CardDescription>{perfil.descricao}</CardDescription>
                    </div>
                    <Badge>{perfil.usuarios} usuários</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">Permissões:</p>
                  <p className="text-sm">{perfil.permissoes}</p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">Editar</Button>
                  <Button size="sm">Ver Usuários</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center">
            <Button>Criar Novo Perfil</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logs de Atividade</CardTitle>
              <CardDescription>
                Histórico de atividades dos usuários no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Funcionalidade em desenvolvimento
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 