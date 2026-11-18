// Fetch wrapper used by generated API functions.
// Adds the API base URL and key, and returns orval's response envelope.
// Non-2xx statuses are returned as values, not thrown, only network errors throw.
export const apiFetch = async <T>(
  path: string,
  init: RequestInit,
): Promise<T> => {
  // Read lazily, so importing the client never throws (e.g. during deploy)
  const { API_URL, API_KEY } = process.env;
  if (!API_URL || !API_KEY) {
    throw new Error("API_URL and API_KEY must be set to call the API.");
  }

  const headers = new Headers(init.headers);
  headers.set("api-key", API_KEY);

  const response = await fetch(new URL(path, API_URL), { ...init, headers });

  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const text = await response.text();
  const data: unknown =
    isJson && text.length > 0 ? JSON.parse(text) : text || undefined;

  // T is the generated per-status envelope type, this is the one place it's asserted
  return { data, status: response.status, headers: response.headers } as T;
};
