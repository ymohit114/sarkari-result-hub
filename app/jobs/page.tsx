import { prisma } from '@/lib/prisma';
import CategoryPage from '@/components/CategoryPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Latest Jobs 2026 : Sarkari Naukri, Online Form Recruitment Alerts',
  description: 'Latest Government Jobs (Sarkari Naukri) 2026 notifications, online application forms, eligibility criteria, and vacancies in SSC, UPSC, Railway, Bank, and Defense.',
};

export const revalidate = 60;

export default async function JobsPage() {
  const posts = await prisma.jobPost.findMany({
    where: { category: 'latest-jobs', status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <CategoryPage
      title="Latest Government Jobs 2026 (Sarkari Naukri)"
      subtitle="Find all ongoing online application forms for Central & State Government recruitments."
      category="latest-jobs"
      posts={posts}
    />
  );
}
