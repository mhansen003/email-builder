"use client";

import QRCode from "react-qr-code";
import Image from "next/image";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHARE_URL = "https://email-builder.cmgfinancial.ai/";

export default function QRCodeModal({ isOpen, onClose }: QRCodeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 animate-fade_in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-bg-secondary border-2 border-accent-blue/30 rounded-2xl shadow-2xl shadow-accent-blue/10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3 sm:py-4 border-b border-border-subtle bg-gradient-to-r from-accent-blue/10 to-accent-teal/5">
          <div className="flex items-center gap-2.5">
            <Image
              src="/clear_ai_wht_logo.png"
              alt="Clear AI"
              width={80}
              height={24}
              className="h-5 sm:h-6 w-auto"
            />
            <div>
              <h2 className="text-base font-bold text-text-primary">Share This App</h2>
              <p className="text-xs text-text-muted">Scan to open on any device</p>
            </div>
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

        {/* QR Code */}
        <div className="flex flex-col items-center px-6 py-6 sm:py-8 space-y-4">
          <div className="bg-white p-3 sm:p-4 rounded-xl">
            <QRCode
              value={SHARE_URL}
              size={200}
              level="H"
              bgColor="#ffffff"
              fgColor="#0a0f1a"
              className="w-[160px] h-[160px] sm:w-[200px] sm:h-[200px]"
            />
          </div>
          <p className="text-[10px] sm:text-xs text-accent-blue font-mono font-semibold break-all text-center">
            {SHARE_URL}
          </p>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 pb-5 sm:pb-6">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-bg-card border border-border-subtle text-text-secondary font-semibold text-sm hover:text-text-primary hover:border-text-muted/30 transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
