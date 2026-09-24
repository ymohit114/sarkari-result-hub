import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingTelegram from '@/components/FloatingTelegram';
import Link from 'next/link';
import { ChevronRight, Search, Building2, Briefcase } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Sarkari Result & Latest Jobs 2026',
  description: 'Search all latest government jobs, admit cards, results, and answer keys on Sarkari Result Hub.',
};

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() || '';

  const posts = query
    ? await prisma.jobPost.findMany({
        where: {
          status: 'PUBLISHED',
          OR: [
            { title: { contains: query } },
            { organization: { contains: query } },
            { qualification: { contains: query } },
            { shortDescription: { contains: query } },
          ],
        },
        orderBy: { createdAt: 'desc' },
      })
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f5f9] text-gray-900 selection:bg-red-700 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-2.5 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <section className="bg-white border-2 border-red-700 rounded-xl p-4 sm:p-5 shadow-xs">
          <h1 className="text-lg sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <Search className="w-5 h-5 sm:w-6 sm:h-6 text-red-700 shrink-0" />
            <span className="truncate">
              Results for: &ldquo;<span className="text-red-700">{query || 'All Notifications'}</span>&rdquo;
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Found {posts.length} matching jobs &amp; examination notifications
          </p>
        </section>

        <section className="bg-white border border-gray-300 rounded-xl shadow-xs overflow-hidden">
          <div className="divide-y divide-gray-200">
            {posts.length === 0 ? (
              <div className="p-8 sm:p-12 text-center text-gray-500">
                <p className="text-sm sm:text-base font-bold">No results found for &ldquo;{query}&rdquo;.</p>
                <p className="text-xs text-gray-400 mt-1">
                  Try searching for keywords like &ldquo;SSC&rdquo;, &ldquo;Police&rdquo;, &ldquo;Railway&rdquo;, &ldquo;UPSC&rdquo;, or &ldquo;Admit Card&rdquo;.
                </p>
              </div>
            ) : (
              posts.map((post) => (
                <article key={post.id} className="p-3 sm:p-4 hover:bg-red-50/40 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="space-y-1 flex-1 min-w-0">
                      <Link
                        href={`/post/${post.slug}`}
                        className="text-xs sm:text-base font-bold text-blue-900 hover:text-red-700 hover:underline flex items-start gap-1.5 leading-snug"
                      >
                        <ChevronRight className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <span>{post.title}</span>
                      </Link>

                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] text-gray-500 pl-5">
                        <span className="uppercase text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                          {post.category}
                        </span>
                        {post.organization && (
                          <span className="flex items-center gap-1 text-gray-700 font-medium">
                            <Building2 className="w-3.5 h-3.5 text-gray-400" />
                            <span>{post.organization}</span>
                          </span>
                        )}
                        {post.totalVacancies && (
                          <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            <Briefcase className="w-3 h-3" />
                            <span>{post.totalVacancies}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <Link
                      href={`/post/${post.slug}`}
                      className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-1 text-xs bg-red-700 hover:bg-red-800 active:scale-95 text-white font-bold py-2 px-3.5 rounded-lg shadow-xs transition text-center"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </main>

      <Footer />
      <FloatingTelegram />
    </div>
  );
}
