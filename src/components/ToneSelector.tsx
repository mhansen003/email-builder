"use client";

import { useState, useRef, useEffect } from "react";
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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleTone = (toneId: ToneId) => {
    if (selected.includes(toneId)) {
      const newTones = selected.filter((t) => t !== toneId);
      onSelect(newTones.length > 0 ? newTones : ["normal"]);
    } else {
      onSelect([...selected, toneId]);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const selectedLabels = selected
    .map((id) => TONE_OPTIONS.find((t) => t.id === id)?.label)
    .filter(Boolean);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5 block">
        Tone
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-bg-card border border-border-subtle rounded-xl px-3.5 py-2.5 text-sm transition-all hover:border-accent-blue/40 focus:outline-none focus:border-accent-blue/40 focus:ring-1 focus:ring-accent-blue/20 cursor-pointer"
      >
        <div className="flex items-center gap-1.5 flex-wrap min-h-[1.25rem]">
          {selectedLabels.map((label) => (
            <span
              key={label}
              className="px-2 py-0.5 rounded-md bg-accent-blue/15 text-accent-blue text-xs font-semibold"
            >
              {label}
            </span>
          ))}
        </div>
        <svg
          className={`w-4 h-4 text-text-muted transition-transform flex-shrink-0 ml-2 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-30 mt-1.5 w-full bg-bg-card border border-border-subtle rounded-xl shadow-2xl overflow-hidden animate-fade_in">
          <div className="max-h-52 overflow-y-auto p-1.5">
            {TONE_OPTIONS.map((tone) => {
              const isSelected = selected.includes(tone.id);
              return (
                <button
                  key={tone.id}
                  onClick={() => toggleTone(tone.id)}
                  className={`
                    w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all cursor-pointer
                    ${isSelected
                      ? "bg-accent-blue/10 text-accent-blue"
                      : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                    }
                  `}
                >
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    isSelected ? "border-accent-blue bg-accent-blue" : "border-text-muted/40"
                  }`}>
                    {isSelected && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="text-left">
                    <span className="font-medium">{tone.label}</span>
                    <span className="text-text-muted text-xs ml-1.5">{tone.description}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
