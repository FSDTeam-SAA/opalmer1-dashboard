import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAboutOrTerm,
  fetchAbout,
  fetchTerms,
  updateAboutOrTerm,
} from "../api/aboutAndTerm.api";
import type {
  AboutOrTermDocType,
  CreateAboutOrTermPayload,
  UpdateAboutOrTermPayload,
} from "../types/settings.types";

const ABOUT_KEY = ["settings", "about"] as const;
const TERMS_KEY = ["settings", "terms"] as const;

/**
 * useAbout — GET /aboutAndTerm/about
 */
export function usePolicyContent(docType: AboutOrTermDocType) {
  return useQuery({
    queryKey: docType === "about" ? ABOUT_KEY : TERMS_KEY,
    queryFn: docType === "about" ? fetchAbout : fetchTerms,
    staleTime: 0,
  });
}
export function useAbout() {
  return usePolicyContent("about");
}

/**
 * useTerms — GET /aboutAndTerm/terms
 */
export function useTerms() {
  return usePolicyContent("terms");
}

/**
 * useCreateAboutOrTerm — POST /aboutAndTerm/create
 */
export function useCreateAboutOrTerm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAboutOrTermPayload) =>
      createAboutOrTerm(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: variables.docType === "about" ? ABOUT_KEY : TERMS_KEY,
      });
    },
  });
}

/**
 * useUpdateAboutOrTerm — PUT /aboutAndTerm/update/:id
 */
export function useUpdateAboutOrTerm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAboutOrTermPayload;
    }) => updateAboutOrTerm(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: variables.payload.docType === "terms" ? TERMS_KEY : ABOUT_KEY,
      });
    },
  });
}
