"use client";

import { ToneId } from "@/lib/types";
import { TONE_OPTIONS } from "@/lib/constants";

interface ToneSelectorProps {
  selected: ToneId;
  onSelect: (tone: ToneId) => void;
}

export default function ToneSelector({
  selected,
  onSelect,
}: ToneSelectorProps) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2 block">
        Tone
      </label>
      <div className="flex flex-wrap gap-2">
        {TONE_OPTIONS.map((tone) => (
          <button
            key={tone.id}
            onClick={() => onSelect(tone.id)}
            title={tone.description}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer
              ${
                selected === tone.id
                  ? `${tone.color} text-white shadow-lg`
                  : "bg-bg-card text-text-secondary border border-border-subtle hover:border-text-muted/30"
              }
            `}
          >
            {tone.label}
          </button>
        ))}
      </div>
    </div>
  );
}
