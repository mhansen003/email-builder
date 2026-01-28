"use client";

export default function Header() {
  return (
    <header className="text-center pt-10 pb-6 md:pt-16 md:pb-10 px-4">
      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-teal flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
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
