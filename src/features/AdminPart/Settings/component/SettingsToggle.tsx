"use client";

export default function SettingsToggle({
  active,
  onChange,
}: {
  active: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={`relative h-[19px] w-[41px] cursor-pointer rounded-full transition-colors duration-300 ${
        active ? "bg-[#871dad]" : "bg-[#c7c7c7]"
      }`}
    >
      <span
        className={`absolute top-[1px] h-[17px] w-[17px] rounded-full bg-white shadow transition-all duration-300 ${
          active ? "left-[22px]" : "left-[2px]"
        }`}
      />
    </button>
  );
}
