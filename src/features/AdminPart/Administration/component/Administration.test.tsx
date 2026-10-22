import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import Administration from "./Administration";

const deleteAdmin = jest.fn();
jest.mock("../hooks/useAdministrators", () => ({
  useAdministrators: () => ({
    data: [
      {
        _id: "admin-a",
        username: "Alpha Admin",
        Id: "A001",
        schoolId: { name: "Alpha School", code: "S001" },
        state: "active",
      },
    ],
  }),
  useToggleAdministratorState: () => ({ isPending: false }),
  useDeleteAdministrator: () => ({
    mutateAsync: deleteAdmin,
    isPending: false,
  }),
}));
jest.mock("@/components/sheard/PageHeader", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("@/components/ui/data-image", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("./CreateAdminModal", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("./EditAdminModal", () => ({
  __esModule: true,
  default: () => null,
}));

beforeEach(() => jest.clearAllMocks());

it("shows administrators in a searchable table and deletes only after Yes", async () => {
  deleteAdmin.mockResolvedValue(undefined);
  render(<Administration />);
  expect(
    within(screen.getByRole("table")).getByText("Alpha School (S001)"),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Delete Alpha Admin" }));
  expect(deleteAdmin).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "No" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(deleteAdmin).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Delete Alpha Admin" }));
  fireEvent.click(screen.getByRole("button", { name: "Yes" }));
  await waitFor(() =>
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
  );
  expect(deleteAdmin).toHaveBeenCalledWith("admin-a");
  fireEvent.change(screen.getByRole("textbox"), {
    target: { value: "missing" },
  });
  expect(screen.getByText("No administrators found")).toBeInTheDocument();
});

it("keeps the modal open and shows API deletion errors", async () => {
  deleteAdmin.mockRejectedValue({
    response: { data: { message: "Unable to delete administrator" } },
  });
  render(<Administration />);
  fireEvent.click(screen.getByRole("button", { name: "Delete Alpha Admin" }));
  fireEvent.click(screen.getByRole("button", { name: "Yes" }));
  await waitFor(() =>
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Unable to delete administrator",
    ),
  );
  expect(screen.getByRole("dialog")).toBeInTheDocument();
});
