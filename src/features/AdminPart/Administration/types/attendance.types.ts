export type AttendanceClass = {
  _id: string;
  subject: string;
};

export type AttendanceRecord = {
  _id: string;
  classId: AttendanceClass;
  status: "present" | "absent";
  date: string;
};

export type AttendanceResponse = {
  success: boolean;
  message: string;
  data: AttendanceRecord[];
};

export type AttendanceRequestBody = {
  studentId: string;
  classId: string;
};
