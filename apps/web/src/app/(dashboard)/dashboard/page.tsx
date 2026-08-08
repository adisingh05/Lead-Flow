"use client";

import {
  Building2,
  Users,
  Target,
  Megaphone,
  Mail,
  MessageSquare,
  Calendar,
} from "lucide-react";
import StatCard from "@/components/ui/statCard";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useLeads } from "@/hooks/useLeads";
import { useCompanies } from "@/hooks/useCompanies";
import { useContacts } from "@/hooks/useContacts";
import { useOrganization } from "@clerk/nextjs";
import { Lead } from "@/types";

const leadStatusStyles: Record<Lead["status"], string> = {
  NEW:         "bg-gray-100 text-gray-600",
  CONTACTED:   "bg-purple-50 text-purple-700",
  QUALIFIED:   "bg-blue-50 text-blue-700",
  UNQUALIFIED: "bg-amber-50 text-amber-700",
  CONVERTED:   "bg-emerald-50 text-emerald-700",
  LOST:        "bg-red-50 text-red-600",
};

function leadName(lead: Lead) {
  if (!lead.contact) return "Unknown";
  return `${lead.contact.firstName} ${lead.contact.lastName ?? ""}`.trim();
}

export default function DashboardPage() {
  const { organization } = useOrganization();
  const orgId = organization?.id ?? "";

  const { data: campaignsData, isLoading: campaignsLoading } = useCampaigns({
    limit: 100,
  });
  const { data: leads,     isLoading: leadsLoading     } = useLeads(orgId);
  const { data: companies, isLoading: companiesLoading } = useCompanies(orgId);
  const { data: contacts,  isLoading: contactsLoading  } = useContacts(orgId);

  const isLoading =
    campaignsLoading || leadsLoading || companiesLoading || contactsLoading;

  const campaigns       = campaignsData?.items ?? [];
  const activeCampaigns = campaigns.filter((c) => c.status === "ACTIVE");

  const totalSent     = campaigns.reduce((a, c) => a + (c.sent     ?? 0), 0);
  const totalOpened   = campaigns.reduce((a, c) => a + (c.opened   ?? 0), 0);
  const totalReplied  = campaigns.reduce((a, c) => a + (c.replied  ?? 0), 0);
  const totalMeetings = campaigns.reduce((a, c) => a + (c.meetings ?? 0), 0);

  const avgOpenRate  = totalSent > 0 ? Math.round((totalOpened  / totalSent) * 100) : 0;
  const avgReplyRate = totalSent > 0 ? Math.round((totalReplied / totalSent) * 100) : 0;

  const activeLeads = (leads ?? []).filter(
    (l) => l.status === "NEW" || l.status === "CONTACTED",
  );
  const recentLeads = (leads ?? []).slice(0, 5);

  const dash = (v: number | string) => (isLoading ? "—" : String(v));

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold text-[#0F0F0F] tracking-tight">
          {"Good morning 👋"}
        </h1>
        <p className="text-[13px] text-[#6B7280] mt-0.5">
          {"Here's what's happening with your pipeline today."}
        </p>
      </div>

      {/* Primary stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Companies"
          value={dash(companies?.length ?? 0)}
          change="from your CRM"
          changeType="neutral"
          icon={Building2}
        />
        <StatCard
          title="Total Contacts"
          value={dash(contacts?.length ?? 0)}
          change="from your CRM"
          changeType="neutral"
          icon={Users}
        />
        <StatCard
          title="Active Leads"
          value={dash(activeLeads.length)}
          change={`${(leads ?? []).length} total leads`}
          changeType="positive"
          icon={Target}
        />
        <StatCard
          title="Campaigns Running"
          value={dash(activeCampaigns.length)}
          change={`${campaigns.length} total campaigns`}
          changeType="positive"
          icon={Megaphone}
        />
      </div>

      {/* Campaign metrics cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Avg Open Rate"
          value={dash(`${avgOpenRate}%`)}
          change={`${totalOpened} emails opened`}
          changeType="positive"
          icon={Mail}
        />
        <StatCard
          title="Reply Rate"
          value={dash(`${avgReplyRate}%`)}
          change={`${totalReplied} replies received`}
          changeType="positive"
          icon={MessageSquare}
        />
        <StatCard
          title="Meetings Booked"
          value={dash(totalMeetings)}
          change="across all campaigns"
          changeType="positive"
          icon={Calendar}
        />
      </div>

      {/* Recent Leads + Active Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recent Leads */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[14px] font-semibold text-[#0F0F0F]">
              Recent Leads
            </h2>
            
            <a
              href="/leads"
              className="text-[12px] text-[#2563EB] hover:underline font-medium"
            >
              View all
            </a>
          </div>

          {leadsLoading ? (
            <p className="text-[13px] text-[#9CA3AF] py-4 text-center">
              Loading...
            </p>
          ) : recentLeads.length === 0 ? (
            <p className="text-[13px] text-[#9CA3AF] py-4 text-center">
              No leads yet
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between py-2 border-b border-[#F3F4F6] last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#F0F4FF] flex items-center justify-center shrink-0">
                      <span className="text-[11px] font-bold text-[#2563EB]">
                        {leadName(lead).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-[#0F0F0F]">
                        {leadName(lead)}
                      </p>
                      <p className="text-[11px] text-[#9CA3AF]">
                        {lead.company?.name ?? "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {lead.score != null && (
                      <span className="text-[11px] font-semibold text-[#2563EB] bg-[#F0F4FF] px-2 py-0.5 rounded-full">
                        {lead.score}
                      </span>
                    )}
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${
                        leadStatusStyles[lead.status]
                      }`}
                    >
                      {lead.status.toLowerCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Campaigns */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[14px] font-semibold text-[#0F0F0F]">
              Active Campaigns
            </h2>
            <a
              href="/campaigns"
              className="text-[12px] text-[#2563EB] hover:underline font-medium"
            >
              View all
            </a>
          </div>

          {campaignsLoading ? (
            <p className="text-[13px] text-[#9CA3AF] py-4 text-center">
              Loading...
            </p>
          ) : activeCampaigns.length === 0 ? (
            <p className="text-[13px] text-[#9CA3AF] py-4 text-center">
              No active campaigns
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {activeCampaigns.slice(0, 5).map((campaign) => {
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
                    className="flex flex-col gap-2 py-2 border-b border-[#F3F4F6] last:border-0"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[13px] font-medium text-[#0F0F0F] truncate">
                        {campaign.name}
                      </p>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0 ml-2">
                        Active
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-[#6B7280]">
                      <span>{campaign.leadsCount ?? 0} leads</span>
                      <span>{openRate}% open</span>
                      <span>{replyRate}% reply</span>
                      <span>{campaign.meetings ?? 0} meetings</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2563EB] rounded-full transition-all"
                        style={{ width: `${openRate}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}