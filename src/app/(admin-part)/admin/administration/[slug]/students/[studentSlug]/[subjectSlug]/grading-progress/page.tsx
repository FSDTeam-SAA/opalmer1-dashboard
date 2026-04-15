import GradingProgressPage from "@/features/AdminPart/Administration/component/GradingProgressPage";

export default async function GradingProgressRoute({
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
      <GradingProgressPage
        slug={slug}
        studentSlug={studentSlug}
        subjectSlug={subjectSlug}
      />
    </div>
  );
}
