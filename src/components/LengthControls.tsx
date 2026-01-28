"use client";

import { LengthId } from "@/lib/types";
import { LENGTH_OPTIONS } from "@/lib/constants";

interface LengthControlsProps {
  selected: LengthId;
  onSelect: (length: LengthId) => void;
}

export default function LengthControls({
  selected,
  onSelect,
}: LengthControlsProps) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2 block">
        Length
      </label>
      <div className="flex gap-1 bg-bg-card rounded-xl p-1 border border-border-subtle">
        {LENGTH_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`
              flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer
              ${
                selected === option.id
                  ? "bg-accent-blue text-white"
                  : "text-text-secondary hover:text-text-primary"
              }
            `}
          >
            <span className="mr-1">{option.icon}</span>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
