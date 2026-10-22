import { createServerFn } from "@tanstack/react-start";

export type AiTask = "email" | "notes" | "tasks" | "research" | "chat";

type Input = {
  task: AiTask;
  prompt: string;
  history?: { role: "user" | "assistant"; content: string }[];
};

const GUARD =
  "You are Workly AI, a workplace productivity assistant. Never invent facts, names, decisions, owners, or deadlines. If information is missing from the user's input, write 'Not specified' or use a clear [placeholder]. Use plain text with simple headings and bullet points.";

const INSTRUCTIONS: Record<AiTask, string> = {
  email:
    "Write a workplace email based on the user's details. Include a 'Subject:' line first, then the body. Match the requested tone and audience exactly.",
  notes:
    "Summarise the meeting notes into these sections: SUMMARY, KEY DECISIONS, ACTION ITEMS (each with Owner and Deadline). Only use owners, decisions and deadlines that appear in the notes; otherwise write 'Not specified'.",
  tasks:
    "Prioritise the user's tasks with the Eisenhower matrix (Urgent & Important, Important not urgent, Urgent not important, Neither). Then produce the requested daily or weekly schedule. Do not invent tasks or deadlines.",
  research:
    "Give a concise, balanced overview of the topic with key points and questions to verify. Clearly state that facts should be checked against reliable sources. Do not fabricate statistics or citations.",
  chat: "Help with workplace questions concisely and practically.",
};

export const runAi = createServerFn({ method: "POST" })
  .inputValidator((input: Input) => {
    if (!input || typeof input.prompt !== "string" || !input.prompt.trim())
      throw new Error("Please enter some text first.");
    if (input.prompt.length > 20000) throw new Error("Input is too long (max 20,000 characters).");
    if (!(input.task in INSTRUCTIONS)) throw new Error("Unknown task.");
    return input;
  })
  .handler(async ({ data }): Promise<{ ok: true; text: string } | { ok: false; error: string }> => {
    if (!process.env['LOVABLE_API_KEY']) {
      return { ok: false, error: "The AI service isn't configured yet. Ask your workspace owner to enable Lovable AI." };
    }
    const { generateResponse, GatewayError, PaymentRequiredError, RateLimitError } = await import(
      "@lovable.dev/ai-gateway"
    );
    try {
      const history = (data.history ?? []).slice(-12).map((m) => ({ role: m.role, content: m.content }));
      const res = await generateResponse({
        model: "openai/gpt-6-astra",
        instructions: `${GUARD}\n\n${INSTRUCTIONS[data.task]}`,
        input: [...history, { role: "user" as const, content: data.prompt }],
      });
      const text = (res.output ?? [])
        .flatMap((item) => (item.type === "message" ? item.content : []))
        .map((c) => (c.type === "output_text" ? c.text : ""))
        .join("")
        .trim();
      if (!text) return { ok: false, error: "The AI returned an empty response. Please try again." };
      return { ok: true, text };
    } catch (e) {
      if (e instanceof PaymentRequiredError)
        return { ok: false, error: "AI credits have run out. Add credits in your workspace settings." };
      if (e instanceof RateLimitError)
        return { ok: false, error: "Too many requests right now. Please wait a moment and try again." };
      if (e instanceof GatewayError) {
        console.error("AI error", e.toJSON());
        return { ok: false, error: `The AI service returned an error (${e.code}). Please try again.` };
      }
      console.error(e);
      return { ok: false, error: "Something went wrong while contacting the AI service." };
    }
  });
