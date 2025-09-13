"use client";

import { getDownloadUrl, getUploadSignedURL } from "@/actions/bucketActions";
import UploadFormInput from "./upload-form-input";
import { z } from "zod";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  generatePdfSummary,
  storePdfSummaryAction,
} from "@/actions/processPdfActions";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

// Zod validation schema
const inputSchema = z.object({
  file: z
    .instanceof(File, { message: "Invalid File" })
    .refine((file) => file.type === "application/pdf", {
      message: "Invalid file type. File must be a PDF.",
    })
    .refine((file) => file.size >= 10_000, {
      message: "File is too small. Minimum size is 10 KB.",
    })
    .refine((file) => file.size <= 20 * 1024 * 1024, {
      message: "File is too large. Maximum size is 20 MB.",
    }),
});

// Utility: SHA-256 checksum generator
async function calculateSHA256(file: File): Promise<string> {
  // Read the file into an ArrayBuffer
  const buffer = await file.arrayBuffer();

  // Use Web Crypto API to hash it
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);

  // Convert ArrayBuffer → Base64 string (S3 expects Base64 for checksum headers)
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashBinary = String.fromCharCode(...hashArray);
  return btoa(hashBinary);
}

export default function UploadForm() {
  const [loading, setLoading] = useState(false);
  const { isSignedIn, userId } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);

  if (!isSignedIn) {
    redirect("/sign-in");
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (loading) return; // prevent double submit

      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;

      const validatedFields = inputSchema.safeParse({ file });

      if (!validatedFields.success) {
        let fieldErrors: Record<string, string> = {};

        for (const issue of validatedFields.error.issues) {
          const key = issue.path?.join(".") || "unknown_field";
          fieldErrors[key] = issue.message;
        }

        console.error("Validation errors:", fieldErrors);
        toast.error("Validation Error", {
          description: Object.values(fieldErrors).flat()[0] ?? "Unknown error",
        });
        return;
      }

      setLoading(true);

      toast.info("Uploading PDF...", {
        description: "We are uploading your PDF!",
      });

      console.log("Validation:", validatedFields.data);
      const validFile = validatedFields.data.file as File;
      const checksum = await calculateSHA256(validFile);
      const signedURLResult = await getUploadSignedURL(
        validFile.name,
        validFile.type,
        validFile.size,
        checksum
      );

      if (!signedURLResult.success) {
        console.error("Signed URL error:", signedURLResult);
        toast.error("Signed URL Error", {
          description: signedURLResult.error,
        });
        return;
      }

      const { url } = signedURLResult;

      if (!url) {
        console.error("Error: No upload URL returned");
        toast.error("Error: No upload URL returned");
        return;
      }

      const uploadResponse = await fetch(url, {
        method: "PUT",
        body: validFile,
        headers: { "Content-Type": validFile.type },
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed with status ${uploadResponse.status}`);
      }

      console.log("s3 uploadResponse response : ", uploadResponse);

      const uploadResponseUrl = uploadResponse.url;
      const fileKey = new URL(uploadResponseUrl).pathname.split("/").pop();

      if (!fileKey) throw new Error("Failed to extract file key.");

      console.log("fileKey : ", fileKey);

      const downloadURLResult = await getDownloadUrl(fileKey);

      console.log("downloadURLResult : ", downloadURLResult);

      if (!downloadURLResult.success || !downloadURLResult.url) {
        console.error("Signed download URL error:", downloadURLResult);
        toast.error("Signed download URL error", {
          description: downloadURLResult.error,
        });
        return;
      }

      const downloadUrl = downloadURLResult.url;

      toast.success("PDF uploaded successfully!");

      toast.info("📄 Processing PDF", {
        description: "Hang tight! Our AI is reading through your document! ✨",
      });

      const uploadRes = [
        {
          serverData: {
            userId: userId,
            file: {
              url: downloadUrl,
              name: fileKey,
            },
          },
        },
      ];

      const summary = await generatePdfSummary(uploadRes);

      if (!summary || !summary.success) {
        console.error("Summary generation error:", summary);
        toast.error("Summary generation error");
        return;
      }

      const { data = null } = summary;

      if (data) {
        toast.info("📄 Saving PDF...", {
          description: "Hang tight! We are saving your summary! ✨",
        });

        const res = await storePdfSummaryAction({
          userId: userId,
          originalFileUrl: downloadUrl,
          summaryText: data,
          title: "My PDF Summary",
          fileName: fileKey,
        });
        console.log("Save Summary Response : ", res);
      }

      // e.currentTarget.reset();
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Upload Error", {
        description: "An error occurred while uploading. Please try again.",
      });
    } finally {
      setLoading(false);
      formRef.current?.reset();
    }
  };
  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <UploadFormInput
        loading={loading}
        ref={formRef}
        onSubmit={handleSubmit}
      ></UploadFormInput>
      {/* {Object.values(errors).length > 0 && (
        <div className="text-red-600">
          {Object.entries(errors).map(([field, message]) => (
            <p key={field}>{message}</p>
          ))}
        </div>
      )} */}
      {loading && <p className="text-gray-500">Uploading...</p>}
    </div>
  );
}
