import type { Worker, WorkerStatus } from './types';

const statusStorageKey = 'fixora-admin-worker-status-overrides';
const validStatuses: WorkerStatus[] = ['pending', 'approved', 'rejected'];

export function readWorkerStatusOverrides(): Record<string, WorkerStatus> {
  if (typeof window === 'undefined') return {};
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(statusStorageKey) || '{}');
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return {};
    return Object.fromEntries(
      Object.entries(saved).filter((entry): entry is [string, WorkerStatus] =>
        typeof entry[0] === 'string' && validStatuses.includes(entry[1] as WorkerStatus),
      ),
    );
  } catch {
    localStorage.removeItem(statusStorageKey);
    return {};
  }
}

export function applyWorkerStatusOverrides(items: Worker[]): Worker[] {
  const overrides = readWorkerStatusOverrides();
  return items.map((worker) => ({ ...worker, status: overrides[worker.id] ?? worker.status }));
}

export function saveWorkerStatusOverride(workerId: string, status: WorkerStatus): void {
  const overrides = readWorkerStatusOverrides();
  localStorage.setItem(statusStorageKey, JSON.stringify({ ...overrides, [workerId]: status }));
}
