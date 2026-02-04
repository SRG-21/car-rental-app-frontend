import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { carService } from '@/services';
import { CarSearchResult, SearchParams, SearchFuelType, SearchTransmissionType } from '@/types';
import { cities, radiusOptions, defaultCity, City, formatCityName } from '@/config/cities';

export default function SearchPage() {
  // Search form state
  const [selectedCity, setSelectedCity] = useState<City>(defaultCity);
  const [radius, setRadius] = useState<number>(15);
  const [fuelType, setFuelType] = useState<SearchFuelType | ''>('');
  const [transmission, setTransmission] = useState<SearchTransmissionType | ''>('');
  const [seats, setSeats] = useState<number | ''>('');
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [searchTrigger, setSearchTrigger] = useState(0);
  
  // Build search params
  const buildSearchParams = (): SearchParams => {
    const params: SearchParams = {
      latitude: selectedCity.latitude,
      longitude: selectedCity.longitude,
      radius,
      page,
      limit: 12,
    };
    
    if (searchQuery) params.query = searchQuery;
    if (fuelType) params.fuelType = fuelType;
    if (transmission) params.transmission = transmission;
    if (seats) params.seats = Number(seats);
    if (pickupDate) params.pickupTime = new Date(pickupDate).toISOString();
    if (dropoffDate) params.dropoffTime = new Date(dropoffDate).toISOString();
    
    return params;
  };

  // Fetch cars based on search params and trigger
  const { data: searchResponse, isLoading, error, isFetching } = useQuery({
    queryKey: ['cars', selectedCity.id, radius, fuelType, transmission, seats, pickupDate, dropoffDate, searchQuery, page, searchTrigger],
    queryFn: () => carService.searchCars(buildSearchParams()),
    enabled: searchTrigger > 0,
  });

  const cars = searchResponse?.cars || [];
  const totalCars = searchResponse?.total || 0;
  const totalPages = searchResponse?.totalPages || 1;
  const hasSearched = searchTrigger > 0;

  const handleSearch = () => {
    setPage(1);
    setSearchTrigger((prev) => prev + 1);
  };

  const handleCityChange = (cityId: string) => {
    const city = cities.find(c => c.id === cityId);
    if (city) setSelectedCity(city);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setSearchTrigger((prev) => prev + 1);
  };

  const clearFilters = () => {
    setFuelType('');
    setTransmission('');
    setSeats('');
    setPickupDate('');
    setDropoffDate('');
    setSearchQuery('');
    setRadius(15);
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Search Cars</h2>
            <button
              onClick={clearFilters}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear Filters
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Primary Search Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* City Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📍 City
                </label>
                <select
                  value={selectedCity.id}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
                >
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {formatCityName(city)}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Search Radius */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📏 Search Radius
                </label>
                <select
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
                >
                  {radiusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Text Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🔍 Search
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by make, model..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
              </div>
            </div>
            
            {/* Date Range Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📅 Pickup Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📅 Drop-off Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={dropoffDate}
                  onChange={(e) => setDropoffDate(e.target.value)}
                  min={pickupDate || new Date().toISOString().slice(0, 16)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
              </div>
            </div>
            
            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ⛽ Fuel Type
                </label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value as SearchFuelType | '')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
                >
                  <option value="">All Fuel Types</option>
                  <option value="PETROL">Petrol</option>
                  <option value="DIESEL">Diesel</option>
                  <option value="ELECTRIC">Electric</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ⚙️ Transmission
                </label>
                <select
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value as SearchTransmissionType | '')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
                >
                  <option value="">All Transmissions</option>
                  <option value="AUTOMATIC">Automatic</option>
                  <option value="MANUAL">Manual</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  👥 Minimum Seats
                </label>
                <select
                  value={seats}
                  onChange={(e) => setSeats(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
                >
                  <option value="">Any</option>
                  <option value="2">2+ seats</option>
                  <option value="4">4+ seats</option>
                  <option value="5">5+ seats</option>
                  <option value="7">7+ seats</option>
                </select>
              </div>
            </div>
            
            <button 
              onClick={handleSearch}
              disabled={isLoading || isFetching}
              className="w-full md:w-auto btn-primary px-8 py-3 text-base font-semibold"
            >
              {isLoading || isFetching ? '🔄 Searching...' : '🔍 Search Cars'}
            </button>
          </div>
        </div>

        {/* Search Results */}
        {hasSearched && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                {isFetching ? 'Searching...' : `Available Cars ${totalCars > 0 ? `(${totalCars})` : ''}`}
              </h2>
              {totalCars > 0 && (
                <span className="text-sm text-gray-500">
                  Showing within {radius}km of {selectedCity.name}
                </span>
              )}
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : cars.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No cars found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search criteria or expanding the search radius</p>
                <button
                  onClick={clearFilters}
                  className="btn-secondary px-6 py-2"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cars.map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center mt-8 space-x-2">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page <= 1 || isFetching}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Previous
                    </button>
                    <span className="px-4 py-2 text-gray-600">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= totalPages || isFetching}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
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
function CarCard({ car }: { car: CarSearchResult }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-200 overflow-hidden">
      {/* Car Image */}
      {car.imageUrl ? (
        <div className="aspect-video bg-gray-100">
          <img
            src={car.imageUrl}
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="hidden aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-6xl">{getCarEmoji(car.make)}</span>
          </div>
        </div>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <span className="text-6xl">{getCarEmoji(car.make)}</span>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {car.make} {car.model}
          </h3>
          {car.isAvailable ? (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Available</span>
          ) : (
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Unavailable</span>
          )}
        </div>
        
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
