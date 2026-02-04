import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { carService } from '@/services';
import { Car } from '@/types';

export default function CarDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: car, isLoading, error } = useQuery({
    queryKey: ['car', id],
    queryFn: () => carService.getCar(id!),
    enabled: !!id,
  });

  if (isLoading) {
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

  if (error || !car) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
        <div className="container-custom py-12">
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
            <div className="text-5xl mb-4">🚗</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Car Not Found</h2>
            <p className="text-gray-600 mb-6">The car you're looking for doesn't exist or has been removed.</p>
            <Link to="/search" className="btn-primary px-6 py-3">
              ← Back to Search
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const fuelTypeIcons: Record<string, string> = {
    electric: '⚡',
    petrol: '⛽',
    diesel: '🛢️',
    hybrid: '🔋',
  };

  const transmissionIcons: Record<string, string> = {
    automatic: '🅰️',
    manual: '🅱️',
  };

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
            <li className="text-gray-900 font-medium">{car.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
              {car.images && car.images.length > 0 ? (
                <img
                  src={car.images[selectedImage]}
                  alt={`${car.name} - Image ${selectedImage + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <span className="text-8xl">{fuelTypeIcons[car.fuelType] || '🚗'}</span>
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {car.images && car.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {car.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-primary-500 ring-2 ring-primary-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Car Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{car.name}</h1>
                {car.isActive ? (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Available
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                    Unavailable
                  </span>
                )}
              </div>
              <p className="text-lg text-gray-600">
                {car.brand} {car.model} • {car.year}
              </p>
            </div>

            {/* Price */}
            <div className="bg-primary-50 rounded-xl p-6 border border-primary-100">
              <p className="text-sm text-primary-600 mb-1">Price per day</p>
              <p className="text-4xl font-bold text-primary-700">${car.pricePerDay}</p>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl">{fuelTypeIcons[car.fuelType] || '⛽'}</span>
                  <div>
                    <p className="text-xs text-gray-500">Fuel Type</p>
                    <p className="font-medium text-gray-900 capitalize">{car.fuelType}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl">{transmissionIcons[car.transmission] || '⚙️'}</span>
                  <div>
                    <p className="text-xs text-gray-500">Transmission</p>
                    <p className="font-medium text-gray-900 capitalize">{car.transmission}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl">👥</span>
                  <div>
                    <p className="text-xs text-gray-500">Seats</p>
                    <p className="font-medium text-gray-900">{car.seats} passengers</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl">📅</span>
                  <div>
                    <p className="text-xs text-gray-500">Year</p>
                    <p className="font-medium text-gray-900">{car.year}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            {car.features && car.features.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Features</h2>
                <div className="flex flex-wrap gap-2">
                  {car.features.map((feature, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      ✓ {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            {car.location && (
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">📍 Pickup Location</h2>
                <p className="text-gray-700">{car.location.address}</p>
                <p className="text-gray-600">
                  {car.location.city}, {car.location.state}
                </p>
                <p className="text-gray-500">{car.location.country}</p>
              </div>
            )}

            {/* Book Button */}
            <div className="flex space-x-4">
              <button
                onClick={() => navigate(`/book/${car.id}`)}
                disabled={!car.isActive}
                className="flex-1 btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {car.isActive ? '🚗 Book Now' : 'Currently Unavailable'}
              </button>
              <button
                onClick={() => navigate(-1)}
                className="btn-secondary py-4 px-6"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
