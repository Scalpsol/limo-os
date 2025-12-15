import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Tailwind stilleri buradan gelir
import { cn } from "@/lib/utils"; // Shadcn utility

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Limo OS",
  description: "Modern İşletim Sistemi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className
        )}>
        {children}
      </body>
    </html>
  );
}