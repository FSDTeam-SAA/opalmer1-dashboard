export type ParentAvatar = {
  public_id: string;
  url: string;
};

export type ParentRecord = {
  _id: string;
  username: string;
  phoneNumber: string;
  Id: string;
  email?: string;
  state?: "active" | "inactive";
  avatar?: ParentAvatar;
};

export type ParentsResponse = {
  success: boolean;
  message: string;
  data: ParentRecord[];
};

export type ParentResponse = {
  success: boolean;
  message: string;
  data: ParentRecord;
};

export type UpdateParentPayload = Partial<{
  username: string;
  phoneNumber: string;
  email: string;
  state: "active" | "inactive";
}>;

export type CreateParentPayload = {
  username: string;
  phoneNumber?: string;
  Id: string;
  password?: string;
  type: "parent";
  schoolId: string;
  image?: File | null;
};
