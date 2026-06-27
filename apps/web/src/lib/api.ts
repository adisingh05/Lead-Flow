import { auth } from "@clerk/nextjs/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const { getToken } = await auth();
  const token = await getToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "API request failed");
  }

  return response.json();
}
