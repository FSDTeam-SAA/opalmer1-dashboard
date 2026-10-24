import { isAxiosError } from "axios";
import { api } from "@/lib/api";

export type Person = {
  _id: string;
  username: string;
  Id?: string;
  type?: string;
  role?: string;
};
export type WorkspaceClass = {
  _id: string;
  subject: string;
  grade: number;
  section?: string;
  teacherId?: Person & { schoolId?: { name?: string; schoolName?: string } };
};
export type Roster = {
  students: Person[];
};
export type Submission = {
  _id: string;
  studentId: Person | null;
  homeworkId: { _id: string; title: string; pointsPossible: number } | null;
  response?: string;
  files?: { url: string; filename?: string }[];
  score?: number;
  feedback?: string;
  submittedAt?: string;
  status: string;
};
export type Result = {
  autoScore?: number;
  _id: string;
  studentId: Person | null;
  quizId: { _id: string; title: string } | null;
  score: number;
  percentage: number;
  feedback?: string;
  submittedAt?: string;
  gradeStatus: string;
  progress: { totalQuestions: number };
  answers?: { question: string; selectedAnswer: string; isCorrect?: boolean }[];
};
export type Activity = {
  submissions: Submission[];
  reviews: Result[];
  autoGraded: Result[];
};
export type Notice = {
  _id: string;
  message: string;
  isViewed: boolean;
  type: string;
  createdAt: string;
};
export type Announcement = {
  _id: string;
  title: string;
  message: string;
  audiences: string[];
  recipientCount: number;
  deliveryStatus: string;
  createdAt: string;
};
export type TeacherReport = {
  _id: string;
  teacherId: Person | null;
  submittedBy: Person | null;
  schoolId?: { name?: string; schoolName?: string };
  subject: string;
  message: string;
  severity: string;
  occurredOn: string;
  createdAt: string;
};
type Envelope<T> = { data: T; notificationWarning?: string; message?: string };
export type Directory = {
  data: Person[];
  meta: { page: number; totalPages: number };
};
export type Receipt = { notificationWarning?: string };
const root = "/admin-workspace";
export const workspaceApi = {
  classes: async () =>
    (await api.get<Envelope<WorkspaceClass[]>>(`${root}/classes`)).data.data,
  directory: async (search: string, page = 1) =>
    (
      await api.get<Directory>(`${root}/directory`, {
        params: { search, page },
      })
    ).data,
  roster: async (classId: string) =>
    (
      await api.get<Envelope<Roster>>(
        `${root}/classes/${encodeURIComponent(classId)}/roster`,
      )
    ).data.data,
  activity: async () =>
    (await api.get<Envelope<Activity>>(`${root}/activity`)).data.data,
  save: async (action: string, payload: object | FormData) =>
    (await api.post<Receipt>(`${root}/${action}`, payload, { timeout: 180000 }))
      .data,
  submission: async (id: string) =>
    (
      await api.get<Envelope<Submission>>(
        `${root}/submissions/${encodeURIComponent(id)}`,
      )
    ).data.data,
  result: async (id: string) =>
    (
      await api.get<Envelope<{ result: Result; quiz: { title: string } }>>(
        `${root}/results/${encodeURIComponent(id)}`,
      )
    ).data.data,
  reviewSubmission: async (homeworkId: string, id: string, payload: object) =>
    api.patch(
      `${root}/assignments/${encodeURIComponent(homeworkId)}/submissions/${encodeURIComponent(id)}`,
      payload,
    ),
  reviewResult: async (id: string, payload: object) =>
    api.patch(`${root}/results/${encodeURIComponent(id)}/review`, payload),
  releaseResult: async (id: string) =>
    api.post(`${root}/results/${encodeURIComponent(id)}/release`),
  notices: async (userId: string) =>
    (
      await api.get<Envelope<Notice[]>>(
        `/notifications/${encodeURIComponent(userId)}`,
      )
    ).data.data,
  openNotice: async (id: string) => {
    const { data } = await api.get<
      Envelope<{
        kind: string;
        record: {
          title?: string;
          message?: string;
          description?: string;
          _id?: string;
        };
      }>
    >(`/notifications/${encodeURIComponent(id)}/destination`);
    await api.patch(`/notifications/${encodeURIComponent(id)}/read`);
    return data.data;
  },
  markNoticesRead: async (userId: string) =>
    api.patch(`/notifications/read/${encodeURIComponent(userId)}`),
  announcements: async () =>
    (await api.get<Envelope<Announcement[]>>(`${root}/announcements`)).data
      .data,
  retryAnnouncement: async (id: string) =>
    (
      await api.post<Receipt>(
        `${root}/announcements/${encodeURIComponent(id)}/retry`,
      )
    ).data,
  reports: async (page: number) =>
    (
      await api.get<{ data: TeacherReport[]; meta: { totalPages: number } }>(
        `${root}/teacher-behavior`,
        { params: { page } },
      )
    ).data,
};

export function errorMessage(error: unknown) {
  if (isAxiosError(error))
    return String(
      error.response?.data?.message || "Unable to save. Please try again.",
    );
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
}
export function localDay() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function classLabel(row: WorkspaceClass) {
  return `Grade ${row.grade} · ${row.subject}${row.section ? ` · ${row.section}` : ""} · ${row.teacherId?.username || "Teacher unavailable"}`;
}
export const fieldClass =
  "w-full min-w-0 rounded-xl border border-[#e4e2ea] bg-[#f7f7fa] px-4 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#871dad] focus:ring-2 focus:ring-purple-100 disabled:opacity-60";
export const primaryClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#871dad] px-5 py-3 text-sm font-semibold text-white hover:bg-[#751a99] disabled:cursor-not-allowed disabled:opacity-50";
