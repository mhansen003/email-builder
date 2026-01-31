"use client";

import { LengthId } from "@/lib/types";

const OPTIONS: { id: LengthId; label: string }[] = [
  { id: "condense", label: "Short" },
  { id: "default", label: "Default" },
  { id: "extend", label: "Detailed" },
];

interface LengthControlsProps {
  selected: LengthId;
  onSelect: (length: LengthId) => void;
}

export default function LengthControls({
  selected,
  onSelect,
}: LengthControlsProps) {
  const selectedIndex = OPTIONS.findIndex((o) => o.id === selected);

  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5 block">
        Length
      </label>
      <div className="bg-bg-card border border-border-subtle rounded-xl px-3.5 py-3">
        {/* Track + thumb */}
        <div className="relative h-1.5 bg-bg-secondary rounded-full mx-1">
          {/* Active fill */}
          <div
            className="absolute top-0 left-0 h-full bg-accent-blue rounded-full transition-all duration-200"
            style={{ width: `${selectedIndex * 50}%` }}
          />
          {/* Clickable dots */}
          {OPTIONS.map((option, i) => (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer group"
              style={{ left: `${i * 50}%` }}
              title={option.label}
            >
              <div
                className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                  i <= selectedIndex
                    ? "bg-accent-blue border-accent-blue scale-110"
                    : "bg-bg-card border-text-muted/40 group-hover:border-accent-blue/50"
                }`}
              />
            </button>
          ))}
        </div>
        {/* Labels */}
        <div className="flex justify-between mt-2.5 mx-1">
          {OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={`text-xs font-medium transition-colors cursor-pointer ${
                selected === option.id ? "text-accent-blue" : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
