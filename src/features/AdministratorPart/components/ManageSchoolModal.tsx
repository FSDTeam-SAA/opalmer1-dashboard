"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon, Upload, X } from "lucide-react";
import { useUpdateSchool } from "../hooks/useSchool";
import type { School } from "../types/school.types";

type ManageSchoolModalProps = {
  school: School;
  onClose: () => void;
};

function describeError(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null) {
    const maybe = err as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    return maybe.response?.data?.message ?? maybe.message ?? "Update failed";
  }
  return "Update failed";
}

export default function ManageSchoolModal({
  school,
  onClose,
}: ManageSchoolModalProps) {
  const [name, setName] = useState(school.name ?? "");
  const [code, setCode] = useState(school.code ?? "");
  const [email, setEmail] = useState(school.email ?? "");
  const [phone, setPhone] = useState(school.phone ?? "");
  const [address, setAddress] = useState(school.address ?? "");
  const [city, setCity] = useState(school.city ?? "");
  const [state, setState] = useState(school.state ?? "");
  const [country, setCountry] = useState(school.country ?? "");
  const [postalCode, setPostalCode] = useState(school.postalCode ?? "");
  const [establishedYear, setEstablishedYear] = useState(
    school.establishedYear ? String(school.establishedYear) : "",
  );
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState(school.logo ?? "");
  const [formError, setFormError] = useState<string | null>(null);

  const updateSchool = useUpdateSchool();

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLogoFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError("School name is required.");
      return;
    }

    try {
      await updateSchool.mutateAsync({
        id: school._id,
        payload: {
          name: name.trim(),
          code: code.trim() || undefined,
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          address: address.trim() || undefined,
          city: city.trim() || undefined,
          state: state.trim() || undefined,
          country: country.trim() || undefined,
          postalCode: postalCode.trim() || undefined,
          establishedYear: establishedYear
            ? Number(establishedYear)
            : undefined,
          logo: logoFile || undefined,
        },
      });
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
        className="relative max-h-[90vh] w-full max-w-[720px] overflow-y-auto rounded-[20px] bg-white px-8 py-8"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-[#666] hover:bg-gray-100"
        >
          <X size={20} />
        </button>

        <h2 className="text-[28px] font-bold text-[#333]">Manage School</h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="School name *"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-[48px] rounded-[8px] border border-[#c7c7c7] bg-[#f9f9f9] px-4 outline-none"
            />
            <input
              type="text"
              placeholder="School code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              className="h-[48px] rounded-[8px] border border-[#c7c7c7] bg-[#f9f9f9] px-4 outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-[48px] rounded-[8px] border border-[#c7c7c7] bg-[#f9f9f9] px-4 outline-none"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="h-[48px] rounded-[8px] border border-[#c7c7c7] bg-[#f9f9f9] px-4 outline-none"
            />
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className="h-[48px] rounded-[8px] border border-[#c7c7c7] bg-[#f9f9f9] px-4 outline-none"
            />
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="h-[48px] rounded-[8px] border border-[#c7c7c7] bg-[#f9f9f9] px-4 outline-none"
            />
            <input
              type="text"
              placeholder="State"
              value={state}
              onChange={(event) => setState(event.target.value)}
              className="h-[48px] rounded-[8px] border border-[#c7c7c7] bg-[#f9f9f9] px-4 outline-none"
            />
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              className="h-[48px] rounded-[8px] border border-[#c7c7c7] bg-[#f9f9f9] px-4 outline-none"
            />
            <input
              type="text"
              placeholder="Postal code"
              value={postalCode}
              onChange={(event) => setPostalCode(event.target.value)}
              className="h-[48px] rounded-[8px] border border-[#c7c7c7] bg-[#f9f9f9] px-4 outline-none"
            />
            <input
              type="number"
              placeholder="Established year"
              value={establishedYear}
              onChange={(event) => setEstablishedYear(event.target.value)}
              className="h-[48px] rounded-[8px] border border-[#c7c7c7] bg-[#f9f9f9] px-4 outline-none"
            />
          </div>

          <label
            htmlFor="school-logo"
            className="flex cursor-pointer items-center gap-4 rounded-[12px] border border-dashed border-[#c7c7c7] bg-[#f9f9f9] p-4"
          >
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-white">
              {logoPreview ? (
                <Image
                  src={logoPreview}
                  alt="School logo preview"
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImageIcon size={24} className="text-[#871dad]" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 text-[15px] font-semibold text-[#333]">
                <Upload size={16} />
                Upload school logo
              </div>
              <p className="mt-1 text-[13px] text-[#666]">
                PNG or JPG files work best.
              </p>
            </div>
            <input
              id="school-logo"
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
          </label>

          {formError && (
            <p className="rounded-[8px] bg-red-50 px-4 py-3 text-[14px] text-red-600">
              {formError}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[10px] border border-gray-300 px-6 py-3 text-[15px] font-semibold text-[#333] hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateSchool.isPending}
              className="rounded-[10px] bg-[#871dad] px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#751a99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updateSchool.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
