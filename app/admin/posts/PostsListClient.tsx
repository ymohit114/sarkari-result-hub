'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  PlusCircle,
  Search,
  Filter,
  Trash2,
  Edit,
  ExternalLink,
  Send,
  CheckCircle,
  Loader2,
} from 'lucide-react';

export default function PostsListClient({ initialPosts }: { initialPosts: any[] }) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [broadcastingId, setBroadcastingId] = useState<string | null>(null);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      (post.organization && post.organization.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert('Failed to delete post');
      }
    } catch {
      alert('Error deleting post');
    } finally {
      setDeletingId(null);
    }
  };

  const handleBroadcast = async (postId: string) => {
    setBroadcastingId(postId);
    try {
      const res = await fetch('/api/admin/telegram/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Broadcast sent to Telegram successfully!');
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, isTelegramSent: true } : p))
        );
      } else {
        alert(`Broadcast note: ${data.error || 'Failed to send'}`);
      }
    } catch {
      alert('Network error broadcasting to Telegram.');
    } finally {
      setBroadcastingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">
            Manage All Posts &amp; Notifications ({filteredPosts.length})
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Search, edit, delete, or broadcast any recruitment notification.
          </p>
        </div>

        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-1.5 bg-red-700 hover:bg-red-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Post</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <input
            type="text"
            placeholder="Search by title or organization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-xs border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
        >
          <option value="all">All Categories</option>
          <option value="latest-jobs">Latest Jobs</option>
          <option value="admit-card">Admit Card</option>
          <option value="results">Results</option>
          <option value="answer-key">Answer Key</option>
          <option value="syllabus">Syllabus</option>
          <option value="admission">Admission</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-100 text-gray-600 uppercase text-[11px] border-b border-gray-200">
              <tr>
                <th className="p-3">Title &amp; Dept</th>
                <th className="p-3">Category</th>
                <th className="p-3">Vacancies</th>
                <th className="p-3">Status</th>
                <th className="p-3">Telegram</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No matching posts found.
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50/70">
                    <td className="p-3 max-w-sm">
                      <div className="font-bold text-gray-900 line-clamp-1">
                        {post.title}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        {post.organization || 'Govt Department'}
                      </div>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className="capitalize bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold text-[10px]">
                        {post.category}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap text-gray-700 font-semibold">
                      {post.totalVacancies || '—'}
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
                          onClick={() => handleBroadcast(post.id)}
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
                    <td className="p-3 text-right whitespace-nowrap space-x-1">
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
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        disabled={deletingId === post.id}
                        className="inline-flex items-center p-1.5 text-gray-600 hover:text-red-600 rounded hover:bg-red-50 disabled:opacity-50"
                        title="Delete Post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
