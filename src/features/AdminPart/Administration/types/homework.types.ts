export type HomeworkFile = {
  public_id: string;
  url: string;
  _id: string;
};

export type HomeworkData = {
  _id: string;
  classId: string;
  userId: string;
  title: string;
  description?: string;
  file: HomeworkFile[];
  archived: boolean;
  created_at: string;
  updated_at: string;
};

export type HomeworkResponse = {
  success: boolean;
  message: string;
  data: HomeworkData[];
};
