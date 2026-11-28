import type { BookingStatus, ServiceRequest, TradeId } from './types';

export const LOCAL_SERVICE_REQUESTS_KEY = 'fixora-local-requests';
const LOCAL_PROFESSIONAL_BOOKINGS_KEY = 'fixora-local-bookings';

export type LocalServiceRequest = ServiceRequest & { phone?: string };

const trades: TradeId[] = ['electrician', 'ac', 'plumber', 'carpenter'];
const statuses: BookingStatus[] = ['requested', 'booked', 'completed', 'cancelled'];

function isLocalServiceRequest(value: unknown): value is LocalServiceRequest {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const request = value as Record<string, unknown>;
  return typeof request.id === 'string'
    && typeof request.customerId === 'string'
    && trades.includes(request.tradeId as TradeId)
    && typeof request.description === 'string'
    && typeof request.area === 'string'
    && statuses.includes(request.status as BookingStatus)
    && typeof request.createdAt === 'string';
}

function readStoredServiceRequests(): LocalServiceRequest[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(LOCAL_SERVICE_REQUESTS_KEY) || '[]');
    return Array.isArray(stored) ? stored.filter(isLocalServiceRequest) : [];
  } catch {
    return [];
  }
}

function readLegacyProfessionalBookings(): LocalServiceRequest[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(LOCAL_PROFESSIONAL_BOOKINGS_KEY) || '[]');
    if (!Array.isArray(stored)) return [];

    const requests: LocalServiceRequest[] = [];
    for (const value of stored) {
      if (!value || typeof value !== 'object' || Array.isArray(value)) continue;
      const booking = value as Record<string, unknown>;
      const createdAt = typeof booking.createdAt === 'string'
        ? booking.createdAt
        : typeof booking.date === 'string' ? booking.date : '';

      if (
        typeof booking.id !== 'string'
        || typeof booking.workerId !== 'string'
        || !trades.includes(booking.tradeId as TradeId)
        || typeof booking.area !== 'string'
        || !statuses.includes(booking.status as BookingStatus)
        || !createdAt
      ) continue;

      requests.push({
        id: booking.id,
        customerId: typeof booking.customerId === 'string' ? booking.customerId : 'c1',
        workerId: booking.workerId,
        tradeId: booking.tradeId as TradeId,
        description: 'پروفیشنل پروفائل سے بکنگ کی درخواست۔',
        descriptionEn: 'Booking request from a professional profile.',
        area: booking.area,
        status: booking.status as BookingStatus,
        createdAt,
      });
    }
    return requests;
  } catch {
    return [];
  }
}

export function readLocalServiceRequests(): LocalServiceRequest[] {
  if (typeof window === 'undefined') return [];

  const merged = new Map<string, LocalServiceRequest>();
  for (const request of readLegacyProfessionalBookings()) merged.set(request.id, request);
  for (const request of readStoredServiceRequests()) merged.set(request.id, request);
  return [...merged.values()];
}

export function saveLocalServiceRequest(request: LocalServiceRequest): void {
  const current = readLocalServiceRequests().filter((item) => item.id !== request.id);
  localStorage.setItem(LOCAL_SERVICE_REQUESTS_KEY, JSON.stringify([request, ...current]));
}

export function updateLocalServiceRequest(id: string, updates: Partial<Pick<LocalServiceRequest, 'status' | 'workerId'>>): void {
  const current = readLocalServiceRequests();
  const updated = current.map((request) => request.id === id ? { ...request, ...updates } : request);
  localStorage.setItem(LOCAL_SERVICE_REQUESTS_KEY, JSON.stringify(updated));
}
