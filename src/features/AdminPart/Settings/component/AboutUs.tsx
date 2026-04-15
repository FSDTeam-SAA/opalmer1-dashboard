"use client";

import { useState } from "react";
import { Edit3, X } from "lucide-react";

const defaultContent = `At Education, We Believe Education Thrives When Everyone—Teachers, Students, And Parents—Are Connected, Informed, And Empowered. Our Platform Is Built To Transform The Way Schools Manage Learning By Simplifying Communication, Streamlining Classroom Management, And Strengthening The Partnership Between Home And School.

Our Mission
To Create A Seamless Digital Environment That Supports Academic Excellence, Fosters Student Growth, And Enhances Transparency And Collaboration Across The Entire Education Ecosystem.

What We Do
We Provide An All-In-One Education Management Solution That Brings Together Everything Schools Need In One Intuitive Platform. From Real-Time Communication And Interactive Learning Tools To Behavior Tracking, Grading, And Performance Reporting, We Give Educators, Students, And Parents A Single Space To Engage Meaningfully With The Learning Journey.

Key Features Include:
📚 Curriculum & Lesson Planning – Organize And Share Structured Learning Plans.
🧑‍🎓 Grading & Assessment Tools – Simplify Evaluations And Give Immediate Feedback.
📊 Performance Insights – Track Student Progress In Real Time With Smart Analytics.
💬 Communication Channels – Enable Secure Messaging Between Teachers, Students, And Parents.
✅ Behavior Tracking – Encourage Positive Behavior With Transparent Reporting.
👨‍👩‍👧 School-Home Collaboration – Keep Parents Engaged And Informed Every Step Of The Way.

Why It Matters
We're Here To Reduce Administrative Burden, Foster Deeper Engagement, And Make Education More Personal And Impactful. Our Platform Empowers Teachers To Focus On Teaching, Students To Take Ownership Of Their Learning, And Parents To Stay Actively Involved—Building A Stronger, More Supportive Academic Community.`;

/* ───── Edit About Us Modal ───── */
function EditAboutModal({
  content,
  onClose,
  onSave,
}: {
  content: string;
  onClose: () => void;
  onSave: (content: string) => void;
}) {
  const [text, setText] = useState(content);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(18,18,18,0.4)]"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-[629px] overflow-hidden rounded-[20px] bg-white shadow-[0px_0px_20px_0px_rgba(6,51,54,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#666] hover:bg-gray-100 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col p-10">
          {/* Title */}
          <h2 className="text-center text-[24px] font-bold text-[#333]">
            Edit About Us
          </h2>

          {/* Textarea */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mt-6 h-[500px] w-full resize-none rounded-[10px] border border-[#c7c7c7] bg-white p-5 text-[16px] leading-[1.6] text-[#333] outline-none placeholder:text-[#999]"
            placeholder="Write about us content..."
          />

          {/* Save Button */}
          <button
            onClick={() => onSave(text)}
            className="mt-6 h-[50px] w-full cursor-pointer rounded-[10px] bg-[#871dad] text-[18px] font-bold uppercase text-white hover:bg-[#751a99] transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───── Render Content ───── */
function RenderAboutContent({ content }: { content: string }) {
  const paragraphs = content.split("\n\n");

  return (
    <div className="mt-6 space-y-6 text-[20px] leading-[1.6] text-[#666]">
      {paragraphs.map((block, i) => {
        const lines = block.split("\n");
        const firstLine = lines[0];

        const isHeading =
          firstLine === "Our Mission" ||
          firstLine === "What We Do" ||
          firstLine === "Why It Matters" ||
          firstLine === "Key Features Include:";

        if (isHeading && lines.length === 1) {
          return (
            <h3 key={i} className="text-[22px] font-medium text-[#333]">
              {firstLine}
            </h3>
          );
        }

        if (isHeading && lines.length > 1) {
          return (
            <div key={i}>
              <h3 className="text-[22px] font-medium text-[#333]">
                {firstLine}
              </h3>
              {lines.slice(1).map((line, j) => (
                <p key={j} className="mt-1">
                  {line}
                </p>
              ))}
            </div>
          );
        }

        return (
          <div key={i}>
            {lines.map((line, j) => (
              <p key={j} className={j > 0 ? "mt-1" : ""}>
                {line}
              </p>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default function AboutUs() {
  const [content, setContent] = useState(defaultContent);
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[24px] font-semibold tracking-[0.3px] text-[#121212]">
          About Us
        </h2>
        <button
          onClick={() => setShowEditModal(true)}
          className="cursor-pointer text-[#871dad] hover:text-[#751a99] transition-colors"
        >
          <Edit3 size={22} />
        </button>
      </div>

      {/* Content */}
      <RenderAboutContent content={content} />

      {/* Edit Modal */}
      {showEditModal && (
        <EditAboutModal
          content={content}
          onClose={() => setShowEditModal(false)}
          onSave={(newContent) => {
            setContent(newContent);
            setShowEditModal(false);
          }}
        />
      )}
    </div>
  );
}
