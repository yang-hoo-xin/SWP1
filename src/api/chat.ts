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

// Chat API service
export const chatApi = {
  /**
   * Get all conversations
   * @returns Promise containing conversations list
   */
  getConversations: async (): Promise<Conversation[]> => {
    try {
      const response = await apiClient.get<Conversation[]>('/chat/conversations');
      return response;
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
      const response = await apiClient.get<Conversation>(`/chat/conversations/${id}`);
      return response;
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
      const response = await apiClient.post<Conversation>('/chat/conversations', { title });
      return response;
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
      const response = await apiClient.post<Message>(`/chat/conversations/${conversationId}/messages`, {
        content,
        sender: 'user'
      });
      return response;
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
  }
}; 