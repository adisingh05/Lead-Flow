"use client";

import { useState } from "react";
import { Search, Plus, ExternalLink, Building2 } from "lucide-react";
import { useOrganizationStore } from "@/store/organization";
import { useCompanies } from "@/hooks/useCompanies";

const sizeStyles: Record<string, string> = {
  MICRO: "bg-gray-100 text-gray-600",
  SMALL: "bg-blue-50 text-blue-700",
  MEDIUM: "bg-emerald-50 text-emerald-700",
  LARGE: "bg-amber-50 text-amber-700",
  ENTERPRISE: "bg-violet-50 text-violet-700",
};

export default function CompaniesPage() {
  const [search, setSearch] = useState("");
  const [sizeFilter, setSizeFilter] = useState("all");
  const { organizationId } = useOrganizationStore();

  const { data: companies, isLoading, isError } = useCompanies(organizationId ?? "");
  const list = companies ?? [];

  const filtered = list.filter((c) => {
    const term = search.toLowerCase();
    const matchSearch =
      c.name.toLowerCase().includes(term) ||
      c.industry?.toLowerCase().includes(term) ||
      c.city?.toLowerCase().includes(term);
    const matchSize = sizeFilter === "all" || c.size === sizeFilter;
    return matchSearch && matchSize;
  });

  const location = (c: (typeof list)[number]) =>
    [c.city, c.country].filter(Boolean).join(", ") || "—";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#0F0F0F] tracking-tight">Companies</h1>
          <p className="text-[13px] text-[#6B7280] mt-0.5">
            {isLoading ? "Loading..." : `${list.length} companies in your workspace`}
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#0F0F0F] text-white text-[13px] font-semibold rounded-lg hover:bg-[#222] transition-colors">
          <Plus className="w-4 h-4" />
          Add Company
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
          <input
            type="text"
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-[13px] text-[#0F0F0F] placeholder:text-[#9CA3AF] outline-none w-full"
          />
        </div>
        <select
          value={sizeFilter}
          onChange={(e) => setSizeFilter(e.target.value)}
          className="bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] text-[#0F0F0F] outline-none cursor-pointer"
        >
          <option value="all">All Sizes</option>
          <option value="MICRO">Micro</option>
          <option value="SMALL">Small</option>
          <option value="MEDIUM">Medium</option>
          <option value="LARGE">Large</option>
          <option value="ENTERPRISE">Enterprise</option>
        </select>
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-[13px] text-red-700">
          Couldn't load companies from the server.
        </div>
      )}

      {isLoading ? (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-12 flex items-center justify-center">
          <p className="text-[13px] text-[#9CA3AF]">Loading companies...</p>
        </div>
      ) : (
        <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#FAFAF9]">
                <th className="text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide px-5 py-3">Company</th>
                <th className="text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide px-5 py-3">Industry</th>
                <th className="text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide px-5 py-3">Size</th>
                <th className="text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide px-5 py-3">Location</th>
                <th className="text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide px-5 py-3">Website</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16">
                    <div className="flex flex-col items-center gap-2">
                      <Building2 className="w-8 h-8 text-[#E5E7EB]" />
                      <p className="text-[13px] text-[#9CA3AF]">No companies found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((company) => (
                  <tr key={company.id} className="border-b border-[#F3F4F6] last:border-0 hover:bg-[#FAFAF9] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-md bg-[#F0F4FF] flex items-center justify-center shrink-0">
                          <span className="text-[11px] font-bold text-[#2563EB]">{company.name.charAt(0)}</span>
                        </div>
                        <span className="text-[13px] font-semibold text-[#0F0F0F]">{company.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-[#6B7280]">{company.industry ?? "—"}</td>
                    <td className="px-5 py-3.5">
                      {company.size ? (
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${sizeStyles[company.size] ?? "bg-gray-100 text-gray-500"}`}>
                          {company.size.toLowerCase()}
                        </span>
                      ) : (
                        <span className="text-[#9CA3AF]">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-[#6B7280]">{location(company)}</td>
                    <td className="px-5 py-3.5">
                      {company.website ? (
                        <a
                          href={`https://${company.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[13px] text-[#2563EB] hover:underline"
                        >
                          {company.website} <ExternalLink className="w-3 h-3" />
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
              Showing {filtered.length} of {list.length} companies
            </span>
          </div>
        </div>
      )}
    </div>
  );
}