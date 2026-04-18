import TeacherProfileView from "@/features/AdministratorPart/components/TeacherProfileView";

export default async function TeacherProfilePage({
  params,
}: {
  params: Promise<{ teacherId: string }>;
}) {
  const { teacherId } = await params;
  return <TeacherProfileView teacherId={teacherId} />;
}
