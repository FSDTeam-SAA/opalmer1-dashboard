import type { Metadata } from "next";
import DashboardShell from "@/components/sheard/DashboardShell";
import { NavbarProvider } from "@/components/sheard/NavbarContext";

export const metadata: Metadata = {
  icons: {
    icon: "/images/achieverplus-logo.png",
    shortcut: "/images/achieverplus-logo.png",
    apple: "/images/achieverplus-logo.png",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NavbarProvider>
      <DashboardShell>{children}</DashboardShell>
    </NavbarProvider>
  );
}
