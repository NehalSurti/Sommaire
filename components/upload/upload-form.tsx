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
import { useUser } from "@clerk/nextjs";
import { getUserByEmail } from "@/actions/userActions";
import { MotionDiv } from "../common/motion-wrapper";
import { itemVariants } from "@/utils/constants";
import LoadingSkeleton from "./loading-skeleton";

/* ----------------------------- Validation Schema ---------------------------- */
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

/* ------------------- Utility: SHA-256 checksum generator ------------------ */
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

/* ---------------------------- Helper Functions ---------------------------- */
const notify = {
  info: (title: string, desc?: string) =>
    toast.info(title, { description: desc }),
  success: (title: string, desc?: string) =>
    toast.success(title, { description: desc }),
  error: (title: string, desc?: string) =>
    toast.error(title, { description: desc }),
};

const handleError = (msg: string, err?: unknown) => {
  console.error(msg, err);
  notify.error("Error", msg);
};

export default function UploadForm() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (loading) return; // prevent double submit
      setErrorMsg(null);

      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;

      // Validate file
      const validatedFields = inputSchema.safeParse({ file });
      if (!validatedFields.success) {
        let fieldErrors: Record<string, string> = {};

        for (const issue of validatedFields.error.issues) {
          const key = issue.path?.join(".") || "unknown_field";
          fieldErrors[key] = issue.message;
        }

        console.error("Validation errors:", fieldErrors);
        const msg = Object.values(fieldErrors).flat()[0] ?? "Unknown error";
        notify.error("Validation Error", msg);
        setErrorMsg(msg);
        return;
      }

      setLoading(true);

      const user = await getUserByEmail(email as string);
      if (!user.success || !user.data) {
        throw new Error("Failed to fetch user from database.");
      }
      notify.info("Uploading PDF...", "We are uploading your file!");

      const validFile = validatedFields.data.file as File;
      const checksum = await calculateSHA256(validFile);
      const signedURLResult = await getUploadSignedURL(
        validFile.name,
        validFile.type,
        validFile.size,
        checksum
      );

      if (!signedURLResult.success || !signedURLResult.url) {
        throw new Error(
          signedURLResult.error ?? "Failed to get signed upload URL."
        );
      }

      // Upload to S3
      const uploadResponse = await fetch(signedURLResult.url, {
        method: "PUT",
        body: validFile,
        headers: { "Content-Type": validFile.type },
      });
      if (!uploadResponse.ok) {
        throw new Error(`Upload failed with status ${uploadResponse.status}`);
      }

      const uploadResponseUrl = uploadResponse.url;
      const fileKey = new URL(uploadResponseUrl).pathname.split("/").pop();
      if (!fileKey) throw new Error("File key extraction failed.");

      // Get download URL
      const downloadURLResult = await getDownloadUrl(fileKey);
      if (!downloadURLResult.success || !downloadURLResult.url) {
        throw new Error(
          downloadURLResult.error ?? "Failed to get download URL."
        );
      }

      const downloadUrl = downloadURLResult.url;

      notify.success("Upload Complete", "Your PDF was uploaded successfully!");
      notify.info("Processing PDF...", "Our AI is summarizing your document.");

      const uploadRes = [
        {
          serverData: {
            file: {
              url: downloadUrl,
              name: fileKey,
            },
          },
        },
      ];

      // Generate summary
      const summary = await generatePdfSummary(uploadRes);

      if (!summary?.success || !summary.data) {
        throw new Error(summary.error ?? "Failed to generate summary.");
      }

      const summaryData = summary.data;
      notify.info("Saving Summary...", "Finalizing your summary data.");

      // Store summary in DB
      const storeResult = await storePdfSummaryAction({
        userId: user.data?.id as string,
        originalFileUrl: downloadUrl,
        summaryText: summaryData.summary,
        title: summaryData.title,
        fileName: fileKey,
      });

      if (!storeResult.success || !storeResult.data)
        throw new Error("Failed to save summary.");

      notify.success("Summary Complete!", "Your summary has been saved.");

      formRef.current?.reset();

      window.location.href = `/summaries/${storeResult.data.id}`;
    } catch (err) {
      handleError("An error occurred while uploading.", err);
      setErrorMsg("An error occurred during upload. Please try again.");
      formRef.current?.reset();
    } finally {
      setLoading(false);
    }
  };
  return (
    <MotionDiv
      variants={itemVariants}
      className="flex flex-col gap-8 w-full max-w-2xl mx-auto"
    >
      <UploadFormInput
        loading={loading}
        ref={formRef}
        onSubmit={handleSubmit}
      ></UploadFormInput>
      {/* Inline error message */}
      {errorMsg && (
        <p className="text-sm text-red-600 mt-1 font-medium">{errorMsg}</p>
      )}
      {loading && (
        <>
          <p className="text-gray-500 animate-pulse">Uploading...</p>
          <LoadingSkeleton></LoadingSkeleton>
        </>
      )}
    </MotionDiv>
  );
}
