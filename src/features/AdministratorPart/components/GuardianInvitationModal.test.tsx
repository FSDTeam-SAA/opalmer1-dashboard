import { act, fireEvent, render, screen, within } from "@testing-library/react";
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

beforeEach(() => jest.clearAllMocks());

test("row button opens a modal with the selected student ID and an empty guardian email", async () => {
  render(<StudentsView />);
  fireEvent.click(
    screen.getByRole("button", { name: "Invite guardian for First Student" }),
  );
  const modal = screen.getByRole("dialog");
  expect(within(modal).getByLabelText("Student ID")).toHaveValue("students-1");
  expect(within(modal).getByLabelText("Student ID")).toHaveAttribute(
    "readonly",
  );
  expect(within(modal).getByLabelText("Guardian email")).toHaveValue("");
  fireEvent.change(within(modal).getByLabelText("Guardian email"), {
    target: { value: "guardian@example.com" },
  });
  fireEvent.click(within(modal).getByRole("button", { name: "Cancel" }));
  fireEvent.click(
    screen.getByRole("button", { name: "Invite guardian for Second Student" }),
  );
  expect(screen.getByLabelText("Student ID")).toHaveValue("students-2");
  expect(screen.getByLabelText("Guardian email")).toHaveValue("");
  expect(api.post).not.toHaveBeenCalled();
  await act(async () => {});
});

test("creates an invitation for the selected student and entered guardian email", async () => {
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
  render(<StudentsView />);
  fireEvent.click(
    screen.getByRole("button", { name: "Invite guardian for Second Student" }),
  );
  fireEvent.change(screen.getByLabelText("Guardian email"), {
    target: { value: "guardian@example.com" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Create Invitation" }));
  expect(await screen.findByText("ABC123DEF456")).toBeInTheDocument();
  expect(api.post).toHaveBeenCalledWith("/parent/child/invitations", {
    childId: "student-db-2",
    parentEmail: "guardian@example.com",
  });
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Done" }));
  });
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("API failure retains the email and permits retry", async () => {
  (api.post as jest.Mock).mockRejectedValue(new Error("offline"));
  render(<StudentsView />);
  fireEvent.click(
    screen.getByRole("button", { name: "Invite guardian for First Student" }),
  );
  fireEvent.change(screen.getByLabelText("Guardian email"), {
    target: { value: "guardian@example.com" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Create Invitation" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Unable to create invitation",
  );
  expect(screen.getByLabelText("Guardian email")).toHaveValue(
    "guardian@example.com",
  );
  expect(
    screen.getByRole("button", { name: "Create Invitation" }),
  ).toBeEnabled();
});
