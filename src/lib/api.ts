import { authClient } from "@/lib/auth-client";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

async function bearerToken(): Promise<string> {
  const { data, error } = await authClient.token();
  if (error || !data?.token) {
    throw new ApiError(error?.message ?? "Your session has expired. Please sign in again.", 401);
  }
  return data.token;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  authenticated = true,
): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (authenticated) {
    headers.set("Authorization", `Bearer ${await bearerToken()}`);
  }

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      headers,
      cache: "no-store",
    });
  } catch {
    throw new ApiError("We couldn't reach the BookNook server. Check your connection and try again.", 0);
  }

  if (!response.ok) {
    let message = "Something went wrong. Please try again.";
    try {
      const payload: { error?: string } = await response.json();
      message = payload.error ?? message;
    } catch {
      if (response.status >= 500) message = "The BookNook server is temporarily unavailable.";
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
