# Plano de Migração e Consolidação do Módulo de Comunicação

## ⚠️ AVISO IMPORTANTE: LEIA ANTES DE PROSSEGUIR ⚠️

A migração de estruturas de pasta (de inglês para português) apresenta **riscos potenciais** que podem afetar o funcionamento da aplicação. 
**NÃO remova as pastas originais em inglês** até que todas as referências tenham sido atualizadas e testadas.

### Riscos Identificados

1. **Quebra de Referências**: Arquivos que importam ou referenciam caminhos como `/communication/messages` deixarão de funcionar se a pasta for removida
2. **Quebra de URLs**: Links internos ou externos que apontam para as rotas antigas resultarão em erros 404
3. **Componentes Dinâmicos**: Componentes que carregam dinamicamente outros componentes baseados em caminhos podem falhar

### Diretrizes de Segurança para Migração

1. **NÃO REMOVA** as pastas originais até que todas as referências sejam atualizadas
2. **IMPLEMENTE** um middleware de redirecionamento para rotas antigas
3. **MANTENHA** ambas as estruturas por um período de transição
4. **BUSQUE** por todas as ocorrências de caminhos antigos no código antes de remover
5. **DOCUMENTE** todas as alterações no README principal

## Situação Atual

O módulo de comunicação possui algumas duplicações e inconsistências que precisam ser resolvidas:

1. **Pastas Duplicadas**:
   - Foram encontradas pastas vazias `mensagens/` e `messages/` e consolidadas (removidas + recriada apenas mensagens/)
   - Pasta `conversations/` contém apenas subpasta vazia `[id]/` - estrutura equivalente criada em `conversas/`
   - Possíveis duplicações em outras seções

2. **Inconsistência de Idiomas**:
   - Algumas pastas usam nomes em português, outras em inglês
   
3. **Atualização Recente**:
   - A pasta `communication/` foi renomeada para `comunicacao/` para seguir o padrão em português
   - A pasta `hooks/communication/` deve ser atualizada para refletir essa alteração
   - Pastas duplicadas vazias (`mensagens/` e `messages/`) foram consolidadas
   - Estrutura de `conversas/` foi criada para substituir `conversations/`

## Diretrizes para Consolidação

### 1. Padronização de Idioma

**Decisão**: Padronizar todos os nomes de pastas e rotas em **português**.

Isso significa:
- Manter `mensagens/` e remover `messages/` (concluído)
- Renomear `conversations/` para `conversas/` (estrutura criada)
- Renomear `communication/` para `comunicacao/` (já implementado)
- Outros ajustes similares

### 2. Estrutura de Pastas Recomendada

```
src/app/comunicacao/
├── mensagens/           # (Mantida apenas esta pasta, messages removida)
├── conversas/           # (Criada para substituir conversations/)
│   ├── [id]/            # Detalhes da conversa
│   ├── email/           # Conversas por email
│   ├── whatsapp/        # Conversas por WhatsApp
│   └── ...
├── contatos/            # Gerenciamento de contatos
├── canais/              # Configuração de canais
├── modelos/             # Modelos de mensagens (templates)
├── settings/            # Configurações específicas de comunicação
├── stats/               # Estatísticas de comunicação
└── ...
```

## Plano de Migração Segura (Atualizado)

### Fase 1: Preparação e Duplicação (Concluída)
1. ✅ Criar novas estruturas em português
2. ✅ Documentar mudanças e plano de migração
3. ✅ Manter temporariamente ambas as estruturas

### Fase 2: Implementação de Segurança
1. ⚠️ Implementar middleware de redirecionamento para rotas antigas
   ```typescript
   // Em src/middleware.ts
   import { NextResponse } from 'next/server'
   import type { NextRequest } from 'next/server'
   
   const redirectMap = {
     '/communication': '/comunicacao',
     '/communication/messages': '/comunicacao/mensagens',
     '/communication/conversations': '/comunicacao/conversas',
     // Adicionar mais mapeamentos conforme necessário
   }
   
   export function middleware(request: NextRequest) {
     const { pathname } = request.nextUrl
     
     // Verificar redirecionamentos
     for (const [oldPath, newPath] of Object.entries(redirectMap)) {
       if (pathname.startsWith(oldPath)) {
         return NextResponse.redirect(new URL(pathname.replace(oldPath, newPath), request.url))
       }
     }
     
     return NextResponse.next()
   }
   
   export const config = {
     matcher: ['/communication/:path*'],
   }
   ```

2. ⚠️ Executar busca por todas as referências aos caminhos antigos
   ```bash
   # Comando para buscar referências
   grep -r "communication" --include="*.tsx" --include="*.ts" src/
   ```

### Fase 3: Migração Gradual
1. Atualizar imports e referências para os novos caminhos (um por um, testando após cada alteração)
2. Atualizar links e rotas em components de navegação
3. Testar extensivamente após cada conjunto de alterações

### Fase 4: Limpeza (Após confirmação)
1. Remover estruturas antigas somente após confirmação de que não há mais referências
2. Manter middleware de redirecionamento temporariamente para URLs externas

## Etapas Pendentes

- [x] Remover pasta obsoleta `(communication)`
- [x] Renomear `communication/` para `comunicacao/`
- [x] Remover pasta `messages/` (manter apenas `mensagens/`)
- [x] Criar estrutura `conversas/` para substituir `conversations/`
- [ ] Implementar middleware de redirecionamento
- [ ] Buscar e documentar todas as referências a caminhos antigos
- [ ] Atualizar referências uma a uma, testando após cada alteração
- [ ] Remover `conversations/` quando todas as referências estiverem atualizadas
- [ ] Renomear `hooks/communication/` para `hooks/comunicacao/`
- [ ] Atualizar `routes.tsx` para refletir a estrutura consolidada
- [ ] Verificar e corrigir links em todas as páginas
- [ ] Atualizar breadcrumbs e navegação

## Considerações sobre SEO

Ao renomear rotas, considerar:
- Implementar redirecionamentos 301 para rotas alteradas
- Atualizar sitemap
- Atualizar links externos, se houver

## Responsável

[Nome do responsável pela migração]

## Prazo

- Início da Fase 1: [data]
- Início da Fase 2: [data]
- Início da Fase 3: [data]
- Início da Fase 4: [data] (somente após confirmação completa de segurança) 