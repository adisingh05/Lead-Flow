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
import { mockLeads } from "@/mock/leads";
import { mockCampaigns } from "@/mock/campaigns";
import { mockContacts } from "@/mock/contacts";
import { mockCompanies } from "@/mock/companies";
import { Lead } from "@/types";

const leadStatusStyles: Record<Lead["status"], string> = {
  NEW: "bg-gray-100 text-gray-600",
  CONTACTED: "bg-purple-50 text-purple-700",
  QUALIFIED: "bg-blue-50 text-blue-700",
  UNQUALIFIED: "bg-amber-50 text-amber-700",
  CONVERTED: "bg-emerald-50 text-emerald-700",
  LOST: "bg-red-50 text-red-600",
};

const enrichedLeads: Lead[] = mockLeads.map((lead) => ({
  ...lead,
  contact: mockContacts.find((c) => c.id === lead.contactId),
  company: mockCompanies.find((c) => c.id === lead.companyId),
}));

function leadName(lead: Lead) {
  if (!lead.contact) return "Unknown";
  return `${lead.contact.firstName} ${lead.contact.lastName}`;
}

export default function DashboardPage() {
  const recentLeads = enrichedLeads.slice(0, 5);
  const activeCampaigns = mockCampaigns.filter((c) => c.status === "ACTIVE");

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold text-[#0F0F0F] tracking-tight">
          Good morning, Adi 👋
        </h1>
        <p className="text-[13px] text-[#6B7280] mt-0.5">
          Here's what's happening with your pipeline today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Companies"
          value="10"
          change="+2 this week"
          changeType="positive"
          icon={Building2}
        />
        <StatCard
          title="Total Contacts"
          value="8"
          change="+3 this week"
          changeType="positive"
          icon={Users}
        />
        <StatCard
          title="Active Leads"
          value="6"
          change="2 need follow-up"
          changeType="neutral"
          icon={Target}
        />
        <StatCard
          title="Campaigns Running"
          value={activeCampaigns.length}
          change="2 active now"
          changeType="positive"
          icon={Megaphone}
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Avg Open Rate"
          value="52%"
          change="+4% vs last month"
          changeType="positive"
          icon={Mail}
        />
        <StatCard
          title="Reply Rate"
          value="28%"
          change="+2% vs last month"
          changeType="positive"
          icon={MessageSquare}
        />
        <StatCard
          title="Meetings Booked"
          value="21"
          change="+5 this month"
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
          <div className="flex flex-col gap-2">
            {recentLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between py-2 border-b border-[#F3F4F6] last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#F0F4FF] flex items-center justify-center">
                    <span className="text-[11px] font-bold text-[#2563EB]">
                      {leadName(lead).charAt(0)}
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
                  <span className="text-[11px] font-semibold text-[#2563EB] bg-[#F0F4FF] px-2 py-0.5 rounded-full">
                    {lead.score}
                  </span>
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${leadStatusStyles[lead.status]}`}
                  >
                    {lead.status.toLowerCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
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
          <div className="flex flex-col gap-3">
            {activeCampaigns.map((campaign) => {
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
                    <p className="text-[13px] font-medium text-[#0F0F0F]">
                      {campaign.name}
                    </p>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-[#6B7280]">
                    <span>{campaign.leadsCount} leads</span>
                    <span>{openRate}% open</span>
                    <span>{replyRate}% reply</span>
                    <span>{campaign.meetings} meetings</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2563EB] rounded-full"
                      style={{ width: `${openRate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}