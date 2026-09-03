import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getInMemoryHistory, getHistoryById, addHistoryEntry } from "@/lib/historyStore";
import { checkRateLimit } from "@/lib/rateLimit";

export async function GET(request) {
    const rateLimit = checkRateLimit(request, { limit: 60, windowMs: 60 * 1000, prefix: "history-get" });
    if (!rateLimit.allowed) {
        return NextResponse.json(
            { error: "Too many requests. Please slow down." },
            { status: 429, headers: { "Retry-After": String(rateLimit.reset) } }
        );
    }

    try {
        const { searchParams } = new URL(request.url);
        const rawId = searchParams.get("id");

        if (rawId) {
            // Strict ID format validation (e.g. hist-123456 or numeric integer)
            const id = rawId.trim();
            if (!/^[a-zA-Z0-9_-]{1,64}$/.test(id)) {
                return NextResponse.json(
                    { error: "Invalid history identifier" },
                    { status: 400 }
                );
            }

            if (process.env.DATABASE_URL) {
                try {
                    const result = await pool.query(
                        "SELECT id, query, data, created_at FROM user_history WHERE CAST(id AS TEXT) = $1",
                        [id]
                    );
                    if (result && result.rows && result.rows.length > 0) {
                        return NextResponse.json(result.rows[0]);
                    }
                } catch (dbErr) {
                    console.warn("DB history item fetch fallback:", dbErr?.message);
                }
            }

            const inMem = getHistoryById(id);
            if (inMem) {
                return NextResponse.json(inMem);
            }

            return NextResponse.json(
                { error: "History session not found" },
                { status: 404 }
            );
        } else {
            if (process.env.DATABASE_URL) {
                try {
                    const result = await pool.query(
                        "SELECT id, query, created_at FROM user_history ORDER BY created_at DESC LIMIT 50"
                    );
                    if (result && result.rows && result.rows.length > 0) {
                        return NextResponse.json(result.rows);
                    }
                } catch (dbErr) {
                    console.warn("DB history list fetch fallback:", dbErr?.message);
                }
            }

            // Return in-memory list
            const list = getInMemoryHistory();
            return NextResponse.json(
                list.map(h => ({
                    id: h.id,
                    query: h.query,
                    created_at: h.created_at
                }))
            );
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
