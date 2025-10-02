"use client";

import React, { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const parseSection = (section: string) => {
  const { title, ...content } = section.split("\n");

  const cleanTitle = title.startsWith("#")
    ? title.substring(1).trim()
    : title.trim();

  const points: String[] = [];
  let currentPoint = "";

  content.forEach((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith("")) {
      if (currentPoint) points.push(currentPoint.trim());
      currentPoint = trimmedLine;
    } else if (!trimmedLine) {
      if (currentPoint) points.push(currentPoint.trim());
      currentPoint = "";
    } else {
      currentPoint += " " + trimmedLine;
    }
  });

  if (currentPoint) points.push(currentPoint.trim());

  return {
    title: cleanTitle,
    points: points.filter(
      (point) => point && !point.startsWith("#") && !point.startsWith("[Choose")
    ),
  };
};

export default function SummaryViewer({
  summaryText,
}: {
  summaryText: string;
}) {
  const [currentSection, setCurrentSection] = useState(0);
  const sections = summaryText
    .split("\n# ")
    .map((section) => section.trim())
    .filter(Boolean)
    .map(parseSection);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{sections[currentSection].title}</CardTitle>
        <CardDescription>Card Description</CardDescription>
        <CardAction>Card Action</CardAction>
      </CardHeader>
      <CardContent>
        <p>{JSON.stringify(sections[currentSection].points)}</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
}
