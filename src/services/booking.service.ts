import apiClient from './api';
import { Booking, BookingWithCar, BookingRequest } from '@/types';

export const bookingService = {
  /**
   * Create a new booking
   */
  async createBooking(data: BookingRequest): Promise<Booking> {
    const response = await apiClient.post<any>('/bookings', data);
    console.log('📅 CreateBooking response:', response.data);
    
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
   * Get all bookings for the current user
   */
  async getBookings(): Promise<BookingWithCar[]> {
    const response = await apiClient.get<any>('/bookings');
    console.log('📅 GetBookings response:', response.data);
    
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
   * Get a single booking by ID
   */
  async getBooking(id: string): Promise<Booking> {
    const response = await apiClient.get<any>(`/bookings/${id}`);
    console.log('📅 GetBooking response:', response.data);
    
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
   * Cancel a booking
   */
  async cancelBooking(id: string): Promise<Booking> {
    const response = await apiClient.patch<any>(`/bookings/${id}`, {
      status: 'cancelled',
    });
    console.log('📅 CancelBooking response:', response.data);
    
    // Handle both wrapped and direct response formats
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  },
};
