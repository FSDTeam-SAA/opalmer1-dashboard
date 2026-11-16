import axios from "axios";
import { getSession, signOut } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// getSession() is a network round-trip to /api/auth/session (and broadcasts a
// session event to other tabs). Calling it before every API request made each
// page load wait on N extra requests, so cache the token briefly and share a
// single in-flight lookup between concurrent requests.
const TOKEN_TTL_MS = 60_000;
let cachedToken: string | null = null;
let cachedAt = 0;
let pendingToken: Promise<string | null> | null = null;

export function clearCachedAccessToken() {
  cachedToken = null;
  cachedAt = 0;
  pendingToken = null;
}

async function getAccessToken(forceRefresh = false): Promise<string | null> {
  if (!forceRefresh && cachedToken && Date.now() - cachedAt < TOKEN_TTL_MS) {
    return cachedToken;
  }
  if (!pendingToken) {
    pendingToken = getSession()
      .then((session) => {
        // Only cache a real token so a pre-login lookup is never reused.
        cachedToken = session?.accessToken ?? null;
        cachedAt = cachedToken ? Date.now() : 0;
        return cachedToken;
      })
      .finally(() => {
        pendingToken = null;
      });
  }
  return pendingToken;
}

// Request interceptor to add the access token to headers
api.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      clearCachedAccessToken();
      const session = await getSession();
      cachedToken = session?.accessToken ?? null;
      cachedAt = cachedToken ? Date.now() : 0;

      // If there's an error in the session (refresh failed), log out
      if (session?.error === "RefreshAccessTokenError") {
        signOut({ callbackUrl: "/login" });
        return Promise.reject(error);
      }

      // If we have a new access token, retry the request
      if (session?.accessToken) {
        originalRequest.headers.Authorization = `Bearer ${session.accessToken}`;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  },
);
