import { fireEvent, render, screen } from "@testing-library/react";
import CreateAdminModal from "./CreateAdminModal";

const mockRefetch = jest.fn();
let mockSchools = {
  data: [
    {
      _id: "school-1",
      name: "Alpha School",
      code: "S001",
      administrator: { _id: "admin-1" },
    },
  ],
  isLoading: false,
  isError: false,
  refetch: mockRefetch,
};
jest.mock("../../School/hooks/useSchools", () => ({
  useSchools: () => mockSchools,
}));
jest.mock("../hooks/useAdministrators", () => ({
  useCreateAdministrator: () => ({ isPending: false }),
}));

test("shows assigned school names and explains why they cannot be selected", () => {
  render(<CreateAdminModal onClose={jest.fn()} />);
  expect(
    screen.getByRole("option", {
      name: "Alpha School (S001) — Administrator assigned",
    }),
  ).toBeDisabled();
  expect(
    screen.getByText(/All schools already have an administrator/),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Add a school" })).toHaveAttribute(
    "href",
    "/admin/school",
  );
  expect(screen.getByRole("button", { name: "Save Id" })).toBeDisabled();
});

test("failed school requests show a retry instead of claiming no schools exist", () => {
  mockSchools = { ...mockSchools, data: [], isError: true };
  render(<CreateAdminModal onClose={jest.fn()} />);
  expect(screen.getByRole("alert")).toHaveTextContent("Unable to load schools");
  expect(
    screen.queryByText(/No schools have been created/),
  ).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Retry" }));
  expect(mockRefetch).toHaveBeenCalled();
});
