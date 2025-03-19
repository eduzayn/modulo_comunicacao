import { test, expect } from '@playwright/test';

test.describe('Módulo de Contatos', () => {
  test.beforeEach(async ({ page }) => {
    // Navega para a página de contatos
    await page.goto('/communication/contacts');
  });

  test('deve exibir a lista de contatos', async ({ page }) => {
    // Verifica elementos principais da interface
    await expect(page.getByRole('heading', { name: 'Contatos' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Adicionar Contato' })).toBeVisible();
    await expect(page.getByPlaceholder('Buscar contatos...')).toBeVisible();
  });

  test('deve filtrar contatos pela busca', async ({ page }) => {
    // Preenche o campo de busca
    await page.getByPlaceholder('Buscar contatos...').fill('João');
    
    // Verifica se a lista foi filtrada
    await expect(page.getByTestId('contact-list')).toContainText('João');
    await expect(page.getByTestId('contact-list')).not.toContainText('Maria');
  });

  test('deve abrir modal de novo contato', async ({ page }) => {
    // Clica no botão de adicionar contato
    await page.getByRole('button', { name: 'Adicionar Contato' }).click();
    
    // Verifica se o modal foi aberto
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Novo Contato' })).toBeVisible();
  });

  test('deve adicionar novo contato', async ({ page }) => {
    // Abre o modal de novo contato
    await page.getByRole('button', { name: 'Adicionar Contato' }).click();
    
    // Preenche o formulário
    await page.getByLabel('Nome').fill('João Silva');
    await page.getByLabel('Email').fill('joao@exemplo.com');
    await page.getByLabel('Telefone').fill('(11) 99999-9999');
    await page.getByRole('button', { name: 'Salvar' }).click();
    
    // Verifica se o contato foi adicionado
    await expect(page.getByText('João Silva')).toBeVisible();
    await expect(page.getByText('joao@exemplo.com')).toBeVisible();
  });

  test('deve editar contato existente', async ({ page }) => {
    // Clica no botão de editar do primeiro contato
    await page.getByTestId('edit-contact-button').first().click();
    
    // Edita o nome do contato
    await page.getByLabel('Nome').fill('João Silva Editado');
    await page.getByRole('button', { name: 'Salvar' }).click();
    
    // Verifica se o contato foi atualizado
    await expect(page.getByText('João Silva Editado')).toBeVisible();
  });

  test('deve excluir contato', async ({ page }) => {
    // Armazena o nome do primeiro contato
    const nomeContato = await page.getByTestId('contact-name').first().textContent();
    
    // Clica no botão de excluir
    await page.getByTestId('delete-contact-button').first().click();
    
    // Confirma a exclusão
    await page.getByRole('button', { name: 'Confirmar' }).click();
    
    // Verifica se o contato foi removido
    await expect(page.getByText(nomeContato || '')).not.toBeVisible();
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