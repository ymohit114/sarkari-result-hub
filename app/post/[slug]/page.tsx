import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingTelegram from '@/components/FloatingTelegram';
import {
  Calendar,
  IndianRupee,
  Clock,
  Briefcase,
  ExternalLink,
  Download,
  Share2,
  Send,
  Building2,
  GraduationCap,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import type { Metadata, ResolvingMetadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await prisma.jobPost.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true },
  });
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.jobPost.findUnique({
    where: { slug },
  });

  if (!post) {
    return {
      title: 'Post Not Found | Sarkari Result Hub',
      description: 'The requested job posting or notification was not found.',
    };
  }

  const title = `${post.title} : Eligibility, Last Date & Online Form`;
  const description =
    post.shortDescription ||
    `${post.title}. Check important dates, application fee, age limit, qualification, vacancies, and download official notification PDF.`;

  return {
    title,
    description,
    keywords: [
      post.title,
      post.organization || 'Sarkari Naukri',
      'Sarkari Result',
      'Apply Online',
      'Admit Card',
      'Answer Key',
      'Govt Jobs 2026',
    ],
    alternates: {
      canonical: `/post/${post.slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export const revalidate = 60; // ISR

export default async function PostDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.jobPost.findUnique({
    where: { slug },
  });

  if (!post || post.status !== 'PUBLISHED') {
    notFound();
  }

  // Increment view count in background
  prisma.jobPost.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } },
  }).catch(() => {});

  const categoryLabels: Record<string, string> = {
    'latest-jobs': 'Latest Jobs',
    'admit-card': 'Admit Card',
    'results': 'Results',
    'answer-key': 'Answer Key',
    'syllabus': 'Syllabus',
    'admission': 'Admission',
  };

  const categoryName = categoryLabels[post.category] || 'Job Alert';
  const categoryHref = `/${post.category === 'latest-jobs' ? 'jobs' : post.category}`;

  // JSON-LD structured data for Google Jobs
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: post.title,
    description: post.shortDescription || post.title,
    datePosted: post.createdAt.toISOString(),
    validThrough: post.lastDateApply ? `${post.lastDateApply}T23:59:59Z` : undefined,
    employmentType: 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: post.organization || 'Government of India',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'IN',
      },
    },
  };

  // Primary action button text
  const primaryActionLabel =
    post.category === 'admit-card'
      ? 'Download Admit Card / Hall Ticket'
      : post.category === 'results'
      ? 'Download Result / Merit List'
      : post.category === 'answer-key'
      ? 'Download Answer Key / Response Sheet'
      : post.category === 'syllabus'
      ? 'Download Official Syllabus PDF'
      : post.category === 'admission'
      ? 'Apply Online (Admission Portal)'
      : 'Apply Online (Direct Registration / Portal)';

  const primaryTargetUrl = post.applyOnlineUrl || post.officialWebsiteUrl || '#';

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f5f9] text-gray-900 selection:bg-red-700 selection:text-white pb-16 sm:pb-0">
      {/* Google Structured Data Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-2.5 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-xs overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-red-700 shrink-0 font-medium">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <Link href={categoryHref} className="hover:text-red-700 shrink-0 font-medium">{categoryName}</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="text-gray-900 font-bold truncate">{post.title}</span>
        </nav>

        {/* Main Post Container */}
        <article className="bg-white border-2 border-red-700 rounded-xl shadow-sm overflow-hidden">
          {/* Header Banner */}
          <header className="bg-gradient-to-r from-red-800 to-red-700 text-white p-3.5 sm:p-6 text-center space-y-2">
            <h1 className="text-base sm:text-2xl md:text-3xl font-black uppercase tracking-wide leading-snug">
              {post.title}
            </h1>
            {post.organization && (
              <p className="text-xs sm:text-base text-yellow-300 font-bold flex items-center justify-center gap-1.5">
                <Building2 className="w-4 h-4 shrink-0" />
                <span>{post.organization}</span>
              </p>
            )}
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 text-[11px] sm:text-xs text-red-100 pt-2 border-t border-red-600/70">
              <span>Post Date: <b>{new Date(post.postDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</b></span>
              {post.totalVacancies && (
                <span>Total Vacancy: <b className="text-yellow-300">{post.totalVacancies}</b></span>
              )}
            </div>
          </header>

          {/* Social Share & Quick Notification Bar */}
          <div className="bg-sky-50 border-b border-sky-100 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            <span className="font-extrabold text-sky-950 text-center sm:text-left">
              ⚡ Share this recruitment with your study groups:
            </span>
            <div className="grid grid-cols-2 sm:flex items-center gap-2">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${post.title}: https://sarkariresulthub.com/post/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition shadow-xs text-center"
              >
                <span>WhatsApp</span>
              </a>
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(`https://sarkariresulthub.com/post/${post.slug}`)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition shadow-xs text-center"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram</span>
              </a>
            </div>
          </div>

          <div className="p-3.5 sm:p-6 space-y-5">
            {/* Short Information */}
            {post.shortDescription && (
              <div className="bg-amber-50/70 border-l-4 border-amber-500 p-3 sm:p-4 rounded-r-lg text-xs sm:text-sm text-gray-800 leading-relaxed">
                <span className="font-black text-red-700 uppercase">Short Information: </span>
                {post.shortDescription}
              </div>
            )}

            {/* DUAL TABLE: Important Dates & Application Fee (RESPONSIVE STACK ON MOBILE) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
              {/* Important Dates Table */}
              <div className="border-2 border-emerald-600 rounded-xl overflow-hidden shadow-xs">
                <div className="bg-emerald-700 text-white font-black text-center py-2 px-3 text-xs sm:text-sm uppercase flex items-center justify-center gap-1.5">
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>Important Dates</span>
                </div>
                <div className="p-3 text-xs sm:text-sm space-y-2.5 bg-white">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-1.5">
                    <span className="text-gray-600">Application Begin:</span>
                    <span className="font-bold text-gray-900">{post.applicationBegin || 'Started'}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-1.5">
                    <span className="text-red-700 font-bold">Last Date for Apply:</span>
                    <span className="font-black text-red-700">{post.lastDateApply || 'Check Notification'}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-1.5">
                    <span className="text-gray-600">Last Date Pay Fee:</span>
                    <span className="font-bold text-gray-900">{post.lastDateFee || post.lastDateApply || 'Check Notification'}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-1.5">
                    <span className="text-gray-600">Exam Date:</span>
                    <span className="font-bold text-blue-800">{post.examDate || 'Notify Soon'}</span>
                  </div>
                  <div className="flex justify-between items-center pt-0.5">
                    <span className="text-gray-600">Admit Card:</span>
                    <span className="font-bold text-emerald-700">{post.admitCardDate || 'Before Exam'}</span>
                  </div>
                </div>
              </div>

              {/* Application Fee Table */}
              <div className="border-2 border-blue-600 rounded-xl overflow-hidden shadow-xs">
                <div className="bg-blue-700 text-white font-black text-center py-2 px-3 text-xs sm:text-sm uppercase flex items-center justify-center gap-1.5">
                  <IndianRupee className="w-4 h-4 shrink-0" />
                  <span>Application Fee</span>
                </div>
                <div className="p-3 text-xs sm:text-sm space-y-2.5 bg-white">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-1.5">
                    <span className="text-gray-600">General / OBC / EWS:</span>
                    <span className="font-bold text-gray-900">{post.feeGeneral || '₹ 100/-'}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-1.5">
                    <span className="text-gray-600">SC / ST / PH:</span>
                    <span className="font-bold text-gray-900">{post.feeScStPh || '₹ 0/- (Nil)'}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-1.5">
                    <span className="text-gray-600">All Female:</span>
                    <span className="font-bold text-gray-900">{post.feeFemale || '₹ 0/- (Exempted)'}</span>
                  </div>
                  <div className="pt-1 text-[11px] text-gray-600">
                    <span className="font-semibold text-gray-800">Payment: </span>
                    {post.feePaymentMode || 'Online Debit / Credit Card, Net Banking, UPI'}
                  </div>
                </div>
              </div>
            </div>

            {/* AGE LIMIT TABLE */}
            <div className="border-2 border-purple-600 rounded-xl overflow-hidden shadow-xs">
              <div className="bg-purple-700 text-white font-black text-center py-2 px-3 text-xs sm:text-sm uppercase flex items-center justify-center gap-1.5">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Age Limit Details</span>
              </div>
              <div className="p-3 text-xs sm:text-sm space-y-2 bg-purple-50/30">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <div className="flex justify-between border-b border-purple-200/70 pb-1">
                    <span className="text-gray-700">Minimum Age:</span>
                    <span className="font-bold text-gray-900">{post.ageMin || '18 Years'}</span>
                  </div>
                  <div className="flex justify-between border-b border-purple-200/70 pb-1">
                    <span className="text-gray-700">Maximum Age:</span>
                    <span className="font-bold text-gray-900">{post.ageMax || '30-33 Years'}</span>
                  </div>
                </div>
                <p className="text-[11px] text-purple-900 font-medium">
                  {post.ageDetails || '• Age Relaxation Extra as per Official Recruitment Rules.'}
                </p>
              </div>
            </div>

            {/* VACANCY & ELIGIBILITY TABLE */}
            <div className="border-2 border-amber-600 rounded-xl overflow-hidden shadow-xs">
              <div className="bg-amber-600 text-white font-black text-center py-2 px-3 text-xs sm:text-sm uppercase flex items-center justify-center gap-1.5">
                <GraduationCap className="w-4 h-4 shrink-0" />
                <span>Vacancy Details &amp; Eligibility Criteria</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-amber-100/70 text-amber-900 font-bold uppercase text-[11px] border-b border-amber-300">
                    <tr>
                      <th className="p-2.5 sm:p-3">Post Title</th>
                      <th className="p-2.5 sm:p-3">Total Post</th>
                      <th className="p-2.5 sm:p-3">Eligibility Requirement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    <tr>
                      <td className="p-2.5 sm:p-3 font-bold text-blue-900 max-w-[200px]">
                        {post.title}
                      </td>
                      <td className="p-2.5 sm:p-3 font-black text-red-700 whitespace-nowrap">
                        {post.totalVacancies || 'Various Posts'}
                      </td>
                      <td className="p-2.5 sm:p-3 text-gray-800 leading-relaxed">
                        {post.qualification || 'Check Official Notification PDF for educational qualifications and stream requirements.'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* HOW TO APPLY INSTRUCTIONS */}
            <div className="bg-gray-50 border border-gray-300 rounded-xl p-3.5 sm:p-4 text-xs sm:text-sm space-y-2">
              <h3 className="font-black text-gray-900 uppercase tracking-wide">
                Instructions for Online Submission:
              </h3>
              <ul className="list-disc pl-4 sm:pl-5 space-y-1 text-gray-700 leading-relaxed text-[11px] sm:text-xs">
                <li>Candidates can apply online through the official portal before the deadline ({post.lastDateApply || 'Closing Date'}).</li>
                <li>Carefully read the official notification PDF before submitting the form.</li>
                <li>Prepare scanned copies of photograph, signature, and educational marksheets.</li>
                <li>Always preview the filled application form and verify all details before payment.</li>
                <li>Keep a printed copy and save the application number for admit card download.</li>
              </ul>
            </div>

            {/* IMPORTANT LINKS TABLE (RESPONSIVE TOUCH-FRIENDLY BUTTONS) */}
            <div className="border-4 border-red-700 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-red-700 to-red-800 text-white font-black text-center py-2.5 px-3 text-sm sm:text-lg uppercase tracking-wider">
                ⚡ Some Useful Important Links ⚡
              </div>
              <div className="divide-y divide-gray-200 bg-white text-xs sm:text-sm">
                {/* Direct Action Link (Category Adaptive) */}
                <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-red-50/50 transition">
                  <div>
                    <span className="font-black text-gray-900 block text-xs sm:text-sm">
                      {primaryActionLabel}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Direct Official Portal Link (No middleman redirects)</span>
                    </span>
                  </div>
                  <a
                    href={primaryTargetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-red-700 hover:bg-red-800 active:scale-95 text-white font-black px-6 py-2.5 rounded-lg shadow transition text-center text-xs sm:text-sm shrink-0"
                  >
                    <span>Click Here</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Download Official Notification */}
                <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-blue-50/50 transition">
                  <span className="font-extrabold text-gray-900 text-xs sm:text-sm">
                    Download Official Notification PDF
                  </span>
                  <a
                    href={post.notificationPdfUrl || primaryTargetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-blue-700 hover:bg-blue-800 active:scale-95 text-white font-black px-6 py-2.5 rounded-lg shadow transition text-center text-xs sm:text-sm shrink-0"
                  >
                    <span>Download PDF</span>
                    <Download className="w-4 h-4" />
                  </a>
                </div>

                {/* Official Website */}
                <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-emerald-50/50 transition">
                  <span className="font-extrabold text-gray-900 text-xs sm:text-sm">
                    Official Department Website
                  </span>
                  <a
                    href={post.officialWebsiteUrl || 'https://ssc.gov.in'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-black px-6 py-2.5 rounded-lg shadow transition text-center text-xs sm:text-sm shrink-0"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Join Telegram Channel */}
                <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-sky-50">
                  <div>
                    <span className="font-black text-sky-950 block text-xs sm:text-sm">
                      Join Sarkari Result Telegram Channel
                    </span>
                    <span className="text-[11px] text-sky-700">
                      Get instantaneous alerts on your smartphone
                    </span>
                  </div>
                  <a
                    href="https://t.me"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-black px-6 py-2.5 rounded-lg shadow transition text-center text-xs sm:text-sm shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    <span>Join Channel</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>

      {/* Sticky Bottom Action Bar for Mobile Screens */}
      <aside className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-2.5 shadow-2xl flex items-center justify-between gap-2 backdrop-blur-md bg-white/95">
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-[11px] font-black text-gray-900 truncate">
            {post.title}
          </p>
          <p className="text-[10px] text-emerald-700 font-bold truncate">
            ⚡ Direct Official Link
          </p>
        </div>
        <a
          href={primaryTargetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 bg-red-700 hover:bg-red-800 text-white font-black text-xs px-4 py-2 rounded-lg shadow transition shrink-0"
        >
          <span>Apply Online</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </aside>

      <Footer />
      <FloatingTelegram />
    </div>
  );
}
