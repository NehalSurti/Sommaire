"use server"

import { s3Client, BUCKET_NAME } from "@/lib/s3"
import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";
import { auth } from '@clerk/nextjs/server'
import crypto from "crypto"

const uploadSchema = z.object({
    fileName: z.string()
        .min(1)
        .max(200),
    // .regex(/^[a-zA-Z0-9._-]+$/, {
    //     message: "File name contains invalid characters",
    // }),
    fileType: z
        .string()
        .min(1)
        .regex(/^[-\w.]+\/[-\w.+]+$/, { message: "Invalid MIME type" })
        .refine((type) => type === "application/pdf", {
            message: "Only PDF files are allowed",
        }),

    fileSize: z
        .number()
        .min(1)
        .max(20 * 1024 * 1024) // max 20MB

});

const downloadSchema = z.object({
    fileName: z.string()
        .min(1)
        .max(200),
})

const generateFileName = (bytes = 32) =>
    crypto.randomBytes(bytes).toString("hex")


export async function getUploadSignedURL(fileName: string, fileType: string, fileSize: number, checksum: string) {
    try {

        const { userId } = await auth()

        if (!userId) {
            return {
                success: false,
                errorCode: "AUTHENTICATION_ERROR",
                error: "Not Authenticated",
            };
        }

        const validated = uploadSchema.parse({ fileName, fileType, fileSize });

        const key = generateFileName();

        const putObjectCommand = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            ContentType: validated.fileType,
            ContentLength: validated.fileSize,
            ChecksumSHA256: checksum,
            Metadata: {
                userId
            }
        });

        const signedURL = await getSignedUrl(s3Client, putObjectCommand, { expiresIn: 60 });

        return {
            success: true,
            url: signedURL,
            key: key,
            bucket: BUCKET_NAME,
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                errorCode: "VALIDATION_ERROR",
                error: "Validation failed",
                details: error,
            };
        }
        console.error("Error generating signed URL:", error);
        return {
            success: false,
            error: (error as Error).message,
        };
    }
}

export async function getDownloadUrl(fileName: string) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return {
                success: false,
                errorCode: "AUTHENTICATION_ERROR",
                error: "Not Authenticated",
            };
        }

        const validated = downloadSchema.parse({ fileName });

        const getObjectCommand = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: validated.fileName });

        const signedDownloadURL = await getSignedUrl(s3Client, getObjectCommand, { expiresIn: 60 });

        return {
            success: true,
            url: signedDownloadURL,
            key: validated.fileName,
            bucket: BUCKET_NAME,
        };

    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                errorCode: "VALIDATION_ERROR",
                error: "Validation failed",
                details: error,
            };
        }
        console.error("Error getting download URL:", error);
        return {
            success: false,
            error: (error as Error).message,
        };
    }
}