import Sidebar from "@/components/sheard/Sidebar";
import Navbar from "@/components/sheard/Navbar";
import { NavbarProvider } from "@/components/sheard/NavbarContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NavbarProvider>
      <div className="min-h-screen bg-white rounded-tl-[20px] rounded-bl-[20px] relative">
        {/* Full-width purple header band (behind everything including sidebar) */}
        <div className="absolute left-0 top-0 h-[200px] w-full bg-[#871dad]  " />

        {/* Sidebar - floats on top of the purple band */}
        <Sidebar />

        {/* Main content area */}
        <div className="relative ml-[282px]">
          {/* Header content (title + notification) on top of the purple band */}
          <Navbar />

          {/* Page content - overlaps the purple header */}
          <div className="relative -mt-[120px] px-6 pb-8">{children}</div>
        </div>
      </div>
    </NavbarProvider>
  );
}
