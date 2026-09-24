import { prisma } from '@/lib/prisma';
import CategoryPage from '@/components/CategoryPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sarkari Result 2026 : Check Online Exam Results & Cutoff Marks',
  description: 'Check Sarkari Result 2026, Merit List, Cut Off Marks, and Selection Lists for UPSC, SSC, Banking, Railways, and Board Exams.',
};

export const revalidate = 60;

export default async function ResultsPage() {
  const posts = await prisma.jobPost.findMany({
    where: { category: 'results', status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <CategoryPage
      title="Sarkari Exam Results 2026"
      subtitle="Fastest updates on examination results, score cards, merit lists, and official cut-offs."
      category="results"
      posts={posts}
    />
  );
}
