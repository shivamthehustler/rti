import { askGemini } from "./gemini";

export function askLLM({
    systemPrompt,
    prompt,
}) {
    return askGemini({
        systemPrompt,
        prompt,
    });
}