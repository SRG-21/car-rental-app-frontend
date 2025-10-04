import apiClient from './api';
import { Booking, BookingRequest } from '@/types';

export const bookingService = {
  /**
   * Create a new booking
   */
  async createBooking(data: BookingRequest): Promise<Booking> {
    const response = await apiClient.post<Booking>('/bookings', data);
    return response.data;
  },

  /**
   * Get all bookings for the current user
   */
  async getBookings(): Promise<Booking[]> {
    const response = await apiClient.get<Booking[]>('/bookings');
    return response.data;
  },

  /**
   * Get a single booking by ID
   */
  async getBooking(id: string): Promise<Booking> {
    const response = await apiClient.get<Booking>(`/bookings/${id}`);
    return response.data;
  },
};
