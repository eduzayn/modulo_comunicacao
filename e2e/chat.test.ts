import { test, expect } from '@playwright/test';

test.describe('Módulo de Chat', () => {
  test.beforeEach(async ({ page }) => {
    // Navega para a página de chat
    await page.goto('/communication/chat');
  });

  test('deve exibir a interface do chat corretamente', async ({ page }) => {
    // Verifica elementos principais da interface
    await expect(page.getByRole('heading', { name: 'Chat' })).toBeVisible();
    await expect(page.getByPlaceholder('Digite sua mensagem...')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Enviar' })).toBeVisible();
  });

  test('deve iniciar uma nova conversa', async ({ page }) => {
    // Clica no botão de nova conversa
    await page.getByRole('button', { name: 'Nova Conversa' }).click();
    
    // Verifica se a conversa foi iniciada
    await expect(page.getByText('Nova Conversa')).toBeVisible();
    await expect(page.getByPlaceholder('Digite sua mensagem...')).toBeEnabled();
  });

  test('deve enviar e receber mensagens', async ({ page }) => {
    // Inicia uma nova conversa
    await page.getByRole('button', { name: 'Nova Conversa' }).click();
    
    // Envia uma mensagem
    const mensagemTeste = 'Olá, como posso ajudar?';
    await page.getByPlaceholder('Digite sua mensagem...').fill(mensagemTeste);
    await page.getByRole('button', { name: 'Enviar' }).click();
    
    // Verifica se a mensagem foi enviada
    await expect(page.getByText(mensagemTeste)).toBeVisible();
    
    // Aguarda e verifica a resposta da IA
    await expect(page.getByTestId('message-assistant')).toBeVisible({ timeout: 10000 });
  });

  test('deve arquivar uma conversa', async ({ page }) => {
    // Inicia uma nova conversa
    await page.getByRole('button', { name: 'Nova Conversa' }).click();
    
    // Arquiva a conversa
    await page.getByRole('button', { name: 'Arquivar Conversa' }).click();
    
    // Verifica se a conversa foi arquivada
    await expect(page.getByText('Nova Conversa')).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Nova Conversa' })).toBeVisible();
  });

  test('deve exibir mensagens de erro apropriadas', async ({ page }) => {
    // Tenta enviar mensagem sem conversa ativa
    await page.getByPlaceholder('Digite sua mensagem...').fill('Teste');
    await page.getByRole('button', { name: 'Enviar' }).click();
    
    // Verifica mensagem de erro
    await expect(page.getByText('Nenhuma conversa ativa')).toBeVisible();
  });

  test('deve ser responsivo em dispositivos móveis', async ({ page }) => {
    // Define viewport para mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verifica elementos responsivos
    await expect(page.getByTestId('chat-sidebar')).toBeHidden();
    await expect(page.getByRole('button', { name: 'Menu' })).toBeVisible();
    
    // Abre menu mobile
    await page.getByRole('button', { name: 'Menu' }).click();
    await expect(page.getByTestId('chat-sidebar')).toBeVisible();
  });
}); 