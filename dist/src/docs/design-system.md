# Design System

Este documento descreve o Design System utilizado no Módulo de Comunicação, incluindo componentes, padrões visuais e diretrizes de uso.

## Visão Geral

O Design System do projeto é construído sobre três tecnologias principais:

1. **Shadcn UI**: Uma coleção de componentes reutilizáveis que se integram ao Tailwind CSS
2. **Radix UI**: Primitivos de UI sem estilo, acessíveis e customizáveis
3. **Tailwind CSS**: Framework CSS utility-first para estilização rápida e consistente

Esta combinação fornece uma base sólida de componentes acessíveis e customizáveis, mantendo a flexibilidade para o design específico do projeto.

## Princípios de Design

- **Consistência**: Interface uniforme em toda a aplicação
- **Acessibilidade**: Componentes que seguem as diretrizes WCAG 2.1 AA
- **Responsividade**: Layout adaptável a diferentes tamanhos de tela
- **Minimalismo**: Interfaces limpas com foco na usabilidade
- **Hierarquia visual**: Organização clara dos elementos

## Tokens de Design

### Cores

```css
--primary: 222.2 47.4% 11.2%;
--primary-foreground: 210 40% 98%;
--secondary: 210 40% 96.1%;
--secondary-foreground: 222.2 47.4% 11.2%;
--muted: 210 40% 96.1%;
--muted-foreground: 215.4 16.3% 46.9%;
--accent: 210 40% 96.1%;
--accent-foreground: 222.2 47.4% 11.2%;
--destructive: 0 100% 50%;
--destructive-foreground: 210 40% 98%;
--border: 214.3 31.8% 91.4%;
--input: 214.3 31.8% 91.4%;
--ring: 222.2 84% 4.9%;
--background: 0 0% 100%;
--foreground: 222.2 84% 4.9%;
--card: 0 0% 100%;
--card-foreground: 222.2 84% 4.9%;
--popover: 0 0% 100%;
--popover-foreground: 222.2 84% 4.9%;
```

### Tipografia

```css
--font-sans: 'Inter', sans-serif;
--font-mono: 'Roboto Mono', monospace;

/* Tamanhos de fonte */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

### Espaçamento

```css
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
```

### Bordas e Sombras

```css
--radius-sm: 0.125rem;   /* 2px */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-full: 9999px;

--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
```

## Componentes Principais

### Button

Botões para ações primárias, secundárias e terciárias da interface.

```tsx
import { Button } from "@/components/ui/button";

// Variantes
<Button variant="default">Primário</Button>
<Button variant="secondary">Secundário</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="destructive">Excluir</Button>

// Tamanhos
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">🔍</Button>
```

### Card

Containers para agrupar informações relacionadas.

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
    <CardDescription>Descrição do conteúdo</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Conteúdo principal do card.</p>
  </CardContent>
  <CardFooter>
    <Button>Ação Primária</Button>
  </CardFooter>
</Card>
```

### Dialog

Modal para exibir informações ou ações críticas.

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>Abrir Modal</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Título do Dialog</DialogTitle>
      <DialogDescription>
        Esta ação não pode ser desfeita. Isso excluirá permanentemente este 
        item do servidor.
      </DialogDescription>
    </DialogHeader>
    <div className="py-4">
      Conteúdo do dialog aqui...
    </div>
    <DialogFooter>
      <Button variant="outline">Cancelar</Button>
      <Button variant="destructive">Confirmar</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Form

Componentes para construção de formulários validados.

```tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  username: z.string().min(2).max(50),
});

function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome de usuário</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormDescription>
                Este é seu nome de usuário público.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Salvar alterações</Button>
      </form>
    </Form>
  );
}
```

### Table

Tabelas para exibição de dados estruturados.

```tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

<Table>
  <TableCaption>Lista de mensagens recentes</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Data</TableHead>
      <TableHead>Remetente</TableHead>
      <TableHead>Assunto</TableHead>
      <TableHead className="text-right">Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>10/03/2023</TableCell>
      <TableCell>João Silva</TableCell>
      <TableCell>Reunião de equipe</TableCell>
      <TableCell className="text-right">Lido</TableCell>
    </TableRow>
    {/* Mais linhas */}
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell colSpan={3}>Total</TableCell>
      <TableCell className="text-right">10 mensagens</TableCell>
    </TableRow>
  </TableFooter>
</Table>
```

### Tabs

Abas para alternar entre diferentes visões de conteúdo.

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

<Tabs defaultValue="messages" className="w-full">
  <TabsList className="grid w-full grid-cols-3">
    <TabsTrigger value="messages">Mensagens</TabsTrigger>
    <TabsTrigger value="notifications">Notificações</TabsTrigger>
    <TabsTrigger value="settings">Configurações</TabsTrigger>
  </TabsList>
  <TabsContent value="messages">
    <Card>
      <CardHeader>
        <CardTitle>Mensagens</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Visualize suas mensagens aqui.</p>
      </CardContent>
    </Card>
  </TabsContent>
  <TabsContent value="notifications">
    {/* Conteúdo das notificações */}
  </TabsContent>
  <TabsContent value="settings">
    {/* Conteúdo das configurações */}
  </TabsContent>
</Tabs>
```

## Componentes Personalizados

Além dos componentes base do Shadcn UI, o projeto possui componentes personalizados específicos para o Módulo de Comunicação:

### MessageItem

```tsx
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MessageItemProps {
  message: {
    id: string;
    sender: string;
    avatar?: string;
    content: string;
    timestamp: Date;
    status: "read" | "unread" | "archived";
    attachments?: number;
  };
  onClick?: () => void;
}

export function MessageItem({ message, onClick }: MessageItemProps) {
  return (
    <div 
      onClick={onClick}
      className="p-4 border-b hover:bg-muted/50 transition-colors cursor-pointer flex items-start gap-4"
    >
      <Avatar>
        <AvatarImage src={message.avatar} alt={message.sender} />
        <AvatarFallback>{message.sender[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-medium truncate">{message.sender}</h4>
          <time className="text-xs text-muted-foreground">
            {format(message.timestamp, "PPp", { locale: ptBR })}
          </time>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {message.content}
        </p>
        <div className="flex items-center gap-2 mt-2">
          {message.status === "unread" && (
            <Badge variant="default">Não lida</Badge>
          )}
          {message.attachments && message.attachments > 0 && (
            <Badge variant="outline">
              {message.attachments} anexo{message.attachments > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
```

### StatusIndicator

```tsx
interface StatusIndicatorProps {
  status: "online" | "offline" | "away" | "busy";
  animate?: boolean;
}

export function StatusIndicator({ 
  status, 
  animate = false 
}: StatusIndicatorProps) {
  const statusStyles = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    away: "bg-yellow-500",
    busy: "bg-red-500"
  };
  
  return (
    <span 
      className={`block w-3 h-3 rounded-full ${statusStyles[status]} ${
        animate && status === "online" ? "animate-pulse" : ""
      }`}
      aria-label={`Status: ${status}`}
    />
  );
}
```

## Padrões de Layout

### AdminLayout

```tsx
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      <Sidebar className="md:w-64 hidden md:block" />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-6">
          <Breadcrumbs className="mb-6" />
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
```

### DashboardGrid

```tsx
interface DashboardGridProps {
  children: React.ReactNode;
}

export function DashboardGrid({ children }: DashboardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {children}
    </div>
  );
}
```

## Padrões de Uso

### Tipografia

```tsx
<h1 className="text-3xl font-bold tracking-tight">Título Principal</h1>
<h2 className="text-2xl font-semibold">Título Secundário</h2>
<h3 className="text-xl font-medium">Título Terciário</h3>
<p className="text-base leading-7">Parágrafo normal com bom espaçamento.</p>
<p className="text-sm text-muted-foreground">Texto secundário ou explicativo.</p>
```

### Espaçamento

```tsx
<div className="space-y-6">
  <section className="p-4 md:p-6">
    <h2 className="mb-4">Título da Seção</h2>
    <div className="grid gap-4">
      {/* Itens aqui */}
    </div>
  </section>
</div>
```

### Responsividade

```tsx
<div className="w-full md:w-2/3 lg:w-1/2">
  {/* Conteúdo que se adapta a diferentes larguras */}
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Grid que se adapta a diferentes telas */}
</div>

<p className="text-sm sm:text-base md:text-lg">
  {/* Texto que aumenta em telas maiores */}
</p>
```

## Dark Mode

O Design System suporta temas claro e escuro usando a estratégia CSS Variables do Tailwind.

```tsx
// Componente de alternância de tema
'use client'

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Alternar tema"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
```

## Acessibilidade

Todos os componentes são construídos seguindo as melhores práticas de acessibilidade:

- Uso adequado de elementos semânticos HTML
- Labels associados a inputs de formulário
- Suporte a navegação por teclado
- Contraste adequado de cores
- Mensagens de erro informativas
- Estados de foco visíveis
- Atributos ARIA apropriados

## Extensão do Design System

Para adicionar novos componentes ao Design System:

1. Instale o componente usando o CLI do Shadcn:

```bash
npx shadcn-ui@latest add [nome-do-componente]
```

2. Personalize o componente conforme necessário:

```tsx
// src/components/ui/custom-button.tsx
import { cva } from "class-variance-authority";
import { Button, buttonVariants } from "@/components/ui/button";

const customButtonVariants = cva(
  buttonVariants().base,
  {
    variants: {
      variant: {
        special: "bg-purple-600 text-white hover:bg-purple-700 shadow-lg",
      },
      size: {
        xl: "text-xl px-8 py-4",
      },
    },
  }
);

export function CustomButton({ variant = "special", ...props }) {
  return (
    <Button
      className={customButtonVariants({ variant })}
      {...props}
    />
  );
}
```

## Guia de Contribuição

Ao contribuir para o Design System:

1. Mantenha a consistência com os componentes existentes
2. Documente novos componentes e variantes
3. Garanta responsividade em todos os tamanhos de tela
4. Teste a acessibilidade (contraste, navegação por teclado)
5. Verifique compatibilidade com o modo escuro
6. Reutilize tokens e variáveis existentes quando possível
