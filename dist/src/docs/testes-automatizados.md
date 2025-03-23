# Testes Automatizados

Este documento descreve a estratégia de testes automatizados implementada no Módulo de Comunicação, incluindo testes end-to-end (E2E) com Playwright e testes unitários com Jest.

## Visão Geral

O projeto utiliza uma abordagem de testes em múltiplas camadas:

1. **Testes End-to-End (E2E)**: Utilizando Playwright para testar o comportamento completo da aplicação
2. **Testes Unitários**: Utilizando Jest para testar componentes e funções individuais
3. **Testes de Integração**: Combinando componentes e serviços para verificar seu funcionamento conjunto

### Estrutura de Diretórios

```
modulo_comunicacao/
├── e2e/                   # Testes end-to-end com Playwright
│   ├── setup/             # Configurações de ambiente para testes E2E
│   ├── chat.test.ts       # Testes do módulo de chat
│   ├── contacts.test.ts   # Testes do módulo de contatos
│   └── stats.test.ts      # Testes do módulo de estatísticas
│
├── src/
│   ├── tests/             # Testes unitários e de integração com Jest
│   │   ├── components/    # Testes de componentes React
│   │   ├── hooks/         # Testes de hooks customizados
│   │   ├── lib/           # Testes de utilidades e funções
│   │   └── services/      # Testes de serviços de API
│
├── jest.config.js         # Configuração do Jest
├── jest.setup.js          # Setup global para testes Jest
├── playwright.config.ts   # Configuração do Playwright
└── playwright-report/     # Relatórios gerados pelo Playwright
```

## Testes End-to-End (E2E)

### Ferramentas

- **Playwright**: Framework para testes automatizados de interface
- **Suporte multi-navegador**: Chrome, Firefox, Safari e dispositivos móveis
- **Vídeos e screenshots**: Captura automática em caso de falha

### Execução

Para executar os testes E2E:

```bash
# Executar todos os testes
npm run test:e2e

# Executar em modo UI (interface visual do Playwright)
npm run test:e2e:ui

# Executar testes específicos
npm run test:e2e -- chat.test.ts
```

### Exemplos de Testes E2E

Os testes E2E cobrem os principais fluxos de usuário:

#### Módulo de Chat

```typescript
// Exemplo simplificado do e2e/chat.test.ts
test.describe('Módulo de Chat', () => {
  test('deve exibir o dashboard de chat', async ({ page }) => {
    await page.goto('/communication/chat');
    await expect(page.getByTestId('chat-title')).toBeVisible();
  });

  test('deve enviar e receber mensagens', async ({ page }) => {
    await page.getByTestId('new-chat-button').click();
    await page.getByTestId('chat-input').fill('Olá, como vai?');
    await page.getByTestId('send-message-button').click();
    
    await expect(page.getByTestId('message-content'))
      .toContainText('Olá, como vai?');
  });
});
```

## Testes Unitários

### Ferramentas

- **Jest**: Framework de testes para JavaScript/TypeScript
- **React Testing Library**: Para testar componentes React
- **MSW (Mock Service Worker)**: Para simular chamadas de API

### Execução

Para executar os testes unitários:

```bash
# Executar todos os testes
npm run test

# Executar com watch mode
npm run test:watch

# Executar com cobertura
npm run test:coverage
```

### Exemplos de Testes Unitários

#### Testes de Componentes

```typescript
// src/tests/components/Button.test.tsx
describe('Button', () => {
  it('renderiza corretamente', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('executa o onClick quando clicado', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### Testes de Hooks

```typescript
// src/tests/hooks/useAuth.test.ts
describe('useAuth', () => {
  it('retorna usuário autenticado após login', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.login('user@example.com', 'password');
    });
    
    expect(result.current.user).not.toBeNull();
    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

## Melhores Práticas

### Data-testid

Utilizamos atributos `data-testid` para selecionar elementos nos testes:

```tsx
// No componente
<button data-testid="send-message-button">Enviar</button>

// No teste
await page.getByTestId('send-message-button').click();
```

### Isolamento de Testes

- Cada teste deve ser independente e não depender do estado de outros testes
- Utilize mocks para isolar dependências externas
- Reset do estado entre testes usando `beforeEach`

### Cobertura de Testes

O projeto tem como meta:

- **Testes unitários**: 80% de cobertura em branches, functions, lines e statements
- **Testes E2E**: Cobertura de todos os fluxos críticos de usuário

## Integração Contínua (CI)

Os testes são executados automaticamente:

- Em cada Pull Request
- Na branch principal após merge
- Em deploys para ambientes de staging e produção

## Troubleshooting

### Falhas em Testes E2E

1. Verifique os relatórios na pasta `playwright-report/`
2. Consulte os vídeos e screenshots gerados
3. Execute com `--debug` para depuração interativa

### Falhas em Testes Unitários

1. Use `--verbose` para ver detalhes do erro
2. Utilize `console.log` ou `debug` para verificar valores
3. Confira se os mocks estão configurados corretamente 