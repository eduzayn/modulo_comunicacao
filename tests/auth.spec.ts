import { test, expect } from '@playwright/test';

test.describe('Testes de Autenticação', () => {
  
  test('deve mostrar a página de login', async ({ page }) => {
    // Navega para a página de login
    await page.goto('/login');
    
    // Verifica se o título da página está correto
    await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible();
    
    // Verifica se o formulário de login está presente
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Senha')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
  });
  
  test('deve mostrar erro para credenciais inválidas', async ({ page }) => {
    // Navega para a página de login
    await page.goto('/login');
    
    // Preenche o formulário com credenciais inválidas
    await page.getByLabel('Email').fill('usuario@teste.com');
    await page.getByLabel('Senha').fill('senha_incorreta');
    
    // Clica no botão de login
    await page.getByRole('button', { name: 'Entrar' }).click();
    
    // Espera pela resposta do servidor (pode demorar um pouco)
    await page.waitForTimeout(1000);
    
    // Verifica se permanece na página de login
    await expect(page.url()).toContain('/login');
    
    // Verifica se existe alguma mensagem de erro
    await expect(page.getByText(/Credenciais inválidas|Ocorreu um erro/)).toBeVisible();
  });
  
  test('deve navegar para a página de cadastro', async ({ page }) => {
    // Navega para a página de login
    await page.goto('/login');
    
    // Clica no link "Criar conta"
    await page.getByText('Criar conta').click();
    
    // Verifica se foi redirecionado para a página de cadastro
    await expect(page.url()).toContain('/cadastro');
  });
  
  test('deve navegar para a página de recuperação de senha', async ({ page }) => {
    // Navega para a página de login
    await page.goto('/login');
    
    // Clica no link "Esqueceu a senha?"
    await page.getByText('Esqueceu a senha?').click();
    
    // Verifica se foi redirecionado para a página de recuperação de senha
    await expect(page.url()).toContain('/esqueci-senha');
  });
}); 