import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { carService } from '@/services';
import { Car } from '@/types';

export default function SearchPage() {
  const [location, setLocation] = useState('california');
  const [pickupDate, setPickupDate] = useState('');
  const [searchTrigger, setSearchTrigger] = useState(0);
  const [searchParams] = useState({
    lat: 37.7749,
    lon: -122.4194,
    radius: 50,
  });

  // Fetch cars based on search params and trigger
  const { data: searchResponse, isLoading, error } = useQuery({
    queryKey: ['cars', searchParams, searchTrigger],
    queryFn: () => carService.searchCars(searchParams),
    enabled: searchTrigger > 0,
  });

  // Debug logging
  console.log('=== SEARCH PAGE DEBUG ===');
  console.log('Search Response:', searchResponse);
  console.log('Search Response Type:', typeof searchResponse);
  console.log('Search Trigger:', searchTrigger);
  console.log('Is Loading:', isLoading);
  console.log('Error:', error);

  const cars = searchResponse?.cars || [];
  const totalCars = searchResponse?.total || 0;
  const hasSearched = searchTrigger > 0;

  console.log('Cars array:', cars);
  console.log('Cars length:', cars.length);
  console.log('Total cars:', totalCars);
  console.log('Has searched:', hasSearched);
  console.log('========================');

  const handleSearch = () => {
    // Increment trigger to force new search
    setSearchTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="container-custom py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Your Perfect Ride
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse thousands of cars available for rent. Best prices, flexible timings, and hassle-free booking.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Search Cars</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📍 Pickup Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter city or area"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📅 Pickup Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
              </div>
            </div>
            
            <button 
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full md:w-auto btn-primary px-8 py-3 text-base font-semibold"
            >
              {isLoading ? '� Searching...' : '�🔍 Search Cars'}
            </button>
          </div>
        </div>

        {/* Search Results */}
        {hasSearched && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Available Cars {totalCars > 0 && `(${totalCars})`}
              </h2>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : cars.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No cars found</h3>
                <p className="text-gray-600">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Info Cards - Show when no search performed */}
        {!hasSearched && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">🚗</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Wide Selection</h3>
              <p className="text-gray-600">Choose from 20+ premium cars</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Best Prices</h3>
              <p className="text-gray-600">Starting from $50 per day</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Booking</h3>
              <p className="text-gray-600">Book in just 2 minutes</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Car Card Component
function CarCard({ car }: { car: Car }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-200 overflow-hidden">
      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <span className="text-6xl">{getCarEmoji(car.make)}</span>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {car.make} {car.model}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">📅</span>
            <span>{car.year}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">⚙️</span>
            <span className="capitalize">{car.transmission}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">⛽</span>
            <span className="capitalize">{car.fuelType}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">👥</span>
            <span>{car.seats} seats</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div>
            <p className="text-2xl font-bold text-primary-600">
              ${car.pricePerDay}
            </p>
            <p className="text-xs text-gray-500">per day</p>
          </div>
          
          <Link
            to={`/cars/${car.id}`}
            className="btn-primary px-4 py-2 text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

// Helper function to get car emoji based on make
function getCarEmoji(make: string): string {
  const emojiMap: Record<string, string> = {
    Tesla: '⚡',
    BMW: '🏎️',
    Toyota: '🚗',
    Ford: '🚙',
    Honda: '🚗',
    Mercedes: '🚘',
    Audi: '🏎️',
    Chevrolet: '🚙',
  };
  return emojiMap[make] || '🚗';
}
