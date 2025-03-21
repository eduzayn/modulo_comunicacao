import { test, expect, type Page } from '@playwright/test'

test.describe('Layout e Navegação', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto('http://localhost:3002')
  })

  test('deve renderizar o layout base corretamente', async ({ page }: { page: Page }) => {
    // Verifica elementos do layout base
    await expect(page.getByRole('banner')).toBeVisible()
    await expect(page.getByRole('navigation')).toBeVisible()
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('deve navegar entre módulos corretamente', async ({ page }: { page: Page }) => {
    // Comunicação
    await page.getByRole('link', { name: 'Comunicação' }).click()
    await expect(page).toHaveURL('/communication')
    await expect(page.getByText('Edunéxia Comunicação')).toBeVisible()

    // Chat
    await page.getByRole('link', { name: 'Chat' }).click()
    await expect(page).toHaveURL('/communication/chat')
    await expect(page.getByText('Nenhuma conversa selecionada')).toBeVisible()

    // Contatos
    await page.getByRole('link', { name: 'Contatos' }).click()
    await expect(page).toHaveURL('/communication/contacts')

    // Estatísticas
    await page.getByRole('link', { name: 'Estatísticas' }).click()
    await expect(page).toHaveURL('/communication/stats')
  })

  test('deve exibir breadcrumbs corretamente', async ({ page }: { page: Page }) => {
    // Navega para o chat
    await page.getByRole('link', { name: 'Chat' }).click()
    
    // Verifica os breadcrumbs
    const breadcrumbs = page.getByRole('navigation', { name: 'breadcrumbs' })
    await expect(breadcrumbs).toBeVisible()
    await expect(breadcrumbs.getByText('Comunicação')).toBeVisible()
    await expect(breadcrumbs.getByText('Chat')).toBeVisible()
  })

  test('deve alternar o sidebar corretamente', async ({ page }: { page: Page }) => {
    // Botão de toggle do sidebar
    const toggleButton = page.getByRole('button', { name: 'Toggle sidebar' })
    
    // Estado inicial
    await expect(page.getByTestId('sidebar')).toHaveClass(/w-\[280px\]/)
    
    // Colapsa o sidebar
    await toggleButton.click()
    await expect(page.getByTestId('sidebar')).toHaveClass(/w-16/)
    
    // Expande o sidebar
    await toggleButton.click()
    await expect(page.getByTestId('sidebar')).toHaveClass(/w-\[280px\]/)
  })

  test('deve exibir menu móvel corretamente', async ({ page }: { page: Page }) => {
    // Configura viewport para mobile
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Verifica se o botão do menu móvel está visível
    const menuButton = page.getByRole('button', { name: 'Menu' })
    await expect(menuButton).toBeVisible()
    
    // Abre o menu
    await menuButton.click()
    await expect(page.getByRole('navigation')).toBeVisible()
    
    // Navega pelo menu
    await page.getByRole('link', { name: 'Chat' }).click()
    await expect(page).toHaveURL('/communication/chat')
  })

  test('deve manter estado de navegação ao recarregar', async ({ page }: { page: Page }) => {
    // Navega para o chat
    await page.getByRole('link', { name: 'Chat' }).click()
    await expect(page).toHaveURL('/communication/chat')
    
    // Recarrega a página
    await page.reload()
    
    // Verifica se manteve a navegação
    await expect(page).toHaveURL('/communication/chat')
    await expect(page.getByText('Nenhuma conversa selecionada')).toBeVisible()
  })
}) 