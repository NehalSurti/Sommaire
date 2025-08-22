"use client";
import UploadFormInput from "./upload-form-input";
import { z } from "zod";

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

export default function UploadForm() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;

    const validatedFields = inputSchema.safeParse({ file });

    if (!validatedFields.success) {
      let fieldErrors: Record<string, string> = {};

      for (const issue of validatedFields.error.issues) {
        const key = issue.path?.join(".") || "unknown_field";
        fieldErrors[key] = issue.message;
      }
      console.log("Validation errors:", fieldErrors);
    } else {
      console.log("Validation:", validatedFields.data);
    }
  };
  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <UploadFormInput onSubmit={handleSubmit}></UploadFormInput>
    </div>
  );
}
