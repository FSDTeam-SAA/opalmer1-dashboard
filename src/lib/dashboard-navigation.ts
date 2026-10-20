/** Return the nearest parent page that exists in the dashboard route tree. */
export function getDashboardBackHref(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);
  const root = segments[0];
  if (root !== "admin" && root !== "administrator") return null;
  if (
    segments.length === 1 ||
    (segments.length === 2 && segments[1] === "dashboard")
  ) {
    return null;
  }
  if (segments.length === 2) return `/${root}/dashboard`;

  // Quiz and attempt routes have no intermediate quizzes/students index page.
  if (
    /\/quizzes\/[^/]+\/students\/[^/]+\/?$/.test(pathname) ||
    /\/quizzes\/[^/]+\/?$/.test(pathname)
  ) {
    return `/${segments.slice(0, -2).join("/")}`;
  }
  return `/${segments.slice(0, -1).join("/")}`;
}
