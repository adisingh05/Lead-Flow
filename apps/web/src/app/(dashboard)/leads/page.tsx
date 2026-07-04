"use client";

import { useState } from "react";
import { Search, Plus, Target } from "lucide-react";
import { mockLeads } from "@/mock/leads";
import { Lead } from "@/types";

const stages: {
  key: Lead["status"];
  label: string;
  color: string;
  bg: string;
}[] = [
  { key: "new", label: "New", color: "text-gray-600", bg: "bg-gray-100" },
  {
    key: "qualified",
    label: "Qualified",
    color: "text-blue-700",
    bg: "bg-blue-50",
  },
  {
    key: "contacted",
    label: "Contacted",
    color: "text-violet-700",
    bg: "bg-violet-50",
  },
  {
    key: "responded",
    label: "Responded",
    color: "text-teal-700",
    bg: "bg-teal-50",
  },
  {
    key: "meeting",
    label: "Meeting",
    color: "text-amber-700",
    bg: "bg-amber-50",
  },
  { key: "won", label: "Won", color: "text-emerald-700", bg: "bg-emerald-50" },
  { key: "lost", label: "Lost", color: "text-red-600", bg: "bg-red-50" },
];

type ViewMode = "pipeline" | "table";

export default function LeadsPage() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<ViewMode>("pipeline");

  const filtered = mockLeads.filter(
    (l) =>
      l.contactName.toLowerCase().includes(search.toLowerCase()) ||
      l.company.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#0F0F0F] tracking-tight">
            Leads
          </h1>
          <p className="text-[13px] text-[#6B7280] mt-0.5">
            {mockLeads.length} leads in your pipeline
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#0F0F0F] text-white text-[13px] font-semibold rounded-lg hover:bg-[#222] transition-colors">
          <Plus className="w-4 h-4" />
          Add Lead
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-[13px] text-[#0F0F0F] placeholder:text-[#9CA3AF] outline-none w-full"
          />
        </div>
        {/* View toggle */}
        <div className="flex items-center bg-white border border-[#E5E7EB] rounded-lg overflow-hidden">
          <button
            onClick={() => setView("pipeline")}
            className={`px-3 py-2 text-[13px] font-medium transition-colors ${
              view === "pipeline"
                ? "bg-[#0F0F0F] text-white"
                : "text-[#6B7280] hover:bg-[#F9FAFB]"
            }`}
          >
            Pipeline
          </button>
          <button
            onClick={() => setView("table")}
            className={`px-3 py-2 text-[13px] font-medium transition-colors ${
              view === "table"
                ? "bg-[#0F0F0F] text-white"
                : "text-[#6B7280] hover:bg-[#F9FAFB]"
            }`}
          >
            Table
          </button>
        </div>
      </div>

      {/* Pipeline View */}
      {view === "pipeline" && (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {stages.map((stage) => {
            const stageLeads = filtered.filter((l) => l.status === stage.key);
            return (
              <div key={stage.key} className="flex flex-col gap-2 min-w-50">
                {/* Stage header */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[12px] font-semibold ${stage.color}`}
                    >
                      {stage.label}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${stage.bg} ${stage.color}`}
                    >
                      {stageLeads.length}
                    </span>
                  </div>
                </div>
                {/* Lead cards */}
                <div className="flex flex-col gap-2">
                  {stageLeads.length === 0 ? (
                    <div className="bg-white border border-dashed border-[#E5E7EB] rounded-lg p-4 text-center">
                      <p className="text-[12px] text-[#9CA3AF]">No leads</p>
                    </div>
                  ) : (
                    stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="bg-white border border-[#E5E7EB] rounded-lg p-3 flex flex-col gap-2 hover:shadow-sm transition-shadow cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#F0F4FF] flex items-center justify-center shrink-0">
                              <span className="text-[10px] font-bold text-[#2563EB]">
                                {lead.contactName.charAt(0)}
                              </span>
                            </div>
                            <span className="text-[12px] font-semibold text-[#0F0F0F] truncate">
                              {lead.contactName}
                            </span>
                          </div>
                          <span className="text-[11px] font-bold text-[#2563EB] bg-[#F0F4FF] px-1.5 py-0.5 rounded-full shrink-0">
                            {lead.score}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#6B7280]">
                          {lead.company}
                        </p>
                        <p className="text-[11px] text-[#9CA3AF]">
                          {lead.title}
                        </p>
                        {lead.value && (
                          <p className="text-[12px] font-semibold text-[#0F0F0F]">
                            ₹{lead.value.toLocaleString()}
                          </p>
                        )}
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-[#9CA3AF]">
                            {lead.source}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {view === "table" && (
        <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#FAFAF9]">
                <th className="text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide px-5 py-3">
                  Contact
                </th>
                <th className="text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide px-5 py-3">
                  Company
                </th>
                <th className="text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide px-5 py-3">
                  Status
                </th>
                <th className="text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide px-5 py-3">
                  Score
                </th>
                <th className="text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide px-5 py-3">
                  Value
                </th>
                <th className="text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide px-5 py-3">
                  Source
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => {
                const stage = stages.find((s) => s.key === lead.status);
                return (
                  <tr
                    key={lead.id}
                    className="border-b border-[#F3F4F6] last:border-0 hover:bg-[#FAFAF9] transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-[#F0F4FF] flex items-center justify-center shrink-0">
                          <span className="text-[11px] font-bold text-[#2563EB]">
                            {lead.contactName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-[#0F0F0F]">
                            {lead.contactName}
                          </p>
                          <p className="text-[11px] text-[#9CA3AF]">
                            {lead.title}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-[#6B7280]">
                      {lead.company}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${stage?.bg} ${stage?.color}`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[13px] font-bold text-[#2563EB]">
                        {lead.score}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-[#0F0F0F] font-medium">
                      {lead.value ? `₹${lead.value.toLocaleString()}` : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-[#6B7280]">
                      {lead.source}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
