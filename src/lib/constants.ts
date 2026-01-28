import { ToneOption, StyleOption, LengthOption } from "./types";

export const TONE_OPTIONS: ToneOption[] = [
  {
    id: "follow-up",
    label: "Follow Up",
    description: "Check in, nudge, or circle back",
    color: "bg-accent-blue",
  },
  {
    id: "request",
    label: "Request",
    description: "Ask for something or get approval",
    color: "bg-accent-teal",
  },
  {
    id: "thank-you",
    label: "Thank You",
    description: "Show appreciation or recognition",
    color: "bg-accent-teal",
  },
  {
    id: "bad-news",
    label: "Bad News",
    description: "Decline, deny, or deliver tough info",
    color: "bg-accent-rose",
  },
  {
    id: "urgent",
    label: "Urgent",
    description: "Time-sensitive, needs immediate action",
    color: "bg-accent-amber",
  },
  {
    id: "introduction",
    label: "Introduction",
    description: "First contact or warm intro",
    color: "bg-accent-blue",
  },
  {
    id: "update",
    label: "Update",
    description: "Share progress, status, or news",
    color: "bg-accent-teal",
  },
  {
    id: "apology",
    label: "Apology",
    description: "Own a mistake or smooth things over",
    color: "bg-accent-rose",
  },
];

export const STYLE_OPTIONS: StyleOption[] = [
  {
    id: "professional",
    label: "Professional",
    description: "Formal business language",
  },
  {
    id: "casual",
    label: "Casual",
    description: "Relaxed, everyday language",
  },
  {
    id: "conversational",
    label: "Conversational",
    description: "Natural flow, like speaking",
  },
];

export const LENGTH_OPTIONS: LengthOption[] = [
  { id: "condense", label: "Condense", icon: "−" },
  { id: "default", label: "Default", icon: "○" },
  { id: "extend", label: "Extend", icon: "+" },
];