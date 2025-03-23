import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Executa testes em arquivos em paralelo */
  fullyParallel: true,
  /* Falha o build no CI se você acidentalmente deixou test.only no código fonte */
  forbidOnly: !!process.env.CI,
  /* Tenta novamente apenas no CI */
  retries: process.env.CI ? 2 : 0,
  /* Opta por não paralelizar testes no CI */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter para usar */
  reporter: [
    ['html'],
    ['list']
  ],
  
  // Pasta com arquivos compartilhados de setup
  outputDir: 'test-results/',
  
  // Tempo máximo para considerar o teste como falho
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  
  /* Configurações compartilhadas para todos os projetos abaixo */
  use: {
    /* URL base para usar em ações como `await page.goto('/')` */
    baseURL: 'http://localhost:3000',
    /* Coleta trace quando tenta novamente o teste que falhou */
    trace: 'on-first-retry',
    /* Tira screenshot em caso de falha */
    screenshot: 'only-on-failure',
    /* Grava vídeo apenas para testes com falha */
    video: 'on-first-retry',
    /* Armazena artefatos de teste (screenshots, vídeos) */
    actionTimeout: 10000,
    navigationTimeout: 15000,
  },

  /* Configura projetos para os principais navegadores */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 13'] },
    },
    {
      name: 'component',
      testDir: './tests/components',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'authenticated',
      testDir: './tests/authenticated',
      use: { 
        ...devices['Desktop Chrome'],
        /* Armazena o estado autenticado */
        storageState: './tests/fixtures/authenticatedState.json',
      },
    },
  ],

  /* Executa o servidor de desenvolvimento local antes de iniciar os testes */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
    timeout: 120 * 1000, // Espera até 2 minutos para o servidor iniciar
  },
});
