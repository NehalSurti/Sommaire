"use client";
import { getUploadSignedURL } from "@/actions/bucketActions";
import UploadFormInput from "./upload-form-input";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { generatePdfSummary } from "@/actions/processPdfActions";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const inputSchema = z.object({
  file: z
    .file({ message: "Invalid File" })
    .mime(["application/pdf"], {
      message: "Invalid file type. File must be a PDF.",
    })
    .min(10_000, { message: "File is too small. Minimum size is 10 KB." })
    .max(20 * 1024 * 1024, {
      message: "File is too large. Maximum size is 20 MB.",
    }),
});

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

  if (!isSignedIn) {
    redirect("/sign-in");
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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

    try {
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

      toast.success("PDF uploaded successfully!");

      toast.info("📄 Processing PDF", {
        description: "Hang tight! Our AI is reading through your document! ✨",
      });

      const uploadRes = [
        {
          serverData: {
            userId: userId,
            file: {
              url: "https://example.com/file.pdf",
              name: validFile.name,
            },
          },
        },
      ];

      const summary = await generatePdfSummary(uploadRes);
      // e.currentTarget.reset();
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Upload Error", {
        description: "An error occurred while uploading. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <UploadFormInput onSubmit={handleSubmit}></UploadFormInput>
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
