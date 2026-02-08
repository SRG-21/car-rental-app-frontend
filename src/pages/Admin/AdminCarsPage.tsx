import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { carService } from '@/services';
import { Car, CreateCarRequest, FuelType, TransmissionType } from '@/types';
import { cities, City } from '@/config/cities';

type ModalMode = 'create' | 'edit' | null;

export default function AdminCarsPage() {
  const queryClient = useQueryClient();
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [editingCarId, setEditingCarId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [selectedCity, setSelectedCity] = useState<City>(cities.find(c => c.id === 'san-francisco') || cities[0]);
  const [isRefetching, setIsRefetching] = useState(false);
  
  const { data: searchResponse, isLoading } = useQuery({
    queryKey: ['admin-cars', selectedCity.id],
    queryFn: () => carService.searchCars({
      latitude: selectedCity.latitude,
      longitude: selectedCity.longitude,
      radius: 100,
      limit: 100,
    }),
  });

  // Fetch full car details when editing
  const { data: carDetails, isLoading: isLoadingCarDetails, error: carDetailError } = useQuery({
    queryKey: ['car-detail', editingCarId],
    queryFn: () => carService.getCar(editingCarId!),
    enabled: !!editingCarId,
  });

  // Handle car details loaded
  useEffect(() => {
    if (carDetails && editingCarId) {
      setSelectedCar(carDetails);
      setModalMode('edit');
      setEditingCarId(null);
    }
  }, [carDetails, editingCarId]);

  // Handle car detail error
  useEffect(() => {
    if (carDetailError && editingCarId) {
      setError('Failed to load car details');
      setEditingCarId(null);
    }
  }, [carDetailError, editingCarId]);

  const cars = searchResponse?.cars || [];

  // Filter cars by search query
  const filteredCars = cars.filter(car => {
    const query = searchQuery.toLowerCase();
    return (
      car.make.toLowerCase().includes(query) ||
      car.model.toLowerCase().includes(query)
    );
  });

  // Delete car mutation
  const deleteCarMutation = useMutation({
    mutationFn: carService.deleteCar,
    onSuccess: async () => {
      setIsRefetching(true);
      // Wait for backend to process
      await new Promise(resolve => setTimeout(resolve, 800));
      // Invalidate both the car list and any car detail queries
      await queryClient.invalidateQueries({ queryKey: ['admin-cars'] });
      await queryClient.invalidateQueries({ queryKey: ['car-detail'] });
      setIsRefetching(false);
    },
    onError: (err: any) => {
      setIsRefetching(false);
      alert(err.response?.data?.error?.message || 'Failed to delete car');
    },
  });

  const handleDelete = (carId: string, carName: string) => {
    if (confirm(`Are you sure you want to delete "${carName}"?`)) {
      deleteCarMutation.mutate(carId);
    }
  };

  const openCreateModal = () => {
    setSelectedCar(null);
    setModalMode('create');
    setError('');
  };

  const openEditModal = (carId: string) => {
    setEditingCarId(carId);
    setError('');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedCar(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-8">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🚗 Car Management</h1>
            <p className="text-gray-600 mt-1">Admin dashboard for managing car inventory</p>
          </div>
          <button
            onClick={openCreateModal}
            className="btn-primary flex items-center space-x-2"
          >
            <span>+</span>
            <span>Add New Car</span>
          </button>
        </div>

        {/* City Filter and Search */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* City Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📍 Location
              </label>
              <select
                value={selectedCity.id}
                onChange={(e) => {
                  const city = cities.find(c => c.id === e.target.value);
                  if (city) setSelectedCity(city);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}, {city.state}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔍 Search Cars
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by make or model..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Cars Table */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🚗</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No cars found</h3>
              <p className="text-gray-600">
                {searchQuery ? 'Try a different search term' : 'Add your first car to get started'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Car
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCars.map((car) => (
                    <tr key={car.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                            {car.imageUrl ? (
                              <img
                                src={car.imageUrl}
                                alt={`${car.make} ${car.model}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-lg">
                                🚗
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {car.make} {car.model}
                            </div>
                            <div className="text-sm text-gray-500">{car.year}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">{car.fuelType}</div>
                        <div className="text-sm text-gray-500 capitalize">{car.transmission} • {car.seats} seats</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">${car.pricePerDay}/day</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {car.isAvailable ? (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            Available
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                            Unavailable
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{car.location.city}</div>
                        <div className="text-sm text-gray-500">{car.location.state}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openEditModal(car.id)}
                          className="text-primary-600 hover:text-primary-900"
                          disabled={isLoadingCarDetails}
                        >
                          {editingCarId === car.id ? 'Loading...' : 'Edit'}
                        </button>
                        <button
                          onClick={() => handleDelete(car.id, `${car.make} ${car.model}`)}
                          className="text-red-600 hover:text-red-900 ml-4"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Total Cars</p>
            <p className="text-2xl font-bold text-gray-900">{cars.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Available</p>
            <p className="text-2xl font-bold text-green-600">
              {cars.filter(c => c.isAvailable).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Unavailable</p>
            <p className="text-2xl font-bold text-red-600">
              {cars.filter(c => !c.isAvailable).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Avg. Price</p>
            <p className="text-2xl font-bold text-gray-900">
              ${cars.length > 0 
                ? Math.round(cars.reduce((sum, c) => sum + c.pricePerDay, 0) / cars.length)
                : 0}/day
            </p>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {modalMode && (
        <CarFormModal
          mode={modalMode}
          car={selectedCar}
          onClose={closeModal}
          onSuccess={async () => {
            closeModal();
            setIsRefetching(true);
            // Wait for backend to process
            await new Promise(resolve => setTimeout(resolve, 800));
            // Invalidate both the car list and any car detail queries
            await queryClient.invalidateQueries({ queryKey: ['admin-cars'] });
            await queryClient.invalidateQueries({ queryKey: ['car-detail'] });
            setIsRefetching(false);
          }}
        />
      )}

      {/* Refetching Loader Overlay */}
      {isRefetching && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 flex flex-col items-center space-y-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="text-gray-700 font-medium">Updating car list...</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Car Form Modal Component
interface CarFormModalProps {
  mode: 'create' | 'edit';
  car: Car | null;
  onClose: () => void;
  onSuccess: () => void;
}

function CarFormModal({ mode, car, onClose, onSuccess }: CarFormModalProps) {
  const [formData, setFormData] = useState<CreateCarRequest>({
    name: car?.name || '',
    brand: car?.brand || '',
    model: car?.model || '',
    year: car?.year || new Date().getFullYear(),
    fuelType: (car?.fuelType as FuelType) || 'petrol',
    transmission: (car?.transmission as TransmissionType) || 'automatic',
    seats: car?.seats || 5,
    pricePerDay: car?.pricePerDay || 50,
    images: car?.images || [''],
    features: car?.features || [],
    location: car?.location || {
      latitude: cities[0].latitude,
      longitude: cities[0].longitude,
      address: '',
      city: cities[0].name,
      state: cities[0].state,
      country: cities[0].country,
    },
  });
  const [selectedCity, setSelectedCity] = useState<City>(
    cities.find(c => c.name === car?.location?.city) || cities[0]
  );
  const [featureInput, setFeatureInput] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createMutation = useMutation({
    mutationFn: carService.createCar,
    onSuccess: () => {
      setIsSubmitting(false);
      onSuccess();
    },
    onError: (err: any) => {
      setIsSubmitting(false);
      setError(err.response?.data?.error?.message || 'Failed to create car');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => carService.updateCar(id, data),
    onSuccess: () => {
      setIsSubmitting(false);
      onSuccess();
    },
    onError: (err: any) => {
      setIsSubmitting(false);
      setError(err.response?.data?.error?.message || 'Failed to update car');
    },
  });

  const handleCityChange = (cityId: string) => {
    const city = cities.find(c => c.id === cityId);
    if (city) {
      setSelectedCity(city);
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          latitude: city.latitude,
          longitude: city.longitude,
          city: city.name,
          state: city.state,
          country: city.country,
        },
      }));
    }
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), featureInput.trim()],
      }));
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Filter out empty images
    const cleanedData = {
      ...formData,
      images: formData.images.filter(img => img.trim() !== ''),
    };

    if (cleanedData.images.length === 0) {
      cleanedData.images = ['https://via.placeholder.com/400x300?text=Car+Image'];
    }

    if (mode === 'create') {
      createMutation.mutate(cleanedData);
    } else if (car) {
      updateMutation.mutate({ id: car.id, data: cleanedData });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'create' ? '➕ Add New Car' : '✏️ Edit Car'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Tesla Model 3 Long Range"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Tesla"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Model 3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: Number(e.target.value) }))}
                required
                min={1900}
                max={new Date().getFullYear() + 1}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type *</label>
              <select
                value={formData.fuelType}
                onChange={(e) => setFormData(prev => ({ ...prev, fuelType: e.target.value as FuelType }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transmission *</label>
              <select
                value={formData.transmission}
                onChange={(e) => setFormData(prev => ({ ...prev, transmission: e.target.value as TransmissionType }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Seats *</label>
              <input
                type="number"
                value={formData.seats}
                onChange={(e) => setFormData(prev => ({ ...prev, seats: Number(e.target.value) }))}
                required
                min={1}
                max={20}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price/Day ($) *</label>
              <input
                type="number"
                value={formData.pricePerDay}
                onChange={(e) => setFormData(prev => ({ ...prev, pricePerDay: Number(e.target.value) }))}
                required
                min={1}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
            <input
              type="url"
              value={formData.images[0] || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, images: [e.target.value] }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="https://example.com/car-image.jpg"
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <select
                value={selectedCity.id}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white"
              >
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}, {city.state}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <input
                type="text"
                value={formData.location.address}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, address: e.target.value }
                }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="123 Main Street"
              />
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Bluetooth, GPS, Leather Seats"
              />
              <button
                type="button"
                onClick={addFeature}
                className="btn-secondary px-4"
              >
                Add
              </button>
            </div>
            {formData.features && formData.features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary px-6"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
              className="btn-primary px-6 disabled:opacity-50"
            >
              {isSubmitting || createMutation.isPending || updateMutation.isPending
                ? 'Saving...'
                : mode === 'create'
                  ? 'Create Car'
                  : 'Update Car'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
