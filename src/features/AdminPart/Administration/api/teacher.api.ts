import { api } from "@/lib/api";
import type {
  TeacherListItem,
  TeacherProfile,
  TeacherGradesData,
  AttendedStudent,
  QuizAttempt,
} from "@/types/teacher.types";

type Envelope<T> = { success: boolean; data: T };
type TeacherRecord = {
  _id: string;
  username: string;
  Id: string;
  gradeLevel?: number | string;
  subjects?: string[];
  avatar?: { url?: string };
  state?: string;
};
export async function fetchTeachers(): Promise<TeacherListItem[]> {
  const { data } =
    await api.get<Envelope<TeacherRecord[]>>("/users/my-teachers");
  return data.data.map((t) => ({
    id: t._id,
    name: t.username,
    teacherId: t.Id,
    gradeLevel: String(t.gradeLevel ?? ""),
    subjects: t.subjects?.join(", ") ?? "",
    state: t.state ?? "",
    image: t.avatar?.url || "",
  }));
}
export async function fetchTeacherProfile(
  teacherId: string,
): Promise<TeacherProfile> {
  const profile = (
    await api.get<Envelope<TeacherProfile>>(
      `/oversight/teachers/${encodeURIComponent(teacherId)}`,
    )
  ).data.data;
  return {
    ...profile,
    image: profile.image || "",
    grades: profile.grades.map((g) => ({
      ...g,
      date: g.date ? new Date(g.date).toLocaleDateString() : "",
      attendance: g.attendance || "No records",
      performance: g.performance || "No released grades",
    })),
    quizzes: profile.quizzes.map((q) => ({ ...q, image: q.image || "" })),
  };
}
export async function fetchTeacherGrades(
  teacherId: string,
): Promise<TeacherGradesData> {
  const profile = await fetchTeacherProfile(teacherId);
  return {
    grades: profile.grades,
    subjects: profile.grades.map((g) => ({
      id: g.id,
      name: g.name,
      attendance: g.attendance,
      progress: g.performance,
      progressPercent: Number.parseFloat(g.performance) || 0,
      color: "#871dad",
    })),
  };
}
export async function fetchAttendedStudents(
  quizId: string,
): Promise<AttendedStudent[]> {
  return (
    await api.get<Envelope<AttendedStudent[]>>(
      `/oversight/quizzes/${encodeURIComponent(quizId)}/students`,
    )
  ).data.data;
}
export async function fetchQuizAttempt(
  quizId: string,
  studentId: string,
): Promise<QuizAttempt> {
  return (
    await api.get<Envelope<QuizAttempt>>(
      `/oversight/quizzes/${encodeURIComponent(quizId)}/students/${encodeURIComponent(studentId)}`,
    )
  ).data.data;
}
