import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AdminWorkspacePanel from "./AdminWorkspacePanel";
import QuickActionDialog, { actions } from "./QuickActionDialog";
import TeacherBehaviorPage from "./TeacherBehaviorPage";
import { workspaceApi } from "./api";
import { api } from "@/lib/api";
import {
  fetchChatRooms,
  sendChatMessage,
} from "@/features/AdministratorPart/api/chat.api";

let role = "admin";
jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: { user: { id: "actor", role } } }),
}));
jest.mock("@/components/sheard/PageHeader", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("@/lib/api", () => ({
  api: { get: jest.fn(), post: jest.fn(), patch: jest.fn() },
}));
jest.mock("@/features/AdministratorPart/api/chat.api", () => ({
  ...jest.requireActual("@/features/AdministratorPart/api/chat.api"),
  fetchChatRooms: jest.fn(),
  sendChatMessage: jest.fn(),
}));
jest.mock("./api", () => ({
  ...jest.requireActual("./api"),
  workspaceApi: {
    classes: jest.fn(),
    directory: jest.fn(),
    roster: jest.fn(),
    activity: jest.fn(),
    save: jest.fn(),
    submission: jest.fn(),
    result: jest.fn(),
    reviewResult: jest.fn(),
    releaseResult: jest.fn(),
    notices: jest.fn(),
    openNotice: jest.fn(),
    reports: jest.fn(),
  },
}));
const cls = {
  _id: "class",
  grade: 6,
  subject: "Math",
  teacherId: { _id: "teacher", username: "Actual Teacher" },
};
const person = {
  _id: "recipient",
  username: "Another School Parent",
  Id: "P-20",
  type: "parent",
};
beforeEach(() => {
  jest.clearAllMocks();
  role = "admin";
  (workspaceApi.classes as jest.Mock).mockResolvedValue([cls]);
  (workspaceApi.directory as jest.Mock).mockResolvedValue({
    data: [person],
    meta: { page: 1, totalPages: 1 },
  });
  (workspaceApi.roster as jest.Mock).mockResolvedValue({
    students: [{ _id: "student", username: "Jordan", Id: "S-10" }],
    attendance: [{ userId: "student", status: "late" }],
  });
  (workspaceApi.activity as jest.Mock).mockResolvedValue({
    submissions: [],
    reviews: [],
    autoGraded: [],
  });
  (workspaceApi.notices as jest.Mock).mockResolvedValue([]);
  (workspaceApi.save as jest.Mock).mockResolvedValue({});
  (fetchChatRooms as jest.Mock).mockResolvedValue([]);
});
function mount(node: React.ReactNode) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const view = render(
    <QueryClientProvider client={client}>{node}</QueryClientProvider>,
  );
  return {
    ...view,
    cleanup: () => {
      view.unmount();
      client.clear();
    },
  };
}
test("Admin has three supported actions and four activity sections with notifications kept in the header", async () => {
  const view = mount(<AdminWorkspacePanel />);
  for (const action of actions)
    expect(
      screen.getByRole("button", { name: new RegExp(action.title) }),
    ).toBeInTheDocument();
  expect(actions).toHaveLength(3);
  for (const title of [
    "Create Assignment",
    "Create Assessment",
    "Take Attendance",
  ]) {
    expect(
      screen.queryByRole("button", { name: new RegExp(title) }),
    ).not.toBeInTheDocument();
  }
  for (const title of [
    "Recent Submissions",
    "Assessments to Review",
    "Auto-Graded Results",
    "Recent Messages",
  ])
    expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
  expect(
    screen.queryByRole("heading", { name: "Notifications" }),
  ).not.toBeInTheDocument();
  expect(workspaceApi.notices).not.toHaveBeenCalled();
  for (const text of [
    "No submissions yet",
    "No assessments awaiting review",
    "No automatic results yet",
    "No recent messages",
  ]) {
    expect(await screen.findByText(text)).toBeInTheDocument();
  }
  view.cleanup();
});
test("Administrator never sees Admin actions or fetches global activity and notifications", async () => {
  role = "administrator";
  const view = mount(<AdminWorkspacePanel />);
  expect(screen.queryByText("Quick actions")).not.toBeInTheDocument();
  expect(workspaceApi.activity).not.toHaveBeenCalled();
  expect(workspaceApi.notices).not.toHaveBeenCalled();
  view.cleanup();
});
test.each(actions)(
  "$title opens its actual form from the dashboard",
  async ({ title }) => {
    const view = mount(<AdminWorkspacePanel />);
    fireEvent.click(screen.getByRole("button", { name: new RegExp(title) }));
    expect(await screen.findByRole("dialog")).toHaveAccessibleName(title);
    view.cleanup();
  },
);
test("announcement sends only the selected parent and teacher audiences, with no send allowed for an empty selection", async () => {
  const close = jest.fn();
  const view = mount(
    <QuickActionDialog action="announcements" onClose={close} />,
  );
  expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
  fireEvent.change(screen.getByLabelText("Title"), {
    target: { value: "School update" },
  });
  fireEvent.change(screen.getByLabelText("Message"), {
    target: { value: "Please read the new schedule." },
  });
  fireEvent.click(screen.getByRole("checkbox", { name: "Parents" }));
  fireEvent.click(screen.getByRole("checkbox", { name: "Teachers" }));
  fireEvent.click(screen.getByRole("button", { name: "Send" }));
  await waitFor(() =>
    expect(workspaceApi.save).toHaveBeenCalledWith("announcements", {
      title: "School update",
      message: "Please read the new schedule.",
      audiences: ["parent", "teacher"],
    }),
  );
  await waitFor(() => expect(close).toHaveBeenCalled());
  view.cleanup();
});
test("failed announcement retains the message and audience for retry", async () => {
  (workspaceApi.save as jest.Mock).mockRejectedValue(
    new Error("No active users match the selected audience"),
  );
  const view = mount(
    <QuickActionDialog action="announcements" onClose={jest.fn()} />,
  );
  fireEvent.change(screen.getByLabelText("Title"), {
    target: { value: "Update" },
  });
  fireEvent.change(screen.getByLabelText("Message"), {
    target: { value: "Keep this message" },
  });
  fireEvent.click(screen.getByRole("checkbox", { name: "Students" }));
  fireEvent.click(screen.getByRole("button", { name: "Send" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("No active users");
  expect(screen.getByLabelText("Message")).toHaveValue("Keep this message");
  expect(screen.getByRole("checkbox", { name: "Students" })).toBeChecked();
  view.cleanup();
});
test("Admin starts a conversation with a selected user from another school", async () => {
  (api.post as jest.Mock).mockResolvedValue({
    data: { data: { _id: "room" } },
  });
  (sendChatMessage as jest.Mock).mockResolvedValue({ _id: "message" });
  const view = mount(
    <QuickActionDialog action="message" onClose={jest.fn()} />,
  );
  fireEvent.click(
    await screen.findByRole("button", { name: /Another School Parent/ }),
  );
  fireEvent.change(screen.getByLabelText("Message"), {
    target: { value: "Hello parent" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Send" }));
  await waitFor(() =>
    expect(api.post).toHaveBeenCalledWith("/rooms", {
      participants: ["actor", "recipient"],
    }),
  );
  await waitFor(() =>
    expect(sendChatMessage).toHaveBeenCalledWith("room", "Hello parent"),
  );
  view.cleanup();
});
test("Administrator submits a teacher report and cannot open report history", async () => {
  role = "administrator";
  (workspaceApi.directory as jest.Mock).mockResolvedValue({
    data: [{ _id: "teacher", username: "School Teacher", Id: "T-10" }],
    meta: { totalPages: 1 },
  });
  const view = mount(<TeacherBehaviorPage />);
  await screen.findByRole("option", { name: /School Teacher/ });
  fireEvent.change(screen.getByLabelText("Teacher"), {
    target: { value: "teacher" },
  });
  fireEvent.change(screen.getByLabelText("Subject"), {
    target: { value: "Incident follow-up" },
  });
  fireEvent.change(screen.getByLabelText("Report details"), {
    target: { value: "Confidential teacher details" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Submit to Admin" }));
  await screen.findByText("Report submitted to Admin.");
  expect(workspaceApi.save).toHaveBeenCalledWith(
    "teacher-behavior",
    expect.objectContaining({
      teacherId: "teacher",
      message: "Confidential teacher details",
    }),
  );
  expect(workspaceApi.reports).not.toHaveBeenCalled();
  expect(
    screen.queryByText("Confidential teacher behavior reports"),
  ).not.toBeInTheDocument();
  view.cleanup();
});
test("Admin can read the confidential report with its actual author and teacher", async () => {
  (workspaceApi.reports as jest.Mock).mockResolvedValue({
    data: [
      {
        _id: "report",
        teacherId: { username: "Reported Teacher", Id: "T-10" },
        submittedBy: { username: "School Administrator" },
        subject: "Incident follow-up",
        message: "Confidential report text",
        severity: "urgent",
        occurredOn: "2026-10-23",
        createdAt: "2026-10-24T10:00:00Z",
      },
    ],
    meta: { totalPages: 1 },
  });
  const view = mount(<TeacherBehaviorPage />);
  expect(
    await screen.findByText("Confidential report text"),
  ).toBeInTheDocument();
  expect(screen.getByText(/Reported Teacher/)).toBeInTheDocument();
  expect(
    screen.getByText(/Submitted by School Administrator/),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Submit to Admin" }),
  ).not.toBeInTheDocument();
  view.cleanup();
});
test("activity rows open an actual submission instead of showing demo data", async () => {
  (workspaceApi.activity as jest.Mock).mockResolvedValue({
    submissions: [
      {
        _id: "submission",
        status: "submitted",
        homeworkId: { _id: "task", title: "Actual submitted work" },
        studentId: { username: "Jordan" },
      },
    ],
    reviews: [],
    autoGraded: [],
  });
  // The detail request fails here; the row must still open its real data destination.
  const view = mount(<AdminWorkspacePanel />);
  const section = screen
    .getByRole("heading", { name: "Recent Submissions" })
    .closest("section")!;
  fireEvent.click(
    await within(section).findByRole("button", {
      name: /Actual submitted work/,
    }),
  );
  expect(await screen.findByRole("dialog")).toHaveAccessibleName(
    "Assignment submission",
  );
  view.cleanup();
});

test("Admin student behavior form uses a roster student and the selected visibility", async () => {
  const view = mount(
    <QuickActionDialog action="behavior" onClose={jest.fn()} />,
  );
  await screen.findByRole("option", { name: /Actual Teacher/ });
  fireEvent.change(screen.getByLabelText("Class"), {
    target: { value: "class" },
  });
  await screen.findByRole("option", { name: /Jordan/ });
  fireEvent.change(screen.getByLabelText("Student"), {
    target: { value: "student" },
  });
  fireEvent.change(screen.getByLabelText("Message"), {
    target: { value: "Helpful in class" },
  });
  fireEvent.change(screen.getByLabelText("Behavior type"), {
    target: { value: "positive" },
  });
  fireEvent.click(screen.getByRole("checkbox", { name: /Visible to/ }));
  fireEvent.click(screen.getByRole("button", { name: "Save" }));
  await waitFor(() =>
    expect(workspaceApi.save).toHaveBeenCalledWith("behavior", {
      classId: "class",
      studentId: "student",
      message: "Helpful in class",
      state: "positive",
      parentVisible: false,
    }),
  );
  view.cleanup();
});

test("assessment review publishes only after a successful review request", async () => {
  const result = {
    _id: "result",
    studentId: { username: "Jordan" },
    quizId: { _id: "quiz", title: "Fractions" },
    score: 1,
    gradeStatus: "pending_review",
    progress: { totalQuestions: 2 },
    answers: [{ question: "One?", selectedAnswer: "Yes", isCorrect: true }],
  };
  (workspaceApi.activity as jest.Mock).mockResolvedValue({
    submissions: [],
    reviews: [result],
    autoGraded: [],
  });
  (workspaceApi.result as jest.Mock).mockResolvedValue({
    result,
    quiz: { title: "Fractions" },
  });
  (workspaceApi.reviewResult as jest.Mock).mockResolvedValue({});
  (workspaceApi.releaseResult as jest.Mock).mockResolvedValue({});
  const view = mount(<AdminWorkspacePanel />);
  fireEvent.click(await screen.findByRole("button", { name: /Fractions/ }));
  await screen.findByLabelText("Score (out of 2)");
  fireEvent.change(screen.getByLabelText("Score (out of 2)"), {
    target: { value: "2" },
  });
  fireEvent.change(screen.getByLabelText("Reason for changing the score"), {
    target: { value: "Accepted equivalent answer" },
  });
  fireEvent.click(screen.getByRole("checkbox", { name: /Publish grade/ }));
  fireEvent.click(screen.getByRole("button", { name: "Review & publish" }));
  await waitFor(() =>
    expect(workspaceApi.reviewResult).toHaveBeenCalledWith("result", {
      score: 2,
      feedback: "",
      reason: "Accepted equivalent answer",
    }),
  );
  await waitFor(() =>
    expect(workspaceApi.releaseResult).toHaveBeenCalledWith("result"),
  );
  expect(
    (workspaceApi.reviewResult as jest.Mock).mock.invocationCallOrder[0],
  ).toBeLessThan(
    (workspaceApi.releaseResult as jest.Mock).mock.invocationCallOrder[0],
  );
  view.cleanup();
});
