"use client";

import { useState } from "react";
import { Search, Plus, Megaphone } from "lucide-react";
import { useOrganizationStore } from "@/store/organization";
import { useCampaigns } from "@/hooks/useCampaigns";

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700",
  PAUSED: "bg-amber-50 text-amber-700",
  COMPLETED: "bg-gray-100 text-gray-500",
  DRAFT: "bg-blue-50 text-blue-700",
  ARCHIVED: "bg-gray-100 text-gray-400",
};

function formatDate(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function CampaignsPage() {
  const [search, setSearch] = useState("");
  const { organizationId } = useOrganizationStore();

  const {
    data: campaigns,
    isLoading,
    isError,
  } = useCampaigns(organizationId ?? "");
  const list = campaigns ?? [];

  const filtered = list.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#0F0F0F] tracking-tight">
            Campaigns
          </h1>
          <p className="text-[13px] text-[#6B7280] mt-0.5">
            {isLoading ? "Loading..." : `${list.length} campaigns total`}
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#0F0F0F] text-white text-[13px] font-semibold rounded-lg hover:bg-[#222] transition-colors">
          <Plus className="w-4 h-4" />
          New Campaign
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Campaigns", value: list.length },
          {
            label: "Active",
            value: list.filter((c) => c.status === "ACTIVE").length,
          },
          {
            label: "Total Leads",
            value: list.reduce((a, c) => a + c.leadsCount, 0),
          },
          {
            label: "Meetings Booked",
            value: list.reduce((a, c) => a + c.meetings, 0),
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-[#E5E7EB] rounded-xl p-5"
          >
            <p className="text-[13px] font-medium text-[#6B7280] mb-1">
              {stat.label}
            </p>
            <p className="text-[28px] font-bold text-[#0F0F0F] leading-none tracking-tight">
              {isLoading ? "—" : stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 max-w-sm">
        <Search className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
        <input
          type="text"
          placeholder="Search campaigns..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-[13px] text-[#0F0F0F] placeholder:text-[#9CA3AF] outline-none w-full"
        />
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-[13px] text-red-700">
          Couldn't load campaigns from the server.
        </div>
      )}

      {isLoading ? (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-12 flex items-center justify-center">
          <p className="text-[13px] text-[#9CA3AF]">Loading campaigns...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-16 flex flex-col items-center gap-2">
              <Megaphone className="w-8 h-8 text-[#E5E7EB]" />
              <p className="text-[13px] text-[#9CA3AF]">No campaigns found</p>
            </div>
          ) : (
            filtered.map((campaign) => {
              const openRate =
                campaign.sent > 0
                  ? Math.round((campaign.opened / campaign.sent) * 100)
                  : 0;
              const replyRate =
                campaign.sent > 0
                  ? Math.round((campaign.replied / campaign.sent) * 100)
                  : 0;

              return (
                <div
                  key={campaign.id}
                  className="bg-white border border-[#E5E7EB] rounded-xl p-5 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-[15px] font-semibold text-[#0F0F0F]">
                        {campaign.name}
                      </h3>
                      <p className="text-[12px] text-[#9CA3AF] mt-0.5">
                        Started {formatDate(campaign.startDate)}
                      </p>
                    </div>
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize shrink-0 ${statusStyles[campaign.status] ?? "bg-gray-100 text-gray-500"}`}
                    >
                      {campaign.status.toLowerCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-4 mb-4">
                    {[
                      { label: "Leads", value: campaign.leadsCount },
                      { label: "Sent", value: campaign.sent },
                      { label: "Opened", value: campaign.opened },
                      { label: "Replied", value: campaign.replied },
                      { label: "Meetings", value: campaign.meetings },
                    ].map((m) => (
                      <div key={m.label}>
                        <p className="text-[11px] text-[#9CA3AF] font-medium">
                          {m.label}
                        </p>
                        <p className="text-[16px] font-bold text-[#0F0F0F] leading-tight">
                          {m.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-[#9CA3AF] w-16 shrink-0">
                        Open rate
                      </span>
                      <div className="flex-1 h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#2563EB] rounded-full transition-all"
                          style={{ width: `${openRate}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-[#0F0F0F] w-8 text-right">
                        {openRate}%
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-[#9CA3AF] w-16 shrink-0">
                        Reply rate
                      </span>
                      <div className="flex-1 h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all"
                          style={{ width: `${replyRate}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-[#0F0F0F] w-8 text-right">
                        {replyRate}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
