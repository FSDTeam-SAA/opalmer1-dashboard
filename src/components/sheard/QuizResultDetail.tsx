"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import type { QuizAttempt } from "@/types/teacher.types";

/* ───── Skeleton Loader ───── */
export function QuizResultSkeleton() {
  return (
    <div className="space-y-8 pt-10 mt-16">
      {/* Student card skeleton */}
      <div className="flex items-center gap-5 rounded-[20px] bg-white p-5 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
        <Skeleton className="h-[160px] w-[160px] rounded-[6px]" />
        <div className="flex-1">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="mt-3 h-5 w-[160px]" />
          <Skeleton className="mt-2 h-5 w-[140px]" />
        </div>
        <Skeleton className="h-[110px] w-[180px] rounded-[10px]" />
        <Skeleton className="h-[110px] w-[180px] rounded-[10px]" />
      </div>

      {/* Questions skeleton */}
      <div>
        <Skeleton className="h-8 w-[140px]" />
        <div className="mt-4 grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[60px] rounded-[10px]" />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───── Main Component ───── */
export default function QuizResultDetail({ data }: { data: QuizAttempt }) {
  const { student, totalQuestions, correctAnswers, progress, questions } = data;

  return (
    <div className="space-y-8 pt-10 mt-16">
      {/* Student Header Card */}
      <div className="flex items-center gap-5 rounded-[20px] bg-white p-5 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
        <div className="h-[160px] w-[160px] flex-shrink-0 overflow-hidden rounded-[6px]">
          <Image
            src={student.image}
            alt={student.name}
            width={160}
            height={160}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <h3 className="text-[32px] font-semibold text-black tracking-[0.3px]">
            {student.name}
          </h3>
          <p className="mt-2 text-[20px] text-[#666]">
            {student.grade} - Age {student.age}
          </p>
          <p className="mt-1 text-[20px] text-[#666]">{student.phone}</p>
        </div>

        {/* Stat Cards */}
        <div className="flex gap-4">
          <div className="flex h-[110px] w-[180px] flex-col items-center justify-center rounded-[10px] bg-[#4aa678]">
            <p className="text-[18px] text-white">Questions</p>
            <p className="mt-1 text-[28px] font-semibold text-white">
              {correctAnswers}/{totalQuestions}
            </p>
          </div>
          <div className="flex h-[110px] w-[180px] flex-col items-center justify-center rounded-[10px] bg-[#febd43]">
            <p className="text-[18px] text-white">Progress</p>
            <p className="mt-1 text-[28px] font-semibold text-white">
              {progress}%
            </p>
          </div>
        </div>
      </div>

      {/* Questions Section */}
      <div>
        <h2 className="text-[30px] font-semibold text-[#333]">Questions</h2>

        <Accordion type="single" collapsible className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            {questions.map((q) => (
              <AccordionItem
                key={q.id}
                value={`question-${q.id}`}
                className="rounded-[10px] border border-gray-200 bg-white px-5 shadow-sm"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex flex-1 items-center gap-3">
                    <span className="text-[16px] font-medium text-[#333]">
                      {q.id}. {q.question}
                    </span>
                  </div>
                  {q.isCorrect && (
                    <div className="mr-2 flex h-[24px] w-[24px] items-center justify-center rounded-full bg-[#4aa678]">
                      <Check size={14} className="text-white" />
                    </div>
                  )}
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <div className="space-y-2 pl-1">
                    {q.options.map((option, idx) => (
                      <p key={idx} className="text-[15px] text-[#666]">
                        {option}
                      </p>
                    ))}
                    <div className="mt-3 space-y-1">
                      <p className="text-[14px]">
                        <span className="font-medium text-[#e64540]">
                          Selected Answer:
                        </span>{" "}
                        <span className="text-[#e64540]">
                          {q.selectedAnswer}
                        </span>
                      </p>
                      <p className="text-[14px]">
                        <span className="font-medium text-[#4aa678]">
                          Correct Answer:
                        </span>{" "}
                        <span className="text-[#4aa678]">
                          {q.correctAnswer}
                        </span>
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </div>
        </Accordion>
      </div>
    </div>
  );
}
