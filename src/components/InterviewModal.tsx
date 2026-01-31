"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

interface Message {
  role: "assistant" | "user";
  content: string;
}

interface InterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (email: string) => void;
  initialTranscript: string;
  existingEmail?: string;
}

export default function InterviewModal({
  isOpen,
  onClose,
  onComplete,
  initialTranscript,
  existingEmail,
}: InterviewModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [finalEmail, setFinalEmail] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autoSendRef = useRef(false);
  const sendMessageRef = useRef<() => void>(() => {});

  const {
    isListening,
    transcript: speechTranscript,
    interimTranscript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTranscriptRef = useRef("");

  // Sync speech → input + auto-send on 3s pause
  useEffect(() => {
    if (speechTranscript) {
      setInput(speechTranscript);

      // Clear existing timer
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
      }

      // Only start timer if transcript actually changed (new words spoken)
      if (speechTranscript !== lastTranscriptRef.current) {
        lastTranscriptRef.current = speechTranscript;

        // Auto-send after 3 seconds of silence
        pauseTimerRef.current = setTimeout(() => {
          if (speechTranscript.trim() && !isLoading && !isComplete) {
            autoSendRef.current = true;
            sendMessageRef.current();
          }
        }, 3000);
      }
    }
  }, [speechTranscript, isLoading, isComplete]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Start interview when modal opens
  useEffect(() => {
    if (isOpen) {
      setMessages([]);
      setInput("");
      setIsComplete(false);
      setFinalEmail("");
      resetTranscript();
      startInterview();
    } else {
      if (isListening) {
        stopListening();
        resetTranscript();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Focus input when not loading
  useEffect(() => {
    if (isOpen && !isLoading && !isComplete) {
      inputRef.current?.focus();
    }
  }, [isOpen, isLoading, isComplete]);

  const startInterview = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start",
          transcript: initialTranscript,
          messages: [],
          existingEmail,
        }),
      });
      const data = await res.json();

      if (data.isComplete) {
        setIsComplete(true);
        setFinalEmail(data.finalEmail);
        setMessages([{ role: "assistant", content: "Your email is ready!" }]);
      } else {
        setMessages([{ role: "assistant", content: data.message }]);
      }
    } catch {
      setMessages([{ role: "assistant", content: "Let's build your email! What's the main purpose of this email?" }]);
    }
    setIsLoading(false);
  }, [initialTranscript, existingEmail]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const isAutoSend = autoSendRef.current;
    autoSendRef.current = false;

    // Only stop mic if manually sending (not auto-send)
    if (!isAutoSend && isListening) {
      stopListening();
    }
    resetTranscript();
    lastTranscriptRef.current = "";

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "continue",
          transcript: initialTranscript,
          messages: newMessages,
          existingEmail,
        }),
      });
      const data = await res.json();

      if (data.isComplete) {
        setIsComplete(true);
        setFinalEmail(data.finalEmail);
        setMessages([...newMessages, { role: "assistant", content: "Your email is ready!" }]);
      } else {
        setMessages([...newMessages, { role: "assistant", content: data.message }]);
      }
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "I think I have enough to work with. Click 'Generate Email' below!" }]);
    }
    setIsLoading(false);
  }, [input, messages, isLoading, isListening, stopListening, resetTranscript, initialTranscript, existingEmail]);

  // Keep ref in sync so timer callback can call latest sendMessage
  useEffect(() => {
    sendMessageRef.current = sendMessage;
  }, [sendMessage]);

  const handleGenerateNow = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate",
          transcript: initialTranscript,
          messages,
          existingEmail,
        }),
      });
      const data = await res.json();

      if (data.isComplete) {
        setIsComplete(true);
        setFinalEmail(data.finalEmail);
      } else if (data.message) {
        // AI didn't produce a complete email, try to use the message as email
        setIsComplete(true);
        setFinalEmail(data.message);
      }
    } catch {
      // noop
    }
    setIsLoading(false);
  }, [messages, initialTranscript, existingEmail]);

  const handleUseEmail = useCallback(() => {
    onComplete(finalEmail);
    onClose();
  }, [finalEmail, onComplete, onClose]);

  const handleClose = useCallback(() => {
    if (isListening) {
      stopListening();
      resetTranscript();
    }
    onClose();
  }, [isListening, stopListening, resetTranscript, onClose]);

  const toggleVoice = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  }, [isListening, stopListening, resetTranscript, startListening]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade_in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-bg-secondary border-2 border-accent-purple/30 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-gradient-to-r from-accent-purple/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">Interview Mode</h2>
              <p className="text-xs text-text-muted">AI-powered email builder</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-bg-card text-text-muted hover:text-text-primary transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-accent-purple text-white rounded-br-md"
                    : "bg-bg-card border border-border-subtle text-text-primary rounded-bl-md"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-bg-card border border-border-subtle px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent-purple/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-accent-purple/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-accent-purple/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          {/* Completion card */}
          {isComplete && finalEmail && (
            <div className="bg-accent-teal/10 border border-accent-teal/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-accent-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-semibold text-accent-teal">Email Ready</span>
              </div>
              <p className="text-xs text-text-secondary line-clamp-3 whitespace-pre-wrap">
                {finalEmail.substring(0, 200)}...
              </p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Interim transcript */}
        {isListening && interimTranscript && (
          <div className="px-4 pb-2">
            <div className="p-3 rounded-xl bg-accent-purple/10 border border-accent-purple/30">
              <p className="text-sm text-text-secondary italic">{interimTranscript}</p>
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="p-4 border-t border-border-subtle bg-bg-card/50">
          {isComplete ? (
            <div className="flex gap-2">
              <button
                onClick={handleUseEmail}
                className="flex-1 py-2.5 rounded-xl bg-accent-teal text-white font-semibold text-sm transition-all hover:brightness-110 active:scale-[0.98] cursor-pointer"
              >
                Use This Email
              </button>
              <button
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl bg-bg-card border border-border-subtle text-text-secondary font-semibold text-sm transition-all hover:border-accent-rose/40 hover:text-accent-rose active:scale-[0.98] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-2 mb-3">
                {/* Voice button */}
                {isSupported && (
                  <button
                    onClick={toggleVoice}
                    className={`relative p-2.5 rounded-xl transition-all cursor-pointer flex-shrink-0 ${
                      isListening
                        ? "bg-accent-purple text-white"
                        : "bg-bg-card border border-border-subtle text-text-secondary hover:border-accent-purple/40 hover:text-accent-purple"
                    }`}
                  >
                    {isListening && (
                      <>
                        <span className="absolute inset-0 rounded-xl bg-accent-purple/30 animate-pulse" />
                        <span className="absolute inset-0 rounded-xl bg-accent-purple/20 animate-pulse" style={{ animationDelay: "0.5s" }} />
                      </>
                    )}
                    <svg className="w-5 h-5 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                      {isListening ? (
                        <rect x="6" y="6" width="12" height="12" rx="2" />
                      ) : (
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                      )}
                    </svg>
                  </button>
                )}

                {/* Text input */}
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isListening ? "Listening..." : "Type your answer..."}
                  disabled={isLoading}
                  className="flex-1 bg-bg-card border border-border-subtle rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent-purple/40 focus:ring-1 focus:ring-accent-purple/20 transition-all disabled:opacity-50"
                />

                {/* Send button */}
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="p-2.5 rounded-xl bg-accent-purple text-white transition-all hover:brightness-110 active:scale-[0.95] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex-shrink-0"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
                  </svg>
                </button>
              </div>

              {/* Generate now button */}
              {messages.length >= 3 && !isLoading && (
                <button
                  onClick={handleGenerateNow}
                  className="w-full py-2 rounded-xl bg-bg-card border border-accent-teal/30 text-accent-teal font-medium text-xs transition-all hover:bg-accent-teal/10 active:scale-[0.98] cursor-pointer"
                >
                  Generate Email Now
                </button>
              )}

              {/* Recording indicator */}
              {isListening && (
                <p className="text-xs text-accent-purple font-medium text-center mt-2 animate-pulse">
                  🎙 Listening... speak your answer
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
