import { askGemini } from "./gemini.js";

export function askLLM({
    systemPrompt,
    prompt,
}) {
    return askGemini({
        systemPrompt,
        prompt,
    });
}