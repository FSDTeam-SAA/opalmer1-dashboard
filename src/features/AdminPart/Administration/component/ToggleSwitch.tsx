"use client";

export default function ToggleSwitch({
  active,
  onChange,
}: {
  active: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={`relative h-[20px] w-[42px] cursor-pointer rounded-full transition-colors duration-300 overflow-hidden ${
        active ? "bg-purple-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-1/2 -translate-y-1/2 h-[16px] w-[16px] rounded-full bg-white shadow-md transition-all duration-300 ${
          active ? "left-[24px]" : "left-[4px]"
        }`}
      />
    </button>
  );
}
