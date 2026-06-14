'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiClient } from '@/lib/api-client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Users2, Plus, Loader2, Search, Mail, Linkedin, MapPin } from 'lucide-react';
import { ContactDto, CompanyDto } from '@leadflow/types';

export default function ContactsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [location, setLocation] = useState('');

  // Fetch contacts
  const { data: contacts, isLoading } = useQuery<ContactDto[]>({
    queryKey: ['contacts'],
    queryFn: () => ApiClient.get<ContactDto[]>('/contacts'),
  });

  // Fetch companies for dropdown selection
  const { data: companies } = useQuery<CompanyDto[]>({
    queryKey: ['companies'],
    queryFn: () => ApiClient.get<CompanyDto[]>('/companies'),
  });

  const createMutation = useMutation({
    mutationFn: (newContact: any) => ApiClient.post('/contacts', newContact),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      setShowForm(false);
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setJobTitle('');
      setCompanyId('');
      setLinkedinUrl('');
      setLocation('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName) return;
    createMutation.mutate({
      firstName,
      lastName: lastName || undefined,
      email: email || undefined,
      phone: phone || undefined,
      jobTitle: jobTitle || undefined,
      companyId: companyId || undefined,
      linkedinUrl: linkedinUrl || undefined,
      location: location || undefined,
    });
  };

  const filteredContacts = (contacts || []).filter((c) => {
    const fullName = `${c.firstName} ${c.lastName || ''}`.toLowerCase();
    return (
      fullName.includes(search.toLowerCase()) ||
      c.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Contacts Database
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Add and manage prospects to route into outbound campaign steps.
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" /> Add Contact
          </button>
        </div>

        {/* Create Form Drawer */}
        {showForm && (
          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 max-w-xl">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">New Contact Target</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">First Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Last Name</label>
                <input
                  type="text"
                  placeholder="e.g. Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. john.doe@stripe.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Phone</label>
                <input
                  type="text"
                  placeholder="e.g. +1 555-0199"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Job Title</label>
                <input
                  type="text"
                  placeholder="e.g. Head of Growth"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Select Target Company</label>
                <select
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-350 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">-- Select Company --</option>
                  {(companies || []).map((comp) => (
                    <option key={comp.id} value={comp.id}>
                      {comp.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">LinkedIn URL</label>
                <input
                  type="text"
                  placeholder="e.g. linkedin.com/in/johndoe"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Location</label>
                <input
                  type="text"
                  placeholder="e.g. New York, NY"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
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
              placeholder="Search by name, job title, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/35 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-505 focus:outline-none focus:border-indigo-500/80"
            />
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800/40">
            {isLoading ? (
              <div className="p-16 flex justify-center">
                <Loader2 className="h-6 w-6 text-indigo-400 animate-spin" />
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="p-16 text-center space-y-2">
                <Users2 className="h-10 w-10 text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-400">No contacts found</p>
                <p className="text-xs text-slate-650">Add a contact to populate campaign target lists.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-850 text-slate-450 uppercase font-bold tracking-wider bg-slate-900/20">
                      <th className="py-4 px-6">Name</th>
                      <th className="py-4 px-6">Job Title</th>
                      <th className="py-4 px-6">Company</th>
                      <th className="py-4 px-6">Email / Contact</th>
                      <th className="py-4 px-6">Location</th>
                      <th className="py-4 px-6 text-right">Networks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850/60">
                    {filteredContacts.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-900/10 transition-colors">
                        <td className="py-4 px-6 font-semibold text-slate-200">
                          {c.firstName} {c.lastName || ''}
                        </td>
                        <td className="py-4 px-6 text-slate-350">{c.jobTitle || 'N/A'}</td>
                        <td className="py-4 px-6 text-slate-300 font-medium">
                          {c.company?.name || 'N/A'}
                        </td>
                        <td className="py-4 px-6 text-slate-400">
                          <div className="flex items-center gap-1.5 font-mono text-[11px]">
                            <Mail className="h-3.5 w-3.5 text-slate-600" /> {c.email || 'N/A'}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-slate-400 flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-600" /> {c.location || 'N/A'}
                        </td>
                        <td className="py-4 px-6 text-right">
                          {c.linkedinUrl ? (
                            <a
                              href={c.linkedinUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-slate-500 hover:text-indigo-400 font-semibold"
                            >
                              <Linkedin className="h-4 w-4" /> Profile
                            </a>
                          ) : (
                            <span className="text-slate-650">N/A</span>
                          )}
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
