import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-8">
      <div className="container-custom">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          <p className="text-gray-600 mt-2">Manage your account and view your bookings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex flex-col items-center mb-6">
                <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-6 rounded-full mb-4">
                  <span className="text-5xl">👤</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {user?.name || 'User'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
              </div>

              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Email</p>
                      <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                    </div>
                    <span className="text-2xl">📧</span>
                  </div>
                </div>

                {user?.name && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Full Name</p>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      </div>
                      <span className="text-2xl">✏️</span>
                    </div>
                  </div>
                )}

                <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-primary-700 mb-1">Member Since</p>
                      <p className="text-sm font-medium text-primary-900">
                        {new Date().toLocaleDateString('en-US', { 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                    <span className="text-2xl">🎉</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  to="/search"
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <span>🔍</span>
                  <span>Search Cars</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Bookings Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">My Bookings</h2>
                <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                  0 Active
                </span>
              </div>

              {/* Empty State */}
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚗💨</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No bookings yet
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  You haven't made any reservations yet. Browse our wide selection of cars and book your perfect ride!
                </p>
                <Link
                  to="/search"
                  className="inline-flex items-center space-x-2 btn-primary px-6 py-3"
                >
                  <span>🔍</span>
                  <span>Browse Cars</span>
                </Link>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                    <p className="text-3xl font-bold text-gray-900">0</p>
                  </div>
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <span className="text-2xl">📋</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Cars Rented</p>
                    <p className="text-3xl font-bold text-gray-900">0</p>
                  </div>
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <span className="text-2xl">�</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                    <p className="text-3xl font-bold text-gray-900">$0</p>
                  </div>
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <span className="text-2xl">💰</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <span className="text-2xl">🔔</span>
                  <div>
                    <p className="font-medium text-gray-900">Notifications</p>
                    <p className="text-xs text-gray-500">Manage your preferences</p>
                  </div>
                </button>

                <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <span className="text-2xl">🔐</span>
                  <div>
                    <p className="font-medium text-gray-900">Security</p>
                    <p className="text-xs text-gray-500">Password & authentication</p>
                  </div>
                </button>

                <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <span className="text-2xl">💳</span>
                  <div>
                    <p className="font-medium text-gray-900">Payment Methods</p>
                    <p className="text-xs text-gray-500">Manage saved cards</p>
                  </div>
                </button>

                <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <span className="text-2xl">❓</span>
                  <div>
                    <p className="font-medium text-gray-900">Help & Support</p>
                    <p className="text-xs text-gray-500">Contact us anytime</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
