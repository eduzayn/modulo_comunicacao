const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: '.env.test' });

async function setupAuth() {
  // Configuração do browser
  console.log('Iniciando configuração de autenticação...');
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Credenciais
  const email = process.env.TEST_USER_EMAIL || 'usuario@teste.com';
  const password = process.env.TEST_USER_PASSWORD || 'senha123';
  
  console.log(`Usando email: ${email}`);
  
  try {
    // Navega para a página de login
    console.log('Navegando para a página de login...');
    await page.goto('http://localhost:3000/login');
    
    // Preenche o formulário
    console.log('Preenchendo formulário de login...');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Senha').fill(password);
    
    // Clica no botão de login
    console.log('Clicando no botão de login...');
    await page.getByRole('button', { name: 'Entrar' }).click();
    
    // Espera pelo redirecionamento
    console.log('Aguardando redirecionamento...');
    await page.waitForURL('**/inbox', { timeout: 10000 });
    
    // Salva o estado
    const fixturesDir = path.join(__dirname, 'fixtures');
    if (!fs.existsSync(fixturesDir)) {
      fs.mkdirSync(fixturesDir, { recursive: true });
    }
    
    console.log('Salvando estado de autenticação...');
    await context.storageState({
      path: path.join(fixturesDir, 'authenticatedState.json')
    });
    
    console.log('Estado de autenticação salvo com sucesso!');
  } catch (error) {
    console.error('Erro durante configuração:', error);
  } finally {
    await browser.close();
  }
}

setupAuth(); 