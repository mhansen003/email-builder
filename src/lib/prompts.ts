import { ToneId, StyleId, LengthId } from "./types";

const TONE_INSTRUCTIONS: Record<ToneId, string> = {
  "follow-up":
    "This is a FOLLOW-UP email. Reference the previous conversation, meeting, or request. Be polite but purposeful — the goal is to get a response or move things forward. Use phrases like 'circling back', 'wanted to check in', or 'following up on'. End with a clear ask or next step.",
  request:
    "This is a REQUEST email. Be clear about exactly what you need, when you need it, and why. Make it easy for the recipient to say yes. Be respectful but direct. If there's a deadline, state it. End with a specific call to action.",
  "thank-you":
    "This is a THANK YOU email. Express genuine, specific gratitude — mention exactly what you're thankful for and why it mattered. Be warm but not over-the-top. Keep it sincere and brief. Avoid generic phrases; make it personal.",
  "bad-news":
    "This is a BAD NEWS email. Lead with empathy or context before delivering the news. Be honest and direct but compassionate. Avoid burying the bad news in fluff. If possible, offer an alternative, next step, or silver lining. End on a constructive note.",
  urgent:
    "This is an URGENT email. Lead with the time-sensitive element immediately. Be very clear about what's needed and by when. Use direct language — no fluff. Bold or emphasize the deadline/action needed. Keep it short and scannable.",
  introduction:
    "This is an INTRODUCTION email. Briefly establish who you are and why you're reaching out. Get to the point quickly — what's the connection or reason for contact. Be warm but professional. End with a clear next step (meeting, call, etc.).",
  update:
    "This is a STATUS UPDATE email. Structure the information clearly — what happened, where things stand now, and what's next. Use bullet points or short paragraphs for scannability. Lead with the most important update. Be factual and concise.",
  apology:
    "This is an APOLOGY email. Acknowledge the issue directly — don't deflect or minimize. Take responsibility clearly. Explain what happened briefly (without excuses). State what you're doing to fix it or prevent recurrence. Be sincere and professional.",
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
