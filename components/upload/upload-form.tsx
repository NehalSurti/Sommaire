"use client";
import UploadFormInput from "./upload-form-input";

export default function UploadForm() {
  const handleSubmit = () => {};
  return (
    <div>
      <UploadFormInput onSubmit={handleSubmit}></UploadFormInput>
    </div>
  );
}
