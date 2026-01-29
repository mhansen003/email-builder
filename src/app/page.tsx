"use client";

import { useState, useEffect, useCallback } from "react";
import { useCompletion } from "@ai-sdk/react";
import { ToneId, StyleId, LengthId } from "@/lib/types";
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
  const [recipientContext, setRecipientContext] = useState("");

  // Toast
  const [toast, setToast] = useState<string | null>(null);

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

  // Generate email only (does NOT auto-open Outlook)
  const handleGenerate = useCallback(async () => {
    if (!transcript.trim() || isGenerating) return;

    if (isListening) {
      stopListening();
    }

    setCompletion("");

    const result = await complete("", {
      body: {
        transcript: transcript.trim(),
        tone,
        style,
        length,
        recipientContext,
      },
    });

    if (result) {
      setToast("Email generated! Review it below, then copy or open in Outlook.");
      setTimeout(() => setToast(null), 3000);
    }
  }, [
    transcript,
    tone,
    style,
    length,
    recipientContext,
    isGenerating,
    isListening,
    stopListening,
    complete,
    setCompletion,
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
      setToast("Outlook opened — paste email body with Ctrl+V above your signature");
      setTimeout(() => setToast(null), 5000);
    }
  }, [email, openInOutlook]);

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
    setToast("Ready for a new email!");
    setTimeout(() => setToast(null), 2000);
  }, [isListening, stopListening, resetTranscript, setCompletion]);

  return (
    <div className="relative z-10 min-h-screen pb-24 md:pb-8">
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
          tone={tone}
          style={style}
          length={length}
          recipientContext={recipientContext}
          onToneChange={setTone}
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
          isGenerating={isGenerating}
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
