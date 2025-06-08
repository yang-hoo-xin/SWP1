import { apiClient } from '../utils/http';
import type { ApiResponse } from '../utils/http';
import type { LoginParams, LoginResponseData, UserInfo, RegisterParams, RegisterResponseData } from '../types/user';

// Authentication API service
export const authApi = {
  /**
   * Get captcha image
   * @returns Promise containing captcha image and uuid
   */
  getCaptcha: async (): Promise<{ uuid: string, imageBase64: string }> => {
    try {
      // Updated endpoint with /api prefix to match backend context-path
      const response = await apiClient.get<any, any>('/captcha/generate');
      console.log('Captcha API raw response:', response);
      
      if (response && typeof response === 'object') {
        // Extract uuid and img from the response
        if ('uuid' in response && 'img' in response) {
          return {
            uuid: response.uuid,
            imageBase64: response.img
          };
        }
      }
      
      console.error('Invalid captcha response format:', response);
      throw new Error('Invalid captcha response format');
    } catch (error) {
      console.error('Failed to get captcha:', error);
      throw error;
    }
  },

  /**
   * User login
   * @param username Username
   * @param password Password
   * @param captcha Captcha code
   * @param captchaUuid Captcha UUID
   * @returns Promise containing login result
   */
  login: async (
    username: string, 
    password: string, 
    captcha: string, 
    captchaUuid: string
  ): Promise<LoginResponseData> => {
    try {
      console.log('Attempting login with:', { username, password, captcha, captchaUuid });
      
      // Mock login for testing without backend
      if (import.meta.env.DEV && username === 'admin' && password === 'admin123') {
        console.log('Using mock login in development mode');
        return {
          token: 'mock-jwt-token-' + Date.now(),
          user: { 
            id: 1, 
            username: 'admin',
            nickname: 'Administrator',
            roles: ['ADMIN']
          }
        };
      }
      
      // Send login request to backend - /api is already in the URL
      const response = await apiClient.post<unknown, any>('/auth/login', { 
        username, 
        password,
        captcha,
        captchaUuid,
        rememberMe: false
      });
      
      console.log('Login response:', response);
      
      // Extract data from response - response is the data property of the Result object
      if (response && typeof response === 'object') {
        // 在apiClient拦截器中已经提取了Result中的data字段
        const { token, user } = response;
        
        // Save token
        if (token) {
          localStorage.setItem('token', token);
          console.log('Token saved to localStorage');
        } else {
          console.warn('No token in response:', response);
        }
        
        return { token, user };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },
  
  /**
   * User registration
   * @param registerParams Registration parameters
   * @returns Promise containing registration result
   */
  register: async (registerParams: RegisterParams): Promise<RegisterResponseData> => {
    try {
      console.log('Attempting registration with:', { 
        username: registerParams.username, 
        email: registerParams.email,
        captcha: registerParams.captcha
      });
      
      const response = await apiClient.post<unknown, ApiResponse<any>>('/auth/register', {
        username: registerParams.username,
        password: registerParams.password,
        confirmPassword: registerParams.confirmPassword,
        email: registerParams.email,
        captcha: registerParams.captcha,
        captchaUuid: registerParams.captchaUuid,
        emailCode: registerParams.emailCode
      });
      
      console.log('Registration response:', response);
      
      return { 
        success: true,
        message: 'Registration successful'
      };
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },
  
  /**
   * Get current user information
   * @returns Promise containing user information
   */
  getCurrentUser: async (): Promise<UserInfo> => {
    try {
      const response = await apiClient.get<unknown, UserInfo>('/auth/user');
      
      if (response) {
        return response;
      } else {
        throw new Error('Invalid response from server');
      }
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
    // 不再使用强制刷新方式
    // 仅清除token，具体导航逻辑由调用方处理
  },
  
  /**
   * Check if user is authenticated
   * @returns boolean Whether user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  /**
   * Send email verification code
   * @param data Email and type
   */
  sendEmailCode: async (data: { email: string, type: string }): Promise<any> => {
    console.log(`Sending verification code to email: ${data.email}`);
    return apiClient.post<unknown, ApiResponse<{success: boolean}>>('/auth/email/code', { 
      email: data.email,
      type: data.type
    });
  },

  /**
   * Verify email code
   * @param data Email and verification code
   */
  verifyEmailCode: async (data: { email: string, code: string }): Promise<any> => {
    console.log(`Verifying email code: ${data.email}, ${data.code}`);
    return apiClient.post<unknown, ApiResponse<{success: boolean}>>('/auth/email/verify', { 
      email: data.email,
      code: data.code
    });
  },
};

// Export email verification methods separately for easier import
export const sendEmailCode = authApi.sendEmailCode;
export const verifyEmailCode = authApi.verifyEmailCode;
export const getCaptcha = authApi.getCaptcha;
export const register = authApi.register; 