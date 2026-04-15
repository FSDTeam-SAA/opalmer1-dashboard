"use client";

/* ───── Accent Colors (rotating pattern from Figma) ───── */
const accentColors = ["#4aa678", "#febd43", "#3f99b4", "#8854c0"];

/* ───── Behavior Record Data ───── */
const behaviorRecords = [
  { id: 1, title: "Fractions Practice", date: "12/05/2025", progress: 93 },
  { id: 2, title: "Photosynthesis", date: "12/05/2025", progress: 93 },
  { id: 3, title: "Force and Motion", date: "12/05/2025", progress: 93 },
  { id: 4, title: "Fractions Practice", date: "12/05/2025", progress: 93 },
  { id: 5, title: "Fractions Practice", date: "12/05/2025", progress: 93 },
  { id: 6, title: "Photosynthesis", date: "12/05/2025", progress: 93 },
  { id: 7, title: "Force and Motion", date: "12/05/2025", progress: 93 },
  { id: 8, title: "Fractions Practice", date: "12/05/2025", progress: 93 },
  { id: 9, title: "Fractions Practice", date: "12/05/2025", progress: 93 },
  { id: 10, title: "Photosynthesis", date: "12/05/2025", progress: 93 },
  { id: 11, title: "Force and Motion", date: "12/05/2025", progress: 93 },
  { id: 12, title: "Fractions Practice", date: "12/05/2025", progress: 93 },
  { id: 13, title: "Fractions Practice", date: "12/05/2025", progress: 93 },
  { id: 14, title: "Photosynthesis", date: "12/05/2025", progress: 93 },
  { id: 15, title: "Force and Motion", date: "12/05/2025", progress: 93 },
  { id: 16, title: "Fractions Practice", date: "12/05/2025", progress: 93 },
];

/* ───── Behavior Card ───── */
function BehaviorCard({
  record,
  accentColor,
}: {
  record: (typeof behaviorRecords)[0];
  accentColor: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-[10px] bg-white shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]">
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 h-full w-[10px] rounded-bl-[10px] rounded-tl-[10px]"
        style={{ backgroundColor: accentColor }}
      />

      <div className="py-5 pl-7 pr-5">
        <h3 className="text-[22px] font-medium text-black">{record.title}</h3>
        <p className="mt-1 text-[18px] text-[#666]">{record.date}</p>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between">
            <span className="text-[16px] tracking-[0.3px] text-[#871dad]">
              0%
            </span>
            <span className="text-[16px] tracking-[0.3px] text-[#871dad]">
              {record.progress}%
            </span>
          </div>
          <div className="mt-1 h-[4px] w-full rounded-[10px] bg-[#d9d9d9]">
            <div
              className="h-full rounded-[10px] bg-[#871dad]"
              style={{ width: `${record.progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BehaviorRecordPage({
  slug,
  studentSlug,
  subjectSlug,
}: {
  slug: string;
  studentSlug: string;
  subjectSlug: string;
}) {
  return (
    <div className="pt-10 mt-32">
      <div className="grid grid-cols-2 gap-5">
        {behaviorRecords.map((record, index) => (
          <BehaviorCard
            key={record.id}
            record={record}
            accentColor={accentColors[index % accentColors.length]}
          />
        ))}
      </div>
    </div>
  );
}
