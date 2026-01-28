"use client";

interface EmailPreviewProps {
  email: string;
  isStreaming: boolean;
}

export default function EmailPreview({ email, isStreaming }: EmailPreviewProps) {
  if (!email) return null;

  // Split subject from body
  const lines = email.split("\n");
  let subject = "";
  let bodyLines = lines;

  if (lines[0]?.toLowerCase().startsWith("subject:")) {
    subject = lines[0].replace(/^subject:\s*/i, "").trim();
    bodyLines = lines.slice(1);
    // Skip blank line after subject
    if (bodyLines[0]?.trim() === "") {
      bodyLines = bodyLines.slice(1);
    }
  }

  const body = bodyLines.join("\n").trim();

  return (
    <div className="px-4 md:px-0 animate-fade_in">
      <label className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2 block">
        Generated Email
      </label>
      <div className="bg-bg-card border border-border-subtle rounded-xl overflow-hidden">
        {/* Subject line */}
        {subject && (
          <div className="px-4 py-3 border-b border-border-subtle bg-bg-secondary/50">
            <span className="text-xs text-text-muted font-medium">
              Subject:
            </span>
            <p className="text-text-primary font-semibold text-sm md:text-base mt-0.5">
              {subject}
            </p>
          </div>
        )}

        {/* Email body */}
        <div className="px-4 py-4">
          <div
            className={`text-text-primary text-sm md:text-base leading-relaxed whitespace-pre-wrap font-sans ${
              isStreaming ? "typing-cursor" : ""
            }`}
          >
            {body}
          </div>
        </div>
      </div>
    </div>
  );
}
