"use client";

import { StyleId } from "@/lib/types";
import { STYLE_OPTIONS } from "@/lib/constants";

interface StyleSelectorProps {
  selected: StyleId;
  onSelect: (style: StyleId) => void;
}

export default function StyleSelector({
  selected,
  onSelect,
}: StyleSelectorProps) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2 block">
        Style
      </label>
      <div className="flex gap-2">
        {STYLE_OPTIONS.map((style) => (
          <button
            key={style.id}
            onClick={() => onSelect(style.id)}
            title={style.description}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer
              ${
                selected === style.id
                  ? "bg-accent-blue text-white shadow-lg"
                  : "bg-bg-card text-text-secondary border border-border-subtle hover:border-text-muted/30"
              }
            `}
          >
            {style.label}
          </button>
        ))}
      </div>
    </div>
  );
}
