import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "@/components/sheard/Navbar";
import { workspaceApi } from "./api";

jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: { user: { id: "admin", role: "admin" } } }),
}));
jest.mock("./api", () => ({
  ...jest.requireActual("./api"),
  workspaceApi: {
    notices: jest.fn(),
    openNotice: jest.fn(),
    markNoticesRead: jest.fn(),
  },
}));
const notice = {
  _id: "class-notice",
  message: "New class created: 6 Math A",
  isViewed: false,
  type: "class",
  createdAt: "2026-10-24T10:00:00Z",
};
beforeEach(() => {
  jest.clearAllMocks();
  (workspaceApi.notices as jest.Mock).mockResolvedValue([notice]);
  (workspaceApi.openNotice as jest.Mock).mockResolvedValue({
    kind: "class",
    record: { _id: "class" },
  });
  (workspaceApi.markNoticesRead as jest.Mock).mockResolvedValue({});
});
function mount() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const view = render(
    <QueryClientProvider client={client}>
      <Navbar onMenuClick={jest.fn()} />
    </QueryClientProvider>,
  );
  return {
    cleanup: () => {
      view.unmount();
      client.clear();
    },
  };
}
test("header bell opens a right-hand drawer without navigating to the dashboard hash", async () => {
  const view = mount();
  const url = window.location.href;
  const bell = await screen.findByRole("button", { name: /^Notifications/ });
  expect(bell).toHaveAttribute("aria-haspopup", "dialog");
  fireEvent.click(bell);
  const drawer = await screen.findByRole("dialog", { name: "Notifications" });
  expect(drawer).toHaveAttribute("data-slot", "sheet-content");
  expect(drawer).toHaveClass("right-0", "h-dvh", "w-full");
  expect(
    await screen.findByRole("button", { name: /New class created/ }),
  ).toBeInTheDocument();
  expect(window.location.href).toBe(url);
  view.cleanup();
});

test("notification drawer closes and returns focus to the header bell", async () => {
  const view = mount();
  const bell = await screen.findByRole("button", { name: /^Notifications/ });
  fireEvent.click(bell);
  await screen.findByRole("dialog", { name: "Notifications" });
  fireEvent.click(screen.getByRole("button", { name: "Close" }));
  await waitFor(() =>
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
  );
  await waitFor(() => expect(bell).toHaveFocus());
  view.cleanup();
});
test("class notification opens details and can return to the list", async () => {
  const view = mount();
  fireEvent.click(
    await screen.findByRole("button", { name: /^Notifications/ }),
  );
  fireEvent.click(
    await screen.findByRole("button", { name: /New class created/ }),
  );
  expect(
    await screen.findByRole("dialog", { name: "Class update" }),
  ).toBeInTheDocument();
  expect(screen.getByText("New class created: 6 Math A")).toBeInTheDocument();
  expect(workspaceApi.openNotice).toHaveBeenCalledWith("class-notice");
  fireEvent.click(screen.getByRole("button", { name: "All notifications" }));
  expect(screen.getByRole("dialog")).toHaveAccessibleName("Notifications");
  view.cleanup();
});
test("mark all as read uses the authenticated user and clears the unread state", async () => {
  const view = mount();
  fireEvent.click(
    await screen.findByRole("button", { name: /^Notifications/ }),
  );
  await screen.findByText("1 unread");
  (workspaceApi.notices as jest.Mock).mockResolvedValue([
    { ...notice, isViewed: true },
  ]);
  fireEvent.click(screen.getByRole("button", { name: "Mark all as read" }));
  await waitFor(() =>
    expect(workspaceApi.markNoticesRead).toHaveBeenCalledWith("admin"),
  );
  expect(await screen.findByText("You’re all caught up")).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Mark all as read" }),
  ).toBeDisabled();
  view.cleanup();
});
test("bell supports empty and failed notification lists", async () => {
  (workspaceApi.notices as jest.Mock).mockResolvedValue([]);
  let view = mount();
  fireEvent.click(
    await screen.findByRole("button", { name: /^Notifications/ }),
  );
  expect(await screen.findByText("No notifications yet.")).toBeInTheDocument();
  view.cleanup();
  (workspaceApi.notices as jest.Mock).mockRejectedValue(new Error("offline"));
  view = mount();
  fireEvent.click(
    await screen.findByRole("button", { name: /^Notifications/ }),
  );
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Unable to load notifications",
  );
  view.cleanup();
});
