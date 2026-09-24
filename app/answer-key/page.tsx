import { prisma } from '@/lib/prisma';
import CategoryPage from '@/components/CategoryPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Answer Key 2026 : Download Official Exam Solutions & Raise Objections',
  description: 'Download official answer keys and response sheets for various government recruitment and entrance examinations.',
};

export const revalidate = 60;

export default async function AnswerKeyPage() {
  const posts = await prisma.jobPost.findMany({
    where: { category: 'answer-key', status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <CategoryPage
      title="Official Answer Keys 2026"
      subtitle="Check question papers, provisional & final answer keys, and submit objections online."
      category="answer-key"
      posts={posts}
    />
  );
}
