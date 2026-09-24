'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  CheckCircle,
  Clock,
  Send,
  Cpu,
  PlusCircle,
  ExternalLink,
  Edit,
  Loader2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface Post {
  id: string;
  title: string;
  slug: string;
  category: string;
  organization: string | null;
  status: string;
  isTelegramSent: boolean;
  viewCount: number;
  createdAt: Date | string;
}

interface Stats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  telegramSentPosts: number;
}

export default function DashboardClient({
  stats,
  recentPosts,
  settings,
}: {
  stats: Stats;
  recentPosts: Post[];
  settings: any;
}) {
  const router = useRouter();
  const [scraping, setScraping] = useState(false);
  const [scrapeMessage, setScrapeMessage] = useState<string | null>(null);
  const [broadcastingId, setBroadcastingId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleRunScraper = async (forceMock = false) => {
    setScraping(true);
    setScrapeMessage(null);
    try {
      const res = await fetch('/api/admin/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forceMock }),
      });
      const data = await res.json();
      if (data.success) {
        setScrapeMessage(`✅ ${data.message}`);
        router.refresh();
      } else {
        setScrapeMessage(`⚠️ Scraper note: ${data.message}`);
      }
    } catch {
      setScrapeMessage('Failed to trigger scraper.');
    } finally {
      setScraping(false);
    }
  };

  const handleBroadcastTelegram = async (postId: string) => {
    setBroadcastingId(postId);
    setActionNotice(null);
    try {
      const res = await fetch('/api/admin/telegram/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });
      const data = await res.json();
      if (data.success) {
        setActionNotice(`✅ Broadcast sent to Telegram successfully!`);
        router.refresh();
      } else {
        setActionNotice(`❌ Broadcast failed: ${data.error || 'Check Bot Token/Channel ID in Telegram Settings'}`);
      }
    } catch {
      setActionNotice('Network error broadcasting to Telegram.');
    } finally {
      setBroadcastingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Monitor real-time job listings, automated scrapers, and Telegram broadcasts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleRunScraper(false)}
            disabled={scraping}
            className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 text-white font-bold text-xs px-3.5 py-2 rounded-lg shadow transition"
          >
            {scraping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Cpu className="w-4 h-4" />}
            <span>{scraping ? 'Scraping in progress...' : '⚡ Run Scraper'}</span>
          </button>

          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-1.5 bg-red-700 hover:bg-red-800 text-white font-bold text-xs px-3.5 py-2 rounded-lg shadow transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Post</span>
          </Link>
        </div>
      </div>

      {/* Notifications / Alerts */}
      {scrapeMessage && (
        <div className="bg-blue-50 border border-blue-200 text-blue-900 text-xs p-3.5 rounded-lg flex items-center justify-between">
          <span>{scrapeMessage}</span>
          <button onClick={() => setScrapeMessage(null)} className="text-blue-500 font-bold ml-2">&times;</button>
        </div>
      )}

      {actionNotice && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs p-3.5 rounded-lg flex items-center justify-between">
          <span>{actionNotice}</span>
          <button onClick={() => setActionNotice(null)} className="text-amber-500 font-bold ml-2">&times;</button>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Posts */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-red-50 text-red-700 rounded-lg">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Total Posts</p>
            <p className="text-2xl font-black text-gray-900">{stats.totalPosts}</p>
          </div>
        </div>

        {/* Published */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Published</p>
            <p className="text-2xl font-black text-gray-900">{stats.publishedPosts}</p>
          </div>
        </div>

        {/* Drafts */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-700 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Drafts / In Review</p>
            <p className="text-2xl font-black text-gray-900">{stats.draftPosts}</p>
          </div>
        </div>

        {/* Telegram Broadcasts */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-sky-50 text-sky-700 rounded-lg">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Telegram Sent</p>
            <p className="text-2xl font-black text-gray-900">{stats.telegramSentPosts}</p>
          </div>
        </div>
      </div>

      {/* Scraper & Telegram Bot Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Scraper Quick Card */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-sm text-gray-800 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              <span>Auto-Scraper Status</span>
            </h2>
            <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
              Ready
            </span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Target Source: <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800 font-mono">sarkariresult.com</code>. Auto-publish is currently <b className="text-gray-900">{settings?.scraperAutoPublish ? 'Enabled' : 'Disabled'}</b>.
          </p>
          <div className="pt-2 flex items-center gap-2">
            <Link
              href="/admin/scraper"
              className="text-xs text-blue-700 hover:text-blue-900 font-bold underline"
            >
              Open Scraper Engine &raquo;
            </Link>
          </div>
        </div>

        {/* Telegram Bot Quick Card */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-sm text-gray-800 flex items-center gap-2">
              <Send className="w-4 h-4 text-sky-600" />
              <span>Telegram Channel Integration</span>
            </h2>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${settings?.telegramBotToken ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              {settings?.telegramBotToken ? 'Configured' : 'Needs Setup'}
            </span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Channel: <b className="text-gray-900">{settings?.telegramChannelId || 'Not connected yet'}</b>. Auto-broadcast is <b className="text-gray-900">{settings?.telegramAutoPublish ? 'Enabled' : 'Disabled'}</b>.
          </p>
          <div className="pt-2 flex items-center gap-2">
            <Link
              href="/admin/telegram"
              className="text-xs text-sky-700 hover:text-sky-900 font-bold underline"
            >
              Configure Telegram Bot &raquo;
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Posts Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-gray-900">
            Recent Job Posts &amp; Alerts
          </h3>
          <Link
            href="/admin/posts"
            className="text-xs font-bold text-red-700 hover:text-red-900"
          >
            View All Posts &raquo;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-100/70 text-gray-600 uppercase text-[11px] border-b border-gray-200">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Status</th>
                <th className="p-3">Telegram</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentPosts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    No posts available. Run the scraper or create one!
                  </td>
                </tr>
              ) : (
                recentPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50/70">
                    <td className="p-3 max-w-xs sm:max-w-md">
                      <div className="font-bold text-gray-900 truncate">
                        {post.title}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        {post.organization || 'Govt Board'}
                      </div>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className="capitalize bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold text-[10px]">
                        {post.category}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          post.status === 'PUBLISHED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {post.isTelegramSent ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-sky-700 font-semibold">
                          <CheckCircle className="w-3.5 h-3.5 text-sky-600" />
                          Sent
                        </span>
                      ) : (
                        <button
                          onClick={() => handleBroadcastTelegram(post.id)}
                          disabled={broadcastingId === post.id}
                          className="inline-flex items-center gap-1 text-[10px] bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold px-2 py-1 rounded transition disabled:opacity-50"
                        >
                          {broadcastingId === post.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Send className="w-3 h-3" />
                          )}
                          <span>Post to TG</span>
                        </button>
                      )}
                    </td>
                    <td className="p-3 text-right whitespace-nowrap space-x-1.5">
                      <a
                        href={`/post/${post.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center p-1.5 text-gray-600 hover:text-blue-700 rounded hover:bg-gray-100"
                        title="View Public Post"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="inline-flex items-center p-1.5 text-gray-600 hover:text-red-700 rounded hover:bg-gray-100"
                        title="Edit Post"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
