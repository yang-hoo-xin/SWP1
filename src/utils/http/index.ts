import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';

// Define API response type to match backend Result class
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

// Create axios instance
const createAxiosClient = (config?: AxiosRequestConfig): AxiosInstance => {
  const client = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
    ...config
  });

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      console.log('Request being sent:', config.url, config.data);
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  client.interceptors.response.use(
    (response) => {
      console.log('Raw response received:', response);
      
      // Check if response has data property
      if (response.data) {
        // Check if it's a standard API response format with code field
        if (response.data.code !== undefined) {
          console.log('Standard API response detected');
          const { code, message, data } = response.data as ApiResponse<any>;
          
          if (code === 200) {
            console.log('Success response with data:', data);
            return data;
          } else {
            console.error('API Error:', message);
            return Promise.reject(new Error(message || 'Request failed'));
          }
        } else {
          // Direct data response (not wrapped in Result)
          console.log('Non-standard API response, returning direct data:', response.data);
          return response.data;
        }
      }
      
      // Empty response
      console.warn('Empty response data');
      return null;
    },
    (error) => {
      console.error('Request Error:', error);
      
      if (error.response) {
        const { status } = error.response;
        console.error('Error status:', status);
        console.error('Error data:', error.response.data);
        
        // Handle 401 error - Unauthorized
        if (status === 401) {
          localStorage.removeItem('token');
          // 不再使用 window.location.href，而是触发一个自定义事件
          const authErrorEvent = new CustomEvent('auth-error', { detail: { status } });
          window.dispatchEvent(authErrorEvent);
        }
      }
      
      return Promise.reject(error);
    }
  );

  return client;
};

// Export the default API client
export const apiClient = createAxiosClient();

// Export a function to create custom API clients if needed
export const createApiClient = createAxiosClient; 