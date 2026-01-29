import { ToneOption, StyleOption, LengthOption } from "./types";

export const TONE_OPTIONS: ToneOption[] = [
  // General tones
  {
    id: "normal",
    label: "Normal",
    description: "Standard, balanced email",
    color: "bg-text-muted",
  },
  {
    id: "friendly",
    label: "Friendly",
    description: "Warm and personable",
    color: "bg-accent-teal",
  },
  {
    id: "formal",
    label: "Formal",
    description: "Official, buttoned-up language",
    color: "bg-accent-blue",
  },
  {
    id: "excited",
    label: "Excited",
    description: "Enthusiastic, high energy",
    color: "bg-accent-amber",
  },
  // Action tones
  {
    id: "follow-up",
    label: "Follow Up",
    description: "Circle back, check in",
    color: "bg-accent-blue",
  },
  {
    id: "request",
    label: "Request",
    description: "Ask for something",
    color: "bg-accent-teal",
  },
  {
    id: "thank-you",
    label: "Thank You",
    description: "Show appreciation",
    color: "bg-accent-teal",
  },
  {
    id: "congratulations",
    label: "Congrats",
    description: "Celebrate someone's win",
    color: "bg-accent-amber",
  },
  {
    id: "reminder",
    label: "Reminder",
    description: "Gentle nudge",
    color: "bg-accent-blue",
  },
  {
    id: "update",
    label: "Update",
    description: "Share status or news",
    color: "bg-accent-teal",
  },
  {
    id: "introduction",
    label: "Intro",
    description: "First contact",
    color: "bg-accent-blue",
  },
  {
    id: "feedback",
    label: "Feedback",
    description: "Give constructive input",
    color: "bg-accent-teal",
  },
  // Sensitive tones
  {
    id: "apology",
    label: "Apology",
    description: "Own a mistake",
    color: "bg-accent-rose",
  },
  {
    id: "urgent",
    label: "Urgent",
    description: "Needs action NOW",
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