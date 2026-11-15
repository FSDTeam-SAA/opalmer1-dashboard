import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { api } from "@/lib/api";
import NotificationSettings from "./NotificationSettings";
jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: { user: { id: "own-admin" } } }),
}));
jest.mock("@/lib/api", () => ({ api: { get: jest.fn(), put: jest.fn() } }));
beforeEach(() => jest.clearAllMocks());
function mount() {
  return render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <NotificationSettings />
    </QueryClientProvider>,
  );
}
test("notification changes save to the current account and reload from saved preferences", async () => {
  let saved: Record<string, boolean> = { message: true };
  jest.mocked(api.get).mockImplementation(async () => ({
    data: { data: { id: "own-admin", notificationPreferences: saved } },
  }));
  jest.mocked(api.put).mockImplementation(async (path, body) => {
    saved = (body as { notificationPreferences: Record<string, boolean> })
      .notificationPreferences;
    return { data: { success: true } };
  });
  const view = mount();
  fireEvent.click(await screen.findByRole("switch", { name: "Messages" }));
  expect(api.put).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Save preferences" }));
  await screen.findByText("Notification preferences saved.");
  expect(api.put).toHaveBeenCalledWith("/users/own-admin", {
    notificationPreferences: { message: false },
  });
  view.unmount();
  mount();
  expect(
    await screen.findByRole("switch", { name: "Messages" }),
  ).toHaveAttribute("aria-checked", "false");
});
test("load failure prevents changing defaults or saving over account preferences", async () => {
  jest.mocked(api.get).mockRejectedValue(new Error("offline"));
  mount();
  await screen.findByRole("alert");
  expect(
    screen.queryByRole("button", { name: "Save preferences" }),
  ).not.toBeInTheDocument();
  expect(api.put).not.toHaveBeenCalled();
});
