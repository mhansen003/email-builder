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
import InterviewModal from "@/components/InterviewModal";
import AboutModal from "@/components/AboutModal";

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

  // Controls
  const [tone, setTone] = useState<ToneId>("normal");
  const [style, setStyle] = useState<StyleId>("professional");
  const [length, setLength] = useState<LengthId>("default");

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

  // Interview modal
  const [showInterview, setShowInterview] = useState(false);

  // About modal
  const [showAbout, setShowAbout] = useState(false);

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
        tones: [tone],
        style,
        length,
        recipientContext: "",
      };
      setHistory((prev) => [item, ...prev].slice(0, 50));
      setActiveHistoryId(item.id);
    },
    [transcript, tone, style, length]
  );

  // Generate email
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
        tones: [tone],
        style,
        length,
        recipientContext: "",
      },
    });

    if (result) {
      addToHistory(result);
      setToast("Email generated!");
      setTimeout(() => setToast(null), 3000);
    }
  }, [
    transcript,
    tone,
    style,
    length,
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
      tones: tone,
      style,
      timestamp: Date.now(),
    };

    let url = "";

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
      // KV unavailable
    }

    if (!url) {
      url = buildShareUrl(shareData);
    }

    const publishedItem: PublishedItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      transcript: transcript.trim(),
      email,
      tones: tone,
      url,
    };
    setPublished((prev) => [publishedItem, ...prev].slice(0, 50));

    setShareUrl(url);
    setShareModalOpen(true);
    setIsSharing(false);
    setToast("Email published!");
    setTimeout(() => setToast(null), 3000);
  }, [email, transcript, tone, style, isSharing]);

  // History: select item to restore
  const handleHistorySelect = useCallback(
    (item: HistoryItem) => {
      setTranscript(item.transcript);
      setCompletion(item.email);
      setTone(item.tones[0] || "normal");
      setStyle(item.style);
      setLength(item.length);
      setActiveHistoryId(item.id);
      setIsHistoryOpen(false);
      setToast("Email restored from history!");
      setTimeout(() => setToast(null), 2000);
    },
    [setCompletion]
  );

  // History: delete / clear
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

  const handleHistoryClear = useCallback(() => {
    setHistory([]);
    setActiveHistoryId(null);
    try { localStorage.removeItem("emailbuilder-history"); } catch { /* ignore */ }
  }, []);

  const handlePublishedDelete = useCallback((id: string) => {
    setPublished((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      if (updated.length === 0) {
        try { localStorage.removeItem("emailbuilder-published"); } catch { /* ignore */ }
      }
      return updated;
    });
  }, []);

  const handlePublishedClear = useCallback(() => {
    setPublished([]);
    try { localStorage.removeItem("emailbuilder-published"); } catch { /* ignore */ }
  }, []);

  // Clear transcript only
  const handleClear = useCallback(() => {
    setTranscript("");
    resetTranscript();
  }, [resetTranscript]);

  // Start fresh
  const handleNewEmail = useCallback(() => {
    if (isListening) stopListening();
    setTranscript("");
    resetTranscript();
    setCompletion("");
    setTone("normal");
    setActiveHistoryId(null);
    setToast("Ready for a new email!");
    setTimeout(() => setToast(null), 2000);
  }, [isListening, stopListening, resetTranscript, setCompletion]);

  // Interview complete → set email directly
  const handleInterviewComplete = useCallback(
    (generatedEmail: string) => {
      setCompletion(generatedEmail);
      addToHistory(generatedEmail);
      setToast("Email created from interview!");
      setTimeout(() => setToast(null), 3000);
    },
    [setCompletion, addToHistory]
  );

  return (
    <div className="relative z-10 min-h-screen pb-24 lg:pb-8">
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

      {/* About Modal */}
      <AboutModal
        isOpen={showAbout}
        onClose={() => setShowAbout(false)}
      />

      {/* Interview Modal */}
      <InterviewModal
        isOpen={showInterview}
        onClose={() => setShowInterview(false)}
        onComplete={handleInterviewComplete}
        initialTranscript={transcript}
        existingEmail={email || undefined}
      />

      {/* Header — full width above columns */}
      <div className="max-w-7xl mx-auto">
        <Header onAbout={() => setShowAbout(true)} />
        {showBrowserWarning && (
          <div className="max-w-2xl mx-auto">
            <BrowserWarning />
          </div>
        )}
      </div>

      {/* Voice Recorder — centered above both columns */}
      <div className="max-w-7xl mx-auto lg:px-6">
        <VoiceRecorder
          isListening={isListening}
          isSupported={isSupported}
          interimTranscript={interimTranscript}
          onStart={startListening}
          onStop={stopListening}
          onInterview={() => setShowInterview(true)}
        />
      </div>

      {/* Two-column layout on desktop */}
      <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-[3fr_2fr] gap-4 sm:gap-6 lg:px-6 lg:items-start">
        {/* ═══ LEFT COLUMN: Input & Controls ═══ */}
        <div className="max-w-xl mx-auto lg:max-w-none lg:mx-0">
          {/* Transcript Editor */}
          <TranscriptEditor
            value={transcript}
            onChange={setTranscript}
            onClear={handleClear}
            isListening={isListening}
          />

          {/* Control Panel */}
          <ControlPanel
            tone={tone}
            style={style}
            length={length}
            onToneChange={setTone}
            onStyleChange={setStyle}
            onLengthChange={setLength}
          />

          {/* Generate Button + New Email */}
          <div className="px-4 md:px-0 lg:px-0 py-3 flex gap-3">
            <button
              onClick={handleGenerate}
              disabled={!transcript.trim() || isGenerating}
              className={`flex-1 py-3 rounded-xl bg-accent-blue text-white font-bold text-sm transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100 disabled:hover:shadow-none cursor-pointer ${
                transcript.trim() && !isGenerating
                  ? "shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-btn-glow"
                  : ""
              }`}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating...
                </span>
              ) : (
                "✨ Generate Email"
              )}
            </button>

            {(transcript.trim() || email) && !isGenerating && (
              <button
                onClick={handleNewEmail}
                className="px-4 py-3 rounded-xl bg-accent-teal text-white font-semibold text-sm transition-all hover:brightness-110 active:scale-[0.98] cursor-pointer whitespace-nowrap"
                title="Clear and start a new email"
              >
                New
              </button>
            )}
          </div>
        </div>

        {/* ═══ RIGHT COLUMN: Preview & Export (sticky on desktop) ═══ */}
        <div className="lg:sticky lg:top-6 lg:self-stretch max-w-xl mx-auto lg:max-w-none lg:mx-0">
          {email ? (
            <div className="px-4 md:px-0 lg:px-0">
              <EmailPreview email={email} isStreaming={isGenerating} />
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
          ) : (
            <div className="hidden lg:flex flex-col items-center justify-center rounded-2xl border-2 border-accent-teal/40 border-dashed bg-bg-card/30 h-full text-center px-8">
              <div className="w-14 h-14 rounded-2xl bg-bg-card border border-border-subtle flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-text-muted/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-text-muted text-sm">Your generated email will appear here</p>
              <p className="text-text-muted/50 text-xs mt-1">Record, type, or drop a text file to get started</p>
            </div>
          )}
        </div>
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
