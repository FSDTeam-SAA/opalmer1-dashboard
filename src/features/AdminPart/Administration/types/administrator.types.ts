/**
 * Administrator types.
 *
 * Backend sources:
 *   - GET  /users/administrators  → user.controller.ts:getAllAdministrators
 *   - POST /users/register        → user.controller.ts:registerUser
 *                                   (used with role="administrator" to create admin)
 *   - PUT  /users/:id             → user.controller.ts:updateUser
 */

export type AdministratorAvatar = {
  public_id: string;
  url: string;
};

export type Administrator = {
  _id: string;
  username: string;
  phoneNumber: string;
  email?: string;
  type?: string;
  state?: "active" | "inactive" | string;
  avatar?: AdministratorAvatar;
  created_at?: string;
  Id?: string;
};

export type AdministratorsResponse = {
  success: boolean;
  message: string;
  data: Administrator[];
};

export type AdministratorResponse = {
  success: boolean;
  message: string;
  data: Administrator;
};

/**
 * Payload for creating a new administrator via POST /users/register.
 * The backend expects multipart/form-data when an avatar file is included.
 */
export type CreateAdministratorPayload = {
  username: string;
  Id: string;
  password: string;
  phoneNumber?: string;
  email?: string;
  role: "administrator";
  type?: string;
  gender?: "male" | "female" | "other";
  image?: File | null;
};

/**
 * Payload for updating an administrator via PUT /users/:id.
 * Restricted fields (password, role, refreshToken) are stripped by the backend.
 */
export type UpdateAdministratorPayload = Partial<{
  username: string;
  phoneNumber: string;
  email: string;
  state: "active" | "inactive";
  gender: "male" | "female" | "other";
}>;

export type AdminSchoolDetails = {
  _id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  logo: string;
};

export type AdminStudentDetails = {
  _id: string;
  username: string;
  phoneNumber: string;
  Id: string;
  gradeLevel: number;
  avatar?: {
    public_id: string;
    url: string;
  };
};

export type AdminTeacherDetails = {
  _id: string;
  username: string;
  phoneNumber: string;
  Id: string;
  avatar?: {
    public_id: string;
    url: string;
  };
};

export type AdministratorDetailsData = {
  admin: Administrator;
  school: AdminSchoolDetails | null;
  students: AdminStudentDetails[];
  teachers: AdminTeacherDetails[];
};

export type AdministratorDetailsResponse = {
  success: boolean;
  message: string;
  data: AdministratorDetailsData;
};
