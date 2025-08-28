"use server"

import { s3Client, BUCKET_NAME } from "@/lib/s3"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import {
    getSignedUrl,
} from "@aws-sdk/s3-request-presigner";
import { z } from "zod";

const uploadSchema = z.object({
    fileName: z.string().min(1).max(200).regex(/^[a-zA-Z0-9._-]+$/, {
        message: "File name contains invalid characters",
    }),
    fileType: z
        .string()
        .min(1)
        .regex(/^[-\w.]+\/[-\w.+]+$/, { message: "Invalid MIME type" }),
});

export async function getUploadSignedURL(fileName: string, fileType: string) {
    try {


        const putObjectCommand = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: `${fileName}`,
            ContentType: fileType
        });

        const signedURL = await getSignedUrl(s3Client, putObjectCommand, { expiresIn: 60 });

        return { success: { url: signedURL } }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: "Validation failed",
                details: error.errors,
            };
        }
        console.error("Error generating signed URL:", error);
        return {
            success: false,
            error: (error as Error).message,
        };
    }



}