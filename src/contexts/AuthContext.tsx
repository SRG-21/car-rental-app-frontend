import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { User, LoginRequest, SignupRequest } from '@/types';
import { authService } from '@/services';
import { tokenStorage } from '@/utils/token';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has refresh token and auto-login
    const initializeAuth = async () => {
      console.log('🔄 AuthContext: Initializing auth...');
      console.log('🔑 Has tokens:', tokenStorage.hasTokens());
      console.log('🔑 Access token:', tokenStorage.getAccessToken()?.substring(0, 30) + '...');
      console.log('🔑 Refresh token:', tokenStorage.getRefreshToken()?.substring(0, 30) + '...');
      
      if (tokenStorage.hasTokens()) {
        try {
          console.log('📡 AuthContext: Fetching current user...');
          const currentUser = await authService.getMe();
          console.log('✅ AuthContext: Got user:', currentUser);
          setUser(currentUser);
        } catch (error) {
          console.error('❌ AuthContext: Failed to get user, clearing tokens:', error);
          // Token invalid or expired, clear tokens
          tokenStorage.clearTokens();
        }
      } else {
        console.log('⚠️ AuthContext: No tokens found');
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (data: LoginRequest) => {
    console.log('🔐 AuthContext: Starting login...');
    const response = await authService.login(data);
    console.log('✅ AuthContext: Login response:', response);
    console.log('👤 AuthContext: Setting user:', response.user);
    setUser(response.user);
    console.log('✅ AuthContext: User state updated');
  };

  const signup = async (data: SignupRequest) => {
    console.log('📝 AuthContext: Starting signup...');
    const response = await authService.signup(data);
    console.log('✅ AuthContext: Signup response:', response);
    console.log('👤 AuthContext: Setting user:', response.user);
    setUser(response.user);
    console.log('✅ AuthContext: User state updated');
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
  };

  console.log('🔄 AuthContext: Current state:', { user, isAuthenticated: !!user, isLoading });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
