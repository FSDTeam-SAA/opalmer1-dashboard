"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Camera, Eye, EyeOff, X } from "lucide-react";
import { Admin } from "./Administration";
import { useUpdateAdministrator } from "../hooks/useAdministrators";
import { useSchools } from "../../School/hooks/useSchools";

export default function EditAdminModal({
  admin,
  onClose,
}: {
  admin: Admin;
  onClose: () => void;
}) {
  const [name, setName] = useState(admin.username);
  const [adminId, setAdminId] = useState(admin.Id ?? "");
  const [schoolId, setSchoolId] = useState(
    typeof admin.schoolId === "string"
      ? admin.schoolId
      : (admin.schoolId?._id ?? ""),
  );
  const [phone, setPhone] = useState(admin.phoneNumber ?? "");
  const [email, setEmail] = useState(admin.email ?? "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    admin.avatar?.url ?? null,
  );
  const [formError, setFormError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateAdmin = useUpdateAdministrator();
  const { data: schools = [], isLoading: schoolsLoading } = useSchools();
  const availableSchools = schools.filter(
    (school) => !school.administrator || school._id === schoolId,
  );

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

    if (!name.trim() || !adminId.trim()) {
      setFormError("Name and Admin Id are required.");
      return;
    }

    try {
      await updateAdmin.mutateAsync({
        id: admin._id,
        payload: {
          username: name.trim(),
          Id: adminId.trim(),
          schoolId,
          phoneNumber: phone.trim() || undefined,
          email: email.trim() || undefined,
          password: password.trim() || undefined,
          image: avatarFile,
        },
      });
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update administrator";
      setFormError(message);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(18,18,18,0.4)]"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-[629px] overflow-y-auto rounded-[30px] bg-white px-[72px] py-[50px]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-6 top-6 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#666] hover:bg-gray-100 transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-center text-[32px] font-bold text-[#333]">
          Edit Administrator
        </h2>

        {/* Avatar Upload */}
        <div className="mt-8 flex justify-center">
          <div className="relative">
            <div className="h-[150px] w-[150px] overflow-hidden rounded-full border-[3px] border-[#871dad]">
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

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div>
            <label className="block text-[18px] font-semibold capitalize text-[#333]">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter administrator name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 h-[56px] w-full rounded-[8px] border border-[#08374d] bg-[#f9f9f9] px-5 text-[16px] text-[#333] outline-none placeholder:text-[#666]"
            />
          </div>

          <div>
            <label className="block text-[18px] font-semibold capitalize text-[#333]">
              Admin Id
            </label>
            <input
              type="text"
              placeholder="Enter admin Id"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              className="mt-2 h-[56px] w-full rounded-[8px] border border-[#c7c7c7] bg-[#f9f9f9] px-5 text-[16px] text-[#333] outline-none placeholder:text-[#666]"
            />
          </div>

          <div>
            <label className="block text-[18px] font-semibold capitalize text-[#333]">
              School
            </label>
            <select
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              disabled={schoolsLoading}
              className="mt-2 h-[56px] w-full rounded-[8px] border border-[#c7c7c7] bg-[#f9f9f9] px-5 text-[16px] text-[#333] outline-none disabled:opacity-60"
            >
              <option value="">
                {schoolsLoading ? "Loading schools..." : "No school assigned"}
              </option>
              {availableSchools.map((school) => (
                <option key={school._id} value={school._id}>
                  {school.name}
                  {school.code ? ` (${school.code})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[18px] font-semibold capitalize text-[#333]">
              Phone Number
            </label>
            <input
              type="text"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-2 h-[56px] w-full rounded-[8px] border border-[#c7c7c7] bg-[#f9f9f9] px-5 text-[16px] text-[#333] outline-none placeholder:text-[#666]"
            />
          </div>

          <div>
            <label className="block text-[18px] font-semibold capitalize text-[#333]">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 h-[56px] w-full rounded-[8px] border border-[#c7c7c7] bg-[#f9f9f9] px-5 text-[16px] text-[#333] outline-none placeholder:text-[#666]"
            />
          </div>

          <div>
            <label className="block text-[18px] font-semibold capitalize text-[#333]">
              New Password
            </label>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Leave blank to keep current password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-[56px] w-full rounded-[8px] border border-[#c7c7c7] bg-[#f9f9f9] px-5 pr-12 text-[16px] text-[#333] outline-none placeholder:text-[#666]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-[#666] hover:text-[#333] transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {formError && (
            <p className="text-[14px] text-[#e64540]">{formError}</p>
          )}

          <button
            type="submit"
            disabled={updateAdmin.isPending}
            className="h-[56px] w-full cursor-pointer rounded-[10px] bg-[#871dad] text-[22px] font-bold uppercase text-white hover:bg-[#751a99] transition-colors disabled:opacity-60"
          >
            {updateAdmin.isPending ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </div>
  );
}
