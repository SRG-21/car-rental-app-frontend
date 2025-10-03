/**
 * Application Configuration
 * Central place for all environment-based configuration
 */

export const config = {
  /**
   * API Base URL
   * Default: http://localhost:3000
   */
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',

  /**
   * Enable MSW API Mocking
   * true = Use mock data (no backend required)
   * false = Use real backend API
   * Default: false
   */
  enableMocking: import.meta.env.VITE_ENABLE_MOCKING === 'true',

  /**
   * Is Development Mode
   */
  isDev: import.meta.env.DEV,

  /**
   * Is Production Mode
   */
  isProd: import.meta.env.PROD,
} as const;

// Log configuration on startup (dev only)
if (config.isDev) {
  console.log('🔧 App Configuration:', {
    apiUrl: config.apiUrl,
    enableMocking: config.enableMocking,
    mode: config.isDev ? 'development' : 'production',
  });
}
