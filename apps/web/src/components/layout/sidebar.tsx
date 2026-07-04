"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  Target,
  Megaphone,
  BarChart3,
  Settings,
  HelpCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import { useUIStore } from "@/store/ui";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Companies", href: "/companies", icon: Building2 },
  { label: "Contacts", href: "/contacts", icon: Users },
  { label: "Leads", href: "/leads", icon: Target },
  { label: "Campaigns", href: "/campaigns", icon: Megaphone },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

const bottomItems = [
  { label: "Help", href: "/help", icon: HelpCircle },
  { label: "Docs", href: "/docs", icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-screen sticky top-0 border-r border-[#E5E7EB] bg-white transition-all duration-200 shrink-0",
        sidebarCollapsed ? "w-15" : "w-55",
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-14 border-b border-[#E5E7EB] shrink-0">
        <div className="w-6 h-6 rounded-md bg-[#2563EB] flex items-center justify-center shrink-0">
          <Zap className="w-3.5 h-3.5 text-white" />
        </div>
        {!sidebarCollapsed && (
          <span className="font-semibold text-[14px] tracking-tight text-[#0F0F0F]">
            LeadFlow AI
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-2.5 py-2 rounded-md text-[13px] font-medium transition-colors",
                active
                  ? "bg-[#F0F4FF] text-[#2563EB]"
                  : "text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#0F0F0F]",
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0",
                  active ? "text-[#2563EB]" : "text-[#9CA3AF]",
                )}
              />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="py-3 px-2 border-t border-[#E5E7EB] flex flex-col gap-0.5">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-2.5 py-2 rounded-md text-[13px] font-medium text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#0F0F0F] transition-colors"
            >
              <Icon className="w-4 h-4 shrink-0 text-[#9CA3AF]" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}

        {/* Profile */}
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2.5 px-2.5 py-2 mt-1 rounded-md hover:bg-[#F9FAFB] cursor-pointer transition-colors">
            <div className="w-6 h-6 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0">
              <span className="text-[10px] font-bold text-white">A</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[12px] font-semibold text-[#0F0F0F] truncate">
                Adi
              </span>
              <span className="text-[11px] text-[#9CA3AF] truncate">
                Founder
              </span>
            </div>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-full mt-2 py-1.5 rounded-md text-[#9CA3AF] hover:bg-[#F9FAFB] hover:text-[#6B7280] transition-colors"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
