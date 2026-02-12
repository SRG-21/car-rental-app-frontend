import { http, HttpResponse } from 'msw';
import { mockCars } from '../data/cars';
import { haversineDistance } from '@/utils/geo';

const API_URL = 'http://localhost:3000';

// Local search params type for MSW handlers
interface MockSearchParams {
  lat?: number;
  lon?: number;
  pickup?: string;
  dropoff?: string;
  seats?: number;
  fuelType?: string;
}

export const carHandlers = [
  // Get car by ID
  http.get(`${API_URL}/cars/:id`, ({ params }) => {
    const { id } = params;
    const car = mockCars.find((c) => c.id === id);

    if (!car) {
      return HttpResponse.json(
        { message: 'Car not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json(car);
  }),

  // Search cars
  http.get(`${API_URL}/search`, ({ request }) => {
    const url = new URL(request.url);
    const params: MockSearchParams = {
      lat: url.searchParams.get('lat')
        ? parseFloat(url.searchParams.get('lat')!)
        : undefined,
      lon: url.searchParams.get('lon')
        ? parseFloat(url.searchParams.get('lon')!)
        : undefined,
      pickup: url.searchParams.get('pickup') || undefined,
      dropoff: url.searchParams.get('dropoff') || undefined,
      seats: url.searchParams.get('seats')
        ? parseInt(url.searchParams.get('seats')!)
        : undefined,
      fuelType: url.searchParams.get('fuelType') || undefined,
    };

    let filteredCars = [...mockCars];

    // Filter by seats
    if (params.seats) {
      filteredCars = filteredCars.filter((car) => car.seats >= params.seats!);
    }

    // Filter by fuel type
    if (params.fuelType) {
      filteredCars = filteredCars.filter(
        (car) => car.fuelType === params.fuelType
      );
    }

    // Calculate distance and sort if location provided
    if (params.lat && params.lon) {
      filteredCars = filteredCars.map((car) => ({
        ...car,
        distance: haversineDistance(params.lat!, params.lon!, car.lat, car.lon),
      })) as any;

      filteredCars.sort(
        (a: any, b: any) => (a.distance || 0) - (b.distance || 0)
      );
    }

    return HttpResponse.json({
      cars: filteredCars,
      total: filteredCars.length,
    });
  }),
];
