import React from "react";

function parsePoint(point: string) {
  const trimmed = point.trim();

  const isEmpty = trimmed === "";

  const isNumbered = /^\d+\./.test(trimmed);
  const isMainPoint = /^•/.test(trimmed);
  const hasEmoji = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u.test(
    trimmed
  );

  return { isNumbered, isMainPoint, hasEmoji, isEmpty };
}

export default function ContentSection({ points }: { points: string[] }) {
  return (
    <div className="space-y-4">
      {points.map((point, index) => {
        const { isNumbered, isMainPoint, hasEmoji, isEmpty } =
          parsePoint(point);

        const { emoji, text } = parseEmojiPoint(content);

        if (hasEmoji || isMainPoint) {
          return (
            <div
              key={`point-${index}`}
              className="group relative bg-linear-to-br from-gray-200/[0.08] to-gray-400/[0.03] p-4 rounded-2xl border border-gray-500/10 hover:shadow-lg transition-all"
            >
              <div className="absolute inset-0 bg-linear-to-r from-gray-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                <div className="relative flex items-start gap-3">
                  <span className="text-lg lg:text-xl shrink-0 pt-1">
                    {emoji}
                  </span>
                  <p className="text-lg lg:text-xl text-muted-foreground/90 leading-relaxed">
                    {text}
                  </p>
                </div>
              </div>
            </div>
          );
        }
        // return (

        // );
      })}
    </div>
  );
}
