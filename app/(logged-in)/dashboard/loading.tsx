import React from "react";
import {
  MotionDiv,
  MotionH1,
  MotionP,
} from "@/components/common/motion-wrapper";
import { containerVariants, itemVariants } from "@/utils/constants";
import { Skeleton } from "@/components/ui/skeleton";
import SummaryCardSkeleton from "@/components/summaries/summary-card-skeleton";
import BgGradient from "@/components/common/Bg-Gradient";

export default function Loading() {
  return (
    <main className="min-h-screen">
      <BgGradient className="from-emerald-200 via-teal-200 to-cyan-200" />

      <MotionDiv
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto flex flex-col gap-4"
      >
        <div className="px-2 py-12 sm:py-24">
          {/* Header section skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
            <div className="flex flex-col gap-3 w-full sm:w-auto">
              {/* Title Skeleton */}
              <MotionH1 variants={itemVariants} className="space-y-2">
                <Skeleton className="h-10 w-48 sm:w-64 rounded-md" />
              </MotionH1>

              {/* Subtitle Skeleton */}
              <MotionDiv variants={itemVariants}>
                <Skeleton className="h-5 w-72 sm:w-96 rounded-md" />
              </MotionDiv>
            </div>

            {/* Button Skeleton */}
            <MotionDiv
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="self-start sm:self-auto"
            >
              <Skeleton className="h-10 w-36 rounded-xl" />
            </MotionDiv>
          </div>

          {/* Optional banner skeleton (upload limit / info area) */}
          <MotionDiv variants={itemVariants} className="mb-6">
            <Skeleton className="h-16 w-full rounded-lg" />
          </MotionDiv>

          {/* Summaries grid skeleton */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 sm:px-0">
            {Array.from({ length: 6 }).map((_, i) => (
              <SummaryCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </MotionDiv>
    </main>
  );
}
