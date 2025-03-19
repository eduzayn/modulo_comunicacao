import { test, expect, type Page } from '@playwright/test';

test.describe('Módulo de Chat', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto('/communication/chat');
  });

  test('deve exibir o dashboard de chat', async ({ page }: { page: Page }) => {
    await expect(page.getByTestId('chat-title')).toBeVisible();
    await expect(page.getByTestId('new-chat-button')).toBeVisible();
  });

  test('deve iniciar uma nova conversa', async ({ page }: { page: Page }) => {
    await page.getByTestId('new-chat-button').click();
    await expect(page.getByTestId('chat-input')).toBeVisible();
    await expect(page.getByTestId('chat-messages')).toBeVisible();
  });

  test('deve enviar e receber mensagens', async ({ page }: { page: Page }) => {
    await page.getByTestId('new-chat-button').click();
    const messageInput = page.getByTestId('chat-input');
    await messageInput.fill('Olá, como vai?');
    await page.getByTestId('send-message-button').click();
    
    await expect(page.getByTestId('message-content')).toContainText('Olá, como vai?');
    await expect(page.getByTestId('message-status')).toBeVisible();
  });

  test('deve arquivar uma conversa', async ({ page }: { page: Page }) => {
    await page.getByTestId('new-chat-button').click();
    await page.getByTestId('archive-chat-button').click();
    await expect(page.getByTestId('archived-chat-badge')).toBeVisible();
    await expect(page.getByTestId('chat-input')).not.toBeVisible();
  });

  test('deve exibir mensagem de erro apropriada', async ({ page }: { page: Page }) => {
    await page.getByTestId('new-chat-button').click();
    const messageInput = page.getByTestId('chat-input');
    await messageInput.fill('');
    await page.getByTestId('send-message-button').click();
    
    await expect(page.getByTestId('error-message')).toContainText('A mensagem não pode estar vazia');
  });

  test('deve ser responsivo em dispositivos móveis', async ({ page }: { page: Page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByTestId('mobile-menu-button')).toBeVisible();
    await page.getByTestId('mobile-menu-button').click();
    await expect(page.getByTestId('mobile-sidebar')).toBeVisible();
    await expect(page.getByTestId('new-chat-button')).toBeVisible();
  });
}); 