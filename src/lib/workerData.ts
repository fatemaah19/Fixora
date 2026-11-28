import { readLocalServiceRequests, updateLocalServiceRequest } from './serviceRequestData';

export type WorkerTrade = 'ac' | 'electrician' | 'plumber' | 'carpenter';
export type WorkerJobStatus = 'accepted' | 'on_the_way' | 'in_progress' | 'completed';
export type WorkerJob = {
  id: string;
  trade: WorkerTrade;
  title: string;
  customer: string;
  area: string;
  time: string;
  price: string;
  status: WorkerJobStatus;
  description?: string;
  descriptionEn?: string;
  sourceRequestId?: string;
};

export type WorkerAvailableJob = {
  id: string;
  trade: WorkerTrade;
  title: string;
  description: string;
  customer: string;
  area: string;
  distance: string;
  price: string;
  time: string;
  appointmentTime: string;
  workerId?: string;
  descriptionEn?: string;
  sourceRequestId?: string;
};

export type WorkerRequestDecision = 'accepted' | 'declined';
export type WorkerRequestDecisions = Record<string, WorkerRequestDecision>;

export const WORKER_JOBS_STORAGE_KEY = 'fixora-worker-jobs';
export const WORKER_REQUESTS_STORAGE_KEY = 'fixora-worker-request-decisions';

export const mockWorkerJobs: WorkerJob[] = [
  { id: 'J-1042', trade: 'ac', title: 'AC service and cooling check', customer: 'Ahmed Raza', area: 'Gulgasht', time: '09:30', price: 'PKR 4,500', status: 'in_progress' },
  { id: 'J-1048', trade: 'electrician', title: 'Ceiling fan installation', customer: 'Fatima Noor', area: 'Model Town', time: '12:00', price: 'PKR 2,800', status: 'accepted' },
  { id: 'J-1051', trade: 'plumber', title: 'Kitchen tap repair', customer: 'Ali Hassan', area: 'Bosan Road', time: '15:30', price: 'PKR 1,900', status: 'on_the_way' },
  { id: 'J-1034', trade: 'carpenter', title: 'Bedroom door adjustment', customer: 'Sara Malik', area: 'Multan Cantt', time: 'Yesterday', price: 'PKR 3,200', status: 'completed' },
];

export const mockAvailableJobs: WorkerAvailableJob[] = [
  { id: 'R-208', trade: 'electrician', title: 'Install two ceiling lights', description: 'Two ceiling light points need installation in the living room.', customer: 'Nida Khan', area: 'Multan Cantt', distance: '2.4 km', price: 'PKR 2,500', time: '20 min ago', appointmentTime: '17:00' },
  { id: 'R-211', trade: 'ac', title: 'AC making unusual noise', description: 'Split AC needs an inspection; the indoor unit is making a rattling sound.', customer: 'Hassan Raza', area: 'Shah Rukn-e-Alam', distance: '4.1 km', price: 'PKR 3,000', time: '45 min ago', appointmentTime: '18:00' },
  { id: 'R-215', trade: 'plumber', title: 'Repair leaking kitchen sink', description: 'Water is dripping from the sink trap and needs a quick repair.', customer: 'Areeba Iqbal', area: 'Gulgasht', distance: '1.8 km', price: 'PKR 1,800', time: '1 hour ago', appointmentTime: '16:30' },
  { id: 'R-219', trade: 'carpenter', title: 'Adjust wardrobe door', description: 'One wardrobe door is misaligned and does not close smoothly.', customer: 'Bilal Ahmed', area: 'Model Town', distance: '3.2 km', price: 'PKR 2,200', time: '2 hours ago', appointmentTime: 'Tomorrow · 10:00' },
  { id: 'R-223', trade: 'electrician', title: 'Check a faulty wall switch', description: 'The bedroom switch is intermittent; please inspect and repair it.', customer: 'Zainab Ali', area: 'Bosan Road', distance: '5.0 km', price: 'PKR 1,500', time: '3 hours ago', appointmentTime: 'Tomorrow · 12:00' },
];

export function readAvailableWorkerRequests(): WorkerAvailableJob[] {
  const decisions = readWorkerRequestDecisions();
  const customerRequests: WorkerAvailableJob[] = readLocalServiceRequests()
    .filter((request) => request.status === 'requested' && (!request.workerId || request.workerId === 'w1'))
    .map((request) => ({
      id: request.id,
      trade: request.tradeId,
      title: 'New service request',
      description: request.description,
      descriptionEn: request.descriptionEn,
      customer: 'Customer',
      area: request.area,
      distance: '',
      price: '',
      time: request.createdAt,
      appointmentTime: '',
      workerId: request.workerId,
      sourceRequestId: request.id,
    }));

  return [...customerRequests, ...mockAvailableJobs].filter((request) => !decisions[request.id]);
}

export function resolveWorkerRequest(request: WorkerAvailableJob, decision: WorkerRequestDecision): void {
  if (decision === 'accepted') {
    addAcceptedJob(request);
    if (request.sourceRequestId) updateLocalServiceRequest(request.sourceRequestId, { status: 'booked', workerId: request.workerId || 'w1' });
  }
  saveWorkerRequestDecision(request.id, decision);
}

export function readWorkerRequestDecisions(): WorkerRequestDecisions {
  try {
    const raw = localStorage.getItem(WORKER_REQUESTS_STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed as WorkerRequestDecisions : {};
  } catch {
    return {};
  }
}

export function saveWorkerRequestDecision(id: string, decision: WorkerRequestDecision) {
  const decisions = readWorkerRequestDecisions();
  localStorage.setItem(WORKER_REQUESTS_STORAGE_KEY, JSON.stringify({ ...decisions, [id]: decision }));
}

export function addAcceptedJob(request: WorkerAvailableJob) {
  let current = mockWorkerJobs;
  try {
    const raw = localStorage.getItem(WORKER_JOBS_STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (Array.isArray(parsed)) current = parsed as WorkerJob[];
  } catch {
    current = mockWorkerJobs;
  }
  if (current.some((job) => job.id === request.id)) return;
  const next: WorkerJob = {
    id: request.id,
    trade: request.trade,
    title: request.title,
    customer: request.customer,
    area: request.area,
    time: request.appointmentTime || 'To be arranged',
    price: request.sourceRequestId ? 'Pending estimate' : request.price,
    status: 'accepted',
    description: request.description,
    descriptionEn: request.descriptionEn,
    sourceRequestId: request.sourceRequestId,
  };
  localStorage.setItem(WORKER_JOBS_STORAGE_KEY, JSON.stringify([...current, next]));
}
