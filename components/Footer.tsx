import Link from 'next/link';
import { Send, Shield, BookOpen, AlertCircle, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto border-t-4 border-red-700">
      {/* Telegram Join CTA Bar */}
      <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white py-5 sm:py-6 px-3 sm:px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="bg-white/20 p-2.5 sm:p-3 rounded-full shrink-0">
              <Send className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black">Join Our Official Telegram Channel</h3>
              <p className="text-xs sm:text-sm text-sky-100 mt-0.5">
                Instant Sarkari Result alerts, hall ticket download links, and exam dates on your mobile phone!
              </p>
            </div>
          </div>
          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-black font-black px-6 py-3 rounded-xl shadow-lg transition-transform text-xs sm:text-sm shrink-0"
          >
            <span>JOIN NOW FOR FREE</span>
            <Send className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        <div>
          <h4 className="text-white font-black text-base sm:text-lg mb-2.5 tracking-wide">
            SARKARI RESULT HUB
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            India&apos;s trusted educational job portal delivering the fastest alerts for government recruitments (Sarkari Naukri), entrance exams, admit cards, answer keys, syllabi, and official results.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
            <Shield className="w-4 h-4 shrink-0" />
            <span>100% Free &amp; Verified Information</span>
          </div>
        </div>

        <div>
          <h5 className="text-white font-bold text-xs sm:text-sm mb-3 uppercase tracking-wider border-b border-slate-800 pb-1">
            Top Categories
          </h5>
          <ul className="text-xs space-y-2">
            <li>
              <Link href="/jobs" className="hover:text-yellow-400 transition block py-0.5">
                • Latest Government Jobs (Sarkari Naukri)
              </Link>
            </li>
            <li>
              <Link href="/admit-card" className="hover:text-yellow-400 transition block py-0.5">
                • Online Admit Cards &amp; Hall Tickets
              </Link>
            </li>
            <li>
              <Link href="/results" className="hover:text-yellow-400 transition block py-0.5">
                • Exam Results &amp; Merit Lists
              </Link>
            </li>
            <li>
              <Link href="/answer-key" className="hover:text-yellow-400 transition block py-0.5">
                • Official Answer Keys &amp; Objections
              </Link>
            </li>
            <li>
              <Link href="/syllabus" className="hover:text-yellow-400 transition block py-0.5">
                • Exam Syllabus &amp; Pattern PDF
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-bold text-xs sm:text-sm mb-3 uppercase tracking-wider border-b border-slate-800 pb-1">
            Official Portals
          </h5>
          <ul className="text-xs space-y-2">
            <li>
              <a href="https://ssc.gov.in" target="_blank" rel="noreferrer" className="hover:text-yellow-400 transition block py-0.5">
                • Staff Selection Commission (SSC)
              </a>
            </li>
            <li>
              <a href="https://upsc.gov.in" target="_blank" rel="noreferrer" className="hover:text-yellow-400 transition block py-0.5">
                • Union Public Service Commission (UPSC)
              </a>
            </li>
            <li>
              <a href="https://indianrailways.gov.in" target="_blank" rel="noreferrer" className="hover:text-yellow-400 transition block py-0.5">
                • Railway Recruitment Board (RRB)
              </a>
            </li>
            <li>
              <a href="https://ibps.in" target="_blank" rel="noreferrer" className="hover:text-yellow-400 transition block py-0.5">
                • Institute of Banking Personnel Selection (IBPS)
              </a>
            </li>
            <li>
              <a href="https://nta.ac.in" target="_blank" rel="noreferrer" className="hover:text-yellow-400 transition block py-0.5">
                • National Testing Agency (NTA)
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-bold text-xs sm:text-sm mb-3 uppercase tracking-wider border-b border-slate-800 pb-1">
            Disclaimer
          </h5>
          <div className="text-[11px] text-slate-400 leading-relaxed bg-slate-800/60 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Notice to Candidates</span>
            </div>
            Sarkari Result Hub is an informational portal for educational and career awareness only. Candidates must always cross-check details on official government departments before applying.
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-slate-950 py-3 sm:py-4 px-4 text-center text-[11px] sm:text-xs text-slate-500 border-t border-slate-800">
        <p>© {new Date().getFullYear()} Sarkari Result Hub. All rights reserved. Ultra-fast responsive Next.js architecture.</p>
      </div>
    </footer>
  );
}
