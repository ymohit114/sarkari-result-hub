'use client';

import { useState } from 'react';
import {
  Send,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Save,
  Key,
  Radio,
  ExternalLink,
  Loader2,
} from 'lucide-react';

export default function TelegramSettingsClient({
  initialSettings,
}: {
  initialSettings: any;
}) {
  const [token, setToken] = useState(initialSettings?.telegramBotToken || '');
  const [channelId, setChannelId] = useState(initialSettings?.telegramChannelId || '');
  const [autoPublish, setAutoPublish] = useState(initialSettings?.telegramAutoPublish ?? true);

  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...initialSettings,
          telegramBotToken: token.trim(),
          telegramChannelId: channelId.trim(),
          telegramAutoPublish: autoPublish,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: 'Telegram settings saved successfully!' });
      } else {
        setFeedback({ type: 'error', message: data.message || 'Failed to save settings' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Network error saving settings.' });
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    if (!token.trim() || !channelId.trim()) {
      setFeedback({
        type: 'error',
        message: 'Please fill both the Telegram Bot Token and Channel ID before testing.',
      });
      return;
    }

    setTesting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/telegram/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token.trim(),
          channelId: channelId.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: data.message });
      } else {
        setFeedback({ type: 'error', message: data.message });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Failed to connect to Telegram API.' });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
          <Send className="w-6 h-6 text-sky-600" />
          <span>Telegram Bot &amp; Channel Broadcast Automation</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Connect your Telegram Bot to automatically push instant notifications to your channel or group whenever a new job or result goes live.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide border-b border-gray-100 pb-2">
              Credentials &amp; Target Channel
            </h2>

            {/* Bot Token */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-gray-500" />
                <span>Telegram Bot Token</span>
              </label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="e.g. 7123456789:AAHxxxxx_xxxxxxxxxxxxxxxxxxxx"
                className="w-full text-xs font-mono p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Generated from Telegram&apos;s official <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="text-sky-600 font-bold underline">@BotFather</a>.
              </p>
            </div>

            {/* Channel ID */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-gray-500" />
                <span>Channel Username or Chat ID</span>
              </label>
              <input
                type="text"
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
                placeholder="e.g. @MySarkariAlertsChannel or -1001234567890"
                className="w-full text-xs font-mono p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Ensure your Bot is added as an <b>Administrator</b> in this channel with <i>&ldquo;Post Messages&rdquo;</i> permission.
              </p>
            </div>

            {/* Auto Publish Switch */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-gray-800 block">
                  Automatic Telegram Broadcast
                </span>
                <span className="text-[11px] text-gray-500">
                  Broadcast automatically whenever a new post is published (manually or via scraper).
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoPublish}
                  onChange={(e) => setAutoPublish(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-sky-600"></div>
              </label>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow transition flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Settings'}</span>
              </button>

              <button
                type="button"
                onClick={handleTest}
                disabled={testing}
                className="bg-gray-900 hover:bg-black disabled:bg-gray-400 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow transition flex items-center gap-1.5"
              >
                {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{testing ? 'Testing connection...' : 'Test Connection & Send Test Alert'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right 1 Col: Instructions & Sample Preview */}
        <div className="space-y-4">
          {/* Setup Guide */}
          <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4 text-xs space-y-2 text-sky-950">
            <h3 className="font-bold flex items-center gap-1.5 text-sky-900">
              <HelpCircle className="w-4 h-4 text-sky-700" />
              <span>3-Step Quick Telegram Setup</span>
            </h3>
            <ol className="list-decimal pl-4 space-y-1.5 text-sky-900 leading-relaxed text-[11px]">
              <li>
                Open Telegram, message <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="underline font-bold">@BotFather</a>, send <code>/newbot</code>, and copy your API Token.
              </li>
              <li>
                Create a public or private Telegram Channel (e.g. <code>@MySarkariAlerts</code>).
              </li>
              <li>
                Go to Channel Settings &rarr; Administrators &rarr; Add your Bot as an <b>Admin</b>.
              </li>
              <li>
                Paste your Token and Channel Username here and click <b>Test Connection</b>!
              </li>
            </ol>
          </div>

          {/* Telegram Alert Message Preview */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-2">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Candidate Preview on Telegram
            </h4>
            <div className="bg-[#17212b] text-white p-3.5 rounded-lg text-xs font-sans space-y-2 leading-relaxed shadow-inner">
              <p className="text-amber-400 font-bold">🔥 NEW RECRUITMENT NOTIFICATION 🔥</p>
              <p className="font-bold text-sm">📌 SSC Combined Graduate Level (CGL) 2026</p>
              <p className="text-slate-300">🏛️ <b>Dept:</b> Staff Selection Commission</p>
              <p className="text-slate-300">👥 <b>Total Posts:</b> 14,582 Posts</p>
              <p className="text-slate-300">🎓 <b>Qualification:</b> Bachelor Degree in Any Stream</p>
              <p className="text-slate-300">⏰ <b>Last Date:</b> 31/03/2026</p>
              <p className="text-sky-400 text-[11px]">#latestjobs #SarkariResult #GovernmentJobs</p>

              <div className="pt-2 space-y-1">
                <div className="bg-[#2b5278] text-white text-center py-1.5 px-3 rounded font-bold text-[11px] cursor-pointer hover:bg-[#346291]">
                  👉 View Full Details &amp; Apply
                </div>
                <div className="flex gap-1 text-[10px]">
                  <div className="flex-1 bg-[#2b5278] text-center py-1 rounded hover:bg-[#346291]">
                    ⚡ Direct Apply Link
                  </div>
                  <div className="flex-1 bg-[#2b5278] text-center py-1 rounded hover:bg-[#346291]">
                    📄 Notification PDF
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
