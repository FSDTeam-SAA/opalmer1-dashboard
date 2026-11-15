import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CreateSchoolModal from "./CreateSchoolModal";
import { api } from "@/lib/api";

const mockCreate = jest.fn();
jest.mock("../hooks/useSchools", () => ({
  useCreateSchool: () => ({ mutateAsync: mockCreate, isPending: false }),
  useUpdateSchool: () => ({ isPending: false }),
}));
jest.mock("@/lib/api", () => ({ api: { get: jest.fn() } }));

test.each([
  ["Dhaka", { districtId: "district-1" }],
  ["  New District  ", { districtName: "New District" }],
  ["", { districtId: "" }],
])(
  "school accepts selected, typed or blank district: %s",
  async (district, expected) => {
    mockCreate.mockReset().mockResolvedValue({});
    (api.get as jest.Mock).mockResolvedValue({
      data: { data: [{ _id: "district-1", name: "Dhaka", code: "DHK" }] },
    });
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const close = jest.fn();
    const view = render(
      <QueryClientProvider client={client}>
        <CreateSchoolModal onClose={close} />
      </QueryClientProvider>,
    );
    await waitFor(() =>
      expect(
        document.querySelector('datalist option[value="Dhaka"]'),
      ).toBeInTheDocument(),
    );
    fireEvent.change(screen.getByPlaceholderText("Enter school name *"), {
      target: { value: "Example School" },
    });
    fireEvent.change(screen.getByLabelText("District"), {
      target: { value: district },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create School" }));
    await waitFor(() =>
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Example School", ...expected }),
      ),
    );
    await waitFor(() => expect(close).toHaveBeenCalled());
    view.unmount();
    client.clear();
  },
);
