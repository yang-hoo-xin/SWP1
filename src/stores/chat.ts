import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export const useChatStore = defineStore('chat', () => {
  const loading = ref(false)
  const chatSessions = ref<ChatSession[]>([])
  const currentSessionId = ref<string | null>(null)

  // Mock API URL (can be changed to real API later)
  const apiUrl = ref('mock-api')

  // Default system prompt
  const defaultSystemMessage: ChatMessage = {
    id: 'system-1',
    role: 'system',
    content: 'You are an intelligent AI assistant that can help users answer various questions.',
    timestamp: Date.now()
  }

  // Get current session
  const currentSession = computed(() => {
    if (!currentSessionId.value) return null
    return chatSessions.value.find(session => session.id === currentSessionId.value) || null
  })

  // Create new chat session
  const createNewSession = () => {
    const newSession: ChatSession = {
      id: generateId(),
      title: 'New Conversation',
      messages: [{ ...defaultSystemMessage }],
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    
    chatSessions.value.push(newSession)
    currentSessionId.value = newSession.id
    saveSessions()
    return newSession
  }

  // Switch to specific session
  const switchSession = (sessionId: string) => {
    currentSessionId.value = sessionId
  }

  // Delete session
  const deleteSession = (sessionId: string) => {
    const index = chatSessions.value.findIndex(s => s.id === sessionId)
    if (index !== -1) {
      chatSessions.value.splice(index, 1)
      
      // If deleting current session, switch to another or create new
      if (currentSessionId.value === sessionId) {
        if (chatSessions.value.length > 0) {
          currentSessionId.value = chatSessions.value[0].id
        } else {
          createNewSession()
        }
      }
      
      saveSessions()
    }
  }

  // Send message
  const sendMessage = async (content: string) => {
    if (!currentSessionId.value) {
      createNewSession()
    }
    
    // Add user message
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: Date.now()
    }
    
    if (currentSession.value) {
      currentSession.value.messages.push(userMessage)
      currentSession.value.updatedAt = Date.now()
      
      // If first user message, update title
      if (currentSession.value.messages.filter(m => m.role === 'user').length === 1) {
        currentSession.value.title = content.slice(0, 20) + (content.length > 20 ? '...' : '')
      }
      
      try {
        loading.value = true
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Local mock reply logic
        const reply = generateLocalReply(content)
        
        // Add assistant reply
        const assistantMessage: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: reply,
          timestamp: Date.now()
        }
        
        currentSession.value.messages.push(assistantMessage)
        currentSession.value.updatedAt = Date.now()
      } catch (error) {
        console.error('Message processing failed:', error)
        ElMessage.error('Failed to process message. Please try again.')
        
        // Add error message to chat
        const errorMessage: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: 'Sorry, I encountered an issue and cannot respond to your request right now. Please try again later.',
          timestamp: Date.now()
        }
        
        currentSession.value.messages.push(errorMessage)
      } finally {
        loading.value = false
        saveSessions()
      }
    }
  }

  // Local mock reply generation
  const generateLocalReply = (userQuestion: string): string => {
    userQuestion = userQuestion.toLowerCase()
    
    if (userQuestion.includes('hello') || userQuestion.includes('hi')) {
      return 'Hello! I am an AI assistant. How can I help you today?'
    } else if (userQuestion.includes('name')) {
      return 'I am an AI Assistant. Pleased to meet you!'
    } else if (userQuestion.includes('weather')) {
      return 'I\'m sorry, I cannot access real-time weather information at the moment. You can check a weather app or website for the latest forecast.'
    } else if (userQuestion.includes('time')) {
      return `The current time is ${new Date().toLocaleTimeString()}`
    } else if (userQuestion.includes('help') || userQuestion.includes('what can you do')) {
      return 'I can answer questions, provide information, engage in conversation, and more. What would you like assistance with?'
    } else if (userQuestion.includes('code') || userQuestion.includes('programming')) {
      return 'Here is a simple JavaScript function example:\n\n```javascript\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));\n// Output: Hello, World!\n```'
    } else {
      // Default reply
      return `I received your message: "${userQuestion}". As an AI assistant, I'm doing my best to understand and answer your question. Is there anything else I can help you with?`
    }
  }

  // Update session title
  const updateSessionTitle = (sessionId: string, title: string) => {
    const session = chatSessions.value.find(s => s.id === sessionId)
    if (session) {
      session.title = title
      saveSessions()
    }
  }

  // Save sessions to local storage
  const saveSessions = () => {
    localStorage.setItem('chat-sessions', JSON.stringify(chatSessions.value))
  }

  // Load sessions from local storage
  const loadSessions = () => {
    const savedSessions = localStorage.getItem('chat-sessions')
    if (savedSessions) {
      try {
        chatSessions.value = JSON.parse(savedSessions)
        
        // If sessions exist, select first, else create new
        if (chatSessions.value.length > 0) {
          currentSessionId.value = chatSessions.value[0].id
        } else {
          createNewSession()
        }
      } catch (e) {
        console.error('Failed to load sessions:', e)
        createNewSession()
      }
    } else {
      createNewSession()
    }
  }

  // Generate unique ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
  }

  // Initialize by loading sessions
  loadSessions()

  return {
    loading,
    chatSessions,
    currentSessionId,
    currentSession,
    apiUrl,
    createNewSession,
    switchSession,
    deleteSession,
    sendMessage,
    updateSessionTitle
  }
}) 