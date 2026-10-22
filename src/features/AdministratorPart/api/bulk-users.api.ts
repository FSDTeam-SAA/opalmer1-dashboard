import { api } from "@/lib/api";

export type SchoolUserType = "student" | "teacher" | "parent";
export type BulkUserPayload = {
  username: string;
  Id: string;
  password: string;
  email?: string;
  phoneNumber?: string;
  gradeLevel?: number;
  age?: number;
  gender?: "male" | "female" | "other";
};

export async function createSchoolUser(
  type: SchoolUserType,
  payload: BulkUserPayload,
) {
  const { data } = await api.post(`/users/school/${type}s`, payload);
  return data.data;
}

export async function deleteSchoolUser(type: SchoolUserType, id: string) {
  await api.delete(`/users/school/${type}s/${id}`);
}
