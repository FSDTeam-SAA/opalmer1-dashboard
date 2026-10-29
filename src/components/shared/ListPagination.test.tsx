import { fireEvent, render, screen, within } from "@testing-library/react";
import { useState } from "react";
import ListPagination, { useListPagination } from "./ListPagination";

function List() {
  const [search, setSearch] = useState("");
  const [count, setCount] = useState(23);
  const items = Array.from(
    { length: count },
    (_, index) => `Record ${index + 1}`,
  ).filter((item) => item.includes(search));
  const pagination = useListPagination(items, search);
  return (
    <>
      <input
        aria-label="Search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <button onClick={() => setCount(10)}>Remove later records</button>
      <ul>
        {pagination.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <ListPagination {...pagination} />
    </>
  );
}

it("reaches the final records and changes page size without losing data", () => {
  render(<List />);
  expect(screen.getByText("Showing 1–10 of 23 records")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
  expect(screen.queryByText("Record 11")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Go to page 3" }));
  expect(screen.getByText("Record 23")).toBeInTheDocument();
  expect(screen.getByText("Showing 21–23 of 23 records")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  fireEvent.change(screen.getByLabelText("Rows per page"), {
    target: { value: "25" },
  });
  expect(
    within(screen.getByRole("list")).getAllByRole("listitem"),
  ).toHaveLength(23);
  expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
});

it("searches across pages, resets search to page one and handles empty results", () => {
  render(<List />);
  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  fireEvent.change(screen.getByLabelText("Search"), {
    target: { value: "Record 23" },
  });
  expect(screen.getByText("Record 23")).toBeInTheDocument();
  expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Search"), {
    target: { value: "missing" },
  });
  expect(screen.getByText("Showing 0–0 of 0 records")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
});

it("returns to a valid page when deleting the last page's records", () => {
  render(<List />);
  fireEvent.click(screen.getByRole("button", { name: "Go to page 3" }));
  fireEvent.click(screen.getByText("Remove later records"));
  expect(screen.getByText("Record 1")).toBeInTheDocument();
  expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
});
