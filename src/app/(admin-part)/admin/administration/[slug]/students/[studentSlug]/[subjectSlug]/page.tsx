import SubjectDetail from "@/features/AdminPart/Administration/component/SubjectDetail";

export default async function SubjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string; studentSlug: string; subjectSlug: string }>;
}) {
  const { slug, studentSlug, subjectSlug } = await params;

  return (
    <div>
      <SubjectDetail
        slug={slug}
        studentSlug={studentSlug}
        subjectSlug={subjectSlug}
      />
    </div>
  );
}
