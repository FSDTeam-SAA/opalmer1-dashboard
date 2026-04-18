/**
 * School types.
 *
 * Backend source:
 *   - GET /school/my-school → school.controller.ts:getMySchool
 */

export type SchoolAdministrator = {
  _id: string;
  username: string;
  Id: string;
  role?: string;
  type?: string;
};

export type School = {
  _id: string;
  name?: string;
  administrator?: SchoolAdministrator | string;
  created_at?: string;
};

export type SchoolResponse = {
  success: boolean;
  message: string;
  data: School;
};

/**
 * Payload for POST /school/create.
 * `name` is required and unique. `code` is optional but also unique server-side.
 */
export type CreateSchoolPayload = {
  name: string;
  code?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  email?: string;
  establishedYear?: number;
  logo?: string;
};
