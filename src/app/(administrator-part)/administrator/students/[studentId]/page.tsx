import StudentProfileView from "@/features/AdministratorPart/components/StudentProfileView";

export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  return <StudentProfileView studentId={studentId} />;
}
