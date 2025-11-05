"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import NavigationControls from "./navigation-controls";
import ProgressBar from "./progress-bar";
import { parseSection } from "@/utils/summary-helpers";
import ContentSection from "./content-section";
import { MotionDiv } from "@/components/common/motion-wrapper";
import { decodeHTML } from "@/utils/decodeHTML";

const SectionTitle = ({ title }: { title: string }) => {
  return (
    <div className="flex flex-col gap-2 mb-6 sticky top-0 pt-2 pb-4 bg-background/80 backdrop-blur-xs z-50">
      <h2 className="text-3xl lg:text-4xl font-bold text-center flex items-center justify-center gap-2">
        {title}
      </h2>
    </div>
  );
};

export default function SummaryViewer({
  summaryText,
}: {
  summaryText: string;
}) {
  const [currentSection, setCurrentSection] = useState(0);

  const handleNext = () =>
    setCurrentSection((prev) => Math.min(prev + 1, sections.length - 1));

  const handlePrevious = () =>
    setCurrentSection((prev) => Math.max(prev - 1, 0));

  const sections = summaryText
    .split("\n# ")
    .map((section) => section.trim())
    .filter(Boolean)
    .map(parseSection);

  return (
    <Card className="relative px-2 h-[500px] sm:h-[600px] lg:h-[700px] w-full xl:w-[600px] overflow-hidden bg-linear-to-br from-background via-background/95 to-rose-500/5 backdrop-blur-lg shadow-2xl rounded-3xl border border-rose-500/10">
      <ProgressBar
        sections={sections}
        currentSection={currentSection}
      ></ProgressBar>
      <MotionDiv
        key={currentSection}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        exit={{ opacity: 0 }}
        className="h-full overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pt-12 sm:pt-16 pb-20 sm:pb-24"
      >
        <div className="fixed top-0 left-0 right-0 lg:bottom-[600px] sm:bottom-[425px] bg-background/80 backdrop-blur-xs z-40"></div>
        <div className="px-4 sm:px-6">
          <SectionTitle
            title={decodeHTML(sections[currentSection]?.title) || ""}
          ></SectionTitle>

          <ContentSection
            points={sections[currentSection]?.points || []}
          ></ContentSection>
        </div>
      </MotionDiv>

      <NavigationControls
        currentSection={currentSection}
        totalSections={sections.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSectionSelect={setCurrentSection}
      ></NavigationControls>
    </Card>
  );
}
