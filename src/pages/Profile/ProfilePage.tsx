import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '@/services';
import { BookingWithCar, BookingStatus } from '@/types';

export default function ProfilePage() {
  const { user } = useAuth();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('all');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Show success message if redirected from booking
  const successMessage = (location.state as any)?.message;

  // Fetch user bookings
  const { data: bookings = [], isLoading, error } = useQuery({
    queryKey: ['bookings'],
    queryFn: bookingService.getBookings,
  });

  // Cancel booking mutation
  const cancelBookingMutation = useMutation({
    mutationFn: bookingService.cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      setCancellingId(null);
    },
    onError: (err: any) => {
      console.error('Cancel booking error:', err);
      alert(err.response?.data?.error?.message || 'Failed to cancel booking');
      setCancellingId(null);
    },
  });

  const handleCancelBooking = (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      setCancellingId(bookingId);
      cancelBookingMutation.mutate(bookingId);
    }
  };

  // Categorize bookings
  const categorizeBookings = (bookings: BookingWithCar[]) => {
    const now = new Date();
    
    return {
      upcoming: bookings.filter(b => 
        b.status === 'confirmed' && new Date(b.pickupTime) > now
      ),
      active: bookings.filter(b => 
        b.status === 'confirmed' && 
        new Date(b.pickupTime) <= now && 
        new Date(b.dropoffTime) >= now
      ),
      past: bookings.filter(b => 
        b.status === 'completed' || 
        (b.status === 'confirmed' && new Date(b.dropoffTime) < now)
      ),
      cancelled: bookings.filter(b => b.status === 'cancelled'),
    };
  };

  const categorized = categorizeBookings(bookings);

  const getFilteredBookings = () => {
    switch (activeTab) {
      case 'upcoming':
        return [...categorized.active, ...categorized.upcoming];
      case 'past':
        return categorized.past;
      case 'cancelled':
        return categorized.cancelled;
      default:
        return bookings;
    }
  };

  const filteredBookings = getFilteredBookings();

  const getStatusBadge = (status: BookingStatus, pickupTime: string, dropoffTime: string) => {
    const now = new Date();
    const pickup = new Date(pickupTime);
    const dropoff = new Date(dropoffTime);

    if (status === 'cancelled') {
      return <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">Cancelled</span>;
    }
    if (status === 'completed' || dropoff < now) {
      return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">Completed</span>;
    }
    if (pickup <= now && dropoff >= now) {
      return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">Active</span>;
    }
    return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">Upcoming</span>;
  };

  const canCancel = (booking: BookingWithCar) => {
    if (booking.status !== 'confirmed') return false;
    const now = new Date();
    const pickup = new Date(booking.pickupTime);
    return pickup > now;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-8">
      <div className="container-custom">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
            <span className="text-xl mr-2">✅</span>
            {successMessage}
          </div>
        )}

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
                <div className="bg-gradient-to-br from-primary-500 to-primary-600 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl text-white font-bold">
                    {(user?.name || user?.email || 'U')[0].toUpperCase()}
                  </span>
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
                        {user?.createdAt 
                          ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                          : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                        }
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
                <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                  {(['all', 'upcoming', 'past', 'cancelled'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        activeTab === tab
                          ? 'bg-white text-primary-700 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600">Failed to load bookings. Please try again.</p>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🚗💨</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {activeTab === 'all' ? 'No bookings yet' : `No ${activeTab} bookings`}
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {activeTab === 'all' 
                      ? "You haven't made any reservations yet. Browse our wide selection of cars and book your perfect ride!"
                      : `You don't have any ${activeTab} bookings.`
                    }
                  </p>
                  <Link
                    to="/search"
                    className="inline-flex items-center space-x-2 btn-primary px-6 py-3"
                  >
                    <span>🔍</span>
                    <span>Browse Cars</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          {/* Car Image */}
                          <div className="w-24 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {booking.car?.images && booking.car.images.length > 0 ? (
                              <img
                                src={booking.car.images[0]}
                                alt={booking.car.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-2xl">
                                🚗
                              </div>
                            )}
                          </div>
                          
                          {/* Booking Details */}
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-gray-900">
                                {booking.car?.name || 'Car'}
                              </h3>
                              {getStatusBadge(booking.status, booking.pickupTime, booking.dropoffTime)}
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>
                                📅 {formatDate(booking.pickupTime)} {formatTime(booking.pickupTime)} → {formatDate(booking.dropoffTime)} {formatTime(booking.dropoffTime)}
                              </p>
                              <p className="font-medium text-gray-900">
                                💰 Total: ${booking.totalPrice}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          {canCancel(booking) && (
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              disabled={cancellingId === booking.id}
                              className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                            >
                              {cancellingId === booking.id ? 'Cancelling...' : 'Cancel'}
                            </button>
                          )}
                          <Link
                            to={`/cars/${booking.carId}`}
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                          >
                            View Car →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                    <p className="text-3xl font-bold text-gray-900">{bookings.length}</p>
                  </div>
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <span className="text-2xl">📋</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active/Upcoming</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {categorized.active.length + categorized.upcoming.length}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <span className="text-2xl">🚗</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                    <p className="text-3xl font-bold text-gray-900">
                      ${bookings
                        .filter(b => b.status !== 'cancelled')
                        .reduce((sum, b) => sum + b.totalPrice, 0)}
                    </p>
                  </div>
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <span className="text-2xl">💰</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
