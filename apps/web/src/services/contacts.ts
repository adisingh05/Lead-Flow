import { apiClient } from "@/lib/api";
import { Contact } from "@/types";

export async function getContacts(organizationId: string): Promise<Contact[]> {
  return apiClient<Contact[]>(
    "GET",
    `/api/contacts?organizationId=${organizationId}`,
  );
}

export async function createContact(data: {
  firstName: string;
  lastName: string;
  organizationId: string;
}): Promise<Contact> {
  const res = await fetch("/api/contacts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as Contact;
}
