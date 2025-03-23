import { test, expect } from '@playwright/test';

test.describe('Módulo de Contatos', () => {
  test.beforeEach(async ({ page }) => {
    // Navega para a página de contatos
    await page.goto('/communication/contacts');
  });

  test('deve exibir a lista de contatos', async ({ page }) => {
    // Verifica elementos principais da interface
    await expect(page.getByRole('heading', { name: 'Contatos' })).toBeVisible();
    await expect(page.getByTestId('new-contact-button')).toBeVisible();
    await expect(page.getByTestId('contact-search')).toBeVisible();
  });

  test('deve filtrar contatos pela busca', async ({ page }) => {
    // Preenche o campo de busca
    await page.getByTestId('contact-search').fill('João');
    
    // Verifica se a lista foi filtrada
    await expect(page.getByTestId('contact-name')).toContainText('João');
    await expect(page.getByTestId('contact-name')).not.toContainText('Maria');
  });

  test('deve abrir modal de novo contato', async ({ page }) => {
    // Clica no botão de adicionar contato
    await page.getByTestId('new-contact-button').click();
    
    // Verifica se o modal foi aberto
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Novo Contato' })).toBeVisible();
  });

  test('deve adicionar novo contato', async ({ page }) => {
    // Abre o modal de novo contato
    await page.getByTestId('new-contact-button').click();
    
    // Preenche o formulário
    await page.getByTestId('contact-name-input').fill('João Silva');
    await page.getByTestId('contact-email-input').fill('joao@exemplo.com');
    await page.getByTestId('contact-phone-input').fill('(11) 99999-9999');
    await page.getByTestId('contact-type-select').selectOption('Aluno');
    await page.getByTestId('contact-submit-button').click();
    
    // Verifica se o contato foi adicionado
    await expect(page.getByTestId('contact-name')).toContainText('João Silva');
    await expect(page.getByTestId('contact-email')).toContainText('joao@exemplo.com');
  });

  test('deve editar contato existente', async ({ page }) => {
    // Clica no botão de editar do primeiro contato
    await page.getByTestId('edit-contact-button').first().click();
    
    // Edita o nome do contato
    await page.getByTestId('contact-name-input').fill('João Silva Editado');
    await page.getByTestId('contact-submit-button').click();
    
    // Verifica se o contato foi atualizado
    await expect(page.getByTestId('contact-name')).toContainText('João Silva Editado');
  });

  test('deve excluir contato', async ({ page }) => {
    // Armazena o nome do primeiro contato
    const nomeContato = await page.getByTestId('contact-name').first().textContent();
    
    // Clica no botão de excluir
    await page.getByTestId('delete-contact-button').first().click();
    
    // Confirma a exclusão
    await page.getByTestId('confirm-delete-button').click();
    
    // Verifica se o contato foi removido
    await expect(page.getByTestId('contact-name')).not.toContainText(nomeContato || '');
  });

  test('deve ser responsivo em dispositivos móveis', async ({ page }) => {
    // Define viewport para mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verifica layout responsivo
    await expect(page.getByTestId('contact-grid')).toHaveCSS('grid-template-columns', 'repeat(1, minmax(0, 1fr))');
    
    // Verifica se os botões de ação estão no menu dropdown em mobile
    await page.getByTestId('contact-actions-menu').first().click();
    await expect(page.getByRole('menuitem', { name: 'Editar' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Excluir' })).toBeVisible();
  });
}); 