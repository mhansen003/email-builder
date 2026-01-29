export type ToneId =
  | "normal"
  | "friendly"
  | "formal"
  | "excited"
  | "follow-up"
  | "request"
  | "thank-you"
  | "congratulations"
  | "reminder"
  | "update"
  | "introduction"
  | "feedback"
  | "bad-news"
  | "apology"
  | "urgent";

export type StyleId = "professional" | "casual" | "conversational";

export type LengthId = "condense" | "default" | "extend";

export interface ToneOption {
  id: ToneId;
  label: string;
  description: string;
  color: string;
}

export interface StyleOption {
  id: StyleId;
  label: string;
  description: string;
}

export interface LengthOption {
  id: LengthId;
  label: string;
  icon: string;
}

export interface EmailGenerationRequest {
  transcript: string;
  tone: ToneId;
  style: StyleId;
  length: LengthId;
  recipientContext: string;
}
