import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingTelegram from '@/components/FloatingTelegram';
import SearchClient from '@/components/SearchClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Sarkari Result & Latest Jobs 2026',
  description: 'Search all latest government jobs, admit cards, results, and answer keys on Sarkari Result Hub.',
};

export default async function SearchPage() {
  const posts = await prisma.jobPost.findMany({
    where: {
      status: 'PUBLISHED',
    },
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      organization: true,
      totalVacancies: true,
      qualification: true,
      shortDescription: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f5f9] text-gray-900 selection:bg-red-700 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-2.5 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <SearchClient posts={posts} />
      </main>

      <Footer />
      <FloatingTelegram />
    </div>
  );
}
