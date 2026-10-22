import type { CreateSchoolPayload } from "../types/school.types";

export const schoolColumns = [
  "name",
  "code",
  "email",
  "phone",
  "address",
  "city",
  "state",
  "country",
  "postalCode",
  "establishedYear",
] as const;

// CSV supports quoted commas, escaped quotes and multiline fields.
export function parseCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [],
    cell = "",
    quoted = false;
  const source = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < source.length; i++) {
    const c = source[i];
    if (c === '"') {
      if (quoted && source[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (quoted) {
        quoted = false;
        if (source[i + 1] && ![",", "\r", "\n"].includes(source[i + 1]))
          throw new Error("Invalid CSV quoting.");
      } else {
        if (cell) throw new Error("Invalid CSV quoting.");
        quoted = true;
      }
    } else if (c === "," && !quoted) {
      row.push(cell.trim());
      cell = "";
    } else if ((c === "\n" || c === "\r") && !quoted) {
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
      if (c === "\r" && source[i + 1] === "\n") i++;
    } else cell += c;
  }
  if (quoted) throw new Error("Unclosed quote in CSV file.");
  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

export function parseSchoolCsv(text: string): CreateSchoolPayload[] {
  const rows = parseCsvRows(text);
  const headers = rows.shift() ?? [];
  if (!headers.includes("name"))
    throw new Error('CSV must include a "name" column.');
  if (
    new Set(headers).size !== headers.length ||
    headers.some(
      (h) => !schoolColumns.includes(h as (typeof schoolColumns)[number]),
    )
  )
    throw new Error("Invalid or duplicate column. Use the CSV template.");
  if (!rows.length || rows.length > 500)
    throw new Error("Upload between 1 and 500 schools at a time.");
  const names = new Set<string>(),
    codes = new Set<string>();
  return rows.map((values, index) => {
    const fail = (message: string): never => {
      throw new Error(`Row ${index + 2}: ${message}`);
    };
    if (values.length !== headers.length)
      fail("Column count does not match the header.");
    const fields = Object.fromEntries(headers.map((h, i) => [h, values[i]]));
    if (!fields.name) fail("School name is required.");
    if (names.has(fields.name.toLowerCase()))
      fail("Duplicate school name in file.");
    names.add(fields.name.toLowerCase());
    if (fields.code) {
      if (codes.has(fields.code.toLowerCase()))
        fail("Duplicate school code in file.");
      codes.add(fields.code.toLowerCase());
    }
    if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
      fail("Invalid email address.");
    if (
      fields.establishedYear &&
      (!/^\d{4}$/.test(fields.establishedYear) ||
        Number(fields.establishedYear) < 1800)
    )
      fail("Invalid establishment year (minimum 1800).");
    return {
      ...Object.fromEntries(
        Object.entries(fields).filter(
          ([key, value]) => value && key !== "establishedYear",
        ),
      ),
      name: fields.name,
      establishedYear: fields.establishedYear
        ? Number(fields.establishedYear)
        : undefined,
    };
  });
}

export function schoolError(error: unknown): string {
  const response = (error as { response?: { data?: { message?: string } } })
    ?.response;
  return (
    response?.data?.message ||
    (error instanceof Error ? error.message : "Request failed")
  );
}

export async function runSchoolBatch<T>(
  items: T[],
  action: (item: T) => Promise<unknown>,
  onProgress?: (done: number) => void,
) {
  const succeeded: T[] = [],
    failed: { item: T; error: string }[] = [];
  for (const item of items) {
    try {
      await action(item);
      succeeded.push(item);
    } catch (error) {
      failed.push({ item, error: schoolError(error) });
    }
    onProgress?.(succeeded.length + failed.length);
  }
  return { succeeded, failed };
}
