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
    const { transcript, tones, style, length, recipientContext } = body as {
      transcript: string;
      tones: ToneId[];
      style: StyleId;
      length: LengthId;
      recipientContext: string;
    };

    // Debug logging
    console.log("=== EMAIL GENERATION REQUEST ===");
    console.log("Tones:", tones);
    console.log("Style:", style);
    console.log("Length:", length);
    console.log("Transcript:", transcript?.substring(0, 100));
    console.log("API Key exists:", !!process.env.OPENROUTER_API_KEY);

    if (!transcript?.trim()) {
      return new Response(
        JSON.stringify({ error: "Transcript is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Default to "normal" if no tones selected
    const selectedTones = tones && tones.length > 0 ? tones : ["normal" as ToneId];

    const prompt = buildPrompt(transcript, selectedTones, style, length, recipientContext);
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
