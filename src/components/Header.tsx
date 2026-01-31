"use client";

import Image from "next/image";

interface HeaderProps {
  onAbout: () => void;
}

export default function Header({ onAbout }: HeaderProps) {
  return (
    <header className="pt-5 pb-3 md:pt-8 md:pb-5 px-4 md:px-6">
      {/* Top row: logo + about */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <Image
            src="/clear_ai_wht_logo.png"
            alt="Clear AI"
            width={140}
            height={40}
            className="h-7 sm:h-9 md:h-10 w-auto flex-shrink-0"
            priority
          />
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-accent-blue via-accent-teal to-accent-blue bg-clip-text text-transparent truncate">
            Email Builder
          </h1>
        </div>
        <button
          onClick={onAbout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-card/60 border border-border-subtle text-text-muted hover:text-accent-blue hover:border-accent-blue/40 transition-all text-xs font-medium cursor-pointer flex-shrink-0 ml-2"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          About
        </button>
      </div>
      <p className="text-text-secondary text-xs sm:text-sm md:text-base text-center max-w-md mx-auto">
        Speak your thoughts. AI crafts the perfect email.
      </p>
    </header>
  );
}
