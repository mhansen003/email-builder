import { ToneOption, StyleOption, LengthOption } from "./types";

export const TONE_OPTIONS: ToneOption[] = [
  {
    id: "friendly",
    label: "Friendly",
    description: "Warm, personable, casual greetings",
    color: "bg-accent-teal",
  },
  {
    id: "executive",
    label: "Executive",
    description: "Authoritative, concise, decisive",
    color: "bg-accent-blue",
  },
  {
    id: "disc-d",
    label: "DISC: Dominance",
    description: "Direct, results-oriented, bottom-line",
    color: "bg-accent-rose",
  },
  {
    id: "disc-i",
    label: "DISC: Influence",
    description: "Enthusiastic, collaborative, optimistic",
    color: "bg-accent-amber",
  },
  {
    id: "disc-s",
    label: "DISC: Steadiness",
    description: "Calm, supportive, team-oriented",
    color: "bg-accent-teal",
  },
  {
    id: "disc-c",
    label: "DISC: Conscientiousness",
    description: "Analytical, precise, detail-oriented",
    color: "bg-accent-blue",
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