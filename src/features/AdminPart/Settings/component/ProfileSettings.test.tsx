import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { api } from "@/lib/api";
import ProfileSettings from "./ProfileSettings";

jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: { user: { id: "current-user" } } }),
}));
jest.mock("@/lib/api", () => ({ api: { get: jest.fn(), put: jest.fn() } }));

const profile = {
  id: "current-user",
  username: "School Administrator",
  email: "school@example.com",
  phoneNumber: "0123456789",
};

beforeEach(() => jest.clearAllMocks());

function renderProfile() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={client}>
      <ProfileSettings />
    </QueryClientProvider>,
  );
}

test("loads the current account and saves profile edits to its own user endpoint", async () => {
  (api.get as jest.Mock).mockResolvedValue({ data: { data: profile } });
  (api.put as jest.Mock).mockResolvedValue({
    data: { data: { ...profile, username: "Updated Name" } },
  });
  renderProfile();
  fireEvent.change(await screen.findByLabelText("Name"), {
    target: { value: "Updated Name" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));
  expect(
    await screen.findByText("Profile updated successfully."),
  ).toBeInTheDocument();
  expect(api.get).toHaveBeenCalledWith("/users/me");
  expect(api.put).toHaveBeenCalledWith("/users/current-user", {
    username: "Updated Name",
    email: profile.email,
    phoneNumber: profile.phoneNumber,
  });
});

test("failed saves keep the entered values and allow retry", async () => {
  (api.get as jest.Mock).mockResolvedValue({ data: { data: profile } });
  (api.put as jest.Mock).mockRejectedValue(new Error("offline"));
  renderProfile();
  fireEvent.change(await screen.findByLabelText("Name"), {
    target: { value: "Unsaved Name" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Unable to update your profile",
  );
  expect(screen.getByLabelText("Name")).toHaveValue("Unsaved Name");
  expect(screen.getByRole("button", { name: "Save Changes" })).toBeEnabled();
});
