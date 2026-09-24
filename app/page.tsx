import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import MarqueeAlerts from '@/components/MarqueeAlerts';
import Footer from '@/components/Footer';
import FloatingTelegram from '@/components/FloatingTelegram';
import {
  ExternalLink,
  Calendar,
  Briefcase,
  Award,
  FileText,
  Key,
  BookOpen,
  GraduationCap,
  ChevronRight,
  Sparkles,
  Search,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sarkari Result : SarkariResult.com Latest Jobs, Admit Card, Results 2026',
  description: 'Sarkari Result, Sarkari Results : SarkariResult.Com provides you all the latest official Sarkari Result, Online Forms, Admit Card, Answer Key, Syllabus & Sarkari Naukri jobs in India.',
  keywords: [
    'Sarkari Result',
    'Sarkari Results',
    'Sarkari Result 2026',
    'Sarkari Naukri',
    'Latest Jobs',
    'Admit Card',
    'Results',
    'Answer Key',
    'Syllabus',
    'Online Form',
  ],
  openGraph: {
    title: 'Sarkari Result : Latest Government Jobs, Admit Card & Results 2026',
    description: 'Find all latest government jobs, admit cards, exam results, answer keys, and syllabi on Sarkari Result Hub.',
    type: 'website',
  },
};

export const revalidate = 60; // ISR: Revalidate every 60 seconds

export default async function HomePage() {
  // Fetch latest posts across categories
  const [latestJobs, admitCards, results, answerKeys, syllabi, admissions, breakingAlerts] = await Promise.all([
    prisma.jobPost.findMany({
      where: { category: 'latest-jobs', status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      take: 12,
    }),
    prisma.jobPost.findMany({
      where: { category: 'admit-card', status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      take: 12,
    }),
    prisma.jobPost.findMany({
      where: { category: 'results', status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      take: 12,
    }),
    prisma.jobPost.findMany({
      where: { category: 'answer-key', status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    prisma.jobPost.findMany({
      where: { category: 'syllabus', status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    prisma.jobPost.findMany({
      where: { category: 'admission', status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    prisma.jobPost.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      take: 8,
      select: { id: true, title: true, slug: true, category: true },
    }),
  ]);

  // Featured highlights (top 6 latest items for colorful top boxes)
  const topHighlights = breakingAlerts.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f5f9] text-gray-900 antialiased selection:bg-red-700 selection:text-white">
      <Navbar />
      <MarqueeAlerts alerts={breakingAlerts} />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2.5 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Welcome Announcement Card */}
        <section className="bg-white border-2 border-red-700 rounded-xl p-3.5 sm:p-5 shadow-xs text-center space-y-2">
          <h1 className="text-lg sm:text-2xl font-black text-red-800 tracking-wide uppercase leading-tight">
            SARKARI RESULT : SARKARI RESULTS 2026
          </h1>
          <p className="text-xs sm:text-sm text-gray-700 font-medium max-w-3xl mx-auto leading-relaxed">
            India&apos;s No. 1 Job Alert Portal. Instant online application forms, admit cards, exam results, official answer keys, and syllabi across Central &amp; State Governments.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-1 text-[11px] sm:text-xs">
            <span className="bg-red-50 text-red-700 font-bold px-2 py-0.5 rounded border border-red-200">
              ⚡ 100% Direct Official Links
            </span>
            <span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded border border-blue-200">
              🔔 Instant Telegram Alerts
            </span>
            <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
              ⏱️ Auto-Updated Every 4 Hours
            </span>
          </div>
        </section>

        {/* Top Highlight Tiles (Classic Colored Sarkari Result Tiles) */}
        {topHighlights.length > 0 && (
          <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
            {topHighlights.map((item, index) => {
              const bgColors = [
                'bg-rose-700 hover:bg-rose-800',
                'bg-blue-700 hover:bg-blue-800',
                'bg-amber-600 hover:bg-amber-700',
                'bg-emerald-700 hover:bg-emerald-800',
                'bg-purple-700 hover:bg-purple-800',
                'bg-cyan-700 hover:bg-cyan-800',
              ];
              const colorClass = bgColors[index % bgColors.length];

              return (
                <Link
                  key={item.id}
                  href={`/post/${item.slug}`}
                  className={`${colorClass} text-white p-2.5 sm:p-3 rounded-lg shadow-xs transition-all transform active:scale-98 hover:-translate-y-0.5 text-center flex flex-col justify-center min-h-[62px] sm:min-h-[75px]`}
                >
                  <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wide line-clamp-3 leading-snug">
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </section>
        )}

        {/* PRIMARY 3-COLUMN SARKARI RESULT GRID (STACKS ON MOBILE, 3-COLS ON DESKTOP) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
          {/* Column 1: Result */}
          <div className="bg-white border-2 border-amber-500 rounded-xl shadow-xs flex flex-col overflow-hidden">
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white font-black text-center py-2.5 px-3 text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span>Result</span>
            </div>
            <div className="p-2 sm:p-3 flex-1 divide-y divide-gray-100">
              {results.length === 0 ? (
                <p className="text-xs text-gray-500 py-6 text-center">No results published right now.</p>
              ) : (
                results.map((post) => (
                  <div key={post.id} className="py-2 px-1 hover:bg-amber-50/50 rounded transition">
                    <Link
                      href={`/post/${post.slug}`}
                      className="text-xs sm:text-[13px] font-semibold text-blue-900 hover:text-red-700 hover:underline flex items-start gap-1.5 leading-snug active:text-red-800"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{post.title}</span>
                    </Link>
                  </div>
                ))
              )}
            </div>
            <div className="bg-amber-50 p-2.5 text-center border-t border-amber-200">
              <Link
                href="/results"
                className="text-xs font-bold text-amber-900 hover:text-amber-950 uppercase tracking-wide hover:underline inline-flex items-center gap-1"
              >
                View More Results &raquo;
              </Link>
            </div>
          </div>

          {/* Column 2: Admit Card */}
          <div className="bg-white border-2 border-blue-600 rounded-xl shadow-xs flex flex-col overflow-hidden">
            <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white font-black text-center py-2.5 px-3 text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span>Admit Card</span>
            </div>
            <div className="p-2 sm:p-3 flex-1 divide-y divide-gray-100">
              {admitCards.length === 0 ? (
                <p className="text-xs text-gray-500 py-6 text-center">No admit cards published right now.</p>
              ) : (
                admitCards.map((post) => (
                  <div key={post.id} className="py-2 px-1 hover:bg-blue-50/50 rounded transition">
                    <Link
                      href={`/post/${post.slug}`}
                      className="text-xs sm:text-[13px] font-semibold text-blue-900 hover:text-red-700 hover:underline flex items-start gap-1.5 leading-snug active:text-red-800"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{post.title}</span>
                    </Link>
                  </div>
                ))
              )}
            </div>
            <div className="bg-blue-50 p-2.5 text-center border-t border-blue-200">
              <Link
                href="/admit-card"
                className="text-xs font-bold text-blue-900 hover:text-blue-950 uppercase tracking-wide hover:underline inline-flex items-center gap-1"
              >
                View More Admit Cards &raquo;
              </Link>
            </div>
          </div>

          {/* Column 3: Latest Jobs */}
          <div className="bg-white border-2 border-red-700 rounded-xl shadow-xs flex flex-col overflow-hidden">
            <div className="bg-gradient-to-r from-red-700 to-red-800 text-white font-black text-center py-2.5 px-3 text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs">
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span>Latest Jobs</span>
            </div>
            <div className="p-2 sm:p-3 flex-1 divide-y divide-gray-100">
              {latestJobs.length === 0 ? (
                <p className="text-xs text-gray-500 py-6 text-center">No latest jobs published right now.</p>
              ) : (
                latestJobs.map((post) => (
                  <div key={post.id} className="py-2 px-1 hover:bg-red-50/50 rounded transition">
                    <Link
                      href={`/post/${post.slug}`}
                      className="text-xs sm:text-[13px] font-semibold text-blue-900 hover:text-red-700 hover:underline flex items-start gap-1.5 leading-snug active:text-red-800"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span>{post.title}</span>
                        {post.lastDateApply && (
                          <span className="block text-[11px] text-gray-500 font-normal mt-0.5">
                            Last Date: <span className="font-bold text-red-600">{post.lastDateApply}</span>
                          </span>
                        )}
                      </div>
                    </Link>
                  </div>
                ))
              )}
            </div>
            <div className="bg-red-50 p-2.5 text-center border-t border-red-200">
              <Link
                href="/jobs"
                className="text-xs font-bold text-red-900 hover:text-red-950 uppercase tracking-wide hover:underline inline-flex items-center gap-1"
              >
                View More Latest Jobs &raquo;
              </Link>
            </div>
          </div>
        </section>

        {/* SECONDARY 3-COLUMN GRID */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
          {/* Column 1: Answer Key */}
          <div className="bg-white border border-gray-300 rounded-xl shadow-xs flex flex-col overflow-hidden">
            <div className="bg-slate-800 text-white font-bold text-center py-2 px-3 text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-1.5">
              <Key className="w-4 h-4" />
              <span>Answer Key</span>
            </div>
            <div className="p-2 sm:p-3 flex-1 divide-y divide-gray-100">
              {answerKeys.length === 0 ? (
                <p className="text-xs text-gray-500 py-4 text-center">No answer keys posted yet.</p>
              ) : (
                answerKeys.map((post) => (
                  <div key={post.id} className="py-2 px-1 hover:bg-gray-50 rounded">
                    <Link
                      href={`/post/${post.slug}`}
                      className="text-xs font-semibold text-blue-900 hover:text-red-700 hover:underline flex items-start gap-1.5 leading-snug"
                    >
                      <ChevronRight className="w-3 h-3 text-gray-500 shrink-0 mt-0.5" />
                      <span>{post.title}</span>
                    </Link>
                  </div>
                ))
              )}
            </div>
            <div className="bg-gray-50 p-2 text-center border-t border-gray-200">
              <Link href="/answer-key" className="text-xs font-semibold text-gray-700 hover:underline">
                View All Answer Keys &raquo;
              </Link>
            </div>
          </div>

          {/* Column 2: Syllabus */}
          <div className="bg-white border border-gray-300 rounded-xl shadow-xs flex flex-col overflow-hidden">
            <div className="bg-teal-700 text-white font-bold text-center py-2 px-3 text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Syllabus</span>
            </div>
            <div className="p-2 sm:p-3 flex-1 divide-y divide-gray-100">
              {syllabi.length === 0 ? (
                <p className="text-xs text-gray-500 py-4 text-center">No syllabi posted yet.</p>
              ) : (
                syllabi.map((post) => (
                  <div key={post.id} className="py-2 px-1 hover:bg-teal-50 rounded">
                    <Link
                      href={`/post/${post.slug}`}
                      className="text-xs font-semibold text-blue-900 hover:text-red-700 hover:underline flex items-start gap-1.5 leading-snug"
                    >
                      <ChevronRight className="w-3 h-3 text-teal-600 shrink-0 mt-0.5" />
                      <span>{post.title}</span>
                    </Link>
                  </div>
                ))
              )}
            </div>
            <div className="bg-teal-50 p-2 text-center border-t border-teal-200">
              <Link href="/syllabus" className="text-xs font-semibold text-teal-800 hover:underline">
                View All Syllabi &raquo;
              </Link>
            </div>
          </div>

          {/* Column 3: Admission */}
          <div className="bg-white border border-gray-300 rounded-xl shadow-xs flex flex-col overflow-hidden">
            <div className="bg-indigo-700 text-white font-bold text-center py-2 px-3 text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              <span>Admission</span>
            </div>
            <div className="p-2 sm:p-3 flex-1 divide-y divide-gray-100">
              {admissions.length === 0 ? (
                <p className="text-xs text-gray-500 py-4 text-center">No admissions posted yet.</p>
              ) : (
                admissions.map((post) => (
                  <div key={post.id} className="py-2 px-1 hover:bg-indigo-50 rounded">
                    <Link
                      href={`/post/${post.slug}`}
                      className="text-xs font-semibold text-blue-900 hover:text-red-700 hover:underline flex items-start gap-1.5 leading-snug"
                    >
                      <ChevronRight className="w-3 h-3 text-indigo-600 shrink-0 mt-0.5" />
                      <span>{post.title}</span>
                    </Link>
                  </div>
                ))
              )}
            </div>
            <div className="bg-indigo-50 p-2 text-center border-t border-indigo-200">
              <Link href="/admission" className="text-xs font-semibold text-indigo-800 hover:underline">
                View All Admissions &raquo;
              </Link>
            </div>
          </div>
        </section>

        {/* SEO Information Content Section */}
        <section className="bg-white border border-gray-200 rounded-xl p-3.5 sm:p-5 text-xs sm:text-sm text-gray-600 leading-relaxed space-y-2.5">
          <h2 className="text-sm sm:text-base font-bold text-gray-900">
            About Sarkari Result Hub - Free Government Job Portal
          </h2>
          <p>
            Sarkari Result Hub provides real-time notifications for all government recruitment exams in India, including SSC (Staff Selection Commission), UPSC (Union Public Service Commission), Railway Recruitment Board (RRB NTPC, Group D), Banking (IBPS, SBI PO, Clerk), Defense (Army, Navy, Air Force), Police Bharti, Teaching (TET, CTET, Super TET), State Public Service Commissions (UPPSC, BPSC, MPPSC, RPSC, etc.), and National Testing Agency (NTA NEET, JEE Main, UGC NET).
          </p>
          <p>
            All candidates can check eligibility requirements, age restrictions, application fees, vacancy breakdown by category (General, OBC, EWS, SC, ST), official syllabus PDF, exam date schedule, and direct application links right here. Join our official Telegram channel to receive instant push alerts whenever a new job, admit card, or result is published.
          </p>
        </section>
      </main>

      <Footer />
      <FloatingTelegram />
    </div>
  );
}
