import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

/**
 * Fetches a PDF from a URL and extracts all text.
 * @param fileUrl - URL of the PDF
 * @returns The full text of the PDF
 */

export async function fetchAndExtractPdfText(fileUrl: string): Promise<string> {
    try {
        const response = await fetch(fileUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();

        const loader = new PDFLoader(new Blob([arrayBuffer]));

        const docs = await loader.load();

        return docs.map((doc) => doc.pageContent).join('\n');
    } catch (error) {
        console.error("Error fetching or parsing PDF:", error);
        return "";
    }
}