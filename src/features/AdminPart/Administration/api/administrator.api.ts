import { api } from "@/lib/api";
import type {
  Administrator,
  AdministratorsResponse,
} from "../types/administrator.types";

export async function fetchAdministrators(): Promise<Administrator[]> {
  const { data } = await api.get<AdministratorsResponse>(
    "/users/administrators",
  );
  return data.data;
}
