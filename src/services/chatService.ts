// Chat service for interacting with AI model APIs
import axios from 'axios'
import { chatApi } from '../api/chat'
import type { ChatMessageDto, ChatRequestDto } from '../api/chat'

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface ChatRequest {
  messages: Message[];
  model: string;
  temperature: number;
  max_tokens: number;
  deep_thinking: boolean;
}

interface StreamCallbacks {
  onStart?: () => void;
  onToken?: (token: string) => void;
  onComplete?: (fullResponse: string) => void;
  onError?: (error: any) => void;
}

// Mock response data for development
const mockResponses = [
  "I'm an AI assistant designed to help you with various tasks.",
  "Based on your request, I've analyzed the data and found some interesting patterns.",
  "Here's the code you requested:\n```javascript\nfunction hello() {\n  console.log('Hello world');\n}\n```",
  "I'd be happy to help you with that question. Let me break it down step by step."
];

class ChatService {
  // Non-streaming chat completion
  async chatCompletion(request: ChatRequest): Promise<string> {
    try {
      // 转换请求格式
      const apiRequest: ChatRequestDto = {
        messages: request.messages.map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp
        })),
        model: request.model,
        temperature: request.temperature,
        max_tokens: request.max_tokens,
        deep_thinking: request.deep_thinking
      }
      
      // 调用API
      const response = await chatApi.chatWithAi(apiRequest)
      return response.content
    } catch (error) {
      console.error('Error in chat completion:', error)
      throw new Error('Failed to get AI response')
    }
  }

  // Streaming chat completion
  async streamChatCompletion(request: ChatRequest, callbacks: StreamCallbacks): Promise<() => void> {
    try {
      callbacks.onStart?.()
      
      // 转换请求格式
      const apiRequest: ChatRequestDto = {
        messages: request.messages.map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp
        })),
        model: request.model,
        temperature: request.temperature,
        max_tokens: request.max_tokens,
        deep_thinking: request.deep_thinking
      }
      
      let fullResponse = ''
      
      // 调用流式API
      const cancelStreaming = chatApi.streamChatWithAi(
        apiRequest,
        (token) => {
          fullResponse += token
          callbacks.onToken?.(token)
        },
        () => {
          callbacks.onComplete?.(fullResponse)
        },
        (error) => {
          console.error('Error in streaming chat:', error)
          callbacks.onError?.(error)
        }
      )
      
      // 返回取消函数
      return cancelStreaming
    } catch (error) {
      console.error('Error in streaming chat completion:', error)
      callbacks.onError?.(error)
      return () => {}
    }
  }
  
  // 切换AI模型
  async switchModel(modelId: string): Promise<boolean> {
    try {
      return await chatApi.switchModel(modelId)
    } catch (error) {
      console.error('Error switching model:', error)
      throw new Error('Failed to switch AI model')
    }
  }
}

export default new ChatService(); 