import type {
  TeacherListItem,
  TeacherProfile,
  TeacherGradesData,
  AttendedStudent,
  QuizAttempt,
} from "@/types/teacher.types";

// TODO: backend — replace mock data with real API calls using `api` from "@/lib/api"

/* ───── Mock Data ───── */

const mockTeachers: TeacherListItem[] = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  name: "Eren Yaeger",
  teacherId: "eren_yaeger",
  gradeLevel: "06",
  subjects: "Math, English",
  state: i === 0 ? "MD" : "Tx",
  image: "/images/4f8da1b70693c4fcf9e01b9293706aed5cd4e34d.jpg",
}));

const mockTeacherProfile: TeacherProfile = {
  id: 1,
  name: "Olivia Carter",
  email: "oliviacarter@gmail.com",
  username: "eren_yaeger",
  image: "/images/12043465729ab7c8ceffce00749e7c71df0c9e25.jpg",
  active: true,
  subjects: ["Math", "Physics", "English"],
  grades: [
    {
      id: 1,
      name: "Grade 6",
      date: "6/6/25",
      students: 28,
      attendance: "92%",
      performance: "85%",
      color: "red",
    },
    {
      id: 2,
      name: "Grade 6",
      date: "6/6/25",
      students: 28,
      attendance: "92%",
      performance: "85%",
      color: "yellow",
    },
    {
      id: 3,
      name: "Grade 6",
      date: "6/6/25",
      students: 28,
      attendance: "92%",
      performance: "85%",
      color: "green",
    },
    {
      id: 4,
      name: "Grade 6",
      date: "6/6/25",
      students: 28,
      attendance: "92%",
      performance: "85%",
      color: "teal",
    },
    {
      id: 5,
      name: "Grade 6",
      date: "6/6/25",
      students: 28,
      attendance: "92%",
      performance: "85%",
      color: "amber",
    },
  ],
  quizzes: [
    {
      id: 1,
      title: "Fractions and Decimals",
      questions: 10,
      duration: "5 min",
      image: "/images/12043465729ab7c8ceffce00749e7c71df0c9e25.jpg",
    },
    {
      id: 2,
      title: "Mean and Median",
      questions: 10,
      duration: "5 min",
      image: "/images/12043465729ab7c8ceffce00749e7c71df0c9e25.jpg",
    },
    {
      id: 3,
      title: "Fractions and Decimals",
      questions: 10,
      duration: "5 min",
      image: "/images/12043465729ab7c8ceffce00749e7c71df0c9e25.jpg",
    },
    {
      id: 4,
      title: "Mean and Median",
      questions: 10,
      duration: "5 min",
      image: "/images/12043465729ab7c8ceffce00749e7c71df0c9e25.jpg",
    },
    {
      id: 5,
      title: "Fractions and Decimals",
      questions: 10,
      duration: "5 min",
      image: "/images/12043465729ab7c8ceffce00749e7c71df0c9e25.jpg",
    },
    {
      id: 6,
      title: "Mean and Median",
      questions: 10,
      duration: "5 min",
      image: "/images/12043465729ab7c8ceffce00749e7c71df0c9e25.jpg",
    },
  ],
};

const borderColors = [
  "#871dad",
  "#4aa678",
  "#febd43",
  "#3f99b4",
  "#e64540",
  "#6366f1",
];

const mockAttendedStudents: AttendedStudent[] = Array.from(
  { length: 12 },
  (_, i) => ({
    id: i + 1,
    name: "Mia Johnson",
    grade: "Grade 6",
    age: 12,
    startProgress: 0,
    endProgress: 93,
    image: "/images/12043465729ab7c8ceffce00749e7c71df0c9e25.jpg",
    color: borderColors[i % borderColors.length],
  }),
);

const mockQuizAttempt: QuizAttempt = {
  student: {
    id: 1,
    name: "Mia johnson",
    grade: "Grade 6",
    age: 12,
    phone: "+1 301 381 7702",
    image: "/images/12043465729ab7c8ceffce00749e7c71df0c9e25.jpg",
  },
  totalQuestions: 8,
  correctAnswers: 7,
  progress: 85,
  questions: [
    {
      id: 1,
      question: "What is 1/2 as a decimal?",
      options: ["A. 0.5", "B. 0.25", "C. 0.75", "D. 1.0"],
      selectedAnswer: "0.5",
      correctAnswer: "0.5",
      isCorrect: true,
    },
    {
      id: 2,
      question: "What is 0.75 as a fraction?",
      options: ["A. 3/4", "B. 1/2", "C. 2/5", "D. 5/8"],
      selectedAnswer: "1/2",
      correctAnswer: "3/4",
      isCorrect: false,
    },
    {
      id: 3,
      question: "What is 7/10 as a decimal?",
      options: ["A. 0.7", "B. 0.07", "C. 7.0", "D. 0.71"],
      selectedAnswer: "0.7",
      correctAnswer: "0.7",
      isCorrect: true,
    },
    {
      id: 4,
      question: "Convert 0.2 into a fraction.",
      options: ["A. 1/5", "B. 2/5", "C. 1/2", "D. 1/4"],
      selectedAnswer: "1/5",
      correctAnswer: "1/5",
      isCorrect: true,
    },
    {
      id: 5,
      question: "Which decimal is equal to 3/4?",
      options: ["A. 0.25", "B. 0.5", "C. 0.75", "D. 1.0"],
      selectedAnswer: "0.75",
      correctAnswer: "0.75",
      isCorrect: true,
    },
    {
      id: 6,
      question: "What is 5/10 as a decimal?",
      options: ["A. 0.5", "B. 5.0", "C. 0.05", "D. 0.55"],
      selectedAnswer: "0.5",
      correctAnswer: "0.5",
      isCorrect: true,
    },
    {
      id: 7,
      question: "Which fraction is equal to 0.2?",
      options: ["A. 1/5", "B. 1/2", "C. 2/10", "D. Both A and C"],
      selectedAnswer: "Both A and C",
      correctAnswer: "Both A and C",
      isCorrect: true,
    },
    {
      id: 8,
      question: "Which of these decimals is smallest?",
      options: ["A. 0.1", "B. 0.01", "C. 0.5", "D. 0.25"],
      selectedAnswer: "0.01",
      correctAnswer: "0.01",
      isCorrect: true,
    },
  ],
};

const mockTeacherGrades: TeacherGradesData = {
  grades: [
    {
      id: 1,
      name: "Grade 6",
      date: "6/6/25",
      students: 28,
      attendance: "92%",
      performance: "85%",
      color: "red",
    },
    {
      id: 2,
      name: "Grade 6",
      date: "6/6/25",
      students: 28,
      attendance: "92%",
      performance: "85%",
      color: "yellow",
    },
    {
      id: 3,
      name: "Grade 6",
      date: "6/6/25",
      students: 28,
      attendance: "92%",
      performance: "85%",
      color: "green",
    },
    {
      id: 4,
      name: "Grade 6",
      date: "6/6/25",
      students: 28,
      attendance: "92%",
      performance: "85%",
      color: "teal",
    },
    {
      id: 5,
      name: "Grade 6",
      date: "6/6/25",
      students: 28,
      attendance: "92%",
      performance: "85%",
      color: "amber",
    },
    {
      id: 6,
      name: "Grade 6",
      date: "6/6/25",
      students: 28,
      attendance: "92%",
      performance: "85%",
      color: "green",
    },
  ],
  subjects: [
    {
      id: 1,
      name: "Math",
      attendance: "92%",
      progress: "85%",
      progressPercent: 83,
      color: "#e64540",
    },
    {
      id: 2,
      name: "English",
      attendance: "92%",
      progress: "85%",
      progressPercent: 93,
      color: "#e64540",
    },
    {
      id: 3,
      name: "Physics",
      attendance: "92%",
      progress: "85%",
      progressPercent: 73,
      color: "#e64540",
    },
  ],
};

/* ───── API Functions ───── */

// TODO: backend — GET /api/admin/{adminId}/teachers
export async function fetchTeachers(): Promise<TeacherListItem[]> {
  await new Promise((r) => setTimeout(r, 800));
  return mockTeachers;
}

// TODO: backend — GET /api/admin/{adminId}/teachers/{teacherId}
export async function fetchTeacherProfile(
  teacherId: string,
): Promise<TeacherProfile> {
  await new Promise((r) => setTimeout(r, 800));
  return { ...mockTeacherProfile, id: Number(teacherId) || 1 };
}

// TODO: backend — GET /api/admin/{adminId}/teachers/{teacherId}/grades
export async function fetchTeacherGrades(
  teacherId: string,
): Promise<TeacherGradesData> {
  await new Promise((r) => setTimeout(r, 800));
  return mockTeacherGrades;
}

// TODO: backend — GET /api/admin/{adminId}/teachers/{teacherId}/quizzes/{quizId}/students
export async function fetchAttendedStudents(
  quizId: string,
): Promise<AttendedStudent[]> {
  await new Promise((r) => setTimeout(r, 800));
  return mockAttendedStudents;
}

// TODO: backend — GET /api/admin/{adminId}/teachers/{teacherId}/quizzes/{quizId}/students/{studentId}
export async function fetchQuizAttempt(
  quizId: string,
  studentId: string,
): Promise<QuizAttempt> {
  await new Promise((r) => setTimeout(r, 800));
  return mockQuizAttempt;
}
