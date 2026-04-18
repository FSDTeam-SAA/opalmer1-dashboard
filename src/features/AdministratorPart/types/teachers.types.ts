/**
 * Teacher types for the administrator's "my-school" scope.
 *
 * Backend source:
 *   - GET /users/my-teachers → user.controller.ts:getMySchoolAllTeachers
 */

export type TeacherAvatar = {
  public_id?: string;
  url?: string;
};

export type TeacherRecord = {
  _id: string;
  username: string;
  Id: string;
  phoneNumber?: string;
  gradeLevel?: string | number;
  age?: number;
  avatar?: TeacherAvatar;
  state?: string;
  email?: string;
  gender?: string;
};

export type TeachersResponse = {
  success: boolean;
  message: string;
  data: TeacherRecord[];
};

/** Shape consumed by the TeachersTable UI. */
export type TeacherRow = {
  no: number;
  _id: string;
  name: string;
  teacherId: string;
  subject: string;
  classes: string;
  email: string;
  phoneNumber: string;
  active: boolean;
  image: string;
};

export type TeacherResponse = {
  success: boolean;
  message: string;
  data: TeacherRecord;
};

/**
 * Payload for POST /users/register (type=teacher).
 * Multipart/form-data when an avatar is included.
 *
 * Backend enums:
 *   - role: "user" | "admin" | "administrator"   (default "user")
 *   - type: "parent" | "student" | "teacher"
 * A teacher is identified by `type: "teacher"` — `role` stays "user".
 */
export type CreateTeacherPayload = {
  username: string;
  Id: string;
  password: string;
  schoolId: string;
  type: "teacher";
  phoneNumber?: string;
  email?: string;
  gender?: "male" | "female" | "other";
  age?: number;
  gradeLevel?: number;
  image?: File | null;
};

/** Payload for PUT /users/:id. Restricted fields are stripped server-side. */
export type UpdateTeacherPayload = Partial<{
  username: string;
  phoneNumber: string;
  email: string;
  state: "active" | "inactive";
  gender: "male" | "female" | "other";
  age: number;
  gradeLevel: number;
}>;
