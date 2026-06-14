'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiClient } from '@/lib/api-client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Building2, Globe, Plus, Loader2, Search, ArrowUpRight } from 'lucide-react';
import { CompanyDto } from '@leadflow/types';

export default function CompaniesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [industry, setIndustry] = useState('');
  const [size, setSize] = useState('');
  const [location, setLocation] = useState('');

  const { data: companies, isLoading } = useQuery<CompanyDto[]>({
    queryKey: ['companies'],
    queryFn: () => ApiClient.get<CompanyDto[]>('/companies'),
  });

  const createMutation = useMutation({
    mutationFn: (newCompany: any) => ApiClient.post('/companies', newCompany),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setShowForm(false);
      setName('');
      setDomain('');
      setIndustry('');
      setSize('');
      setLocation('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    createMutation.mutate({ name, domain, industry, size, location });
  };

  const filteredCompanies = (companies || []).filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.industry?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Target Accounts
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Add and manage target organizations to enrich and source leads from.
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" /> Add Company
          </button>
        </div>

        {/* Create Form Modal/Drawer (Glass Panel) */}
        {showForm && (
          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 max-w-xl">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">New Target Account</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stripe"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Domain URL</label>
                <input
                  type="text"
                  placeholder="e.g. stripe.com"
                  value={domain}
                  onChange={e => setDomain(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Industry</label>
                <input
                  type="text"
                  placeholder="e.g. FinTech"
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Employee Size</label>
                <input
                  type="text"
                  placeholder="e.g. 500-1000"
                  value={size}
                  onChange={e => setSize(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Headquarters</label>
                <input
                  type="text"
                  placeholder="e.g. San Francisco, CA"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
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
                  {createMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Create
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter and Table Panel */}
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search companies by name or industry..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-900/35 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-505 focus:outline-none focus:border-indigo-500/80"
            />
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800/40">
            {isLoading ? (
              <div className="p-16 flex justify-center">
                <Loader2 className="h-6 w-6 text-indigo-400 animate-spin" />
              </div>
            ) : filteredCompanies.length === 0 ? (
              <div className="p-16 text-center space-y-2">
                <Building2 className="h-10 w-10 text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-400">No companies found</p>
                <p className="text-xs text-slate-650">Add a target account to start mapping sales contacts.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-850 text-slate-450 uppercase font-bold tracking-wider bg-slate-900/20">
                      <th className="py-4 px-6">Company Name</th>
                      <th className="py-4 px-6">Domain</th>
                      <th className="py-4 px-6">Industry</th>
                      <th className="py-4 px-6">Employees</th>
                      <th className="py-4 px-6">Location</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850/60">
                    {filteredCompanies.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-900/10 transition-colors">
                        <td className="py-4 px-6 font-semibold text-slate-200">{c.name}</td>
                        <td className="py-4 px-6 text-slate-400 font-mono flex items-center gap-1.5">
                          <Globe className="h-3.5 w-3.5 text-slate-600" /> {c.domain || 'N/A'}
                        </td>
                        <td className="py-4 px-6 text-slate-350">{c.industry || 'N/A'}</td>
                        <td className="py-4 px-6 text-slate-400">{c.size || 'N/A'}</td>
                        <td className="py-4 px-6 text-slate-400">{c.location || 'N/A'}</td>
                        <td className="py-4 px-6 text-right">
                          <a
                            href={c.website || '#'}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-slate-500 hover:text-indigo-400 font-semibold"
                          >
                            Visit <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
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
