"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera, Eye, EyeOff, School as SchoolIcon, X } from "lucide-react";
import { useCreateTeacher } from "../hooks/useTeachers";
import { useCreateSchool, useMySchool } from "../hooks/useSchool";

type CreateTeacherModalProps = {
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

/**
 * Inline panel shown when the administrator hasn't set up their school yet.
 * Hits POST /school/create and lets the teacher form proceed once the school
 * cache has been refreshed.
 */
function SchoolSetupPanel({
  onCreated,
}: {
  onCreated: (schoolId: string) => void;
}) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const createSchool = useCreateSchool();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("School name is required.");
      return;
    }
    try {
      const school = await createSchool.mutateAsync({
        name: name.trim(),
        code: code.trim() || undefined,
        email: email.trim() || undefined,
      });
      onCreated(school._id);
    } catch (err) {
      setError(describeError(err));
    }
  };

  return (
    <div className="mt-6 rounded-[12px] border border-[#f3d6ee] bg-[#faf2f9] p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#871dad]/10 text-[#871dad]">
          <SchoolIcon size={18} />
        </div>
        <div>
          <p className="text-[15px] font-semibold text-[#333]">
            Set up your school first
          </p>
          <p className="mt-1 text-[13px] text-[#666]">
            Teachers belong to a school. Create yours below to continue.
          </p>
        </div>
      </div>

      <form onSubmit={handleCreate} className="mt-4 space-y-3">
        <input
          type="text"
          placeholder="School name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-[44px] w-full rounded-[8px] border border-[#c7c7c7] bg-white px-4 text-[15px] text-[#333] outline-none placeholder:text-[#888]"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="School code (optional)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="h-[44px] w-full rounded-[8px] border border-[#c7c7c7] bg-white px-4 text-[15px] text-[#333] outline-none placeholder:text-[#888]"
          />
          <input
            type="email"
            placeholder="School email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-[44px] w-full rounded-[8px] border border-[#c7c7c7] bg-white px-4 text-[15px] text-[#333] outline-none placeholder:text-[#888]"
          />
        </div>

        {error && <p className="text-[13px] text-[#e64540]">{error}</p>}

        <button
          type="submit"
          disabled={createSchool.isPending}
          className="h-[44px] w-full cursor-pointer rounded-[10px] bg-[#871dad] text-[15px] font-bold uppercase text-white hover:bg-[#751a99] transition-colors disabled:opacity-60"
        >
          {createSchool.isPending ? "Creating school..." : "Create school"}
        </button>
      </form>
    </div>
  );
}

export default function CreateTeacherModal({
  onClose,
}: CreateTeacherModalProps) {
  const [name, setName] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other" | "">("");
  const [showPassword, setShowPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createTeacher = useCreateTeacher();
  const {
    data: school,
    isLoading: schoolLoading,
    isError: schoolError,
    refetch: refetchSchool,
  } = useMySchool();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!school?._id) {
      setFormError("Please set up your school first.");
      return;
    }

    if (!name.trim() || !teacherId.trim() || !password.trim()) {
      setFormError("Name, Teacher Id, and Password are required.");
      return;
    }

    try {
      await createTeacher.mutateAsync({
        username: name.trim(),
        Id: teacherId.trim(),
        password,
        type: "teacher",
        schoolId: school._id,
        phoneNumber: phoneNumber.trim() || undefined,
        email: email.trim() || undefined,
        gender: gender || undefined,
        gradeLevel: gradeLevel ? Number(gradeLevel) : undefined,
        image: avatarFile,
      });
      onClose();
    } catch (err) {
      setFormError(describeError(err));
    }
  };

  // Treat "school missing" the same whether the backend returned 404 or
  // wrapped it in a 500 — anything other than a present school._id means
  // the admin still needs to create one.
  const needsSchool = !schoolLoading && (schoolError || !school?._id);

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
          Add New Teacher
        </h2>

        {/* Avatar Upload */}
        <div className="mt-6 flex justify-center">
          <div className="relative">
            <div className="h-[120px] w-[120px] sm:h-[150px] sm:w-[150px] overflow-hidden rounded-full border-[3px] border-[#871dad]">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Avatar preview"
                  width={150}
                  height={150}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-100">
                  <span className="text-[40px] text-gray-300">?</span>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-1 right-1 flex h-[28px] w-[28px] cursor-pointer items-center justify-center rounded-full bg-[#871dad] text-white hover:bg-[#751a99] transition-colors"
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

        {needsSchool && <SchoolSetupPanel onCreated={() => refetchSchool()} />}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <fieldset
            disabled={needsSchool}
            className="space-y-5 disabled:opacity-60"
          >
            <div>
              <label className="block text-[15px] sm:text-[18px] font-semibold capitalize text-[#333]">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter teacher name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 h-[48px] sm:h-[56px] w-full rounded-[8px] border border-[#08374d] bg-[#f9f9f9] px-4 sm:px-5 text-[15px] sm:text-[16px] text-[#333] outline-none placeholder:text-[#666]"
              />
            </div>

            <div>
              <label className="block text-[15px] sm:text-[18px] font-semibold capitalize text-[#333]">
                Create Id
              </label>
              <input
                type="text"
                placeholder="Enter teacher Id"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                className="mt-2 h-[48px] sm:h-[56px] w-full rounded-[8px] border border-[#c7c7c7] bg-[#f9f9f9] px-4 sm:px-5 text-[15px] sm:text-[16px] text-[#333] outline-none placeholder:text-[#666]"
              />
            </div>

            <div>
              <label className="block text-[15px] sm:text-[18px] font-semibold capitalize text-[#333]">
                Password
              </label>
              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-[48px] sm:h-[56px] w-full rounded-[8px] border border-[#c7c7c7] bg-[#f9f9f9] px-4 sm:px-5 pr-12 text-[15px] sm:text-[16px] text-[#333] outline-none placeholder:text-[#666]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-[#666] hover:text-[#333] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[15px] sm:text-[18px] font-semibold capitalize text-[#333]">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="teacher@school.io"
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
                  placeholder="+1 555 123 4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-2 h-[48px] sm:h-[56px] w-full rounded-[8px] border border-[#c7c7c7] bg-[#f9f9f9] px-4 sm:px-5 text-[15px] sm:text-[16px] text-[#333] outline-none placeholder:text-[#666]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[15px] sm:text-[18px] font-semibold capitalize text-[#333]">
                  Grade Level
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 8"
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
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
          </fieldset>

          {formError && (
            <p className="text-[14px] text-[#e64540]">{formError}</p>
          )}

          <button
            type="submit"
            disabled={
              createTeacher.isPending ||
              schoolLoading ||
              needsSchool ||
              !school?._id
            }
            className="h-[48px] sm:h-[56px] w-full cursor-pointer rounded-[10px] bg-[#871dad] text-[18px] sm:text-[22px] font-bold uppercase text-white hover:bg-[#751a99] transition-colors disabled:opacity-60"
          >
            {createTeacher.isPending ? "Saving..." : "Save Teacher"}
          </button>
        </form>
      </div>
    </div>
  );
}
