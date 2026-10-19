import Anthropic from "@anthropic-ai/sdk"
import { z } from "zod"
import { consumeRateLimit } from "@/lib/rate-limit"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// A fast, low-cost model keeps this public demo cheap; override with BRIEF_MODEL.
const MODEL = process.env.BRIEF_MODEL ?? "claude-haiku-5-5"

const SYSTEM_PROMPT = `You are the planning assistant on the portfolio of an independent software professional based in Bangladesh who delivers complete software projects end-to-end — planning, UI/UX design, web and mobile development, AI integrations, e-commerce, ERP/business systems, QA, deployment and support — for clients in Bangladesh and worldwide.

A prospective client describes a software idea in a sentence or two. Turn it into a concise, realistic first-draft project brief.

Respond with a single JSON object and nothing else (no markdown fences), using exactly these keys:
{
  "title": "short product name, max 6 words",
  "summary": "one or two sentences restating the goal in plain language",
  "features": ["4 to 6 core features for a first version, each under 12 words"],
  "stack": ["4 to 6 technologies, preferring Next.js, TypeScript, Node.js, PostgreSQL/Prisma or MongoDB, Tailwind, and an LLM API when AI is involved"],
  "phases": [{"name": "phase name", "weeks": "e.g. 1-2", "focus": "what gets built, under 15 words"}],
  "timeline": "total estimate, e.g. 6-8 weeks",
  "budgetBand": "rough range in both BDT and USD, e.g. ৳1.2L-2L / $1,200-2,000",
  "risks": ["1 to 3 open questions or risks to clarify on a call"]
}

Use 3 or 4 phases. Keep estimates honest for a small, experienced delivery team. Refer to the provider as "I" if needed, never as an agency or team. If the idea is vague, make sensible assumptions and list them as risks. If the request is not a software project, still return the JSON with a polite summary asking for a software idea and empty arrays.`

const requestSchema = z.object({ idea: z.string().trim().min(8).max(500), locale: z.enum(["en", "bn"]).default("en") })

const BANGLA_INSTRUCTION = `The client is browsing the Bangla version of the site. Write every string value in natural, simple Bangla (Bengali script), keeping technology and product names such as Next.js or bKash in English. Give the budget band primarily in Bangladeshi Taka, e.g. "৳১.২ লাখ – ২ লাখ (প্রায় $১,২০০–২,০০০)". Keep the JSON keys in English exactly as specified.`

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "The brief generator is not configured." }, { status: 503 })
  }

  const parsed = requestSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return Response.json({ error: "Describe your idea in 8 to 500 characters. / ৮ থেকে ৫০০ অক্ষরের মধ্যে আইডিয়াটি লিখুন।" }, { status: 400 })
  }

  if (!(await consumeRateLimit("brief", 8))) {
    const error = parsed.data.locale === "bn"
      ? "এই ঘণ্টায় আপনি কয়েকটি প্ল্যান তৈরি করেছেন। আইডিয়াটি সরাসরি আমাকে পাঠান!"
      : "You've generated several briefs this hour. Send me your idea directly instead!"
    return Response.json({ error }, { status: 429 })
  }

  const client = new Anthropic()
  const stream = client.messages.stream({
    model: MODEL,
    // Bangla script takes noticeably more tokens than English for the same brief.
    max_tokens: parsed.data.locale === "bn" ? 4000 : 2000,
    output_config: { effort: "low" },
    system: parsed.data.locale === "bn" ? `${SYSTEM_PROMPT}\n\n${BANGLA_INSTRUCTION}` : SYSTEM_PROMPT,
    messages: [{ role: "user", content: parsed.data.idea }],
  })

  const encoder = new TextEncoder()
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text))
          }
        }
        const message = await stream.finalMessage()
        if (message.stop_reason === "refusal") {
          controller.enqueue(encoder.encode("\n[[ERROR]]"))
        }
      } catch (error) {
        if (error instanceof Anthropic.RateLimitError) {
          console.error("Brief generator rate limited by Anthropic", error.message)
        } else if (error instanceof Anthropic.APIError) {
          console.error(`Brief generator API error ${error.status}`, error.message)
        } else {
          console.error("Brief generator failed", error)
        }
        controller.enqueue(encoder.encode("\n[[ERROR]]"))
      } finally {
        controller.close()
      }
    },
    cancel() {
      stream.abort()
    },
  })

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  })
}
