import { z } from "zod";

/* ---------------- Upload Response Validation ---------------- */

// Zod schema for a single uploaded file
export const UploadedFileSchema = z.object({
    serverData: z.object({
        userId: z.string().min(1, "UserId is required"),
        file: z.object({
            url: z.string().url("Invalid file URL"),
            name: z.string().min(1, "File name is required"),
        }),
    }),
});

// Zod schema for the array
export const UploadResponseSchema = z.array(UploadedFileSchema).min(1, "No files uploaded");

export type UploadResponse = z.infer<typeof UploadResponseSchema>;


/* ---------------- PDF Summary Validation ---------------- */

export const CreatePdfSummarySchema = z.object({
    userId: z.string().min(1, "UserId is required"),
    originalFileUrl: z
        .string()
        .url("OriginalFileUrl must be a valid URL"),
    summaryText: z
        .string()
        .min(10, "SummaryText must be at least 10 characters long"),
    title: z
        .string()
        .max(200, "Title must be 200 characters or fewer")
        .optional(),
    fileName: z
        .string()
        .max(255, "FileName must be 255 characters or fewer")
        .optional(),
});

export type CreatePdfSummaryInput = z.infer<typeof CreatePdfSummarySchema>;