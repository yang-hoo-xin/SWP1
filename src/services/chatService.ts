import axios from 'axios'

// API base URL - change this to your SpringBoot server URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
}

export interface ChatRequest {
  messages: ChatMessage[]
  model: string
  temperature?: number
  max_tokens?: number
  deep_thinking?: boolean
}

export interface StreamCallbacks {
  onStart?: () => void
  onToken?: (token: string) => void
  onComplete?: (fullResponse: string) => void
  onError?: (error: any) => void
}

/**
 * Chat service for interacting with the DeepSeek model via SpringBoot backend
 */
export const chatService = {
  /**
   * Send a chat completion request with streaming
   */
  async streamChatCompletion(request: ChatRequest, callbacks: StreamCallbacks): Promise<void> {
    try {
      callbacks.onStart?.()
      
      const response = await fetch(`${API_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream'
        },
        body: JSON.stringify(request)
      })
      
      if (!response.ok || !response.body) {
        throw new Error(`Error: ${response.status} ${response.statusText}`)
      }
      
      // Create a reader for the response stream
      const reader = response.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let fullResponse = ''
      let buffer = ''
      
      // Process the stream
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        // Decode the received chunk
        const chunk = decoder.decode(value, { stream: true })
        buffer += chunk
        
        // Process the buffer for SSE events
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''
        
        for (const line of lines) {
          if (line.startsWith('data:')) {
            const data = line.substring(5).trim()
            
            // Handle [DONE] marker
            if (data === '[DONE]') {
              break
            }
            
            try {
              // Parse the JSON data
              const parsed = JSON.parse(data)
              const token = parsed.choices?.[0]?.delta?.content || ''
              
              if (token) {
                callbacks.onToken?.(token)
                fullResponse += token
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e)
            }
          }
        }
      }
      
      callbacks.onComplete?.(fullResponse)
    } catch (error) {
      console.error('Error in streaming chat completion:', error)
      callbacks.onError?.(error)
    }
  },
  
  /**
   * Send a normal chat completion request (non-streaming)
   */
  async chatCompletion(request: ChatRequest): Promise<string> {
    try {
      const response = await axios.post(`${API_URL}/chat/completions`, request)
      return response.data.choices[0].message.content
    } catch (error) {
      console.error('Error in chat completion:', error)
      throw error
    }
  },
  
  /**
   * Get available models from the backend
   */
  async getModels(): Promise<any[]> {
    try {
      const response = await axios.get(`${API_URL}/models`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching models:', error)
      return []
    }
  }
}

export default chatService 