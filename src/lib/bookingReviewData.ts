export const LOCAL_BOOKING_REVIEWS_KEY = 'fixora-local-booking-reviews';

export interface LocalBookingReview {
  bookingId: string;
  customerId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

function isLocalBookingReview(value: unknown): value is LocalBookingReview {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const review = value as Record<string, unknown>;
  return typeof review.bookingId === 'string'
    && typeof review.customerId === 'string'
    && typeof review.rating === 'number'
    && Number.isInteger(review.rating)
    && review.rating >= 1
    && review.rating <= 5
    && typeof review.comment === 'string'
    && typeof review.createdAt === 'string';
}

export function readLocalBookingReviews(customerId?: string): LocalBookingReview[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(LOCAL_BOOKING_REVIEWS_KEY) || '[]');
    if (!Array.isArray(stored)) return [];
    const reviews = stored.filter(isLocalBookingReview);
    return customerId ? reviews.filter((review) => review.customerId === customerId) : reviews;
  } catch {
    return [];
  }
}

export function saveLocalBookingReview(review: LocalBookingReview): void {
  if (typeof window === 'undefined') return;
  const current = readLocalBookingReviews().filter((item) => item.bookingId !== review.bookingId);
  localStorage.setItem(LOCAL_BOOKING_REVIEWS_KEY, JSON.stringify([review, ...current]));
}
