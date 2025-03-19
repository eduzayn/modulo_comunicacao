import { test, expect } from '@playwright/test';

test.describe('Módulo de Estatísticas', () => {
  test.beforeEach(async ({ page }) => {
    // Navega para a página de estatísticas
    await page.goto('/communication/stats');
  });

  test('deve exibir o dashboard de estatísticas', async ({ page }) => {
    // Verifica elementos principais da interface
    await expect(page.getByRole('heading', { name: 'Estatísticas' })).toBeVisible();
    await expect(page.getByTestId('stats-cards')).toBeVisible();
    await expect(page.getByTestId('stats-charts')).toBeVisible();
  });

  test('deve exibir cards com métricas principais', async ({ page }) => {
    // Verifica cards de métricas
    await expect(page.getByTestId('total-messages')).toBeVisible();
    await expect(page.getByTestId('active-conversations')).toBeVisible();
    await expect(page.getByTestId('response-time')).toBeVisible();
    await expect(page.getByTestId('satisfaction-rate')).toBeVisible();
  });

  test('deve permitir filtrar por período', async ({ page }) => {
    // Seleciona período de 7 dias
    await page.getByRole('button', { name: 'Filtrar período' }).click();
    await page.getByRole('option', { name: 'Últimos 7 dias' }).click();
    
    // Verifica se os dados foram atualizados
    await expect(page.getByTestId('stats-loading')).toBeVisible();
    await expect(page.getByTestId('stats-loading')).not.toBeVisible();
    await expect(page.getByTestId('stats-charts')).toBeVisible();
  });

  test('deve exibir gráficos interativos', async ({ page }) => {
    // Verifica gráfico de mensagens por dia
    await expect(page.getByTestId('messages-chart')).toBeVisible();
    
    // Interage com o gráfico
    await page.getByTestId('chart-legend-item').first().hover();
    await expect(page.getByTestId('chart-tooltip')).toBeVisible();
  });

  test('deve exportar relatório', async ({ page }) => {
    // Clica no botão de exportar
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Exportar Relatório' }).click();
    
    // Aguarda download iniciar
    const download = await downloadPromise;
    
    // Verifica nome do arquivo
    expect(download.suggestedFilename()).toMatch(/relatorio-estatisticas.*\.xlsx$/);
  });

  test('deve ser responsivo em dispositivos móveis', async ({ page }) => {
    // Define viewport para mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verifica layout responsivo dos cards
    await expect(page.getByTestId('stats-cards')).toHaveCSS('grid-template-columns', 'repeat(1, minmax(0, 1fr))');
    
    // Verifica se os gráficos se ajustam
    await expect(page.getByTestId('stats-charts')).toHaveCSS('width', '100%');
  });

  test('deve atualizar dados em tempo real', async ({ page }) => {
    // Captura valor inicial de mensagens
    const initialValue = await page.getByTestId('total-messages').textContent();
    
    // Simula nova mensagem (via websocket/polling)
    await page.evaluate(() => {
      window.postMessage({ type: 'NEW_MESSAGE' }, '*');
    });
    
    // Verifica se o valor foi atualizado
    await expect(page.getByTestId('total-messages')).not.toHaveText(initialValue || '');
  });
}); 