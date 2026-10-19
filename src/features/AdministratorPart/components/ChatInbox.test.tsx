import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  fetchChatMessages,
  fetchChatRooms,
  sendChatMessage,
} from "../api/chat.api";
import ChatInbox from "./ChatInbox";

jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: { user: { id: "administrator-1", role: "administrator" } },
  }),
}));
jest.mock("@/components/sheard/PageHeader", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("../api/chat.api", () => ({
  ...jest.requireActual("../api/chat.api"),
  fetchChatRooms: jest.fn(),
  fetchChatMessages: jest.fn(),
  sendChatMessage: jest.fn(),
}));

const room = {
  _id: "room-1",
  type: "direct",
  participants: [
    { userId: { _id: "administrator-1", username: "School Administrator" } },
    { userId: { _id: "parent-1", username: "Actual Parent", type: "parent" } },
  ],
  lastMessage: "Hello school",
  lastMessageAt: "2026-10-19T10:00:00Z",
};
const page = {
  data: [
    {
      _id: "message-1",
      userId: "parent-1",
      message: "Hello school",
      created_at: "2026-10-19T10:00:00Z",
    },
  ],
  meta: { page: 1, totalPages: 1 },
};

beforeEach(() => {
  jest.clearAllMocks();
  (fetchChatRooms as jest.Mock).mockResolvedValue([room]);
  (fetchChatMessages as jest.Mock).mockResolvedValue(page);
});

function mount() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const view = render(
    <QueryClientProvider client={client}>
      <ChatInbox />
    </QueryClientProvider>,
  );
  return { ...view, client };
}

async function openRoom() {
  fireEvent.click(await screen.findByRole("button", { name: /Actual Parent/ }));
  await screen.findByRole("log");
  await waitFor(() =>
    expect(fetchChatMessages).toHaveBeenCalledWith("room-1", 1),
  );
}

test("opens a real parent conversation and sends a reply to that room", async () => {
  (sendChatMessage as jest.Mock).mockResolvedValue({ _id: "reply-1" });
  const view = mount();
  await openRoom();
  await waitFor(() =>
    expect(screen.getAllByText("Hello school")).toHaveLength(2),
  );
  expect(screen.getByRole("button", { name: "Send message" })).toBeDisabled();
  fireEvent.change(screen.getByRole("textbox", { name: "Message" }), {
    target: { value: "  Thank you for contacting us.  " },
  });
  fireEvent.click(screen.getByRole("button", { name: "Send message" }));
  await waitFor(() =>
    expect(sendChatMessage).toHaveBeenCalledWith(
      "room-1",
      "Thank you for contacting us.",
    ),
  );
  await waitFor(() =>
    expect(screen.getByRole("textbox", { name: "Message" })).toHaveValue(""),
  );
  view.unmount();
  view.client.clear();
});

test("failed replies keep the draft so the administrator can retry", async () => {
  (sendChatMessage as jest.Mock).mockRejectedValue(new Error("offline"));
  const view = mount();
  await openRoom();
  fireEvent.change(screen.getByRole("textbox", { name: "Message" }), {
    target: { value: "Keep this draft" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Send message" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Message could not be sent",
  );
  expect(screen.getByRole("textbox", { name: "Message" })).toHaveValue(
    "Keep this draft",
  );
  expect(screen.getByRole("button", { name: "Send message" })).toBeEnabled();
  view.unmount();
  view.client.clear();
});

test("loads older messages and never displays deleted message contents", async () => {
  (fetchChatMessages as jest.Mock).mockImplementation(
    (_room: string, pageNo: number) =>
      Promise.resolve(
        pageNo === 1
          ? { ...page, meta: { page: 1, totalPages: 2 } }
          : {
              data: [
                {
                  _id: "old-1",
                  userId: "parent-1",
                  message: "Private deleted text",
                  isDeleted: true,
                  created_at: "2026-10-18T10:00:00Z",
                },
              ],
              meta: { page: 2, totalPages: 2 },
            },
      ),
  );
  const view = mount();
  await openRoom();
  fireEvent.click(
    await screen.findByRole("button", { name: "Load older messages" }),
  );
  expect(await screen.findByText("Message deleted")).toBeInTheDocument();
  expect(screen.queryByText("Private deleted text")).not.toBeInTheDocument();
  expect(fetchChatMessages).toHaveBeenCalledWith("room-1", 2);
  view.unmount();
  view.client.clear();
});

test("blocked rooms disable composing and empty inboxes show no example conversations", async () => {
  (fetchChatRooms as jest.Mock).mockResolvedValue([
    { ...room, isBlocked: true },
  ]);
  const view = mount();
  await openRoom();
  expect(screen.getByRole("textbox", { name: "Message" })).toBeDisabled();
  view.unmount();
  view.client.clear();
  (fetchChatRooms as jest.Mock).mockResolvedValue([]);
  const empty = mount();
  expect(await screen.findByText(/No conversations yet/)).toBeInTheDocument();
  expect(screen.queryByText("Actual Parent")).not.toBeInTheDocument();
  empty.unmount();
  empty.client.clear();
});
