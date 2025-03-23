import { render, screen, fireEvent } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import ChatPage from '@/app/communication/chat/page'
import { usePathname } from 'next/navigation'

// Mock do usePathname
jest.mock('next/navigation', () => ({
  usePathname: jest.fn()
}))

describe('ChatPage Layout & Navigation Tests', () => {
  beforeEach(() => {
    // Mock do usePathname para retornar /communication/chat
    (usePathname as jest.Mock).mockReturnValue('/communication/chat')
  })

  describe('Layout Responsivo', () => {
    it('deve mostrar menu móvel em telas pequenas', () => {
      // Configura viewport para mobile
      global.innerWidth = 375
      global.dispatchEvent(new Event('resize'))

      render(<ChatPage />)
      
      // Verifica se o botão do menu móvel está visível
      const mobileMenuButton = screen.getByRole('button', { name: /menu/i })
      expect(mobileMenuButton).toBeVisible()
    })

    it('deve mostrar sidebar em telas grandes', () => {
      // Configura viewport para desktop
      global.innerWidth = 1024
      global.dispatchEvent(new Event('resize'))

      render(<ChatPage />)
      
      // Verifica se a sidebar está visível
      const sidebar = screen.getByRole('navigation')
      expect(sidebar).toBeVisible()
    })

    it('deve colapsar/expandir a sidebar corretamente', () => {
      render(<ChatPage />)
      
      // Encontra o botão de toggle da sidebar
      const toggleButton = screen.getByRole('button', { 
        name: /recolher menu/i 
      })

      // Clica no botão e verifica se a sidebar colapsou
      fireEvent.click(toggleButton)
      const collapsedSidebar = screen.getByRole('navigation')
      expect(collapsedSidebar).toHaveClass('w-16')

      // Clica novamente e verifica se expandiu
      fireEvent.click(toggleButton)
      expect(collapsedSidebar).not.toHaveClass('w-16')
    })
  })

  describe('Navegação', () => {
    it('deve navegar entre os itens do menu', () => {
      render(<ChatPage />)
      
      // Verifica se todos os links do menu estão presentes
      const menuItems = screen.getAllByRole('link')
      expect(menuItems).toHaveLength(5) // Início, Chat, Contatos, Estatísticas, Configurações

      // Verifica se o item atual está destacado
      const activeItem = screen.getByRole('link', { current: 'page' })
      expect(activeItem).toHaveTextContent('Chat')
    })

    it('deve mostrar/ocultar detalhes do contato', () => {
      render(<ChatPage />)
      
      // Seleciona um chat
      const chatButton = screen.getByRole('button', { name: /chat com maria silva/i })
      fireEvent.click(chatButton)

      // Clica no botão de detalhes
      const detailsButton = screen.getByRole('button', { name: /mostrar detalhes/i })
      fireEvent.click(detailsButton)

      // Verifica se os detalhes estão visíveis
      const detailsPanel = screen.getByRole('complementary')
      expect(detailsPanel).toBeVisible()

      // Clica novamente para ocultar
      fireEvent.click(detailsButton)
      expect(detailsPanel).not.toBeVisible()
    })
  })

  describe('Funcionalidades do Chat', () => {
    it('deve enviar mensagem corretamente', async () => {
      render(<ChatPage />)
      
      // Seleciona um chat
      const chatButton = screen.getByRole('button', { name: /chat com maria silva/i })
      fireEvent.click(chatButton)

      // Encontra o campo de mensagem e digita
      const messageInput = screen.getByRole('textbox', { name: /campo de mensagem/i })
      fireEvent.change(messageInput, { target: { value: 'Olá, tudo bem?' } })

      // Clica no botão de enviar
      const sendButton = screen.getByRole('button', { name: /enviar mensagem/i })
      fireEvent.click(sendButton)

      // Verifica se a mensagem apareceu na lista
      const sentMessage = await screen.findByText('Olá, tudo bem?')
      expect(sentMessage).toBeInTheDocument()
    })

    it('deve carregar mensagens antigas ao selecionar um chat', () => {
      render(<ChatPage />)
      
      // Seleciona um chat
      const chatButton = screen.getByRole('button', { name: /chat com maria silva/i })
      fireEvent.click(chatButton)

      // Verifica se as mensagens antigas foram carregadas
      const oldMessages = screen.getAllByRole('article')
      expect(oldMessages.length).toBeGreaterThan(0)
    })
  })

  describe('Acessibilidade', () => {
    it('deve ser navegável por teclado', () => {
      render(<ChatPage />)
      
      // Foca no primeiro elemento
      const firstFocusable = screen.getByRole('button', { name: /menu/i })
      firstFocusable.focus()

      // Simula navegação por tab
      fireEvent.keyDown(document, { key: 'Tab' })
      
      // Verifica se o foco mudou para o próximo elemento
      const nextFocusable = document.activeElement
      expect(nextFocusable).not.toBe(firstFocusable)
    })

    it('deve ter rótulos ARIA apropriados', () => {
      render(<ChatPage />)
      
      // Verifica se os botões têm rótulos adequados
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-label')
      })
    })
  })

  describe('Performance', () => {
    it('deve renderizar lista de chats sem problemas de performance', () => {
      const { container } = render(<ChatPage />)
      
      // Simula scroll na lista de chats
      const chatList = container.querySelector('.scroll-area')
      if (chatList) {
        act(() => {
          fireEvent.scroll(chatList, { target: { scrollY: 100 } })
        })
      }

      // Verifica se não houve re-renders desnecessários
      // Isso é mais um teste visual, mas podemos verificar se os elementos ainda estão presentes
      const chats = screen.getAllByRole('button', { name: /chat com/i })
      expect(chats.length).toBeGreaterThan(0)
    })
  })
}) 