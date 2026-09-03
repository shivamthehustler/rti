import { NextResponse } from "next/server";
import { identify_authority } from "@/modules/authority";

export async function POST(request) {
    try {
        const body = await request.json();

        const { query } = body;

        if (!query || typeof query !== "string" || !query.trim()) {
            return NextResponse.json(
                {
                    error: "Query is required"
                },
                { status: 400 }
            );
        }

        const result = await identify_authority(query.trim());

        return NextResponse.json({
            query: query.trim(),
            result
        });
    } catch (error) {
        console.error("Authority identification error:", error);

        return NextResponse.json(
            {
                error: "Failed to identify authority"
            },
            { status: 500 }
        );
    }
}