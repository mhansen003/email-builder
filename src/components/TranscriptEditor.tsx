"use client";

interface TranscriptEditorProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  isListening: boolean;
}

export default function TranscriptEditor({
  value,
  onChange,
  onClear,
  isListening,
}: TranscriptEditorProps) {
  return (
    <div className="px-4 md:px-0">
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Transcript
          </label>
          {value && (
            <button
              onClick={onClear}
              className="text-xs text-text-muted hover:text-accent-rose transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            isListening
              ? "Your words will appear here as you speak..."
              : "Type or paste your message here..."
          }
          rows={4}
          className="w-full bg-bg-card border border-border-subtle rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/50 resize-none focus:outline-none focus:border-accent-blue/40 focus:ring-1 focus:ring-accent-blue/20 transition-all text-sm md:text-base"
        />
        <div className="flex justify-end mt-1">
          <span className="text-xs text-text-muted">
            {value.length > 0
              ? `${value.split(/\s+/).filter(Boolean).length} words`
              : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
