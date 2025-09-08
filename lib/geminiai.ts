import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";
import { GoogleGenAI } from "@google/genai";

export async function generateSummaryFromGemini(pdfText: string) {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });



        const prompt = `${SUMMARY_SYSTEM_PROMPT}\n\nTransform this document into an engaging, easy-to-read summary with contextually relevant emojis and proper markdown formatting:\n\n${pdfText}`;

        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: prompt,
            config: {
                systemInstruction: SUMMARY_SYSTEM_PROMPT,
                temperature: 0.7,
            },
        });
        console.log("generated text : ", response.text);
        return response.text;
    } catch (error) {
        console.error("Gemini Error : ", error);
        return null;
    }


}