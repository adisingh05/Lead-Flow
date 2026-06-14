'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/hooks/use-store';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Settings, Shield, User, Bot, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  const { currentClerkId, currentEmail, setMockUser } = useAppStore();
  const [clerkIdInput, setClerkIdInput] = useState(currentClerkId);
  const [emailInput, setEmailInput] = useState(currentEmail);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setMockUser(clerkIdInput, emailInput);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            System & Billing Settings
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Configure integrations, Clerk authentication, database configurations, and multi-tenant billing variables.
          </p>
        </div>

        {/* Development Mocks Card */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800/40 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-200">Local Development JWT Bypass</h2>
              <p className="text-[10px] text-slate-500">Configure mock user parameters that pass through the API ClerkAuthGuard during testing.</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">Mock Clerk Sub (User ID)</label>
              <input
                type="text"
                required
                value={clerkIdInput}
                onChange={(e) => setClerkIdInput(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">Mock User Email</label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
              />
            </div>

            <div className="col-span-2 flex justify-between items-center pt-2">
              <span className="text-[11px] text-indigo-400 font-semibold">
                {saveSuccess ? '✓ Saved successfully! localStorage synced.' : ''}
              </span>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-lg bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-500"
              >
                Save Sync Parameters
              </button>
            </div>
          </form>
        </div>

        {/* Integration details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800/40 space-y-3">
            <div className="flex items-center gap-2.5 text-slate-200 font-bold text-xs uppercase tracking-wider">
              <Bot className="h-4.5 w-4.5 text-indigo-400" /> Multi-Agent Engine
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              LangGraph orchestration queues tasks through Redis and evaluates prospect details using OpenAI GPT-4o. Leads are matched automatically against your active ICP persona before emails compile.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 text-[10px] border border-slate-800 text-slate-500">
              Agent runs status: <span className="text-amber-500 font-bold">RESERVED</span>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800/40 space-y-3">
            <div className="flex items-center gap-2.5 text-slate-200 font-bold text-xs uppercase tracking-wider">
              <User className="h-4.5 w-4.5 text-indigo-400" /> Multi-Tenancy Scope
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              All tables utilize PostgreSQL schemas filtered strictly on `OrganizationId` index ranges. This enforces isolation of activities, target sequences, message payloads, and scraper task results.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 text-[10px] border border-slate-800 text-slate-500">
              Isolation enforcement: <span className="text-emerald-500 font-bold">SQL INDEX MATCHED</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
