import LZString from "lz-string";
import { ToneId, StyleId, LengthId } from "./types";

// ── Interfaces ──────────────────────────────────────

export interface HistoryItem {
  id: string;
  timestamp: number;
  transcript: string;
  email: string;
  tones: ToneId[];
  style: StyleId;
  length: LengthId;
  recipientContext: string;
}

export interface SharedEmailData {
  transcript: string;
  email: string;
  tones: string;
  style: string;
  timestamp: number;
}

export interface PublishedItem {
  id: string;
  timestamp: number;
  transcript: string;
  email: string;
  tones: string;
  url: string;
}

// ── Storage Keys ────────────────────────────────────

const HISTORY_KEY = "emailbuilder-history";
const PUBLISHED_KEY = "emailbuilder-published";
const MAX_ITEMS = 50;

// ── History (localStorage) ──────────────────────────

export function loadHistory(): HistoryItem[] {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore
  }
  return [];
}

export function saveHistory(items: HistoryItem[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
  } catch {
    // ignore
  }
}

// ── Published (localStorage) ────────────────────────

export function loadPublished(): PublishedItem[] {
  try {
    const saved = localStorage.getItem(PUBLISHED_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore
  }
  return [];
}

export function savePublished(items: PublishedItem[]): void {
  try {
    localStorage.setItem(PUBLISHED_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
  } catch {
    // ignore
  }
}

// ── Share Encoding (lz-string) ──────────────────────

export function encodeEmailData(data: SharedEmailData): string {
  const json = JSON.stringify(data);
  return LZString.compressToEncodedURIComponent(json);
}

export function decodeEmailData(encoded: string): SharedEmailData | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    const data = JSON.parse(json);
    if (!data.email || !data.transcript) return null;
    return data as SharedEmailData;
  } catch {
    return null;
  }
}

export function buildShareUrl(data: SharedEmailData): string {
  const encoded = encodeEmailData(data);
  const base = typeof window !== "undefined" ? window.location.origin : "";
  return `${base}/shared#${encoded}`;
}
