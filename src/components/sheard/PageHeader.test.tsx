import { render, screen } from "@testing-library/react";
import PageHeader from "./PageHeader";

let pathname = "/administrator/students/student-1";
jest.mock("next/navigation", () => ({ usePathname: () => pathname }));

test("directly opened student profile links back to the student list", () => {
  render(<PageHeader title="Student Profile" />);
  expect(screen.getByRole("link", { name: "Back" })).toHaveAttribute(
    "href",
    "/administrator/students",
  );
});

test("primary pages link back to their own dashboard", () => {
  pathname = "/admin/school";
  render(<PageHeader title="Schools" />);
  expect(screen.getByRole("link", { name: "Back" })).toHaveAttribute(
    "href",
    "/admin/dashboard",
  );
});

test("dashboard does not display a back link", () => {
  pathname = "/administrator/dashboard";
  render(<PageHeader title="Dashboard" showBack={false} />);
  expect(screen.queryByRole("link", { name: "Back" })).not.toBeInTheDocument();
});
