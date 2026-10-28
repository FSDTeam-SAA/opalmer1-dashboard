import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import BulkSchoolUpload from "./BulkSchoolUpload";
import { api } from "@/lib/api";

const invalidateQueries = jest.fn();
jest.mock("@/lib/api", () => ({ api: { post: jest.fn() } }));
jest.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({ invalidateQueries }),
  useQuery: () => ({
    data: [{ _id: "district", name: "North District", code: "NORTH" }],
  }),
}));
jest.mock("../hooks/useSchools", () => ({ schoolKeys: { all: ["schools"] } }));

const csv = "name,code,districtCode\nAlpha,A,NORTH\nInvalid,B,MISSING";
const rows = [
  {
    row: 2,
    values: { name: "Alpha", code: "A", districtCode: "NORTH" },
    status: "ready",
  },
  {
    row: 3,
    values: { name: "Invalid", code: "B", districtCode: "MISSING" },
    status: "error",
    error: "Unknown district code",
  },
];
function selectFile() {
  fireEvent.change(screen.getByLabelText("Choose CSV file"), {
    target: { files: [{ size: csv.length, text: async () => csv }] },
  });
}
beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(api.post).mockReset();
});

it("previews on the server before explicit commit and prevents resubmitting created records", async () => {
  jest
    .mocked(api.post)
    .mockResolvedValueOnce({
      data: {
        data: {
          committed: false,
          total: 2,
          ready: 1,
          failed: 1,
          created: 0,
          rows,
        },
      },
    })
    .mockResolvedValueOnce({
      data: {
        data: {
          committed: true,
          total: 2,
          ready: 0,
          failed: 1,
          created: 1,
          rows: [{ ...rows[0], status: "created" }, rows[1]],
        },
      },
    });
  render(<BulkSchoolUpload onClose={jest.fn()} />);
  expect(screen.getByText("NORTH - North District")).toBeInTheDocument();
  expect(screen.getByText("Confirm import of valid rows")).toBeDisabled();
  selectFile();
  await screen.findByText("1 ready; 1 failed; 2 total.");
  expect(api.post).toHaveBeenCalledTimes(1);
  expect(api.post).toHaveBeenLastCalledWith("/school/import", {
    csv,
    kind: "schools",
    commit: false,
  });
  expect(screen.getByText("Unknown district code")).toBeInTheDocument();
  fireEvent.click(screen.getByText("Confirm import of valid rows"));
  await screen.findByText("1 created; 1 failed; 2 total.");
  expect(api.post).toHaveBeenLastCalledWith("/school/import", {
    csv,
    kind: "schools",
    commit: true,
  });
  expect(screen.getByText("Confirm import of valid rows")).toBeDisabled();
  expect(screen.getByText("Download error report")).toBeInTheDocument();
  await waitFor(() =>
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["school-districts"],
    }),
  );
});

it("requires a new preview after a lost commit response instead of blindly retrying", async () => {
  jest
    .mocked(api.post)
    .mockResolvedValueOnce({
      data: { data: { committed: false, total: 2, ready: 1, failed: 1, rows } },
    })
    .mockRejectedValueOnce(new Error("Network disconnected"));
  render(<BulkSchoolUpload onClose={jest.fn()} />);
  selectFile();
  await screen.findByText("1 ready; 1 failed; 2 total.");
  fireEvent.click(screen.getByText("Confirm import of valid rows"));
  await screen.findByRole("alert");
  expect(screen.getByText("Confirm import of valid rows")).toBeDisabled();
  expect(screen.getByText("Preview again")).toBeEnabled();
  fireEvent.change(screen.getByLabelText("Upload type"), {
    target: { value: "districts" },
  });
  expect(screen.queryByText("Preview again")).not.toBeInTheDocument();
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});
