'use client';

import React from 'react';
import Link from 'next/link';
import { Bot, ArrowRight, ShieldCheck, Sparkles, Zap, Users } from 'lucide-react';

export default function LandingGate() {
  return (
    <div className="min-h-screen bg-[#030307] flex flex-col justify-center items-center relative overflow-hidden px-4">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -z-10"></div>

      {/* Hero container */}
      <div className="max-w-2xl w-full text-center space-y-8 glass-panel p-10 rounded-2xl glow-indigo border border-slate-800/60 relative">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-indigo-600 flex items-center justify-center glow-indigo shadow-lg">
          <Bot className="h-9 w-9 text-white" />
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
            <Sparkles className="h-3 w-3 animate-spin" /> Welcome to LeadFlow AI
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            LeadFlow <span className="text-indigo-400">AI</span>
          </h1>
          <p className="text-slate-400 max-w-md mx-auto text-sm md:text-base leading-relaxed">
            Scalable, multi-agent autonomous sales outbound engine. Auto-provisions and syncs leads, companies, sequences, and campaigns.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-indigo-600 text-white font-bold text-base hover:bg-indigo-500 active:scale-[0.98] transition-all duration-200 shadow-lg glow-indigo"
          >
            Launch Sales Dashboard <ArrowRight className="h-4.5 w-4.5" />
          </Link>
        </div>

        {/* Feature badges */}
        <div className="grid grid-cols-3 gap-4 border-t border-slate-800/40 pt-8 mt-4 text-left">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-400">
              <Zap className="h-4 w-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Database</span>
            </div>
            <p className="text-[11px] text-slate-500">Postgres Multi-tenant</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-400">
              <Users className="h-4 w-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Security</span>
            </div>
            <p className="text-[11px] text-slate-500">Clerk Session JWT</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-400">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Workspaces</span>
            </div>
            <p className="text-[11px] text-slate-500">Turborepo Setup</p>
          </div>
        </div>
      </div>
    </div>
  );
}
