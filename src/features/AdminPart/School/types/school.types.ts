export type SchoolAdministrator = {
  _id: string;
  username: string;
  role: string;
  Id: string;
};

export type School = {
  _id: string;
  name: string;
  administrator: SchoolAdministrator;
  code?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  establishedYear?: number;
  logo?: string;
  created_at: string;
  updated_at: string;
};

export type SchoolsMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type SchoolsResponse = {
  success: boolean;
  message: string;
  data: School[];
  meta: SchoolsMeta;
};

export type SchoolResponse = {
  success: boolean;
  message: string;
  data: School;
};

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
  logo?: File | string;
};
