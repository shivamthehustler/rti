import { NextResponse } from "next/server";
import { identify_authority } from "@/modules/authority";
import { getAuthorityServices } from "@/modules/get_authority_services";
import { select_service } from "@/modules/api_selection";
import { getService } from "@/modules/get_service_data";
import { data_presentation } from "@/modules/presentation_module";
import pool from "@/lib/db";
import { addHistoryEntry } from "@/lib/historyStore";
import { checkRateLimit } from "@/lib/rateLimit";

const steps = [
    { text: "Identify concerned public authority", status: "default", estimated: 13 },
    { text: "Find available government data sources", status: "default", estimated: 5 },
    { text: "Select most relevant data source", status: "default", estimated: 14 },
    { text: "Retrieve necessary information the source", status: "default", estimated: 5 },
    { text: "Convert raw data to presentable form", status: "default", estimated: 60 },
];

async function saveHistory(query, finalStep, status, details, errorMsg = null) {
    const stepsState = steps.map((s, idx) => {
        if (idx < finalStep) {
            return { ...s, status: "done" };
        } else if (idx === finalStep) {
            return { ...s, status: status === "success" ? "done" : "error" };
        } else {
            return { ...s, status: "default" };
        }
    });

    const data = {
        status: status, // "success" or "error"
        steps: stepsState,
        result: status === "success" ? details : null,
        error: status === "error" ? (errorMsg || details?.missing_points || "Error occurred while agents working") : null
    };

    try {
        const entry = await addHistoryEntry(query, data);
        return entry.id;
    } catch (err) {
        console.error("Error saving user history:", err);
        return null;
    }
}

export async function POST(request) {
    // 1. Rate Limiting Check
    const rateLimit = checkRateLimit(request, { limit: 45, windowMs: 60 * 1000, prefix: "run-step" });
    if (!rateLimit.allowed) {
        return NextResponse.json(
            { status: "error", error: "Too many automated requests. Please wait a moment." },
            { status: 429, headers: { "Retry-After": String(rateLimit.reset) } }
        );
    }

    let query, step, context;
    try {
        const body = await request.json();
        query = body.query;
        step = body.step;
        context = body.context || {};

        if (!query || typeof query !== "string" || !query.trim() || query.length > 1000) {
            return NextResponse.json(
                { status: "error", error: "Query is required and must not exceed 1000 characters" },
                { status: 400 }
            );
        }

        if (typeof step !== "number" || step < 0 || step > 4) {
            return NextResponse.json(
                { status: "error", error: "valid step (0-4) is required" },
                { status: 400 }
            );
        }

        query = query.trim();

        if (step === 0) {
            const authorityResult = await identify_authority(query);
            const authorityData = typeof authorityResult === "string" ? JSON.parse(authorityResult) : authorityResult;

            if (authorityData.jurisdiction !== "center") {
                const errResult = {
                    is_relevant: false,
                    is_sufficient: false,
                    missing_points: "That doesn't come under Government of India",
                    report_data: []
                };
                const historyId = await saveHistory(query, 0, "error", errResult);
                return NextResponse.json({
                    status: "error",
                    step: 0,
                    error: errResult.missing_points,
                    details: errResult,
                    historyId
                });
            }

            if (!authorityData.authority) {
                const errResult = {
                    is_relevant: false,
                    is_sufficient: false,
                    missing_points: "Could not find Concerned Public Authority",
                    report_data: []
                };
                const historyId = await saveHistory(query, 0, "error", errResult);
                return NextResponse.json({
                    status: "error",
                    step: 0,
                    error: errResult.missing_points,
                    details: errResult,
                    historyId
                });
            }

            return NextResponse.json({
                status: "done",
                step: 0,
                details: authorityData
            });
        }

        if (step === 1) {
            const { authorityData } = context;
            if (!authorityData || !authorityData.authority || !authorityData.authority.id) {
                return NextResponse.json(
                    { status: "error", error: "authorityData is required in context for step 1" },
                    { status: 400 }
                );
            }
            const authority_id = authorityData.authority.id;
            const services = await getAuthorityServices(authority_id);
            if (!services || services.length === 0) {
                const errResult = {
                    is_relevant: false,
                    is_sufficient: false,
                    missing_points: "No data apis available from Authority",
                    report_data: []
                };
                const historyId = await saveHistory(query, 1, "error", errResult);
                return NextResponse.json({
                    status: "error",
                    step: 1,
                    error: errResult.missing_points,
                    details: errResult,
                    historyId
                });
            }

            return NextResponse.json({
                status: "done",
                step: 1,
                details: services
            });
        }

        if (step === 2) {
            const { services } = context;
            if (!services || !Array.isArray(services)) {
                return NextResponse.json(
                    { status: "error", error: "services array is required in context for step 2" },
                    { status: 400 }
                );
            }
            const serviceResult = await select_service(services, query);
            const serviceData = typeof serviceResult === "string" ? JSON.parse(serviceResult) : serviceResult;

            if (!serviceData.service || !serviceData.service.endpoint) {
                const errResult = {
                    is_relevant: false,
                    is_sufficient: false,
                    missing_points: serviceData.service ? "Error : No endpoint available in selected service" : "No available service can provide the requested information.",
                    report_data: []
                };
                const historyId = await saveHistory(query, 2, "error", errResult);
                return NextResponse.json({
                    status: "error",
                    step: 2,
                    error: errResult.missing_points,
                    details: errResult,
                    historyId
                });
            }

            return NextResponse.json({
                status: "done",
                step: 2,
                details: serviceData
            });
        }

        if (step === 3) {
            const { serviceData } = context;
            if (!serviceData || !serviceData.service || !serviceData.service.endpoint) {
                return NextResponse.json(
                    { status: "error", error: "serviceData with endpoint is required in context for step 3" },
                    { status: 400 }
                );
            }
            const { endpoint } = serviceData.service;
            const data = await getService(endpoint);
            return NextResponse.json({
                status: "done",
                step: 3,
                details: data
            });
        }

        if (step === 4) {
            const { data } = context;
            if (data === undefined) {
                return NextResponse.json(
                    { status: "error", error: "data is required in context for step 4" },
                    { status: 400 }
                );
            }
            const report = await data_presentation(data, query);
            const historyId = await saveHistory(query, 4, "success", report);
            return NextResponse.json({
                status: "done",
                step: 4,
                details: report,
                historyId
            });
        }

    } catch (error) {
        console.error(`Error in run-step at step ${step}:`, error);
        const historyId = await saveHistory(query || "Unknown Query", step || 0, "error", null, "Service temporarily unable to complete step");
        return NextResponse.json(
            {
                status: "error",
                step: step || 0,
                error: "An error occurred while processing this step. Please try again.",
                historyId
            },
            { status: 500 }
        );
    }
}
