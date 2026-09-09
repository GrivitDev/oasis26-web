'use client';

import { useEffect, useState } from 'react';

function getTimeLeft(target: string) {
  const distance = new Date(target).getTime() - Date.now();

  if (distance <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
  };
}

export function Countdown({ weddingDate }: { weddingDate: string }) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(weddingDate));

  useEffect(() => {
    const timer = window.setInterval(() => setTimeLeft(getTimeLeft(weddingDate)), 1_000);

    return () => window.clearInterval(timer);
  }, [weddingDate]);

  return (
    <div className="grid grid-cols-4 gap-2 text-center sm:gap-4">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} className="rounded-xl border border-white/20 bg-white/10 px-2 py-3 backdrop-blur">
          <p className="font-serif text-2xl sm:text-3xl">{String(value).padStart(2, '0')}</p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#f4d89f]">{label}</p>
        </div>
      ))}
    </div>
  );
}
