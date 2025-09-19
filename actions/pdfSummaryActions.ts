"use server";

import prisma from "@/lib/prisma";
import type { PdfSummary } from "@/app/generated/prisma";
import { auth } from '@clerk/nextjs/server'
import z from "zod";

// Generic action result type
interface ActionResult<T> {
    success: boolean;
    data: T | null;
    error?: string;
}

const UserIdSchema = z.string().uuid();

/**
 * Fetch user PDF Summaries
 */

export async function getUserPdfSummaries(userId: string): Promise<ActionResult<PdfSummary[]>> {
    try {

        // Validate input
        UserIdSchema.parse(userId);

        // Ensure authentication
        const { userId: user_ID } = await auth();

        if (!user_ID || user_ID !== userId) {
            throw new Error("AUTHENTICATION_ERROR: Not Authenticated");
        }

        const userPdfSummaries = await prisma.pdfSummary.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" }, // newest first
        });

        return {
            success: true,
            data: userPdfSummaries
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: "Validation failed",
                data: null
            };
        }
        console.error("Error fetching user summaries:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            data: null
        }
    }

}

/**
 * Fetch a single PDF summary by ID
 */
export async function getPdfSummaryById(
    id: string
): Promise<ActionResult<PdfSummary>> {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error("AUTHENTICATION_ERROR: Not Authenticated");
        }

        const summary = await prisma.pdfSummary.findUnique({
            where: { id },
        });

        if (!summary || summary.userId !== userId) {
            throw new Error("NOT_FOUND: Summary not found or access denied");
        }

        return { success: true, data: summary };
    } catch (error) {
        console.error("Error fetching summary:", error);
        return {
            success: false,
            data: null,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}



/**
 * Delete a PDF summary by ID
 */
export async function deletePdfSummaryById(
    id: string
): Promise<ActionResult<null>> {
    try {

        const { userId } = await auth();
        if (!userId) {
            throw new Error("AUTHENTICATION_ERROR: Not Authenticated");
        }

        // Ensure the summary exists and belongs to the user
        const summary = await prisma.pdfSummary.findUnique({ where: { id } });

        if (!summary || summary.userId !== userId) {
            throw new Error("NOT_FOUND: Summary not found or access denied");
        }

        await prisma.pdfSummary.delete({ where: { id } });

        return { success: true, data: null };
    } catch (error) {
        console.error("Error deleting summary:", error);
        return {
            success: false,
            data: null,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}
