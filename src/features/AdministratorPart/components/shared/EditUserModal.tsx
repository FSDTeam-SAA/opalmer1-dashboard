"use client";

import styles from "@/components/ui/dashboard-modal.module.css";

import { useEffect, useRef, useState } from "react";
import Image from "@/components/ui/data-image";
import { Camera, X } from "lucide-react";

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
  /** Current profile photo URL, if any. */
  image?: string;
};

export type EditUserPayload = Partial<{
  /** New profile photo; sent as multipart "image". */
  image: File | null;
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
  /** Grade level, age and gender — hidden for parents. Defaults to true. */
  showProfileFields?: boolean;
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
  showProfileFields = true,
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
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Release the object URL of the picked photo when it changes or on close.
  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFormError("Please choose an image file.");
      return;
    }
    setFormError(null);
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const shownAvatar = avatarPreview ?? user.image ?? "";

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
    if (gradeLevel !== "" && Number(gradeLevel) !== Number(user.gradeLevel)) {
      payload.gradeLevel = Number(gradeLevel);
    }
    if (age !== "" && Number(age) !== user.age) {
      payload.age = Number(age);
    }
    if (avatarFile) payload.image = avatarFile;

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[3px]"
      onClick={onClose}
    >
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
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

        {/* Profile photo */}
        <div className="mt-5 flex justify-center">
          <div className="relative">
            <div className="h-20 w-20 overflow-hidden rounded-full border-[3px] border-[#871dad] sm:h-24 sm:w-24">
              {shownAvatar ? (
                <Image
                  src={shownAvatar}
                  alt={`${user.name} photo`}
                  width={150}
                  height={150}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-[32px] font-semibold text-[#871dad]">
                  {user.name?.charAt(0).toUpperCase() || "?"}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Change photo"
              title="Change photo"
              className="absolute bottom-1 right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-[#871dad] text-white transition-colors hover:bg-[#751a99]"
            >
              <Camera size={14} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
        </div>
        {avatarFile && (
          <p className="mt-2 text-center text-[13px] text-[#666]">
            New photo selected — click Save to upload.
          </p>
        )}

        <form onSubmit={handleSubmit} className={styles.fields}>
          <div className={styles.fullWidth}>
            <label
              className="block text-[15px] sm:text-[18px] font-semibold capitalize text-[#333]"
              htmlFor="edit-user-name"
            >
              Name
            </label>
            <input
              type="text"
              id="edit-user-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 h-[48px] sm:h-[56px] w-full rounded-[8px] border border-[#08374d] bg-[#f9f9f9] px-4 sm:px-5 text-[15px] sm:text-[16px] text-[#333] outline-none placeholder:text-[#666]"
            />
          </div>

          <div
            className={`${styles.fullWidth} grid grid-cols-1 gap-4 sm:grid-cols-2`}
          >
            <div>
              <label
                className="block text-[15px] sm:text-[18px] font-semibold capitalize text-[#333]"
                htmlFor="edit-user-email"
              >
                Email
              </label>
              <input
                type="email"
                id="edit-user-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 h-[48px] sm:h-[56px] w-full rounded-[8px] border border-[#c7c7c7] bg-[#f9f9f9] px-4 sm:px-5 text-[15px] sm:text-[16px] text-[#333] outline-none placeholder:text-[#666]"
              />
            </div>
            <div>
              <label
                className="block text-[15px] sm:text-[18px] font-semibold capitalize text-[#333]"
                htmlFor="edit-user-phone"
              >
                Phone
              </label>
              <input
                type="tel"
                id="edit-user-phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-2 h-[48px] sm:h-[56px] w-full rounded-[8px] border border-[#c7c7c7] bg-[#f9f9f9] px-4 sm:px-5 text-[15px] sm:text-[16px] text-[#333] outline-none placeholder:text-[#666]"
              />
            </div>
          </div>

          {showProfileFields && (
            <div
              className={`${styles.fullWidth} grid grid-cols-1 gap-4 sm:grid-cols-3`}
            >
              <div>
                <label
                  className="block text-[15px] sm:text-[18px] font-semibold capitalize text-[#333]"
                  htmlFor="edit-user-grade"
                >
                  Grade Level
                </label>
                <input
                  type="number"
                  min="1"
                  id="edit-user-grade"
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="mt-2 h-[48px] sm:h-[56px] w-full rounded-[8px] border border-[#c7c7c7] bg-[#f9f9f9] px-4 sm:px-5 text-[15px] sm:text-[16px] text-[#333] outline-none placeholder:text-[#666]"
                />
              </div>
              <div>
                <label
                  className="block text-[15px] sm:text-[18px] font-semibold capitalize text-[#333]"
                  htmlFor="edit-user-age"
                >
                  Age
                </label>
                <input
                  type="number"
                  min="1"
                  id="edit-user-age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="mt-2 h-[48px] sm:h-[56px] w-full rounded-[8px] border border-[#c7c7c7] bg-[#f9f9f9] px-4 sm:px-5 text-[15px] sm:text-[16px] text-[#333] outline-none placeholder:text-[#666]"
                />
              </div>
              <div>
                <label
                  className="block text-[15px] sm:text-[18px] font-semibold capitalize text-[#333]"
                  htmlFor="edit-user-gender"
                >
                  Gender
                </label>
                <select
                  id="edit-user-gender"
                  value={gender}
                  onChange={(e) =>
                    setGender(
                      e.target.value as "male" | "female" | "other" | "",
                    )
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
          )}

          <div className={styles.fullWidth}>
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
