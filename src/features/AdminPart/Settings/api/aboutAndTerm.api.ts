import { api } from "@/lib/api";
import type {
  AboutOrTermDoc,
  AboutOrTermResponse,
  CreateAboutOrTermPayload,
  UpdateAboutOrTermPayload,
} from "../types/settings.types";

/**
 * GET /aboutAndTerm/about
 * Returns all "about" docs. The UI only uses the first entry.
 */
export async function fetchAbout(): Promise<AboutOrTermDoc | null> {
  const { data } = await api.get<AboutOrTermResponse>("/aboutAndTerm/about");
  const records = Array.isArray(data.data) ? data.data : [data.data];
  return records[0] ?? null;
}

/**
 * GET /aboutAndTerm/terms
 * Returns all "terms" docs. The UI only uses the first entry.
 */
export async function fetchTerms(): Promise<AboutOrTermDoc | null> {
  const { data } = await api.get<AboutOrTermResponse>("/aboutAndTerm/terms");
  const records = Array.isArray(data.data) ? data.data : [data.data];
  return records[0] ?? null;
}

/**
 * POST /aboutAndTerm/create
 */
export async function createAboutOrTerm(
  payload: CreateAboutOrTermPayload,
): Promise<AboutOrTermDoc> {
  const { data } = await api.post<AboutOrTermResponse>(
    "/aboutAndTerm/create",
    payload,
  );
  return (
    Array.isArray(data.data) ? data.data[0] : data.data
  ) as AboutOrTermDoc;
}

/**
 * PUT /aboutAndTerm/update/:id
 */
export async function updateAboutOrTerm(
  id: string,
  payload: UpdateAboutOrTermPayload,
): Promise<AboutOrTermDoc> {
  const { data } = await api.put<AboutOrTermResponse>(
    `/aboutAndTerm/update/${id}`,
    payload,
  );
  return (
    Array.isArray(data.data) ? data.data[0] : data.data
  ) as AboutOrTermDoc;
}
