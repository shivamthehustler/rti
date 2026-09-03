import { askLLM } from "@/services/llm";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return Response.json({ error: "Not Found" }, { status: 404 });
  }

  try {
    const response = await askLLM({
      prompt: "Health check ping",
    });

    return Response.json({
      status: "ok",
      available: !!response,
    });
  } catch (error) {
    console.error("Gemini test route error:", error);

    return Response.json(
      {
        error: "Failed to connect to LLM service",
      },
      {
        status: 500,
      }
    );
  }
}