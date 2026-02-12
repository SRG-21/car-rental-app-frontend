// ============================================
// User Types
// ============================================

export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

// ============================================
// Car Types
// ============================================

export type FuelType = 'electric' | 'petrol' | 'diesel' | 'hybrid';
export type TransmissionType = 'automatic' | 'manual';

// Fuel type for search API (uppercase)
export type SearchFuelType = 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';
export type SearchTransmissionType = 'MANUAL' | 'AUTOMATIC';

export interface CarLocation {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  country: string;
}

// Full car detail from GET /cars/:id
export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  fuelType: FuelType;
  transmission: TransmissionType;
  seats: number;
  pricePerDay: number;
  images: string[];
  features: string[];
  location: CarLocation;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock car type for MSW mock data (different structure)
export interface MockCar {
  id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  fuelType: FuelType;
  transmission: TransmissionType;
  seats: number;
  pricePerDay: number;
  lat: number;
  lon: number;
  images: string[];
  features: string[];
  available: boolean;
}

// Search result car from GET /search
export interface CarSearchResult {
  id: string;
  make: string;
  model: string;
  year: number;
  fuelType: string;
  transmission: string;
  seats: number;
  pricePerDay: number;
  imageUrl: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  isAvailable: boolean;
  distance: number;
}

// Create/Update car request (Admin)
export interface CreateCarRequest {
  name: string;
  brand: string;
  model: string;
  year: number;
  fuelType: FuelType;
  transmission: TransmissionType;
  seats: number;
  pricePerDay: number;
  images: string[];
  features?: string[];
  location: CarLocation;
}

export interface UpdateCarRequest extends Partial<CreateCarRequest> {
  isActive?: boolean;
}

// ============================================
// Booking Types
// ============================================

export type BookingStatus = 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  userId: string;
  carId: string;
  pickupTime: string;
  dropoffTime: string;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BookingWithCar extends Booking {
  car: {
    id: string;
    name: string;
    images: string[];
  };
}

export interface BookingRequest {
  carId: string;
  pickupTime: string;
  dropoffTime: string;
}

// ============================================
// Search Types
// ============================================

export interface SearchParams {
  latitude: number;
  longitude: number;
  radius?: number;
  query?: string;
  fuelType?: SearchFuelType;
  transmission?: SearchTransmissionType;
  seats?: number;
  pickupTime?: string;
  dropoffTime?: string;
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  cars: CarSearchResult[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================
// Auth Types
// ============================================

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

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success?: boolean;
  data: T;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Array<{
      path: string[];
      message: string;
      code?: string;
    }>;
    timestamp: string;
    path: string;
    requestId: string;
  };
}

// ============================================
// Health Types
// ============================================

export interface ServiceHealth {
  status: 'ok' | 'error' | 'timeout';
  responseTime: number;
  error?: string;
}

export interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: {
    auth: ServiceHealth;
    car: ServiceHealth;
    search: ServiceHealth;
    booking: ServiceHealth;
    notification: ServiceHealth;
  };
}

// ============================================
// Notification Types
// ============================================

export interface NotificationSubscribeRequest {
  token: string;
  platform: 'web' | 'ios' | 'android';
}
