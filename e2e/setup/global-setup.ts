import { _electron, chromium, devices, firefox, webkit } from 'playwright'

async function globalSetup() {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  
  try {
    // Navega para a página inicial para garantir que o servidor está rodando
    await page.goto('http://localhost:3000')
    console.log('✓ Servidor está rodando')
  } catch (error) {
    console.error('✗ Erro ao conectar ao servidor:', error)
    process.exit(1)
  }

  await browser.close()
}

export default globalSetup 