import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy load pages for code splitting
const SearchPage = React.lazy(() => import('./pages/Search/SearchPage'));
const CarDetailPage = React.lazy(() => import('./pages/Car/CarDetailPage'));
const BookingPage = React.lazy(() => import('./pages/Booking/BookingPage'));
const ProfilePage = React.lazy(() => import('./pages/Profile/ProfilePage'));
const LoginPage = React.lazy(() => import('./pages/Auth/LoginPage'));
const SignupPage = React.lazy(() => import('./pages/Auth/SignupPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Layout>
          <React.Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Navigate to="/search" replace />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/cars/:id" element={<CarDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              
              <Route
                path="/book/:carId"
                element={
                  <ProtectedRoute>
                    <BookingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </React.Suspense>
        </Layout>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
