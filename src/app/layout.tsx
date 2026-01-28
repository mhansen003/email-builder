import type { Metadata } from "next";
import { jakarta, jetbrains } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Email Builder — Voice to Professional Email",
  description:
    "Record your voice, let AI craft the perfect email. Customize tone, style, and length. Export to Outlook or clipboard.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${jetbrains.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
