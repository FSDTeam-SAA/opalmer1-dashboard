import { parseCsvRows } from "@/features/AdminPart/School/lib/school-bulk";
import type { BulkUserPayload, SchoolUserType } from "../api/bulk-users.api";

export function userCsvColumns(type: SchoolUserType) {
  return [
    "username",
    "Id",
    "password",
    "email",
    "phoneNumber",
    ...(type === "parent" ? [] : ["gradeLevel", "age", "gender"]),
  ];
}

export function parseUserCsv(
  text: string,
  type: SchoolUserType,
): BulkUserPayload[] {
  const rows = parseCsvRows(text);
  const headers = rows.shift() ?? [];
  if (!["username", "Id", "password"].every((h) => headers.includes(h)))
    throw new Error("CSV must include username, Id and password columns.");
  if (
    new Set(headers).size !== headers.length ||
    headers.some((h) => !userCsvColumns(type).includes(h))
  )
    throw new Error("Invalid or duplicate columns. Use the CSV template.");
  if (!rows.length || rows.length > 500)
    throw new Error("Upload between 1 and 500 users at a time.");
  const ids = new Set<string>();
  return rows.map((values, index) => {
    const fail = (message: string): never => {
      throw new Error(`Row ${index + 2}: ${message}`);
    };
    if (values.length !== headers.length)
      fail("Column count does not match header.");
    const fields = Object.fromEntries(headers.map((h, i) => [h, values[i]]));
    if (!fields.username || !fields.Id || !fields.password)
      fail("Name, ID and password are required.");
    if (ids.has(fields.Id.toLowerCase())) fail("Duplicate ID in file.");
    ids.add(fields.Id.toLowerCase());
    if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
      fail("Invalid email address.");
    if (fields.gender && !["male", "female", "other"].includes(fields.gender))
      fail("Gender must be male, female or other.");
    for (const [key, min, max] of [
      ["gradeLevel", 1, 12],
      ["age", 1, 120],
    ] as const) {
      if (
        fields[key] &&
        (!/^\d+$/.test(fields[key]) ||
          Number(fields[key]) < min ||
          Number(fields[key]) > max)
      )
        fail(`${key} must be between ${min} and ${max}.`);
    }
    return {
      username: fields.username,
      Id: fields.Id,
      password: fields.password,
      email: fields.email || undefined,
      phoneNumber: fields.phoneNumber || undefined,
      gradeLevel: fields.gradeLevel ? Number(fields.gradeLevel) : undefined,
      age: fields.age ? Number(fields.age) : undefined,
      gender: (fields.gender as BulkUserPayload["gender"]) || undefined,
    };
  });
}
