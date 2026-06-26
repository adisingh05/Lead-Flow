"use client";

import { useState } from "react";

const tabs = [
  "Profile",
  "Workspace",
  "Notifications",
  "Appearance",
  "Integrations",
  "Billing",
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Profile");

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold text-[#0F0F0F] tracking-tight">
          Settings
        </h1>
        <p className="text-[13px] text-[#6B7280] mt-0.5">
          Manage your account and workspace preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#E5E7EB]">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? "border-[#0F0F0F] text-[#0F0F0F]"
                : "border-transparent text-[#6B7280] hover:text-[#0F0F0F]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "Profile" && (
        <div className="flex flex-col gap-6 max-w-xl">
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 flex flex-col gap-5">
            <h2 className="text-[14px] font-semibold text-[#0F0F0F]">
              Personal Information
            </h2>

            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#2563EB] flex items-center justify-center">
                <span className="text-[20px] font-bold text-white">A</span>
              </div>
              <div>
                <button className="text-[13px] font-semibold text-[#2563EB] hover:underline">
                  Change photo
                </button>
                <p className="text-[12px] text-[#9CA3AF] mt-0.5">
                  JPG, PNG up to 2MB
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-[#6B7280]">
                  First Name
                </label>
                <input
                  defaultValue="Adi"
                  className="px-3 py-2 border border-[#E5E7EB] rounded-lg text-[13px] text-[#0F0F0F] outline-none focus:border-[#2563EB] transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-[#6B7280]">
                  Last Name
                </label>
                <input
                  defaultValue="Singh"
                  className="px-3 py-2 border border-[#E5E7EB] rounded-lg text-[13px] text-[#0F0F0F] outline-none focus:border-[#2563EB] transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-[#6B7280]">
                Email
              </label>
              <input
                defaultValue="adi@leadflow.ai"
                className="px-3 py-2 border border-[#E5E7EB] rounded-lg text-[13px] text-[#0F0F0F] outline-none focus:border-[#2563EB] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-[#6B7280]">
                Role
              </label>
              <input
                defaultValue="Founder"
                className="px-3 py-2 border border-[#E5E7EB] rounded-lg text-[13px] text-[#0F0F0F] outline-none focus:border-[#2563EB] transition-colors"
              />
            </div>

            <button className="self-start px-4 py-2 bg-[#0F0F0F] text-white text-[13px] font-semibold rounded-lg hover:bg-[#222] transition-colors">
              Save changes
            </button>
          </div>

          {/* Password */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 flex flex-col gap-5">
            <h2 className="text-[14px] font-semibold text-[#0F0F0F]">
              Change Password
            </h2>
            {["Current Password", "New Password", "Confirm Password"].map(
              (label) => (
                <div key={label} className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-[#6B7280]">
                    {label}
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="px-3 py-2 border border-[#E5E7EB] rounded-lg text-[13px] text-[#0F0F0F] outline-none focus:border-[#2563EB] transition-colors"
                  />
                </div>
              ),
            )}
            <button className="self-start px-4 py-2 bg-[#0F0F0F] text-white text-[13px] font-semibold rounded-lg hover:bg-[#222] transition-colors">
              Update password
            </button>
          </div>
        </div>
      )}

      {/* Workspace Tab */}
      {activeTab === "Workspace" && (
        <div className="flex flex-col gap-6 max-w-xl">
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 flex flex-col gap-5">
            <h2 className="text-[14px] font-semibold text-[#0F0F0F]">
              Workspace Settings
            </h2>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-[#6B7280]">
                Workspace Name
              </label>
              <input
                defaultValue="LeadFlow AI"
                className="px-3 py-2 border border-[#E5E7EB] rounded-lg text-[13px] text-[#0F0F0F] outline-none focus:border-[#2563EB] transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-[#6B7280]">
                Workspace URL
              </label>
              <div className="flex items-center border border-[#E5E7EB] rounded-lg overflow-hidden">
                <span className="px-3 py-2 bg-[#F9FAFB] text-[13px] text-[#9CA3AF] border-r border-[#E5E7EB]">
                  app.leadflow.ai/
                </span>
                <input
                  defaultValue="leadflow"
                  className="px-3 py-2 text-[13px] text-[#0F0F0F] outline-none flex-1"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-[#6B7280]">
                Industry
              </label>
              <select className="px-3 py-2 border border-[#E5E7EB] rounded-lg text-[13px] text-[#0F0F0F] outline-none">
                <option>SaaS</option>
                <option>Fintech</option>
                <option>E-Commerce</option>
                <option>DevTools</option>
                <option>Other</option>
              </select>
            </div>
            <button className="self-start px-4 py-2 bg-[#0F0F0F] text-white text-[13px] font-semibold rounded-lg hover:bg-[#222] transition-colors">
              Save changes
            </button>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "Notifications" && (
        <div className="flex flex-col gap-4 max-w-xl">
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 flex flex-col gap-4">
            <h2 className="text-[14px] font-semibold text-[#0F0F0F]">
              Email Notifications
            </h2>
            {[
              {
                label: "New lead assigned",
                desc: "Get notified when a lead is assigned to you",
              },
              {
                label: "Campaign completed",
                desc: "Get notified when a campaign finishes",
              },
              {
                label: "Meeting booked",
                desc: "Get notified when a prospect books a meeting",
              },
              {
                label: "Weekly digest",
                desc: "Receive a weekly summary of your pipeline",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-2 border-b border-[#F3F4F6] last:border-0"
              >
                <div>
                  <p className="text-[13px] font-medium text-[#0F0F0F]">
                    {item.label}
                  </p>
                  <p className="text-[12px] text-[#9CA3AF]">{item.desc}</p>
                </div>
                <div className="w-9 h-5 bg-[#2563EB] rounded-full relative cursor-pointer shrink-0">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Appearance Tab */}
      {activeTab === "Appearance" && (
        <div className="flex flex-col gap-4 max-w-xl">
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 flex flex-col gap-5">
            <h2 className="text-[14px] font-semibold text-[#0F0F0F]">
              Appearance
            </h2>
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-semibold text-[#6B7280]">
                Theme
              </label>
              <div className="flex gap-3">
                {["Light", "Dark", "System"].map((t) => (
                  <button
                    key={t}
                    className={`px-4 py-2 rounded-lg text-[13px] font-medium border transition-colors ${
                      t === "Light"
                        ? "border-[#0F0F0F] bg-[#0F0F0F] text-white"
                        : "border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === "Integrations" && (
        <div className="flex flex-col gap-4 max-w-xl">
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 flex flex-col gap-4">
            <h2 className="text-[14px] font-semibold text-[#0F0F0F]">
              Integrations
            </h2>
            {[
              {
                name: "HubSpot",
                desc: "Sync contacts and deals",
                connected: true,
              },
              {
                name: "Salesforce",
                desc: "Two-way CRM sync",
                connected: false,
              },
              {
                name: "Slack",
                desc: "Get notifications in Slack",
                connected: true,
              },
              {
                name: "Gmail",
                desc: "Send emails via Gmail",
                connected: false,
              },
              {
                name: "Zapier",
                desc: "Connect with 5000+ apps",
                connected: false,
              },
            ].map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between py-2 border-b border-[#F3F4F6] last:border-0"
              >
                <div>
                  <p className="text-[13px] font-semibold text-[#0F0F0F]">
                    {item.name}
                  </p>
                  <p className="text-[12px] text-[#9CA3AF]">{item.desc}</p>
                </div>
                <button
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors ${
                    item.connected
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "bg-[#F9FAFB] text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F3F4F6]"
                  }`}
                >
                  {item.connected ? "Connected" : "Connect"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === "Billing" && (
        <div className="flex flex-col gap-4 max-w-xl">
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 flex flex-col gap-4">
            <h2 className="text-[14px] font-semibold text-[#0F0F0F]">
              Current Plan
            </h2>
            <div className="flex items-center justify-between p-4 bg-[#F0F4FF] border border-[#DBEAFE] rounded-lg">
              <div>
                <p className="text-[14px] font-bold text-[#0F0F0F]">
                  Growth Plan
                </p>
                <p className="text-[12px] text-[#6B7280]">
                  ₹4,999/month · Renews July 1, 2026
                </p>
              </div>
              <span className="text-[11px] font-bold text-[#2563EB] bg-white px-2.5 py-1 rounded-full border border-[#DBEAFE]">
                Active
              </span>
            </div>
            <button className="self-start px-4 py-2 border border-[#E5E7EB] text-[13px] font-semibold text-[#6B7280] rounded-lg hover:bg-[#F9FAFB] transition-colors">
              Manage billing
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
