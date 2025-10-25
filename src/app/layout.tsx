import "@/styles/globals.css";

import { type Metadata } from "next";
import { Inter, Poppins, Roboto_Mono, Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: "TutorLink - Connect with Verified Tutors",
  description: "Link up with verified tutors and get AI-powered study notes",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

// Base body font
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// For navbar and headings mix
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-poppins" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
// For hero headline
const robotoMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-roboto-mono" });

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${poppins.variable} ${geist.variable} ${robotoMono.variable}`}>
        <body className="font-sans antialiased">
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
