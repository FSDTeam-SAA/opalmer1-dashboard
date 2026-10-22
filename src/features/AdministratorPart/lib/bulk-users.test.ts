import { parseUserCsv, userCsvColumns } from "./bulk-users";

it.each(["student", "teacher", "parent"] as const)(
  "parses required %s fields and preserves IDs",
  (type) => {
    expect(
      parseUserCsv(
        '\uFEFFusername,Id,password,phoneNumber\r\n"User, One",0001,secret,01234',
        type,
      ),
    ).toEqual([
      expect.objectContaining({
        username: "User, One",
        Id: "0001",
        password: "secret",
        phoneNumber: "01234",
      }),
    ]);
  },
);

it.each([
  ["username,Id\nA,1", "password"],
  ["username,Id,password\nA,1,", "required"],
  ["username,Id,password\nA,1,x\nB,1,y", "Duplicate ID"],
  ["username,Id,password,email\nA,1,x,invalid", "email"],
  ["username,Id,password,gradeLevel\nA,1,x,99", "gradeLevel"],
  ["username,Id,password,gender\nA,1,x,unknown", "Gender"],
  ["username,Id,password,role\nA,1,x,admin", "Invalid"],
])("rejects invalid CSV %s", (csv, message) =>
  expect(() => parseUserCsv(csv, "student")).toThrow(message),
);

it("uses a parent template without student fields", () => {
  expect(userCsvColumns("parent")).toEqual([
    "username",
    "Id",
    "password",
    "email",
    "phoneNumber",
  ]);
});
