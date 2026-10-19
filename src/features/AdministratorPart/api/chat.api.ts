import { api } from "@/lib/api";

export type ChatUser = {
  _id: string;
  username: string;
  avatar?: { url?: string };
  type?: string;
};
export type ChatMessage = {
  _id: string;
  userId: string | ChatUser;
  message: string;
  created_at: string;
  isDeleted?: boolean;
  isEdited?: boolean;
  file?: { filename: string; url: string }[];
};
export type ChatRoom = {
  _id: string;
  type: "direct" | "group";
  name?: string;
  avatar?: string;
  participants: { userId: ChatUser | null }[];
  lastMessage?: string;
  lastMessageId?: ChatMessage | null;
  lastMessageAt?: string;
  isBlocked?: boolean;
  blockedBy?: string[];
};
export type MessagePage = {
  data: ChatMessage[];
  meta: { page: number; totalPages: number };
};

export async function fetchChatRooms(): Promise<ChatRoom[]> {
  const { data } = await api.get<{ data: ChatRoom[] }>("/rooms/my-rooms");
  return data.data;
}

export async function fetchChatMessages(
  roomId: string,
  page: number,
): Promise<MessagePage> {
  const { data } = await api.get<MessagePage>(
    `/message/${encodeURIComponent(roomId)}`,
    { params: { page, limit: 40 } },
  );
  return data;
}

export async function sendChatMessage(
  roomId: string,
  message: string,
): Promise<ChatMessage> {
  const { data } = await api.post<{ data: ChatMessage }>("/message", {
    roomId,
    message,
  });
  return data.data;
}

export function roomDetails(room: ChatRoom, currentUserId: string) {
  const peer = room.participants.find(
    ({ userId }) => userId && userId._id !== currentUserId,
  )?.userId;
  return room.type === "group"
    ? {
        name: room.name || "Group conversation",
        avatar: room.avatar || "",
        subtitle: "Group",
      }
    : {
        name: peer?.username || "Participant unavailable",
        avatar: peer?.avatar?.url || "",
        subtitle: peer?.type || "",
      };
}

export function attachmentUrl(value: string): string | null {
  try {
    const url = new URL(value, process.env.NEXT_PUBLIC_API_URL);
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}
