import { fireEvent, render, screen } from "@testing-library/react";
import DataImage from "./data-image";

jest.mock("next/image", () => ({
  __esModule: true,

  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} alt={props.alt} />
  ),
}));

test("missing photos show a neutral icon without requesting a stock image", () => {
  const { container } = render(
    <DataImage src="" alt="Student" width={50} height={50} />,
  );
  expect(
    screen.getByRole("img", { name: "Student unavailable" }),
  ).toBeInTheDocument();
  expect(container.querySelector("img")).toBeNull();
});

test("renders the supplied photo and falls back to an icon on failure; a new photo loads normally", () => {
  const view = render(
    <DataImage
      src="https://example.com/student.jpg"
      alt="Student"
      width={50}
      height={50}
    />,
  );
  expect(screen.getByRole("img", { name: "Student" })).toHaveAttribute(
    "src",
    "https://example.com/student.jpg",
  );
  fireEvent.error(screen.getByRole("img", { name: "Student" }));
  expect(
    screen.getByRole("img", { name: "Student unavailable" }),
  ).toBeInTheDocument();
  view.rerender(
    <DataImage
      src="https://example.com/new.jpg"
      alt="Student"
      width={50}
      height={50}
    />,
  );
  expect(screen.getByRole("img", { name: "Student" })).toHaveAttribute(
    "src",
    "https://example.com/new.jpg",
  );
});
