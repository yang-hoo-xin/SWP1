import axios from 'axios';
import type { AxiosResponse } from 'axios';

// 定义API响应类型
interface ApiResponse<T> {
  code: number;
  msg?: string;
  data: T;
}

// 定义登录响应类型
interface LoginResponse {
  token: string;
  user?: any;
}

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 请求拦截器
api.interceptors.request.use(
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

// 响应拦截器
api.interceptors.response.use(
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
      
      // 处理401错误 - 未授权
      if (status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// 认证相关的API服务
export const authService = {
  /**
   * 用户登录
   * @param username 用户名
   * @param password 密码
   * @returns Promise 包含登录结果
   */
  login: async (username: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', { username, password });
      const loginData = response.data.data;
      
      // 保存token
      if (loginData && loginData.token) {
        localStorage.setItem('token', loginData.token);
      }
      
      return loginData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },
  
  /**
   * 用户注册
   * @param username 用户名
   * @param password 密码
   * @param email 电子邮件
   * @returns Promise 包含注册结果
   */
  register: async (username: string, password: string, email: string) => {
    try {
      const response = await api.post('/auth/register', { username, password, email });
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },
  
  /**
   * 获取当前用户信息
   * @returns Promise 包含用户信息
   */
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/user');
      return response.data;
    } catch (error) {
      console.error('Failed to get user info:', error);
      throw error;
    }
  },
  
  /**
   * 退出登录
   */
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },
  
  /**
   * 检查用户是否已登录
   * @returns boolean 是否已登录
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  }
};

export default authService; 