import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { carService, bookingService } from '@/services';
import { useAuth } from '@/contexts/AuthContext';

export default function BookingPage() {
  const { carId } = useParams<{ carId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('10:00');
  const [dropoffDate, setDropoffDate] = useState('');
  const [dropoffTime, setDropoffTime] = useState('10:00');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch car details
  const { data: car, isLoading: isLoadingCar } = useQuery({
    queryKey: ['car', carId],
    queryFn: () => carService.getCar(carId!),
    enabled: !!carId,
  });

  // Calculate total price
  const { totalDays, totalPrice } = useMemo(() => {
    if (!pickupDate || !dropoffDate || !car) {
      return { totalDays: 0, totalPrice: 0 };
    }
    
    const pickup = new Date(`${pickupDate}T${pickupTime}`);
    const dropoff = new Date(`${dropoffDate}T${dropoffTime}`);
    
    if (dropoff <= pickup) {
      return { totalDays: 0, totalPrice: 0 };
    }
    
    const diffTime = dropoff.getTime() - pickup.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      totalDays: days,
      totalPrice: days * car.pricePerDay,
    };
  }, [pickupDate, pickupTime, dropoffDate, dropoffTime, car]);

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: bookingService.createBooking,
    onSuccess: (booking) => {
      navigate(`/profile`, { 
        state: { 
          message: 'Booking confirmed successfully!',
          bookingId: booking.id 
        } 
      });
    },
    onError: (err: any) => {
      console.error('Booking error:', err);
      const errorData = err.response?.data;
      
      if (errorData?.error?.message) {
        setError(errorData.error.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Failed to create booking. Please try again.');
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!pickupDate || !dropoffDate) {
      setError('Please select both pickup and drop-off dates');
      return;
    }

    const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`);
    const dropoffDateTime = new Date(`${dropoffDate}T${dropoffTime}`);
    const now = new Date();

    if (pickupDateTime <= now) {
      setError('Pickup date must be in the future');
      return;
    }

    if (dropoffDateTime <= pickupDateTime) {
      setError('Drop-off date must be after pickup date');
      return;
    }

    if (totalDays < 1) {
      setError('Minimum booking duration is 1 day');
      return;
    }

    setIsSubmitting(true);

    createBookingMutation.mutate({
      carId: carId!,
      pickupTime: pickupDateTime.toISOString(),
      dropoffTime: dropoffDateTime.toISOString(),
    });

    setIsSubmitting(false);
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  if (isLoadingCar) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
        <div className="container-custom py-12">
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
        <div className="container-custom py-12">
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
            <div className="text-5xl mb-4">🚗</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Car Not Found</h2>
            <p className="text-gray-600 mb-6">The car you're trying to book doesn't exist.</p>
            <Link to="/search" className="btn-primary px-6 py-3">
              ← Back to Search
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="container-custom py-12">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link to="/search" className="hover:text-primary-600">Search</Link>
            </li>
            <li>→</li>
            <li>
              <Link to={`/cars/${car.id}`} className="hover:text-primary-600">{car.name}</Link>
            </li>
            <li>→</li>
            <li className="text-gray-900 font-medium">Book</li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Date Selection */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">📅 Select Dates</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pickup */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700">Pickup</h3>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Date</label>
                      <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        min={today}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Time</label>
                      <select
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                      >
                        {Array.from({ length: 24 }, (_, i) => {
                          const hour = i.toString().padStart(2, '0');
                          return (
                            <option key={hour} value={`${hour}:00`}>
                              {hour}:00
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  {/* Drop-off */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700">Drop-off</h3>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Date</label>
                      <input
                        type="date"
                        value={dropoffDate}
                        onChange={(e) => setDropoffDate(e.target.value)}
                        min={pickupDate || today}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Time</label>
                      <select
                        value={dropoffTime}
                        onChange={(e) => setDropoffTime(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                      >
                        {Array.from({ length: 24 }, (_, i) => {
                          const hour = i.toString().padStart(2, '0');
                          return (
                            <option key={hour} value={`${hour}:00`}>
                              {hour}:00
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Renter Info */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">👤 Renter Information</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
              </div>

              {/* Pickup Location */}
              {car.location && (
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">📍 Pickup Location</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium text-gray-900">{car.location.address}</p>
                    <p className="text-gray-600">{car.location.city}, {car.location.state}</p>
                    <p className="text-gray-500">{car.location.country}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || createBookingMutation.isPending || totalDays < 1}
                className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting || createBookingMutation.isPending ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </span>
                ) : (
                  `✓ Confirm Booking${totalPrice > 0 ? ` - $${totalPrice}` : ''}`
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              {/* Car Info */}
              <div className="flex items-start space-x-4 mb-6 pb-6 border-b border-gray-200">
                <div className="w-24 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {car.images && car.images.length > 0 ? (
                    <img
                      src={car.images[0]}
                      alt={car.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      🚗
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{car.name}</h3>
                  <p className="text-sm text-gray-600">{car.brand} {car.model}</p>
                  <p className="text-sm text-gray-500">{car.year} • {car.transmission}</p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Daily rate</span>
                  <span>${car.pricePerDay}/day</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Duration</span>
                  <span>{totalDays > 0 ? `${totalDays} day${totalDays > 1 ? 's' : ''}` : '-'}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>${totalPrice > 0 ? totalPrice : '-'}</span>
                  </div>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="bg-primary-50 rounded-lg p-4 text-sm">
                <p className="font-medium text-primary-900 mb-1">Free Cancellation</p>
                <p className="text-primary-700">Cancel anytime before pickup for a full refund.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
