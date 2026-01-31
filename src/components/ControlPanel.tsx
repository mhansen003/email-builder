"use client";

import { ToneId, StyleId, LengthId } from "@/lib/types";
import ToneSelector from "./ToneSelector";
import StyleSelector from "./StyleSelector";
import LengthControls from "./LengthControls";

interface ControlPanelProps {
  tone: ToneId;
  style: StyleId;
  length: LengthId;
  onToneChange: (tone: ToneId) => void;
  onStyleChange: (style: StyleId) => void;
  onLengthChange: (length: LengthId) => void;
}

export default function ControlPanel({
  tone,
  style,
  length,
  onToneChange,
  onStyleChange,
  onLengthChange,
}: ControlPanelProps) {
  return (
    <div className="px-4 md:px-0 space-y-3 py-3">
      <ToneSelector selected={tone} onSelect={onToneChange} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <StyleSelector selected={style} onSelect={onStyleChange} />
        <LengthControls selected={length} onSelect={onLengthChange} />
      </div>
    </div>
  );
}
