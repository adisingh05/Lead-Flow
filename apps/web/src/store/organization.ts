import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OrganizationStore {
  organizationId: string | null;
  organizationName: string | null;
  setOrganization: (id: string, name: string) => void;
  clearOrganization: () => void;
}

export const useOrganizationStore = create<OrganizationStore>()(
  persist(
    (set) => ({
      organizationId: null,
      organizationName: null,
      setOrganization: (id, name) =>
        set({ organizationId: id, organizationName: name }),
      clearOrganization: () =>
        set({ organizationId: null, organizationName: null }),
    }),
    {
      name: "leadflow-org",
    },
  ),
);
