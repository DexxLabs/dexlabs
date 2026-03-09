import type { Metadata } from "next";
import { Outfit } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "./provider";
import ClientLayout from "@/components/ClientLayout";
import SquishyCursor from "@/components/ui/SquishyCursor";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Dexlabs",
  description: "Web and Content Creation Serving Agency.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} antialiased`}
      >
        
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <ClientLayout>
              <SquishyCursor/>
              {children}
            </ClientLayout>
          </ThemeProvider>
      </body>
    </html>
  );
}
