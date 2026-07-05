"use client";

import { useState } from "react";
import { Search, Plus, Users, ExternalLink } from "lucide-react";
import { useOrganizationStore } from "@/store/organization";
import { useContacts } from "@/hooks/useContacts";

const avatarColors = [
  "bg-violet-500", "bg-blue-500", "bg-emerald-500",
  "bg-amber-500", "bg-pink-500", "bg-teal-500",
];

export default function ContactsPage() {
  const [search, setSearch] = useState("");
  const { organizationId } = useOrganizationStore();

  const { data: contacts, isLoading, isError } = useContacts(organizationId ?? "");
  const list = contacts ?? [];

  const filtered = list.filter((c) => {
    const term = search.toLowerCase();
    return (
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term) ||
      c.company?.name.toLowerCase().includes(term) ||
      c.title?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#0F0F0F] tracking-tight">Contacts</h1>
          <p className="text-[13px] text-[#6B7280] mt-0.5">
            {isLoading ? "Loading..." : `${list.length} contacts in your workspace`}
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#0F0F0F] text-white text-[13px] font-semibold rounded-lg hover:bg-[#222] transition-colors">
          <Plus className="w-4 h-4" />
          Add Contact
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-[13px] text-[#0F0F0F] placeholder:text-[#9CA3AF] outline-none w-full"
          />
        </div>
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-[13px] text-red-700">
          Couldn't load contacts from the server.
        </div>
      )}

      {isLoading ? (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-12 flex items-center justify-center">
          <p className="text-[13px] text-[#9CA3AF]">Loading contacts...</p>
        </div>
      ) : (
        <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#FAFAF9]">
                <th className="text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide px-5 py-3">Name</th>
                <th className="text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide px-5 py-3">Company</th>
                <th className="text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide px-5 py-3">Title</th>
                <th className="text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide px-5 py-3">Email</th>
                <th className="text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide px-5 py-3">Phone</th>
                <th className="text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide px-5 py-3">LinkedIn</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="w-8 h-8 text-[#E5E7EB]" />
                      <p className="text-[13px] text-[#9CA3AF]">No contacts found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((contact, i) => (
                  <tr
                    key={contact.id}
                    className="border-b border-[#F3F4F6] last:border-0 hover:bg-[#FAFAF9] transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${avatarColors[i % avatarColors.length]}`}>
                          <span className="text-[11px] font-bold text-white">
                            {contact.firstName.charAt(0)}
                          </span>
                        </div>
                        <span className="text-[13px] font-semibold text-[#0F0F0F]">
                          {contact.firstName} {contact.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-[#6B7280]">{contact.company?.name ?? "—"}</td>
                    <td className="px-5 py-3.5 text-[13px] text-[#6B7280]">{contact.title ?? "—"}</td>
                    <td className="px-5 py-3.5 text-[13px] text-[#2563EB]">{contact.email ?? "—"}</td>
                    <td className="px-5 py-3.5 text-[13px] text-[#6B7280]">{contact.phone ?? "—"}</td>
                    <td className="px-5 py-3.5">
                      {contact.linkedin ? (
                        <a
                          href={`https://${contact.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#2563EB] hover:text-blue-700"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      ) : (
                        <span className="text-[#9CA3AF]">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="flex items-center justify-between px-5 py-3 border-t border-[#E5E7EB]">
            <span className="text-[12px] text-[#9CA3AF]">
              Showing {filtered.length} of {list.length} contacts
            </span>
          </div>
        </div>
      )}
    </div>
  );
}