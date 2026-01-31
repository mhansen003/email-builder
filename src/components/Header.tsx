"use client";

import Image from "next/image";

export default function Header() {
  return (
    <header className="text-center pt-10 pb-6 md:pt-16 md:pb-10 px-4">
      <div className="flex items-center justify-center gap-3 mb-3">
        <Image
          src="/clear_ai_wht_logo.png"
          alt="Clear AI"
          width={140}
          height={40}
          className="h-9 md:h-10 w-auto"
          priority
        />
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-accent-blue via-accent-teal to-accent-blue bg-clip-text text-transparent">
          Email Builder
        </h1>
      </div>
      <p className="text-text-secondary text-sm md:text-base max-w-md mx-auto">
        Speak your thoughts. AI crafts the perfect email.
      </p>
    </header>
  );
}
