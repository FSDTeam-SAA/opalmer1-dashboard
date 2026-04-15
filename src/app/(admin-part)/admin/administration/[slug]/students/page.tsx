import StudentsTable from "@/features/AdminPart/Administration/component/StudentsTable";

export default async function StudentsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div>
      <StudentsTable slug={slug} />
    </div>
  );
}
