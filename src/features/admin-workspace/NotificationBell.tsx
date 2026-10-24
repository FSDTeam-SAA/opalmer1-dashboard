"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeft, Bell } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { errorMessage, primaryClass, workspaceApi, type Notice } from "./api";

type Destination = Awaited<ReturnType<typeof workspaceApi.openNotice>>;
function dateLabel(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleString();
}

export default function NotificationBell() {
  const { data: session } = useSession();
  const userId = session?.user.id ?? "";
  const enabled = session?.user.role === "admin" && Boolean(userId);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<{
    item: Notice;
    destination: Destination;
  } | null>(null);
  const client = useQueryClient();
  const notices = useQuery({
    queryKey: ["workspace-notices", userId],
    queryFn: () => workspaceApi.notices(userId),
    enabled,
    refetchInterval: 30000,
  });
  const unread = notices.data?.filter((item) => !item.isViewed).length ?? 0;
  const showNotice = useMutation({
    mutationFn: async (item: Notice) => ({
      item,
      destination: await workspaceApi.openNotice(item._id),
    }),
    onSuccess: (result) => {
      setSelected(result);
      client.setQueryData<Notice[]>(["workspace-notices", userId], (previous) =>
        previous?.map((item) =>
          item._id === result.item._id ? { ...item, isViewed: true } : item,
        ),
      );
      client.invalidateQueries({ queryKey: ["workspace-notices", userId] });
    },
  });
  const markAll = useMutation({
    mutationFn: () => workspaceApi.markNoticesRead(userId),
    onSuccess: () => {
      client.setQueryData<Notice[]>(["workspace-notices", userId], (previous) =>
        previous?.map((item) => ({ ...item, isViewed: true })),
      );
      client.invalidateQueries({ queryKey: ["workspace-notices", userId] });
    },
  });
  if (!enabled) return null;
  function changeOpen(value: boolean) {
    setOpen(value);
    if (!value) {
      setSelected(null);
      showNotice.reset();
      markAll.reset();
    }
  }
  const title =
    selected?.destination.record.title ||
    (selected?.destination.kind === "class" ? "Class update" : "Notification");
  return (
    <Sheet open={open} onOpenChange={changeOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label={
            unread ? `Notifications (${unread} unread)` : "Notifications"
          }
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => {
            setSelected(null);
            showNotice.reset();
            markAll.reset();
            setOpen(true);
            notices.refetch();
          }}
          className="relative mt-2 rounded-xl bg-white/10 p-3 text-white hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <Bell size={22} />
          <span className="sr-only">Open notifications</span>
          {unread > 0 && (
            <span
              aria-hidden="true"
              className="absolute -right-1 -top-1 min-w-5 rounded-full bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[#871dad]"
            >
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="h-dvh w-full gap-0 overflow-hidden border-l border-gray-100 bg-white p-0 sm:max-w-[440px] [&>button]:right-5 [&>button]:top-6 [&>button]:rounded-lg [&>button]:p-1.5"
      >
        <SheetHeader className="shrink-0 border-b border-gray-100 px-6 py-6 pr-16">
          <SheetTitle className="text-lg">
            {selected ? title : "Notifications"}
          </SheetTitle>
          <SheetDescription>
            {selected ? "Notification details" : "Your latest account updates."}
          </SheetDescription>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col">
          {selected ? (
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-6">
              <button
                type="button"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#871dad]"
                onClick={() => setSelected(null)}
              >
                <ArrowLeft size={16} />
                All notifications
              </button>
              <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                {selected.destination.record.message ||
                  selected.destination.record.description ||
                  selected.item.message}
              </p>
              <p className="text-xs text-gray-400">
                {dateLabel(selected.item.createdAt)}
              </p>
              {selected.destination.kind === "message" &&
                selected.destination.record._id && (
                  <Link
                    href={`/admin/chat?room=${encodeURIComponent(selected.destination.record._id)}`}
                    onClick={() => changeOpen(false)}
                    className={primaryClass}
                  >
                    Open conversation
                  </Link>
                )}
            </div>
          ) : (
            <>
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-gray-100 px-6 py-4 text-sm">
                <span className="text-gray-500">
                  {unread ? `${unread} unread` : "You’re all caught up"}
                </span>
                <button
                  type="button"
                  disabled={!unread || markAll.isPending}
                  onClick={() => markAll.mutate()}
                  className="font-semibold text-[#871dad] disabled:opacity-40"
                >
                  {markAll.isPending ? "Marking…" : "Mark all as read"}
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                {notices.isPending && (
                  <p
                    role="status"
                    className="py-8 text-center text-sm text-gray-500"
                  >
                    Loading notifications…
                  </p>
                )}
                {notices.isError && (
                  <p
                    role="alert"
                    className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                  >
                    Unable to load notifications.{" "}
                    <button
                      type="button"
                      onClick={() => notices.refetch()}
                      className="underline"
                    >
                      Retry
                    </button>
                  </p>
                )}
                {!notices.isPending &&
                  !notices.isError &&
                  !notices.data?.length && (
                    <div className="py-10 text-center">
                      <Bell
                        size={30}
                        className="mx-auto mb-3 text-purple-200"
                      />
                      <p className="text-sm text-gray-500">
                        No notifications yet.
                      </p>
                    </div>
                  )}
                {Boolean(notices.data?.length) && (
                  <ul className="space-y-2">
                    {notices.data!.map((item) => (
                      <li key={item._id}>
                        <button
                          type="button"
                          disabled={showNotice.isPending}
                          onClick={() => showNotice.mutate(item)}
                          className={`flex w-full gap-3 rounded-xl p-4 text-left transition-colors hover:bg-purple-100/50 ${item.isViewed ? "bg-gray-50" : "bg-purple-50"}`}
                        >
                          <Bell
                            size={17}
                            className="mt-0.5 shrink-0 text-[#871dad]"
                          />
                          <span>
                            <span
                              className={`block text-sm leading-5 text-gray-800 ${item.isViewed ? "" : "font-medium"}`}
                            >
                              {item.message}
                            </span>
                            <span className="mt-1 block text-xs text-gray-400">
                              {dateLabel(item.createdAt)}
                            </span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {showNotice.isPending && (
                  <p role="status" className="text-sm text-gray-500">
                    Opening notification…
                  </p>
                )}
                {(showNotice.isError || markAll.isError) && (
                  <p role="alert" className="text-sm text-red-600">
                    {errorMessage(showNotice.error || markAll.error)}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
