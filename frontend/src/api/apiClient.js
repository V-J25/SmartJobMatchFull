import { supabase } from "./supabaseClient";

const BACKEND_URL = (
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"
).replace(/\/$/, "");

/**
 * Authenticated request to the Express backend.
 * Sends the current Supabase access token as a Bearer token.
 * Throws an Error (with .status and .code) when the backend responds with a non-2xx status.
 */
export async function backendRequest(
  path,
  { method = "GET", body, query, token } = {},
) {
  let accessToken = token;
  if (!accessToken) {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    accessToken = session?.access_token;
  }

  if (!accessToken) {
    const authError = new Error("Not authenticated");
    authError.status = 401;
    throw authError;
  }

  const url = new URL(`${BACKEND_URL}${path}`);
  if (query) {
    Object.entries(query).forEach(([key, value]) =>
      url.searchParams.append(key, value),
    );
  }

  const headers = { Authorization: `Bearer ${accessToken}` };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const response = await fetch(url.toString(), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const requestError = new Error(
      payload?.error || `Request failed with status ${response.status}`,
    );
    requestError.status = response.status;
    requestError.code = payload?.code;
    throw requestError;
  }

  return payload;
}
