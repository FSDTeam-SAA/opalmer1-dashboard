import { render, screen } from "@testing-library/react";
import { useStudentDetails } from "../hooks/useStudents";
import StudentProfileView from "./StudentProfileView";

jest.mock("../hooks/useStudents", () => ({ useStudentDetails: jest.fn() }));
jest.mock("@/components/sheard/PageHeader", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("next/image", () => ({
  __esModule: true,

  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} alt={props.alt} />
  ),
}));

const data = {
  student: {
    _id: "s1",
    username: "Actual Student",
    Id: "students-1",
    avatar: { url: "https://example.com/student.jpg" },
  },
  overall: { attendance: 0, progress: 0 },
  parent: {
    parentId: {
      username: "Actual Parent",
      avatar: { url: "https://example.com/parent.jpg" },
    },
  },
  subjects: [
    {
      classId: "c1",
      subject: "Math",
      attendance: 0,
      progress: 0,
      teacher: {
        username: "Actual Teacher",
        avatar: { url: "https://example.com/teacher.jpg" },
      },
    },
  ],
};

test("student, linked parent and teacher photos all use their API URLs", () => {
  (useStudentDetails as jest.Mock).mockReturnValue({ data });
  render(<StudentProfileView studentId="s1" />);
  expect(screen.getByRole("img", { name: "student" })).toHaveAttribute(
    "src",
    data.student.avatar.url,
  );
  expect(screen.getByRole("img", { name: "parent" })).toHaveAttribute(
    "src",
    data.parent.parentId.avatar.url,
  );
  expect(screen.getByRole("img", { name: "teacher" })).toHaveAttribute(
    "src",
    data.subjects[0].teacher.avatar.url,
  );
  expect(screen.getByText("Actual Parent")).toBeInTheDocument();
});

test("missing parent and photos show honest empty states", () => {
  (useStudentDetails as jest.Mock).mockReturnValue({
    data: {
      ...data,
      student: { ...data.student, avatar: null },
      parent: null,
      subjects: [],
    },
  });
  const { container } = render(<StudentProfileView studentId="s1" />);
  expect(screen.getByText("No parent linked")).toBeInTheDocument();
  expect(container.querySelector("img")).toBeNull();
});
