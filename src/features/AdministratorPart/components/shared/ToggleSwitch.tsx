"use client";

type ToggleSwitchProps = {
  active: boolean;
  onChange: () => void;
  disabled?: boolean;
};

export function ToggleSwitch({
  active,
  onChange,
  disabled,
}: ToggleSwitchProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      aria-pressed={active}
      className={`relative h-[19px] w-[41px] rounded-full transition-colors ${
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      } ${active ? "bg-[#871dad]" : "bg-[#c7c7c7]"}`}
    >
      <span
        className={`absolute top-[1px] h-[17px] w-[17px] rounded-full bg-white shadow transition-transform ${
          active ? "left-[24px]" : "left-[4px]"
        }`}
      />
    </button>
  );
}
