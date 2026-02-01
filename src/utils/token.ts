const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Legacy keys that may exist from old implementations
const LEGACY_KEYS = ['auth_token', 'token', 'user'];

export const tokenStorage = {
  getAccessToken: (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setAccessToken: (token: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (token: string): void => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  clearTokens: (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    // Also clear any legacy keys
    LEGACY_KEYS.forEach(key => localStorage.removeItem(key));
  },

  hasTokens: (): boolean => {
    // Check for current tokens
    const hasCurrentTokens = !!localStorage.getItem(ACCESS_TOKEN_KEY) || !!localStorage.getItem(REFRESH_TOKEN_KEY);
    if (hasCurrentTokens) return true;
    
    // Check for legacy auth_token and migrate if found
    const legacyToken = localStorage.getItem('auth_token');
    if (legacyToken) {
      console.log('🔄 Migrating legacy auth_token to access_token');
      localStorage.setItem(ACCESS_TOKEN_KEY, legacyToken);
      localStorage.removeItem('auth_token');
      return true;
    }
    
    return false;
  },

  /**
   * Clean up any legacy token storage
   */
  cleanupLegacyStorage: (): void => {
    LEGACY_KEYS.forEach(key => {
      if (localStorage.getItem(key)) {
        console.log(`🧹 Removing legacy storage key: ${key}`);
        localStorage.removeItem(key);
      }
    });
  },
};

/**
 * Decode JWT token payload (without verification - for client use only)
 */
export function decodeToken(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  const expirationTime = decoded.exp * 1000; // Convert to milliseconds
  return Date.now() >= expirationTime;
}
