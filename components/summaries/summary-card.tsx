import React from "react";
import { Card } from "../ui/card";
import DeleteButton from "./delete-button";
import Link from "next/link";

const SummaryHeader = ({
  fileUrl,
  title,
  createdAt,
}: {
  fileUrl: string;
  title: string;
  createdAt: string;
}) => {
  return (
    <div className="flex items-start gap-2 sm:gap-4 ">
      <h3 className="text-base xl:text-lg font-semibold text-gray-900 truncate w-4/5">
        {title}
      </h3>
    </div>
  );
};

export default function SummaryCard({ summary }: { summary: any }) {
  return (
    <div>
      <Card className="realtive h-full">
        <div className="absolute top-2 right-2">
          <DeleteButton></DeleteButton>
        </div>
        <Link href={`summaries/${summary.id}`} className="block p-4 sm:p-6">
        <SummaryHeader title={summary.title} createdAt={summary.created_at} fileUrl={summary.}></SummaryHeader>
          <p className="text-gray-600 line-clamp-2 text-sm sm:text-base pl-2">
            {summary.summary_text}
          </p>
          <p className="text-sm text-gray-500">2024</p>
          <div>
            <span></span>
          </div>
        </Link>
      </Card>
    </div>
  );
}
