import TeacherGrades from "@/features/AdminPart/Administration/component/TeacherGrades";

export default async function TeacherGradesPage({
  params,
}: {
  params: Promise<{ slug: string; teacherId: string }>;
}) {
  const { slug, teacherId } = await params;

  return (
    <div>
      <TeacherGrades slug={slug} teacherId={teacherId} />
    </div>
  );
}
