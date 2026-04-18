import { api } from "@/lib/api";
import type {
  CreateFeatureQuestionPayload,
  FeatureQuestionDoc,
  FeatureQuestionResponse,
  UpdateFeatureQuestionPayload,
} from "../types/settings.types";

/**
 * GET /featuresAndQuestions/AppFeatures
 * Returns all App Feature records.
 */
export async function fetchAppFeatures(): Promise<FeatureQuestionDoc[]> {
  const { data } = await api.get<FeatureQuestionResponse>(
    "/featuresAndQuestions/AppFeatures",
  );
  return Array.isArray(data.data) ? data.data : [data.data];
}

/**
 * GET /featuresAndQuestions/FAQquestions
 * Returns all FAQ records.
 */
export async function fetchFAQs(): Promise<FeatureQuestionDoc[]> {
  const { data } = await api.get<FeatureQuestionResponse>(
    "/featuresAndQuestions/FAQquestions",
  );
  return Array.isArray(data.data) ? data.data : [data.data];
}

/**
 * POST /featuresAndQuestions/create
 */
export async function createFeatureOrFAQ(
  payload: CreateFeatureQuestionPayload,
): Promise<FeatureQuestionDoc> {
  const { data } = await api.post<FeatureQuestionResponse>(
    "/featuresAndQuestions/create",
    payload,
  );
  return (
    Array.isArray(data.data) ? data.data[0] : data.data
  ) as FeatureQuestionDoc;
}

/**
 * PUT /featuresAndQuestions/update/:id
 */
export async function updateFeatureOrFAQ(
  id: string,
  payload: UpdateFeatureQuestionPayload,
): Promise<FeatureQuestionDoc> {
  const { data } = await api.put<FeatureQuestionResponse>(
    `/featuresAndQuestions/update/${id}`,
    payload,
  );
  return (
    Array.isArray(data.data) ? data.data[0] : data.data
  ) as FeatureQuestionDoc;
}
