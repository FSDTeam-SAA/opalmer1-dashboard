import HomeworkPage from "@/features/AdminPart/Administration/component/HomeworkPage";

export default async function HomeworkRoute({
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
      <HomeworkPage
        slug={slug}
        studentSlug={studentSlug}
        subjectSlug={subjectSlug}
      />
    </div>
  );
}
