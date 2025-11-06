import type { Metadata } from "next";
import { Source_Sans_3 as FontSans } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { ORIGIN_URL } from "@/utils/env-helper";

const fontSans = FontSans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

// export const metadata: Metadata = {
//   title: "Sommaire - AI-Powered PDF Summarization",
//   description:
//     "Save hours of reading time. Transform lengthy PDFs into clear, accurate summaries in seconds with our advanced AI technology.",
//   openGraph: {
//     title: "Sommaire - AI-Powered PDF Summarization",
//     description:
//       "Save hours of reading time. Transform lengthy PDFs into clear, accurate summaries in seconds with our advanced AI technology.",
//     siteName: "Sommaire",
//     images: [
//       {
//         url: "/opengraph-image.png",
//         alt: "Sommaire Open Graph Image",
//       },
//     ],
//     type: "website",
//   },
//   metadataBase: new URL(ORIGIN_URL),
//   alternates: {
//     canonical: ORIGIN_URL,
//   },
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${fontSans.variable} antialiased`}>
          <div className="relative flex  min-h-screen flex-col ">
            <Header></Header>
            <main className="flex-1">{children}</main>
            <Footer></Footer>
          </div>
          <Toaster richColors position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
