'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Search, Building2, Briefcase } from 'lucide-react';

interface JobSummary {
  id: string;
  title: string;
  slug: string;
  category: string;
  organization: string | null;
  totalVacancies: string | null;
  qualification: string | null;
  shortDescription: string | null;
}

function SearchResultsContent({ posts }: { posts: JobSummary[] }) {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.trim() || '';

  const filteredPosts = useMemo(() => {
    if (!query) return posts;
    const lower = query.toLowerCase();
    return posts.filter((p) => {
      return (
        p.title.toLowerCase().includes(lower) ||
        (p.organization && p.organization.toLowerCase().includes(lower)) ||
        (p.qualification && p.qualification.toLowerCase().includes(lower)) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(lower)) ||
        p.category.toLowerCase().includes(lower)
      );
    });
  }, [posts, query]);

  return (
    <>
      <section className="bg-white border-2 border-red-700 rounded-xl p-4 sm:p-5 shadow-xs">
        <h1 className="text-lg sm:text-2xl font-black text-gray-900 flex items-center gap-2">
          <Search className="w-5 h-5 sm:w-6 sm:h-6 text-red-700 shrink-0" />
          <span className="truncate">
            Results for: &ldquo;<span className="text-red-700">{query || 'All Notifications'}</span>&rdquo;
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Found {filteredPosts.length} matching jobs &amp; examination notifications
        </p>
      </section>

      <section className="bg-white border border-gray-300 rounded-xl shadow-xs overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredPosts.length === 0 ? (
            <div className="p-8 sm:p-12 text-center text-gray-500">
              <p className="text-sm sm:text-base font-bold">No results found for &ldquo;{query}&rdquo;.</p>
              <p className="text-xs text-gray-400 mt-1">
                Try searching for keywords like &ldquo;SSC&rdquo;, &ldquo;Police&rdquo;, &ldquo;Railway&rdquo;, &ldquo;UPSC&rdquo;, or &ldquo;Admit Card&rdquo;.
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => (
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
    </>
  );
}

export default function SearchClient({ posts }: { posts: JobSummary[] }) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading search results...</div>}>
      <SearchResultsContent posts={posts} />
    </Suspense>
  );
}
