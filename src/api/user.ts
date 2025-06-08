import { apiClient } from '../utils/http';
import type { ApiResponse } from '../utils/http';
import type { UserInfo } from '../types/user';

/**
 * User API service
 */
export const userApi = {
  /**
   * Upload user avatar
   * @param formData FormData containing the image file
   */
  uploadAvatar: async (formData: FormData): Promise<{avatarUrl: string}> => {
    try {
      // 确保禁用transformResponse，以便原始响应不被修改
      const response = await apiClient.post<ApiResponse<{avatarUrl: string}>>('/user/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        transformResponse: [(data) => {
          // 保持原始响应数据不变
          return typeof data === 'string' ? JSON.parse(data) : data;
        }]
      });
      
      // 手动处理响应数据
      if (response && response.data && response.data.code === 200) {
        return response.data.data;
      } else if (response && response.data) {
        throw new Error(response.data.message || 'Upload failed');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      throw error;
    }
  },
  
  /**
   * Update user profile information
   * @param userData User data to update
   */
  updateUserInfo: async (userData: {nickname?: string}): Promise<UserInfo> => {
    try {
      const response = await apiClient.put<ApiResponse<UserInfo>>('/user/profile', userData, {
        transformResponse: [(data) => {
          return typeof data === 'string' ? JSON.parse(data) : data;
        }]
      });
      
      if (response && response.data && response.data.code === 200) {
        return response.data.data;
      } else if (response && response.data) {
        throw new Error(response.data.message || 'Update failed');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Failed to update user info:', error);
      throw error;
    }
  }
}; 