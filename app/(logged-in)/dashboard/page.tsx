import BgGradient from "@/components/common/Bg-Gradient";
import SummaryCard from "@/components/summaries/summary-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { redirect } from "next/navigation";
import { getUserPdfSummaries } from "@/actions/pdfSummaryActions";
import { toast } from "sonner";
import EmptySummaryState from "@/components/summaries/empty-summary-state";
import { hasReachedUploadLimit } from "@/lib/user";
import { currentUser } from "@clerk/nextjs/server";
import { getUserByEmail } from "@/actions/userActions";
import {
  MotionDiv,
  MotionH1,
  MotionP,
} from "@/components/common/motion-wrapper";
import { containerVariants, itemVariants } from "@/utils/constants";

export default async function DashboardPage() {
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

  const { hasReachedUploadLimit: uploadLimitReached, uploadLimit } =
    uploadLimitResult.data;

  if (uploadLimitReached) {
    redirect("/dashboard/upgrade");
  }

  const result = await getUserPdfSummaries(DbUser.data.id);

  if (!result.success || !result.data) {
    console.error("Error fetching user summaries:", result.error);
    // toast.error(result.error);
    return;
  }

  const summaries = result.data;

  return (
    <main className="min-h-screen">
      <BgGradient className="from-emerald-200 via-teal-200 to-cyan-200"></BgGradient>
      <MotionDiv
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto flex flex-col gap-4"
      >
        <div className="px-2 py-12 sm:py-24">
          <div className="flex gap-4 mb-8 justify-between">
            <div className="flex flex-col gap-2">
              <MotionH1
                variants={itemVariants}
                className="text-4xl font-bold tracking-tight bg-linear-to-r from-gray-600 to-gray-900 bg-clip-text text-transparent"
              >
                Your Summaries
              </MotionH1>
              <MotionP variants={itemVariants} className="text-gray-600">
                Transform your PDFs into concise, actionable insights
              </MotionP>
            </div>
            {!uploadLimitReached && (
              <MotionDiv
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="self-start"
              >
                <Button
                  variant={"link"}
                  className="bg-linear-to-r from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 hover:scale-105 transition-all duration-300 hover:no-underline"
                >
                  <Link href="/upload" className="flex items-center text-white">
                    <Plus className="w-5 h-5 mr-2"></Plus>New Summary
                  </Link>
                </Button>
              </MotionDiv>
            )}
          </div>
          {uploadLimitReached && (
            <MotionDiv variants={itemVariants} className="mb-6">
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 text-rose-800">
                <p className="text-sm">
                  You've reached the limit of {uploadLimit} uploads on the basic
                  plan.{" "}
                  <Link
                    href="/#pricing"
                    className="text-rose-800 underline font-medium underline-offset-4 inline-flex items-center"
                  >
                    Click here to upgrade to Pro{" "}
                    <ArrowRight className="w-4 h-4 inline-block"></ArrowRight>
                  </Link>{" "}
                  for unlimited uploads.
                </p>
              </div>
            </MotionDiv>
          )}
          {summaries.length === 0 ? (
            <EmptySummaryState></EmptySummaryState>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 sm:px-0">
              {summaries.map((summary, index) => {
                return (
                  <SummaryCard key={index} summary={summary}></SummaryCard>
                );
              })}
            </div>
          )}
        </div>
      </MotionDiv>
    </main>
  );
}
