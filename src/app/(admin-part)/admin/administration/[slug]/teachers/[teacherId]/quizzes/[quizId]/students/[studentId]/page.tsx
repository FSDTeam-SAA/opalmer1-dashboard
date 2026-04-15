import QuizAttemptPage from "@/features/AdminPart/Administration/component/QuizAttemptPage";

export default async function StudentQuizResultPage({
  params,
}: {
  params: Promise<{
    slug: string;
    teacherId: string;
    quizId: string;
    studentId: string;
  }>;
}) {
  const { slug, teacherId, quizId, studentId } = await params;

  return (
    <div>
      <QuizAttemptPage
        slug={slug}
        teacherId={teacherId}
        quizId={quizId}
        studentId={studentId}
      />
    </div>
  );
}
