import { format, parseISO, differenceInDays, differenceInHours } from 'date-fns';

/**
 * Format ISO date string to readable format
 */
export function formatDate(isoString: string, formatStr = 'PPP'): string {
  try {
    return format(parseISO(isoString), formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return isoString;
  }
}

/**
 * Format ISO date string to datetime format
 */
export function formatDateTime(
  isoString: string,
  formatStr = 'PPP p'
): string {
  try {
    return format(parseISO(isoString), formatStr);
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return isoString;
  }
}

/**
 * Validate that pickup date is before dropoff date
 */
export function isDateRangeValid(pickup: string, dropoff: string): boolean {
  try {
    const pickupDate = parseISO(pickup);
    const dropoffDate = parseISO(dropoff);
    return pickupDate < dropoffDate;
  } catch (error) {
    return false;
  }
}

/**
 * Calculate number of days between two dates
 */
export function calculateDays(pickup: string, dropoff: string): number {
  try {
    const pickupDate = parseISO(pickup);
    const dropoffDate = parseISO(dropoff);
    const days = differenceInDays(dropoffDate, pickupDate);
    return Math.max(1, days); // Minimum 1 day
  } catch (error) {
    return 1;
  }
}

/**
 * Calculate number of hours between two dates
 */
export function calculateHours(pickup: string, dropoff: string): number {
  try {
    const pickupDate = parseISO(pickup);
    const dropoffDate = parseISO(dropoff);
    return differenceInHours(dropoffDate, pickupDate);
  } catch (error) {
    return 0;
  }
}

/**
 * Convert datetime-local input value to ISO string
 */
export function toISOString(dateTimeLocalValue: string): string {
  if (!dateTimeLocalValue) return '';
  try {
    return new Date(dateTimeLocalValue).toISOString();
  } catch (error) {
    return '';
  }
}

/**
 * Convert ISO string to datetime-local input value
 */
export function toDateTimeLocalValue(isoString: string): string {
  if (!isoString) return '';
  try {
    const date = parseISO(isoString);
    return format(date, "yyyy-MM-dd'T'HH:mm");
  } catch (error) {
    return '';
  }
}
