import { apiClient } from '../utils/http';
import type { ApiResponse } from '../utils/http';

// Define login response type
export interface LoginResponse {
  token: string;
  user?: any;
}

// Authentication API service
export const authApi = {
  /**
   * User login
   * @param username Username
   * @param password Password
   * @returns Promise containing login result
   */
  login: async (username: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<unknown, LoginResponse>('/auth/login', { username, password });
      
      // Save token
      if (response && response.token) {
        localStorage.setItem('token', response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },
  
  /**
   * User registration
   * @param username Username
   * @param password Password
   * @param email Email
   * @returns Promise containing registration result
   */
  register: async (username: string, password: string, email: string) => {
    try {
      const response = await apiClient.post('/auth/register', { username, password, email });
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },
  
  /**
   * Get current user information
   * @returns Promise containing user information
   */
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/user');
      return response;
    } catch (error) {
      console.error('Failed to get user info:', error);
      throw error;
    }
  },
  
  /**
   * Logout
   */
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },
  
  /**
   * Check if user is authenticated
   * @returns boolean Whether user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  }
}; 