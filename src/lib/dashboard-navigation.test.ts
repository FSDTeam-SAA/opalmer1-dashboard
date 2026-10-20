import { readdirSync } from "node:fs";
import path from "node:path";
import { getDashboardBackHref } from "./dashboard-navigation";

function pagesIn(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory()
      ? pagesIn(fullPath)
      : entry.name === "page.tsx"
        ? [fullPath]
        : [];
  });
}

test("every dashboard page has a back destination that is an existing page", () => {
  const app = path.join(process.cwd(), "src/app");
  const routes = pagesIn(app).map(
    (file) =>
      "/" +
      path
        .relative(app, file)
        .split(path.sep)
        .filter((part) => !part.startsWith("(") && part !== "page.tsx")
        .join("/"),
  );
  const dashboardRoutes = routes.filter((route) =>
    /^\/(admin|administrator)\//.test(route),
  );
  expect(dashboardRoutes.length).toBeGreaterThan(20);
  for (const route of dashboardRoutes) {
    const destination = getDashboardBackHref(route);
    if (route.endsWith("/dashboard")) expect(destination).toBeNull();
    else expect(routes).toContain(destination);
  }
});

test("quiz attempts skip index routes that do not exist", () => {
  expect(
    getDashboardBackHref(
      "/admin/administration/a/teachers/t/quizzes/q/students/s",
    ),
  ).toBe("/admin/administration/a/teachers/t/quizzes/q");
  expect(
    getDashboardBackHref("/admin/administration/a/teachers/t/quizzes/q"),
  ).toBe("/admin/administration/a/teachers/t");
});
