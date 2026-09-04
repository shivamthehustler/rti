import { NextResponse } from "next/server";
import { getAllHistory, getHistoryById, addHistoryEntry } from "@/lib/historyStore";
import { checkRateLimit } from "@/lib/rateLimit";

export async function GET(request) {
    const rateLimit = checkRateLimit(request, { limit: 120, windowMs: 60 * 1000, prefix: "history-get" });
    if (!rateLimit.allowed) {
        return NextResponse.json(
            { error: "Too many requests. Please slow down." },
            { status: 429, headers: { "Retry-After": String(rateLimit.reset) } }
        );
    }

    try {
        const { searchParams } = new URL(request.url);
        const rawId = searchParams.get("id");
        const rawQuery = searchParams.get("query");
        const lookup = rawId || rawQuery;

        if (lookup) {
            const item = await getHistoryById(lookup);
            if (item) {
                return NextResponse.json(item);
            }

            return NextResponse.json(
                { error: "History session not found" },
                { status: 404 }
            );
        } else {
            const list = await getAllHistory();
            return NextResponse.json(list);
        }
    } catch (error) {
        console.error("Error fetching user history:", error);
        return NextResponse.json(
            { error: "Failed to retrieve history" },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    const rateLimit = checkRateLimit(request, { limit: 30, windowMs: 60 * 1000, prefix: "history-post" });
    if (!rateLimit.allowed) {
        return NextResponse.json(
            { error: "Too many requests. Please slow down." },
            { status: 429, headers: { "Retry-After": String(rateLimit.reset) } }
        );
    }

    try {
        const body = await request.json();
        const { query, data } = body;

        if (!query || typeof query !== "string" || !query.trim() || query.length > 1000) {
            return NextResponse.json({ error: "query is required and must be under 1000 characters" }, { status: 400 });
        }

        const entry = await addHistoryEntry(query.trim(), data);

        return NextResponse.json({
            status: "success",
            id: entry.id,
            entry: {
                id: entry.id,
                query: entry.query,
                created_at: entry.created_at
            }
        });
    } catch (error) {
        console.error("Error creating history entry:", error);
        return NextResponse.json({ error: "Failed to save history record" }, { status: 500 });
    }
}
