import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "@/app/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RayCode",
  description: "Real Time Collaborative Code Editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {/* liveblocks provider */}
          <Provider>{children}</Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}