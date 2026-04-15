import AdminProfile from "@/features/AdminPart/Administration/component/AdminProfile";

export default async function AdminProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div>
      <AdminProfile slug={slug} />
    </div>
  );
}
