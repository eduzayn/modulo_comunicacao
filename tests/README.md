# Testes do Módulo de Comunicação

Este diretório contém os testes automatizados para o Módulo de Comunicação. Os testes são implementados usando o Playwright, um framework de automação de testes de ponta a ponta (end-to-end).

## Estrutura de Arquivos

```
tests/
├── auth.setup.ts          # Configuração de autenticação para testes
├── auth.spec.ts           # Testes de autenticação
├── inbox.spec.ts          # Testes da caixa de entrada
├── fixtures/              # Diretório para armazenar dados de teste
│   └── authenticatedState.json  # Estado de autenticação salvo
├── run-tests.js           # Script para executar os testes
└── utils.ts               # Utilitários compartilhados pelos testes
```

## Pré-requisitos

- Node.js 18 ou superior
- Navegadores instalados para o Playwright (Chrome, Firefox, etc.)

## Configuração Inicial

Antes de executar os testes, instale as dependências e configure os navegadores:

```bash
# Instalar dependências
npm install

# Instalar navegadores para o Playwright
npx playwright install
```

## Configuração do Ambiente

Configure as variáveis de ambiente no arquivo `.env.test` na raiz do projeto:

```
TEST_USER_EMAIL=seu-usuario-de-teste@example.com
TEST_USER_PASSWORD=sua-senha-de-teste
```

## Como Executar os Testes

### Executar todos os testes

```bash
npm run test
# ou
node tests/run-tests.js
```

### Executar testes específicos

```bash
# Testes de autenticação
node tests/run-tests.js auth

# Testes da caixa de entrada
node tests/run-tests.js inbox

# Configuração de autenticação (gera estado para outros testes)
node tests/run-tests.js setup
```

### Opções adicionais

```bash
# Executar em modo visual (com navegador visível)
node tests/run-tests.js all headed

# Executar em modo debug
node tests/run-tests.js all debug

# Executar com interface gráfica do Playwright
node tests/run-tests.js ui

# Gerar relatório HTML
node tests/run-tests.js all report
```

## Utilitários de Teste

O arquivo `utils.ts` contém funções auxiliares para os testes:

- `login()`: Faz login no sistema
- `logout()`: Faz logout do sistema
- `saveAuthState()`: Salva o estado de autenticação para reuso
- `createTestUser()`: Cria um usuário de teste (implementação mock)
- `cleanupTestUser()`: Remove dados de teste (implementação mock)

## Estratégia de Testes

### Testes de Autenticação

Os testes em `auth.spec.ts` verificam:
- Renderização correta da página de login
- Tratamento de credenciais inválidas
- Navegação para páginas relacionadas (cadastro, recuperação de senha)

### Testes da Caixa de Entrada

Os testes em `inbox.spec.ts` verificam:
- Acesso à caixa de entrada quando autenticado
- Navegação entre conversas
- Filtragem e busca de conversas
- Logout a partir da caixa de entrada

## Boas Práticas

1. **Isolamento de Testes:** Cada teste deve ser independente e não depender do estado de outros testes.

2. **Dados de Teste:** Use dados de teste temporários e limpe-os após a execução.

3. **Seletores Resilientes:** Prefira seletores baseados em roles, texto ou testid em vez de classes CSS ou XPath.

4. **Assertions Descritivas:** Use assertions descritivas com mensagens claras.

5. **Timeouts Adequados:** Defina timeouts adequados para cada operação, evitando valores muito baixos ou muito altos.

## Tecnologias Utilizadas

- **Playwright**: Framework para testes de navegação e end-to-end
- **TypeScript**: Linguagem de programação utilizada nos testes
- **HTML Reporter**: Geração de relatórios visuais dos testes

## Estrutura de Diretórios

```
tests/
  ├── e2e/                 # Testes end-to-end de fluxos completos
  │   ├── auth.spec.ts     # Testes de autenticação
  │   ├── inbox.spec.ts    # Testes do módulo de caixa de entrada
  │   ├── ai.spec.ts       # Testes do módulo de IA
  │   └── crm.spec.ts      # Testes do módulo de CRM
  │
  ├── integration/         # Testes de integração (APIs e banco de dados)
  │   ├── api.spec.ts      # Testes das APIs do sistema
  │   └── test-data.js     # Utilitário para criar dados de teste
  │
  ├── components/          # Testes de componentes individuais
  │   └── InboxComponents.spec.ts  # Testes de componentes do Inbox
  │
  ├── authenticated/       # Testes que necessitam de autenticação prévia
  │
  ├── utils/               # Utilitários para os testes
  │   └── auth.ts          # Funções de autenticação
  │
  ├── fixtures/            # Arquivos e dados para os testes
  │   ├── test-file.txt    # Arquivo para testes de upload
  │   └── authenticatedState.json  # Estado salvo de autenticação
  │
  └── run-tests.js         # Script auxiliar para execução de testes
```

## Preparação de Dados

Antes de executar os testes, é necessário preparar o ambiente com dados de teste:

```bash
# Configura dados básicos de teste no banco de dados
npm run test:setup-data
```

Este script cria:
- Um usuário de teste (se não existir)
- Contatos de teste
- Conversas e mensagens de teste
- Outros dados necessários para os testes

## Execução em CI/CD

Os testes são configurados para executar em ambiente de CI/CD. A configuração está no arquivo `playwright.config.ts` e detecta automaticamente quando está em ambiente de CI.

## Solução de Problemas

### Testes Falhando

1. Verifique se o servidor de desenvolvimento está rodando (`npm run dev`)
2. Verifique se as credenciais de teste são válidas
3. Execute com `--debug` para ver passo a passo
4. Verifique se os dados de teste foram configurados corretamente (`npm run test:setup-data`)

### Problemas com Supabase

1. Verifique se o Supabase está acessível
2. Verifique as políticas de RLS para o usuário de teste
3. Confirme que o usuário de teste tem permissões adequadas 