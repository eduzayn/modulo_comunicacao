# Plano de Migração e Consolidação do Módulo de Comunicação

## Situação Atual

O módulo de comunicação possui algumas duplicações e inconsistências que precisam ser resolvidas:

1. **Pastas Duplicadas**:
   - `mensagens/` (português) e `messages/` (inglês)
   - Possíveis duplicações em outras seções

2. **Inconsistência de Idiomas**:
   - Algumas pastas usam nomes em português, outras em inglês

## Diretrizes para Consolidação

### 1. Padronização de Idioma

**Decisão**: Padronizar todos os nomes de pastas e rotas em **português**.

Isso significa:
- Manter `mensagens/` e remover `messages/`
- Renomear `conversations/` para `conversas/`
- Outros ajustes similares

### 2. Estrutura de Pastas Recomendada

```
src/app/communication/
├── mensagens/           # (Manter esta pasta, remover messages/)
├── conversas/           # (Renomear de conversations/)
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

### 3. Prioridade de Migração

1. Remover pastas duplicadas (já foi feito com a exclusão de `(communication)`)
2. Consolidar `mensagens/` e `messages/` (manter apenas `mensagens/`)
3. Renomear `conversations/` para `conversas/`
4. Atualizar arquivos de rotas e links

## Etapas Pendentes

- [ ] Remover pasta `messages/` (manter apenas `mensagens/`)
- [ ] Renomear `conversations/` para `conversas/`
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

[Data de conclusão planejada] 