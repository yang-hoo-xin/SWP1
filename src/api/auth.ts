import { apiClient } from '../utils/http';
import type { ApiResponse } from '../utils/http';
import type { LoginParams, LoginResponseData, UserInfo, RegisterParams, RegisterResponseData } from '../types/user';

// Authentication API service
export const authApi = {
  /**
   * Get captcha image
   * @returns Promise containing captcha image and uuid
   */
  getCaptcha: async (): Promise<{ uuid: string, img: string }> => {
    try {
      // Try to get the captcha directly without type constraints
      const response = await apiClient.get<any, any>('/api/captcha/generate');
      console.log('Captcha API raw response:', response);
      
      // Handle different response formats
      if (response) {
        // Check if response is already the expected format
        if (typeof response === 'object' && 'uuid' in response && 'img' in response) {
          console.log('Captcha response in direct format');
          return {
            uuid: response.uuid as string,
            img: response.img as string
          };
        }
        
        // Check if the response has a data property (Result wrapper)
        if (typeof response === 'object' && response.data && 
            typeof response.data === 'object' && 'uuid' in response.data && 'img' in response.data) {
          console.log('Captcha response in wrapped format');
          return {
            uuid: response.data.uuid as string,
            img: response.data.img as string
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
      
      // Send login request to backend
      const response = await apiClient.post<unknown, ApiResponse<{token: string, user: UserInfo}>>('/api/auth/login', { 
        username, 
        password,
        captcha,
        captchaUuid,
        rememberMe: false
      });
      
      console.log('Login response:', response);
      
      // Extract data from response
      if (response && response.data) {
        const { token, user } = response.data;
        
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
      
      const response = await apiClient.post<unknown, ApiResponse<RegisterResponseData>>('/api/auth/register', {
        username: registerParams.username,
        password: registerParams.password,
        email: registerParams.email,
        captcha: registerParams.captcha,
        captchaUuid: registerParams.captchaUuid,
        emailCode: registerParams.emailCode
      });
      
      console.log('Registration response:', response);
      
      if (response) {
        return { 
          success: true,
          message: 'Registration successful'
        };
      } else {
        throw new Error('Invalid response format');
      }
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
      const response = await apiClient.get('/api/auth/user');
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
   * @param email Email address to send verification code to
   * @returns Promise containing success result
   */
  sendEmailCode: async (email: string): Promise<{success: boolean, message: string}> => {
    try {
      console.log('Sending verification code to email:', email);
      
      const response = await apiClient.post<unknown, ApiResponse<{success: boolean}>>('/api/auth/email/code', { 
        email,
        type: 'register' // 可以是 'register' 或 'reset' 取决于用途
      });
      
      console.log('Email verification code response:', response);
      
      return { 
        success: true,
        message: 'Verification code sent successfully'
      };
    } catch (error: any) {
      console.error('Failed to send verification code:', error);
      throw error;
    }
  },

  /**
   * Verify email code
   * @param email Email address
   * @param code Verification code
   * @returns Promise containing verification result
   */
  verifyEmailCode: async (email: string, code: string): Promise<{success: boolean, message: string}> => {
    try {
      console.log('Verifying email code:', { email, code });
      
      const response = await apiClient.post<unknown, ApiResponse<{success: boolean}>>('/api/auth/email/verify', { 
        email,
        code
      });
      
      console.log('Email verification response:', response);
      
      return { 
        success: true,
        message: 'Email verified successfully'
      };
    } catch (error: any) {
      console.error('Failed to verify email code:', error);
      throw error;
    }
  },
}; 