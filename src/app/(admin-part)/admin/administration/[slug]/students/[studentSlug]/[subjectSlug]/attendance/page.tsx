import AttendancePage from "@/features/AdminPart/Administration/component/AttendancePage";

export default async function AttendanceRoute({
  params,
}: {
  params: Promise<{
    slug: string;
    studentSlug: string;
    subjectSlug: string;
  }>;
}) {
  const { slug, studentSlug, subjectSlug } = await params;

  return (
    <div>
      <AttendancePage
        slug={slug}
        studentSlug={studentSlug}
        subjectSlug={subjectSlug}
      />
    </div>
  );
}
