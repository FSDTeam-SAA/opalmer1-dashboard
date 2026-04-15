"use client";

import { Edit3 } from "lucide-react";

export default function AboutUs() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[24px] font-semibold tracking-[0.3px] text-[#121212]">
          About Us
        </h2>
        <button className="cursor-pointer text-[#871dad] hover:text-[#751a99] transition-colors">
          <Edit3 size={22} />
        </button>
      </div>

      {/* Content */}
      <div className="mt-6 space-y-6 text-[20px] leading-[1.6] text-[#666]">
        <p>
          At Education, We Believe Education Thrives When Everyone—Teachers,
          Students, And Parents—Are Connected, Informed, And Empowered. Our
          Platform Is Built To Transform The Way Schools Manage Learning By
          Simplifying Communication, Streamlining Classroom Management, And
          Strengthening The Partnership Between Home And School.
        </p>

        <div>
          <h3 className="text-[22px] font-medium text-[#333]">Our Mission</h3>
          <p className="mt-2">
            To Create A Seamless Digital Environment That Supports Academic
            Excellence, Fosters Student Growth, And Enhances Transparency And
            Collaboration Across The Entire Education Ecosystem.
          </p>
        </div>

        <div>
          <h3 className="text-[22px] font-medium text-[#333]">What We Do</h3>
          <p className="mt-2">
            We Provide An All-In-One Education Management Solution That Brings
            Together Everything Schools Need In One Intuitive Platform. From
            Real-Time Communication And Interactive Learning Tools To Behavior
            Tracking, Grading, And Performance Reporting, We Give Educators,
            Students, And Parents A Single Space To Engage Meaningfully With The
            Learning Journey.
          </p>
          <p className="mt-3">Key Features Include:</p>
          <div className="mt-2 space-y-1">
            <p>
              📚 Curriculum & Lesson Planning – Organize And Share Structured
              Learning Plans.
            </p>
            <p>
              🧑‍🎓 Grading & Assessment Tools – Simplify Evaluations And Give
              Immediate Feedback.
            </p>
            <p>
              📊 Performance Insights – Track Student Progress In Real Time With
              Smart Analytics.
            </p>
            <p>
              💬 Communication Channels – Enable Secure Messaging Between
              Teachers, Students, And Parents.
            </p>
            <p>
              ✅ Behavior Tracking – Encourage Positive Behavior With
              Transparent Reporting.
            </p>
            <p>
              👨‍👩‍👧 School-Home Collaboration – Keep Parents Engaged And Informed
              Every Step Of The Way.
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-[22px] font-medium text-[#333]">
            Why It Matters
          </h3>
          <p className="mt-2">
            We&apos;re Here To Reduce Administrative Burden, Foster Deeper
            Engagement, And Make Education More Personal And Impactful. Our
            Platform Empowers Teachers To Focus On Teaching, Students To Take
            Ownership Of Their Learning, And Parents To Stay Actively
            Involved—Building A Stronger, More Supportive Academic Community.
          </p>
        </div>
      </div>
    </div>
  );
}
