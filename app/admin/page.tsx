import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import DashboardClient from './DashboardClient';

export default async function AdminDashboardPage() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect('/admin/login');
  }

  // Fetch metrics
  const [totalPosts, publishedPosts, draftPosts, telegramSentPosts, recentPosts, settings] =
    await Promise.all([
      prisma.jobPost.count(),
      prisma.jobPost.count({ where: { status: 'PUBLISHED' } }),
      prisma.jobPost.count({ where: { status: 'DRAFT' } }),
      prisma.jobPost.count({ where: { isTelegramSent: true } }),
      prisma.jobPost.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.siteSetting.findUnique({ where: { id: 'default' } }),
    ]);

  return (
    <DashboardClient
      stats={{
        totalPosts,
        publishedPosts,
        draftPosts,
        telegramSentPosts,
      }}
      recentPosts={recentPosts}
      settings={settings}
    />
  );
}
