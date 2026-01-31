"use client";

import { useState, useEffect } from "react";
import { decodeEmailData, SharedEmailData } from "@/lib/share";
import { useClipboard } from "@/hooks/useClipboard";

export default function SharedPage() {
  const [data, setData] = useState<SharedEmailData | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const { copied, copyToClipboard } = useClipboard();
  const [emailCopied, setEmailCopied] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) {
      setError(true);
      setLoading(false);
      return;
    }
    const decoded = decodeEmailData(hash);
    if (!decoded) {
      setError(true);
    } else {
      setData(decoded);
    }
    setLoading(false);
  }, []);

  const handleCopyEmail = async () => {
    if (data?.email) {
      const success = await copyToClipboard(data.email);
      if (success) {
        setEmailCopied(true);
        setTimeout(() => setEmailCopied(false), 2000);
      }
    }
  };

  const handleCopyUrl = async () => {
    await copyToClipboard(window.location.href);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const parseEmail = (email: string) => {
    const lines = email.split("\n");
    let subject = "";
    let bodyLines = lines;

    if (lines[0]?.toLowerCase().startsWith("subject:")) {
      subject = lines[0].replace(/^subject:\s*/i, "").trim();
      bodyLines = lines.slice(1);
      if (bodyLines[0]?.trim() === "") {
        bodyLines = bodyLines.slice(1);
      }
    }
    return { subject, body: bodyLines.join("\n").trim() };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1a]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-blue-500/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#0a0f1a]">
        <div className="bg-[#1a2234] rounded-2xl border border-white/[0.08] p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-[#f43f5e]/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#f43f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[#f1f5f9] mb-2">Invalid or Expired Link</h1>
          <p className="text-sm text-[#64748b] mb-6">
            This shared email link appears to be invalid or corrupted.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#14b8a6] text-white font-semibold text-sm transition-all hover:brightness-110"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Create Your Own Email
          </a>
        </div>
      </div>
    );
  }

  const { subject, body } = parseEmail(data.email);

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-[#f1f5f9]">
      {/* Top Bar */}
      <header className="border-b border-white/[0.08] bg-[#1a2234]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#14b8a6] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-[#f1f5f9] group-hover:text-[#3b82f6] transition-colors">
              Email Builder
            </span>
          </a>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyUrl}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                copied
                  ? "bg-[#14b8a6] text-white"
                  : "bg-[#111827] text-[#94a3b8] hover:text-[#3b82f6] border border-white/[0.08]"
              }`}
            >
              {copied ? "Link Copied!" : "Copy Link"}
            </button>
            <a
              href="/"
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#14b8a6] text-white text-xs font-semibold transition-all hover:brightness-110"
            >
              Create Your Own
            </a>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Meta Card */}
        <div className="bg-[#1a2234] rounded-2xl border border-white/[0.08] p-5 mb-4">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-[#14b8a6]/20 text-[#14b8a6] text-xs font-semibold">
                  Shared Email
                </span>
                {data.tones && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#3b82f6]/20 text-[#3b82f6] text-xs font-semibold capitalize">
                    {data.tones.split(",").join(" + ")}
                  </span>
                )}
                {data.style && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#f59e0b]/20 text-[#f59e0b] text-xs font-semibold capitalize">
                    {data.style}
                  </span>
                )}
              </div>
              <p className="text-sm text-[#64748b] mt-2">
                {data.timestamp ? `Shared ${formatDate(data.timestamp)}` : "Shared via Email Builder"}
              </p>
            </div>
            <button
              onClick={handleCopyEmail}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                emailCopied
                  ? "bg-[#14b8a6] text-white"
                  : "bg-gradient-to-r from-[#3b82f6] to-[#14b8a6] text-white hover:brightness-110"
              }`}
            >
              {emailCopied ? "Copied!" : "Copy Email"}
            </button>
          </div>

          {/* Original transcript */}
          {data.transcript && (
            <div className="mt-4 pt-4 border-t border-white/[0.08]">
              <p className="text-xs font-semibold text-[#64748b] mb-1.5 uppercase tracking-wider">Original Request</p>
              <p className="text-sm text-[#94a3b8] bg-[#111827]/50 rounded-xl px-4 py-3 italic">
                &ldquo;{data.transcript}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Email Output */}
        <div className="bg-[#1a2234] rounded-2xl border border-white/[0.08] overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.08] bg-gradient-to-r from-[#3b82f6]/10 to-transparent">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#14b8a6] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold text-[#f1f5f9]">Generated Email</h2>
                <p className="text-xs text-[#64748b]">
                  Powered by Email Builder
                </p>
              </div>
            </div>
          </div>
          <div className="p-5">
            {/* Subject */}
            {subject && (
              <div className="mb-4 pb-4 border-b border-white/[0.08]">
                <span className="text-xs text-[#64748b] font-medium">Subject:</span>
                <p className="text-[#f1f5f9] font-semibold text-base mt-0.5">{subject}</p>
              </div>
            )}
            {/* Body */}
            <div className="text-[#f1f5f9] text-sm leading-relaxed whitespace-pre-wrap">
              {body}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
