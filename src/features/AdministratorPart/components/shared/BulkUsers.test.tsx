import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  UserListView,
  type UserListConfig,
  type UserRow,
} from "./UserListView";
import BulkUserUpload from "./BulkUserUpload";
import { createSchoolUser, deleteSchoolUser } from "../../api/bulk-users.api";

jest.mock("../../api/bulk-users.api", () => ({
  createSchoolUser: jest.fn(),
  deleteSchoolUser: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock("@/components/sheard/PageHeader", () => ({
  __esModule: true,
  default: () => null,
}));

function wrapper(children: React.ReactNode) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>{children}</QueryClientProvider>,
  );
}
const rows: UserRow[] = ["Alpha", "Beta"].map((name, i) => ({
  _id: String(i),
  name,
  userId: `ID-${i}`,
  badge: "5",
  email: "",
  phoneNumber: "",
  active: true,
  image: "",
}));
function list(type: UserListConfig["type"]) {
  const config: UserListConfig = {
    type,
    title: "Users",
    tableHeading: "All Users",
    idColumnHeader: "ID",
    badgeColumnHeader: "Grade",
    searchPlaceholder: "Search users",
    addButtonLabel: "Add User",
    viewRoutePrefx: "/users",
    emptyMessage: "No users",
    errorMessage: "Failed",
  };
  return wrapper(
    <UserListView
      config={config}
      data={rows}
      isLoading={false}
      isError={false}
      onRefetch={jest.fn()}
      isTogglePending={false}
      onToggle={jest.fn()}
      isUpdatePending={false}
      onUpdate={jest.fn()}
      onAdd={jest.fn()}
    />,
  );
}
beforeEach(() => jest.clearAllMocks());

it.each(["student", "teacher", "parent"] as const)(
  "%s delete requires Yes and No cancels",
  async (type) => {
    jest.mocked(deleteSchoolUser).mockResolvedValue(undefined);
    list(type);
    fireEvent.click(screen.getByRole("button", { name: "Delete Alpha" }));
    fireEvent.click(screen.getByRole("button", { name: "No" }));
    expect(deleteSchoolUser).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Delete Alpha" }));
    fireEvent.click(screen.getByRole("button", { name: "Yes" }));
    await waitFor(() =>
      expect(deleteSchoolUser).toHaveBeenCalledWith(type, "0"),
    );
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  },
);

it("selects searched users only; bulk retry never deletes successful users again", async () => {
  jest.mocked(deleteSchoolUser).mockImplementation(async (_, id) => {
    if (id === "1") throw new Error("Linked records");
  });
  list("student");
  fireEvent.change(screen.getByPlaceholderText("Search users"), {
    target: { value: "Alpha" },
  });
  fireEvent.click(screen.getByLabelText("Select all visible users"));
  fireEvent.change(screen.getByPlaceholderText("Search users"), {
    target: { value: "" },
  });
  expect(screen.getByLabelText("Select Beta")).not.toBeChecked();
  fireEvent.click(screen.getByLabelText("Select Beta"));
  fireEvent.click(
    screen.getByRole("button", { name: "Delete selected users" }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Yes" }));
  await waitFor(() =>
    expect(screen.getByRole("alert")).toHaveTextContent("Beta: Linked records"),
  );
  expect(screen.getByLabelText("Select Alpha")).not.toBeChecked();
  fireEvent.click(
    within(screen.getByRole("dialog")).getByRole("button", { name: "Yes" }),
  );
  await waitFor(() => expect(deleteSchoolUser).toHaveBeenCalledTimes(3));
  expect(
    jest.mocked(deleteSchoolUser).mock.calls.map((call) => call[1]),
  ).toEqual(["0", "1", "1"]);
});

it.each(["student", "teacher", "parent"] as const)(
  "%s CSV preview uploads and retries only failed accounts",
  async (type) => {
    jest.mocked(createSchoolUser).mockImplementation(async (_, row) => {
      if (row.Id === "2") throw new Error("ID already exists");
      return {};
    });
    wrapper(
      <BulkUserUpload type={type} onClose={jest.fn()} onComplete={jest.fn()} />,
    );
    const file = new File([""], "users.csv", { type: "text/csv" });
    Object.defineProperty(file, "text", {
      value: async () => "username,Id,password\nAlpha,1,secret\nBeta,2,secret",
    });
    fireEvent.change(screen.getByLabelText("Choose CSV file"), {
      target: { files: [file] },
    });
    await screen.findByText("Alpha");
    expect(screen.queryByText("secret")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Upload Users" }));
    await screen.findByText("Beta: ID already exists");
    fireEvent.click(screen.getByRole("button", { name: "Retry Failed Users" }));
    await waitFor(() => expect(createSchoolUser).toHaveBeenCalledTimes(3));
    expect(
      jest
        .mocked(createSchoolUser)
        .mock.calls.map((call) => [call[0], call[1].Id]),
    ).toEqual([
      [type, "1"],
      [type, "2"],
      [type, "2"],
    ]);
  },
);
