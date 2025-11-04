"use client";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function LoadingSkeleton() {
  return (
    <Card className="relative px-2 h-[500px] sm:h-[600px] lg:h-[700px] w-full xl:w-[600px] overflow-hidden bg-linear-to-br from-background via-background/95 to-rose-500/5 backdrop-blur-lg shadow-2xl rounded-3xl border border-rose-500/10 animate-in fade-in-50">
      {/* Progress Bar Skeleton */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-muted/40 overflow-hidden rounded-t-3xl">
        <div className="h-full bg-rose-400 animate-pulse w-1/3 rounded-tl-3xl" />
      </div>

      {/* Scrollable content area */}
      <div className="h-full overflow-y-auto pt-12 sm:pt-16 pb-20 sm:pb-24 px-4 sm:px-6 space-y-8">
        {/* Section Title Skeleton */}
        <div className="flex flex-col items-center gap-2 mb-6 sticky top-0 pt-2 pb-4 bg-background/80 backdrop-blur-xs z-50">
          <Skeleton className="h-10 w-3/4 max-w-[400px] rounded-xl" />
        </div>

        {/* Content Section Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-full rounded-lg" />
          <Skeleton className="h-5 w-5/6 rounded-lg" />
          <Skeleton className="h-5 w-2/3 rounded-lg" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-5 w-full rounded-lg" />
          <Skeleton className="h-5 w-5/6 rounded-lg" />
          <Skeleton className="h-5 w-2/3 rounded-lg" />
          <Skeleton className="h-5 w-4/5 rounded-lg" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-5 w-full rounded-lg" />
          <Skeleton className="h-5 w-5/6 rounded-lg" />
          <Skeleton className="h-5 w-2/3 rounded-lg" />         
        </div>
      </div>

      {/* Navigation Controls Skeleton */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 px-4">
        <Skeleton className="h-10 w-24 rounded-xl" />
        <Skeleton className="h-10 w-24 rounded-xl" />
      </div>
    </Card>
  );
}
