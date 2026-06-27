"use client";

import { Search, Bell, Command } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export default function Topbar() {
  return (
    <header className="h-14 border-b border-[#E5E7EB] bg-white sticky top-0 z-50 flex items-center justify-between px-4 shrink-0">
      {/* Left — Search */}
      <div className="flex items-center gap-2 flex-1 max-w-sm">
        <div className="flex items-center gap-2 w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-md px-3 py-1.5">
          <Search className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-[13px] text-[#0F0F0F] placeholder:text-[#9CA3AF] outline-none w-full"
          />
          <kbd className="text-[10px] text-[#9CA3AF] bg-white border border-[#E5E7EB] rounded px-1 py-0.5 font-mono shrink-0">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-1">
        {/* Command palette */}
        <button
          className="flex items-center justify-center w-8 h-8 rounded-md text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#0F0F0F] transition-colors"
          aria-label="Command palette"
        >
          <Command className="w-3.5 h-3.5" />
        </button>

        {/* Notifications */}
        <button
          className="relative flex items-center justify-center w-8 h-8 rounded-md text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#0F0F0F] transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#2563EB] rounded-full" />
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-[#E5E7EB] mx-1" />

        {/* Workspace switcher */}
        <button className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-[#F9FAFB] transition-colors">
          <div className="w-5 h-5 rounded bg-[#2563EB] flex items-center justify-center">
            <span className="text-[9px] font-bold text-white">L</span>
          </div>
          <span className="text-[13px] font-medium text-[#0F0F0F]">
            LeadFlow
          </span>
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-[#E5E7EB] mx-1" />

        {/* Clerk UserButton — replaces hardcoded profile */}
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-7 h-7",
            },
          }}
        />
      </div>
    </header>
  );
}
