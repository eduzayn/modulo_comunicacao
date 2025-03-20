import { useState, useCallback, useMemo } from 'react'
import { Chat, Message, generateMockChats, generateMockMessages, simulateResponse } from '@/types/chat'

interface ChatState {
  chats: Chat[]
  activeChat: Chat | null
  messages: Message[]
  searchTerm: string
  isSidebarCollapsed: boolean
  showContactDetails: boolean
  showTransferDialog: boolean
  showNewContactDialog: boolean
  showEditDialog: boolean
  isMobileMenuOpen: boolean
  editingContact: {
    name: string
    email: string
    phone: string
    type: string
  }
  newContact: {
    name: string
    email: string
    phone: string
    type: string
    message: string
  }
}

interface NewContact {
  name: string
  email: string
  phone: string
  type: string
}

interface ChatActions {
  setActiveChat: (chat: Chat) => void
  sendMessage: (content: string) => void
  handleFileUpload: (file: File) => void
  toggleSidebar: () => void
  toggleContactDetails: () => void
  toggleTransferDialog: () => void
  toggleNewContactDialog: () => void
  toggleEditDialog: () => void
  toggleMobileMenu: () => void
  updateSearchTerm: (term: string) => void
  createNewContact: (contact: NewContact) => void
  updateContact: (contact: Partial<Chat>) => void
  deleteMessage: (messageId: string) => void
}

export function useChatState(): [ChatState, ChatActions] {
  const [chats, setChats] = useState<Chat[]>(generateMockChats())
  const [activeChat, setActiveChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [showContactDetails, setShowContactDetails] = useState(true)
  const [showTransferDialog, setShowTransferDialog] = useState(false)
  const [showNewContactDialog, setShowNewContactDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [editingContact, setEditingContact] = useState({
    name: '',
    email: '',
    phone: '',
    type: ''
  })
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    phone: '',
    type: '',
    message: ''
  })

  const filteredChats = useMemo(() => {
    return chats.filter(chat =>
      chat.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.contactEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.contactPhone?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [chats, searchTerm])

  const handleSetActiveChat = useCallback((chat: Chat) => {
    setActiveChat(chat)
    setMessages(generateMockMessages(chat.id))
    setEditingContact({
      name: chat.contactName,
      email: chat.contactEmail || '',
      phone: chat.contactPhone || '',
      type: chat.contactType || ''
    })
  }, [])

  const handleSendMessage = useCallback((content: string) => {
    if (!content.trim() || !activeChat) return

    const newMessage: Message = {
      id: String(Date.now()),
      content,
      sender: 'Você',
      timestamp: new Date(),
      type: 'text',
      status: 'sent'
    }

    setMessages(prev => [...prev, newMessage])

    // Simular resposta após 1 segundo
    setTimeout(() => {
      const response = simulateResponse(content)
      setMessages(prev => [...prev, response])
    }, 1000)
  }, [activeChat])

  const handleFileUpload = useCallback((file: File) => {
    if (!file || !activeChat) return

    const newMessage: Message = {
      id: String(Date.now()),
      content: '',
      type: 'file',
      sender: 'Você',
      timestamp: new Date(),
      fileName: file.name,
      fileSize: `${Math.round(file.size / 1024)}KB`,
      status: 'sent'
    }

    setMessages(prev => [...prev, newMessage])
  }, [activeChat])

  const actions: ChatActions = {
    setActiveChat: handleSetActiveChat,
    sendMessage: handleSendMessage,
    handleFileUpload,
    toggleSidebar: () => setIsSidebarCollapsed(prev => !prev),
    toggleContactDetails: () => setShowContactDetails(prev => !prev),
    toggleTransferDialog: () => setShowTransferDialog(prev => !prev),
    toggleNewContactDialog: () => setShowNewContactDialog(prev => !prev),
    toggleEditDialog: () => setShowEditDialog(prev => !prev),
    toggleMobileMenu: () => setIsMobileMenuOpen(prev => !prev),
    updateSearchTerm: setSearchTerm,
    createNewContact: (contact: NewContact) => {
      const newChat: Chat = {
        id: String(Date.now()),
        contactName: contact.name,
        contactEmail: contact.email,
        contactPhone: contact.phone,
        contactType: contact.type,
        unreadCount: 0,
        tags: ['novo'],
        status: 'active'
      }
      setChats(prev => [newChat, ...prev])
      handleSetActiveChat(newChat)
    },
    updateContact: (contact) => {
      if (!activeChat) return
      const updatedChat = { ...activeChat, ...contact }
      setChats(prev => prev.map(chat => 
        chat.id === activeChat.id ? updatedChat : chat
      ))
      setActiveChat(updatedChat)
    },
    deleteMessage: (messageId) => {
      setMessages(prev => prev.filter(msg => msg.id !== messageId))
    }
  }

  const state: ChatState = {
    chats: filteredChats,
    activeChat,
    messages,
    searchTerm,
    isSidebarCollapsed,
    showContactDetails,
    showTransferDialog,
    showNewContactDialog,
    showEditDialog,
    isMobileMenuOpen,
    editingContact,
    newContact
  }

  return [state, actions]
} 