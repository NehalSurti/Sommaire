
import sanitizeHtml from "sanitize-html";
import { CreatePdfSummaryInput, UploadResponse } from "./validateInput";

/* ---------------- Shared Utilities ---------------- */

// Removes dangerous HTML, trims whitespace, and normalizes input fields.
function cleanText(input: string): string {
    return sanitizeHtml(input, {
        allowedTags: [],       // no HTML tags
        allowedAttributes: {}, // no attributes
    }).trim();
}

// Ensures filenames are safe for DB and filesystem usage.
function sanitizeFileName(fileName: string): string {
    return fileName
        .replace(/[^a-zA-Z0-9_\-.]/g, "_") // allow only safe characters
        .substring(0, 255); // enforce max length
}

// Sanitizes URLs: trims whitespace
export function sanitizeUrl(url: string): string {
    return url.trim();
}

/* ---------------- Action-Specific Wrappers ---------------- */

//Sanitizes UploadResponse from file uploads
export function sanitizeUploadResponse(uploadResponse: UploadResponse): UploadResponse {
    return uploadResponse.map((item) => ({
        serverData: {
            userId: cleanText(item.serverData.userId),
            file: {
                url: sanitizeUrl(item.serverData.file.url),
                name: sanitizeFileName(item.serverData.file.name),
            },
        },
    }));
}

// Sanitizes PDF summary input before saving to DB
export function sanitizePdfSummaryInput(input: CreatePdfSummaryInput): CreatePdfSummaryInput {
    return {
        userId: cleanText(input.userId),
        originalFileUrl: sanitizeUrl(input.originalFileUrl),
        summaryText: cleanText(input.summaryText),
        title: input.title ? cleanText(input.title) : undefined,
        fileName: input.fileName ? sanitizeFileName(input.fileName) : undefined,
    };
}
