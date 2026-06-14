'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiClient } from '@/lib/api-client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Send, Plus, Loader2, Sparkles, Sliders, Play, Pause, Calendar, Clock, ListChecks } from 'lucide-react';
import { CampaignDto, SequenceDto, IcpDto, CampaignType } from '@leadflow/types';

export default function CampaignsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'campaigns' | 'sequences' | 'icps'>('campaigns');
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [showSequenceForm, setShowSequenceForm] = useState(false);
  const [showIcpForm, setShowIcpForm] = useState(false);

  // Fetch campaign and sequences data
  const { data: campaigns, isLoading: campaignsLoading } = useQuery<CampaignDto[]>({
    queryKey: ['campaigns'],
    queryFn: () => ApiClient.get<CampaignDto[]>('/campaigns'),
  });

  const { data: sequences, isLoading: sequencesLoading } = useQuery<SequenceDto[]>({
    queryKey: ['sequences'],
    queryFn: () => ApiClient.get<SequenceDto[]>('/sequences'),
  });

  const { data: icps, isLoading: icpsLoading } = useQuery<IcpDto[]>({
    queryKey: ['icps'],
    queryFn: () => ApiClient.get<IcpDto[]>('/icps'),
  });

  // Campaign Form State
  const [campName, setCampName] = useState('');
  const [campDesc, setCampDesc] = useState('');
  const [campType, setCampType] = useState<CampaignType>(CampaignType.EMAIL);
  const [campIcpId, setCampIcpId] = useState('');
  const [campSeqId, setCampSeqId] = useState('');

  // Sequence Form State
  const [seqName, setSeqName] = useState('');
  const [seqDesc, setSeqDesc] = useState('');
  const [steps, setSteps] = useState<{ stepNumber: number; type: 'EMAIL' | 'LINKEDIN'; delayDays: number; templateSubject: string; templateBody: string }[]>([
    { stepNumber: 1, type: 'EMAIL', delayDays: 0, templateSubject: 'Hey {{firstName}} - Quick question', templateBody: 'Hey {{firstName}},\n\nSaw your team at {{companyName}} was growing...' }
  ]);

  // ICP Form State
  const [icpName, setIcpName] = useState('');
  const [icpTitleInput, setIcpTitleInput] = useState('');
  const [icpIndustryInput, setIcpIndustryInput] = useState('');
  const [employeeMin, setEmployeeMin] = useState(10);
  const [employeeMax, setEmployeeMax] = useState(500);

  // Mutations
  const createCampaign = useMutation({
    mutationFn: (newCamp: any) => ApiClient.post('/campaigns', newCamp),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      setShowCampaignForm(false);
      setCampName('');
      setCampDesc('');
      setCampIcpId('');
      setCampSeqId('');
    }
  });

  const createSequence = useMutation({
    mutationFn: (newSeq: any) => ApiClient.post('/sequences', newSeq),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sequences'] });
      setShowSequenceForm(false);
      setSeqName('');
      setSeqDesc('');
      setSteps([{ stepNumber: 1, type: 'EMAIL', delayDays: 0, templateSubject: '', templateBody: '' }]);
    }
  });

  const createIcp = useMutation({
    mutationFn: (newIcp: any) => ApiClient.post('/icps', newIcp),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['icps'] });
      setShowIcpForm(false);
      setIcpName('');
      setIcpTitleInput('');
      setIcpIndustryInput('');
    }
  });

  const toggleStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      ApiClient.patch(`/campaigns/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    }
  });

  const handleCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campName) return;
    createCampaign.mutate({
      name: campName,
      description: campDesc || undefined,
      type: campType,
      icpId: campIcpId || undefined,
      sequenceId: campSeqId || undefined,
    });
  };

  const handleSequenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seqName) return;
    createSequence.mutate({
      name: seqName,
      description: seqDesc || undefined,
      steps,
    });
  };

  const handleIcpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!icpName) return;
    createIcp.mutate({
      name: icpName,
      buyerTitles: icpTitleInput.split(',').map(s => s.trim()).filter(Boolean),
      industries: icpIndustryInput.split(',').map(s => s.trim()).filter(Boolean),
      employeeMin,
      employeeMax,
    });
  };

  const addStep = () => {
    setSteps([
      ...steps,
      {
        stepNumber: steps.length + 1,
        type: 'EMAIL',
        delayDays: 3,
        templateSubject: 'Following up',
        templateBody: 'Hi {{firstName}},\n\nWanted to make sure you saw my last note...'
      }
    ]);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Campaign & Sequence Studio
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Design outreach templates, configure targets, and orchestrate outbound flows.
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-1.5 border-b border-slate-800/40 pb-px">
          {(['campaigns', 'sequences', 'icps'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs font-bold px-4 py-2.5 border-b-2 -mb-px transition-all duration-200 capitalize ${
                activeTab === tab
                  ? 'border-indigo-500 text-indigo-400 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* CAMPAIGNS TAB */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-350">Outbound Campaigns</h2>
              <button
                onClick={() => setShowCampaignForm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-500"
              >
                <Plus className="h-3.5 w-3.5" /> Create Campaign
              </button>
            </div>

            {showCampaignForm && (
              <form onSubmit={handleCampaignSubmit} className="glass-panel p-6 rounded-2xl border border-slate-800/80 max-w-xl grid grid-cols-2 gap-4">
                <h3 className="text-xs font-extrabold text-indigo-300 uppercase tracking-widest col-span-2">New Outbound Flow</h3>
                
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Campaign Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. US Growth Q3"
                    value={campName}
                    onChange={e => setCampName(e.target.value)}
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Description</label>
                  <textarea
                    placeholder="Brief description of the targeting sequence..."
                    value={campDesc}
                    onChange={e => setCampDesc(e.target.value)}
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Channel Mode</label>
                  <select
                    value={campType}
                    onChange={e => setCampType(e.target.value as CampaignType)}
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-350 focus:outline-none"
                  >
                    <option value="EMAIL">Email Sequence Only</option>
                    <option value="LINKEDIN">LinkedIn Connect Only</option>
                    <option value="MULTICHANNEL">Multichannel AI</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Attach Target ICP</label>
                  <select
                    value={campIcpId}
                    onChange={e => setCampIcpId(e.target.value)}
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-350 focus:outline-none"
                  >
                    <option value="">-- No ICP Filter --</option>
                    {(icps || []).map(i => (
                      <option key={i.id} value={i.id}>{i.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Sequence Templates</label>
                  <select
                    value={campSeqId}
                    onChange={e => setCampSeqId(e.target.value)}
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-350 focus:outline-none"
                  >
                    <option value="">-- Manual/No Sequence --</option>
                    {(sequences || []).map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2 pt-2 flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowCampaignForm(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-lg bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-500"
                  >
                    Create Flow
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaignsLoading ? (
                <div className="col-span-2 flex justify-center p-16">
                  <Loader2 className="h-6 w-6 text-indigo-400 animate-spin" />
                </div>
              ) : (campaigns || []).length === 0 ? (
                <div className="col-span-2 p-16 text-center border border-dashed border-slate-800/80 rounded-2xl">
                  <Send className="h-10 w-10 text-slate-650 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-400">No campaigns launched</p>
                  <p className="text-xs text-slate-600">Create your first outbound campaign to begin sequencing.</p>
                </div>
              ) : (
                (campaigns || []).map((camp) => (
                  <div key={camp.id} className="glass-card p-6 rounded-2xl space-y-4 border border-slate-800/40 relative">
                    <div className="absolute top-6 right-6">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold ${
                        camp.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                      }`}>
                        {camp.status}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-extrabold text-slate-200 text-sm">{camp.name}</h3>
                      <p className="text-xs text-slate-500">{camp.description || 'No description provided.'}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] border-t border-b border-slate-800/30 py-3 text-slate-400">
                      <div>
                        <span className="font-bold text-slate-500">CHANNEL:</span> {camp.type}
                      </div>
                      <div>
                        <span className="font-bold text-slate-500">TARGET:</span> {camp.icpId ? 'ICP Filtered' : 'All Mapped'}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10">
                        {((camp as any)._count?.leads || 0)} Qualified Leads
                      </span>

                      <div className="flex gap-2">
                        {camp.status === 'ACTIVE' ? (
                          <button
                            onClick={() => toggleStatus.mutate({ id: camp.id, status: 'PAUSED' })}
                            className="flex items-center gap-1 text-[10px] px-2 py-1 rounded bg-slate-800 text-slate-400 hover:text-slate-200"
                          >
                            <Pause className="h-3 w-3" /> Pause
                          </button>
                        ) : (
                          <button
                            onClick={() => toggleStatus.mutate({ id: camp.id, status: 'ACTIVE' })}
                            className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded bg-indigo-600/20 text-indigo-400 border border-indigo-500/25 hover:bg-indigo-600/35"
                          >
                            <Play className="h-3 w-3" /> Start Flow
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* SEQUENCES TAB */}
        {activeTab === 'sequences' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-350">Outbound Step Templates</h2>
              <button
                onClick={() => setShowSequenceForm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-500"
              >
                <Plus className="h-3.5 w-3.5" /> Design Sequence
              </button>
            </div>

            {showSequenceForm && (
              <form onSubmit={handleSequenceSubmit} className="glass-panel p-6 rounded-2xl border border-slate-800/80 max-w-xl space-y-4">
                <h3 className="text-xs font-extrabold text-indigo-300 uppercase tracking-widest">Construct outreach flow</h3>
                
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Sequence Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Founder Outbound Sequence"
                    value={seqName}
                    onChange={e => setSeqName(e.target.value)}
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Brief Description</label>
                  <input
                    type="text"
                    placeholder="Warm intro sequence for founders..."
                    value={seqDesc}
                    onChange={e => setSeqDesc(e.target.value)}
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-extrabold text-slate-450 tracking-wide block">SEQUENCE STEPS:</span>
                  {steps.map((step, idx) => (
                    <div key={idx} className="p-3 border border-slate-800/80 rounded-xl bg-slate-950/20 space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                        <span>STEP #{step.stepNumber}</span>
                        <div className="flex gap-2">
                          <select
                            value={step.type}
                            onChange={e => {
                              const copy = [...steps];
                              copy[idx].type = e.target.value as 'EMAIL' | 'LINKEDIN';
                              setSteps(copy);
                            }}
                            className="bg-slate-900 text-slate-300 focus:outline-none rounded px-1 py-0.5 border border-slate-800"
                          >
                            <option value="EMAIL">Email</option>
                            <option value="LINKEDIN">LinkedIn Connect</option>
                          </select>
                          <input
                            type="number"
                            value={step.delayDays}
                            onChange={e => {
                              const copy = [...steps];
                              copy[idx].delayDays = parseInt(e.target.value) || 0;
                              setSteps(copy);
                            }}
                            className="bg-slate-900 text-slate-350 focus:outline-none rounded px-1 py-0.5 border border-slate-800 w-16"
                          />
                          <span>days delay</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {step.type === 'EMAIL' && (
                          <input
                            type="text"
                            placeholder="Subject template"
                            value={step.templateSubject}
                            onChange={e => {
                              const copy = [...steps];
                              copy[idx].templateSubject = e.target.value;
                              setSteps(copy);
                            }}
                            className="w-full bg-slate-900/40 border border-slate-800 rounded px-2.5 py-1 text-xs"
                          />
                        )}
                        <textarea
                          placeholder="Body template (supports template tags like {{firstName}}, {{companyName}})"
                          value={step.templateBody}
                          onChange={e => {
                            const copy = [...steps];
                            copy[idx].templateBody = e.target.value;
                            setSteps(copy);
                          }}
                          className="w-full bg-slate-900/40 border border-slate-800 rounded px-2.5 py-1.5 text-xs h-16"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addStep}
                    className="text-[10px] font-bold text-indigo-400 hover:text-indigo-350 flex items-center gap-1 py-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Next Step
                  </button>
                </div>

                <div className="pt-2 flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowSequenceForm(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-lg bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-500"
                  >
                    Save Sequence
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {sequencesLoading ? (
                <div className="flex justify-center p-12">
                  <Loader2 className="h-5 w-5 text-indigo-400 animate-spin" />
                </div>
              ) : (sequences || []).length === 0 ? (
                <div className="p-16 text-center border border-dashed border-slate-850 rounded-2xl">
                  <ListChecks className="h-10 w-10 text-slate-650 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-400">No sequences defined</p>
                  <p className="text-xs text-slate-600">Design step-by-step outreach delays and copy.</p>
                </div>
              ) : (
                (sequences || []).map((seq) => (
                  <div key={seq.id} className="glass-panel p-6 rounded-2xl border border-slate-800/30 grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1 space-y-1">
                      <h3 className="font-extrabold text-slate-250 text-sm flex items-center gap-1.5">
                        {seq.name}
                      </h3>
                      <p className="text-xs text-slate-550">{seq.description}</p>
                    </div>

                    <div className="md:col-span-3 flex flex-wrap gap-3 items-center">
                      {(seq.steps || []).map((step) => (
                        <div key={step.id} className="flex items-center gap-2">
                          <div className="p-3 border border-slate-800/80 rounded-xl bg-slate-900/30 space-y-1 text-[10px] w-48">
                            <div className="flex justify-between font-bold text-indigo-400">
                              <span>STEP #{step.stepNumber}: {step.type}</span>
                              <span className="text-slate-500 flex items-center gap-0.5">
                                <Clock className="h-3 w-3" /> Day {step.delayDays}
                              </span>
                            </div>
                            <p className="text-slate-400 truncate mt-1">
                              {step.templateSubject ? `Subj: ${step.templateSubject}` : `Body: ${step.templateBody}`}
                            </p>
                          </div>
                          {step.stepNumber < (seq.steps || []).length && (
                            <ChevronRight className="h-4 w-4 text-slate-700" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ICP TAB */}
        {activeTab === 'icps' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-350">Ideal Customer Profiles (ICPs)</h2>
              <button
                onClick={() => setShowIcpForm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-500"
              >
                <Plus className="h-3.5 w-3.5" /> Define ICP
              </button>
            </div>

            {showIcpForm && (
              <form onSubmit={handleIcpSubmit} className="glass-panel p-6 rounded-2xl border border-slate-800/80 max-w-xl grid grid-cols-2 gap-4">
                <h3 className="text-xs font-extrabold text-indigo-300 uppercase tracking-widest col-span-2">New Target Persona</h3>
                
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Profile Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FinTech Founders Mid-Market"
                    value={icpName}
                    onChange={e => setIcpName(e.target.value)}
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Target Buyer Titles (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Founder, CEO, CTO"
                    value={icpTitleInput}
                    onChange={e => setIcpTitleInput(e.target.value)}
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-105"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Target Industries (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. FinTech, SaaS, AI"
                    value={icpIndustryInput}
                    onChange={e => setIcpIndustryInput(e.target.value)}
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-105"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Min Employee Count</label>
                  <input
                    type="number"
                    value={employeeMin}
                    onChange={e => setEmployeeMin(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-105"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Max Employee Count</label>
                  <input
                    type="number"
                    value={employeeMax}
                    onChange={e => setEmployeeMax(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-105"
                  />
                </div>

                <div className="col-span-2 pt-2 flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowIcpForm(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-lg bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-500"
                  >
                    Save Persona
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {icpsLoading ? (
                <div className="col-span-3 flex justify-center p-12">
                  <Loader2 className="h-5 w-5 text-indigo-400 animate-spin" />
                </div>
              ) : (icps || []).length === 0 ? (
                <div className="col-span-3 p-16 text-center border border-dashed border-slate-850 rounded-2xl">
                  <Sliders className="h-10 w-10 text-slate-650 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-400">No ICPs defined</p>
                  <p className="text-xs text-slate-600">Create a profile to guide autonomous AI scraper actions.</p>
                </div>
              ) : (
                (icps || []).map((i) => (
                  <div key={i.id} className="glass-card p-5 rounded-2xl border border-slate-800/40 space-y-4">
                    <h3 className="font-extrabold text-slate-200 text-sm border-b border-slate-800/30 pb-2">
                      {i.name}
                    </h3>
                    <div className="space-y-2 text-[10px]">
                      <div>
                        <span className="font-bold text-slate-500 uppercase tracking-wide block">Industries:</span>
                        <p className="text-slate-350">{Array.isArray(i.industries) ? i.industries.join(', ') : 'All'}</p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-500 uppercase tracking-wide block">Buyer Titles:</span>
                        <p className="text-slate-350">{Array.isArray(i.buyerTitles) ? i.buyerTitles.join(', ') : 'All'}</p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-500 uppercase tracking-wide block">Company Size:</span>
                        <p className="text-slate-350">{i.employeeMin || 0} - {i.employeeMax || 'unlimited'} employees</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
