"use client";

import { useRef, useEffect, useCallback } from "react";

interface EmailPreviewProps {
  email: string;
  isStreaming: boolean;
  onEmailChange?: (email: string) => void;
}

export default function EmailPreview({ email, isStreaming, onEmailChange }: EmailPreviewProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Split subject from body
  const lines = email.split("\n");
  let subject = "";
  let bodyStartIndex = 0;

  if (lines[0]?.toLowerCase().startsWith("subject:")) {
    subject = lines[0].replace(/^subject:\s*/i, "").trim();
    bodyStartIndex = 1;
    if (lines[1]?.trim() === "") {
      bodyStartIndex = 2;
    }
  }

  const body = lines.slice(bodyStartIndex).join("\n").trim();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [body]);

  // Handle body editing — reconstruct the full email with subject
  const handleBodyChange = useCallback(
    (newBody: string) => {
      if (!onEmailChange) return;
      if (subject) {
        onEmailChange(`Subject: ${subject}\n\n${newBody}`);
      } else {
        onEmailChange(newBody);
      }
    },
    [onEmailChange, subject]
  );

  if (!email) return null;

  return (
    <div className="animate-fade_in">
      <label className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2 block">
        Generated Email
        {onEmailChange && (
          <span className="ml-2 text-accent-teal/60 normal-case tracking-normal font-medium">
            — click to edit
          </span>
        )}
      </label>
      <div className="bg-bg-card border border-border-subtle rounded-xl overflow-hidden">
        {/* Subject line */}
        {subject && (
          <div className="px-4 py-3 border-b border-border-subtle bg-bg-secondary/50">
            <span className="text-xs text-text-muted font-medium">Subject:</span>
            <p className="text-text-primary font-semibold text-sm mt-0.5">{subject}</p>
          </div>
        )}

        {/* Email body — editable textarea */}
        <div className="px-4 py-4">
          <textarea
            ref={textareaRef}
            value={body}
            onChange={(e) => handleBodyChange(e.target.value)}
            readOnly={!onEmailChange || isStreaming}
            className={`w-full bg-transparent text-text-primary text-sm leading-relaxed whitespace-pre-wrap font-sans resize-none focus:outline-none ${
              isStreaming ? "typing-cursor" : ""
            } ${onEmailChange ? "hover:bg-bg-secondary/30 focus:bg-bg-secondary/30 rounded-lg -mx-2 px-2 -my-1 py-1 transition-colors" : ""}`}
          />
        </div>
      </div>
    </div>
  );
}
