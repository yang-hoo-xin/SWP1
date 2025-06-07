/**
 * User related type definitions
 */

/**
 * User information from backend
 */
export interface UserInfo {
  id: number;
  username: string;
  nickname?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  status?: number;
  lastLoginTime?: string;
  createTime?: string;
  roles?: string[];
}

/**
 * Login request parameters
 */
export interface LoginParams {
  username: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Register request parameters
 */
export interface RegisterParams {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  captcha: string;
  captchaUuid: string;
  agreeTerms: boolean;
}

/**
 * Login response data
 */
export interface LoginResponseData {
  token: string;
  user?: UserInfo;
}

/**
 * Register response data
 */
export interface RegisterResponseData {
  success: boolean;
  message?: string;
} 