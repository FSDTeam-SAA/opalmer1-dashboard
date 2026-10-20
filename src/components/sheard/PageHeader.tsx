"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useNavbarTitle } from "./NavbarContext";
import { getDashboardBackHref } from "@/lib/dashboard-navigation";

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
}

export default function PageHeader({
  title,
  showBack = true,
}: PageHeaderProps) {
  const pathname = usePathname();
  const backHref = getDashboardBackHref(pathname);
  const { setTitle } = useNavbarTitle();

  useEffect(() => {
    setTitle(title);
  }, [title, setTitle]);

  return (
    <div className="mb-6 flex w-full items-center gap-4">
      {showBack && backHref && (
        <Link
          href={backHref}
          aria-label="Back"
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-purple-100 bg-white px-4 text-sm font-medium text-[#871dad] shadow-sm transition-colors hover:bg-purple-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#871dad]"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          Back
        </Link>
      )}
    </div>
  );
}
