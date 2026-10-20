"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSession } from "next-auth/react";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ArrowLeft,
  LoaderCircle,
  MessageCircle,
  Search,
  Send,
  UserRound,
} from "lucide-react";
import { isAxiosError } from "axios";
import PageHeader from "@/components/sheard/PageHeader";
import DataImage from "@/components/ui/data-image";
import {
  attachmentUrl,
  fetchChatMessages,
  fetchChatRooms,
  roomDetails,
  sendChatMessage,
  type ChatMessage,
  type ChatRoom,
} from "../api/chat.api";

function Avatar({ url, name }: { url: string; name: string }) {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-purple-50 text-[#871dad]">
      {url ? (
        <DataImage
          src={url}
          alt={name}
          width={44}
          height={44}
          className="h-full w-full object-cover"
        />
      ) : (
        <UserRound size={22} />
      )}
    </div>
  );
}

function timestamp(value?: string, date = false) {
  if (!value) return "";
  const time = new Date(value);
  if (Number.isNaN(time.getTime())) return "";
  return date
    ? time.toLocaleDateString()
    : time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatInbox() {
  const { data: session } = useSession();
  const userId = session?.user.id ?? "";
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const rooms = useQuery({
    queryKey: ["administrator-chat", userId, "rooms"],
    enabled: Boolean(userId),
    queryFn: fetchChatRooms,
    refetchInterval: 5000,
  });
  const selected = rooms.data?.find((room) => room._id === selectedId);
  const filtered =
    rooms.data?.filter((room) =>
      roomDetails(room, userId)
        .name.toLowerCase()
        .includes(search.trim().toLowerCase()),
    ) ?? [];

  return (
    <div className="space-y-4 pt-6 sm:pt-10">
      <PageHeader title="Chat" />
      <div className="flex h-[calc(100dvh-240px)] min-h-[440px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm sm:min-h-[520px]">
        <aside
          className={`${selected ? "hidden md:flex" : "flex"} w-full flex-col border-r border-gray-100 md:w-80 md:shrink-0`}
        >
          <div className="space-y-4 border-b border-gray-100 p-5">
            <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                aria-label="Search conversations"
                placeholder="Search conversations"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#871dad]"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {rooms.isLoading && (
              <p role="status" className="p-5 text-sm text-gray-500">
                Loading conversations...
              </p>
            )}
            {rooms.isError && (
              <div role="alert" className="p-4 text-sm text-red-600">
                Unable to refresh conversations.{" "}
                <button onClick={() => rooms.refetch()} className="underline">
                  Retry
                </button>
              </div>
            )}
            {!rooms.isLoading && !rooms.isError && filtered.length === 0 && (
              <p className="p-5 text-sm text-gray-500">
                {search
                  ? "No conversations match your search."
                  : "No conversations yet. Messages sent to you from the app will appear here."}
              </p>
            )}
            {filtered.map((room) => {
              const details = roomDetails(room, userId);
              const preview = room.lastMessageId?.isDeleted
                ? "Message deleted"
                : room.lastMessageId?.message ||
                  room.lastMessage ||
                  "No messages yet";
              return (
                <button
                  key={room._id}
                  onClick={() => setSelectedId(room._id)}
                  className={`flex w-full cursor-pointer gap-3 rounded-xl p-3 text-left transition-colors ${selectedId === room._id ? "bg-purple-50" : "hover:bg-gray-50"}`}
                >
                  <Avatar url={details.avatar} name={details.name} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-gray-800">
                        {details.name}
                      </span>
                      <span className="shrink-0 text-[10px] text-gray-400">
                        {timestamp(room.lastMessageAt, true)}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-xs text-gray-500">
                      {preview}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>
        <div
          className={`${selected ? "flex" : "hidden md:flex"} min-w-0 flex-1 flex-col`}
        >
          {selected ? (
            <Conversation
              key={`${userId}:${selected._id}`}
              room={selected}
              userId={userId}
              onBack={() => setSelectedId(null)}
            />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center text-gray-400">
              <MessageCircle size={40} />
              <p>Select a conversation to read and reply.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Conversation({
  room,
  userId,
  onBack,
}: {
  room: ChatRoom;
  userId: string;
  onBack: () => void;
}) {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");
  const scroll = useRef<HTMLDivElement>(null);
  const followLatest = useRef(true);
  const details = roomDetails(room, userId);
  const blocked = room.isBlocked || Boolean(room.blockedBy?.length);
  const messagesKey = ["administrator-chat", userId, "messages", room._id];
  const messages = useInfiniteQuery({
    queryKey: messagesKey,
    queryFn: ({ pageParam }) => fetchChatMessages(room._id, pageParam),
    initialPageParam: 1,
    getNextPageParam: (page) =>
      page.meta.page < page.meta.totalPages ? page.meta.page + 1 : undefined,
    refetchInterval: 3000,
  });
  const send = useMutation({
    mutationFn: (text: string) => sendChatMessage(room._id, text),
    onSuccess: async () => {
      setDraft("");
      followLatest.current = true;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: messagesKey }),
        queryClient.invalidateQueries({
          queryKey: ["administrator-chat", userId, "rooms"],
        }),
      ]);
    },
  });
  const all = new Map<string, ChatMessage>();
  for (const page of messages.data?.pages ?? [])
    for (const message of page.data) {
      if (!all.has(message._id)) all.set(message._id, message);
    }
  const rows = [...all.values()].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );
  const latestId = rows.at(-1)?._id;
  useEffect(() => {
    if (followLatest.current && scroll.current)
      scroll.current.scrollTop = scroll.current.scrollHeight;
  }, [latestId]);

  function submit(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (text && !send.isPending && !blocked) send.mutate(text);
  }

  return (
    <>
      <header className="flex items-center gap-3 border-b border-gray-100 px-4 py-4 sm:px-6">
        <button
          aria-label="Back to conversations"
          onClick={onBack}
          className="rounded-lg p-1 text-gray-500 md:hidden"
        >
          <ArrowLeft size={21} />
        </button>
        <Avatar url={details.avatar} name={details.name} />
        <div className="min-w-0">
          <h2 className="truncate font-semibold text-gray-800">
            {details.name}
          </h2>
          <p className="mt-0.5 text-xs capitalize text-gray-500">
            {details.subtitle}
          </p>
        </div>
      </header>
      <div
        ref={scroll}
        onScroll={() => {
          const element = scroll.current;
          if (element)
            followLatest.current =
              element.scrollHeight - element.scrollTop - element.clientHeight <
              100;
        }}
        className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-[#faf8fc] p-4 sm:p-6"
        aria-label="Conversation messages"
        role="log"
      >
        {messages.hasNextPage && (
          <div className="text-center">
            <button
              disabled={messages.isFetchingNextPage}
              onClick={() => messages.fetchNextPage()}
              className="rounded-lg bg-white px-4 py-2 text-xs text-[#871dad] disabled:opacity-50"
            >
              {messages.isFetchingNextPage
                ? "Loading..."
                : "Load older messages"}
            </button>
          </div>
        )}
        {messages.isLoading && (
          <p role="status" className="text-center text-sm text-gray-500">
            Loading messages...
          </p>
        )}
        {messages.isError && (
          <div role="alert" className="text-center text-sm text-red-600">
            Unable to refresh messages.{" "}
            <button onClick={() => messages.refetch()} className="underline">
              Retry
            </button>
          </div>
        )}
        {!messages.isLoading && !messages.isError && rows.length === 0 && (
          <p className="text-center text-sm text-gray-500">
            No messages in this conversation yet.
          </p>
        )}
        {rows.map((message) => {
          const senderId =
            typeof message.userId === "string"
              ? message.userId
              : message.userId._id;
          const own = senderId === userId;
          return (
            <div
              key={message._id}
              className={`flex ${own ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm sm:max-w-[75%] ${own ? "rounded-br-sm bg-[#871dad] text-white" : "rounded-bl-sm border border-gray-100 bg-white text-gray-800"}`}
              >
                {room.type === "group" && !own && (
                  <p className="mb-1 text-xs font-semibold">
                    {typeof message.userId === "object"
                      ? message.userId.username
                      : room.participants.find(
                          (participant) => participant.userId?._id === senderId,
                        )?.userId?.username || "Participant unavailable"}
                  </p>
                )}
                {message.isDeleted ? (
                  <p className="italic opacity-60">Message deleted</p>
                ) : (
                  <>
                    {message.message && (
                      <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
                        {message.message}
                      </p>
                    )}
                    {message.file?.map((file, index) => {
                      const href = attachmentUrl(file.url);
                      return href ? (
                        <a
                          key={index}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 block break-all underline"
                        >
                          {file.filename}
                        </a>
                      ) : (
                        <p key={index}>Attachment unavailable</p>
                      );
                    })}
                  </>
                )}
                <p className="mt-1 text-right text-[10px] opacity-60">
                  {message.isEdited ? "Edited · " : ""}
                  {timestamp(message.created_at, true)}{" "}
                  {timestamp(message.created_at)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <form
        onSubmit={submit}
        className="space-y-2 border-t border-gray-100 bg-white p-4"
      >
        {blocked && (
          <p className="text-sm text-gray-500">
            Messaging is blocked in this conversation.
          </p>
        )}
        {send.isError && (
          <p role="alert" className="text-sm text-red-600">
            {isAxiosError(send.error)
              ? send.error.response?.data?.message ||
                "Message could not be sent. Please try again."
              : "Message could not be sent. Please try again."}
          </p>
        )}
        <div className="flex items-end gap-3">
          <textarea
            aria-label="Message"
            placeholder="Type a reply..."
            rows={2}
            maxLength={5000}
            disabled={send.isPending || blocked}
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
              if (send.isError) send.reset();
            }}
            className="min-w-0 flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#871dad] disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!draft.trim() || send.isPending || blocked}
            aria-label="Send message"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#871dad] text-white hover:bg-[#751a99] disabled:opacity-40"
          >
            {send.isPending ? (
              <LoaderCircle size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </form>
    </>
  );
}
