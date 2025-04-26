import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import SupabaseAuthProvider from "@/components/providers/supabase-auth-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "SnipStash",
  description: "Your code snippet manager",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any"
      },
      {
        url: "/icons/snipstash-logo.svg",
        type: "image/svg+xml"
      }
    ],
    apple: {
      url: "/icons/apple-touch-icon.png",
      sizes: "180x180"
    }
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen font-sans antialiased",
          inter.variable
        )}
      >
        <SupabaseAuthProvider>
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
        </SupabaseAuthProvider>
      </body>
    </html>
  );
}
