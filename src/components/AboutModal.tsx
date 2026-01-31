"use client";

import Image from "next/image";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 animate-fade_in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-bg-secondary border border-border-subtle rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-border-subtle">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Image
              src="/clear_ai_wht_logo.png"
              alt="Clear AI"
              width={100}
              height={30}
              className="h-6 sm:h-7 w-auto"
            />
            <h2 className="text-base sm:text-lg font-bold text-text-primary">About Email Builder</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-bg-card text-text-muted hover:text-text-primary transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Video */}
        <div className="p-3 sm:p-4">
          <video
            src="/about-video.mp4"
            controls
            autoPlay
            className="w-full rounded-xl"
            playsInline
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}
