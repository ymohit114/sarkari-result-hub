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
} from 'lucide-react';

export default function NewPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: 'latest-jobs',
    organization: '',
    shortDescription: '',
    totalVacancies: '',
    qualification: '',
    applicationBegin: 'Started',
    lastDateApply: '',
    lastDateFee: '',
    examDate: 'Notify Soon',
    admitCardDate: 'Before Exam',
    feeGeneral: '₹ 100/-',
    feeScStPh: '₹ 0/-',
    feeFemale: '₹ 0/-',
    feePaymentMode: 'Online via Net Banking, Debit/Credit Card or UPI',
    ageMin: '18 Years',
    ageMax: '30 Years',
    ageDetails: 'Age Relaxation Extra as per Recruitment Rules',
    applyOnlineUrl: '',
    notificationPdfUrl: '',
    officialWebsiteUrl: '',
    status: 'PUBLISHED',
    broadcastNow: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/admin/posts');
        router.refresh();
      } else {
        setError(data.message || 'Failed to create post');
      }
    } catch {
      setError('Network failure creating post');
    } finally {
      setLoading(false);
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
        <span className="text-xs bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded">
          New Notification
        </span>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-xl font-black text-gray-900">
            Publish New Recruitment / Notification
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Fill in the details below. This will be instantly SEO-indexed and broadcast to Telegram.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Basic Info */}
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
                placeholder="e.g. SSC CGL 2026 Online Application Form"
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
                placeholder="e.g. Staff Selection Commission (SSC)"
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
                placeholder="e.g. 14,582 Posts"
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
              placeholder="Brief summary explaining recruitment, eligibility, and post details..."
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
                placeholder="e.g. 01/04/2026"
                className="w-full text-xs p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-600 focus:outline-none"
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
                placeholder="e.g. 30/04/2026"
                className="w-full text-xs p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-600 focus:outline-none"
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
                placeholder="e.g. July 2026"
                className="w-full text-xs p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                General / OBC / EWS Fee
              </label>
              <input
                type="text"
                name="feeGeneral"
                value={formData.feeGeneral}
                onChange={handleChange}
                placeholder="e.g. ₹ 100/-"
                className="w-full text-xs p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-600 focus:outline-none"
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
                placeholder="e.g. ₹ 0/-"
                className="w-full text-xs p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                All Female Fee
              </label>
              <input
                type="text"
                name="feeFemale"
                value={formData.feeFemale}
                onChange={handleChange}
                placeholder="e.g. ₹ 0/- (Exempted)"
                className="w-full text-xs p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Qualification & Age */}
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
                  placeholder="Min: 18 Years"
                  className="w-full text-xs p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-600 focus:outline-none"
                />
                <input
                  type="text"
                  name="ageMax"
                  value={formData.ageMax}
                  onChange={handleChange}
                  placeholder="Max: 30 Years"
                  className="w-full text-xs p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-600 focus:outline-none"
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
                placeholder="e.g. Bachelor Degree in Any Stream / 10+2 Pass"
                className="w-full text-xs p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Important Links */}
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
                placeholder="https://ssc.gov.in/apply"
                className="w-full text-xs p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-600 focus:outline-none font-mono"
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
                placeholder="https://ssc.gov.in/notification.pdf"
                className="w-full text-xs p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-600 focus:outline-none font-mono"
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
                placeholder="https://ssc.gov.in"
                className="w-full text-xs p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-600 focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Publishing & Telegram Options */}
        <div className="pt-4 border-t border-gray-100 bg-sky-50/60 p-4 rounded-xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-gray-700">Publish Status:</label>
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

            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="broadcastNow"
                checked={formData.broadcastNow}
                onChange={handleChange}
                className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
              />
              <span className="text-xs font-bold text-sky-950 flex items-center gap-1">
                <Send className="w-3.5 h-3.5 text-sky-600" />
                <span>Broadcast to Telegram Channel Immediately</span>
              </span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
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
            <span>{loading ? 'Creating...' : 'Save & Publish Post'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
