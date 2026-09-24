"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import {
  AssetForm,
  StatusBadge,
  draftFromAsset,
  emptyDraft,
  type AssetDraft,
} from "@/components/asset-form";
import { assetsToCsv, csvToAssets } from "@/lib/csv";
import { assetStatus, daysUntil, statusCounts } from "@/lib/status";
import { newId } from "@/lib/storage";
import type { Asset, AssetStatus, Platform } from "@/lib/types";
import {
  PLATFORM_LABEL,
  PLATFORMS,
  STATUSES,
  USAGE_LABEL,
} from "@/lib/types";
import { useAssets } from "@/lib/use-assets";

function toAsset(draft: AssetDraft, existing?: Asset): Asset {
  return {
    id: existing?.id ?? draft.id ?? newId(),
    name: draft.name.trim(),
    creator: draft.creator.trim(),
    platforms: draft.platforms.length ? draft.platforms : ["meta"],
    usage: draft.usage.length ? draft.usage : ["organic"],
    startsAt: draft.startsAt,
    endsAt: draft.endsAt,
    exclusive: draft.exclusive,
    contractUrl: draft.contractUrl.trim(),
    notes: draft.notes.trim(),
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };
}

export function Board() {
  const { assets, hydrated, upsert, remove, replaceAll, resetDemo } =
    useAssets();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<AssetStatus | "all">("all");
  const [platformFilter, setPlatformFilter] = useState<Platform | "all">("all");
  const [draft, setDraft] = useState<AssetDraft | null>(null);
  const [editing, setEditing] = useState<Asset | undefined>();
  const fileRef = useRef<HTMLInputElement>(null);

  const counts = useMemo(() => statusCounts(assets), [assets]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return assets.filter((asset) => {
      const status = assetStatus(asset);
      if (statusFilter !== "all" && status !== statusFilter) return false;
      if (
        platformFilter !== "all" &&
        !asset.platforms.includes(platformFilter)
      ) {
        return false;
      }
      if (!q) return true;
      return `${asset.name} ${asset.creator} ${asset.notes}`
        .toLowerCase()
        .includes(q);
    });
  }, [assets, platformFilter, query, statusFilter]);

  function exportCsv() {
    const blob = new Blob([assetsToCsv(assets)], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clearspan-assets.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function onImport(file: File) {
    const text = await file.text();
    const imported = csvToAssets(text);
    if (!imported.length) {
      window.alert("No valid rows found. Need name, creator, startsAt, endsAt.");
      return;
    }
    replaceAll([...imported, ...assets]);
  }

  return (
    <div className="min-h-full">
      <header className="border-b border-line px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm tracking-[0.22em] uppercase text-ink-dim">
              Clearspan
            </Link>
            <span className="text-line">/</span>
            <span className="text-sm">Rights board</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setEditing(undefined);
                setDraft(emptyDraft());
              }}
              className="rounded-sm bg-accent px-3 py-2 text-sm font-medium text-bg"
            >
              Add asset
            </button>
            <button
              type="button"
              onClick={exportCsv}
              className="rounded-sm border border-line px-3 py-2 text-sm text-ink-dim hover:text-ink"
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="rounded-sm border border-line px-3 py-2 text-sm text-ink-dim hover:text-ink"
            >
              Import CSV
            </button>
            <button
              type="button"
              onClick={resetDemo}
              className="rounded-sm border border-line px-3 py-2 text-sm text-ink-dim hover:text-ink"
            >
              Load demo
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void onImport(file);
                event.target.value = "";
              }}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <section className="grid gap-3 md:grid-cols-3">
          {(
            [
              ["active", counts.active, "Still cleared to run"],
              ["expiring", counts.expiring, "Window closes in 14 days"],
              ["expired", counts.expired, "Stop or renew before next buy"],
            ] as const
          ).map(([key, value, caption]) => (
            <button
              key={key}
              type="button"
              onClick={() =>
                setStatusFilter((current) => (current === key ? "all" : key))
              }
              className={`rounded-sm border bg-bg-elev p-5 text-left ${
                statusFilter === key ? "border-accent" : "border-line"
              }`}
            >
              <p className="text-xs uppercase tracking-[0.18em] text-ink-dim">
                {key}
              </p>
              <p className="mt-2 font-mono text-3xl">{hydrated ? value : "—"}</p>
              <p className="mt-1 text-sm text-ink-dim">{caption}</p>
            </button>
          ))}
        </section>

        <section className="mt-8 flex flex-col gap-3 md:flex-row">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search creator or asset"
            className="flex-1 rounded-sm border border-line bg-bg-elev px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as AssetStatus | "all")
            }
            className="rounded-sm border border-line bg-bg-elev px-3 py-2 text-sm"
          >
            <option value="all">All statuses</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select
            value={platformFilter}
            onChange={(e) =>
              setPlatformFilter(e.target.value as Platform | "all")
            }
            className="rounded-sm border border-line bg-bg-elev px-3 py-2 text-sm"
          >
            <option value="all">All platforms</option>
            {PLATFORMS.map((platform) => (
              <option key={platform} value={platform}>
                {PLATFORM_LABEL[platform]}
              </option>
            ))}
          </select>
        </section>

        <section className="mt-6 overflow-x-auto rounded-sm border border-line">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-bg-mute text-xs uppercase tracking-wide text-ink-dim">
              <tr>
                <th className="px-4 py-3 font-medium">Asset</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Window</th>
                <th className="px-4 py-3 font-medium">Where / how</th>
                <th className="px-4 py-3 font-medium"> </th>
              </tr>
            </thead>
            <tbody>
              {hydrated && visible.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-ink-dim">
                    No assets match. Add one or load the demo book.
                  </td>
                </tr>
              ) : null}
              {visible.map((asset) => {
                const status = assetStatus(asset);
                const remaining = daysUntil(asset.endsAt);
                return (
                  <tr key={asset.id} className="border-t border-line">
                    <td className="px-4 py-4">
                      <p className="font-medium">{asset.name}</p>
                      <p className="text-ink-dim">
                        {asset.creator}
                        {asset.exclusive ? " · exclusive" : ""}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={status} />
                      <p className="mt-1 font-mono text-xs text-ink-dim">
                        {remaining < 0
                          ? `${Math.abs(remaining)}d overdue`
                          : `${remaining}d left`}
                      </p>
                    </td>
                    <td className="px-4 py-4 font-mono text-xs text-ink-dim">
                      {asset.startsAt} → {asset.endsAt}
                    </td>
                    <td className="px-4 py-4 text-ink-dim">
                      <p>
                        {asset.platforms.map((p) => PLATFORM_LABEL[p]).join(" · ")}
                      </p>
                      <p className="text-xs">
                        {asset.usage.map((u) => USAGE_LABEL[u]).join(" · ")}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        className="mr-3 text-accent"
                        onClick={() => {
                          setEditing(asset);
                          setDraft(draftFromAsset(asset));
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="text-stop"
                        onClick={() => {
                          if (window.confirm(`Remove “${asset.name}”?`)) {
                            remove(asset.id);
                          }
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </main>

      {draft ? (
        <div className="fixed inset-0 z-20 grid place-items-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-sm border border-line bg-bg-elev p-6">
            <h2 className="mb-4 text-lg">
              {editing ? "Edit asset" : "New asset"}
            </h2>
            <AssetForm
              draft={draft}
              onChange={setDraft}
              onCancel={() => {
                setDraft(null);
                setEditing(undefined);
              }}
              onSubmit={() => {
                upsert(toAsset(draft, editing));
                setDraft(null);
                setEditing(undefined);
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
