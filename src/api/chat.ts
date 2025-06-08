import { apiClient } from '../utils/http';

// Define chat message interface
export interface Message {
  id?: string;
  content: string;
  sender: string;
  timestamp?: string;
  conversationId?: string;
}

// Define conversation interface
export interface Conversation {
  id?: string;
  title: string;
  messages?: Message[];
  createdAt?: string;
  updatedAt?: string;
}

// AI聊天消息接口
export interface ChatMessageDto {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

// AI聊天请求接口
export interface ChatRequestDto {
  messages: ChatMessageDto[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
  deep_thinking?: boolean;
}

// 定义API响应类型
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

// Chat API service
export const chatApi = {
  /**
   * Get all conversations
   * @returns Promise containing conversations list
   */
  getConversations: async (): Promise<Conversation[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Conversation[]>>('/chat/conversations');
      return response.data.data;
    } catch (error) {
      console.error('Failed to get conversations:', error);
      throw error;
    }
  },
  
  /**
   * Get conversation by ID
   * @param id Conversation ID
   * @returns Promise containing conversation details
   */
  getConversation: async (id: string): Promise<Conversation> => {
    try {
      const response = await apiClient.get<ApiResponse<Conversation>>(`/chat/conversations/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Failed to get conversation ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Create a new conversation
   * @param title Conversation title
   * @returns Promise containing new conversation
   */
  createConversation: async (title: string): Promise<Conversation> => {
    try {
      const response = await apiClient.post<ApiResponse<Conversation>>('/chat/conversations', { title });
      return response.data.data;
    } catch (error) {
      console.error('Failed to create conversation:', error);
      throw error;
    }
  },
  
  /**
   * Send a message in a conversation
   * @param conversationId Conversation ID
   * @param content Message content
   * @returns Promise containing the sent message
   */
  sendMessage: async (conversationId: string, content: string): Promise<Message> => {
    try {
      const response = await apiClient.post<ApiResponse<Message>>(`/chat/conversations/${conversationId}/messages`, {
        content,
        sender: 'user'
      });
      return response.data.data;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  },
  
  /**
   * Delete a conversation
   * @param id Conversation ID to delete
   * @returns Promise containing operation result
   */
  deleteConversation: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/chat/conversations/${id}`);
    } catch (error) {
      console.error(`Failed to delete conversation ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * 与AI聊天（非流式）
   * @param request 聊天请求参数
   * @returns Promise containing AI response
   */
  chatWithAi: async (request: ChatRequestDto): Promise<ChatMessageDto> => {
    try {
      const response = await apiClient.post<ApiResponse<ChatMessageDto>>('/chat', request);
      return response.data.data;
    } catch (error) {
      console.error('Failed to chat with AI:', error);
      throw error;
    }
  },
  
  /**
   * 流式AI聊天（使用SSE）
   * @param request 聊天请求参数
   * @param onToken 接收流式响应的回调函数
   * @param onComplete 流式响应完成的回调函数
   * @param onError 错误处理回调函数
   */
  streamChatWithAi: (
    request: ChatRequestDto,
    onToken: (token: string) => void,
    onComplete?: () => void,
    onError?: (error: any) => void
  ) => {
    let eventSource: EventSource | null = null;
    
    try {
      // 创建唯一标识符，用于服务器识别客户端
      const clientId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
      
      // 发送POST请求并获取响应
      apiClient.post('/chat/stream', request)
        .then(response => {
          console.log('Stream response received:', response);
          // 如果有响应，直接处理
          if (typeof response === 'string') {
            onToken(response);
            if (onComplete) onComplete();
          }
        })
        .catch(error => {
          console.error('Error in streaming chat:', error);
          if (onError) onError(error);
        });
      
      // 返回取消函数
      return () => {
        if (eventSource) {
          eventSource.close();
          eventSource = null;
        }
      };
    } catch (error) {
      console.error('Error setting up streaming:', error);
      if (onError) onError(error);
      return () => {}; // 返回空函数
    }
  },
  
  /**
   * 切换AI模型
   * @param modelId 模型ID
   * @returns Promise containing operation result
   */
  switchModel: async (modelId: string): Promise<boolean> => {
    try {
      const response = await apiClient.post<ApiResponse<boolean>>(`/chat/model/${modelId}`);
      return response.data.data;
    } catch (error) {
      console.error(`Failed to switch model to ${modelId}:`, error);
      throw error;
    }
  }
}; 