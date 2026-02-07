import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  console.log('🏠 Layout: Auth state:', { isAuthenticated, user, isLoading });

  const handleLogout = async () => {
    setIsMobileMenuOpen(false);
    await logout();
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

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
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>

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
                {isAuthenticated && (
                  <Link
                    to="/admin/cars"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === '/admin/cars'
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Manage Cars
                  </Link>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {isLoading ? (
                <div className="w-8 h-8 animate-pulse bg-gray-200 rounded-full"></div>
              ) : isAuthenticated && user ? (
                <>
                  <Link
                    to="/profile"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === '/profile'
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-medium">
                        {(user.name || user.email || 'U')[0].toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden sm:inline">{user.name || user.email?.split('@')[0]}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="btn-secondary text-sm hidden sm:block"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary text-sm">
                    Login
                  </Link>
                  <Link to="/signup" className="btn-primary text-sm hidden sm:inline-flex">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="container-custom py-4 space-y-2">
              <Link
                to="/search"
                onClick={closeMobileMenu}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  location.pathname === '/search'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                🔍 Search Cars
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/admin/cars"
                    onClick={closeMobileMenu}
                    className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      location.pathname === '/admin/cars'
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    🚗 Manage Cars
                  </Link>
                  <Link
                    to="/profile"
                    onClick={closeMobileMenu}
                    className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      location.pathname === '/profile'
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    👤 My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    🚪 Logout
                  </button>
                </>
              )}
              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={closeMobileMenu}
                    className="block px-4 py-3 rounded-lg text-base font-medium text-primary-600 hover:bg-primary-50"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
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
