import type { Complaint } from './types';

export const LOCAL_COMPLAINTS_KEY = 'fixora-local-complaints';

function isComplaint(value: unknown): value is Complaint {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const complaint = value as Record<string, unknown>;
  return typeof complaint.id === 'string'
    && typeof complaint.customerId === 'string'
    && typeof complaint.message === 'string'
    && (complaint.status === 'open' || complaint.status === 'resolved')
    && (complaint.bookingId === undefined || typeof complaint.bookingId === 'string')
    && (complaint.response === undefined || typeof complaint.response === 'string')
    && (complaint.createdAt === undefined || typeof complaint.createdAt === 'string');
}

export function readLocalComplaints(): Complaint[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(LOCAL_COMPLAINTS_KEY) || '[]');
    return Array.isArray(saved) ? saved.filter(isComplaint) : [];
  } catch {
    return [];
  }
}

export function mergeLocalComplaints(base: Complaint[]): Complaint[] {
  const merged = new Map(base.map((complaint) => [complaint.id, complaint]));
  for (const complaint of readLocalComplaints()) merged.set(complaint.id, complaint);
  return [...merged.values()];
}

export function saveLocalComplaint(complaint: Complaint): void {
  if (typeof window === 'undefined') return;
  const current = readLocalComplaints().filter((item) => item.id !== complaint.id);
  localStorage.setItem(LOCAL_COMPLAINTS_KEY, JSON.stringify([complaint, ...current]));
}
