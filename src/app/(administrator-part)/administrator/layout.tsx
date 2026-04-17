import { NavbarProvider } from "@/components/sheard/NavbarContext";
import { AdminShell } from "@/features/AdministratorPart/components/AdminShell";

export default function AdministratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NavbarProvider>
      <AdminShell>{children}</AdminShell>
    </NavbarProvider>
  );
}
