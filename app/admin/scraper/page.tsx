import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ScraperManagerClient from './ScraperManagerClient';

export default async function ScraperAdminPage() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect('/admin/login');
  }

  const [settings, recentLogs] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { id: 'default' } }),
    prisma.scraperLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ]);

  return <ScraperManagerClient initialSettings={settings} logs={recentLogs} />;
}
