import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "VeriStudent AI · Ontario Career College Lead Verification Platform",
  description:
    "Autonomous AI voice agent verifying 10,000–20,000 domestic student records for Ontario career colleges. Strict CRTC compliance, 7-stage call flow, and bi-directional Airtable sync.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--color-bg)] font-sans text-[var(--color-text-primary)] antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>

        {/* Central Traffic Tracking Pixel */}
        <img
          src="https://demo-traffic.vercel.app/api/px?p=ontario-student-voice"
          alt=""
          width={1}
          height={1}
          style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
        />
      </body>
    </html>
  );
}
