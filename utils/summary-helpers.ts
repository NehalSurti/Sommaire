

export const parseSection = (section: string): { title: string; points: string[] } => {
    const [title, ...content] = section.split("\n");

    const cleanTitle = title.startsWith("#")
        ? title.substring(1).trim()
        : title.trim();

    const points: string[] = [];
    let currentPoint = "";

    content.forEach((line) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith("-") || trimmedLine.startsWith("*")) {
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


export const parseEmojiPoint = (content: string) => {
    // Remove leading bullet (•) with whitespace
    const cleanContent = content.replace(/^[•]\s*/, '').trim();

    // Match an emoji or emoji sequence followed by text
    const match = cleanContent.match(
        /^([\p{Extended_Pictographic}\p{Emoji_Presentation}\p{Emoji}\uFE0F]+)\s*(.+)$/u
    );
    if (!match) return null;

    const [_, emoji, text] = match
    return {
        emoji: emoji.trim(),
        text: text.trim(),
    }
}

export function parsePoint(point: string) {
    const trimmed = point.trim();

    const isEmpty = trimmed === "";

    const isNumbered = /^\d+\./.test(trimmed);
    const isMainPoint = /^•/.test(trimmed);
    const hasEmoji = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u.test(
        trimmed
    );

    return { isNumbered, isMainPoint, hasEmoji, isEmpty };
}

