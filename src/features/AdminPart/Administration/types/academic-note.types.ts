export type AcademicDocumentFile = {
  public_id: string;
  url: string;
};

export type AcademicDocumentStudent = {
  _id: string;
  username: string;
  Id: string;
  gradeLevel: number;
};

export type AcademicDocumentClass = {
  _id: string;
  grade: number;
  subject: string;
};

export type AcademicDocumentSchool = {
  _id: string;
  name: string;
};

export type AcademicDocumentData = {
  _id: string;
  document: AcademicDocumentFile;
  studentId: AcademicDocumentStudent;
  teacherId: string;
  classId: AcademicDocumentClass;
  schoolId: AcademicDocumentSchool;
  created_at: string;
  updated_at: string;
};

export type AcademicDocumentResponse = {
  success: boolean;
  message: string;
  data: AcademicDocumentData[];
};
