'use client';

export type NotificationRole = 'user' | 'worker';
export type NotificationKind = 'booking' | 'job' | 'passport' | 'support' | 'review' | 'earnings' | 'profile';
export type LocalNotification = {
  id: string; kind: NotificationKind; titleUr: string; titleEn: string;
  messageUr: string; messageEn: string; minutesAgo: number; href: string; isRead: boolean;
};

const fixtures: Record<NotificationRole, Omit<LocalNotification, 'isRead'>[]> = {
  user: [
    { id: 'user-booking-accepted', kind: 'booking', titleUr: 'آپ کی درخواست قبول ہو گئی', titleEn: 'Your request was accepted', messageUr: 'عثمان نے آپ کی اے سی سروس کی درخواست قبول کر لی ہے۔', messageEn: 'Usman accepted your AC service request.', minutesAgo: 12, href: '/dashboard/bookings' },
    { id: 'user-worker-arriving', kind: 'job', titleUr: 'آپ کی بکنگ آج دوپہر ہے', titleEn: 'Your booking is this afternoon', messageUr: 'پنکھا لگانے کی بکنگ آج دوپہر کے لیے طے ہے۔', messageEn: 'Your fan installation is scheduled for this afternoon.', minutesAgo: 48, href: '/dashboard/bookings' },
    { id: 'user-passport-reminder', kind: 'passport', titleUr: 'ہوم پاسپورٹ اپ ڈیٹ کریں', titleEn: 'Update your Home Passport', messageUr: 'اپنے گھر کے آلات کی تفصیل شامل کر کے اگلی مرمت آسان بنائیں۔', messageEn: 'Add your appliance details to make your next repair easier.', minutesAgo: 190, href: '/dashboard/passport' },
    { id: 'user-support-reply', kind: 'support', titleUr: 'مدد کی درخواست کا جواب آ گیا', titleEn: 'There is a reply to your support request', messageUr: 'آپ کی حالیہ مدد کی درخواست پر ٹیم نے جواب دیا ہے۔', messageEn: 'The team replied to your recent support request.', minutesAgo: 1440, href: '/dashboard/support' },
  ],
  worker: [
    { id: 'worker-nearby-request', kind: 'job', titleUr: 'قریب نئی درخواست موجود ہے', titleEn: 'A new request is nearby', messageUr: 'ملتان کینٹ میں اے سی سروس کی درخواست آئی ہے۔', messageEn: 'An AC service request is available in Multan Cantt.', minutesAgo: 8, href: '/worker/available' },
    { id: 'worker-job-reminder', kind: 'booking', titleUr: 'اگلا کام آج دوپہر ہے', titleEn: 'Your next job is this afternoon', messageUr: 'ماڈل ٹاؤن میں پنکھا لگانے کا کام شیڈول میں شامل ہے۔', messageEn: 'Your fan installation in Model Town is on your schedule.', minutesAgo: 55, href: '/worker/schedule' },
    { id: 'worker-customer-review', kind: 'review', titleUr: 'آپ کو نیا جائزہ ملا', titleEn: 'You received a new review', messageUr: 'ایک صارف نے آپ کی حالیہ سروس کو پانچ ستارے دیے ہیں۔', messageEn: 'A customer gave your recent service five stars.', minutesAgo: 220, href: '/worker/profile' },
    { id: 'worker-weekly-earnings', kind: 'earnings', titleUr: 'اس ہفتے کی آمدنی تیار ہے', titleEn: 'Your weekly earnings are ready', messageUr: 'اپنی ہفتہ وار آمدنی کا خلاصہ دیکھیں۔', messageEn: 'Check your weekly earnings summary.', minutesAgo: 1440, href: '/worker/earnings' },
  ],
};

function readIds(role: NotificationRole): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const value: unknown = JSON.parse(localStorage.getItem('fixora-notifications-' + role) || '[]');
    return new Set(Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : []);
  } catch { return new Set(); }
}
function saveIds(role: NotificationRole, ids: Set<string>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('fixora-notifications-' + role, JSON.stringify(Array.from(ids)));
    window.dispatchEvent(new Event('fixora:notifications-updated'));
  } catch { /* Keep the current view usable if browser storage is unavailable. */ }
}
export function readNotifications(role: NotificationRole): LocalNotification[] {
  const read = readIds(role);
  return fixtures[role].map((item) => ({ ...item, isRead: read.has(item.id) }));
}
export function unreadNotificationCount(role: NotificationRole): number {
  return readNotifications(role).filter((item) => !item.isRead).length;
}
export function markNotificationRead(role: NotificationRole, id: string) {
  const read = readIds(role); read.add(id); saveIds(role, read);
}
export function markAllNotificationsRead(role: NotificationRole) {
  saveIds(role, new Set(fixtures[role].map((item) => item.id)));
}