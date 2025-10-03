export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

export interface Car {
  id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  seats: number;
  fuelType: 'electric' | 'petrol' | 'diesel' | 'hybrid';
  transmission: 'automatic' | 'manual';
  pricePerDay: number;
  lat: number;
  lon: number;
  images: string[];
  features: string[];
  available: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  carId: string;
  car?: Car;
  pickupTime: string;
  dropoffTime: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface SearchParams {
  lat?: number;
  lon?: number;
  pickup?: string;
  dropoff?: string;
  seats?: number;
  fuelType?: 'electric' | 'petrol' | 'diesel' | 'hybrid';
}

export interface SearchResponse {
  cars: Car[];
  total: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface BookingRequest {
  carId: string;
  pickupTime: string;
  dropoffTime: string;
}
