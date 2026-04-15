import BehaviorRecordPage from "@/features/AdminPart/Administration/component/BehaviorRecordPage";

export default async function BehaviorRecordRoute({
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
      <BehaviorRecordPage
        slug={slug}
        studentSlug={studentSlug}
        subjectSlug={subjectSlug}
      />
    </div>
  );
}
