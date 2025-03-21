# Módulo de Comunicação

Este repositório contém o código-fonte do Módulo de Comunicação, uma plataforma que unifica canais de comunicação e implementa recursos avançados de IA para otimizar o atendimento ao cliente.

## Arquitetura

O projeto segue uma **arquitetura feature-first**, que organiza o código em torno de funcionalidades de negócio.

### Estrutura de Diretórios

```
src/
  ├── app/               # Rotas e páginas da aplicação (Next.js App Router)
  ├── components/        # Componentes base da UI (migrarão para features)
  │   └── ui/            # Componentes de UI reutilizáveis (Shadcn UI)
  │
  ├── contexts/          # Contextos React globais
  │
  ├── features/          # Diretório principal para as features
  │   ├── chat/          # Feature de chat
  │   ├── crm/           # Feature de CRM
  │   ├── ai/            # Feature de Inteligência Artificial
  │   └── settings/      # Feature de Configurações
  │
  ├── hooks/             # Hooks globais (migrarão para features)
  │
  ├── lib/               # Utilitários e bibliotecas compartilhadas
  │
  ├── services/          # Serviços globais (migrarão para features)
  │
  ├── types/             # Tipagens compartilhadas
  │
  └── utils/             # Funções utilitárias
```

## Princípios da Arquitetura Feature-First

1. **Coesão Funcional**: Cada feature contém tudo necessário para aquela funcionalidade
2. **Encapsulamento**: Implementações internas são encapsuladas
3. **API Pública**: Features expõem APIs claras através de arquivos `index.ts`
4. **Independência**: Features são independentes ou têm dependências definidas

## Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Edite o arquivo .env.local com suas configurações

# Iniciar servidor de desenvolvimento
npm run dev
```

## Tecnologias Principais

- **Next.js 14**: Framework React com App Router
- **TypeScript**: Tipagem estática
- **TanStack Query**: Gerenciamento de estado e cache
- **Shadcn UI**: Sistema de design
- **Tailwind CSS**: Estilização
- **Supabase**: Backend como serviço

## Desenvolvimento

```bash
# Executar testes
npm run test

# Executar lint
npm run lint

# Criar build de produção
npm run build
```

## Migração em Andamento

Estamos migrando a estrutura do projeto para seguir completamente a arquitetura feature-first. 
Algumas partes do código ainda estão na estrutura antiga e serão gradualmente movidas para a nova estrutura.

## Contribuição

Para contribuir com o projeto:

1. Crie um fork deste repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das alterações (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Faça push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Licença

Este projeto é propriedade da Edunéxia e seu uso é restrito aos termos estabelecidos pela empresa.

## Distribuição Alternativa

### Empacotamento Simplificado (Sem Build Next.js)

Se você estiver enfrentando problemas com o processo de build do Next.js, uma alternativa é empacotar o projeto usando nosso script de empacotamento simplificado. Este método é útil para ambientes onde o processo de build completo falha devido a conflitos de dependências ou outras questões.

#### Como criar o pacote:

1. Certifique-se de ter todas as dependências instaladas:
```bash
npm install
```

2. Execute o script de empacotamento:
```bash
node package-dist.js
```

3. Isto criará um arquivo ZIP (ex: `modulo-comunicacao-v0.1.0.zip`) que contém:
   - Arquivos fonte
   - Arquivos de configuração
   - Script de inicialização automática

#### Como implantar o pacote:

1. Descompacte o arquivo ZIP no servidor de destino
2. Entre no diretório extraído
3. Execute o script de inicialização:
```bash
node start.js
```

Este script verificará automaticamente se todas as dependências estão instaladas e iniciará a aplicação.
