"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { sendChatMessage } from "@/features/AdministratorPart/api/chat.api";
import {
  classLabel,
  errorMessage,
  fieldClass,
  primaryClass,
  workspaceApi,
  type Person,
  type Receipt,
} from "./api";

export const actions = [
  {
    id: "behavior",
    title: "Add Behavior",
    description: "Record a student behavior note.",
  },
  {
    id: "message",
    title: "Send Message",
    description: "Contact a user from any school or role.",
  },
  {
    id: "announcements",
    title: "Send Announcement",
    description: "Choose parents, students or teachers.",
  },
] as const;
export type Action = (typeof actions)[number]["id"];
export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      {children}
    </label>
  );
}
function DirectoryPicker({
  value,
  onChange,
}: {
  value: Person | null;
  onChange: (value: Person) => void;
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const users = useQuery({
    queryKey: ["workspace-directory", search, page],
    queryFn: () => workspaceApi.directory(search, page),
  });
  return (
    <div className="space-y-3">
      <Field label="Find user">
        <input
          className={fieldClass}
          placeholder="Search name, ID or email"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
      </Field>
      {value && (
        <p className="rounded-lg bg-purple-50 p-3 text-sm text-[#871dad]">
          Selected: {value.username} · {value.Id}
        </p>
      )}
      {users.isPending && <p role="status">Loading users…</p>}
      {users.isError && (
        <p role="alert">
          Unable to load users.{" "}
          <button
            type="button"
            onClick={() => users.refetch()}
            className="underline"
          >
            Retry
          </button>
        </p>
      )}
      <div className="max-h-48 space-y-1 overflow-y-auto rounded-xl border border-gray-100 p-2">
        {users.data?.data.map((user) => (
          <button
            type="button"
            aria-pressed={user._id === value?._id}
            key={user._id}
            onClick={() => onChange(user)}
            className={`flex w-full justify-between gap-3 rounded-lg p-3 text-left text-sm ${value?._id === user._id ? "bg-purple-50 text-[#871dad]" : "hover:bg-gray-50"}`}
          >
            <span>
              {user.username}
              <span className="block text-xs text-gray-500">{user.Id}</span>
            </span>
            <span className="capitalize">{user.type || user.role}</span>
          </button>
        ))}
        {users.data?.data.length === 0 && (
          <p className="p-3 text-sm text-gray-500">No users found.</p>
        )}
      </div>
      {users.data && users.data.meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <span>
            Page {page} of {users.data.meta.totalPages}
          </span>
          <button
            type="button"
            disabled={page >= users.data.meta.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default function QuickActionDialog({
  action,
  onClose,
}: {
  action: Action;
  onClose: () => void;
}) {
  const { data: session } = useSession();
  const client = useQueryClient();
  const [classId, setClassId] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [notifyParent, setNotifyParent] = useState(true);
  const [audiences, setAudiences] = useState<string[]>([]);
  const [recipient, setRecipient] = useState<Person | null>(null);
  const [studentId, setStudentId] = useState("");
  const [behavior, setBehavior] = useState("neutral");
  const classes = useQuery({
    queryKey: ["workspace-classes"],
    queryFn: workspaceApi.classes,
    enabled: action === "behavior",
  });
  const roster = useQuery({
    queryKey: ["workspace-roster", classId],
    queryFn: () => workspaceApi.roster(classId),
    enabled: Boolean(classId) && action === "behavior",
  });
  const info = actions.find((item) => item.id === action)!;
  const save = useMutation({
    mutationFn: async (): Promise<Receipt> => {
      if (action === "behavior") {
        if (!classId || !studentId)
          throw new Error("Choose a class and an enrolled student.");
        return workspaceApi.save(action, {
          classId,
          studentId,
          message: message.trim(),
          state: behavior,
          parentVisible: notifyParent,
        });
      }
      if (action === "announcements") {
        if (!audiences.length) throw new Error("Select at least one audience.");
        return workspaceApi.save(action, {
          title: title.trim(),
          message: message.trim(),
          audiences,
        });
      }
      if (!recipient || !session?.user.id)
        throw new Error("Select a recipient.");
      const { data } = await api.post<{ data: { _id: string } }>("/rooms", {
        participants: [session.user.id, recipient._id],
      });
      const sent = await sendChatMessage(data.data._id, message.trim());
      return { notificationWarning: sent.notificationWarning };
    },
    onSuccess: (result) => {
      client.invalidateQueries({ queryKey: ["workspace-activity"] });
      client.invalidateQueries({ queryKey: ["workspace-announcements"] });
      client.invalidateQueries({ queryKey: ["administrator-chat"] });
      if (result.notificationWarning) toast.warning(result.notificationWarning);
      else
        toast.success(
          action === "behavior" ? "Saved successfully" : "Sent successfully",
        );
      onClose();
    },
  });
  function submit(event: FormEvent) {
    event.preventDefault();
    save.mutate();
  }
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !save.isPending) onClose();
      }}
    >
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-2xl sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{info.title}</DialogTitle>
          <DialogDescription>{info.description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-5">
          <fieldset disabled={save.isPending} className="space-y-5">
            {action === "behavior" && (
              <>
                <Field label="Class">
                  <select
                    required
                    value={classId}
                    onChange={(event) => {
                      setClassId(event.target.value);
                      setStudentId("");
                    }}
                    className={fieldClass}
                  >
                    <option value="">
                      {classes.isPending
                        ? "Loading classes?"
                        : "Choose a class"}
                    </option>
                    {classes.data?.map((row) => (
                      <option key={row._id} value={row._id}>
                        {classLabel(row)}
                      </option>
                    ))}
                  </select>
                </Field>
                {classes.isError && (
                  <p role="alert" className="text-sm text-red-600">
                    Unable to load classes.{" "}
                    <button
                      type="button"
                      onClick={() => classes.refetch()}
                      className="underline"
                    >
                      Retry
                    </button>
                  </p>
                )}
                {classes.data?.length === 0 && (
                  <p className="text-sm text-gray-500">No classes available.</p>
                )}
                <Field label="Student">
                  <select
                    required
                    value={studentId}
                    onChange={(event) => setStudentId(event.target.value)}
                    className={fieldClass}
                  >
                    <option value="">Choose an enrolled student</option>
                    {roster.data?.students.map((student) => (
                      <option key={student._id} value={student._id}>
                        {student.username} ? {student.Id}
                      </option>
                    ))}
                  </select>
                </Field>
                {classId && roster.isPending && (
                  <p role="status">Loading students?</p>
                )}
                {roster.isError && (
                  <p role="alert" className="text-sm text-red-600">
                    Unable to load students.{" "}
                    <button
                      type="button"
                      onClick={() => roster.refetch()}
                      className="underline"
                    >
                      Retry
                    </button>
                  </p>
                )}
                {roster.data?.students.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No students are enrolled in this class.
                  </p>
                )}
                <Field label="Behavior type">
                  <select
                    value={behavior}
                    onChange={(event) => setBehavior(event.target.value)}
                    className={fieldClass}
                  >
                    {["positive", "neutral", "corrective", "negative"].map(
                      (value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ),
                    )}
                  </select>
                </Field>
              </>
            )}
            {action === "announcements" && (
              <Field label="Title">
                <input
                  required
                  maxLength={200}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className={fieldClass}
                  placeholder="Enter a title"
                />
              </Field>
            )}
            {action === "message" && (
              <DirectoryPicker value={recipient} onChange={setRecipient} />
            )}
            <Field label="Message">
              <textarea
                required
                maxLength={10000}
                rows={4}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className={fieldClass}
                placeholder="Write your message"
              />
            </Field>
            {action === "announcements" && (
              <fieldset className="space-y-3 rounded-xl border border-purple-100 bg-purple-50/50 p-4">
                <legend className="px-1 text-sm font-semibold">
                  Who should receive this announcement?
                </legend>
                <div className="flex flex-wrap gap-5">
                  {["parent", "student", "teacher"].map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-[#871dad]"
                        checked={audiences.includes(type)}
                        onChange={(event) =>
                          setAudiences(
                            event.target.checked
                              ? [...audiences, type]
                              : audiences.filter((value) => value !== type),
                          )
                        }
                      />
                      {type[0].toUpperCase() + type.slice(1)}s
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  Only active users in the selected audiences receive a
                  notification.
                </p>
                <Link
                  href="/admin/announcements"
                  className="inline-block text-sm font-medium text-[#871dad] underline"
                >
                  Announcement history
                </Link>
              </fieldset>
            )}
            {action === "behavior" && (
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={notifyParent}
                  onChange={(event) => setNotifyParent(event.target.checked)}
                />
                Visible to the student?s parent
              </label>
            )}
          </fieldset>
          {save.isError && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
            >
              {errorMessage(save.error)}
            </p>
          )}
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <button
              type="button"
              disabled={save.isPending}
              onClick={onClose}
              className="rounded-xl border px-4 py-3 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={primaryClass}
              disabled={
                save.isPending ||
                (action === "behavior" &&
                  (!classId ||
                    !studentId ||
                    classes.isError ||
                    roster.isError)) ||
                (action === "announcements" && !audiences.length) ||
                (action === "message" && !recipient)
              }
            >
              {save.isPending
                ? "Saving?"
                : action === "behavior"
                  ? "Save"
                  : "Send"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
