// Chat service for interacting with AI model APIs
import axios from 'axios'
import { ref } from 'vue'

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
      // In a real app, this would call your backend API
      // const response = await axios.post('/api/chat/completion', request);
      // return response.data.message;
      
      // For development, return a mock response
      console.log('Chat request:', request);
      const randomIndex = Math.floor(Math.random() * mockResponses.length);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return mockResponses[randomIndex];
    } catch (error) {
      console.error('Error in chat completion:', error);
      throw new Error('Failed to get AI response');
    }
  }

  // Streaming chat completion
  async streamChatCompletion(request: ChatRequest, callbacks: StreamCallbacks): Promise<void> {
    try {
      callbacks.onStart?.();
      
      // In a real app, this would use server-sent events or websockets
      // For development, simulate streaming with timeouts
      console.log('Streaming chat request:', request);
      
      // Choose a random response
      const randomIndex = Math.floor(Math.random() * mockResponses.length);
      const fullResponse = mockResponses[randomIndex];
      
      // Stream the response character by character
      let currentText = '';
      for (const char of fullResponse) {
        // Add a small random delay between tokens
        await new Promise(resolve => setTimeout(resolve, 20 + Math.random() * 80));
        currentText += char;
        callbacks.onToken?.(char);
      }
      
      callbacks.onComplete?.(fullResponse);
    } catch (error) {
      console.error('Error in streaming chat completion:', error);
      callbacks.onError?.(error);
    }
  }
}

export default new ChatService(); 