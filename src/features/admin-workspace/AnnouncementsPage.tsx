"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import PageHeader from "@/components/sheard/PageHeader";
import { errorMessage, primaryClass, workspaceApi } from "./api";
import QuickActionDialog from "./QuickActionDialog";

export default function AnnouncementsPage() {
  const [create, setCreate] = useState(false);
  const client = useQueryClient();
  const history = useQuery({
    queryKey: ["workspace-announcements"],
    queryFn: workspaceApi.announcements,
  });
  const retry = useMutation({
    mutationFn: workspaceApi.retryAnnouncement,
    onSuccess: (receipt) => {
      client.invalidateQueries({ queryKey: ["workspace-announcements"] });
      if (receipt.notificationWarning)
        toast.warning(receipt.notificationWarning);
      else toast.success("Notifications sent");
    },
  });
  return (
    <div className="space-y-5 pt-5">
      <PageHeader title="Announcements" />
      <section className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Announcement history</h2>
            <p className="mt-1 text-sm text-gray-500">
              Audience selection and notification delivery for your
              announcements.
            </p>
          </div>
          <button onClick={() => setCreate(true)} className={primaryClass}>
            Send Announcement
          </button>
        </div>
        {history.isPending && <p role="status">Loading announcements…</p>}
        {history.isError && (
          <p role="alert">
            {errorMessage(history.error)}{" "}
            <button onClick={() => history.refetch()} className="underline">
              Retry
            </button>
          </p>
        )}
        {history.data?.length === 0 && (
          <p className="text-sm text-gray-500">No announcements sent yet.</p>
        )}
        {history.data?.map((row) => (
          <article
            className="space-y-3 rounded-xl border border-gray-100 p-5"
            key={row._id}
          >
            <div className="flex justify-between gap-4">
              <h3 className="font-semibold">{row.title}</h3>
              <span className="text-xs capitalize text-gray-500">
                {row.deliveryStatus}
              </span>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
              {row.message}
            </p>
            <p className="text-xs capitalize text-[#871dad]">
              {row.audiences.join(", ")} · {row.recipientCount} intended
              recipients
            </p>
            <p className="text-xs text-gray-400">
              {new Date(row.createdAt).toLocaleString()}
            </p>
            {row.deliveryStatus !== "sent" && (
              <button
                disabled={retry.isPending}
                onClick={() => retry.mutate(row._id)}
                className="text-sm font-semibold text-[#871dad]"
              >
                {retry.isPending ? "Retrying…" : "Retry notifications"}
              </button>
            )}
          </article>
        ))}
        {retry.isError && (
          <p role="alert" className="text-sm text-red-600">
            {errorMessage(retry.error)}
          </p>
        )}
      </section>
      {create && (
        <QuickActionDialog
          action="announcements"
          onClose={() => setCreate(false)}
        />
      )}
    </div>
  );
}
