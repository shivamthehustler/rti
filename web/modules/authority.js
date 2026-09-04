import { askLLM } from "../services/llm.js";

export async function identify_authority(query) {
    const authorities = `
    2801 | Ministry of Finance | Ministry of Finance
    2802 | Ministry of Education | Ministry of Education
    2803 | Ministry of Health and Family Welfare | Ministry of Health and Family Welfare
    2804 | Ministry of Road Transport and Highways | Ministry of Road Transport and Highways
    2805 | National Highways Authority of India | Ministry of Road Transport and Highways
    2806 | Indian Railways | Ministry of Railways
    2807 | Ministry of Home Affairs | Ministry of Home Affairs
    2808 | Ministry of Defence | Ministry of Defence
    2809 | Ministry of Rural Development | Ministry of Rural Development
    2810 | Ministry of Housing and Urban Affairs | Ministry of Housing and Urban Affairs
    2811 | Ministry of Agriculture and Farmers Welfare | Ministry of Agriculture and Farmers Welfare
    2812 | Ministry of Labour and Employment | Ministry of Labour and Employment
    2813 | Ministry of Jal Shakti | Ministry of Jal Shakti
    2814 | Ministry of Power | Ministry of Power
    2815 | Ministry of Environment, Forest and Climate Change | Ministry of Environment, Forest and Climate Change
    2816 | Ministry of Electronics and Information Technology | Ministry of Electronics and Information Technology
    2817 | Ministry of Communications | Ministry of Communications
    2818 | Ministry of Consumer Affairs, Food and Public Distribution | Ministry of Consumer Affairs, Food and Public Distribution
    2819 | Ministry of Women and Child Development | Ministry of Women and Child Development
    2820 | Ministry of Social Justice and Empowerment | Ministry of Social Justice and Empowerment
    2821 | Ministry of Tribal Affairs | Ministry of Tribal Affairs
    2822 | Ministry of External Affairs | Ministry of External Affairs
    2823 | Central Public Works Department | Ministry of Housing and Urban Affairs
    2824 | Central Board of Direct Taxes | Ministry of Finance
    2825 | Central Board of Indirect Taxes and Customs | Ministry of Finance
    2826 | University Grants Commission | Ministry of Education
    2827 | National Health Authority | Ministry of Health and Family Welfare
    2828 | Ministry of New and Renewable Energy | Ministry of New and Renewable Energy
    2829 | Department of Higher Education | Ministry of Education
    2830 | Department of School Education and Literacy | Ministry of Education
    2831 | Central Board of Secondary Education | Ministry of Education
    2832 | National Testing Agency | Ministry of Education
    2833 | Department of Economic Affairs | Ministry of Finance
    2834 | Department of Expenditure | Ministry of Finance
    2835 | Department of Financial Services | Ministry of Finance
    2836 | Enforcement Directorate | Ministry of Finance
    2837 | Unique Identification Authority of India | Ministry of Electronics and Information Technology
    2838 | Defence Research and Development Organisation | Ministry of Defence
    2839 | All India Institute of Medical Sciences | Ministry of Health and Family Welfare
    2840 | Reserve Bank of India | Independent & Statutory Bodies
    2841 | Union Public Service Commission | Independent & Statutory Bodies
    2842 | Staff Selection Commission | Independent & Statutory Bodies
    2843 | Securities and Exchange Board of India | Independent & Statutory Bodies
    `;

    const systemPrompt = `You are an authority identification system for Government of India queries.
    Your task is to identify which government authority or ministry is concerned with the user's query.
    You will receive:

    AUTHORITIES:
    <id | name | ministry (parent authority) >

    USER QUERY:
    <user query>

    Instructions:
    1. Analyze the user's query carefully.
    2. Select the authority or ministry that is directly responsible for the subject mentioned in the query.
    3. If the query mentions a sector budget (e.g., "education budget", "railway budget", "defense budget", "health budget"), assign it to the sector's responsible Ministry (e.g. Ministry of Education for education budget, Ministry of Railways for railway budget, etc.), NOT to the Ministry of Finance unless it is a general union budget, fiscal deficit, or direct/indirect tax query.
    4. Prefer the most specific and directly responsible public authority over a broader ministry when possible.
    5. Determine jurisdiction based on WHO is responsible for the requested records.
    6. Return ONLY valid JSON in this format:

    {
        "jurisdiction": "state" | "center" | "other",
        "state": "<state>",
        "authority": { "id": "<id>", "name": "<name>", "ministry": "<ministry>" }
    }

    Do not include explanations, markdown, comments, or any additional text or backticks`;

    const prompt = `AUTHORITIES:
    ${authorities}

    USER QUERY:
    ${query}`;

    try {
        const response = await askLLM({
            systemPrompt: systemPrompt,
            prompt: prompt
        });

        if (response && typeof response === "object" && response.authority) {
            return response;
        }
        if (typeof response === "string") {
            try {
                return JSON.parse(response);
            } catch (e) {
                // proceed to fallback
            }
        }
        return response;
    } catch (llmError) {
        console.warn("LLM authority identification unavailable, activating heuristic classifier:", llmError?.message);
        return fallbackAuthorityClassifier(query);
    }
}

// Resilient Heuristic Classifier across all Government of India sectors
export function fallbackAuthorityClassifier(query) {
    const q = (query || "").toLowerCase();

    // 1. Education & Literacy / Central Universities / UGC / CBSE / NTA / School & Higher Education
    if (
        q.includes("education") ||
        q.includes("school") ||
        q.includes("university") ||
        q.includes("universities") ||
        q.includes("college") ||
        q.includes("ugc") ||
        q.includes("cbse") ||
        q.includes("nta") ||
        q.includes("aicte") ||
        q.includes("ncert") ||
        q.includes("kvs") ||
        q.includes("nvs") ||
        q.includes("scholarship") ||
        q.includes("exam") ||
        q.includes("degree") ||
        q.includes("student") ||
        q.includes("teacher") ||
        q.includes("faculty") ||
        q.includes("professor") ||
        q.includes("iit") ||
        q.includes("iim") ||
        q.includes("nit") ||
        q.includes("phd") ||
        q.includes("nirf") ||
        q.includes("naac") ||
        q.includes("literacy") ||
        q.includes("curriculum") ||
        q.includes("syllabus") ||
        q.includes("nep 2020") ||
        q.includes("samagra shiksha") ||
        q.includes("pm shri") ||
        q.includes("mid day meal") ||
        q.includes("delhi university") ||
        q.includes("jnu") ||
        q.includes("bhu") ||
        q.includes("amu")
    ) {
        let authName = "Department of Higher Education";
        let authId = "2829";

        if (
            q.includes("school") ||
            q.includes("cbse") ||
            q.includes("ncert") ||
            q.includes("kvs") ||
            q.includes("nvs") ||
            q.includes("literacy") ||
            q.includes("samagra shiksha") ||
            q.includes("pm shri") ||
            q.includes("10th") ||
            q.includes("12th")
        ) {
            authName = q.includes("cbse") ? "Central Board of Secondary Education (CBSE)" : "Department of School Education and Literacy";
            authId = q.includes("cbse") ? "2831" : "2830";
        } else if (q.includes("ugc")) {
            authName = "University Grants Commission (UGC)";
            authId = "2826";
        } else if (q.includes("nta") || q.includes("neet") || q.includes("jee") || q.includes("cuet")) {
            authName = "National Testing Agency (NTA)";
            authId = "2832";
        }

        return {
            jurisdiction: "center",
            state: null,
            authority: { id: authId, name: authName, ministry: "Ministry of Education" }
        };
    }

    // 2. National Highways / MoRTH / NHAI / Expressways / Road Transport
    if (
        q.includes("highway") ||
        q.includes("highways") ||
        q.includes("expressway") ||
        q.includes("nhai") ||
        q.includes("morth") ||
        q.includes("bharatmala") ||
        q.includes("fastag") ||
        q.includes("toll") ||
        q.includes("lane km") ||
        q.includes("road transport") ||
        q.includes("road construction") ||
        q.includes("pothole") ||
        q.includes("nh-")
    ) {
        return {
            jurisdiction: "center",
            state: null,
            authority: { id: "2805", name: "National Highways Authority of India (NHAI)", ministry: "Ministry of Road Transport and Highways" }
        };
    }

    // 3. Indian Railways / Trains / IRCTC / Vande Bharat / DFCCIL
    if (
        q.includes("railway") ||
        q.includes("railways") ||
        q.includes("train") ||
        q.includes("vande bharat") ||
        q.includes("track electrification") ||
        q.includes("amrit bharat") ||
        q.includes("station redevelopment") ||
        q.includes("rail budget") ||
        q.includes("irctc") ||
        q.includes("locomotive") ||
        q.includes("freight corridor") ||
        q.includes("dfccil") ||
        q.includes("train fare") ||
        q.includes("tatkal")
    ) {
        return {
            jurisdiction: "center",
            state: null,
            authority: { id: "2806", name: "Railway Board", ministry: "Ministry of Railways" }
        };
    }

    // 4. Healthcare / AIIMS / Ayushman Bharat / PM-JAY / Drugs & Medical
    if (
        q.includes("health") ||
        q.includes("hospital") ||
        q.includes("aiims") ||
        q.includes("ayushman") ||
        q.includes("pm-jay") ||
        q.includes("pmjay") ||
        q.includes("medical") ||
        q.includes("doctor") ||
        q.includes("bed capacity") ||
        q.includes("claims settled") ||
        q.includes("vaccine") ||
        q.includes("icmr") ||
        q.includes("medicine")
    ) {
        const isNha = q.includes("ayushman") || q.includes("pm-jay") || q.includes("pmjay") || q.includes("claims");
        return {
            jurisdiction: "center",
            state: null,
            authority: {
                id: isNha ? "2827" : "2839",
                name: isNha ? "National Health Authority (NHA) - PM-JAY" : "All India Institute of Medical Sciences (AIIMS)",
                ministry: "Ministry of Health and Family Welfare"
            }
        };
    }

    // 5. Agriculture / PM-KISAN / Farmers / Crop Insurance / MSP / ICAR
    if (
        q.includes("pm-kisan") ||
        q.includes("pmkisan") ||
        q.includes("farmer") ||
        q.includes("farmers") ||
        q.includes("agriculture") ||
        q.includes("kisan") ||
        q.includes("crop insurance") ||
        q.includes("fasal bima") ||
        q.includes("msp") ||
        q.includes("procurement") ||
        q.includes("soil health") ||
        q.includes("icar") ||
        q.includes("krishi")
    ) {
        return {
            jurisdiction: "center",
            state: null,
            authority: { id: "2811", name: "Department of Agriculture and Farmers Welfare", ministry: "Ministry of Agriculture and Farmers Welfare" }
        };
    }

    // 6. Renewable Energy / Solar / Wind / PM Surya Ghar / Clean Energy
    if (
        q.includes("renewable") ||
        q.includes("solar") ||
        q.includes("wind energy") ||
        q.includes("pm surya ghar") ||
        q.includes("surya ghar") ||
        q.includes("rooftop solar") ||
        q.includes("green energy") ||
        q.includes("clean energy") ||
        q.includes("solar park") ||
        q.includes("ireda") ||
        q.includes("seci")
    ) {
        return {
            jurisdiction: "center",
            state: null,
            authority: { id: "2828", name: "Ministry of New and Renewable Energy", ministry: "Ministry of New and Renewable Energy" }
        };
    }

    // 7. Digital India / UPI / UIDAI / Aadhaar / MeitY / IT / Semiconductor
    if (
        q.includes("aadhaar") ||
        q.includes("uidai") ||
        q.includes("upi") ||
        q.includes("digital india") ||
        q.includes("digilocker") ||
        q.includes("meity") ||
        q.includes("semiconductor") ||
        q.includes("bharatnet") ||
        q.includes("digital payment") ||
        q.includes("chip") ||
        q.includes("electronics") ||
        q.includes("cyber security") ||
        q.includes("cert-in") ||
        q.includes("nic")
    ) {
        const isUidai = q.includes("aadhaar") || q.includes("uidai");
        return {
            jurisdiction: "center",
            state: null,
            authority: {
                id: isUidai ? "2837" : "2816",
                name: isUidai ? "Unique Identification Authority of India (UIDAI)" : "Ministry of Electronics & IT (MeitY)",
                ministry: "Ministry of Electronics & IT (MeitY)"
            }
        };
    }

    // 8. Defence / Military / Armed Forces / DRDO / Army / Navy / Air Force
    if (
        q.includes("defence") ||
        q.includes("defense") ||
        q.includes("army") ||
        q.includes("navy") ||
        q.includes("air force") ||
        q.includes("drdo") ||
        q.includes("military") ||
        q.includes("weapons") ||
        q.includes("agniveer") ||
        q.includes("cantonment")
    ) {
        return {
            jurisdiction: "center",
            state: null,
            authority: { id: "2808", name: "Department of Defence", ministry: "Ministry of Defence" }
        };
    }

    // 9. Rural Development / MGNREGA / PMGSY / Gram Sadak
    if (
        q.includes("mgnrega") ||
        q.includes("nrega") ||
        q.includes("rural development") ||
        q.includes("job card") ||
        q.includes("person days") ||
        q.includes("rural wage") ||
        q.includes("pmgsy") ||
        q.includes("gram sadak") ||
        q.includes("panchayat")
    ) {
        return {
            jurisdiction: "center",
            state: null,
            authority: { id: "2809", name: "Department of Rural Development", ministry: "Ministry of Rural Development" }
        };
    }

    // 10. Urban Housing / PMAY-U / Smart Cities / CPWD / DDA / MOHUA
    if (
        q.includes("smart cities") ||
        q.includes("smart city") ||
        q.includes("pmay") ||
        q.includes("housing") ||
        q.includes("urban") ||
        q.includes("cpwd") ||
        q.includes("dda") ||
        q.includes("mohua")
    ) {
        return {
            jurisdiction: "center",
            state: null,
            authority: { id: "2823", name: "Central Public Works Department (CPWD)", ministry: "Ministry of Housing and Urban Affairs" }
        };
    }

    // 11. Home Affairs / Police / Security / CRPF / BSF / CISF
    if (
        q.includes("police") ||
        q.includes("crpf") ||
        q.includes("bsf") ||
        q.includes("cisf") ||
        q.includes("home affairs") ||
        q.includes("delhi police") ||
        q.includes("nia") ||
        q.includes("ib") ||
        q.includes("immigration")
    ) {
        return {
            jurisdiction: "center",
            state: null,
            authority: { id: "2807", name: "Delhi Police", ministry: "Ministry of Home Affairs" }
        };
    }

    // 12. Direct Taxes / Indirect Taxes / GST / Banking / General Finance & Union Budget
    if (
        q.includes("income tax") ||
        q.includes("direct tax") ||
        q.includes("cbdt") ||
        q.includes("corporate tax") ||
        q.includes("tax collected") ||
        q.includes("tax collection") ||
        q.includes("tds") ||
        q.includes("advance tax") ||
        q.includes("gst") ||
        q.includes("cbic") ||
        q.includes("customs") ||
        q.includes("excise") ||
        q.includes("finance") ||
        q.includes("banking") ||
        q.includes("rbi") ||
        q.includes("fiscal") ||
        q.includes("disinvestment")
    ) {
        let authName = "Central Board of Direct Taxes (CBDT) - Income Tax";
        let authId = "2824";

        if (q.includes("gst") || q.includes("cbic") || q.includes("customs") || q.includes("indirect")) {
            authName = "Central Board of Indirect Taxes and Customs (CBIC) - GST";
            authId = "2825";
        } else if (q.includes("banking") || q.includes("loan") || q.includes("npa") || q.includes("bank")) {
            authName = "Department of Financial Services";
            authId = "2835";
        } else if (q.includes("fiscal") || q.includes("economic") || q.includes("union budget")) {
            authName = "Department of Economic Affairs";
            authId = "2833";
        }

        return {
            jurisdiction: "center",
            state: null,
            authority: { id: authId, name: authName, ministry: "Ministry of Finance" }
        };
    }

    // Default fallback
    return {
        jurisdiction: "center",
        state: null,
        authority: { id: "2801", name: "Department of Economic Affairs", ministry: "Ministry of Finance" }
    };
}