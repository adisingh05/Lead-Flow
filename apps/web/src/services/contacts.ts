import { apiClient } from "@/lib/api";
import { Contact } from "@/types";

export async function getContacts(organizationId: string): Promise<Contact[]> {
  return apiClient<Contact[]>(
    `/api/contacts?organizationId=${organizationId}`,
  );
}

export async function createContact(data: {
  firstName: string;
  lastName: string;
  organizationId: string;
}): Promise<Contact> {
  return apiClient<Contact>("/api/contacts", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
