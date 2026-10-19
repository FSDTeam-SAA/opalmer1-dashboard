"use client";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "@/components/sheard/PageHeader";
import { api } from "@/lib/api";
import { useStudentDetails } from "../hooks/useStudents";
import { matchesSubject } from "../api/subjectScope";
type RecordData = {
  _id: string;
  quiz?: { title?: string };
  percentage?: number;
  gradeStatus?: string;
  status?: string;
  message?: string;
  state?: string;
  tags?: string[];
  points?: number;
  created_at?: string;
  createdAt?: string;
};
export default function BehaviorRecordPage({
  studentSlug,
  subjectSlug,
}: {
  slug?: string;
  studentSlug: string;
  subjectSlug: string;
}) {
  const student = useStudentDetails(studentSlug);
  const subject = student.data?.subjects.find((s) =>
    matchesSubject(s, subjectSlug),
  );
  const records = useQuery({
    queryKey: ["behavior", studentSlug, subject?.classId],
    enabled: !!subject,
    queryFn: async () =>
      (
        await api.get<{ data: RecordData[] }>(
          `/behavior/student/${encodeURIComponent(studentSlug)}`,
          { params: { classId: subject!.classId } },
        )
      ).data.data,
  });
  const loading = student.isLoading || records.isLoading;
  const failed = student.isError || records.isError;
  return (
    <div className="pt-10 mt-32 space-y-5">
      <PageHeader title="Behavior Records" />
      {loading && <p>Loading records...</p>}
      {failed && (
        <div role="alert">
          <p>Unable to load records.</p>
          <button
            onClick={() => {
              void student.refetch();
              void records.refetch();
            }}
            className="text-purple-700 underline"
          >
            Retry
          </button>
        </div>
      )}
      {!loading && !failed && (!subject || !records.data?.length) && (
        <p>No records for this student and class.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {records.data?.map((record) => (
          <article
            key={record._id}
            className="rounded-xl bg-white p-6 shadow-sm border-l-8 border-purple-600"
          >
            <h2 className="text-xl font-medium">{record.message}</h2>
            <p className="text-gray-500">
              {record.createdAt || record.created_at
                ? new Date(
                    record.createdAt ?? record.created_at!,
                  ).toLocaleDateString()
                : ""}
            </p>
            <p className="mt-3">
              {record.state} ? {record.points ?? 0} points
            </p>
            <p>{record.tags?.join(", ")}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
