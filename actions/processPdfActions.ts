"use server"

import { generateSummaryFromGemini } from "@/lib/geminiai";
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { auth } from '@clerk/nextjs/server'
import prisma from "@/lib/prisma";
import type { PdfSummary } from "@/app/generated/prisma";

type UploadResponse = Array<{
    serverData: {
        userId: string;
        file: {
            url: string;
            name: string;
        };
    };
}>;

interface SummaryResult {
    success: boolean;
    data: string | null;
    error?: string;
}

export async function generatePdfSummary(uploadResponse: UploadResponse): Promise<SummaryResult> {

    try {

        // Ensure authentication
        const { userId: user_ID } = await auth();
        if (!user_ID) {
            throw new Error("AUTHENTICATION_ERROR: Not Authenticated");
        }

        // Validate input
        if (!uploadResponse?.length) {
            return {
                success: false,
                error: "No file uploaded",
                data: null
            }
        }

        const { serverData: {
            userId, file: { url: pdfUrl, name: fileName }
        } } = uploadResponse[0];

        if (!pdfUrl) {
            return {
                success: false,
                error: "Invalid file URL",
                data: null
            }
        }

        // Extract text from PDF
        const pdfText = await fetchAndExtractPdfText(pdfUrl);

        if (!pdfText.success || !pdfText.data) {
            throw new Error(pdfText.error || "Failed to extract text from PDF");
        }

        // Generate summary        
        try {
            const summary = await generateSummaryFromGemini(pdfText.data);

            if (!summary) {
                throw new Error("Gemini API Error");
            }
            return {
                success: true,
                data: summary
            }
        } catch (geminiError) {
            console.error("Gemini API failed", geminiError);
            throw new Error("AI summarization failed");
        }

    } catch (error) {
        console.error("Error uploading file:", error);
        return {
            success: false,
            error: (error as Error).message,
            data: null
        }
    }
}

interface CreatePdfSummaryInput {
    userId: string;
    originalFileUrl: string;
    summaryText: string;
    title?: string;
    fileName?: string;
}

interface CreatePdfSummaryResult {
    success: boolean;
    data?: PdfSummary;
    error?: string;
}

export async function storePdfSummaryAction(data: CreatePdfSummaryInput): Promise<CreatePdfSummaryResult> {
    try {
        // Ensure authentication
        const { userId: user_ID } = await auth();
        if (!user_ID) {
            throw new Error("AUTHENTICATION_ERROR: Not Authenticated");
        }

        const pdfSummary = await prisma.pdfSummary.create({
            data: {
                userId: data.userId,
                originalFileUrl: data.originalFileUrl,
                summaryText: data.summaryText,
                title: data.title,
                fileName: data.fileName,
                // status defaults to "completed"
            },
        });

        return { success: true, data: pdfSummary };

    } catch (error) {
        console.error("Error saving PDF summary:", error);
        return {
            success: false,
            error: (error as Error).message || "Error saving PDF summary",
        }
    }
}