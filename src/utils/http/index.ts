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
      console.log('Request being sent:', config.url, config.method, config.headers);
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log('Raw response received:', response.status, response.config.url);
      
      // 检查是否包含敏感信息的URL，例如用户信息
      const isSensitiveUrl = response.config.url?.includes('/auth/user') || 
                            response.config.url?.includes('/user/profile');
      
      // 对敏感信息的返回只记录状态，不记录具体内容
      if (isSensitiveUrl) {
        console.log('Sensitive data response received, logging suppressed for privacy');
      } else {
        // 对非敏感信息才记录简短内容
        console.log('Response data:', JSON.stringify(response.data).substring(0, 100) + '...');
      }
      
      // 检查响应是否是二进制数据或者其他非标准格式
      const contentType = response.headers['content-type'] || '';
      if (contentType.includes('application/octet-stream') || 
          contentType.includes('image/') ||
          contentType.includes('application/pdf')) {
        console.log('Binary or special content type detected:', contentType);
        return response.data;
      }
      
      // Check if response has data property
      if (response.data) {
        // Check if it's a standard API response format with code field
        if (response.data.code !== undefined) {
          console.log('Standard API response detected, code:', response.data.code);
          const apiResponse = response.data as ApiResponse<any>;
          
          if (apiResponse.code === 200) {
            // 对于敏感API，不记录具体的数据结构
            if (!isSensitiveUrl) {
              console.log('Success response with data structure:', 
                        typeof apiResponse.data, 
                        Array.isArray(apiResponse.data) ? 'array' : 'not array');
            }
            return apiResponse.data;
          } else {
            console.error('API Error:', apiResponse.code, apiResponse.message);
            return Promise.reject(new Error(apiResponse.message || 'Request failed'));
          }
        } else {
          // Direct data response (not wrapped in Result)
          console.log('Non-standard API response, returning direct data type:', typeof response.data);
          return response.data;
        }
      }
      
      // Empty response
      console.warn('Empty response data');
      return null;
    },
    (error) => {
      console.error('Response interceptor error:', error);
      
      if (error.response) {
        const { status, data, config } = error.response;
        console.error(`Error ${status} for ${config?.method} ${config?.url}`);
        console.error('Error response data:', data);
        
        // Extract error message if available in response
        let errorMessage = 'Request failed';
        if (data && data.message) {
          errorMessage = data.message;
        } else if (typeof data === 'string') {
          errorMessage = data;
        } else if (data && data.error) {
          errorMessage = data.error;
        }
        
        // Handle 401 error - Unauthorized
        if (status === 401) {
          localStorage.removeItem('token');
          // Trigger a custom event for authentication error
          const authErrorEvent = new CustomEvent('auth-error', { detail: { status } });
          window.dispatchEvent(authErrorEvent);
        }
        
        return Promise.reject(new Error(errorMessage));
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