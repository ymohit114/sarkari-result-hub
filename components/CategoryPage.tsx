import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingTelegram from '@/components/FloatingTelegram';
import { ChevronRight, Calendar, Building2, Briefcase, ExternalLink } from 'lucide-react';

interface CategoryPageProps {
  title: string;
  subtitle: string;
  category: string;
  posts: Array<{
    id: string;
    title: string;
    slug: string;
    organization: string | null;
    totalVacancies: string | null;
    lastDateApply: string | null;
    postDate: Date;
  }>;
}

export default function CategoryPage({ title, subtitle, category, posts }: CategoryPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f1f5f9] text-gray-900 selection:bg-red-700 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-2.5 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Category Header */}
        <section className="bg-white border-2 border-red-700 rounded-xl p-4 sm:p-6 shadow-xs text-center space-y-1">
          <h1 className="text-xl sm:text-3xl font-black text-red-800 tracking-wide uppercase leading-tight">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </section>

        {/* Posts List */}
        <section className="bg-white border border-gray-300 rounded-xl shadow-xs overflow-hidden">
          <div className="bg-slate-800 text-white font-bold text-xs sm:text-sm px-4 py-2.5 uppercase tracking-wide flex items-center justify-between">
            <span>All Updates &amp; Notifications ({posts.length})</span>
            <span className="text-[11px] text-amber-400 font-semibold">100% Verified</span>
          </div>

          <div className="divide-y divide-gray-200">
            {posts.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-xs sm:text-sm">
                No active notifications found in this category right now.
              </div>
            ) : (
              posts.map((post) => (
                <article key={post.id} className="p-3 sm:p-4 hover:bg-red-50/40 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <Link
                        href={`/post/${post.slug}`}
                        className="text-xs sm:text-base font-bold text-blue-900 hover:text-red-700 hover:underline flex items-start gap-1.5 leading-snug"
                      >
                        <ChevronRight className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <span>{post.title}</span>
                      </Link>

                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] text-gray-500 pl-5">
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
                        {post.lastDateApply && (
                          <span className="flex items-center gap-1 text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                            <Calendar className="w-3 h-3" />
                            <span>Last Date: {post.lastDateApply}</span>
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
