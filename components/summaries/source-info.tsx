import { ExternalLink, FileText } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import DownloadSummaryButton from "./download-summary-button";

export default function SourceInfo({
  title,
  fileName,
  originalFileUrl,
  createdAt,
  summaryText,
}: {
  fileName: string;
  originalFileUrl: string;
  createdAt: Date;
  summaryText: string;
  title: string;
}) {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
      <div className="flex items-center justify-center gap-2">
        <FileText className="h-4 w-4 text-rose-400"></FileText>
        <span>Source: {fileName}</span>
      </div>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
          asChild
        >
          <a href={originalFileUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-1"></ExternalLink>
            View Original
          </a>
        </Button>
        <DownloadSummaryButton
          title={title}
          fileName={fileName}
          createdAt={createdAt}
          summaryText={summaryText}
        ></DownloadSummaryButton>
      </div>
    </div>
  );
}
