import React from "react";
import BgGradient from "@/components/common/Bg-Gradient";
import { MotionDiv } from "@/components/common/motion-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import LoadingSkeleton from "@/components/upload/loading-skeleton";

export default function Loading() {
  return (
    <section className="min-h-screen">
      <BgGradient className="from-rose-300 via-rose-200 to-orange-100" />

      <div className="container mx-auto flex flex-col gap-4">
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-12 lg:py-24">
          {/* Header skeleton */}
          <MotionDiv
            className="flex flex-col space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-3">
              <Skeleton className="h-8 w-1/2 max-w-[300px] rounded-md" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-16 rounded-full" />
                <Skeleton className="h-4 w-20 rounded-full" />
              </div>
            </div>
          </MotionDiv>

          {/* Source Info Skeleton */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6"
          >
            <div className="p-4 sm:p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-rose-100/30 shadow-md max-w-4xl mx-auto space-y-3">
              <Skeleton className="h-5 w-1/3 rounded-md" />
              <Skeleton className="h-4 w-2/3 rounded-md" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
            </div>
          </MotionDiv>

          {/* Summary Viewer Skeleton */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative mt-8 flex justify-center"
          >
            {/* Word count placeholder */}
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm bg-white/80 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-xs">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-16 rounded-md" />
            </div>

            {/* Summary card skeleton */}
            <LoadingSkeleton />
          </MotionDiv>
        </div>
      </div>
    </section>
  );
}
