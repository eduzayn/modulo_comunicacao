import { test as setup } from '@playwright/test';
import { login, saveAuthState } from './utils';
import dotenv from 'dotenv';

// Carrega variáveis de ambiente
dotenv.config({ path: '.env.test' });

// Configuração para criar um estado autenticado que pode ser usado por outros testes
setup('configurar estado autenticado', async ({ page }) => {
  // Obtém credenciais das variáveis de ambiente ou usa valores padrão
  const email = process.env.TEST_USER_EMAIL || 'usuario@teste.com';
  const password = process.env.TEST_USER_PASSWORD || 'senha123';
  
  // Faz login com as credenciais
  await login(page, email, password, '/inbox');
  
  // Salva o estado de autenticação para ser usado por outros testes
  await saveAuthState(page, 'authenticatedState.json');
}); 