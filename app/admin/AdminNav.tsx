'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Cpu,
  Send,
  LogOut,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  // Don't show admin header on login page
  if (pathname === '/admin/login') {
    return null;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      router.push('/admin/login');
    }
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'All Posts', href: '/admin/posts', icon: FileText },
    { label: 'Create Post', href: '/admin/posts/new', icon: PlusCircle },
    { label: 'Scraper Engine', href: '/admin/scraper', icon: Cpu },
    { label: 'Telegram Bot', href: '/admin/telegram', icon: Send },
  ];

  return (
    <header className="bg-slate-900 text-white shadow-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="bg-red-700 text-white font-black text-xs px-2 py-1 rounded tracking-wider">
              ADMIN
            </span>
            <span className="font-extrabold text-base tracking-wide text-gray-100">
              Sarkari Hub CMS
            </span>
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition"
          >
            <span>View Site</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 flex-wrap text-xs sm:text-sm font-semibold">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  isActive
                    ? 'bg-red-700 text-white shadow'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-red-900/60 text-slate-300 hover:text-white px-2.5 py-1.5 rounded transition ml-auto sm:ml-0"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
