/* ───── Teacher Types ───── */

export type TeacherListItem = {
  id: string | number;
  name: string;
  teacherId: string;
  gradeLevel: string;
  subjects: string;
  state: string;
  image: string;
};

export type TeacherProfile = {
  id: string | number;
  name: string;
  email: string;
  username: string;
  image: string;
  active: boolean;
  subjects: string[];
  grades: GradeCard[];
  quizzes: Quiz[];
};

export type GradeCard = {
  id: string | number;
  name: string;
  date: string;
  students: number;
  attendance: string;
  performance: string;
  color: "red" | "yellow" | "green" | "teal" | "blue" | "amber";
};

export type SubjectStat = {
  id: string | number;
  name: string;
  attendance: string;
  progress: string;
  progressPercent: number;
  color: string;
};

export type TeacherGradesData = {
  grades: GradeCard[];
  subjects: SubjectStat[];
};

export type Quiz = {
  id: string | number;
  title: string;
  questions: number;
  duration: string;
  image: string;
};

export type AttendedStudent = {
  id: string | number;
  name: string;
  grade: string;
  age: number;
  startProgress: number;
  endProgress: number;
  image: string;
  color: string;
};

export type QuestionResult = {
  id: string | number;
  question: string;
  options: string[];
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
};

export type QuizAttempt = {
  student: {
    id: string | number;
    name: string;
    grade: string;
    age: number;
    phone: string;
    image: string;
  };
  totalQuestions: number;
  correctAnswers: number;
  progress: number;
  questions: QuestionResult[];
};
