export type StudentDetail = {
  _id: string;
  username: string;
  phoneNumber: string;
  Id: string;
  gradeLevel: number;
  age: number;
  avatar?: {
    public_id: string;
    url: string;
  };
};

export type ParentDetail = {
  _id: string;
  parentId: {
    _id: string;
    username: string;
    phoneNumber: string;
    Id: string;
    email: string;
    avatar?: {
      public_id: string;
      url: string;
    };
  };
  childId: string;
  createdAt: string;
  updatedAt: string;
};

export type StudentOverall = {
  attendance: number;
  progress: number;
};

export type StudentSubject = {
  classId: string;
  subject: string;
  attendance: number;
  progress: number;
};

export type StudentDetailsData = {
  student: StudentDetail;
  parent: ParentDetail | null;
  overall: StudentOverall;
  subjects: StudentSubject[];
};

export type StudentDetailsResponse = {
  success: boolean;
  message: string;
  data: StudentDetailsData;
};
