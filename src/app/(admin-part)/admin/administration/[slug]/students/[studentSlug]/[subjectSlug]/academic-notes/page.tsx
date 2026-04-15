import AcademicNotesPage from "@/features/AdminPart/Administration/component/AcademicNotesPage";

export default async function AcademicNotesRoute({
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
      <AcademicNotesPage
        slug={slug}
        studentSlug={studentSlug}
        subjectSlug={subjectSlug}
      />
    </div>
  );
}
