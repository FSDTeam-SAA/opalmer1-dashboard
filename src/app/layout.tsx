import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import MainProviders from "@/Providers/MainProviders";
import Provider from "@/Providers/Provider";
import { Toaster } from "sonner";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AchieverPlus Dashboard",
  description:
    "A modern dashboard for managing educational content, users, and analytics. Built with Next.js, Tailwind CSS, and React.",
  icons: {
    icon: "/images/achieverplus-logo.png",
    apple: "/images/achieverplus-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <MainProviders>
          <Provider> {children} </Provider>
        </MainProviders>
        <Toaster position="top-right" closeButton />
      </body>
    </html>
  );
}
