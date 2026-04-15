import StudentProfile from "@/features/AdminPart/Administration/component/StudentProfile";

export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ slug: string; studentSlug: string }>;
}) {
  const { slug, studentSlug } = await params;

  return (
    <div>
      <StudentProfile slug={slug} studentSlug={studentSlug} />
    </div>
  );
}
