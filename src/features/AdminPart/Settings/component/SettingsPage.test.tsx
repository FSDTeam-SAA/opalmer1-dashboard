import { fireEvent, render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import SettingsPage from "./SettingsPage";

jest.mock("next-auth/react", () => ({ useSession: jest.fn() }));
jest.mock("@/components/sheard/PageHeader", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("./NotificationSettings", () => ({
  __esModule: true,
  default: () => <div>Notification controls</div>,
}));
jest.mock("./ProfileSettings", () => ({
  __esModule: true,
  default: () => <div>Profile form</div>,
}));
jest.mock("./DisputeCenter", () => ({
  __esModule: true,
  default: () => <div>Dispute controls</div>,
}));
jest.mock("./AboutUs", () => ({
  __esModule: true,
  default: () => <div>About editor</div>,
}));
jest.mock("./TermsConditions", () => ({
  __esModule: true,
  default: () => <div>Terms editor</div>,
}));

function setRole(role?: string) {
  (useSession as jest.Mock).mockReturnValue({
    data: role ? { user: { role } } : null,
  });
}

test("administrator can open notifications and profile but has no content management menus", () => {
  setRole("administrator");
  render(<SettingsPage canManageContent={false} />);
  expect(screen.getByText("Notification controls")).toBeInTheDocument();
  expect(screen.getAllByRole("button")).toHaveLength(2);
  for (const name of ["Dispute Center", "About Us", "Terms & Conditions"]) {
    expect(screen.queryByRole("button", { name })).not.toBeInTheDocument();
  }
  fireEvent.click(screen.getByRole("button", { name: "Profile Update" }));
  expect(screen.getByText("Profile form")).toBeInTheDocument();
});

test("admin retains all content management menus", () => {
  setRole("admin");
  render(<SettingsPage />);
  fireEvent.click(screen.getByRole("button", { name: "About Us" }));
  expect(screen.getByText("About editor")).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Dispute Center" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Terms & Conditions" }),
  ).toBeInTheDocument();
});

test("restricted panels unmount when the session loses the admin role", () => {
  setRole("admin");
  const view = render(<SettingsPage />);
  fireEvent.click(screen.getByRole("button", { name: "Dispute Center" }));
  expect(screen.getByText("Dispute controls")).toBeInTheDocument();
  setRole("administrator");
  view.rerender(<SettingsPage />);
  expect(screen.queryByText("Dispute controls")).not.toBeInTheDocument();
  expect(screen.getByText("Notification controls")).toBeInTheDocument();
});
