/**
 * Cities configuration with coordinates for search functionality
 */

export interface City {
  id: string;
  name: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export const cities: City[] = [
  // USA - West Coast
  {
    id: 'san-francisco',
    name: 'San Francisco',
    state: 'California',
    country: 'USA',
    latitude: 37.7749,
    longitude: -122.4194,
    timezone: 'America/Los_Angeles',
  },
  {
    id: 'los-angeles',
    name: 'Los Angeles',
    state: 'California',
    country: 'USA',
    latitude: 34.0522,
    longitude: -118.2437,
    timezone: 'America/Los_Angeles',
  },
  {
    id: 'san-diego',
    name: 'San Diego',
    state: 'California',
    country: 'USA',
    latitude: 32.7157,
    longitude: -117.1611,
    timezone: 'America/Los_Angeles',
  },
  {
    id: 'seattle',
    name: 'Seattle',
    state: 'Washington',
    country: 'USA',
    latitude: 47.6062,
    longitude: -122.3321,
    timezone: 'America/Los_Angeles',
  },
  {
    id: 'portland',
    name: 'Portland',
    state: 'Oregon',
    country: 'USA',
    latitude: 45.5152,
    longitude: -122.6784,
    timezone: 'America/Los_Angeles',
  },
  {
    id: 'las-vegas',
    name: 'Las Vegas',
    state: 'Nevada',
    country: 'USA',
    latitude: 36.1699,
    longitude: -115.1398,
    timezone: 'America/Los_Angeles',
  },
  {
    id: 'phoenix',
    name: 'Phoenix',
    state: 'Arizona',
    country: 'USA',
    latitude: 33.4484,
    longitude: -112.0740,
    timezone: 'America/Phoenix',
  },
  
  // USA - East Coast
  {
    id: 'new-york',
    name: 'New York',
    state: 'New York',
    country: 'USA',
    latitude: 40.7128,
    longitude: -74.0060,
    timezone: 'America/New_York',
  },
  {
    id: 'boston',
    name: 'Boston',
    state: 'Massachusetts',
    country: 'USA',
    latitude: 42.3601,
    longitude: -71.0589,
    timezone: 'America/New_York',
  },
  {
    id: 'miami',
    name: 'Miami',
    state: 'Florida',
    country: 'USA',
    latitude: 25.7617,
    longitude: -80.1918,
    timezone: 'America/New_York',
  },
  {
    id: 'atlanta',
    name: 'Atlanta',
    state: 'Georgia',
    country: 'USA',
    latitude: 33.7490,
    longitude: -84.3880,
    timezone: 'America/New_York',
  },
  {
    id: 'washington-dc',
    name: 'Washington D.C.',
    state: 'District of Columbia',
    country: 'USA',
    latitude: 38.9072,
    longitude: -77.0369,
    timezone: 'America/New_York',
  },
  {
    id: 'chicago',
    name: 'Chicago',
    state: 'Illinois',
    country: 'USA',
    latitude: 41.8781,
    longitude: -87.6298,
    timezone: 'America/Chicago',
  },
  {
    id: 'houston',
    name: 'Houston',
    state: 'Texas',
    country: 'USA',
    latitude: 29.7604,
    longitude: -95.3698,
    timezone: 'America/Chicago',
  },
  {
    id: 'dallas',
    name: 'Dallas',
    state: 'Texas',
    country: 'USA',
    latitude: 32.7767,
    longitude: -96.7970,
    timezone: 'America/Chicago',
  },
  {
    id: 'austin',
    name: 'Austin',
    state: 'Texas',
    country: 'USA',
    latitude: 30.2672,
    longitude: -97.7431,
    timezone: 'America/Chicago',
  },
  {
    id: 'denver',
    name: 'Denver',
    state: 'Colorado',
    country: 'USA',
    latitude: 39.7392,
    longitude: -104.9903,
    timezone: 'America/Denver',
  },
];

// Default search radius options (in km)
export const radiusOptions = [
  { value: 5, label: '5 km' },
  { value: 10, label: '10 km' },
  { value: 15, label: '15 km' },
  { value: 25, label: '25 km' },
  { value: 50, label: '50 km' },
  { value: 100, label: '100 km' },
];

// Default city for initial search
export const defaultCity = cities.find(c => c.id === 'san-francisco') || cities[0];

// Helper function to find city by ID
export const getCityById = (id: string): City | undefined => {
  return cities.find(city => city.id === id);
};

// Helper function to find city by coordinates (within tolerance)
export const getCityByCoordinates = (lat: number, lng: number, tolerance = 0.1): City | undefined => {
  return cities.find(
    city => 
      Math.abs(city.latitude - lat) <= tolerance && 
      Math.abs(city.longitude - lng) <= tolerance
  );
};

// Get formatted city name with state
export const formatCityName = (city: City): string => {
  return `${city.name}, ${city.state}`;
};
