import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const SYSTEM_PROMPT_NEW = `You are an expert email assistant helping users craft the perfect email through a brief conversational interview. Your goal is to ask 2-4 clarifying questions to understand exactly what email they need, then generate a polished email.

Good questions to ask (pick the most relevant):
- Who is this email going to? (manager, client, team, colleague, etc.)
- What's the main purpose or message?
- Are there specific details, dates, or action items to include?
- What outcome are you hoping for from this email?
- Is there anything sensitive or important to handle carefully?

Rules:
- Ask only 1 question at a time
- Keep questions concise, friendly, and conversational
- Use the user's initial message as context — don't re-ask what they already told you
- After 2-4 questions (when you have enough context), generate the final email
- When ready to complete, respond with EXACTLY this format:
  [COMPLETE]
  Subject: <subject line>

  <email body with proper greeting and sign-off>
  [/COMPLETE]
- Use [Placeholder] brackets for any details the user hasn't provided (e.g. [Your Name], [Date], [Company])
- Always include a Subject: line at the start`;

const SYSTEM_PROMPT_ENHANCE = `You are an expert email assistant helping users IMPROVE an existing email through a brief conversation. The user already has a generated email, and your goal is to ask 1-3 clarifying questions to understand what changes they want, then produce an improved version.

Good questions to ask:
- What would you like to change or improve about this email?
- Is there anything missing that should be added?
- Should the tone be adjusted? (more formal, friendlier, more urgent, etc.)
- Are there specific sections that need rework?

Rules:
- Ask only 1 question at a time
- Keep questions concise and conversational
- After 1-3 questions, generate the improved email
- When ready to complete, respond with EXACTLY this format:
  [COMPLETE]
  Subject: <subject line>

  <improved email body>
  [/COMPLETE]
- Preserve any [Placeholder] brackets from the original
- Always include a Subject: line at the start`;

interface Message {
  role: "assistant" | "user";
  content: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, transcript, messages, existingEmail } = body as {
      action: "start" | "continue" | "generate";
      transcript: string;
      messages: Message[];
      existingEmail?: string;
    };

    const isEnhance = !!existingEmail;
    const systemPrompt = isEnhance ? SYSTEM_PROMPT_ENHANCE : SYSTEM_PROMPT_NEW;

    let conversationMessages: { role: "system" | "assistant" | "user"; content: string }[] = [
      { role: "system", content: systemPrompt },
    ];

    if (action === "start") {
      let userMessage = transcript || "I need help writing an email.";
      if (isEnhance) {
        userMessage = `Here's my current email:\n\n${existingEmail}\n\nI'd like to improve it. ${transcript || ""}`;
      }
      conversationMessages.push({ role: "user", content: userMessage });
    } else {
      // Continue or generate — include full conversation history
      for (const msg of messages) {
        conversationMessages.push({ role: msg.role, content: msg.content });
      }

      if (action === "generate") {
        conversationMessages.push({
          role: "user",
          content: "Based on everything we've discussed, please generate the final email now. Use the [COMPLETE]...[/COMPLETE] format.",
        });
      }
    }

    // Use fast model for interview (Haiku equivalent)
    const result = await generateText({
      model: openrouter("anthropic/claude-3.5-haiku"),
      messages: conversationMessages,
      temperature: 0.7,
      maxTokens: 1500,
    });

    const responseText = result.text;

    // Check for completion markers
    const completeMatch = responseText.match(/\[COMPLETE\]([\s\S]*?)\[\/COMPLETE\]/);
    if (completeMatch) {
      return new Response(
        JSON.stringify({ isComplete: true, finalEmail: completeMatch[1].trim() }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: responseText }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Interview error:", error);

    // Fallback: return a generic question if API fails
    return new Response(
      JSON.stringify({ message: "Could you tell me more about what this email needs to accomplish?" }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
}
