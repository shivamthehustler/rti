import { NextResponse } from "next/server";
import { data_presentation } from "@/modules/presentation_module"

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const endpoint = searchParams.get("endpoint");
        const query = searchParams.get("query");

        if (!endpoint || !query) {
            return NextResponse.json(
                {
                    error: "endpoint and query are required"
                },
                { status: 400 }
            );
        }

        const result = await data_presentation(endpoint, query);

        return NextResponse.json(result);

    } catch (error) {
        console.error("Data presentation error:", error);

        return NextResponse.json(
            {
                error: "Failed to present data"
            },
            { status: 500 }
        );
    }
}