"use server"

import { generateSummaryFromGemini } from "@/lib/geminiai";
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { auth } from '@clerk/nextjs/server'
import prisma from "@/lib/prisma";
import type { PdfSummary } from "@/app/generated/prisma";
import { z } from "zod";
import { sanitizePdfSummaryInput, sanitizeUploadResponse } from "@/utils/sanitizeInput";
import { CreatePdfSummaryInput, CreatePdfSummarySchema, UploadResponse, UploadResponseSchema } from "@/utils/validateInput";
import { revalidatePath } from "next/cache";



interface SummaryResult {
    success: boolean;
    data: {
        title: string;
        summary: string
    } | null;
    error?: string;
}

export async function generatePdfSummary(uploadResponse: UploadResponse): Promise<SummaryResult> {

    try {
        // Ensure authentication
        const { userId } = await auth();

        if (!userId) {
            throw new Error("AUTHENTICATION_ERROR: Not Authenticated");
        }

        // Validate input using Zod
        const parsed = UploadResponseSchema.parse(uploadResponse);

        //Sanitize input
        const safeUpload = sanitizeUploadResponse(parsed)[0];

        const { serverData: { file: { url: pdfUrl, name: fileName } } } = safeUpload;

        // Extract text from PDF
        const pdfText = await fetchAndExtractPdfText(pdfUrl);

        if (!pdfText.success || !pdfText.data) {
            throw new Error(pdfText.error || "Failed to extract text from PDF");
        }

        // Generate summary        
        try {
            const summary = await generateSummaryFromGemini(pdfText.data);
            console.log("Generated Summary: ", summary);

            if (!summary) {
                throw new Error("Gemini API Error");
            }

            return {
                success: true,
                data: { title: fileName, summary }
            }
        } catch (geminiError) {
            console.error("Gemini API failed", geminiError);
            throw new Error("AI summarization failed");
        }

    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: "Validation failed",
                data: null
            };
        }
        console.error("Error uploading file:", error);
        return {
            success: false,
            error: (error as Error).message,
            data: null
        }
    }
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

        // Validate input
        const parsed = CreatePdfSummarySchema.parse(data);

        // Sanitize input
        const safeData = sanitizePdfSummaryInput(parsed);

        const pdfSummary = await prisma.pdfSummary.create({
            data: {
                userId: safeData.userId,
                originalFileUrl: safeData.originalFileUrl,
                summaryText: safeData.summaryText,
                title: safeData.title ?? null,
                fileName: safeData.fileName ?? null,
                // status defaults to "completed"
            },
        });

        // revalidatePath(`/summaries/${pdfSummary.id}`); //TODO: Uncomment if needed

        return { success: true, data: pdfSummary };

    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: "Validation failed",
            };
        }
        console.error("Error saving PDF summary:", error);
        return {
            success: false,
            error: (error as Error).message || "Error saving PDF summary",
        }
    }
}