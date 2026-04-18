/**
 * Administrator types.
 *
 * Backend sources:
 *   - GET  /users/administrators  → user.controller.ts:getAllAdministrators
 *   - POST /users/register        → user.controller.ts:registerUser  (role="administrator")
 *   - PUT  /users/:id             → user.controller.ts:updateUser
 */

export type AdministratorAvatar = {
  public_id?: string;
  url?: string;
};

export type Administrator = {
  _id: string;
  username: string;
  phoneNumber?: string;
  email?: string;
  type?: string;
  role?: string;
  state?: "active" | "inactive" | string;
  avatar?: AdministratorAvatar;
  created_at?: string;
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

/** Payload for POST /users/register (multipart/form-data when image present). */
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

/** Payload for PUT /users/:id. Restricted fields are stripped server-side. */
export type UpdateAdministratorPayload = Partial<{
  username: string;
  phoneNumber: string;
  email: string;
  state: "active" | "inactive";
  gender: "male" | "female" | "other";
}>;
