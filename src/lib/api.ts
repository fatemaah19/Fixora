import { appliances, complaints, customers, requests, timeSlots, workers } from './mockData';
import type { Appliance, Complaint, Customer, ServiceRequest, TimeSlot, TradeId, Worker, WorkerStatus } from './types';

const pause = <T,>(value: T): Promise<T> => new Promise(resolve => setTimeout(() => resolve(value), 120));
export const getCustomers = (): Promise<Customer[]> => pause([...customers]);
export const getWorkers = (): Promise<Worker[]> => pause([...workers]);
export const getWorkerById = (id: string): Promise<Worker | undefined> => pause(workers.find(worker => worker.id === id));
export const getRankedWorkers = (tradeId: TradeId): Promise<Worker[]> => pause(workers.filter(w => w.tradeId === tradeId && w.status === 'approved').sort((a,b) => b.rating-a.rating || b.reviews-a.reviews));
export const getRequests = (): Promise<ServiceRequest[]> => pause([...requests]);
export const getBookings = (customerId?: string): Promise<ServiceRequest[]> => pause(requests.filter(r => !customerId || r.customerId === customerId));
export const getTimeSlots = (workerId?: string): Promise<TimeSlot[]> => pause(timeSlots.filter(s => !workerId || s.workerId === workerId));
export const getComplaints = (): Promise<Complaint[]> => pause([...complaints]);
export const getAppliances = (customerId?: string): Promise<Appliance[]> => pause(appliances.filter(a => !customerId || a.customerId === customerId));
export const updateWorkerStatus = async (workerId: string, status: WorkerStatus): Promise<Worker | undefined> => pause(workers.find(w => w.id === workerId && (w.status = status)));
