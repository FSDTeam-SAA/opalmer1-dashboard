const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function refreshAccessToken(refreshToken: string) {
  const res = await fetch(`${baseUrl}/auth/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await res.json();
  return data;
}
