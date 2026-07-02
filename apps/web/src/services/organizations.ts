const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function getOrganizations(token: string) {
  const res = await fetch(`${API_URL}/api/organizations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch organizations");
  return res.json();
}

export async function createOrganization(
  token: string,
  data: { name: string; slug: string },
) {
  const res = await fetch(`${API_URL}/api/organizations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create organization");
  return res.json();
}
