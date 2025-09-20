
export function formatFileName(url: string): string {

    const path = url.split(/[?#]/)[0];
    const fileName = path.split("/").pop() || "";
    const baseName = fileName.replace(/\.[^/.]+$/, ""); // remove extension

    return baseName
        .replace(/[-_]+/g, " ") // replace multiple -/_ with space
        .trim()
        .split(/\s+/) // split on one or more spaces
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}
