import { Page, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Faz login no sistema
 * @param page Instância da página do Playwright
 * @param email Email do usuário
 * @param password Senha do usuário
 * @param expectedRedirect (Opcional) URL esperada após o login bem-sucedido
 */
export async function login(
  page: Page, 
  email: string, 
  password: string, 
  expectedRedirect?: string
): Promise<void> {
  // Navega para a página de login
  await page.goto('/login');
  
  // Preenche o formulário de login
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Senha').fill(password);
  
  // Clica no botão de login
  await page.getByRole('button', { name: 'Entrar' }).click();
  
  // Se foi fornecido um redirecionamento esperado, verifica se o usuário foi redirecionado
  if (expectedRedirect) {
    await page.waitForURL(`**${expectedRedirect}`);
    await expect(page.url()).toContain(expectedRedirect);
  }
}

/**
 * Salva o estado de autenticação para reuso em outros testes
 * @param page Instância da página do Playwright
 * @param fileName Nome do arquivo para salvar o estado
 */
export async function saveAuthState(
  page: Page, 
  fileName: string = 'auth.json'
): Promise<void> {
  // Cria o diretório de fixtures se não existir
  const fixturesDir = path.join(__dirname, 'fixtures');
  if (!fs.existsSync(fixturesDir)) {
    fs.mkdirSync(fixturesDir, { recursive: true });
  }
  
  // Salva o estado da sessão
  await page.context().storageState({
    path: path.join(fixturesDir, fileName)
  });
}

/**
 * Faz logout do sistema
 * @param page Instância da página do Playwright
 */
export async function logout(page: Page): Promise<void> {
  // Assume que o usuário está em alguma página protegida após o login
  
  // Clica no avatar/menu do usuário
  await page.getByRole('button', { name: /Menu|Usuário|Perfil/ }).click();
  
  // Clica na opção de logout/sair
  await page.getByRole('menuitem', { name: /Sair|Logout/ }).click();
  
  // Espera pelo redirecionamento para a página de login
  await page.waitForURL('**/login');
  await expect(page.url()).toContain('/login');
}

/**
 * Cria um usuário de teste via API (se disponível)
 * @param email Email do usuário de teste
 * @param password Senha do usuário de teste
 * @param name Nome do usuário de teste
 */
export async function createTestUser(
  email: string,
  password: string,
  name: string = 'Usuário de Teste'
): Promise<void> {
  // Esta função seria implementada usando a API do sistema
  // ou diretamente via Supabase para preparar dados de teste
  console.log(`Criando usuário de teste: ${email}`);
  
  // Aqui você pode implementar a lógica real de criação usando fetch ou outro método
  // Por enquanto, apenas registramos a intenção
}

/**
 * Limpa dados de teste após os testes
 * @param email Email do usuário de teste a ser removido
 */
export async function cleanupTestUser(email: string): Promise<void> {
  // Esta função seria implementada usando a API do sistema
  // ou diretamente via Supabase para limpar dados de teste
  console.log(`Removendo usuário de teste: ${email}`);
  
  // Aqui você pode implementar a lógica real de limpeza
} 