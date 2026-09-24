import { prisma } from '@/lib/prisma';
import CategoryPage from '@/components/CategoryPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admission 2026 : Entrance Exam Form, Counseling & Seat Allotment',
  description: 'Entrance exam online forms, counseling schedules, and admissions for universities, colleges, and national level tests (NEET, JEE, CUET, etc.).',
};

export const revalidate = 60;

export default async function AdmissionPage() {
  const posts = await prisma.jobPost.findMany({
    where: { category: 'admission', status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <CategoryPage
      title="Admissions & Entrance Exams 2026"
      subtitle="Online forms and updates for national & state entrance exams, counseling and admissions."
      category="admission"
      posts={posts}
    />
  );
}
