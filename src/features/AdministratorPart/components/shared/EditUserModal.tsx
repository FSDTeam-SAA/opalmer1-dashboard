"use client";

import { useState } from "react";
import { X } from "lucide-react";

/**
 * Shared edit modal for teachers and students.
 *
 * Both flows hit PUT /users/:id with the same allowed fields. The backend
 * (user.controller.ts → updateUser) strips password/role/refreshToken/
 * verificationInfo, so we only expose the fields the UI is allowed to change.
 */

export type EditableUser = {
  _id: string;
  name: string;
  Id: string;
  phoneNumber?: string;
  email?: string;
  gradeLevel?: number | string;
  age?: number;
  gender?: "male" | "female" | "other" | "";
  state?: "active" | "inactive";
};

export type EditUserPayload = Partial<{
  username: string;
  phoneNumber: string;
  email: string;
  state: "active" | "inactive";
  gender: "male" | "female" | "other";
  age: number;
  gradeLevel: number;
}>;

type EditUserModalProps = {
  title: string;
  user: EditableUser;
  isPending: boolean;
  onSubmit: (payload: EditUserPayload) => Promise<unknown> | void;
  onClose: () => void;
};

function describeError(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null) {
    const maybe = err as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    return (
      maybe.response?.data?.message ?? maybe.message ?? "Something went wrong"
    );
  }
  return "Something went wrong";
}

export default function EditUserModal({
  title,
  user,
  isPending,
  onSubmit,
  onClose,
}: EditUserModalProps) {
  const [name, setName] = useState(user.name);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber ?? "");
  const [email, setEmail] = useState(user.email ?? "");
  const [gradeLevel, setGradeLevel] = useState(
    user.gradeLevel !== undefined && user.gradeLevel !== null
      ? String(user.gradeLevel)
      : "",
  );
  const [age, setAge] = useState(
    user.age !== undefined && user.age !== null ? String(user.age) : "",
  );
  const [gender, setGender] = useState<"male" | "female" | "other" | "">(
    user.gender ?? "",
  );
  const [state, setState] = useState<"active" | "inactive">(
    user.state ?? "active",
  );
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError("Name is required.");
      return;
    }

    const payload: EditUserPayload = {};
    if (name.trim() !== user.name) payload.username = name.trim();
    if (phoneNumber.trim() !== (user.phoneNumber ?? ""))
      payload.phoneNumber = phoneNumber.trim();
    if (email.trim() !== (user.email ?? "")) payload.email = email.trim();
    if (gender !== (user.gender ?? "") && gender !== "")
      payload.gender = gender;
    if (state !== (user.state ?? "active")) payload.state = state;
    if (gradeLevel !== "" && Number(gradeLevel) !== user.gradeLevel) {
      payload.gradeLevel = Number(gradeLevel);
    }
    if (age !== "" && Number(age) !== user.age) {
      payload.age = Number(age);
    }

    if (Object.keys(payload).length === 0) {
      onClose();
      return;
    }

    try {
      await onSubmit(payload);
      onClose();
    } catch (err) {
      setFormError(describeError(err));
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(18,18,18,0.4)] p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[629px] max-h-[90vh] overflow-y-auto rounded-[30px] bg-white px-6 py-8 sm:px-10 lg:px-[72px] lg:py-[50px]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-6 top-6 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#666] hover:bg-gray-100 transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-center text-[24px] sm:text-[32px] font-bold text-[#333]">
          {title}
        </h2>
        <p className="mt-1 text-center text-[14px] text-[#666]">
          Id: <span className="font-medium text-[#333]">{user.Id}</span>
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-[15px] sm:text-[18px] font-semibold capitalize text-[#333]">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 h-[48px] sm:h-[56px] w-full rounded-[8px] border border-[#08374d] bg-[#f9f9f9] px-4 sm:px-5 text-[15px] sm:text-[16px] text-[#333] outline-none placeholder:text-[#666]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[15px] sm:text-[18px] font-semibold capitalize text-[#333]">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 h-[48px] sm:h-[56px] w-full rounded-[8px] border border-[#c7c7c7] bg-[#f9f9f9] px-4 sm:px-5 text-[15px] sm:text-[16px] text-[#333] outline-none placeholder:text-[#666]"
              />
            </div>
            <div>
              <label className="block text-[15px] sm:text-[18px] font-semibold capitalize text-[#333]">
                Phone
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-2 h-[48px] sm:h-[56px] w-full rounded-[8px] border border-[#c7c7c7] bg-[#f9f9f9] px-4 sm:px-5 text-[15px] sm:text-[16px] text-[#333] outline-none placeholder:text-[#666]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[15px] sm:text-[18px] font-semibold capitalize text-[#333]">
                Grade Level
              </label>
              <input
                type="number"
                min="1"
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="mt-2 h-[48px] sm:h-[56px] w-full rounded-[8px] border border-[#c7c7c7] bg-[#f9f9f9] px-4 sm:px-5 text-[15px] sm:text-[16px] text-[#333] outline-none placeholder:text-[#666]"
              />
            </div>
            <div>
              <label className="block text-[15px] sm:text-[18px] font-semibold capitalize text-[#333]">
                Age
              </label>
              <input
                type="number"
                min="1"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="mt-2 h-[48px] sm:h-[56px] w-full rounded-[8px] border border-[#c7c7c7] bg-[#f9f9f9] px-4 sm:px-5 text-[15px] sm:text-[16px] text-[#333] outline-none placeholder:text-[#666]"
              />
            </div>
            <div>
              <label className="block text-[15px] sm:text-[18px] font-semibold capitalize text-[#333]">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) =>
                  setGender(e.target.value as "male" | "female" | "other" | "")
                }
                className="mt-2 h-[48px] sm:h-[56px] w-full rounded-[8px] border border-[#c7c7c7] bg-[#f9f9f9] px-4 sm:px-5 text-[15px] sm:text-[16px] text-[#333] outline-none"
              >
                <option value="">Select…</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[15px] sm:text-[18px] font-semibold capitalize text-[#333]">
              Status
            </label>
            <div className="mt-2 flex gap-3">
              {(["active", "inactive"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setState(opt)}
                  className={`h-[44px] flex-1 rounded-[8px] border text-[14px] font-semibold capitalize transition-colors ${
                    state === opt
                      ? "border-[#871dad] bg-[#871dad] text-white"
                      : "border-[#c7c7c7] bg-white text-[#666] hover:border-[#871dad] hover:text-[#871dad]"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {formError && (
            <p className="text-[14px] text-[#e64540]">{formError}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="h-[48px] sm:h-[56px] w-full cursor-pointer rounded-[10px] bg-[#871dad] text-[18px] sm:text-[22px] font-bold uppercase text-white hover:bg-[#751a99] transition-colors disabled:opacity-60"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
