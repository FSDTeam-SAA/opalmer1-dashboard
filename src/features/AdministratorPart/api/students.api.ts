import { api } from "@/lib/api";
import type {
  CreateStudentPayload,
  StudentRecord,
  StudentResponse,
  StudentRow,
  StudentsResponse,
  UpdateStudentPayload,
  StudentDetailsResponse,
  StudentDetailsData,
} from "../types/students.types";

const FALLBACK_IMAGE = "/images/4f8da1b70693c4fcf9e01b9293706aed5cd4e34d.jpg";

function toRow(record: StudentRecord, idx: number): StudentRow {
  const grade = record.gradeLevel ?? "—";
  return {
    no: idx + 1,
    _id: record._id,
    name: record.username,
    studentId: record.Id,
    grade: String(grade),
    className: typeof grade === "string" ? grade : `Grade ${grade}`,
    email: record.email ?? "—",
    phoneNumber: record.phoneNumber ?? "—",
    active: (record.state ?? "active").toLowerCase() === "active",
    image: record.avatar?.url || FALLBACK_IMAGE,
  };
}

/**
 * GET /users/my-students
 * Returns the students of the authenticated administrator's school.
 * Backend: user.controller.ts → getMySchoolAllStudents (authorizeRoles("administrator"))
 */
export async function fetchMyStudents(): Promise<StudentRow[]> {
  const { data } = await api.get<StudentsResponse>("/users/students");
  return data.data.map(toRow);
}

/**
 * POST /users/register (type=student)
 * Creates a new student within the administrator's school.
 * Backend: user.controller.ts → registerUser
 *
 * `role` is omitted on purpose — the schema enum is
 * ["user","admin","administrator"], not "student". Students are
 * distinguished by `type: "student"`.
 */
export async function createStudent(
  payload: CreateStudentPayload,
): Promise<StudentRecord> {
  const form = new FormData();
  form.append("username", payload.username);
  form.append("Id", payload.Id);
  form.append("password", payload.password);
  form.append("schoolId", payload.schoolId);
  form.append("type", payload.type);
  if (payload.phoneNumber) form.append("phoneNumber", payload.phoneNumber);
  if (payload.email) form.append("email", payload.email);
  if (payload.gender) form.append("gender", payload.gender);
  if (payload.age !== undefined) form.append("age", String(payload.age));
  if (payload.gradeLevel !== undefined)
    form.append("gradeLevel", String(payload.gradeLevel));
  if (payload.image) form.append("image", payload.image);

  const { data } = await api.post<StudentResponse>("/users/register", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}

/**
 * PUT /users/:id — update a student's profile fields.
 * Backend strips password/role/refreshToken/verificationInfo.
 */
export async function updateStudent(
  id: string,
  payload: UpdateStudentPayload,
): Promise<StudentRecord> {
  const { data } = await api.put<StudentResponse>(`/users/${id}`, payload);
  return data.data;
}

/** Convenience wrapper for toggling the active state on a student. */
export async function setStudentState(
  id: string,
  state: "active" | "inactive",
): Promise<StudentRecord> {
  return updateStudent(id, { state });
}

/**
 * GET /users/:id
 * Fetches detailed profile of a student.
 */
export async function fetchStudentDetails(
  id: string,
): Promise<StudentDetailsData> {
  const { data } = await api.get<StudentDetailsResponse>(`/users/${id}`);
  return data.data;
}
