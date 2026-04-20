import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";

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
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#f97316",
          colorBackground: "#18181b",
          colorText: "#f4f4f5",
          colorTextSecondary: "#a1a1aa",
          colorInputBackground: "#27272a",
          colorInputText: "#f4f4f5",
          colorNeutral: "#71717a",
          borderRadius: "0.75rem",
          fontFamily: "Inter, sans-serif",
        },
        elements: {
          card: "bg-zinc-900 border border-zinc-800 shadow-2xl shadow-black/50",
          headerTitle: "text-white font-bold",
          headerSubtitle: "text-zinc-400",
          socialButtonsBlockButton: "bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700",
          formFieldLabel: "text-zinc-300",
          formFieldInput: "bg-zinc-800 border-zinc-700 text-white focus:border-orange-500",
          footerActionLink: "text-orange-400 hover:text-orange-300",
          identityPreviewText: "text-zinc-300",
          identityPreviewEditButton: "text-orange-400",
          formButtonPrimary: "bg-orange-500 hover:bg-orange-400 text-black font-bold",
          dividerLine: "bg-zinc-700",
          dividerText: "text-zinc-500",
          badge: "bg-orange-500/20 text-orange-400",
          alertText: "text-zinc-300",
          userButtonAvatarBox: "w-8 h-8",
          userButtonPopoverCard: "bg-zinc-900 border border-zinc-800",
          userButtonPopoverActionButton: "text-zinc-300 hover:bg-zinc-800",
          userButtonPopoverActionButtonText: "text-zinc-300",
          userButtonPopoverFooter: "hidden",
        },
      }}
    >
      <html lang="en">
        <body className="bg-slate-950 text-white antialiased">
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
