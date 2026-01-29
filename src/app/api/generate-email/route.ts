import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { buildPrompt } from "@/lib/prompts";
import { ToneId, StyleId, LengthId } from "@/lib/types";

// OpenRouter uses an OpenAI-compatible API
const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { transcript, tone, style, length, recipientContext } = body as {
      transcript: string;
      tone: ToneId;
      style: StyleId;
      length: LengthId;
      recipientContext: string;
    };

    // Debug logging
    console.log("=== EMAIL GENERATION REQUEST ===");
    console.log("Tone:", tone);
    console.log("Style:", style);
    console.log("Length:", length);
    console.log("Transcript:", transcript?.substring(0, 100));
    console.log("API Key exists:", !!process.env.OPENROUTER_API_KEY);
    console.log("API Key prefix:", process.env.OPENROUTER_API_KEY?.substring(0, 10));

    if (!transcript?.trim()) {
      return new Response(
        JSON.stringify({ error: "Transcript is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const prompt = buildPrompt(transcript, tone, style, length, recipientContext);
    console.log("=== PROMPT PREVIEW ===");
    console.log(prompt.substring(0, 500));

    const result = streamText({
      model: openrouter("openai/gpt-4o-mini"),
      prompt,
      maxTokens: 1024,
      temperature: 0.7,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Email generation error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate email" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
