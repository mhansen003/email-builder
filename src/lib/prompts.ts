import { ToneId, StyleId, LengthId } from "./types";

const TONE_INSTRUCTIONS: Record<ToneId, string> = {
  // General tones
  normal:
    "This is a STANDARD email. Write in a balanced, neutral tone — professional but not stiff, friendly but not overly casual. Just communicate the message clearly and directly without any special emotional angle.",
  friendly:
    "This is a FRIENDLY email. Be warm, personable, and approachable. Use a conversational tone with casual greetings like 'Hi' or 'Hey'. Add a personal touch — maybe ask how they're doing or reference something you know about them. Keep it genuine, not forced.",
  formal:
    "This is a FORMAL email. Use proper, professional language throughout. 'Dear' salutations, complete sentences, no contractions. Maintain a respectful, official tone appropriate for executives, legal matters, or official communications. Be polished and precise.",
  excited:
    "This is an EXCITED email. Show genuine enthusiasm! Use energetic language — words like 'thrilled', 'amazing', 'can't wait'. It's okay to use exclamation points (but not too many). Let the positive energy come through while staying professional.",
  // Action tones
  "follow-up":
    "This is a FOLLOW-UP email. Reference the previous conversation, meeting, or request. Be polite but purposeful — the goal is to get a response or move things forward. Use phrases like 'circling back', 'wanted to check in', or 'following up on'. End with a clear ask.",
  request:
    "This is a REQUEST email. Be clear about exactly what you need, when you need it, and why. Make it easy for the recipient to say yes. Be respectful but direct. If there's a deadline, state it. End with a specific call to action.",
  "thank-you":
    "This is a THANK YOU email. Express genuine, specific gratitude — mention exactly what you're thankful for and why it mattered. Be warm but not over-the-top. Keep it sincere and brief. Avoid generic phrases; make it personal.",
  congratulations:
    "This is a CONGRATULATIONS email. Celebrate the recipient's achievement with genuine enthusiasm. Be specific about what they accomplished and why it matters. Keep the focus on THEM, not you. Be warm and celebratory without being sycophantic.",
  reminder:
    "This is a REMINDER email. Gently nudge about something previously discussed or scheduled. Be helpful, not pushy — assume they just forgot, not that they're ignoring you. Reference the original context, restate key details, and make it easy to respond.",
  update:
    "This is a STATUS UPDATE email. Structure the information clearly — what happened, where things stand now, and what's next. Use bullet points or short paragraphs for scannability. Lead with the most important update. Be factual and concise.",
  introduction:
    "This is an INTRODUCTION email. Briefly establish who you are and why you're reaching out. Get to the point quickly — what's the connection or reason for contact. Be warm but professional. End with a clear next step (meeting, call, etc.).",
  feedback:
    "This is a FEEDBACK email. Be constructive and specific — focus on behaviors/outcomes, not personal criticism. Lead with something positive if possible. Frame suggestions as opportunities, not failures. Be direct but kind. Offer to discuss further.",
  // Sensitive tones
  "bad-news":
    "This is a BAD NEWS email. Lead with empathy or context before delivering the news. Be honest and direct but compassionate. Avoid burying the bad news in fluff. If possible, offer an alternative or next step. End on a constructive note.",
  apology:
    "This is an APOLOGY email. Acknowledge the issue directly — don't deflect or minimize. Take responsibility clearly. Explain what happened briefly (without excuses). State what you're doing to fix it or prevent recurrence. Be sincere and professional.",
  urgent:
    "This is an URGENT email. Lead with the time-sensitive element immediately. Be very clear about what's needed and by when. Use direct language — no fluff. Emphasize the deadline/action needed. Keep it short and scannable.",
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
    ? `Recipient: ${recipientContext.trim()}\n`
    : "";

  return `Transform this voice transcript into an email. The transcript is THE ONLY SOURCE OF CONTENT — use its exact meaning.

=== TRANSCRIPT (USE THIS CONTENT) ===
${transcript}
=== END TRANSCRIPT ===

${recipientLine}Type: ${tone.replace("-", " ")} | Style: ${style} | Length: ${length}

TONE GUIDANCE: ${TONE_INSTRUCTIONS[tone]}

RULES:
1. The email MUST reflect what the transcript actually says — not generic placeholder text
2. If the transcript is a test message or nonsense, write an email that literally says "testing" or reflects that
3. NEVER invent topics, names, projects, or details not in the transcript
4. NEVER use placeholders like "[specific topic]" — use the actual content or leave it out
5. Clean up grammar and filler words, but keep the original meaning
6. Format: First line = "Subject: ..." then blank line, then email body
7. End with "[Your Name]" as the signature placeholder

STYLE: ${STYLE_INSTRUCTIONS[style]}

LENGTH: ${LENGTH_INSTRUCTIONS[length]}

Write the email based on the transcript above:`;
}
