"use client";

import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { useOrganizationStore } from "@/store/organization";
import { useLeads, useCreateLead } from "@/hooks/useLeads";
import { useCreateActivity } from "@/hooks/useActivities";
import { useCompanies } from "@/hooks/useCompanies";
import { useContacts } from "@/hooks/useContacts";
import { useCampaigns } from "@/hooks/useCampaigns";
import { Lead, ActivityType } from "@/types";
import Modal from "@/components/ui/Modal";

const activityOptions: { value: ActivityType; label: string }[] = [
  { value: "EMAIL_SENT", label: "Email sent" },
  { value: "EMAIL_OPENED", label: "Email opened" },
  { value: "EMAIL_REPLIED", label: "Email replied" },
  { value: "CALL_MADE", label: "Call made" },
  { value: "MEETING_SCHEDULED", label: "Meeting scheduled" },
  { value: "MEETING_COMPLETED", label: "Meeting completed" },
];

function AddLeadForm({
  organizationId,
  onDone,
}: {
  organizationId: string;
  onDone: () => void;
}) {
  const createLead = useCreateLead();
  const { data: companies } = useCompanies(organizationId);
  const { data: contacts } = useContacts(organizationId);
  const { data: campaigns } = useCampaigns(organizationId);

  const [companyId, setCompanyId] = useState("");
  const [contactId, setContactId] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [source, setSource] = useState("");
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLead.mutate(
      {
        organizationId,
        companyId: companyId || undefined,
        contactId: contactId || undefined,
        campaignId: campaignId || undefined,
        source: source.trim() || undefined,
        value: value ? Number(value) : undefined,
      },
      { onSuccess: onDone },
    );
  };

  const inputClass =
    "w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] text-[#0F0F0F] placeholder:text-[#9CA3AF] outline-none focus:border-[#2563EB]";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <label className="text-[12px] font-medium text-[#6B7280] mb-1 block">
          Contact
        </label>
        <select
          value={contactId}
          onChange={(e) => setContactId(e.target.value)}
          className={inputClass}
        >
          <option value="">None</option>
          {(contacts ?? []).map((c) => (
            <option key={c.id} value={c.id}>
              {c.firstName} {c.lastName}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-[12px] font-medium text-[#6B7280] mb-1 block">
          Company
        </label>
        <select
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
          className={inputClass}
        >
          <option value="">None</option>
          {(companies ?? []).map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-[12px] font-medium text-[#6B7280] mb-1 block">
          Campaign
        </label>
        <select
          value={campaignId}
          onChange={(e) => setCampaignId(e.target.value)}
          className={inputClass}
        >
          <option value="">None</option>
          {(campaigns ?? []).map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <p className="text-[11px] text-[#9CA3AF] mt-1">
          Only leads attached to a campaign count toward its engagement stats.
        </p>
      </div>
      <div>
        <label className="text-[12px] font-medium text-[#6B7280] mb-1 block">
          Source
        </label>
        <input
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="LinkedIn, Referral, Cold Email..."
          className={inputClass}
        />
      </div>
      <div>
        <label className="text-[12px] font-medium text-[#6B7280] mb-1 block">
          Deal value (₹)
        </label>
        <input
          type="number"
          min="0"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="100000"
          className={inputClass}
        />
      </div>

      {createLead.isError && (
        <p className="text-[12px] text-red-600">
          Couldn't create the lead. Try again.
        </p>
      )}

      <button
        type="submit"
        disabled={createLead.isPending}
        className="mt-2 bg-[#0F0F0F] text-white text-[13px] font-semibold rounded-lg py-2.5 hover:bg-[#222] transition-colors disabled:opacity-50"
      >
        {createLead.isPending ? "Creating..." : "Add Lead"}
      </button>
    </form>
  );
}

const stages: {
  key: Lead["status"];
  label: string;
  color: string;
  bg: string;
}[] = [
  { key: "NEW", label: "New", color: "text-gray-600", bg: "bg-gray-100" },
  {
    key: "CONTACTED",
    label: "Contacted",
    color: "text-violet-700",
    bg: "bg-violet-50",
  },
  {
    key: "QUALIFIED",
    label: "Qualified",
    color: "text-blue-700",
    bg: "bg-blue-50",
  },
  {
    key: "UNQUALIFIED",
    label: "Unqualified",
    color: "text-amber-700",
    bg: "bg-amber-50",
  },
  {
    key: "CONVERTED",
    label: "Converted",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  { key: "LOST", label: "Lost", color: "text-red-600", bg: "bg-red-50" },
];

type ViewMode = "pipeline" | "table";

function contactName(lead: Lead) {
  if (!lead.contact) return "Unknown";
  return `${lead.contact.firstName} ${lead.contact.lastName}`;
}

export default function LeadsPage() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<ViewMode>("pipeline");
  const [showAddModal, setShowAddModal] = useState(false);
  const { organizationId } = useOrganizationStore();

  const { data: leads, isLoading, isError } = useLeads(organizationId ?? "");
  const createActivity = useCreateActivity();
  const list = leads ?? [];

  const filtered = list.filter((l) => {
    const term = search.toLowerCase();
    return (
      contactName(l).toLowerCase().includes(term) ||
      l.company?.name.toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#0F0F0F] tracking-tight">
            Leads
          </h1>
          <p className="text-[13px] text-[#6B7280] mt-0.5">
            {isLoading ? "Loading..." : `${list.length} leads in your pipeline`}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#0F0F0F] text-white text-[13px] font-semibold rounded-lg hover:bg-[#222] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Lead
        </button>
      </div>

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

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-[13px] text-red-700">
          Couldn't load leads from the server.
        </div>
      )}

      {isLoading && (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-12 flex items-center justify-center">
          <p className="text-[13px] text-[#9CA3AF]">Loading leads...</p>
        </div>
      )}

      {!isLoading && view === "pipeline" && (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {stages.map((stage) => {
            const stageLeads = filtered.filter((l) => l.status === stage.key);
            return (
              <div key={stage.key} className="flex flex-col gap-2 min-w-50">
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
                                {contactName(lead).charAt(0)}
                              </span>
                            </div>
                            <span className="text-[12px] font-semibold text-[#0F0F0F] truncate">
                              {contactName(lead)}
                            </span>
                          </div>
                          <span className="text-[11px] font-bold text-[#2563EB] bg-[#F0F4FF] px-1.5 py-0.5 rounded-full shrink-0">
                            {lead.score}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#6B7280]">
                          {lead.company?.name ?? "—"}
                        </p>
                        <p className="text-[11px] text-[#9CA3AF]">
                          {lead.contact?.title ?? "—"}
                        </p>
                        {lead.value && (
                          <p className="text-[12px] font-semibold text-[#0F0F0F]">
                            ₹{lead.value.toLocaleString()}
                          </p>
                        )}
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-[#9CA3AF]">
                            {lead.source ?? "—"}
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

      {!isLoading && view === "table" && (
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
                <th className="text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide px-5 py-3">
                  Log Activity
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
                            {contactName(lead).charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-[#0F0F0F]">
                            {contactName(lead)}
                          </p>
                          <p className="text-[11px] text-[#9CA3AF]">
                            {lead.contact?.title ?? "—"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-[#6B7280]">
                      {lead.company?.name ?? "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${stage?.bg} ${stage?.color}`}
                      >
                        {lead.status.toLowerCase()}
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
                      {lead.source ?? "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        defaultValue=""
                        disabled={createActivity.isPending}
                        onChange={(e) => {
                          const type = e.target.value as ActivityType;
                          if (!type) return;
                          createActivity.mutate({
                            type,
                            leadId: lead.id,
                            contactId: lead.contactId,
                          });
                          e.target.value = "";
                        }}
                        className="bg-white border border-[#E5E7EB] rounded-md px-2 py-1.5 text-[12px] text-[#6B7280] outline-none cursor-pointer disabled:opacity-50"
                      >
                        <option value="" disabled>
                          Log activity...
                        </option>
                        {activityOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Lead"
      >
        <AddLeadForm
          organizationId={organizationId ?? ""}
          onDone={() => setShowAddModal(false)}
        />
      </Modal>
    </div>
  );
}
