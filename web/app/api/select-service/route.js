import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { select_service } from "@/modules/api_selection";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const authority = searchParams.get("authority");
        const query = searchParams.get("query");

        // Validate required parameters
        if (!authority || !query) {
            return NextResponse.json(
                {
                    error: "authority and query are required"
                },
                { status: 400 }
            );
        }

        // Validate authority ID
        if (!/^\d+$/.test(authority)) {
            return NextResponse.json(
                {
                    error: "authority must be a valid ID"
                },
                { status: 400 }
            );
        }

        // Fetch services belonging to the authority
        const result = await pool.query(
            `
            SELECT
                id,
                name,
                description,
                endpoint,
                method,
                documentation
            FROM authority_services
            WHERE authority_id = $1
            ORDER BY id
            `,
            [authority]
        );

        // No services available
        if (result.rows.length === 0) {
            return NextResponse.json(
                {
                    error: "No services found for this authority"
                },
                { status: 404 }
            );
        }

        // Ask LLM to select the most relevant service
        const selectedService = await select_service(
            result.rows,
            query
        );

        return NextResponse.json(selectedService);

    } catch (error) {
        console.error("Service selection error:", error);

        return NextResponse.json(
            {
                error: "Failed to select service"
            },
            { status: 500 }
        );
    }
}