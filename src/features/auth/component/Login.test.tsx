import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { getSession, signIn } from "next-auth/react";
import Login from "./Login";

let query = new URLSearchParams();
const push = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => query,
}));
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
  getSession: jest.fn(),
}));
jest.mock("next/image", () => ({ __esModule: true, default: () => null }));

beforeEach(() => {
  query = new URLSearchParams();
  jest.clearAllMocks();
});

it("offers administrator login from the admin login page", () => {
  render(<Login />);
  expect(screen.getByLabelText("Admin ID")).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Login as Administrator" }),
  ).toHaveAttribute("href", "/login?role=administrator");
});

it("shows Administrator ID in administrator mode and signs into its dashboard", async () => {
  query = new URLSearchParams("role=administrator");
  jest
    .mocked(signIn)
    .mockResolvedValue({ ok: true, status: 200, error: null, url: null });
  jest
    .mocked(getSession)
    .mockResolvedValue({ user: { role: "administrator" } } as Awaited<
      ReturnType<typeof getSession>
    >);
  render(<Login />);
  expect(screen.getByRole("link", { name: "Login as Admin" })).toHaveAttribute(
    "href",
    "/login",
  );
  fireEvent.change(screen.getByLabelText("Administrator ID"), {
    target: { value: "SCHOOL-ADMIN" },
  });
  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "secret" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Sign In" }));
  await waitFor(() =>
    expect(push).toHaveBeenCalledWith("/administrator/dashboard"),
  );
  expect(signIn).toHaveBeenCalledWith(
    "credentials",
    expect.objectContaining({
      Id: "SCHOOL-ADMIN",
      password: "secret",
      redirect: false,
    }),
  );
});
