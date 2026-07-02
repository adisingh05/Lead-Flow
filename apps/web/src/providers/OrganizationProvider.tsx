"use client";

import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useOrganizationStore } from "@/store/organization";
import { getOrganizations, createOrganization } from "@/services/organizations";

export default function OrganizationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();
  const { organizationId, setOrganization } = useOrganizationStore();

  useEffect(() => {
    if (!isSignedIn || !user || organizationId) return;

    async function initOrganization() {
      try {
        const token = await getToken();
        if (!token) return;

        const orgs = await getOrganizations(token);

        if (orgs && orgs.length > 0) {
          setOrganization(orgs[0].id, orgs[0].name);
        } else {
          const name = user?.firstName
            ? `${user.firstName}'s Workspace`
            : "My Workspace";
          const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-")
            .replace(/-+/g, "-")
            .slice(0, 48);

          const org = await createOrganization(token, { name, slug });
          setOrganization(org.id, org.name);
        }
      } catch (err) {
        console.error("Failed to initialize organization:", err);
      }
    }

    initOrganization();
  }, [isSignedIn, user, organizationId, getToken, setOrganization]);

  return <>{children}</>;
}
