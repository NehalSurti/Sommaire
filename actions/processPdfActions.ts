"use server"

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
    } catch (error) {
        console.error("Error uploading file:", error);
        return {
            success: false,
            error: "File upload failed",
            data: null
        }
    }


}