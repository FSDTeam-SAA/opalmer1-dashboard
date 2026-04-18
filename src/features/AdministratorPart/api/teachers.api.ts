import { api } from "@/lib/api";
import type {
  CreateTeacherPayload,
  TeacherRecord,
  TeacherResponse,
  TeacherRow,
  TeachersResponse,
  UpdateTeacherPayload,
} from "../types/teachers.types";

const FALLBACK_IMAGE = "/images/4f8da1b70693c4fcf9e01b9293706aed5cd4e34d.jpg";

function toRow(record: TeacherRecord, idx: number): TeacherRow {
  return {
    no: idx + 1,
    _id: record._id,
    name: record.username,
    teacherId: record.Id,
    subject:
      record.gradeLevel !== undefined && record.gradeLevel !== null
        ? `Grade ${record.gradeLevel}`
        : "—",
    classes: "—",
    email: record.email ?? "—",
    phoneNumber: record.phoneNumber ?? "—",
    active: (record.state ?? "active").toLowerCase() === "active",
    image: record.avatar?.url || FALLBACK_IMAGE,
  };
}

/**
 * GET /users/my-teachers
 * Returns the teachers of the authenticated administrator's school.
 * Backend: user.controller.ts → getMySchoolAllTeachers (authorizeRoles("administrator"))
 */
export async function fetchMyTeachers(): Promise<TeacherRow[]> {
  const { data } = await api.get<TeachersResponse>("/users/my-teachers");
  return data.data.map(toRow);
}

/**
 * POST /users/register (type=teacher)
 * Creates a new teacher within the administrator's school.
 * Backend: user.controller.ts → registerUser
 *
 * The backend `role` enum is ["user","admin","administrator"]; teachers are
 * distinguished by `type: "teacher"`. Sending role="teacher" produces a
 * Mongoose enum validation error, so we omit it and let the schema default
 * to "user".
 */
export async function createTeacher(
  payload: CreateTeacherPayload,
): Promise<TeacherRecord> {
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

  const { data } = await api.post<TeacherResponse>("/users/register", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}

/**
 * PUT /users/:id
 * Updates a teacher's profile fields.
 * Backend: user.controller.ts → updateUser
 *  - Strips restricted fields (password, role, refreshToken, verificationInfo).
 */
export async function updateTeacher(
  id: string,
  payload: UpdateTeacherPayload,
): Promise<TeacherRecord> {
  const { data } = await api.put<TeacherResponse>(`/users/${id}`, payload);
  return data.data;
}

/** Convenience wrapper for toggling the active state. */
export async function setTeacherState(
  id: string,
  state: "active" | "inactive",
): Promise<TeacherRecord> {
  return updateTeacher(id, { state });
}
