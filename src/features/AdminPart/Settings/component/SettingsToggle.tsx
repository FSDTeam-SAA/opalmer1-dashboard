"use client";
export default function SettingsToggle({
  active,
  onChange,
  label = "Toggle setting",
  disabled = false,
}: {
  active: boolean;
  onChange: () => void;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-label={label}
      aria-checked={active}
      disabled={disabled}
      onClick={onChange}
      className="flex h-11 w-12 shrink-0 items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-[#871dad] disabled:opacity-50"
    >
      <span
        aria-hidden="true"
        className={`relative h-[22px] w-[42px] rounded-full transition-colors ${active ? "bg-[#871dad]" : "bg-[#c7c7c7]"}`}
      >
        <span
          className={`absolute top-[2px] h-[18px] w-[18px] rounded-full bg-white shadow transition-all ${active ? "left-[22px]" : "left-[2px]"}`}
        />
      </span>
    </button>
  );
}
