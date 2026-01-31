import { ToneId, StyleId, LengthId } from "./types";

const TONE_INSTRUCTIONS: Record<ToneId, string> = {
  // General tones
  normal:
    "STANDARD — balanced and neutral, professional but not stiff, friendly but not casual",
  friendly:
    "FRIENDLY — warm and personable, use 'Hi' or 'Hey', add personal touches, be genuine",
  formal:
    "FORMAL — 'Dear' salutation, complete sentences, no contractions, polished and precise",
  excited:
    "EXCITED — show enthusiasm with words like 'thrilled' and 'amazing', use exclamation points sparingly",
  // Action tones
  "follow-up":
    "FOLLOW-UP — reference previous conversation, use 'circling back' or 'checking in', end with clear ask",
  request:
    "REQUEST — be clear about what you need and when, make it easy to say yes, end with call to action",
  "thank-you":
    "THANK YOU — express specific gratitude, mention what mattered and why, keep sincere and brief",
  congratulations:
    "CONGRATULATIONS — celebrate their achievement specifically, focus on THEM, be warm and celebratory",
  reminder:
    "REMINDER — gentle nudge, assume they forgot (not ignoring), restate key details, easy to respond",
  update:
    "STATUS UPDATE — structure clearly (what happened, where we stand, what's next), use bullets if helpful",
  introduction:
    "INTRODUCTION — briefly establish who you are, get to the point, end with next step (meeting/call)",
  feedback:
    "FEEDBACK — constructive and specific, lead with positive, frame as opportunities not failures",
  // Sensitive tones
  apology:
    "APOLOGY — acknowledge directly, take responsibility, explain briefly (no excuses), state how you'll fix it",
  urgent:
    "URGENT — lead with time-sensitive element, be very clear about what's needed by when, short and scannable",
};

const STYLE_INSTRUCTIONS: Record<StyleId, string> = {
  professional:
    "Use formal business language. Proper salutation and sign-off. Avoid slang or contractions.",
  casual:
    "Use relaxed, everyday language. Contractions are fine. Keep it natural and easy-going.",
  conversational:
    "Write as if speaking naturally. Use a flowing, conversational rhythm. Include transitional phrases.",
};

const LENGTH_INSTRUCTIONS: Record<LengthId, string> = {
  condense:
    "VERY CONCISE: 2-4 sentences maximum. Cut every unnecessary word. Get straight to the point.",
  default:
    "STANDARD LENGTH: 4-8 sentences. Cover key points clearly without being too brief or long.",
  extend:
    "DETAILED: 8-15 sentences. Elaborate on key points, add context, include supporting details.",
};

export function buildPrompt(
  transcript: string,
  tones: ToneId[],
  style: StyleId,
  length: LengthId,
  recipientContext?: string
): string {
  const recipientLine = recipientContext?.trim()
    ? `\n**Recipient context:** ${recipientContext.trim()}`
    : "";

  // Build combined tone guidance from all selected tones
  const toneLabels = tones.map(t => t.replace("-", " ")).join(" + ");
  const toneGuidance = tones.map(t => `• ${TONE_INSTRUCTIONS[t]}`).join("\n");

  return `You are an expert email writer. Transform this voice transcript into a polished, professional email.

## YOUR TASK
Take the rough voice transcript below and craft it into a well-written email that matches the selected settings.

## VOICE TRANSCRIPT (THIS IS YOUR ONLY CONTENT SOURCE)
"""
${transcript}
"""

## EMAIL SETTINGS (APPLY THESE CAREFULLY)
${recipientLine}
**Tone:** ${toneLabels}
${toneGuidance}

**Style:** ${STYLE_INSTRUCTIONS[style]}

**Length:** ${LENGTH_INSTRUCTIONS[length]}

## CRITICAL RULES
1. The email content MUST come from the transcript — do not invent topics, names, or details
2. If the transcript says "testing 1 2 3" — write a test email that says "testing"
3. Clean up grammar and filler words ("um", "like", "you know") but preserve meaning
4. NEVER use placeholders like "[topic]" or "[name]" — use actual content or omit
5. Apply the tone settings noticeably — an "urgent" email should FEEL urgent, a "friendly" email should FEEL warm

## OUTPUT FORMAT
First line: Subject: [compelling subject line based on content]
Then blank line
Then email body
End with: [Your Name]

Write the email now:`;
}
