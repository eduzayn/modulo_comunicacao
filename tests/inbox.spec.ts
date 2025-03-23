import { test, expect } from '@playwright/test';
import { login, logout } from './utils';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente de teste
dotenv.config({ path: '.env.test' });

test.describe('Testes da Caixa de Entrada', () => {
  // Configuração de credenciais para todos os testes
  const email = process.env.TEST_USER_EMAIL || 'usuario@teste.com';
  const password = process.env.TEST_USER_PASSWORD || 'senha123';

  // Acessar a página da inbox
  test('deve mostrar a página da caixa de entrada quando autenticado', async ({ page }) => {
    // Faz login e navega para a inbox
    await login(page, email, password, '/inbox');
    
    // Verifica se a página carregou corretamente
    await expect(page.getByText('Caixa de Entrada')).toBeVisible();
    
    // Verifica se elementos essenciais estão presentes
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible();
  });
  
  // Testar a navegação entre conversas
  test('deve permitir navegar entre conversas', async ({ page }) => {
    // Faz login e navega para a inbox
    await login(page, email, password, '/inbox');
    
    // Verifica se há uma lista de conversas
    const conversationList = page.getByRole('list').filter({ hasText: 'Conversas' });
    await expect(conversationList).toBeVisible();
    
    // Se houver conversas, tenta clicar na primeira
    const firstConversation = conversationList.getByRole('listitem').first();
    if (await firstConversation.isVisible()) {
      await firstConversation.click();
      
      // Espera pelo carregamento da conversa
      await page.waitForTimeout(500);
      
      // Verifica se a interface de conversa está visível
      await expect(page.getByRole('textbox', { name: /Mensagem|Digite/ })).toBeVisible();
    }
  });
  
  // Testar filtros e busca
  test('deve permitir filtrar conversas', async ({ page }) => {
    // Faz login e navega para a inbox
    await login(page, email, password, '/inbox');
    
    // Procura pelo campo de busca
    const searchField = page.getByPlaceholder(/Buscar|Pesquisar/);
    
    // Se o campo existir, testa a funcionalidade de busca
    if (await searchField.isVisible()) {
      await searchField.fill('teste');
      await searchField.press('Enter');
      
      // Espera pelo resultado da busca
      await page.waitForTimeout(500);
    }
  });
  
  // Testar logout a partir da inbox
  test('deve permitir fazer logout a partir da inbox', async ({ page }) => {
    // Faz login e navega para a inbox
    await login(page, email, password, '/inbox');
    
    // Faz logout e verifica redirecionamento
    await logout(page);
  });
}); 