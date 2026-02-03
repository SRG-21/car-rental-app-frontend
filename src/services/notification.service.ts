import apiClient from './api';
import { NotificationSubscribeRequest } from '@/types';

export const notificationService = {
  /**
   * Subscribe to push notifications
   */
  async subscribe(data: NotificationSubscribeRequest): Promise<{ message: string }> {
    const response = await apiClient.post<any>('/notifications/subscribe', data);
    console.log('🔔 Subscribe response:', response.data);
    
    // Handle both wrapped and direct response formats
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  },
};
