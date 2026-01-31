"use client";

import { useState, useCallback } from "react";

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
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length === 0) return;

      const file = files[0];
      // Accept text files
      if (!file.type.startsWith("text/") && !file.name.endsWith(".txt") && !file.name.endsWith(".md")) {
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === "string") {
          onChange(value ? value + "\n" + text : text);
        }
      };
      reader.readAsText(file);
    },
    [value, onChange]
  );

  return (
    <div className="px-4 md:px-0">
      <div className="relative">
        <div className="flex items-center justify-between mb-1.5">
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
        <div
          className={`relative rounded-xl transition-all ${
            isDragging
              ? "ring-2 ring-accent-blue ring-offset-2 ring-offset-bg-primary"
              : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={
              isListening
                ? "Your words will appear here as you speak..."
                : "Type, paste, or drop a .txt file here..."
            }
            rows={4}
            className="w-full bg-bg-card border border-border-subtle rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/50 resize-none focus:outline-none focus:border-accent-blue/40 focus:ring-1 focus:ring-accent-blue/20 transition-all text-sm"
          />
          {isDragging && (
            <div className="absolute inset-0 rounded-xl bg-accent-blue/10 border-2 border-dashed border-accent-blue flex items-center justify-center pointer-events-none">
              <span className="text-accent-blue text-sm font-semibold">Drop text file here</span>
            </div>
          )}
        </div>
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
