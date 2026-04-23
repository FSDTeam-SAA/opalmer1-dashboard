import { api } from "@/lib/api";
import type {
  ParentRecord,
  ParentResponse,
  ParentsResponse,
  UpdateParentPayload,
  CreateParentPayload,
} from "../types/parents.types";

const FALLBACK_IMAGE = "/images/4f8da1b70693c4fcf9e01b9293706aed5cd4e34d.jpg";

export type ParentRow = {
  no: number;
  _id: string;
  name: string;
  parentId: string;
  email: string;
  phoneNumber: string;
  active: boolean;
  image: string;
};

function toRow(record: ParentRecord, idx: number): ParentRow {
  return {
    no: idx + 1,
    _id: record._id,
    name: record.username,
    parentId: record.Id,
    email: record.email ?? "—",
    phoneNumber: record.phoneNumber ?? "—",
    active: (record.state ?? "active").toLowerCase() === "active",
    image: record.avatar?.url || FALLBACK_IMAGE,
  };
}

export async function fetchParents(): Promise<ParentRow[]> {
  const { data } = await api.get<ParentsResponse>("/users/parents");
  return data.data.map(toRow);
}

export async function createParent(
  payload: CreateParentPayload,
): Promise<ParentRecord> {
  const form = new FormData();
  form.append("username", payload.username);
  form.append("Id", payload.Id);
  form.append("type", payload.type);
  form.append("schoolId", payload.schoolId);
  if (payload.phoneNumber) form.append("phoneNumber", payload.phoneNumber);
  if (payload.password) form.append("password", payload.password);
  if (payload.image) form.append("image", payload.image);

  const { data } = await api.post<ParentResponse>("/users/register", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}

export async function updateParent(
  id: string,
  payload: UpdateParentPayload,
): Promise<ParentRecord> {
  const { data } = await api.put<ParentResponse>(`/users/${id}`, payload);
  return data.data;
}

export async function setParentState(
  id: string,
  state: "active" | "inactive",
): Promise<ParentRecord> {
  return updateParent(id, { state });
}
