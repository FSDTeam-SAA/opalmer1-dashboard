import TeachersTable from "@/features/AdminPart/Administration/component/TeachersTable";

export default async function TeachersPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div>
      <TeachersTable slug={slug} />
    </div>
  );
}
