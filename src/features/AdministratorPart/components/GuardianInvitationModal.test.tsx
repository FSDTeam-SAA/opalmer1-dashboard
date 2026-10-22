import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { StudentsView } from "./StudentsView";

jest.mock("@/lib/api", () => ({ api: { post: jest.fn() } }));
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock("@/components/sheard/PageHeader", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("./CreateStudentModal", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("../hooks/useStudents", () => ({
  useMyStudents: () => ({
    data: [
      {
        _id: "student-db-1",
        name: "First Student",
        studentId: "students-1",
        grade: "5",
        email: "student@example.com",
        phoneNumber: "123",
        active: true,
        image: "",
      },
      {
        _id: "student-db-2",
        name: "Second Student",
        studentId: "students-2",
        grade: "6",
        email: "second@example.com",
        phoneNumber: "456",
        active: true,
        image: "",
      },
    ],
    isLoading: false,
    isError: false,
    refetch: jest.fn(),
  }),
  useToggleStudentState: () => ({ isPending: false, mutate: jest.fn() }),
  useUpdateStudent: () => ({ isPending: false, mutateAsync: jest.fn() }),
}));

jest.mock("../hooks/useParents", () => ({
  useParents: () => ({
    data: [
      {
        _id: "parent-db-1",
        name: "Guardian One",
        parentId: "parent-1",
        email: "guardian@example.com",
        active: true,
      },
    ],
    isLoading: false,
    isError: false,
  }),
}));

function selectGuardian() {
  fireEvent.focus(screen.getByRole("combobox", { name: "Parent" }));
  fireEvent.click(screen.getByRole("option", { name: /Guardian One/ }));
}

beforeEach(() => jest.clearAllMocks());

test("row button opens a modal with the selected student ID and an empty guardian email", async () => {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <StudentsView />
    </QueryClientProvider>,
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Invite guardian for First Student" }),
  );
  const modal = screen.getByRole("dialog");
  expect(within(modal).getByLabelText("Student ID")).toHaveValue("students-1");
  expect(within(modal).getByLabelText("Student ID")).toHaveAttribute(
    "readonly",
  );
  expect(within(modal).getByRole("combobox", { name: "Parent" })).toHaveValue(
    "",
  );
  fireEvent.change(within(modal).getByRole("combobox", { name: "Parent" }), {
    target: { value: "guardian@example.com" },
  });
  fireEvent.click(within(modal).getByRole("button", { name: "Cancel" }));
  fireEvent.click(
    screen.getByRole("button", { name: "Invite guardian for Second Student" }),
  );
  expect(screen.getByLabelText("Student ID")).toHaveValue("students-2");
  expect(screen.getByRole("combobox", { name: "Parent" })).toHaveValue("");
  expect(api.post).not.toHaveBeenCalled();
  await act(async () => {});
});

test("sends an invitation for the selected student and selected parent", async () => {
  (api.post as jest.Mock).mockResolvedValue({
    data: {
      data: {
        studentId: "students-2",
        parentEmail: "guardian@example.com",
        code: "ABC123DEF456",
        expiresAt: "2026-12-01T00:00:00Z",
      },
    },
  });
  render(
    <QueryClientProvider client={new QueryClient()}>
      <StudentsView />
    </QueryClientProvider>,
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Invite guardian for Second Student" }),
  );
  selectGuardian();
  fireEvent.click(screen.getByRole("button", { name: "Send Invitation" }));
  expect(await screen.findByText("ABC123DEF456")).toBeInTheDocument();
  expect(api.post).toHaveBeenCalledWith("/parent/child/invitations", {
    childId: "student-db-2",
    parentId: "parent-db-1",
  });
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Done" }));
  });
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("API failure retains the email and permits retry", async () => {
  (api.post as jest.Mock).mockRejectedValue(new Error("offline"));
  render(
    <QueryClientProvider client={new QueryClient()}>
      <StudentsView />
    </QueryClientProvider>,
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Invite guardian for First Student" }),
  );
  selectGuardian();
  fireEvent.click(screen.getByRole("button", { name: "Send Invitation" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Unable to send invitation",
  );
  expect(screen.getByRole("combobox", { name: "Parent" })).toHaveValue(
    "Guardian One — guardian@example.com",
  );
  expect(screen.getByRole("button", { name: "Send Invitation" })).toBeEnabled();
});
