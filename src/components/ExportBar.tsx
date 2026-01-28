"use client";

interface ExportBarProps {
  email: string;
  copied: boolean;
  onCopy: () => void;
  onOutlook: () => void;
  onRegenerate: () => void;
  isGenerating: boolean;
}

export default function ExportBar({
  email,
  copied,
  onCopy,
  onOutlook,
  onRegenerate,
  isGenerating,
}: ExportBarProps) {
  if (!email) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 md:static md:px-0 bg-bg-primary/90 backdrop-blur-lg border-t border-border-subtle md:border-0 p-4 md:py-4 z-50">
      <div className="flex gap-3 max-w-2xl mx-auto">
        {/* Copy button */}
        <button
          onClick={onCopy}
          disabled={isGenerating}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent-teal text-white font-semibold text-sm transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
              Copy
            </>
          )}
        </button>

        {/* Outlook button */}
        <button
          onClick={onOutlook}
          disabled={isGenerating}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent-blue text-white font-semibold text-sm transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          Open in Outlook
        </button>

        {/* Regenerate button */}
        <button
          onClick={onRegenerate}
          disabled={isGenerating}
          className="px-4 py-3 rounded-xl bg-bg-card border border-border-subtle text-text-secondary font-semibold text-sm transition-all hover:border-accent-blue/40 hover:text-text-primary active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          title="Regenerate with current settings"
        >
          <svg
            className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
