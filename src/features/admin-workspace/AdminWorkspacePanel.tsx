"use client";

import { useState, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCheck,
  ClipboardCheck,
  ClipboardList,
  Megaphone,
  MessageSquare,
  RotateCw,
  Star,
  type LucideIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  attachmentUrl,
  fetchChatRooms,
  roomDetails,
} from "@/features/AdministratorPart/api/chat.api";
import {
  errorMessage,
  fieldClass,
  primaryClass,
  workspaceApi,
  type Result,
  type Submission,
} from "./api";
import QuickActionDialog, {
  actions,
  Field,
  type Action,
} from "./QuickActionDialog";

function Card({
  title,
  children,
  pending,
  error,
  retry,
  icon: Icon,
  count,
  headerAction,
}: {
  title: string;
  children: ReactNode;
  pending?: boolean;
  error?: boolean;
  retry: () => void;
  icon: LucideIcon;
  count?: number;
  headerAction?: ReactNode;
}) {
  return (
    <section className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#e9e7ee] bg-white shadow-[0_2px_8px_rgba(30,20,50,0.03)]">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pb-4 pt-5">
        <div className="flex min-w-0 items-center gap-2.5">
          <Icon
            size={18}
            className="shrink-0 text-[#9a7eab]"
            aria-hidden="true"
          />
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
          {count !== undefined && (
            <span className="rounded-md bg-[#f4f2f7] px-2 py-0.5 text-xs font-medium tabular-nums text-gray-500">
              {count}
            </span>
          )}
        </div>
        {headerAction}
      </div>
      <div className="flex-1 px-5 pb-5">
        {pending ? (
          <p role="status" className="py-8 text-center text-sm text-gray-500">
            Loading…
          </p>
        ) : error ? (
          <p role="alert" className="text-sm text-red-600">
            Unable to load this section.{" "}
            <button onClick={retry} className="underline">
              Retry
            </button>
          </p>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
function EmptyState({
  icon: Icon,
  title,
  description,
  horizontal = false,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  horizontal?: boolean;
}) {
  return (
    <div
      className={
        horizontal
          ? "flex items-center gap-4 rounded-xl bg-[#faf9fc] p-5"
          : "flex min-h-32 flex-col items-center justify-center rounded-xl bg-[#faf9fc] px-4 py-5 text-center"
      }
    >
      <span
        className={
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#ece8f1] bg-white text-[#b6a7c2]" +
          (horizontal ? "" : " mb-3")
        }
      >
        <Icon size={20} aria-hidden="true" />
      </span>
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="mt-1 text-xs leading-5 text-gray-400">{description}</p>
      </div>
    </div>
  );
}
function time(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleString();
}

function ReviewDialog({
  kind,
  id,
  onClose,
}: {
  kind: "submission" | "result";
  id: string;
  onClose: () => void;
}) {
  const record = useQuery({
    queryKey: ["workspace-detail", kind, id],
    queryFn: async () =>
      kind === "submission"
        ? { submission: await workspaceApi.submission(id) }
        : { assessment: await workspaceApi.result(id) },
  });
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-2xl sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {kind === "submission"
              ? "Assignment submission"
              : "Assessment result"}
          </DialogTitle>
          <DialogDescription>
            Review the submitted work before publishing a grade.
          </DialogDescription>
        </DialogHeader>
        {record.isPending && <p role="status">Loading submitted work…</p>}
        {record.isError && (
          <p role="alert">
            {errorMessage(record.error)}{" "}
            <button onClick={() => record.refetch()} className="underline">
              Retry
            </button>
          </p>
        )}
        {record.data && (
          <GradeForm
            submission={record.data.submission}
            assessment={record.data.assessment}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
function GradeForm({
  submission,
  assessment,
  onClose,
}: {
  submission?: Submission;
  assessment?: { result: Result; quiz: { title: string } };
  onClose: () => void;
}) {
  const client = useQueryClient();
  const row = submission || assessment!.result;
  const [score, setScore] = useState(String(row.score ?? 0));
  const [feedback, setFeedback] = useState(row.feedback ?? "");
  const [reason, setReason] = useState("");
  const [publish, setPublish] = useState(
    submission?.status === "released" ||
      assessment?.result.gradeStatus === "released",
  );
  const max =
    submission?.homeworkId?.pointsPossible ??
    assessment?.result.progress.totalQuestions ??
    100;
  const save = useMutation({
    mutationFn: async () => {
      if (submission) {
        if (!submission.homeworkId)
          throw new Error("The assignment is no longer available.");
        await workspaceApi.reviewSubmission(
          submission.homeworkId._id,
          submission._id,
          { score: Number(score), feedback, reason, release: publish },
        );
      } else {
        await workspaceApi.reviewResult(row._id, {
          score: Number(score),
          feedback,
          reason,
        });
        if (publish) await workspaceApi.releaseResult(row._id);
      }
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["workspace-activity"] });
      onClose();
    },
    onError: () => {
      client.invalidateQueries({ queryKey: ["workspace-detail"] });
    },
  });
  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        save.mutate();
      }}
    >
      <div>
        <h3 className="font-semibold">
          {submission?.homeworkId?.title ||
            assessment?.quiz.title ||
            "Assignment unavailable"}
        </h3>
        <p className="text-sm text-gray-500">
          {row.studentId?.username || "Student unavailable"} ·{" "}
          {row.studentId?.Id}
        </p>
      </div>
      {submission && (
        <>
          <p className="whitespace-pre-wrap rounded-xl bg-gray-50 p-4 text-sm">
            {submission.response || "No written response."}
          </p>
          {submission.files?.map((file, index) => {
            const url = attachmentUrl(file.url);
            return url ? (
              <a
                className="block text-sm text-[#871dad] underline"
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {file.filename || `Attachment ${index + 1}`}
              </a>
            ) : null;
          })}
        </>
      )}
      {assessment && (
        <>
          <p className="rounded-xl bg-purple-50 p-3 text-sm text-[#871dad]">
            Automatic score:{" "}
            {assessment.result.answers?.filter(
              (answer) => answer.isCorrect === true,
            ).length ?? row.score}{" "}
            / {max} · {assessment.result.gradeStatus.replaceAll("_", " ")}
          </p>
          {assessment.result.answers?.map((answer, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-100 p-3 text-sm"
            >
              <p className="font-medium">
                {index + 1}. {answer.question}
              </p>
              <p className="mt-1 text-gray-600">
                Selected: {answer.selectedAnswer || "No answer"}
              </p>
              <p
                className={answer.isCorrect ? "text-green-700" : "text-red-600"}
              >
                {answer.isCorrect ? "Correct" : "Incorrect"}
              </p>
            </div>
          ))}
        </>
      )}
      <Field label={`Score (out of ${max})`}>
        <input
          required
          type="number"
          min="0"
          max={max}
          step="any"
          value={score}
          onChange={(event) => setScore(event.target.value)}
          className={fieldClass}
        />
      </Field>
      <Field label="Feedback">
        <textarea
          rows={3}
          maxLength={5000}
          value={feedback}
          onChange={(event) => setFeedback(event.target.value)}
          className={fieldClass}
        />
      </Field>
      <Field label="Reason for changing the score">
        <input
          required={Boolean(assessment && Number(score) !== row.score)}
          minLength={assessment && Number(score) !== row.score ? 3 : undefined}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          className={fieldClass}
        />
      </Field>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={publish}
          onChange={(event) => setPublish(event.target.checked)}
        />
        Publish grade and notify student/parent
      </label>
      {save.isError && (
        <p role="alert" className="text-sm text-red-600">
          {errorMessage(save.error)}
        </p>
      )}
      <button type="submit" disabled={save.isPending} className={primaryClass}>
        {save.isPending
          ? "Saving…"
          : publish
            ? "Review & publish"
            : "Save review"}
      </button>
    </form>
  );
}

export default function AdminWorkspacePanel() {
  const { data: session } = useSession();
  const userId = session?.user.id ?? "";
  const enabled = session?.user.role === "admin";
  const [action, setAction] = useState<Action | null>(null);
  const [detail, setDetail] = useState<{
    kind: "submission" | "result";
    id: string;
  } | null>(null);
  const activity = useQuery({
    queryKey: ["workspace-activity", userId],
    queryFn: workspaceApi.activity,
    enabled,
  });
  const rooms = useQuery({
    queryKey: ["administrator-chat", userId, "rooms"],
    queryFn: fetchChatRooms,
    enabled,
    refetchInterval: 30000,
  });
  if (!enabled) return null;
  const refreshing = activity.isFetching || rooms.isFetching;
  const appearances = {
    behavior: { icon: Star, tone: "bg-amber-50 text-amber-600" },
    message: { icon: MessageSquare, tone: "bg-blue-50 text-blue-600" },
    announcements: { icon: Megaphone, tone: "bg-purple-50 text-[#871dad]" },
  };
  return (
    <div className="space-y-6 pt-3">
      <section className="overflow-hidden rounded-2xl border border-[#e9e7ee] bg-white shadow-[0_2px_8px_rgba(30,20,50,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-5 sm:px-6">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-gray-900">
              Quick actions
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Behavior and communication, one click away.
            </p>
          </div>
          <Link
            href="/admin/teacher-behavior"
            className="inline-flex items-center gap-2 rounded-lg border border-purple-100 bg-purple-50/60 px-3 py-2 text-xs font-semibold text-[#871dad] transition-colors hover:bg-purple-100"
          >
            Teacher behavior reports
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <div className="grid divide-y divide-gray-100 md:grid-cols-3 md:divide-x md:divide-y-0">
          {actions.map((item) => {
            const appearance = appearances[item.id];
            const Icon = appearance.icon;
            return (
              <button
                key={item.id}
                onClick={() => setAction(item.id)}
                className="group flex min-h-28 min-w-0 items-center gap-4 px-5 py-5 text-left transition-colors hover:bg-[#faf8fd] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#871dad] sm:px-6"
              >
                <span
                  className={
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl " +
                    appearance.tone
                  }
                >
                  <Icon size={21} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-gray-800">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-gray-500">
                    {item.description}
                  </span>
                </span>
                <ArrowRight
                  size={17}
                  className="shrink-0 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-[#871dad]"
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>
      </section>
      <section aria-labelledby="recent-activity-title" className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2
              id="recent-activity-title"
              className="text-lg font-semibold tracking-tight text-gray-900"
            >
              Recent activity
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              The latest classroom updates across your schools.
            </p>
          </div>
          <button
            disabled={refreshing}
            onClick={() => {
              activity.refetch();
              rooms.refetch();
            }}
            aria-label="Refresh activity"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:border-purple-200 hover:text-[#871dad] disabled:opacity-50"
          >
            <RotateCw
              size={14}
              className={refreshing ? "motion-safe:animate-spin" : ""}
              aria-hidden="true"
            />
            {refreshing ? "Refreshing?" : "Refresh"}
          </button>
        </div>
        <div className="grid items-stretch gap-4 md:grid-cols-3">
          <Card
            title="Recent Submissions"
            icon={ClipboardList}
            count={activity.data?.submissions.length}
            pending={activity.isPending}
            error={activity.isError}
            retry={() => activity.refetch()}
          >
            {activity.data?.submissions.length ? (
              <ul className="-mx-2 space-y-1">
                {activity.data.submissions.map((row) => (
                  <li key={row._id}>
                    <button
                      onClick={() =>
                        setDetail({ kind: "submission", id: row._id })
                      }
                      className="group w-full rounded-xl p-3 text-left transition-colors hover:bg-gray-50 focus-visible:outline-[#871dad]"
                    >
                      <span className="block truncate text-sm font-medium text-gray-800 group-hover:text-[#871dad]">
                        {row.homeworkId?.title || "Assignment unavailable"}
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        {row.studentId?.username || "Student unavailable"} ?{" "}
                        {row.status}
                      </span>
                      <span className="mt-1 block text-[11px] text-gray-400">
                        {time(row.submittedAt)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={ClipboardList}
                title="No submissions yet"
                description="Submitted assignments will appear here."
              />
            )}
          </Card>
          <Card
            title="Assessments to Review"
            icon={ClipboardCheck}
            count={activity.data?.reviews.length}
            pending={activity.isPending}
            error={activity.isError}
            retry={() => activity.refetch()}
          >
            {activity.data?.reviews.length ? (
              <ul className="-mx-2 space-y-1">
                {activity.data.reviews.map((row) => (
                  <li key={row._id}>
                    <button
                      onClick={() => setDetail({ kind: "result", id: row._id })}
                      className="group w-full rounded-xl p-3 text-left transition-colors hover:bg-gray-50 focus-visible:outline-[#871dad]"
                    >
                      <span className="block truncate text-sm font-medium text-gray-800 group-hover:text-[#871dad]">
                        {row.quizId?.title || "Assessment unavailable"}
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        {row.studentId?.username || "Student unavailable"}
                      </span>
                      <span className="mt-2 inline-block rounded-md bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-700">
                        Pending review
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={ClipboardCheck}
                title="No assessments awaiting review"
                description="Completed assessments will appear here."
              />
            )}
          </Card>
          <Card
            title="Auto-Graded Results"
            icon={CheckCheck}
            count={activity.data?.autoGraded.length}
            pending={activity.isPending}
            error={activity.isError}
            retry={() => activity.refetch()}
          >
            {activity.data?.autoGraded.length ? (
              <ul className="-mx-2 space-y-1">
                {activity.data.autoGraded.map((row) => (
                  <li key={row._id}>
                    <button
                      onClick={() => setDetail({ kind: "result", id: row._id })}
                      className="group flex w-full items-start justify-between gap-3 rounded-xl p-3 text-left transition-colors hover:bg-gray-50 focus-visible:outline-[#871dad]"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-gray-800 group-hover:text-[#871dad]">
                          {row.quizId?.title || "Assessment unavailable"}
                        </span>
                        <span className="mt-1 block text-xs text-gray-500">
                          {row.studentId?.username || "Student unavailable"}
                        </span>
                        <span className="mt-1 block text-[11px] text-gray-400">
                          {row.gradeStatus.replaceAll("_", " ")}
                        </span>
                      </span>
                      <span className="shrink-0 rounded-lg bg-purple-50 px-2 py-1 text-xs font-semibold tabular-nums text-[#871dad]">
                        {row.autoScore ?? row.score}/
                        {row.progress.totalQuestions}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={CheckCheck}
                title="No automatic results yet"
                description="Automatically scored results will appear here."
              />
            )}
          </Card>
        </div>
        <Card
          title="Recent Messages"
          icon={MessageSquare}
          pending={rooms.isPending}
          error={rooms.isError}
          retry={() => rooms.refetch()}
          headerAction={
            <Link
              href="/admin/chat"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#871dad] hover:underline"
            >
              Open inbox
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          }
        >
          {rooms.data?.length ? (
            <ul className="-mx-2 grid gap-x-5 gap-y-1 lg:grid-cols-2">
              {rooms.data.slice(0, 5).map((room) => (
                <li key={room._id}>
                  <Link
                    href={"/admin/chat?room=" + encodeURIComponent(room._id)}
                    className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-gray-50"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                      <MessageSquare size={17} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-gray-800">
                        {roomDetails(room, userId).name}
                      </span>
                      <span className="mt-1 block truncate text-xs text-gray-500">
                        {room.lastMessageId?.isDeleted
                          ? "Message deleted"
                          : room.lastMessageId?.message ||
                            room.lastMessage ||
                            "No messages yet"}
                      </span>
                    </span>
                    <ArrowRight
                      size={15}
                      className="shrink-0 text-gray-300"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={MessageSquare}
              title="No recent messages"
              description="Your conversations with the community will appear here."
              horizontal
            />
          )}
        </Card>
      </section>
      {action && (
        <QuickActionDialog
          key={action}
          action={action}
          onClose={() => setAction(null)}
        />
      )}
      {detail && <ReviewDialog {...detail} onClose={() => setDetail(null)} />}
    </div>
  );
}
