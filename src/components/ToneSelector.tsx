"use client";

import { ToneId } from "@/lib/types";
import { TONE_OPTIONS } from "@/lib/constants";

interface ToneSelectorProps {
  selected: ToneId[];
  onSelect: (tones: ToneId[]) => void;
}

export default function ToneSelector({
  selected,
  onSelect,
}: ToneSelectorProps) {
  const toggleTone = (toneId: ToneId) => {
    if (selected.includes(toneId)) {
      // Remove tone if already selected (but keep at least one)
      const newTones = selected.filter((t) => t !== toneId);
      onSelect(newTones.length > 0 ? newTones : ["normal"]);
    } else {
      // Add tone to selection
      onSelect([...selected, toneId]);
    }
  };

  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2 block">
        Tone <span className="text-text-muted/60 font-normal normal-case">(select multiple)</span>
      </label>
      <div className="flex flex-wrap gap-2">
        {TONE_OPTIONS.map((tone) => {
          const isSelected = selected.includes(tone.id);
          return (
            <button
              key={tone.id}
              onClick={() => toggleTone(tone.id)}
              title={tone.description}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer
                ${
                  isSelected
                    ? `${tone.color} text-white shadow-lg ring-2 ring-white/20`
                    : "bg-bg-card text-text-secondary border border-border-subtle hover:border-text-muted/30"
                }
              `}
            >
              {tone.label}
            </button>
          );
        })}
      </div>
      {selected.length > 1 && (
        <p className="text-xs text-accent-teal mt-2">
          Combining: {selected.map(t => t.replace("-", " ")).join(" + ")}
        </p>
      )}
    </div>
  );
}
