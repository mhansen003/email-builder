"use client";

import { useState, useEffect } from "react";

interface VoiceRecorderProps {
  isListening: boolean;
  isSupported: boolean;
  interimTranscript: string;
  onStart: () => void;
  onStop: () => void;
}

export default function VoiceRecorder({
  isListening,
  isSupported,
  interimTranscript,
  onStart,
  onStop,
}: VoiceRecorderProps) {
  // Idle glow that stops once user has interacted
  const [showIdleGlow, setShowIdleGlow] = useState(true);

  useEffect(() => {
    if (isListening) {
      setShowIdleGlow(false);
    }
  }, [isListening]);

  if (!isSupported) return null;

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      {/* Mic Button */}
      <button
        onClick={() => {
          setShowIdleGlow(false);
          isListening ? onStop() : onStart();
        }}
        className={`
          relative w-20 h-20 rounded-full flex items-center justify-center
          transition-all duration-300 cursor-pointer
          ${
            isListening
              ? "bg-accent-rose mic-recording scale-110"
              : showIdleGlow
                ? "bg-bg-card border border-accent-blue/50 mic-idle-glow"
                : "bg-bg-card hover:bg-bg-secondary border border-border-subtle hover:border-accent-blue/40"
          }
        `}
        aria-label={isListening ? "Stop recording" : "Start recording"}
      >
        {/* Pulse rings when recording */}
        {isListening && (
          <>
            <span className="absolute inset-0 rounded-full bg-accent-rose/30 animate-pulse_ring" />
            <span
              className="absolute inset-0 rounded-full bg-accent-rose/20 animate-pulse_ring"
              style={{ animationDelay: "0.5s" }}
            />
          </>
        )}
        <svg
          className={`w-8 h-8 relative z-10 transition-colors ${
            isListening ? "text-white" : showIdleGlow ? "text-accent-blue" : "text-text-secondary"
          }`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          {isListening ? (
            <rect x="6" y="6" width="12" height="12" rx="2" />
          ) : (
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          )}
        </svg>
      </button>

      {/* Status Text */}
      <p
        className={`text-xs font-medium transition-colors ${
          isListening ? "text-accent-rose" : "text-text-muted"
        }`}
      >
        {isListening ? "Listening... tap to stop" : "Tap to record, type below, or drop a file"}
      </p>

      {/* Interim transcript */}
      {isListening && interimTranscript && (
        <p className="text-text-muted text-sm italic px-4 text-center max-w-lg typing-cursor">
          {interimTranscript}
        </p>
      )}
    </div>
  );
}
