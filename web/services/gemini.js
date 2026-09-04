import { GoogleGenAI } from "@google/genai";

function getApiKeys() {
    return [
        process.env.GEMINI_API_KEY_1,
        process.env.GEMINI_API_KEY_2,
        process.env.GEMINI_API_KEY_3,
        process.env.GEMINI_API_KEY,
        process.env.GOOGLE_API_KEY,
    ].filter(Boolean);
}

const SUPPORTED_MODELS = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash"
];

let currentClient = 0;

export async function askGemini({
    systemPrompt,
    prompt,
}) {
    if (!prompt) {
        throw new Error("User prompt is required");
    }

    const apiKeys = getApiKeys();
    if (apiKeys.length === 0) {
        throw new Error("No Gemini API keys configured. Please set GEMINI_API_KEY or GEMINI_API_KEY_1 in your environment variables.");
    }

    const clients = apiKeys.map(
        (apiKey) => new GoogleGenAI({ apiKey })
    );

    const clientIndex = currentClient % clients.length;
    const ai = clients[clientIndex];

    // Round-robin
    currentClient = (currentClient + 1) % clients.length;

    console.log(
        `GEMINI_LOG : USING GEMINI_API_KEY_${clientIndex + 1}`
    );

    let lastError = null;

    for (const modelName of SUPPORTED_MODELS) {
        try {
            let rawText = "";

            if (ai.models && typeof ai.models.generateContent === "function") {
                const response = await ai.models.generateContent({
                    model: modelName,
                    contents: prompt,
                    config: {
                        systemInstruction: systemPrompt,
                        responseMimeType: "application/json"
                    }
                });
                rawText = response?.text || "";
            } else if (ai.interactions && typeof ai.interactions.create === "function") {
                const interaction = await ai.interactions.create({
                    model: modelName,
                    system_instruction: systemPrompt,
                    input: prompt,
                });
                rawText = interaction?.output_text || "";
            }

            if (!rawText) {
                throw new Error(`Empty response from model ${modelName}`);
            }

            // Clean any code block wrappers
            const cleaned = rawText
                .replace(/^```json\s*/i, "")
                .replace(/^```\s*/i, "")
                .replace(/\s*```$/i, "")
                .trim();

            return JSON.parse(cleaned);

        } catch (error) {
            console.warn(`Model ${modelName} attempt failed:`, error?.message || error);
            lastError = error;
            // Continue to fallback model in SUPPORTED_MODELS
        }
    }

    console.error(`GEMINI_ERROR : All models failed for API_KEY_${clientIndex + 1}:`, lastError?.message || "Unknown Gemini API error");
    throw new Error(lastError?.message || "Failed to generate response from Gemini API");
}