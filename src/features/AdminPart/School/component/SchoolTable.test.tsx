import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import SchoolTable from "./SchoolTable";
import { deleteSchool } from "../api/school.api";

const invalidateQueries = jest.fn();
jest.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({ invalidateQueries }),
}));
jest.mock("../api/school.api", () => ({ deleteSchool: jest.fn() }));
jest.mock("@/components/sheard/PageHeader", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("@/components/ui/data-image", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("./CreateSchoolModal", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("./BulkSchoolUpload", () => ({
  __esModule: true,
  default: () => <div>Upload dialog</div>,
}));
jest.mock("../hooks/useSchools", () => ({
  schoolKeys: { all: ["schools"] },
  useSchools: () => ({
    data: [
      { _id: "a", name: "Alpha", created_at: "2026-10-22" },
      { _id: "b", name: "Beta", created_at: "2026-10-22" },
    ],
  }),
  useDeleteSchool: () => ({ isPending: false }),
}));

beforeEach(() => jest.clearAllMocks());

it("selects only visible schools and preserves selections across search", () => {
  render(<SchoolTable />);
  fireEvent.change(screen.getByPlaceholderText("Search schools..."), {
    target: { value: "Alpha" },
  });
  fireEvent.click(screen.getByLabelText("Select all visible schools"));
  fireEvent.change(screen.getByPlaceholderText("Search schools..."), {
    target: { value: "" },
  });
  expect(screen.getByLabelText("Select Alpha")).toBeChecked();
  expect(screen.getByLabelText("Select Beta")).not.toBeChecked();
  fireEvent.click(screen.getByText("Clear Selection"));
  expect(
    screen.queryByRole("button", { name: "Delete selected schools" }),
  ).not.toBeInTheDocument();
  fireEvent.click(screen.getByText("Bulk Upload"));
  expect(screen.getByText("Upload dialog")).toBeInTheDocument();
});

it("confirms bulk delete, keeps failed selections and retries only failures", async () => {
  jest.mocked(deleteSchool).mockImplementation(async (id) => {
    if (id === "b") throw new Error("Linked users");
    return {} as Awaited<ReturnType<typeof deleteSchool>>;
  });
  render(<SchoolTable />);
  fireEvent.click(screen.getByLabelText("Select all visible schools"));
  fireEvent.click(
    screen.getByRole("button", { name: "Delete selected schools" }),
  );
  expect(deleteSchool).not.toHaveBeenCalled();
  fireEvent.click(
    within(screen.getByRole("dialog")).getByRole("button", { name: "Yes" }),
  );
  await waitFor(() =>
    expect(screen.getByRole("alert")).toHaveTextContent("Beta: Linked users"),
  );
  expect(screen.getByLabelText("Select Alpha")).not.toBeChecked();
  expect(screen.getByLabelText("Select Beta")).toBeChecked();
  fireEvent.click(
    within(screen.getByRole("dialog")).getByRole("button", { name: "Yes" }),
  );
  await waitFor(() => expect(deleteSchool).toHaveBeenCalledTimes(3));
  expect(jest.mocked(deleteSchool).mock.calls.map((args) => args[0])).toEqual([
    "a",
    "b",
    "b",
  ]);
});
