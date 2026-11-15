"use client";

import { useState } from "react";
import { Plus, Edit3, ChevronDown, ChevronUp } from "lucide-react";
import FeatureCard from "./FeatureCard";
import EditModal from "./EditModal";
import {
  useAppFeatures,
  useFAQs,
  useCreateFeatureOrFAQ,
  useUpdateFeatureOrFAQ,
} from "../hooks/useFeaturesAndQuestions";
import type { FeatureQuestionDocType } from "../types/settings.types";

type Editor = {
  id?: string;
  docType: FeatureQuestionDocType;
  question: string;
  answer: string;
};
export default function DisputeCenter() {
  const features = useAppFeatures();
  const faqs = useFAQs();
  const create = useCreateFeatureOrFAQ();
  const update = useUpdateFeatureOrFAQ();
  const [modal, setModal] = useState<Editor | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  async function save(question: string, answer: string) {
    if (!modal) return;
    const payload = { docType: modal.docType, question, answer };
    if (modal.id) await update.mutateAsync({ id: modal.id, payload });
    else await create.mutateAsync(payload);
    setModal(null);
  }
  if (features.isLoading || faqs.isLoading)
    return <p role="status">Loading help content...</p>;
  if (features.isError || faqs.isError)
    return (
      <div role="alert">
        <p>Unable to load help content.</p>
        <button
          onClick={() => {
            void features.refetch();
            void faqs.refetch();
          }}
        >
          Retry
        </button>
      </div>
    );
  return (
    <div className="space-y-8">
      <section aria-label="App Features">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold">App Features</h2>
          <button
            className="flex items-center gap-2 rounded-lg bg-[#871dad] px-4 py-2 text-white"
            aria-label="Add app feature"
            onClick={() =>
              setModal({ docType: "AppFeatures", question: "", answer: "" })
            }
          >
            <Plus size={16} />
            Add
          </button>
        </div>
        <div className="mt-4 grid gap-5 lg:grid-cols-2">
          {features.data?.map((feature) => (
            <FeatureCard
              key={feature._id}
              title={feature.question}
              description={feature.answer}
              onEdit={() =>
                setModal({
                  id: feature._id,
                  docType: "AppFeatures",
                  question: feature.question,
                  answer: feature.answer,
                })
              }
            />
          ))}
        </div>
        {!features.data?.length && (
          <p className="mt-4 text-gray-500">No features published yet.</p>
        )}
      </section>
      <section aria-label="Frequently Asked Questions">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
          <button
            className="flex items-center gap-2 rounded-lg bg-[#871dad] px-4 py-2 text-white"
            aria-label="Add FAQ"
            onClick={() =>
              setModal({ docType: "FAQquestions", question: "", answer: "" })
            }
          >
            <Plus size={16} />
            Add
          </button>
        </div>
        {faqs.data?.map((faq) => (
          <div key={faq._id} className="border-b border-gray-200 py-4">
            <div className="flex items-start gap-3">
              <button
                className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left text-lg font-medium text-[#871dad]"
                aria-expanded={expandedId === faq._id}
                onClick={() =>
                  setExpandedId(expandedId === faq._id ? null : faq._id)
                }
              >
                {faq.question}
                {expandedId === faq._id ? (
                  <ChevronUp className="shrink-0" />
                ) : (
                  <ChevronDown className="shrink-0" />
                )}
              </button>
              <button
                aria-label={`Edit ${faq.question}`}
                className="text-[#871dad]"
                onClick={() =>
                  setModal({
                    id: faq._id,
                    docType: "FAQquestions",
                    question: faq.question,
                    answer: faq.answer,
                  })
                }
              >
                <Edit3 size={20} />
              </button>
            </div>
            {expandedId === faq._id && (
              <p className="mt-3 whitespace-pre-wrap text-gray-600">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
        {!faqs.data?.length && (
          <p className="mt-4 text-gray-500">No FAQs published yet.</p>
        )}
      </section>
      {modal && (
        <EditModal
          title={
            modal.docType === "AppFeatures"
              ? "App Features"
              : "Frequently Asked Questions"
          }
          question={modal.question}
          answer={modal.answer}
          onClose={() => setModal(null)}
          onSave={save}
        />
      )}
    </div>
  );
}
