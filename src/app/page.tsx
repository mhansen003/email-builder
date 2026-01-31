"use client";

import { useState, useEffect, useCallback } from "react";
import { useCompletion } from "@ai-sdk/react";
import { ToneId, StyleId, LengthId } from "@/lib/types";
import {
  HistoryItem,
  PublishedItem,
  SharedEmailData,
  loadHistory,
  saveHistory,
  loadPublished,
  savePublished,
  buildShareUrl,
} from "@/lib/share";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useClipboard } from "@/hooks/useClipboard";
import { useMailto } from "@/hooks/useMailto";
import Header from "@/components/Header";
import BrowserWarning from "@/components/BrowserWarning";
import VoiceRecorder from "@/components/VoiceRecorder";
import TranscriptEditor from "@/components/TranscriptEditor";
import ControlPanel from "@/components/ControlPanel";
import EmailPreview from "@/components/EmailPreview";
import ExportBar from "@/components/ExportBar";
import EmailHistory from "@/components/EmailHistory";
import ShareModal from "@/components/ShareModal";

export default function Home() {
  // Speech recognition
  const {
    isListening,
    transcript: speechTranscript,
    interimTranscript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  // Editable transcript (synced from speech)
  const [transcript, setTranscript] = useState("");

  // Controls - tones is now an array for multi-select
  const [tones, setTones] = useState<ToneId[]>(["normal"]);
  const [style, setStyle] = useState<StyleId>("professional");
  const [length, setLength] = useState<LengthId>("default");
  const [recipientContext, setRecipientContext] = useState("");

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  // History & Published
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [published, setPublished] = useState<PublishedItem[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Share modal
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isSharing, setIsSharing] = useState(false);

  // Export hooks
  const { copied, copyToClipboard } = useClipboard();
  const { openInOutlook } = useMailto();

  // AI completion
  const {
    completion: email,
    isLoading: isGenerating,
    complete,
    setCompletion,
  } = useCompletion({
    api: "/api/generate-email",
    onError: (error) => {
      console.error("Generation failed:", error);
      setToast("Failed to generate email. Please try again.");
      setTimeout(() => setToast(null), 3000);
    },
  });

  // Load history & published from localStorage on mount
  useEffect(() => {
    setHistory(loadHistory());
    setPublished(loadPublished());
  }, []);

  // Persist history when it changes
  useEffect(() => {
    if (history.length > 0) {
      saveHistory(history);
    }
  }, [history]);

  // Persist published when it changes
  useEffect(() => {
    if (published.length > 0) {
      savePublished(published);
    }
  }, [published]);

  // Sync speech transcript → editable transcript
  useEffect(() => {
    if (speechTranscript) {
      setTranscript(speechTranscript);
    }
  }, [speechTranscript]);

  // Browser support check (client-side only)
  const [showBrowserWarning, setShowBrowserWarning] = useState(false);
  useEffect(() => {
    setShowBrowserWarning(!isSupported);
  }, [isSupported]);

  // Add to history
  const addToHistory = useCallback(
    (generatedEmail: string) => {
      const item: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        transcript: transcript.trim(),
        email: generatedEmail,
        tones: [...tones],
        style,
        length,
        recipientContext,
      };
      setHistory((prev) => [item, ...prev].slice(0, 50));
      setActiveHistoryId(item.id);
    },
    [transcript, tones, style, length, recipientContext]
  );

  // Generate email only (does NOT auto-open Outlook)
  const handleGenerate = useCallback(async () => {
    if (!transcript.trim() || isGenerating) return;

    if (isListening) {
      stopListening();
    }

    setCompletion("");
    setActiveHistoryId(null);

    const result = await complete("", {
      body: {
        transcript: transcript.trim(),
        tones,
        style,
        length,
        recipientContext,
      },
    });

    if (result) {
      addToHistory(result);
      setToast("Email generated & saved! Review it below, then copy or open in Outlook.");
      setTimeout(() => setToast(null), 3000);
    }
  }, [
    transcript,
    tones,
    style,
    length,
    recipientContext,
    isGenerating,
    isListening,
    stopListening,
    complete,
    setCompletion,
    addToHistory,
  ]);

  // Copy email
  const handleCopy = useCallback(async () => {
    if (email) {
      const success = await copyToClipboard(email);
      if (success) {
        setToast("Email copied to clipboard!");
        setTimeout(() => setToast(null), 2500);
      }
    }
  }, [email, copyToClipboard]);

  // Open in Outlook
  const handleOutlook = useCallback(async () => {
    if (email) {
      await openInOutlook(email);
      setToast("Outlook opened with your email!");
      setTimeout(() => setToast(null), 3000);
    }
  }, [email, openInOutlook]);

  // Share / Publish
  const handleShare = useCallback(async () => {
    if (!email || isSharing) return;
    setIsSharing(true);

    const shareData: SharedEmailData = {
      transcript: transcript.trim(),
      email,
      tones: tones.join(","),
      style,
      timestamp: Date.now(),
    };

    let url = "";

    // Try Vercel KV short URL first
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shareData),
      });

      if (res.ok) {
        const { url: shortUrl } = await res.json();
        url = shortUrl;
      }
    } catch {
      // KV unavailable — fall through to hash URL
    }

    // Fallback to hash-based URL
    if (!url) {
      url = buildShareUrl(shareData);
    }

    // Add to published list
    const publishedItem: PublishedItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      transcript: transcript.trim(),
      email,
      tones: tones.join(","),
      url,
    };
    setPublished((prev) => [publishedItem, ...prev].slice(0, 50));

    setShareUrl(url);
    setShareModalOpen(true);
    setIsSharing(false);
    setToast("Email published! Share the link with anyone.");
    setTimeout(() => setToast(null), 3000);
  }, [email, transcript, tones, style, isSharing]);

  // History: select item to restore
  const handleHistorySelect = useCallback(
    (item: HistoryItem) => {
      setTranscript(item.transcript);
      setCompletion(item.email);
      setTones(item.tones);
      setStyle(item.style);
      setLength(item.length);
      setRecipientContext(item.recipientContext);
      setActiveHistoryId(item.id);
      setIsHistoryOpen(false);
      setToast("Email restored from history!");
      setTimeout(() => setToast(null), 2000);
    },
    [setCompletion]
  );

  // History: delete item
  const handleHistoryDelete = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      if (updated.length === 0) {
        try { localStorage.removeItem("emailbuilder-history"); } catch { /* ignore */ }
      }
      return updated;
    });
    setActiveHistoryId((prev) => (prev === id ? null : prev));
  }, []);

  // History: clear all
  const handleHistoryClear = useCallback(() => {
    setHistory([]);
    setActiveHistoryId(null);
    try { localStorage.removeItem("emailbuilder-history"); } catch { /* ignore */ }
  }, []);

  // Published: delete item
  const handlePublishedDelete = useCallback((id: string) => {
    setPublished((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      if (updated.length === 0) {
        try { localStorage.removeItem("emailbuilder-published"); } catch { /* ignore */ }
      }
      return updated;
    });
  }, []);

  // Published: clear all
  const handlePublishedClear = useCallback(() => {
    setPublished([]);
    try { localStorage.removeItem("emailbuilder-published"); } catch { /* ignore */ }
  }, []);

  // Clear transcript only
  const handleClear = useCallback(() => {
    setTranscript("");
    resetTranscript();
  }, [resetTranscript]);

  // Start fresh — clear everything
  const handleNewEmail = useCallback(() => {
    if (isListening) {
      stopListening();
    }
    setTranscript("");
    resetTranscript();
    setCompletion("");
    setRecipientContext("");
    setTones(["normal"]);
    setActiveHistoryId(null);
    setToast("Ready for a new email!");
    setTimeout(() => setToast(null), 2000);
  }, [isListening, stopListening, resetTranscript, setCompletion]);

  return (
    <div className="relative z-10 min-h-screen pb-24 md:pb-8">
      {/* Email History Sidebar */}
      <EmailHistory
        history={history}
        activeId={activeHistoryId}
        onSelect={handleHistorySelect}
        onDelete={handleHistoryDelete}
        onClear={handleHistoryClear}
        isOpen={isHistoryOpen}
        onToggle={() => setIsHistoryOpen((prev) => !prev)}
        published={published}
        onPublishedDelete={handlePublishedDelete}
        onPublishedClear={handlePublishedClear}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        shareUrl={shareUrl}
      />

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Header />

        {/* Browser Warning */}
        {showBrowserWarning && <BrowserWarning />}

        {/* Voice Recorder */}
        <VoiceRecorder
          isListening={isListening}
          isSupported={isSupported}
          interimTranscript={interimTranscript}
          onStart={startListening}
          onStop={stopListening}
        />

        {/* Transcript Editor */}
        <TranscriptEditor
          value={transcript}
          onChange={setTranscript}
          onClear={handleClear}
          isListening={isListening}
        />

        {/* Control Panel */}
        <ControlPanel
          tones={tones}
          style={style}
          length={length}
          recipientContext={recipientContext}
          onTonesChange={setTones}
          onStyleChange={setStyle}
          onLengthChange={setLength}
          onRecipientContextChange={setRecipientContext}
        />

        {/* Generate Button + New Email */}
        <div className="px-4 md:px-0 py-4 flex gap-3">
          <button
            onClick={handleGenerate}
            disabled={!transcript.trim() || isGenerating}
            className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-teal text-white font-bold text-base transition-all hover:brightness-110 hover:shadow-lg hover:shadow-accent-blue/20 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100 disabled:hover:shadow-none cursor-pointer"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Generating...
              </span>
            ) : (
              "✨ Generate Email"
            )}
          </button>

          {/* New Email button — shows when there's content to clear */}
          {(transcript.trim() || email) && !isGenerating && (
            <button
              onClick={handleNewEmail}
              className="px-4 py-3.5 rounded-xl bg-bg-card border border-border-subtle text-text-secondary font-semibold text-sm transition-all hover:border-accent-rose/40 hover:text-accent-rose active:scale-[0.98] cursor-pointer whitespace-nowrap"
              title="Clear and start a new email"
            >
              New
            </button>
          )}
        </div>

        {/* Email Preview */}
        <EmailPreview email={email} isStreaming={isGenerating} />

        {/* Export Bar */}
        <ExportBar
          email={email}
          copied={copied}
          onCopy={handleCopy}
          onOutlook={handleOutlook}
          onRegenerate={handleGenerate}
          onShare={handleShare}
          isGenerating={isGenerating}
          isSharing={isSharing}
        />
      </div>

      {/* Toast notification */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-fade_in">
          <div className="bg-bg-card border border-accent-teal/30 text-text-primary px-4 py-2.5 rounded-xl shadow-xl text-sm font-medium">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
