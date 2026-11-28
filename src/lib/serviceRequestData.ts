import type { BookingStatus, ServiceRequest, TradeId } from './types';

export const LOCAL_SERVICE_REQUESTS_KEY = 'fixora-local-requests';

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

export function readLocalServiceRequests(): LocalServiceRequest[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(LOCAL_SERVICE_REQUESTS_KEY) || '[]');
    return Array.isArray(stored) ? stored.filter(isLocalServiceRequest) : [];
  } catch {
    return [];
  }
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
