"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon, Upload, X } from "lucide-react";
import { useCreateSchool, useUpdateSchool } from "../hooks/useSchools";
import type { School } from "../types/school.types";

type CreateSchoolModalProps = {
  onClose: () => void;
  school?: School;
};

function describeError(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null) {
    const maybe = err as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    return (
      maybe.response?.data?.message ??
      maybe.message ??
      "Failed to create school"
    );
  }
  return "Failed to create school";
}

export default function CreateSchoolModal({
  onClose,
  school,
}: CreateSchoolModalProps) {
  const isEditing = Boolean(school);
  const [name, setName] = useState(school?.name ?? "");
  const [code, setCode] = useState(school?.code ?? "");
  const [email, setEmail] = useState(school?.email ?? "");
  const [phone, setPhone] = useState(school?.phone ?? "");
  const [address, setAddress] = useState(school?.address ?? "");
  const [city, setCity] = useState(school?.city ?? "");
  const [state, setState] = useState(school?.state ?? "");
  const [country, setCountry] = useState(school?.country ?? "");
  const [postalCode, setPostalCode] = useState(school?.postalCode ?? "");
  const [establishedYear, setEstablishedYear] = useState(
    school?.establishedYear ? String(school.establishedYear) : "",
  );
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState(school?.logo ?? "");
  const [formError, setFormError] = useState<string | null>(null);

  const createSchool = useCreateSchool();
  const updateSchool = useUpdateSchool();
  const isSaving = createSchool.isPending || updateSchool.isPending;

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError("School name is required.");
      return;
    }

    try {
      const payload = {
        name: name.trim(),
        code: code.trim() || undefined,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
        city: city.trim() || undefined,
        state: state.trim() || undefined,
        country: country.trim() || undefined,
        postalCode: postalCode.trim() || undefined,
        establishedYear: establishedYear ? Number(establishedYear) : undefined,
        logo: logoFile || undefined,
      };

      if (school) {
        await updateSchool.mutateAsync({ id: school._id, payload });
      } else {
        await createSchool.mutateAsync(payload);
      }

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
        className="relative w-full max-w-[720px] max-h-[90vh] overflow-y-auto rounded-[20px] bg-white px-8 py-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-[#666] hover:bg-gray-100"
        >
          <X size={20} />
        </button>

        <h2 className="text-[28px] font-bold text-[#333]">
          {isEditing ? "Edit School" : "Create School"}
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="School name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-[48px] rounded-[8px] border border-[#c7c7c7] bg-[#f9f9f9] px-4 outline-none"
            />
            <input
              type="text"
              placeholder="School code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="h-[48px] rounded-[8px] border border-[#c7c7c7] bg-[#f9f9f9] px-4 outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-[48px] rounded-[8px] border border-[#c7c7c7] bg-[#f9f9f9] px-4 outline-none"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-[48px] rounded-[8px] border border-[#c7c7c7] bg-[#f9f9f9] px-4 outline-none"
            />
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="h-[48px] rounded-[8px] border border-[#c7c7c7] bg-[#f9f9f9] px-4 outline-none"
            />
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="h-[48px] rounded-[8px] border border-[#c7c7c7] bg-[#f9f9f9] px-4 outline-none"
            />
            <input
              type="text"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="h-[48px] rounded-[8px] border border-[#c7c7c7] bg-[#f9f9f9] px-4 outline-none"
            />
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="h-[48px] rounded-[8px] border border-[#c7c7c7] bg-[#f9f9f9] px-4 outline-none"
            />
            <input
              type="text"
              placeholder="Postal code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="h-[48px] rounded-[8px] border border-[#c7c7c7] bg-[#f9f9f9] px-4 outline-none"
            />
            <input
              type="number"
              min="1800"
              placeholder="Established year"
              value={establishedYear}
              onChange={(e) => setEstablishedYear(e.target.value)}
              className="h-[48px] rounded-[8px] border border-[#c7c7c7] bg-[#f9f9f9] px-4 outline-none"
            />
          </div>

          <div className="rounded-[10px] border border-dashed border-[#c7c7c7] bg-[#f9f9f9] p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#ddd] bg-white">
                {logoPreview ? (
                  <Image
                    src={logoPreview}
                    alt="School logo preview"
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageIcon size={28} className="text-[#871dad]" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold text-[#333]">
                  School logo
                </p>
                <p className="mt-1 truncate text-[13px] text-[#666]">
                  {logoFile?.name ||
                    (logoPreview
                      ? "Current logo will be kept."
                      : "Upload a JPG or PNG image.")}
                </p>
              </div>

              <label
                htmlFor="school-logo"
                className="inline-flex h-[44px] cursor-pointer items-center justify-center gap-2 rounded-[8px] bg-[#871dad] px-4 text-[14px] font-semibold text-white hover:bg-[#751a99]"
              >
                <Upload size={16} />
                Choose Image
              </label>
              <input
                id="school-logo"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleLogoChange}
                className="sr-only"
              />
            </div>
          </div>

          {formError && (
            <p className="text-[14px] text-[#e64540]">{formError}</p>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="h-[52px] w-full rounded-[10px] bg-[#871dad] text-[18px] font-bold uppercase text-white hover:bg-[#751a99] disabled:opacity-60"
          >
            {isSaving
              ? isEditing
                ? "Saving..."
                : "Creating..."
              : isEditing
                ? "Save Changes"
                : "Create School"}
          </button>
        </form>
      </div>
    </div>
  );
}
