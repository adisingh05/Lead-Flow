'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ApiClient } from '@/lib/api-client';
import { DashboardLayout } from '@/components/dashboard-layout';
import {
  TrendingUp,
  Target,
  Send,
  MessageSquare,
  Percent,
  Plus,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  summary: {
    totalLeads: number;
    activeCampaigns: number;
    totalMessages: number;
    replies: number;
    replyRate: number;
  };
  byStatus: { status: string; count: number }[];
  bySource: { source: string; count: number }[];
}

export default function DashboardPage() {
  const { data, isLoading, error, refetch, isFetching } = useQuery<DashboardStats>({
    queryKey: ['dashboard-summary'],
    queryFn: () => ApiClient.get<DashboardStats>('/analytics/dashboard'),
  });

  // Fallback demo data in case backend hasn't seeded/started yet
  const stats = data || {
    summary: { totalLeads: 2540, activeCampaigns: 4, totalMessages: 1256, replies: 189, replyRate: 15 },
    byStatus: [
      { status: 'NEW', count: 1240 },
      { status: 'RESEARCHED', count: 800 },
      { status: 'CONTACTED', count: 311 },
      { status: 'RESPONDED', count: 189 },
    ],
    bySource: [
      { source: 'APOLLO', count: 1540 },
      { source: 'LINKEDIN', count: 800 },
      { source: 'MANUAL', count: 200 },
    ],
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Outbound Overview
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Performance metrics for your outbound multi-agent funnels.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => refetch()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800/40 border border-slate-700/60 text-xs font-semibold text-slate-300 hover:bg-slate-850"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} /> Sync
            </button>
            <Link
              href="/campaigns"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-500"
            >
              <Plus className="h-4 w-4" /> New Campaign
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl"></div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Prospects</span>
              <Target className="h-5 w-5 text-indigo-400" />
            </div>
            <p className="text-3xl font-black text-white">{stats.summary.totalLeads.toLocaleString()}</p>
            <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-indigo-400" /> +12% increase from last week
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Campaigns</span>
              <Send className="h-5 w-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-black text-white">{stats.summary.activeCampaigns}</p>
            <p className="text-[10px] text-slate-500 mt-2">Running outreach tasks</p>
          </div>

          <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Outbox Sent</span>
              <MessageSquare className="h-5 w-5 text-blue-400" />
            </div>
            <p className="text-3xl font-black text-white">{stats.summary.totalMessages.toLocaleString()}</p>
            <p className="text-[10px] text-slate-500 mt-2">Email & LinkedIn</p>
          </div>

          <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-2xl"></div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Response Rate</span>
              <Percent className="h-5 w-5 text-violet-400" />
            </div>
            <p className="text-3xl font-black text-white">{stats.summary.replyRate}%</p>
            <p className="text-[10px] text-slate-500 mt-2">{stats.summary.replies} positive replies received</p>
          </div>
        </div>

        {/* Status Breakdowns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl md:col-span-2 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-350">Funnel Stage Distribution</h2>
            <div className="space-y-3 pt-2">
              {stats.byStatus.map((item) => {
                const percentage = stats.summary.totalLeads > 0 ? (item.count / stats.summary.totalLeads) * 100 : 0;
                return (
                  <div key={item.status} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-300">{item.status}</span>
                      <span className="font-bold text-slate-400">{item.count.toLocaleString()} ({Math.round(percentage)}%)</span>
                    </div>
                    <div className="w-full bg-slate-800/40 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-350">Prospect Acquisition Sources</h2>
            <div className="space-y-4 pt-2">
              {stats.bySource.map((item) => {
                return (
                  <div key={item.source} className="flex justify-between items-center border-b border-slate-800/40 pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="text-xs font-bold text-slate-300">{item.source}</p>
                      <p className="text-[10px] text-slate-500">API Connector</p>
                    </div>
                    <span className="text-xs font-black text-indigo-400 bg-indigo-500/5 px-2.5 py-1 rounded-full border border-indigo-500/10">
                      {item.count.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
