"use client";

import { mockAnalytics } from "@/mock/analytics";

const metrics = [
  {
    label: "Total Leads",
    value: "267",
    change: "+18% vs last month",
    positive: true,
  },
  {
    label: "Avg Open Rate",
    value: "58%",
    change: "+4% vs last month",
    positive: true,
  },
  {
    label: "Avg Reply Rate",
    value: "31%",
    change: "+3% vs last month",
    positive: true,
  },
  {
    label: "Meetings Booked",
    value: "21",
    change: "+5 this month",
    positive: true,
  },
];

const maxLeads = Math.max(...mockAnalytics.map((d) => d.leads));
const maxMeetings = Math.max(...mockAnalytics.map((d) => d.meetings));

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold text-[#0F0F0F] tracking-tight">
          Analytics
        </h1>
        <p className="text-[13px] text-[#6B7280] mt-0.5">
          Performance overview for the last 6 months
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="bg-white border border-[#E5E7EB] rounded-xl p-5"
          >
            <p className="text-[13px] font-medium text-[#6B7280] mb-1">
              {m.label}
            </p>
            <p className="text-[28px] font-bold text-[#0F0F0F] leading-none tracking-tight mb-1">
              {m.value}
            </p>
            <p
              className={`text-[12px] font-medium ${m.positive ? "text-emerald-600" : "text-red-500"}`}
            >
              {m.change}
            </p>
          </div>
        ))}
      </div>

      {/* Lead Growth Chart */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
        <h2 className="text-[14px] font-semibold text-[#0F0F0F] mb-1">
          Lead Growth
        </h2>
        <p className="text-[12px] text-[#9CA3AF] mb-6">
          Total leads generated per month
        </p>
        <div className="flex items-end gap-3 h-40">
          {mockAnalytics.map((d) => (
            <div
              key={d.month}
              className="flex flex-col items-center gap-2 flex-1"
            >
              <span className="text-[11px] font-semibold text-[#0F0F0F]">
                {d.leads}
              </span>
              <div className="w-full flex flex-col gap-0.5">
                <div
                  className="w-full bg-[#2563EB] rounded-t-md transition-all"
                  style={{ height: `${(d.leads / maxLeads) * 120}px` }}
                />
                <div
                  className="w-full bg-[#DBEAFE] rounded-b-md"
                  style={{ height: `${(d.contacted / maxLeads) * 60}px` }}
                />
              </div>
              <span className="text-[11px] text-[#9CA3AF]">{d.month}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-[#2563EB]" />
            <span className="text-[12px] text-[#6B7280]">Total Leads</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-[#DBEAFE]" />
            <span className="text-[12px] text-[#6B7280]">Contacted</span>
          </div>
        </div>
      </div>

      {/* Open Rate + Reply Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Open Rate */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <h2 className="text-[14px] font-semibold text-[#0F0F0F] mb-1">
            Open Rate
          </h2>
          <p className="text-[12px] text-[#9CA3AF] mb-6">
            Monthly email open rate %
          </p>
          <div className="flex flex-col gap-3">
            {mockAnalytics.map((d) => (
              <div key={d.month} className="flex items-center gap-3">
                <span className="text-[12px] text-[#6B7280] w-8 shrink-0">
                  {d.month}
                </span>
                <div className="flex-1 h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2563EB] rounded-full transition-all"
                    style={{ width: `${d.openRate}%` }}
                  />
                </div>
                <span className="text-[12px] font-semibold text-[#0F0F0F] w-8 text-right">
                  {d.openRate}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Reply Rate */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <h2 className="text-[14px] font-semibold text-[#0F0F0F] mb-1">
            Reply Rate
          </h2>
          <p className="text-[12px] text-[#9CA3AF] mb-6">
            Monthly email reply rate %
          </p>
          <div className="flex flex-col gap-3">
            {mockAnalytics.map((d) => (
              <div key={d.month} className="flex items-center gap-3">
                <span className="text-[12px] text-[#6B7280] w-8 shrink-0">
                  {d.month}
                </span>
                <div className="flex-1 h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${d.replyRate}%` }}
                  />
                </div>
                <span className="text-[12px] font-semibold text-[#0F0F0F] w-8 text-right">
                  {d.replyRate}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Meetings Chart */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
        <h2 className="text-[14px] font-semibold text-[#0F0F0F] mb-1">
          Meetings Booked
        </h2>
        <p className="text-[12px] text-[#9CA3AF] mb-6">
          Number of meetings booked per month
        </p>
        <div className="flex items-end gap-3 h-32">
          {mockAnalytics.map((d) => (
            <div
              key={d.month}
              className="flex flex-col items-center gap-2 flex-1"
            >
              <span className="text-[11px] font-semibold text-[#0F0F0F]">
                {d.meetings}
              </span>
              <div
                className="w-full bg-emerald-500 rounded-t-md transition-all"
                style={{ height: `${(d.meetings / maxMeetings) * 100}px` }}
              />
              <span className="text-[11px] text-[#9CA3AF]">{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E7EB]">
          <h2 className="text-[14px] font-semibold text-[#0F0F0F]">
            Monthly Breakdown
          </h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#FAFAF9]">
              {[
                "Month",
                "Leads",
                "Contacted",
                "Converted",
                "Open Rate",
                "Reply Rate",
                "Meetings",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide px-5 py-3"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockAnalytics.map((d) => (
              <tr
                key={d.month}
                className="border-b border-[#F3F4F6] last:border-0 hover:bg-[#FAFAF9] transition-colors"
              >
                <td className="px-5 py-3.5 text-[13px] font-semibold text-[#0F0F0F]">
                  {d.month}
                </td>
                <td className="px-5 py-3.5 text-[13px] text-[#6B7280]">
                  {d.leads}
                </td>
                <td className="px-5 py-3.5 text-[13px] text-[#6B7280]">
                  {d.contacted}
                </td>
                <td className="px-5 py-3.5 text-[13px] text-[#6B7280]">
                  {d.converted}
                </td>
                <td className="px-5 py-3.5 text-[13px] text-emerald-600 font-medium">
                  {d.openRate}%
                </td>
                <td className="px-5 py-3.5 text-[13px] text-blue-600 font-medium">
                  {d.replyRate}%
                </td>
                <td className="px-5 py-3.5 text-[13px] text-[#0F0F0F] font-semibold">
                  {d.meetings}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
