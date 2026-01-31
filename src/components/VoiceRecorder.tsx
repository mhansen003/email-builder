"use client";

import { useState, useEffect } from "react";

interface VoiceRecorderProps {
  isListening: boolean;
  isSupported: boolean;
  interimTranscript: string;
  onStart: () => void;
  onStop: () => void;
  onInterview: () => void;
}

export default function VoiceRecorder({
  isListening,
  isSupported,
  interimTranscript,
  onStart,
  onStop,
  onInterview,
}: VoiceRecorderProps) {
  // Idle glow that stops once user has interacted
  const [showIdleGlow, setShowIdleGlow] = useState(true);

  useEffect(() => {
    if (isListening) {
      setShowIdleGlow(false);
    }
  }, [isListening]);

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      {/* Buttons row */}
      <div className="flex items-center gap-6">
        {/* Interview button (purple) */}
        <button
          onClick={() => {
            setShowIdleGlow(false);
            onInterview();
          }}
          className="relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer group bg-bg-card hover:bg-bg-secondary border-2 border-accent-purple/40 hover:border-accent-purple shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)]"
          aria-label="Start AI interview"
          title="AI interview — build your email through conversation"
        >
          <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-accent-purple/20 to-accent-purple/10 blur-sm animate-pulse" />
          <svg className="w-6 h-6 relative z-10 text-text-secondary group-hover:text-accent-purple transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>

        {/* Mic Button */}
        {isSupported && (
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
        )}
      </div>

      {/* Labels */}
      <div className="flex items-center gap-8">
        <p className="text-xs font-semibold text-text-muted">Interview</p>
        <p
          className={`text-xs font-medium transition-colors ${
            isListening ? "text-accent-rose" : "text-text-muted"
          }`}
        >
          {isListening ? "Listening... tap to stop" : "Tap to record"}
        </p>
      </div>

      {/* Interim transcript */}
      {isListening && interimTranscript && (
        <p className="text-text-muted text-sm italic px-4 text-center max-w-lg typing-cursor">
          {interimTranscript}
        </p>
      )}
    </div>
  );
}
