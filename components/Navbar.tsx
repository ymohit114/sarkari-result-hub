'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search,
  Bell,
  ShieldCheck,
  Menu,
  X,
  ExternalLink,
  Briefcase,
  Award,
  FileText,
  Key,
  BookOpen,
  GraduationCap,
  Home,
} from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Latest Jobs', href: '/jobs', icon: Briefcase },
    { label: 'Admit Card', href: '/admit-card', icon: FileText },
    { label: 'Results', href: '/results', icon: Award },
    { label: 'Answer Key', href: '/answer-key', icon: Key },
    { label: 'Syllabus', href: '/syllabus', icon: BookOpen },
    { label: 'Admission', href: '/admission', icon: GraduationCap },
  ];

  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      {/* Top Brand Bar */}
      <div className="bg-gradient-to-r from-red-800 via-red-700 to-amber-700 text-white px-3 sm:px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Logo & Subtitle */}
          <div className="flex-1 min-w-0">
            <Link href="/" className="inline-flex items-center gap-1.5 group">
              <span className="font-black text-lg sm:text-2xl tracking-wider text-yellow-300 drop-shadow truncate">
                SARKARI RESULT HUB
              </span>
              <span className="hidden sm:inline text-[10px] bg-yellow-400 text-black font-extrabold px-1.5 py-0.5 rounded uppercase">
                Official
              </span>
            </Link>
            <p className="text-[10px] sm:text-xs text-red-100 font-medium truncate hidden sm:block">
              Fastest Central &amp; State Government Job Alerts, Admit Cards &amp; Results
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-full shadow transition"
              aria-label="Telegram Channel"
            >
              <Bell className="w-3.5 h-3.5 animate-bounce" />
              <span className="hidden xs:inline">Join</span> Telegram
            </a>

            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-[11px] sm:text-xs bg-white/20 hover:bg-white/30 text-white font-semibold px-2 py-1.5 rounded transition"
              title="Admin CMS"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded text-white hover:bg-white/20 transition active:scale-90"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Navigation & Search Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 hidden md:flex items-center justify-between gap-4">
        {/* Nav Links */}
        <nav className="flex items-center gap-1 lg:gap-1.5 flex-wrap text-xs lg:text-sm font-bold text-gray-800">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2.5 py-1.5 rounded-md transition ${
                  isActive
                    ? 'bg-red-700 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-red-50 hover:text-red-700'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="relative w-64 lg:w-72">
          <input
            type="text"
            placeholder="Search exams, admit card, job..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent bg-gray-50 focus:bg-white transition"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
        </form>
      </div>

      {/* Mobile Search Bar (Always visible on mobile below brand) */}
      <div className="md:hidden px-3 py-2 bg-gray-50 border-b border-gray-200">
        <form onSubmit={handleSearch} className="relative w-full">
          <input
            type="text"
            placeholder="Search recruitment, result, admit card..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 bg-white"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-3" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-start">
          <div className="bg-white w-full max-h-[85vh] overflow-y-auto shadow-2xl rounded-b-2xl border-b-4 border-red-700 p-4 space-y-4 animate-in slide-in-from-top duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <span className="font-black text-sm text-red-700 uppercase tracking-wider">
                Explore Categories
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="grid grid-cols-2 gap-2 text-xs font-bold">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 p-3 rounded-lg border transition ${
                      isActive
                        ? 'bg-red-700 text-white border-red-700 shadow'
                        : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-red-50 hover:text-red-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-xs">
              <Link
                href="/admin"
                className="font-bold text-gray-600 hover:text-red-700 flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-red-600" />
                <span>Admin Console</span>
              </Link>
              <a
                href="https://t.me"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1"
              >
                <span>Telegram Alerts</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Clickable backdrop area to close */}
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
}
