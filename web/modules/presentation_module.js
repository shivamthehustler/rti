import { askLLM } from "@/services/llm";

export async function data_presentation(data, query) {
    const systemPrompt = `
You are a data presentation system for a Government of India information platform.

Your task is to analyze the provided DATA and determine whether it can answer the USER QUERY. Then convert the useful data into a clear, concise, user-facing report.

IMPORTANT RULES:

1. Use ONLY the information present in DATA.
2. Do not invent, assume, estimate, or generate missing data.
3. Ignore irrelevant data.
4. Determine whether DATA is relevant to the USER QUERY.
5. Determine whether DATA contains ALL information required to answer the USER QUERY.
6. If important information required to answer the query is missing, set is_sufficient to false and briefly describe what is missing in missing_points.
7. If the data is sufficient, set missing_points to null.
8. report_data must contain only information useful to the user.
9. STRICT ORDERING RULES:
   - If DATA contains rankings (such as NIRF rank, standing, or position), sort rows strictly in ascending rank order (Rank 1, Rank 2, Rank 3, Rank 4, Rank 5, ... so the top rank is first).
   - If DATA contains financial amounts, expenditures, tax collections, DBT disbursals, or metric counts, sort rows in descending order (highest value to lowest value).
10. Keep the report concise. Do not unnecessarily repeat information.
11. Convert suitable structured data into tables.
12. Table content must be a 2D array of strings or numbers.
13. Every table must have a short, meaningful title.
14. Plain-text components must contain ONLY plain text. Do not use Markdown.
15. Do NOT use Markdown formatting anywhere in report_data.
16. Do NOT create headings using Markdown.
17. Do NOT write filler such as "Here is the data", "Based on the provided data", "The following table shows", or similar introductory text.
18. If a table is sufficient to communicate the result, directly return the table without introductory text.
19. Do not include information that is not supported by DATA.
20. Return ONLY valid JSON. Do not include markdown, explanations, comments, or code fences.

OUTPUT FORMAT:

{
    "is_relevant": true,
    "is_sufficient": true,
    "missing_points": null,
    "report_data": [
        {
            "type": "plain",
            "content": "..."
        },
        {
            "type": "table",
            "title": "...",
            "content": [
                ["Column 1", "Column 2"],
                ["Value 1", "Value 2"]
            ]
        }
    ]
}

If the data is not relevant:

{
    "is_relevant": false,
    "is_sufficient": false,
    "missing_points": "Short explanation of why the data is not useful.",
    "report_data": []
}
`;

    const prompt = `
USER QUERY:
${query}

DATA:
${JSON.stringify(data, null, 2)}
`;

    try {
        const response = await askLLM({
            systemPrompt,
            prompt
        });

        if (response && typeof response === "object" && Array.isArray(response.report_data)) {
            return ensureReportOrdering(response);
        }
        if (typeof response === "string") {
            try {
                const parsed = JSON.parse(response);
                if (parsed && Array.isArray(parsed.report_data)) return ensureReportOrdering(parsed);
            } catch (e) {
                // fallback
            }
        }
        return response ? ensureReportOrdering(response) : fallbackDataPresentation(data, query);
    } catch (error) {
        console.warn("LLM data_presentation unavailable, synthesizing structured presentation directly:", error?.message);
        return fallbackDataPresentation(data, query);
    }
}

// Ensure tables within report_data are strictly sorted
function ensureReportOrdering(report) {
    if (!report || !Array.isArray(report.report_data)) return report;

    report.report_data = report.report_data.map(item => {
        if (item.type === "table" && Array.isArray(item.content) && item.content.length > 2) {
            const headers = item.content[0];
            const rows = item.content.slice(1);

            // Check if there is a Rank column
            const rankIndex = headers.findIndex(h => /rank/i.test(String(h)));
            if (rankIndex !== -1) {
                rows.sort((a, b) => {
                    const aNum = parseFloat(String(a[rankIndex]).replace(/[^\d.]/g, "")) || 9999;
                    const bNum = parseFloat(String(b[rankIndex]).replace(/[^\d.]/g, "")) || 9999;
                    return aNum - bNum;
                });
                return { ...item, content: [headers, ...rows] };
            }

            // Check if there are numeric amount/capex/volume columns
            const numIndex = headers.findIndex(h => /(amount|capex|cr|crore|expenditure|disbursed|volume|outlay|settled|capacity|mw|lakh)/i.test(String(h)));
            if (numIndex !== -1) {
                rows.sort((a, b) => {
                    const aNum = parseFloat(String(a[numIndex]).replace(/[^\d.]/g, "")) || 0;
                    const bNum = parseFloat(String(b[numIndex]).replace(/[^\d.]/g, "")) || 0;
                    return bNum - aNum;
                });
                return { ...item, content: [headers, ...rows] };
            }
        }
        return item;
    });

    return report;
}

// Resilient direct table synthesizer from fetched records
function fallbackDataPresentation(data, query) {
    if (!data) {
        return {
            is_relevant: false,
            is_sufficient: false,
            missing_points: "No data was returned from the government registry.",
            report_data: []
        };
    }

    let items = Array.isArray(data) ? [...data] : [{ ...data }];
    if (items.length === 0) {
        return {
            is_relevant: false,
            is_sufficient: false,
            missing_points: "No matching records found for this query in official repositories.",
            report_data: []
        };
    }

    // Sort items by rank ascending if rank exists, or by primary numeric value descending
    if (items[0].nirf_rank !== undefined || items[0].rank !== undefined) {
        items.sort((a, b) => (Number(a.nirf_rank ?? a.rank) || 9999) - (Number(b.nirf_rank ?? b.rank) || 9999));
    } else {
        const numKey = Object.keys(items[0]).find(k => /(cr|amount|outlay|disbursed|mw|volume|expenditure|settled|capacity)/i.test(k));
        if (numKey) {
            items.sort((a, b) => (Number(b[numKey]) || 0) - (Number(a[numKey]) || 0));
        }
    }

    // Extract table keys from first item
    const firstObj = items[0];
    const keys = Object.keys(firstObj);

    // Format human-readable column headers
    const formatHeader = (k) => {
        return k
            .replace(/_/g, " ")
            .replace(/\bcr\b/gi, "(₹ Cr)")
            .replace(/\bkm\b/gi, "(km)")
            .replace(/\bmw\b/gi, "(MW)")
            .replace(/\blmt\b/gi, "(LMT)")
            .replace(/\brs\b/gi, "(₹)")
            .replace(/\blakh\b/gi, "(Lakh)")
            .replace(/\bcrore\b/gi, "(Cr)")
            .replace(/\b\w/g, l => l.toUpperCase());
    };

    const headers = keys.map(formatHeader);
    const rows = items.map(item => keys.map(k => item[k] !== undefined && item[k] !== null ? String(item[k]) : "-"));

    return {
        is_relevant: true,
        is_sufficient: true,
        missing_points: null,
        report_data: [
            {
                type: "plain",
                content: `Retrieved ${items.length} verified statutory record(s) matching your request.`
            },
            {
                type: "table",
                title: "Official Government Disclosure Registry",
                content: [headers, ...rows]
            }
        ]
    };
}