export function matchesSubject(
  subject: { classId?: string; _id?: string; subject: string },
  slug: string,
) {
  return (
    (subject.classId ?? subject._id) === slug ||
    subject.subject.toLowerCase().replace(/\s+/g, "-") ===
      decodeURIComponent(slug).toLowerCase()
  );
}
