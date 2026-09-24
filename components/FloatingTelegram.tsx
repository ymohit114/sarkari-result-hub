'use client';

import { Send } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function FloatingTelegram() {
  const [channelUrl, setChannelUrl] = useState('https://t.me');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.telegramChannelId) {
          const raw = data.telegramChannelId.replace(/^@/, '');
          setChannelUrl(`https://t.me/${raw}`);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <aside aria-label="Join Telegram Channel">
      <a
        href={channelUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-16 sm:bottom-6 right-3 sm:right-6 z-40 flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 active:scale-95 text-white font-black px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full shadow-xl transition-all transform hover:scale-105 group border border-white/20"
        aria-label="Join our Telegram Channel"
      >
        <div className="relative">
          <Send className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:rotate-12" />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400"></span>
          </span>
        </div>
        <span className="text-xs sm:text-sm font-extrabold tracking-wide">
          Telegram
        </span>
      </a>
    </aside>
  );
}
