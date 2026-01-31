"use client";

import { useState, useRef, useEffect } from "react";
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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const selectedOption = TONE_OPTIONS.find((t) => t.id === selected);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5 block">
        Tone
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-bg-card border border-border-subtle rounded-xl px-3.5 py-2.5 text-sm transition-all hover:border-accent-blue/40 focus:outline-none focus:border-accent-blue/40 focus:ring-1 focus:ring-accent-blue/20 cursor-pointer"
      >
        <span className="text-text-primary font-medium">{selectedOption?.label}</span>
        <svg
          className={`w-4 h-4 text-text-muted transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
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
              const isSelected = selected === tone.id;
              return (
                <button
                  key={tone.id}
                  onClick={() => {
                    onSelect(tone.id);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all cursor-pointer
                    ${isSelected
                      ? "bg-accent-blue/10 text-accent-blue"
                      : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                    }
                  `}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    isSelected ? "border-accent-blue" : "border-text-muted/40"
                  }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-accent-blue" />}
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
