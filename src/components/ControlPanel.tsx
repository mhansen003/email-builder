"use client";

import { ToneId, StyleId, LengthId } from "@/lib/types";
import ToneSelector from "./ToneSelector";
import StyleSelector from "./StyleSelector";
import LengthControls from "./LengthControls";

interface ControlPanelProps {
  tone: ToneId;
  style: StyleId;
  length: LengthId;
  recipientContext: string;
  onToneChange: (tone: ToneId) => void;
  onStyleChange: (style: StyleId) => void;
  onLengthChange: (length: LengthId) => void;
  onRecipientContextChange: (context: string) => void;
}

export default function ControlPanel({
  tone,
  style,
  length,
  recipientContext,
  onToneChange,
  onStyleChange,
  onLengthChange,
  onRecipientContextChange,
}: ControlPanelProps) {
  return (
    <div className="px-4 md:px-0 space-y-5 py-4">
      <ToneSelector selected={tone} onSelect={onToneChange} />
      <StyleSelector selected={style} onSelect={onStyleChange} />
      <LengthControls selected={length} onSelect={onLengthChange} />

      {/* Recipient Context */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2 block">
          Recipient Context{" "}
          <span className="text-text-muted/50 normal-case">(optional)</span>
        </label>
        <input
          type="text"
          value={recipientContext}
          onChange={(e) => onRecipientContextChange(e.target.value)}
          placeholder="e.g., My manager, a client, a vendor..."
          className="w-full bg-bg-card border border-border-subtle rounded-xl px-4 py-2.5 text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent-blue/40 focus:ring-1 focus:ring-accent-blue/20 transition-all text-sm"
        />
      </div>
    </div>
  );
}
