import { AdminShell } from '@/components/admin/AdminShell';
import { RoleGuard } from '@/components/RoleGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard role="admin"><AdminShell>{children}</AdminShell></RoleGuard>;
}
