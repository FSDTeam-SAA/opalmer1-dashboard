import ChatInbox from "@/features/AdministratorPart/components/ChatInbox";
export default async function AdminChatPage({
  searchParams,
}: {
  searchParams: Promise<{ room?: string }>;
}) {
  const { room } = await searchParams;
  return <ChatInbox initialRoomId={room} />;
}
