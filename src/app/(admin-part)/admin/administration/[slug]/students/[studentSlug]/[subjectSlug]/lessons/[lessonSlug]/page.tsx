import LessonDetail from "@/features/AdminPart/Administration/component/LessonDetail";

export default async function LessonDetailRoute({
  params,
}: {
  params: Promise<{
    slug: string;
    studentSlug: string;
    subjectSlug: string;
    lessonSlug: string;
  }>;
}) {
  const { slug, studentSlug, subjectSlug, lessonSlug } = await params;

  return (
    <div>
      <LessonDetail
        slug={slug}
        studentSlug={studentSlug}
        subjectSlug={subjectSlug}
        lessonSlug={lessonSlug}
      />
    </div>
  );
}
