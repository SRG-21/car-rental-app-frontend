import apiClient from './api';
import { Car, SearchParams, SearchResponse } from '@/types';

export const carService = {
  /**
   * Get a single car by ID
   */
  async getCar(id: string): Promise<Car> {
    const response = await apiClient.get<Car>(`/cars/${id}`);
    return response.data;
  },

  /**
   * Search for cars with filters
   */
  async searchCars(params: SearchParams): Promise<SearchResponse> {
    console.log('🔍 Searching cars with params:', params);
    try {
      const response = await apiClient.get<any>('/search', {
        params,
      });
      console.log('📦 Response:', response.data);
      
      // Handle different backend response formats:
      // Format 1: { success: true, data: { cars: [], total: number } }
      // Format 2: { cars: [], total: number }
      // Format 3: Car[] (direct array)
      
      let result: SearchResponse;
      
      if (response.data.success && response.data.data) {
        console.log('✅ Wrapped format detected');
        result = {
          cars: response.data.data.cars || [],
          total: response.data.data.total || 0,
        };
      } else if (Array.isArray(response.data)) {
        console.log('✅ Array format detected');
        result = {
          cars: response.data,
          total: response.data.length,
        };
      } else if (response.data.cars) {
        console.log('✅ Direct format detected');
        result = {
          cars: response.data.cars,
          total: response.data.total || response.data.cars.length,
        };
      } else {
        console.error('❌ Unknown format:', response.data);
        result = { cars: [], total: 0 };
      }
      
      console.log('✅ Returning:', result);
      return result;
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  },
};
