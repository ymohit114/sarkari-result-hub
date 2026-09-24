import { prisma } from '@/lib/prisma';
import CategoryPage from '@/components/CategoryPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admit Card 2026 : Download Hall Tickets, Exam City Intimation Slip',
  description: 'Download Admit Card 2026, Call Letter, Hall Ticket, and Exam City Slip for SSC, UPSC, Railway, Banking, Teaching, and State Exams.',
};

export const revalidate = 60;

export default async function AdmitCardPage() {
  const posts = await prisma.jobPost.findMany({
    where: { category: 'admit-card', status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <CategoryPage
      title="Admit Card & Hall Ticket 2026"
      subtitle="Direct links to download exam call letters and check exam city intimation slips."
      category="admit-card"
      posts={posts}
    />
  );
}
