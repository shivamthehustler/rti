import { NextResponse } from "next/server";
import { integrated_module } from "@/modules/integrated_module";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(request) {
    // Rate Limiting Check (25 per minute per IP)
    const rateLimit = checkRateLimit(request, { limit: 25, windowMs: 60 * 1000, prefix: "ask-llm" });
    if (!rateLimit.allowed) {
        return NextResponse.json(
            { status: "error", error: "Too many query requests. Please wait a moment." },
            { status: 429, headers: { "Retry-After": String(rateLimit.reset) } }
        );
    }

    try {
        const body = await request.json();
        const { query } = body || {};

        if (!query || typeof query !== "string" || !query.trim() || query.length > 1000) {
            return NextResponse.json(
                {
                    status: "error",
                    error: "Query is required and must not exceed 1000 characters"
                },
                { status: 400 }
            );
        }

        const result = await integrated_module(query.trim());

        return NextResponse.json({
            status: "success",
            data: result
        });

    } catch (error) {
        console.error("Query processing error:", error);

        return NextResponse.json(
            {
                status: "error",
                error: "Error occurred while agents working",
                historyId: error.historyId
            },
            { status: 500 }
        );
    }
}