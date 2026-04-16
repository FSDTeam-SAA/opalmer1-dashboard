export type AdministratorAvatar = {
  public_id: string;
  url: string;
};

export type Administrator = {
  _id: string;
  username: string;
  phoneNumber: string;
  state: "active" | "inactive";
  avatar: AdministratorAvatar;
  created_at: string;
};

export type AdministratorsResponse = {
  success: boolean;
  message: string;
  data: Administrator[];
};
