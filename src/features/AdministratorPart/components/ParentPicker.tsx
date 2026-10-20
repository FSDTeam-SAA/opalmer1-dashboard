"use client";

import { useId, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { useParents } from "../hooks/useParents";
import type { ParentRow } from "../api/parents.api";

export default function ParentPicker({
  value,
  onChange,
  disabled = false,
}: {
  value: ParentRow | null;
  onChange: (parent: ParentRow | null) => void;
  disabled?: boolean;
}) {
  const { data: parents = [], isLoading, isError, refetch } = useParents();
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(-1);
  const filtered = parents.filter((parent) =>
    [parent.name, parent.parentId, parent.email].some((text) =>
      text.toLowerCase().includes(query.trim().toLowerCase()),
    ),
  );
  const eligible = (parent: ParentRow) =>
    parent.active && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parent.email);

  function select(parent: ParentRow) {
    if (!eligible(parent)) return;
    onChange(parent);
    setQuery("");
    setOpen(false);
    setHighlighted(-1);
  }

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-[#333]">
        Parent
      </label>
      <div className="relative">
        <input
          ref={input}
          id={id}
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={`${id}-options`}
          aria-activedescendant={
            open && highlighted >= 0 ? `${id}-option-${highlighted}` : undefined
          }
          disabled={disabled || isLoading}
          value={value ? `${value.name} — ${value.email}` : query}
          placeholder={
            isLoading
              ? "Loading parents..."
              : "Search parents by name, ID or email"
          }
          onFocus={() => setOpen(true)}
          onBlur={(event) => {
            if (
              !event.currentTarget.parentElement?.contains(event.relatedTarget)
            )
              setOpen(false);
          }}
          onChange={(event) => {
            onChange(null);
            setQuery(event.target.value);
            setOpen(true);
            setHighlighted(-1);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape" && open) {
              event.preventDefault();
              event.stopPropagation();
              setOpen(false);
            } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              setOpen(true);
              const direction = event.key === "ArrowDown" ? 1 : -1;
              let next = highlighted < 0 && direction === -1 ? 0 : highlighted;
              for (let count = 0; count < filtered.length; count++) {
                next = (next + direction + filtered.length) % filtered.length;
                if (eligible(filtered[next])) {
                  setHighlighted(next);
                  document
                    .getElementById(`${id}-option-${next}`)
                    ?.scrollIntoView?.({ block: "nearest" });
                  break;
                }
              }
            } else if (event.key === "Enter" && open) {
              event.preventDefault();
              const parent = filtered[highlighted] ?? filtered.find(eligible);
              if (parent) select(parent);
            }
          }}
          className="h-[42px] w-full rounded-lg border border-gray-300 bg-[#faf9fc] px-3 pr-10 text-sm outline-none focus:border-[#871dad] focus:ring-2 focus:ring-purple-100 disabled:opacity-60"
        />
        <button
          type="button"
          aria-label={open ? "Close parent list" : "Show all parents"}
          disabled={disabled || isLoading}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            if (open) setOpen(false);
            else {
              input.current?.focus();
              setOpen(true);
            }
          }}
          className="absolute right-0 top-0 flex h-[42px] w-10 items-center justify-center text-gray-500 disabled:opacity-50"
        >
          <ChevronDown size={18} aria-hidden="true" />
        </button>
        {open && !disabled && (
          <div className="relative z-50 mt-2 w-full overflow-hidden rounded-xl border border-purple-100 bg-white shadow-xl">
            <ul
              id={`${id}-options`}
              role="listbox"
              aria-label="Parents"
              className="max-h-56 overflow-y-auto p-1"
            >
              {filtered.map((parent, index) => (
                <li key={parent._id} role="presentation">
                  <button
                    id={`${id}-option-${index}`}
                    type="button"
                    role="option"
                    aria-selected={value?._id === parent._id}
                    disabled={!eligible(parent)}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => select(parent)}
                    className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-50 ${highlighted === index ? "bg-purple-50" : ""}`}
                  >
                    <span className="block font-medium text-gray-900">
                      {parent.name}
                    </span>
                    <span className="block break-words text-xs text-gray-500">
                      {parent.parentId} ·{" "}
                      {parent.email === "—" || !parent.email
                        ? "No email added"
                        : parent.email}
                      {!parent.active ? " · Inactive" : ""}
                    </span>
                  </button>
                </li>
              ))}
              {!isError && filtered.length === 0 && (
                <li
                  role="presentation"
                  className="flex items-center gap-2 px-3 py-4 text-sm text-gray-500"
                >
                  <Search size={16} aria-hidden="true" />
                  {parents.length
                    ? "No matching parents found."
                    : "No parents found. Add a parent first."}
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
      {isError ? (
        <p role="alert" className="text-sm text-red-600">
          Unable to load parents.{" "}
          <button
            type="button"
            onClick={() => void refetch()}
            className="underline"
          >
            Retry
          </button>
        </p>
      ) : (
        <p className="text-xs text-gray-500">
          {value
            ? `Invitation will be emailed to ${value.email}.`
            : "Select a parent to email the invitation. Parents need an email and an active account."}
        </p>
      )}
    </div>
  );
}
