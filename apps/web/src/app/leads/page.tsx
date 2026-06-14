'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiClient } from '@/lib/api-client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Target, Plus, Loader2, Sparkles, Filter, ChevronRight, Award } from 'lucide-react';
import { LeadDto, ContactDto, CompanyDto } from '@leadflow/types';

const STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  RESEARCHING: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  RESEARCHED: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  ENRICHED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  CONTACTED: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  RESPONDED: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  CONVERTED: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  DISQUALIFIED: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

export default function LeadsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  // Form state
  const [contactId, setContactId] = useState('');
  const [companyId, setCompanyId] = useState('');

  // Fetch leads
  const { data: leads, isLoading } = useQuery<LeadDto[]>({
    queryKey: ['leads', statusFilter],
    queryFn: () => ApiClient.get<LeadDto[]>(`/leads${statusFilter ? `?status=${statusFilter}` : ''}`),
  });

  // Fetch contacts and companies for creation dropdowns
  const { data: contacts } = useQuery<ContactDto[]>({
    queryKey: ['contacts'],
    queryFn: () => ApiClient.get<ContactDto[]>('/contacts'),
  });

  const { data: companies } = useQuery<CompanyDto[]>({
    queryKey: ['companies'],
    queryFn: () => ApiClient.get<CompanyDto[]>('/companies'),
  });

  const createMutation = useMutation({
    mutationFn: (newLead: any) => ApiClient.post('/leads', newLead),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setShowForm(false);
      setContactId('');
      setCompanyId('');
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      ApiClient.patch(`/leads/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactId || !companyId) return;
    createMutation.mutate({ contactId, companyId, source: 'MANUAL' });
  };

  const handleStatusChange = (id: string, nextStatus: string) => {
    updateStatusMutation.mutate({ id, status: nextStatus });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Leads pipeline
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Qualified prospective deals undergoing outbound sequence steps.
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" /> Qualify Lead
          </button>
        </div>

        {/* Create Form Drawer */}
        {showForm && (
          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 max-w-xl">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">Route Lead to Pipeline</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Select Target Contact</label>
                <select
                  required
                  value={contactId}
                  onChange={(e) => setContactId(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-350 focus:outline-none"
                >
                  <option value="">-- Select Contact --</option>
                  {(contacts || []).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.firstName} {c.lastName || ''} ({c.jobTitle || 'No title'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Select Target Company</label>
                <select
                  required
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-350 focus:outline-none"
                >
                  <option value="">-- Select Company --</option>
                  {(companies || []).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2 pt-2 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-lg bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                >
                  {createMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Qualify
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter and Table Panel */}
        <div className="space-y-4">
          <div className="flex gap-2 items-center">
            <Filter className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-xs text-slate-400 font-medium">Filter pipeline status:</span>
            <div className="flex gap-1.5">
              {['', 'NEW', 'RESEARCHING', 'CONTACTED', 'RESPONDED', 'CONVERTED', 'DISQUALIFIED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`text-[10px] px-2.5 py-1 rounded-full border transition-all duration-150 ${
                    statusFilter === status
                      ? 'bg-indigo-600/15 text-indigo-300 border-indigo-500/30'
                      : 'bg-slate-900/20 text-slate-400 border-slate-800/80 hover:text-slate-200'
                  }`}
                >
                  {status || 'ALL'}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800/40">
            {isLoading ? (
              <div className="p-16 flex justify-center">
                <Loader2 className="h-6 w-6 text-indigo-400 animate-spin" />
              </div>
            ) : (leads || []).length === 0 ? (
              <div className="p-16 text-center space-y-2">
                <Target className="h-10 w-10 text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-400">No leads found in this stage</p>
                <p className="text-xs text-slate-650">Select another filter or qualify a new prospect.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-850 text-slate-450 uppercase font-bold tracking-wider bg-slate-900/20">
                      <th className="py-4 px-6">Prospect Name</th>
                      <th className="py-4 px-6">Target Account</th>
                      <th className="py-4 px-6">AI Fit Score</th>
                      <th className="py-4 px-6">Pipeline Status</th>
                      <th className="py-4 px-6">Acquisition</th>
                      <th className="py-4 px-6 text-right">Outbound Stage Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850/60">
                    {(leads || []).map((l) => (
                      <tr key={l.id} className="hover:bg-slate-900/10 transition-colors">
                        <td className="py-4 px-6">
                          <p className="font-semibold text-slate-200">
                            {l.contact?.firstName} {l.contact?.lastName || ''}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{l.contact?.jobTitle || 'Prospect'}</p>
                        </td>
                        <td className="py-4 px-6 text-slate-350">{l.company?.name || 'N/A'}</td>
                        <td className="py-4 px-6 text-slate-300">
                          {l.score ? (
                            <div className="flex items-center gap-1 text-indigo-400 font-bold bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10 w-fit">
                              <Award className="h-3.5 w-3.5" /> {l.score}%
                            </div>
                          ) : (
                            <span className="text-slate-600 font-mono">Unscored</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${
                              STATUS_COLORS[l.status] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                            }`}
                          >
                            {l.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-450 font-mono text-[10px]">{l.source || 'MANUAL'}</td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex gap-1.5 justify-end">
                            {l.status === 'NEW' && (
                              <button
                                onClick={() => handleStatusChange(l.id, 'RESEARCHING')}
                                className="text-[10px] px-2 py-1 rounded bg-indigo-600/10 text-indigo-300 border border-indigo-500/25 hover:bg-indigo-600/20"
                              >
                                Research
                              </button>
                            )}
                            {l.status === 'RESEARCHING' && (
                              <button
                                onClick={() => handleStatusChange(l.id, 'CONTACTED')}
                                className="text-[10px] px-2 py-1 rounded bg-emerald-600/10 text-emerald-300 border border-emerald-500/25 hover:bg-emerald-600/20"
                              >
                                Queue Outreach
                              </button>
                            )}
                            {['CONTACTED', 'RESEARCHING'].includes(l.status) && (
                              <button
                                onClick={() => handleStatusChange(l.id, 'RESPONDED')}
                                className="text-[10px] px-2 py-1 rounded bg-purple-600/10 text-purple-300 border border-purple-500/25 hover:bg-purple-600/20"
                              >
                                Reply
                              </button>
                            )}
                            {l.status !== 'DISQUALIFIED' && l.status !== 'CONVERTED' && (
                              <button
                                onClick={() => handleStatusChange(l.id, 'DISQUALIFIED')}
                                className="text-[10px] px-2 py-1 rounded bg-slate-800 text-slate-500 hover:text-slate-350"
                              >
                                Close
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
