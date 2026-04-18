/**
 * Class types.
 *
 * Backend source:
 *   - GET /classes/teacher/:teacherId → class.controller.ts:getClassesByTeacher
 *   - POST /classes                   → class.controller.ts:createClass (teacher-only)
 */

export type ClassTeacherRef =
  | string
  | {
      _id: string;
      username?: string;
      email?: string;
    };

export type ClassRecord = {
  _id: string;
  teacherId: ClassTeacherRef;
  grade: string | number;
  subject: string;
  section?: string;
  schedule?: string;
  created_at?: string;
};

export type ClassesResponse = {
  success: boolean;
  message: string;
  data: ClassRecord[];
};

/**
 * Shape returned by GET /classes/student/:studentId.
 * Backend wraps the classes alongside the student record it looked up.
 */
export type StudentClassesResponse = {
  success: boolean;
  message: string;
  data: {
    student: {
      _id: string;
      username: string;
      email?: string;
      gradeLevel?: string | number;
    };
    classes: ClassRecord[];
  };
};
