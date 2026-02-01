import apiClient from './api';
import {
  User,
  LoginRequest,
  SignupRequest,
  AuthResponse,
} from '@/types';
import { tokenStorage } from '@/utils/token';

export const authService = {
  /**
   * Sign up a new user
   */
  async signup(data: SignupRequest): Promise<AuthResponse> {
    const response = await apiClient.post<any>('/auth/signup', data);
    console.log('📝 Signup response:', response.data);
    
    // Handle backend response format - may be wrapped or direct
    let authData: AuthResponse;
    if (response.data.success && response.data.data) {
      // Wrapped format: { success: true, data: { accessToken, refreshToken, user } }
      authData = response.data.data;
    } else {
      // Direct format: { accessToken, refreshToken, user }
      authData = response.data;
    }
    
    const { accessToken, refreshToken, user } = authData;
    console.log('✅ Extracted tokens and user:', { accessToken: accessToken?.substring(0, 20) + '...', user });

    // Store tokens
    tokenStorage.setAccessToken(accessToken);
    tokenStorage.setRefreshToken(refreshToken);

    return authData;
  },

  /**
   * Log in an existing user
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<any>('/auth/login', data);
    console.log('🔐 Login response:', response.data);
    console.log('🔐 Login response.data.data:', response.data.data);
    console.log('🔐 Full response structure:', JSON.stringify(response.data, null, 2));
    
    // Handle backend response format - may be wrapped or direct
    let authData: AuthResponse;
    if (response.data.data) {
      // Backend wraps in { data: { accessToken, refreshToken, user } }
      console.log('✅ Using response.data.data');
      authData = response.data.data;
    } else if (response.data.accessToken) {
      // Direct format: { accessToken, refreshToken, user }
      console.log('✅ Using response.data directly');
      authData = response.data;
    } else {
      console.error('❌ Unknown response format:', response.data);
      throw new Error('Invalid login response format');
    }
    
    const { accessToken, refreshToken, user } = authData;
    console.log('✅ Extracted tokens and user:', { 
      accessToken: accessToken?.substring(0, 20) + '...', 
      refreshToken: refreshToken?.substring(0, 20) + '...',
      user 
    });

    // Store tokens
    tokenStorage.setAccessToken(accessToken);
    tokenStorage.setRefreshToken(refreshToken);

    return authData;
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await apiClient.post<any>(
      '/auth/refresh',
      {
        refreshToken,
      }
    );

    // Handle both wrapped and direct response formats
    const data = response.data.data || response.data;
    const { accessToken, refreshToken: newRefreshToken } = data;
    
    tokenStorage.setAccessToken(accessToken);
    if (newRefreshToken) {
      tokenStorage.setRefreshToken(newRefreshToken);
    }

    return data;
  },

  /**
   * Get current user profile
   */
  async getMe(): Promise<User> {
    const response = await apiClient.get<any>('/auth/me');
    console.log('👤 GetMe response:', response.data);
    
    // Handle backend response format - may be wrapped or direct
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  /**
   * Log out user - invalidate refresh token on server
   */
  async logout(): Promise<void> {
    const refreshToken = tokenStorage.getRefreshToken();
    
    if (refreshToken) {
      try {
        await apiClient.post('/auth/logout', { refreshToken });
      } catch (error) {
        // Ignore logout errors, still clear tokens locally
        console.error('Logout API error:', error);
      }
    }
    
    tokenStorage.clearTokens();
  },
};
