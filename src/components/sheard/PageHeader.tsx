"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useNavbarTitle } from "./NavbarContext";

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
}

export default function PageHeader({
  title,
  showBack = true,
}: PageHeaderProps) {
  const router = useRouter();
  const { setTitle } = useNavbarTitle();

  useEffect(() => {
    setTitle(title);
  }, [title, setTitle]);

  return (
    <div className="mb-6 flex items-center gap-4">
      {showBack && (
        <button
          onClick={() => router.back()}
          className="flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-full bg-white text-[#333] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)] transition-colors hover:bg-gray-50"
        >
          <ArrowLeft size={20} />
        </button>
      )}
    </div>
  );
}
