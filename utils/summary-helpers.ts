

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
    const cleanContent = content.replace(/^[•]\s*/, '').trim();

    const matches = cleanContent.match(/^(\p{Emoji}+)(.+)$/u);
    if (!matches) return null;

    const [_, emoji, text] = matches
    return {
        emoji: emoji.trim(),
        text: text.trim(),
    }
}

export const EmojiPoint = () => {

}