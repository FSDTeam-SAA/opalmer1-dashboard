import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { StudentsView } from "./StudentsView";
import { TeachersView } from "./TeachersView";

jest.mock("@/lib/api", () => ({ api: { get: jest.fn(), put: jest.fn() } }));
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock("@/components/sheard/PageHeader", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("./CreateStudentModal", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("./CreateTeacherModal", () => ({
  __esModule: true,
  default: () => null,
}));

test.each(["student", "teacher"])(
  "%s edit preserves saved age, gender and grade through API and row mapping",
  async (type) => {
    jest.clearAllMocks();
    (api.put as jest.Mock).mockResolvedValue({ data: { data: {} } });
    (api.get as jest.Mock).mockResolvedValue({
      data: {
        data: [
          {
            _id: "saved-user",
            username: "Saved User",
            Id: "saved-id",
            email: "saved@example.com",
            phoneNumber: "01234567890",
            age: 12,
            gender: "female",
            gradeLevel: "6",
            state: "active",
          },
        ],
      },
    });
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const view = render(
      <QueryClientProvider client={client}>
        {type === "student" ? <StudentsView /> : <TeachersView />}
      </QueryClientProvider>,
    );
    fireEvent.click(await screen.findByRole("button", { name: "Edit" }));
    expect(screen.getByDisplayValue("Saved User")).toBeInTheDocument();
    expect(screen.getByDisplayValue("saved@example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("01234567890")).toBeInTheDocument();
    expect(screen.getByDisplayValue("12")).toBeInTheDocument();
    expect(screen.getByDisplayValue("6")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Female")).toHaveValue("female");
    fireEvent.change(screen.getByDisplayValue("12"), {
      target: { value: "13" },
    });
    fireEvent.change(screen.getByDisplayValue("Female"), {
      target: { value: "male" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));
    await waitFor(() =>
      expect(api.put).toHaveBeenCalledWith("/users/saved-user", {
        age: 13,
        gender: "male",
      }),
    );
    view.unmount();
    client.clear();
  },
);
