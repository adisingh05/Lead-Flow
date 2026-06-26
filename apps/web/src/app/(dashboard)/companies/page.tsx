"use client";

import { useState } from "react";
import { Search, Plus, ExternalLink, Building2 } from "lucide-react";
import { mockCompanies } from "@/mock/companies";

const statusStyles: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700",
  inactive: "bg-gray-100 text-gray-500",
  prospect: "bg-blue-50 text-blue-700",
};

export default function CompaniesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = mockCompanies.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#0F0F0F] tracking-tight">Companies</h1>
          <p className="text-[13px] text-[#6B7280] mt-0.5">{mockCompanies.length} companies in your workspace</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#0F0F0F] text-white text-[13px] font-semibold rounded-lg hover:bg-[#222] transition-colors">
          <Plus className="w-4 h-4" />
          Add Company
        </button>
      </div>

      {/* Toolbar */}
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
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] text-[#0F0F0F] outline-none cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="prospect">Prospect</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#FAFAF9]">
              <th className="text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide px-5 py-3">Company</th>
              <th className="text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide px-5 py-3">Industry</th>
              <th className="text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide px-5 py-3">Employees</th>
              <th className="text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide px-5 py-3">Location</th>
              <th className="text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide px-5 py-3">Website</th>
              <th className="text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-16">
                  <div className="flex flex-col items-center gap-2">
                    <Building2 className="w-8 h-8 text-[#E5E7EB]" />
                    <p className="text-[13px] text-[#9CA3AF]">No companies found</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((company) => (
                <tr
                  key={company.id}
                  className="border-b border-[#F3F4F6] last:border-0 hover:bg-[#FAFAF9] transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-md bg-[#F0F4FF] flex items-center justify-center shrink-0">
                        <span className="text-[11px] font-bold text-[#2563EB]">
                          {company.name.charAt(0)}
                        </span>
                      </div>
                      <span className="text-[13px] font-semibold text-[#0F0F0F]">{company.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-[#6B7280]">{company.industry}</td>
                  <td className="px-5 py-3.5 text-[13px] text-[#6B7280]">{company.employees.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-[13px] text-[#6B7280]">{company.location}</td>
                  <td className="px-5 py-3.5">
                    <a
                      href={`https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[13px] text-[#2563EB] hover:underline"
                    >
                      {company.website}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${statusStyles[company.status]}`}>
                      {company.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#E5E7EB]">
          <span className="text-[12px] text-[#9CA3AF]">
            Showing {filtered.length} of {mockCompanies.length} companies
          </span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 text-[12px] font-medium text-[#6B7280] border border-[#E5E7EB] rounded-md hover:bg-[#F9FAFB] transition-colors">
              Previous
            </button>
            <button className="px-3 py-1.5 text-[12px] font-medium bg-[#0F0F0F] text-white rounded-md">
              1
            </button>
            <button className="px-3 py-1.5 text-[12px] font-medium text-[#6B7280] border border-[#E5E7EB] rounded-md hover:bg-[#F9FAFB] transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}