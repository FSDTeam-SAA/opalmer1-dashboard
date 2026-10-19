import { render, screen } from "@testing-library/react";
import PolicyHtmlPreview from "./PolicyHtmlPreview";

test("policy preview renders headings, lists and formatting while discarding active content", () => {
  const { container } = render(
    <PolicyHtmlPreview
      html={
        '<h2>Our Mission</h2><p><strong>Learn together</strong></p><ul><li>Students first</li></ul><script>alert(1)</script><img src=x onerror=alert(1)><a href="javascript:alert(1)">Unsafe link</a>'
      }
    />,
  );
  expect(
    screen.getByRole("heading", { name: "Our Mission" }),
  ).toBeInTheDocument();
  expect(screen.getByText("Learn together").tagName).toBe("STRONG");
  expect(screen.getByRole("listitem")).toHaveTextContent("Students first");
  expect(container.querySelector("script, img")).toBeNull();
  expect(screen.getByText("Unsafe link")).not.toHaveAttribute("href");
});
