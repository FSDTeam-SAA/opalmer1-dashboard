"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

type ErrorFallbackProps = {
  title?: string;
  message?: string;
  error?: unknown;
  onRetry?: () => void;
  className?: string;
};

function describeError(error: unknown): string | undefined {
  if (!error) return undefined;
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null) {
    const maybe = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    return maybe.response?.data?.message ?? maybe.message;
  }
  return String(error);
}

export function ErrorFallback({
  title = "Something went wrong",
  message,
  error,
  onRetry,
  className = "",
}: ErrorFallbackProps) {
  const detail = message ?? describeError(error) ?? "Please try again.";
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center gap-3 rounded-[12px] border border-[#fde0e3] bg-[#fef2f3] px-6 py-10 text-center ${className}`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fce4e7] text-[#ef3c50]">
        <AlertTriangle size={20} />
      </div>
      <div>
        <p className="text-[15px] font-semibold text-[#b1162b]">{title}</p>
        <p className="mt-1 text-[13px] text-[#7a2333]">{detail}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 inline-flex items-center gap-2 rounded-[8px] bg-[#871dad] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#751a99]"
        >
          <RotateCcw size={14} />
          Retry
        </button>
      )}
    </div>
  );
}
