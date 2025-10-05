import { http, HttpResponse } from 'msw';
import { Booking, BookingRequest } from '@/types';
import { mockCars } from '../data/cars';

const API_URL = 'http://localhost:3000';

// In-memory booking storage
const bookings: Booking[] = [];

function decodeToken(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1]));
  } catch {
    return null;
  }
}

export const bookingHandlers = [
  // Create booking
  http.post(`${API_URL}/bookings`, async ({ request }) => {
    // Check authentication
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = decodeToken(token);

    if (!payload || !payload.userId) {
      return HttpResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = (await request.json()) as BookingRequest;

    // Validate input
    if (!body.carId || !body.pickupTime || !body.dropoffTime) {
      return HttpResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if car exists
    const car = mockCars.find((c) => c.id === body.carId);
    if (!car) {
      return HttpResponse.json(
        { message: 'Car not found' },
        { status: 404 }
      );
    }

    // Check for conflicts (simplified - just check if car has any bookings for those dates)
    const hasConflict = bookings.some(
      (b) =>
        b.carId === body.carId &&
        b.status !== 'cancelled' &&
        ((new Date(body.pickupTime) >= new Date(b.pickupTime) &&
          new Date(body.pickupTime) < new Date(b.dropoffTime)) ||
          (new Date(body.dropoffTime) > new Date(b.pickupTime) &&
            new Date(body.dropoffTime) <= new Date(b.dropoffTime)))
    );

    if (hasConflict) {
      return HttpResponse.json(
        { message: 'Car is not available for the selected dates' },
        { status: 409 }
      );
    }

    // Calculate total price
    const pickupDate = new Date(body.pickupTime);
    const dropoffDate = new Date(body.dropoffTime);
    const days = Math.max(
      1,
      Math.ceil(
        (dropoffDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24)
      )
    );
    const totalPrice = days * car.pricePerDay;

    // Create booking
    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      userId: payload.userId,
      carId: body.carId,
      car,
      pickupTime: body.pickupTime,
      dropoffTime: body.dropoffTime,
      totalPrice,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    bookings.push(newBooking);

    return HttpResponse.json(newBooking, { status: 201 });
  }),

  // Get all bookings for current user
  http.get(`${API_URL}/bookings`, ({ request }) => {
    // Check authentication
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = decodeToken(token);

    if (!payload || !payload.userId) {
      return HttpResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get user's bookings
    const userBookings = bookings
      .filter((b) => b.userId === payload.userId)
      .map((b) => ({
        ...b,
        car: mockCars.find((c) => c.id === b.carId),
      }));

    return HttpResponse.json(userBookings);
  }),

  // Get booking by ID
  http.get(`${API_URL}/bookings/:id`, ({ request, params }) => {
    // Check authentication
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = decodeToken(token);

    if (!payload || !payload.userId) {
      return HttpResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    const { id } = params;
    const booking = bookings.find((b) => b.id === id);

    if (!booking) {
      return HttpResponse.json(
        { message: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (booking.userId !== payload.userId) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Attach car details
    const bookingWithCar = {
      ...booking,
      car: mockCars.find((c) => c.id === booking.carId),
    };

    return HttpResponse.json(bookingWithCar);
  }),
];
