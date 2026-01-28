import { ToneId, StyleId, LengthId } from "./types";

const TONE_INSTRUCTIONS: Record<ToneId, string> = {
  friendly:
    "Write in a warm, personable tone. Use casual greetings like 'Hi' or 'Hey'. Be approachable and add a friendly touch, perhaps asking how they're doing or referencing something personal.",
  executive:
    "Write in an authoritative, executive tone. Be concise and decisive. Lead with the key point. Use confident language. Keep sentences short and impactful. No filler words.",
  "disc-d":
    "Write for a Dominance (D) personality. Be extremely direct and results-oriented. Lead with the bottom line. Skip pleasantries. Focus on outcomes, decisions, and action items. Be brief and decisive.",
  "disc-i":
    "Write for an Influence (I) personality. Be enthusiastic and collaborative. Use optimistic language. Express excitement about working together. Include personal touches and positive affirmations. Be expressive.",
  "disc-s":
    "Write for a Steadiness (S) personality. Be calm, supportive, and team-oriented. Show appreciation for their contributions. Avoid pressure or urgency. Use inclusive language ('we', 'our team'). Be patient and considerate.",
  "disc-c":
    "Write for a Conscientiousness (C) personality. Be analytical and precise. Include specific details, data points, or references where appropriate. Use structured formatting. Be thorough but not verbose. Focus on accuracy and quality.",
};

const STYLE_INSTRUCTIONS: Record<StyleId, string> = {
  professional:
    "Use formal business language. Proper salutation and sign-off. Avoid slang or contractions.",
  casual:
    "Use relaxed, everyday language. Contractions are fine. Keep it natural and easy-going.",
  conversational:
    "Write as if speaking naturally. Use a flowing, conversational rhythm. Include transitional phrases. Make it feel like a verbal exchange put into writing.",
};

const LENGTH_INSTRUCTIONS: Record<LengthId, string> = {
  condense:
    "Keep the email very concise — 2-4 sentences maximum. Cut any unnecessary words. Get straight to the point.",
  default:
    "Write a standard-length email — enough to cover the key points clearly without being overly brief or long. Typically 4-8 sentences.",
  extend:
    "Write a more detailed email — elaborate on key points, add context, and be thorough. Include supporting details. Typically 8-15 sentences.",
};

export function buildPrompt(
  transcript: string,
  tone: ToneId,
  style: StyleId,
  length: LengthId,
  recipientContext: string
): string {
  const recipientLine = recipientContext.trim()
    ? `\nRecipient context: ${recipientContext.trim()}`
    : "";

  return `You are an expert email writer. Transform the following voice transcript into a polished, well-structured email.

TONE: ${TONE_INSTRUCTIONS[tone]}

STYLE: ${STYLE_INSTRUCTIONS[style]}

LENGTH: ${LENGTH_INSTRUCTIONS[length]}
${recipientLine}

INSTRUCTIONS:
- Extract the key message and intent from the transcript
- Create a clear subject line on the first line, formatted as "Subject: ..."
- Write the email body starting from the second line
- Fix any grammar, filler words, or rambling from the transcript
- Maintain the sender's original intent and key points
- Do NOT add information that wasn't in the transcript
- Include an appropriate greeting and sign-off (use "[Your Name]" as placeholder)

TRANSCRIPT:
"""
${transcript}
"""

Write the email now:`;
}
