"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Megaphone,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useCampaigns,
  useCreateCampaign,
  useUpdateCampaign,
  useDeleteCampaign,
  useUpdateCampaignStatus,
} from "@/hooks/useCampaigns";
import Modal from "@/components/ui/Modal";
import { Campaign } from "@/types";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = ["DRAFT", "ACTIVE", "PAUSED", "COMPLETED", "ARCHIVED"];

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700",
  PAUSED: "bg-amber-50 text-amber-700",
  COMPLETED: "bg-gray-100 text-gray-500",
  DRAFT: "bg-blue-50 text-blue-700",
  ARCHIVED: "bg-gray-100 text-gray-400",
};

// Which statuses a campaign can transition to from its current status
const NEXT_STATUSES: Record<string, string[]> = {
  DRAFT: ["ACTIVE"],
  ACTIVE: ["PAUSED", "COMPLETED"],
  PAUSED: ["ACTIVE", "COMPLETED"],
  COMPLETED: ["ARCHIVED"],
  ARCHIVED: [],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize shrink-0 ${
        STATUS_STYLES[status] ?? "bg-gray-100 text-gray-500"
      }`}
    >
      {status.toLowerCase()}
    </span>
  );
}

function CampaignForm({
  initial,
  onSubmit,
  isPending,
  submitLabel,
}: {
  initial?: Partial<Campaign>;
  onSubmit: (data: { name: string; description?: string }) => void;
  isPending: boolean;
  submitLabel: string;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");

  const inputClass =
    "w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] text-[#0F0F0F] placeholder:text-[#9CA3AF] outline-none focus:border-[#2563EB]";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <label className="text-[12px] font-medium text-[#6B7280] mb-1 block">
          Campaign name *
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Q3 Fintech Outreach"
          required
          className={inputClass}
        />
      </div>
      <div>
        <label className="text-[12px] font-medium text-[#6B7280] mb-1 block">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What's this campaign targeting?"
          rows={3}
          className={inputClass}
        />
      </div>
      <button
        type="submit"
        disabled={isPending || !name.trim()}
        className="mt-2 bg-[#0F0F0F] text-white text-[13px] font-semibold rounded-lg py-2.5 hover:bg-[#222] transition-colors disabled:opacity-50"
      >
        {isPending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

function DeleteConfirmModal({
  campaign,
  onConfirm,
  onCancel,
  isPending,
}: {
  campaign: Campaign;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  return (
    <Modal open onClose={onCancel} title="Delete Campaign">
      <div className="flex flex-col gap-4">
        <p className="text-[13px] text-[#6B7280]">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-[#0F0F0F]">{campaign.name}</span>?
          This cannot be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-[13px] font-semibold text-[#6B7280] hover:text-[#0F0F0F]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="px-4 py-2 bg-red-600 text-white text-[13px] font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CampaignsPage() {
  // Filters & pagination state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "createdAt" | "status">(
    "createdAt",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const LIMIT = 10;

  // Modal state
  const [showCreate, setShowCreate] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [deletingCampaign, setDeletingCampaign] = useState<Campaign | null>(
    null,
  );

  // Queries & mutations
  const { data, isLoading, isError } = useCampaigns({
    search: search || undefined,
    status: status || undefined,
    sortBy,
    sortOrder,
    page,
    limit: LIMIT,
  });

  const createCampaign = useCreateCampaign();
  const updateCampaign = useUpdateCampaign();
  const deleteCampaign = useDeleteCampaign();
  const updateStatus = useUpdateCampaignStatus();

  const campaigns = data?.items ?? [];
  const meta = data?.meta;

  // Reset to page 1 when filters change
  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };
  const handleStatus = (value: string) => {
    setStatus(value);
    setPage(1);
  };
  const handleSort = (value: string) => {
    const [by, order] = value.split("-") as [
      "name" | "createdAt" | "status",
      "asc" | "desc",
    ];
    setSortBy(by);
    setSortOrder(order);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#0F0F0F] tracking-tight">
            Campaigns
          </h1>
          <p className="text-[13px] text-[#6B7280] mt-0.5">
            {isLoading ? "Loading..." : `${meta?.total ?? 0} campaigns total`}
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#0F0F0F] text-white text-[13px] font-semibold rounded-lg hover:bg-[#222] transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Campaign
        </button>
      </div>

      {/* ── Summary stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total", value: meta?.total ?? 0 },
          {
            label: "Active",
            value: campaigns.filter((c) => c.status === "ACTIVE").length,
          },
          {
            label: "Leads",
            value: campaigns.reduce((a, c) => a + (c.leadsCount ?? 0), 0),
          },
          {
            label: "Meetings",
            value: campaigns.reduce((a, c) => a + (c.meetings ?? 0), 0),
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-[#E5E7EB] rounded-xl p-5"
          >
            <p className="text-[13px] font-medium text-[#6B7280] mb-1">
              {stat.label}
            </p>
            <p className="text-[28px] font-bold text-[#0F0F0F] leading-none tracking-tight">
              {isLoading ? "—" : stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Filters toolbar ── */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 flex-1 min-w-45 max-w-xs">
          <Search className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="bg-transparent text-[13px] text-[#0F0F0F] placeholder:text-[#9CA3AF] outline-none w-full"
          />
        </div>

        {/* Status filter */}
        <select
          value={status}
          onChange={(e) => handleStatus(e.target.value)}
          className="bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] text-[#0F0F0F] outline-none"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => handleSort(e.target.value)}
          className="bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] text-[#0F0F0F] outline-none"
        >
          <option value="createdAt-desc">Newest first</option>
          <option value="createdAt-asc">Oldest first</option>
          <option value="name-asc">Name A–Z</option>
          <option value="name-desc">Name Z–A</option>
          <option value="status-asc">Status A–Z</option>
        </select>
      </div>

      {/* ── Error ── */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-[13px] text-red-700">
          Couldn't load campaigns from the server.
        </div>
      )}

      {/* ── List ── */}
      {isLoading ? (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-12 flex items-center justify-center">
          <p className="text-[13px] text-[#9CA3AF]">Loading campaigns...</p>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-16 flex flex-col items-center gap-2">
          <Megaphone className="w-8 h-8 text-[#E5E7EB]" />
          <p className="text-[13px] text-[#9CA3AF]">No campaigns found</p>
          {(search || status) && (
            <button
              onClick={() => {
                handleSearch("");
                handleStatus("");
              }}
              className="text-[12px] text-[#2563EB] hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {campaigns.map((campaign) => {
            const openRate =
              campaign.sent > 0
                ? Math.round((campaign.opened / campaign.sent) * 100)
                : 0;
            const replyRate =
              campaign.sent > 0
                ? Math.round((campaign.replied / campaign.sent) * 100)
                : 0;
            const nextStatuses = NEXT_STATUSES[campaign.status] ?? [];

            return (
              <div
                key={campaign.id}
                className="bg-white border border-[#E5E7EB] rounded-xl p-5 hover:shadow-sm transition-shadow"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-semibold text-[#0F0F0F] truncate">
                      {campaign.name}
                    </h3>
                    {campaign.description && (
                      <p className="text-[12px] text-[#9CA3AF] mt-0.5 truncate">
                        {campaign.description}
                      </p>
                    )}
                    <p className="text-[12px] text-[#9CA3AF] mt-0.5">
                      Started {formatDate(campaign.startDate)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={campaign.status} />
                    {/* Edit */}
                    <button
                      onClick={() => setEditingCampaign(campaign)}
                      className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#0F0F0F] hover:bg-[#F3F4F6]"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    {/* Delete */}
                    <button
                      onClick={() => setDeletingCampaign(campaign)}
                      className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-red-600 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-5 gap-4 mb-4">
                  {[
                    { label: "Leads", value: campaign.leadsCount },
                    { label: "Sent", value: campaign.sent },
                    { label: "Opened", value: campaign.opened },
                    { label: "Replied", value: campaign.replied },
                    { label: "Meetings", value: campaign.meetings },
                  ].map((m) => (
                    <div key={m.label}>
                      <p className="text-[11px] text-[#9CA3AF] font-medium">
                        {m.label}
                      </p>
                      <p className="text-[16px] font-bold text-[#0F0F0F] leading-tight">
                        {m.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Progress bars */}
                <div className="flex flex-col gap-2 mb-4">
                  {[
                    {
                      label: "Open rate",
                      value: openRate,
                      color: "bg-[#2563EB]",
                    },
                    {
                      label: "Reply rate",
                      value: replyRate,
                      color: "bg-emerald-500",
                    },
                  ].map((bar) => (
                    <div key={bar.label} className="flex items-center gap-3">
                      <span className="text-[11px] text-[#9CA3AF] w-16 shrink-0">
                        {bar.label}
                      </span>
                      <div className="flex-1 h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                        <div
                          className={`h-full ${bar.color} rounded-full transition-all`}
                          style={{ width: `${bar.value}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-[#0F0F0F] w-8 text-right">
                        {bar.value}%
                      </span>
                    </div>
                  ))}
                </div>

                {/* Status transition buttons */}
                {nextStatuses.length > 0 && (
                  <div className="flex gap-2 pt-2 border-t border-[#F3F4F6]">
                    <span className="text-[11px] text-[#9CA3AF] self-center">
                      Move to:
                    </span>
                    {nextStatuses.map((next) => (
                      <button
                        key={next}
                        onClick={() =>
                          updateStatus.mutate({ id: campaign.id, status: next })
                        }
                        disabled={updateStatus.isPending}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-[#E5E7EB] text-[#6B7280] hover:border-[#0F0F0F] hover:text-[#0F0F0F] disabled:opacity-50"
                      >
                        {next.charAt(0) + next.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Pagination ── */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-[12px] text-[#9CA3AF]">
            Showing {(page - 1) * LIMIT + 1}–
            {Math.min(page * LIMIT, meta.total)} of {meta.total}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:text-[#0F0F0F] disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
              (p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-[12px] font-semibold ${
                    p === page
                      ? "bg-[#0F0F0F] text-white"
                      : "border border-[#E5E7EB] text-[#6B7280] hover:text-[#0F0F0F]"
                  }`}
                >
                  {p}
                </button>
              ),
            )}
            <button
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page >= meta.totalPages}
              className="p-1.5 rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:text-[#0F0F0F] disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Create Modal ── */}
      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="New Campaign"
      >
        <CampaignForm
          submitLabel="Create Campaign"
          isPending={createCampaign.isPending}
          onSubmit={(data) =>
            createCampaign.mutate(data, {
              onSuccess: () => setShowCreate(false),
            })
          }
        />
      </Modal>

      {/* ── Edit Modal ── */}
      {editingCampaign && (
        <Modal
          open
          onClose={() => setEditingCampaign(null)}
          title="Edit Campaign"
        >
          <CampaignForm
            initial={editingCampaign}
            submitLabel="Save Changes"
            isPending={updateCampaign.isPending}
            onSubmit={(data) =>
              updateCampaign.mutate(
                { id: editingCampaign.id, data },
                { onSuccess: () => setEditingCampaign(null) },
              )
            }
          />
        </Modal>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deletingCampaign && (
        <DeleteConfirmModal
          campaign={deletingCampaign}
          isPending={deleteCampaign.isPending}
          onCancel={() => setDeletingCampaign(null)}
          onConfirm={() =>
            deleteCampaign.mutate(deletingCampaign.id, {
              onSuccess: () => setDeletingCampaign(null),
            })
          }
        />
      )}
    </div>
  );
}
