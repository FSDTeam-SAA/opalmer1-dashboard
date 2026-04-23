/**
 * Student types for the administrator's "my-school" scope.
 *
 * Backend source:
 *   - GET /users/my-students → user.controller.ts:getMySchoolAllStudents
 */

export type StudentAvatar = {
  public_id?: string;
  url?: string;
};

export type StudentRecord = {
  _id: string;
  username: string;
  Id: string;
  phoneNumber?: string;
  gradeLevel?: string | number;
  age?: number;
  avatar?: StudentAvatar;
  state?: string;
  email?: string;
  gender?: string;
};

export type StudentsResponse = {
  success: boolean;
  message: string;
  data: StudentRecord[];
};

/** Shape consumed by the StudentsTable UI. */
export type StudentRow = {
  no: number;
  _id: string;
  name: string;
  studentId: string;
  grade: string;
  className: string;
  email: string;
  phoneNumber: string;
  active: boolean;
  image: string;
};

export type StudentResponse = {
  success: boolean;
  message: string;
  data: StudentRecord;
};

/**
 * Payload for POST /users/register (type=student).
 * Multipart/form-data when an avatar is included.
 *
 * Backend (user.controller.ts → registerUser):
 *   - `schoolId` is required when type === "student"
 *   - `role` enum is ["user","admin","administrator"] — never "student"
 */
export type CreateStudentPayload = {
  username: string;
  Id: string;
  password: string;
  schoolId: string;
  type: "student";
  phoneNumber?: string;
  email?: string;
  gender?: "male" | "female" | "other";
  age?: number;
  gradeLevel?: number;
  image?: File | null;
};

/** Payload for PUT /users/:id. Restricted fields are stripped server-side. */
export type UpdateStudentPayload = Partial<{
  username: string;
  phoneNumber: string;
  email: string;
  state: "active" | "inactive";
  gender: "male" | "female" | "other";
  age: number;
  gradeLevel: number;
}>;

export type StudentDetailsSubject = {
  classId: string;
  subject: string;
  attendance: number;
  progress: number;
  teacherName?: string; // Sometimes APIs return this or we fall back
};

export type StudentDetailsOverall = {
  attendance: number;
  progress: number;
};

export type StudentDetailsData = {
  student: StudentRecord;
  parent: { name?: string; image?: string; _id?: string } | null;
  overall: StudentDetailsOverall;
  subjects: StudentDetailsSubject[];
};

export type StudentDetailsResponse = {
  success: boolean;
  message: string;
  data: StudentDetailsData;
};
