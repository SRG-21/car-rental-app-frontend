import { authHandlers } from './auth.handlers';
import { carHandlers } from './car.handlers';
import { bookingHandlers } from './booking.handlers';

export const handlers = [...authHandlers, ...carHandlers, ...bookingHandlers];
