import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  console.log('🏠 Layout: Auth state:', { isAuthenticated, user });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container-custom">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link
                to="/"
                className="text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
              >
                🚗 Car Rental
              </Link>

              <div className="hidden md:flex space-x-4">
                <Link
                  to="/search"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/search'
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Search
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === '/profile'
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>👤</span>
                    <span>{user?.name || user?.email?.split('@')[0]}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="btn-secondary text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary text-sm">
                    Login
                  </Link>
                  <Link to="/signup" className="btn-primary text-sm">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main id="main-content" className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="container-custom py-8">
          <div className="text-center text-sm text-gray-600">
            <p>© {new Date().getFullYear()} Car Rental App. Portfolio Project.</p>
            <p className="mt-2">
              Built with React, TypeScript, Vite, TanStack Query, and Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
