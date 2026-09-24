'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Cpu,
  Play,
  RotateCw,
  CheckCircle,
  AlertTriangle,
  Terminal,
  Settings,
  Sparkles,
  Loader2,
} from 'lucide-react';

export default function ScraperManagerClient({
  initialSettings,
  logs,
}: {
  initialSettings: any;
  logs: any[];
}) {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [liveLogs, setLiveLogs] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Settings state
  const [autoPublish, setAutoPublish] = useState(
    initialSettings?.scraperAutoPublish ?? true
  );
  const [savingSettings, setSavingSettings] = useState(false);

  const handleRun = async (forceMock = false) => {
    setRunning(true);
    setStatusMessage(null);
    setLiveLogs([`[${new Date().toLocaleTimeString()}] Triggering scraper worker...`]);

    try {
      const res = await fetch('/api/admin/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forceMock }),
      });

      const data = await res.json();
      if (data.logs && Array.isArray(data.logs)) {
        setLiveLogs(data.logs);
      }

      if (data.success) {
        setStatusMessage(`✅ ${data.message}`);
        router.refresh();
      } else {
        setStatusMessage(`⚠️ Notice: ${data.message}`);
      }
    } catch (err: unknown) {
      const error = err as Error;
      setLiveLogs((prev) => [...prev, `[ERROR] Network failure: ${error.message}`]);
      setStatusMessage('Failed to run scraper.');
    } finally {
      setRunning(false);
    }
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...initialSettings,
          scraperAutoPublish: autoPublish,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Scraper settings updated successfully!');
      }
    } catch {
      alert('Failed to update settings');
    } finally {
      setSavingSettings(false);
    }
  };

  // Scheduler info state
  const [schedulerInfo, setSchedulerInfo] = useState<{
    schedule?: string;
    intervalHours?: number;
    nextRunAt?: string | null;
    lastRunAt?: string | null;
    isRunning?: boolean;
  }>({
    schedule: '0 */4 * * *',
    intervalHours: 4,
  });

  const fetchSchedulerInfo = async () => {
    try {
      const res = await fetch('/api/admin/scheduler');
      if (res.ok) {
        const data = await res.json();
        setSchedulerInfo(data);
      }
    } catch {}
  };

  useState(() => {
    fetchSchedulerInfo();
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-blue-700" />
            <span>Automated Job Scraper &amp; Sync Engine</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Periodically checks target job portals, extracts recruitment details, checks for duplicates, and posts new alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleRun(false)}
            disabled={running}
            className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow transition"
          >
            {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>{running ? 'Scraping in progress...' : 'Fetch Live Source Now'}</span>
          </button>

          <button
            onClick={() => handleRun(true)}
            disabled={running}
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-bold text-xs px-3 py-2.5 rounded-lg shadow transition"
            title="Generate sample government recruitment jobs"
          >
            <Sparkles className="w-4 h-4" />
            <span>Seed Sample Posts</span>
          </button>
        </div>
      </div>

      {/* 4-HOUR AUTOMATIC SCHEDULER BANNER */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 rounded-xl shadow-md border border-blue-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <h2 className="font-black text-sm uppercase tracking-wider text-emerald-400">
              4-Hour Automatic Background Sync Active
            </h2>
          </div>
          <p className="text-xs text-blue-100 max-w-2xl leading-relaxed">
            Every 4 hours (<code className="bg-blue-950 px-1.5 py-0.5 rounded text-amber-300 font-mono">0 */4 * * *</code>), the server automatically connects to Sarkari Result, inspects all 6 categories, extracts real registration links, and publishes new jobs without any manual intervention.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 bg-white/10 p-3 rounded-lg text-xs backdrop-blur-sm">
          <div>
            <span className="text-blue-300 block text-[10px] uppercase font-bold">Sync Interval:</span>
            <span className="font-extrabold text-white">Every 4 Hours</span>
          </div>
          <div className="border-l border-white/20 pl-4">
            <span className="text-blue-300 block text-[10px] uppercase font-bold">Next Run:</span>
            <span className="font-extrabold text-yellow-300">
              {schedulerInfo.nextRunAt ? new Date(schedulerInfo.nextRunAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Scheduled'}
            </span>
          </div>
        </div>
      </div>

      {/* Settings Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Settings className="w-5 h-5 text-gray-600" />
          <div>
            <h3 className="text-xs font-bold text-gray-800 uppercase">
              Auto-Publish Mode
            </h3>
            <p className="text-[11px] text-gray-500">
              When ON, scraped jobs automatically go live and post to Telegram. When OFF, they enter as Drafts for your approval.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoPublish}
              onChange={(e) => setAutoPublish(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-emerald-600"></div>
            <span className="ml-2 text-xs font-bold text-gray-800">
              {autoPublish ? 'Auto-Publish Active' : 'Draft Mode Active'}
            </span>
          </label>

          <button
            onClick={handleSaveSettings}
            disabled={savingSettings}
            className="text-xs bg-gray-900 hover:bg-black text-white font-bold px-3 py-1.5 rounded transition disabled:opacity-50"
          >
            {savingSettings ? 'Saving...' : 'Save Rule'}
          </button>
        </div>
      </div>

      {/* Live Execution Console */}
      <div className="bg-slate-950 text-emerald-400 p-4 rounded-xl shadow-lg font-mono text-xs space-y-2 border border-slate-800">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-slate-200">Scraper Console Output</span>
          </div>
          {running && (
            <span className="flex items-center gap-1.5 text-amber-400">
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
              <span>Scanning...</span>
            </span>
          )}
        </div>

        <div className="min-h-[140px] max-h-[260px] overflow-y-auto space-y-1">
          {liveLogs.length === 0 ? (
            <p className="text-slate-600 italic">Console idle. Click &ldquo;Fetch Live Source Now&rdquo; or &ldquo;Seed Sample Posts&rdquo; to test.</p>
          ) : (
            liveLogs.map((log, index) => (
              <div key={index} className="leading-relaxed whitespace-pre-wrap">
                {log}
              </div>
            ))
          )}
        </div>

        {statusMessage && (
          <div className="pt-2 text-yellow-300 font-bold border-t border-slate-800">
            {statusMessage}
          </div>
        )}
      </div>

      {/* Scraper Run History */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h3 className="font-extrabold text-sm text-gray-900">
            Recent Scrape Execution History
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-100 text-gray-600 uppercase text-[11px]">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Source</th>
                <th className="p-3">Found</th>
                <th className="p-3">New Created</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    No execution history recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="p-3 whitespace-nowrap text-gray-600">
                      {new Date(log.createdAt).toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 font-mono text-[11px] text-gray-800">
                      {log.source}
                    </td>
                    <td className="p-3 font-bold text-gray-900">
                      {log.itemsFound}
                    </td>
                    <td className="p-3 font-bold text-emerald-700">
                      +{log.itemsCreated}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          log.status === 'SUCCESS'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {log.status}
                      </span>
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
