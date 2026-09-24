'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Save,
  ArrowLeft,
  Calendar,
  IndianRupee,
  Clock,
  Briefcase,
  Link2,
  Send,
  Loader2,
  AlertCircle,
  ExternalLink,
  CheckCircle,
} from 'lucide-react';

export default function EditPostClient({ initialPost }: { initialPost: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: initialPost.title || '',
    category: initialPost.category || 'latest-jobs',
    organization: initialPost.organization || '',
    shortDescription: initialPost.shortDescription || '',
    totalVacancies: initialPost.totalVacancies || '',
    qualification: initialPost.qualification || '',
    applicationBegin: initialPost.applicationBegin || '',
    lastDateApply: initialPost.lastDateApply || '',
    lastDateFee: initialPost.lastDateFee || '',
    examDate: initialPost.examDate || '',
    admitCardDate: initialPost.admitCardDate || '',
    feeGeneral: initialPost.feeGeneral || '',
    feeScStPh: initialPost.feeScStPh || '',
    feeFemale: initialPost.feeFemale || '',
    feePaymentMode: initialPost.feePaymentMode || '',
    ageMin: initialPost.ageMin || '',
    ageMax: initialPost.ageMax || '',
    ageDetails: initialPost.ageDetails || '',
    applyOnlineUrl: initialPost.applyOnlineUrl || '',
    notificationPdfUrl: initialPost.notificationPdfUrl || '',
    officialWebsiteUrl: initialPost.officialWebsiteUrl || '',
    status: initialPost.status || 'PUBLISHED',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/admin/posts/${initialPost.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess('Post updated successfully!');
        router.refresh();
      } else {
        setError(data.message || 'Failed to update post');
      }
    } catch {
      setError('Network failure updating post');
    } finally {
      setLoading(false);
    }
  };

  const handleBroadcast = async () => {
    setBroadcasting(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/telegram/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: initialPost.id }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess('Successfully broadcasted to Telegram!');
        router.refresh();
      } else {
        setError(`Telegram error: ${data.error || 'Failed to send'}`);
      }
    } catch {
      setError('Network failure broadcasting to Telegram');
    } finally {
      setBroadcasting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-red-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Posts</span>
        </Link>
        <div className="flex items-center gap-2">
          <a
            href={`/post/${initialPost.slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-700 font-bold hover:underline"
          >
            <span>View Live Post</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
        <div className="border-b border-gray-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-black text-gray-900">
              Edit Recruitment / Notification
            </h1>
            <p className="text-xs text-gray-500 mt-1">Slug: <code className="font-mono text-red-700">{initialPost.slug}</code></p>
          </div>

          <button
            type="button"
            onClick={handleBroadcast}
            disabled={broadcasting}
            className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 text-white font-bold text-xs px-3.5 py-2 rounded-lg shadow transition"
          >
            {broadcasting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>{broadcasting ? 'Sending...' : 'Send to Telegram Now'}</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        {/* Basic Details */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
            1. Basic Job Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Post Title *
              </label>
              <input
                type="text"
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
              >
                <option value="latest-jobs">Latest Jobs</option>
                <option value="admit-card">Admit Card</option>
                <option value="results">Results</option>
                <option value="answer-key">Answer Key</option>
                <option value="syllabus">Syllabus</option>
                <option value="admission">Admission</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Organization / Department
              </label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Total Vacancies
              </label>
              <input
                type="text"
                name="totalVacancies"
                value={formData.totalVacancies}
                onChange={handleChange}
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Short Description / Summary
            </label>
            <textarea
              rows={3}
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Dates & Fees */}
        <div className="pt-4 border-t border-gray-100 space-y-4">
          <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>2. Important Dates &amp; Application Fee</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Application Begin
              </label>
              <input
                type="text"
                name="applicationBegin"
                value={formData.applicationBegin}
                onChange={handleChange}
                className="w-full text-xs p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-red-600 mb-1">
                Last Date for Apply
              </label>
              <input
                type="text"
                name="lastDateApply"
                value={formData.lastDateApply}
                onChange={handleChange}
                className="w-full text-xs p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Exam Date
              </label>
              <input
                type="text"
                name="examDate"
                value={formData.examDate}
                onChange={handleChange}
                className="w-full text-xs p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                General / OBC Fee
              </label>
              <input
                type="text"
                name="feeGeneral"
                value={formData.feeGeneral}
                onChange={handleChange}
                className="w-full text-xs p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                SC / ST / PH Fee
              </label>
              <input
                type="text"
                name="feeScStPh"
                value={formData.feeScStPh}
                onChange={handleChange}
                className="w-full text-xs p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Female Fee
              </label>
              <input
                type="text"
                name="feeFemale"
                value={formData.feeFemale}
                onChange={handleChange}
                className="w-full text-xs p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Age & Qualification */}
        <div className="pt-4 border-t border-gray-100 space-y-4">
          <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-purple-600" />
            <span>3. Age Limits &amp; Eligibility Criteria</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Age Limits (Min - Max)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="ageMin"
                  value={formData.ageMin}
                  onChange={handleChange}
                  placeholder="Min"
                  className="w-full text-xs p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  name="ageMax"
                  value={formData.ageMax}
                  onChange={handleChange}
                  placeholder="Max"
                  className="w-full text-xs p-2 border border-gray-300 rounded"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Eligibility &amp; Qualification
              </label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                className="w-full text-xs p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="pt-4 border-t border-gray-100 space-y-4">
          <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
            <Link2 className="w-4 h-4 text-blue-600" />
            <span>4. Important Action Links</span>
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Apply Online URL
              </label>
              <input
                type="url"
                name="applyOnlineUrl"
                value={formData.applyOnlineUrl}
                onChange={handleChange}
                className="w-full text-xs p-2 border border-gray-300 rounded font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Notification PDF URL
              </label>
              <input
                type="url"
                name="notificationPdfUrl"
                value={formData.notificationPdfUrl}
                onChange={handleChange}
                className="w-full text-xs p-2 border border-gray-300 rounded font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Official Website URL
              </label>
              <input
                type="url"
                name="officialWebsiteUrl"
                value={formData.officialWebsiteUrl}
                onChange={handleChange}
                className="w-full text-xs p-2 border border-gray-300 rounded font-mono"
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-gray-700">Status:</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="text-xs p-1.5 border border-gray-300 rounded bg-white font-bold"
            >
              <option value="PUBLISHED">Published (Live)</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/posts"
              className="text-xs font-bold text-gray-500 hover:text-gray-700 px-4 py-2"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-red-700 hover:bg-red-800 disabled:bg-gray-400 text-white font-black text-xs px-6 py-2.5 rounded-lg shadow transition flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{loading ? 'Saving...' : 'Update Post'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
