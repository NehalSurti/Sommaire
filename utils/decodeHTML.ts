import he from "he";

/**
 * Safely decodes HTML entities (like &amp;, &lt;, &gt;).
 * @param str The string to decode.
 * @returns The decoded string.
 */
export function decodeHTML(str: string = ""): string {
    return he.decode(str);
}
