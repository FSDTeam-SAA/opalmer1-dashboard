import { parseSchoolCsv, runSchoolBatch } from "./school-bulk";

describe("school CSV upload", () => {
  it("preserves quoted fields, BOM, leading zeroes and multiline addresses", () => {
    expect(
      parseSchoolCsv(
        '\uFEFFname,code,phone,address,establishedYear\r\n"School ""A"", Dhaka",001,01234,"Road 1\nDhaka",2000\r\n',
      ),
    ).toEqual([
      {
        name: 'School "A", Dhaka',
        code: "001",
        phone: "01234",
        address: "Road 1\nDhaka",
        establishedYear: 2000,
      },
    ]);
  });

  it.each([
    ["code\nABC", "name"],
    ["name,name\nA,B", "duplicate column"],
    ["name,code\n,ABC", "Row 2"],
    ["name\nA\na", "Duplicate school name"],
    ["name,code\nA,X\nB,x", "Duplicate school code"],
    ["name,email\nA,invalid", "Invalid email"],
    ["name,establishedYear\nA,NaN", "Invalid establishment year"],
    ["name,code\nA,X,extra", "Column count"],
    ['name\n"A', "Unclosed quote"],
    ["name\n", "between 1 and 500"],
  ])("rejects invalid CSV %s", (csv, message) => {
    expect(() => parseSchoolCsv(csv)).toThrow(message);
  });
});

it("continues after failures and returns only failed items for retry", async () => {
  const progress = jest.fn();
  const action = jest.fn(async (id: number) => {
    if (id === 2)
      throw { response: { data: { message: "School has linked users" } } };
  });
  const result = await runSchoolBatch([1, 2, 3], action, progress);
  expect(result).toEqual({
    succeeded: [1, 3],
    failed: [{ item: 2, error: "School has linked users" }],
  });
  expect(action).toHaveBeenCalledTimes(3);
  expect(progress.mock.calls).toEqual([[1], [2], [3]]);
});
