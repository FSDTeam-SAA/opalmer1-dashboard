import AttendedStudentsGrid from "@/features/AdminPart/Administration/component/AttendedStudentsGrid";

export default async function QuizAttendedStudentsPage({
  params,
}: {
  params: Promise<{ slug: string; teacherId: string; quizId: string }>;
}) {
  const { slug, teacherId, quizId } = await params;

  return (
    <div>
      <AttendedStudentsGrid slug={slug} teacherId={teacherId} quizId={quizId} />
    </div>
  );
}
