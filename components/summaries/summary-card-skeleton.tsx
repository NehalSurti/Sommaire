"use client";

import React from "react";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { MotionDiv } from "../common/motion-wrapper";
import { itemVariants } from "@/utils/constants";

export default function SummaryCardSkeleton() {
  return (
    <MotionDiv variants={itemVariants}>
      <Card className="relative h-full animate-in fade-in-50">
        {/* Delete button placeholder */}
        <div className="absolute top-2 right-2">
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>

        <div className="block p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Header */}
            <div className="flex items-start gap-2 sm:gap-4">
              {/* Icon placeholder */}
              <Skeleton className="w-6 h-6 sm:w-8 sm:h-8 rounded-md" />
              <div className="flex-1 min-w-0 space-y-2">
                <Skeleton className="h-5 w-4/5 rounded-md" />
                <Skeleton className="h-4 w-1/3 rounded-md" />
              </div>
            </div>

            {/* Summary text lines */}
            <div className="space-y-2 pl-2 mt-1">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-5/6 rounded-md" />
            </div>

            {/* Footer / status badge */}
            <div className="flex justify-between items-center mt-2 sm:mt-4">
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        </div>
      </Card>
    </MotionDiv>
  );
}
