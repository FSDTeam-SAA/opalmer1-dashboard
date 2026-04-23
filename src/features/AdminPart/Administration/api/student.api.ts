import { api } from "@/lib/api";
import {
  StudentDetailsResponse,
  StudentDetailsData,
} from "../types/student.types";

/**
 * Raw student record returned by GET /users/my-students.
 * Backend: user.controller.ts → getMySchoolAllStudents (authorizeRoles("administrator")).
 */
export type MyStudentRecord = {
  _id: string;
  username: string;
  Id: string;
  phoneNumber?: string;
  gradeLevel?: string | number;
  age?: number;
  avatar?: { url?: string; public_id?: string };
};

type MyStudentsResponse = {
  success: boolean;
  message: string;
  data: MyStudentRecord[];
};

/**
 * Shape consumed by the StudentsTable UI.
 */
export type StudentListItem = {
  id: number;
  _id: string;
  name: string;
  studentId: string;
  grade: string;
  age: string;
  attendance: string;
  image: string;
};

const FALLBACK_IMAGE = "/images/4f8da1b70693c4fcf9e01b9293706aed5cd4e34d.jpg";

/**
 * GET /users/my-students
 * Returns the students of the authenticated administrator's school.
 */
export async function fetchStudents(): Promise<StudentListItem[]> {
  const { data } = await api.get<MyStudentsResponse>("/users/my-students");
  return data.data.map((s, idx) => ({
    id: idx + 1,
    _id: s._id,
    name: s.username,
    studentId: s.Id,
    grade: String(s.gradeLevel ?? "—"),
    age: s.age !== undefined ? `${s.age} Years` : "—",
    // Attendance aggregate isn't in the endpoint; omit or compute later
    // via GET /attendances/student?studentId=...
    attendance: "—",
    image: s.avatar?.url || FALLBACK_IMAGE,
  }));
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
