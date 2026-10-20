import { fireEvent, render, screen } from "@testing-library/react";
import ParentPicker from "./ParentPicker";
import { useParents } from "../hooks/useParents";

jest.mock("../hooks/useParents", () => ({ useParents: jest.fn() }));
const parents = [
  {
    _id: "p1",
    name: "Fahim",
    parentId: "parent-101",
    email: "fahim@example.com",
    active: true,
  },
  {
    _id: "p2",
    name: "Tahsin",
    parentId: "parent-202",
    email: "tahsin@example.com",
    active: true,
  },
  {
    _id: "p3",
    name: "No Email",
    parentId: "parent-303",
    email: "—",
    active: true,
  },
  {
    _id: "p4",
    name: "Inactive Parent",
    parentId: "parent-404",
    email: "inactive@example.com",
    active: false,
  },
];
beforeEach(() =>
  (useParents as jest.Mock).mockReturnValue({
    data: parents,
    isLoading: false,
    isError: false,
  }),
);

test("shows all parents, including disabled accounts without an email or active status", () => {
  const onChange = jest.fn();
  render(<ParentPicker value={null} onChange={onChange} />);
  fireEvent.click(screen.getByRole("button", { name: "Show all parents" }));
  expect(screen.getAllByRole("option")).toHaveLength(4);
  expect(screen.getByRole("option", { name: /No Email/ })).toBeDisabled();
  expect(
    screen.getByRole("option", { name: /Inactive Parent/ }),
  ).toBeDisabled();
  fireEvent.click(screen.getByRole("option", { name: /Fahim/ }));
  expect(onChange).toHaveBeenCalledWith(parents[0]);
  expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
});

test.each(["Tahsin", "parent-202", "tahsin@example.com"])(
  "searches parents by %s",
  (query) => {
    render(<ParentPicker value={null} onChange={jest.fn()} />);
    fireEvent.change(screen.getByRole("combobox", { name: "Parent" }), {
      target: { value: query },
    });
    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(screen.getByRole("option", { name: /Tahsin/ })).toBeInTheDocument();
  },
);

test("shows an empty result and supports keyboard selection", () => {
  const onChange = jest.fn();
  render(<ParentPicker value={null} onChange={onChange} />);
  const input = screen.getByRole("combobox", { name: "Parent" });
  fireEvent.change(input, { target: { value: "unknown" } });
  expect(screen.getByText("No matching parents found.")).toBeInTheDocument();
  fireEvent.change(input, { target: { value: "" } });
  fireEvent.keyDown(input, { key: "ArrowUp" });
  fireEvent.keyDown(input, { key: "Enter" });
  expect(onChange).toHaveBeenLastCalledWith(parents[1]);
});

test("failed parent loading can be retried", () => {
  const refetch = jest.fn();
  (useParents as jest.Mock).mockReturnValue({ isError: true, refetch });
  render(<ParentPicker value={null} onChange={jest.fn()} />);
  fireEvent.click(screen.getByRole("button", { name: "Retry" }));
  expect(refetch).toHaveBeenCalled();
});
