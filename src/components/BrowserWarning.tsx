"use client";

export default function BrowserWarning() {
  return (
    <div className="mx-4 mb-4 p-3 rounded-xl bg-accent-amber/10 border border-accent-amber/20 text-center">
      <p className="text-accent-amber text-sm font-medium">
        ⚠️ Voice recording requires Chrome or Edge
      </p>
      <p className="text-text-muted text-xs mt-1">
        Type your message in the text box below instead
      </p>
    </div>
  );
}
