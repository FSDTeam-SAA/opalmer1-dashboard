"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useCreateSchool } from "../hooks/useSchools";

type CreateSchoolModalProps = {
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
      maybe.response?.data?.message ??
      maybe.message ??
      "Failed to create school"
    );
  }
  return "Failed to create school";
}

export default function CreateSchoolModal({ onClose }: CreateSchoolModalProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [establishedYear, setEstablishedYear] = useState("");
  const [logo, setLogo] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const createSchool = useCreateSchool();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError("School name is required.");
      return;
    }

    try {
      await createSchool.mutateAsync({
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
        logo: logo.trim() || undefined,
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

        <h2 className="text-[28px] font-bold text-[#333]">Create School</h2>

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

          <input
            type="url"
            placeholder="Logo URL"
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
            className="h-[48px] w-full rounded-[8px] border border-[#c7c7c7] bg-[#f9f9f9] px-4 outline-none"
          />

          {formError && (
            <p className="text-[14px] text-[#e64540]">{formError}</p>
          )}

          <button
            type="submit"
            disabled={createSchool.isPending}
            className="h-[52px] w-full rounded-[10px] bg-[#871dad] text-[18px] font-bold uppercase text-white hover:bg-[#751a99] disabled:opacity-60"
          >
            {createSchool.isPending ? "Creating..." : "Create School"}
          </button>
        </form>
      </div>
    </div>
  );
}
