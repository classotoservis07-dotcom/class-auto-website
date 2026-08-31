import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { SESSION_OPTIONS } from '@/lib/session';
import type { AdminSession } from '@/lib/session';

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  let newAppointments = 0;

  try {
    const cookieStore = await cookies();
    const session = await getIronSession<AdminSession>(cookieStore, SESSION_OPTIONS);

    if (!session.isLoggedIn) {
      redirect('/admin/login');
    }

    // Yeni randevu sayısı
    try {
      const { prisma } = await import('@/lib/prisma');
      newAppointments = await prisma.appointment.count({ where: { status: 'new' } });
    } catch {
      // DB hatası panel çalışmasını engellemesin
    }
  } catch {
    redirect('/admin/login');
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#111827' }}>
      <AdminSidebar newAppointments={newAppointments} />
      <main style={{ marginLeft: '240px', flex: 1, minHeight: '100vh', overflow: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
