"use server"

import { generateSummaryFromGemini } from "@/lib/geminiai";
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { auth } from '@clerk/nextjs/server'

export async function generatePdfSummary(uploadResponse: Array<{
    serverData: {
        userId: string;
        file: {
            url: string;
            name: string;
        }
    }
}>) {

    const { userId: user_ID } = await auth();
    if (!user_ID) {
        throw new Error("AUTHENTICATION_ERROR: Not Authenticated");
    }

    if (!uploadResponse) {
        return {
            success: false,
            error: "File upload failed",
            data: null
        }
    }

    const { serverData: {
        userId, file: { url: pdfUrl, name: fileName }
    } } = uploadResponse[0];

    if (!pdfUrl) {
        return {
            success: false,
            error: "File upload failed",
            data: null
        }
    }

    try {
        const pdfText = await fetchAndExtractPdfText(pdfUrl);

        if (!pdfText.success || !pdfText.data) {
            throw new Error(pdfText.error);
        }
        console.log("pdfText : ", pdfText.data);

        let summary;
        try {
            summary = await generateSummaryFromGemini(pdfText.data);
        } catch (geminiError) {
            console.error("Gemini API failed", geminiError);
            throw new Error("Failed to generate summary with available AI Provider");
        }

    } catch (error) {
        console.error("Error uploading file:", error);
        return {
            success: false,
            error: "File upload failed",
            data: null
        }
    }


}