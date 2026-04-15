"use client";

import { useState } from "react";
import { Edit3, ChevronDown, ChevronUp, Plus } from "lucide-react";
import FeatureCard from "./FeatureCard";
import EditModal from "./EditModal";

export default function DisputeCenter() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const [features, setFeatures] = useState([
    {
      title: "Grading & Assessments",
      description:
        "Streamline evaluations with customizable grading tools and instant.",
    },
    {
      title: "Swipe to Browse",
      description:
        "Explore cars with simple swipe gestures—right to like, left to skip.",
    },
  ]);

  const [faqs, setFaqs] = useState([
    {
      question: "Who is this app for?",
      answer:
        "Our platform is designed for schools, educators, students, and parents looking to improve communication, streamline",
    },
    { question: "How do parents stay involved?", answer: "" },
    { question: "Is the app mobile-friendly?", answer: "" },
    { question: "How is data kept secure?", answer: "" },
    { question: "What kind of reports can be generated?", answer: "" },
    { question: "How do we get started?", answer: "" },
    { question: "Is there a cost to use the app?", answer: "" },
    { question: "What support options are available?", answer: "" },
  ]);

  const [modal, setModal] = useState<{
    type: "feature" | "faq";
    index: number | null;
    question: string;
    answer: string;
  } | null>(null);

  const handleSave = (question: string, answer: string) => {
    if (!modal) return;

    if (modal.type === "feature") {
      if (modal.index !== null) {
        setFeatures((prev) =>
          prev.map((f, i) =>
            i === modal.index ? { title: question, description: answer } : f,
          ),
        );
      } else {
        setFeatures((prev) => [
          ...prev,
          { title: question, description: answer },
        ]);
      }
    } else {
      if (modal.index !== null) {
        setFaqs((prev) =>
          prev.map((f, i) => (i === modal.index ? { question, answer } : f)),
        );
      } else {
        setFaqs((prev) => [...prev, { question, answer }]);
      }
    }

    setModal(null);
  };

  return (
    <div className="space-y-8">
      {/* App Features */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-[24px] font-semibold tracking-[0.3px] text-[#121212]">
            App Features
          </h2>
          <button
            onClick={() =>
              setModal({
                type: "feature",
                index: null,
                question: "",
                answer: "",
              })
            }
            className="flex cursor-pointer items-center gap-2 rounded-[8px] bg-[#871dad] px-4 py-2 text-[14px] font-medium text-white hover:bg-[#751a99] transition-colors"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-5">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              onEdit={() =>
                setModal({
                  type: "feature",
                  index,
                  question: feature.title,
                  answer: feature.description,
                })
              }
            />
          ))}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-[24px] font-semibold tracking-[0.3px] text-[#121212]">
            Frequently Asked Questions
          </h2>
          <button
            onClick={() =>
              setModal({
                type: "faq",
                index: null,
                question: "",
                answer: "",
              })
            }
            className="flex cursor-pointer items-center gap-2 rounded-[8px] bg-[#871dad] px-4 py-2 text-[14px] font-medium text-white hover:bg-[#751a99] transition-colors"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
        <div className="mt-4">
          {faqs.map((faq, index) => (
            <div key={index}>
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <span className="text-[22px] font-medium tracking-[0.3px] text-[#871dad]">
                    {faq.question}
                  </span>
                  <button
                    onClick={() =>
                      setModal({
                        type: "faq",
                        index,
                        question: faq.question,
                        answer: faq.answer,
                      })
                    }
                    className="cursor-pointer text-[#871dad] hover:text-[#751a99] transition-colors"
                  >
                    <Edit3 size={20} />
                  </button>
                </div>
                <button
                  onClick={() =>
                    setExpandedIndex(expandedIndex === index ? null : index)
                  }
                  className="cursor-pointer text-[#871dad] transition-colors hover:text-[#751a99]"
                >
                  {expandedIndex === index ? (
                    <ChevronUp size={24} />
                  ) : (
                    <ChevronDown size={24} />
                  )}
                </button>
              </div>
              {expandedIndex === index && faq.answer && (
                <p className="pb-4 text-[20px] leading-[1.4] text-[#666]">
                  {faq.answer}
                </p>
              )}
              {index < faqs.length - 1 && (
                <div className="h-[1px] bg-gray-200" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Edit/Add Modal */}
      {modal && (
        <EditModal
          title={
            modal.type === "feature"
              ? "App Features"
              : "Frequently Asked Questions"
          }
          question={modal.question}
          answer={modal.answer}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
