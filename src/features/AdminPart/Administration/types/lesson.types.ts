export type LessonDocument = {
  public_id: string;
  url: string;
};

export type LessonStudent = {
  _id: string;
  username: string;
  role: string;
  type: string;
};

export type LessonTeacher = {
  _id: string;
  username: string;
  role: string;
  type: string;
};

export type LessonClass = {
  _id: string;
  grade: number;
  subject: string;
};

export type LessonData = {
  _id: string;
  studentId: LessonStudent;
  teacherId: LessonTeacher;
  classId: LessonClass;
  title: string;
  objective: string;
  note: string;
  document: LessonDocument;
  isArchived: boolean;
  created_at: string;
  updated_at: string;
};

export type LessonResponse = {
  success: boolean;
  message: string;
  data: LessonData[];
};

export type SingleLessonResponse = {
  success: boolean;
  message: string;
  data: LessonData;
};
