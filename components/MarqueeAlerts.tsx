'use client';

import Link from 'next/link';
import { useState } from 'react';

interface MarqueeAlertsProps {
  alerts: Array<{ id: string; title: string; slug: string; category: string }>;
}

export default function MarqueeAlerts({ alerts }: MarqueeAlertsProps) {
  const [isPaused, setIsPaused] = useState(false);

  if (!alerts || alerts.length === 0) return null;

  return (
    <div
      className="bg-amber-100/90 border-y border-amber-300 py-1.5 px-2 sm:px-4 overflow-hidden shadow-inner flex items-center"
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="shrink-0 bg-red-700 text-white text-[10px] sm:text-xs font-black uppercase px-2 py-0.5 rounded mr-2 sm:mr-3 flex items-center gap-1 shadow-xs">
        <span className="animate-pulse">🔥 Updates</span>
      </div>

      <div className="overflow-hidden whitespace-nowrap w-full">
        <div
          className="inline-block animate-marquee"
          style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
        >
          {alerts.map((item, idx) => (
            <Link
              key={`${item.id}-${idx}`}
              href={`/post/${item.slug}`}
              className="inline-block mx-3 sm:mx-4 text-xs sm:text-[13px] font-semibold text-blue-900 hover:text-red-700 hover:underline"
            >
              • {item.title}
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          display: inline-block;
          white-space: nowrap;
          animation: marquee 35s linear infinite;
        }
      `}</style>
    </div>
  );
}
