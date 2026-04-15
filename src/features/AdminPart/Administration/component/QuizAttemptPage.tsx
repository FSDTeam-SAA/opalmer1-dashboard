"use client";

import { useQuery } from "@tanstack/react-query";
import QuizResultDetail, {
  QuizResultSkeleton,
} from "@/components/sheard/QuizResultDetail";
import { fetchQuizAttempt } from "../api/teacher.api";

export default function QuizAttemptPage({
  slug,
  teacherId,
  quizId,
  studentId,
}: {
  slug: string;
  teacherId: string;
  quizId: string;
  studentId: string;
}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["quiz-attempt", slug, teacherId, quizId, studentId],
    queryFn: () => fetchQuizAttempt(quizId, studentId),
  });

  if (isLoading) return <QuizResultSkeleton />;

  if (isError || !data) {
    return (
      <div className="mt-32 flex flex-col items-center justify-center pt-10 text-center">
        <p className="text-[18px] font-medium text-[#e64540]">
          Failed to load quiz results
        </p>
        <p className="mt-2 text-[14px] text-[#666]">Please try again later.</p>
      </div>
    );
  }

  return <QuizResultDetail data={data} />;
}
