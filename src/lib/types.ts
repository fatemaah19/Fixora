export type Language = 'ur' | 'en';
export type Role = 'user' | 'worker' | 'admin';
export type TradeId = 'electrician' | 'ac' | 'plumber' | 'carpenter';
export type WorkerStatus = 'pending' | 'approved' | 'rejected';
export type BookingStatus = 'requested' | 'booked' | 'completed' | 'cancelled';

export interface Customer { id: string; name: string; phone: string; area: string; }
export interface Worker {
  id: string; name: string; nameEn?: string; phone: string; whatsapp: string; tradeId: TradeId;
  experience: number; rating: number; reviews: number; area: string;
  bio: string; bioEn?: string; status: WorkerStatus; avatar: string;
}
export interface TimeSlot { id: string; workerId: string; date: string; start: string; end: string; booked: boolean; }
export interface ServiceRequest { id: string; customerId: string; tradeId: TradeId; description: string; area: string; status: BookingStatus; workerId?: string; slotId?: string; createdAt: string; }
export interface Complaint { id: string; customerId: string; bookingId?: string; message: string; status: 'open' | 'resolved'; response?: string; }
export interface Appliance { id: string; customerId: string; name: string; brand: string; warrantyUntil: string; history: string[]; }
