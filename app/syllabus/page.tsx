import { prisma } from '@/lib/prisma';
import CategoryPage from '@/components/CategoryPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Exam Syllabus 2026 : Download Exam Pattern & Selection Process PDF',
  description: 'Download latest exam syllabus and exam pattern PDFs for government competitive examinations.',
};

export const revalidate = 60;

export default async function SyllabusPage() {
  const posts = await prisma.jobPost.findMany({
    where: { category: 'syllabus', status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <CategoryPage
      title="Exam Syllabus & Pattern 2026"
      subtitle="Detailed topic-wise syllabus, marking scheme, and exam patterns for upcoming exams."
      category="syllabus"
      posts={posts}
    />
  );
}
