import apiClient from './api';
import { HealthResponse } from '@/types';

export const healthService = {
  /**
   * Check health status of all microservices
   */
  async getHealth(): Promise<HealthResponse> {
    const response = await apiClient.get<HealthResponse>('/health');
    return response.data;
  },
};
