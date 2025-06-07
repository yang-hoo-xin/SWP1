import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';

// Define API response type
export interface ApiResponse<T> {
  code: number;
  msg?: string;
  data: T;
}

// Create axios instance
const createAxiosClient = (config?: AxiosRequestConfig): AxiosInstance => {
  const client = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
    ...config
  });

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
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
      const { code, msg, data } = response.data as ApiResponse<any>;
      
      if (code === 200 || code === 0) {
        return data;
      } else {
        console.error('API Error:', msg);
        return Promise.reject(new Error(msg || 'Request failed'));
      }
    },
    (error) => {
      console.error('Request Error:', error);
      
      if (error.response) {
        const { status } = error.response;
        
        // Handle 401 error - Unauthorized
        if (status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
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