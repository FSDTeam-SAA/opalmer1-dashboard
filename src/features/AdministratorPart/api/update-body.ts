/**
 * PUT /users/:id accepts JSON, or multipart/form-data when a new profile
 * photo is attached (field name "image"). Build whichever the payload needs.
 */
export function toUserUpdateBody(
  payload: Record<string, unknown> & { image?: File | null },
): FormData | Record<string, unknown> {
  const { image, ...fields } = payload;
  if (!image) return fields;
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined && value !== null) form.append(key, String(value));
  }
  form.append("image", image);
  return form;
}
