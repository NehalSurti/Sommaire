import BgGradient from "@/components/common/Bg-Gradient";
import UploadForm from "@/components/upload/upload-form";
import UploadHeader from "@/components/upload/upload-header";
import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { hasReachedUploadLimit } from "@/lib/user";
import { currentUser } from "@clerk/nextjs/server";
import { getUserByEmail } from "@/actions/userActions";
import { MotionDiv } from "@/components/common/motion-wrapper";
import { containerVariants } from "@/utils/constants";

export const maxDuration = 20;

export default async function Page() {
  // Ensure authentication
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/sign-in");
  }

  const clerkEmail = clerkUser?.primaryEmailAddress?.emailAddress;
  if (!clerkEmail) {
    console.error("User email not found");
    redirect("/sign-in");
  }

  const DbUser = await getUserByEmail(clerkEmail as string);
  if (!DbUser.success || !DbUser.data) {
    console.error("Failed to fetch user from database.");
    return;
  }

  // Check upload limit
  const uploadLimitResult = await hasReachedUploadLimit(DbUser.data);

  if (!uploadLimitResult.success || !uploadLimitResult.data) {
    console.error("Error checking upload limit:", uploadLimitResult.error);
    return;
  }

  const { hasReachedUploadLimit: uploadLimitReached } = uploadLimitResult.data;

  if (uploadLimitReached) {
    redirect("/dashboard");
  }

  return (
    <section className="min-h-screen">
      <BgGradient></BgGradient>
      <MotionDiv
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8"
      >
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <UploadHeader></UploadHeader>
          <UploadForm></UploadForm>
        </div>
      </MotionDiv>
    </section>
  );
}
