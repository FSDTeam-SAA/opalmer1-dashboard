import TeacherProfile from "@/features/AdminPart/Administration/component/TeacherProfile";

export default async function TeacherDetailPage({
  params,
}: {
  params: Promise<{ slug: string; teacherId: string }>;
}) {
  const { slug, teacherId } = await params;

  return (
    <div>
      <TeacherProfile slug={slug} teacherId={teacherId} />
    </div>
  );
}
