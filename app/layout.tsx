import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "FairPrint — Your AI Document Advocate",
  description:
    "Upload your medical bill, insurance denial, or lease agreement. FairPrint audits it for red flags and generates a ready-to-send dispute letter in seconds.",
  keywords: ["medical bill dispute", "insurance denial appeal", "lease review", "AI document advocate"],
  openGraph: {
    title: "FairPrint — Your AI Document Advocate",
    description: "Turn confusing documents into actionable dispute letters with AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
