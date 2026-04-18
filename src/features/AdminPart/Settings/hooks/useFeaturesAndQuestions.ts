import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFeatureOrFAQ,
  fetchAppFeatures,
  fetchFAQs,
  updateFeatureOrFAQ,
} from "../api/featuresAndQuestions.api";
import type {
  CreateFeatureQuestionPayload,
  UpdateFeatureQuestionPayload,
} from "../types/settings.types";

const FEATURES_KEY = ["settings", "app-features"] as const;
const FAQ_KEY = ["settings", "faqs"] as const;

/**
 * useAppFeatures — GET /featuresAndQuestions/AppFeatures
 */
export function useAppFeatures() {
  return useQuery({ queryKey: FEATURES_KEY, queryFn: fetchAppFeatures });
}

/**
 * useFAQs — GET /featuresAndQuestions/FAQquestions
 */
export function useFAQs() {
  return useQuery({ queryKey: FAQ_KEY, queryFn: fetchFAQs });
}

/**
 * useCreateFeatureOrFAQ — POST /featuresAndQuestions/create
 */
export function useCreateFeatureOrFAQ() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateFeatureQuestionPayload) =>
      createFeatureOrFAQ(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: variables.docType === "AppFeatures" ? FEATURES_KEY : FAQ_KEY,
      });
    },
  });
}

/**
 * useUpdateFeatureOrFAQ — PUT /featuresAndQuestions/update/:id
 */
export function useUpdateFeatureOrFAQ() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateFeatureQuestionPayload;
    }) => updateFeatureOrFAQ(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey:
          variables.payload.docType === "FAQquestions" ? FAQ_KEY : FEATURES_KEY,
      });
    },
  });
}
