'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/hooks/use-store';
import {
  LayoutDashboard,
  Building2,
  Users2,
  Target,
  Send,
  Settings,
  Bot,
  User,
  LogOut,
  Sparkles,
} from 'lucide-react';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Companies', href: '/companies', icon: Building2 },
  { name: 'Contacts', href: '/contacts', icon: Users2 },
  { name: 'Leads', href: '/leads', icon: Target },
  { name: 'Campaigns', href: '/campaigns', icon: Send },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentClerkId, currentEmail, setMockUser } = useAppStore();

  return (
    <div className="flex min-h-screen bg-[#050508] text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800/40 glass-panel flex flex-col justify-between fixed top-0 bottom-0 left-0 z-30">
        <div>
          {/* Logo Header */}
          <div className="h-20 flex items-center px-6 border-b border-slate-800/40">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center glow-indigo">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  LeadFlow
                </span>
                <span className="text-xs font-semibold text-indigo-400 ml-1">AI</span>
              </div>
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1.5">
            {SIDEBAR_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.05)]'
                      : 'text-slate-400 hover:bg-slate-800/35 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Identity switcher */}
        <div className="p-4 border-t border-slate-800/40 bg-slate-950/20 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
              <User className="h-4.5 w-4.5 text-slate-400" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold truncate text-slate-300">Developer Mode</p>
              <p className="text-[10px] text-slate-500 truncate">{currentEmail}</p>
            </div>
          </div>

          <div className="space-y-1 bg-slate-900/30 p-2 rounded-lg border border-slate-800/40">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">
              Active Session Mock
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setMockUser('mock-user-123', 'admin@leadflow.ai')}
                className={`text-[9px] px-2 py-1 rounded flex-1 ${
                  currentClerkId === 'mock-user-123'
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : 'bg-slate-800/30 text-slate-400 hover:bg-slate-800/50'
                }`}
              >
                Owner
              </button>
              <button
                onClick={() => setMockUser('mock-member-456', 'sales@leadflow.ai')}
                className={`text-[9px] px-2 py-1 rounded flex-1 ${
                  currentClerkId === 'mock-member-456'
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : 'bg-slate-800/30 text-slate-400 hover:bg-slate-800/50'
                }`}
              >
                Member
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="h-20 border-b border-slate-800/40 glass-panel flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex items-center gap-3 text-xs bg-indigo-500/5 border border-indigo-500/10 px-3 py-1.5 rounded-full">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
            <span className="font-medium text-slate-300">
              Autonomous Sales Agent engine active (CRM Ready)
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-300">Acme Outbound Corp</p>
              <p className="text-[10px] text-slate-500">Standard Tier</p>
            </div>
          </div>
        </header>

        {/* Dashboard Main Content Panel */}
        <main className="flex-1 p-8 bg-[#040407]">{children}</main>
      </div>
    </div>
  );
}
