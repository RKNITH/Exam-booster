import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center gap-6">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-saffron-500 to-saffron-700 flex items-center justify-center text-3xl shadow-2xl shadow-saffron-500/40 animate-bounce-light">
        ⚖
      </div>
      <div className="flex flex-col items-center gap-2">
        <h2 className="font-display text-xl font-bold text-white">Exam Booster</h2>
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-saffron-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
