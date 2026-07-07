"use client";

import { useOrganizationStore } from "@/store/organization";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function AnalyticsPage() {
  const { organizationId } = useOrganizationStore();
  const { data, isLoading, isError } = useAnalytics(organizationId ?? "");
  const points = data ?? [];

  const last = points[points.length - 1];
  const prev = points[points.length - 2];

  const leadsChange =
    prev && prev.leads > 0
      ? Math.round(((last.leads - prev.leads) / prev.leads) * 100)
      : 0;
  const openRateChange = prev && last ? last.openRate - prev.openRate : 0;
  const replyRateChange = prev && last ? last.replyRate - prev.replyRate : 0;
  const meetingsChange = prev && last ? last.meetings - prev.meetings : 0;

  const metrics = last
    ? [
        {
          label: "Total Leads",
          value: String(last.leads),
          change: `${leadsChange >= 0 ? "+" : ""}${leadsChange}% vs last month`,
          positive: leadsChange >= 0,
        },
        {
          label: "Avg Open Rate",
          value: `${last.openRate}%`,
          change: `${openRateChange >= 0 ? "+" : ""}${openRateChange}% vs last month`,
          positive: openRateChange >= 0,
        },
        {
          label: "Avg Reply Rate",
          value: `${last.replyRate}%`,
          change: `${replyRateChange >= 0 ? "+" : ""}${replyRateChange}% vs last month`,
          positive: replyRateChange >= 0,
        },
        {
          label: "Meetings Booked",
          value: String(last.meetings),
          change: `${meetingsChange >= 0 ? "+" : ""}${meetingsChange} this month`,
          positive: meetingsChange >= 0,
        },
      ]
    : [];

  const maxLeads = Math.max(1, ...points.map((d) => d.leads));
  const maxMeetings = Math.max(1, ...points.map((d) => d.meetings));

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

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-[13px] text-red-700">
          Couldn't load analytics from the server.
        </div>
      )}

      {isLoading ? (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-12 flex items-center justify-center">
          <p className="text-[13px] text-[#9CA3AF]">Loading analytics...</p>
        </div>
      ) : points.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-12 flex items-center justify-center">
          <p className="text-[13px] text-[#9CA3AF]">No data yet</p>
        </div>
      ) : (
        <>
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
              {points.map((d) => (
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
                {points.map((d) => (
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
                {points.map((d) => (
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
              {points.map((d) => (
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
                {points.map((d) => (
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
        </>
      )}
    </div>
  );
}
