import apiClient from './api';
import { Car, CarSearchResult, SearchParams, SearchResponse, CreateCarRequest, UpdateCarRequest } from '@/types';

export const carService = {
  /**
   * Get a single car by ID
   */
  async getCar(id: string): Promise<Car> {
    const response = await apiClient.get<any>(`/cars/${id}`);
    console.log('🚗 GetCar response:', response.data);
    
    // Handle both wrapped and direct response formats
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  /**
   * Create a new car (Admin only)
   */
  async createCar(data: CreateCarRequest): Promise<Car> {
    const response = await apiClient.post<any>('/cars', data);
    console.log('🚗 CreateCar response:', response.data);
    
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  /**
   * Update an existing car (Admin only)
   */
  async updateCar(id: string, data: UpdateCarRequest): Promise<Car> {
    const response = await apiClient.put<any>(`/cars/${id}`, data);
    console.log('🚗 UpdateCar response:', response.data);
    
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  /**
   * Delete a car (Admin only)
   */
  async deleteCar(id: string): Promise<void> {
    await apiClient.delete(`/cars/${id}`);
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
      console.log('📦 Search Response:', response.data);
      
      // Handle different backend response formats:
      // Format 1: { success: true, data: { cars: [], total: number, page, limit, totalPages } }
      // Format 2: { data: { cars: [], total: number } }
      // Format 3: { cars: [], total: number }
      // Format 4: Car[] (direct array)
      
      let result: SearchResponse;
      
      if (response.data.success && response.data.data) {
        console.log('✅ Wrapped format detected');
        const data = response.data.data;
        result = {
          cars: data.cars || [],
          total: data.total || 0,
          page: data.page || 1,
          limit: data.limit || 20,
          totalPages: data.totalPages || 1,
        };
      } else if (response.data.data) {
        console.log('✅ Data wrapper format detected');
        const data = response.data.data;
        result = {
          cars: data.cars || [],
          total: data.total || 0,
          page: data.page || 1,
          limit: data.limit || 20,
          totalPages: data.totalPages || 1,
        };
      } else if (Array.isArray(response.data)) {
        console.log('✅ Array format detected');
        result = {
          cars: response.data,
          total: response.data.length,
          page: 1,
          limit: response.data.length,
          totalPages: 1,
        };
      } else if (response.data.cars) {
        console.log('✅ Direct format detected');
        result = {
          cars: response.data.cars,
          total: response.data.total || response.data.cars.length,
          page: response.data.page || 1,
          limit: response.data.limit || 20,
          totalPages: response.data.totalPages || 1,
        };
      } else {
        console.error('❌ Unknown format:', response.data);
        result = { cars: [], total: 0, page: 1, limit: 20, totalPages: 0 };
      }
      
      console.log('✅ Returning:', result);
      return result;
    } catch (error) {
      console.error('❌ Search Error:', error);
      throw error;
    }
  },
};
