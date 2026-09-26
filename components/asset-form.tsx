import type { Asset, AssetStatus, Platform, Usage } from "@/lib/types";
import { PLATFORM_LABEL, PLATFORMS, USAGE_LABEL, USAGES } from "@/lib/types";

export type AssetDraft = {
  id?: string;
  name: string;
  creator: string;
  platforms: Platform[];
  usage: Usage[];
  startsAt: string;
  endsAt: string;
  exclusive: boolean;
  contractUrl: string;
  notes: string;
};

export const emptyDraft = (): AssetDraft => ({
  name: "",
  creator: "",
  platforms: ["meta"],
  usage: ["paid"],
  startsAt: "",
  endsAt: "",
  exclusive: false,
  contractUrl: "",
  notes: "",
});

export function draftFromAsset(asset: Asset): AssetDraft {
  return {
    id: asset.id,
    name: asset.name,
    creator: asset.creator,
    platforms: asset.platforms,
    usage: asset.usage,
    startsAt: asset.startsAt,
    endsAt: asset.endsAt,
    exclusive: asset.exclusive,
    contractUrl: asset.contractUrl,
    notes: asset.notes,
  };
}

function toggleValue<T>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

type AssetFormProps = {
  draft: AssetDraft;
  onChange: (draft: AssetDraft) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export function AssetForm({
  draft,
  onChange,
  onSubmit,
  onCancel,
}: AssetFormProps) {
  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          <span className="text-ink-dim">Asset name</span>
          <input
            required
            value={draft.name}
            onChange={(e) => onChange({ ...draft, name: e.target.value })}
            className="mt-1 w-full rounded-sm border border-line bg-bg px-3 py-2 outline-none focus:border-accent"
            placeholder="Hero UGC — serum"
          />
        </label>
        <label className="block text-sm">
          <span className="text-ink-dim">Creator</span>
          <input
            required
            value={draft.creator}
            onChange={(e) => onChange({ ...draft, creator: e.target.value })}
            className="mt-1 w-full rounded-sm border border-line bg-bg px-3 py-2 outline-none focus:border-accent"
            placeholder="@handle or studio"
          />
        </label>
        <label className="block text-sm">
          <span className="text-ink-dim">Rights start</span>
          <input
            required
            type="date"
            value={draft.startsAt}
            onChange={(e) => onChange({ ...draft, startsAt: e.target.value })}
            className="mt-1 w-full rounded-sm border border-line bg-bg px-3 py-2 outline-none focus:border-accent"
          />
        </label>
        <label className="block text-sm">
          <span className="text-ink-dim">Rights end</span>
          <input
            required
            type="date"
            value={draft.endsAt}
            onChange={(e) => onChange({ ...draft, endsAt: e.target.value })}
            className="mt-1 w-full rounded-sm border border-line bg-bg px-3 py-2 outline-none focus:border-accent"
          />
        </label>
      </div>

      <fieldset className="text-sm">
        <legend className="text-ink-dim">Platforms</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {PLATFORMS.map((platform) => (
            <label
              key={platform}
              className={`cursor-pointer rounded-sm border px-3 py-1.5 ${
                draft.platforms.includes(platform)
                  ? "border-accent text-accent"
                  : "border-line text-ink-dim"
              }`}
            >
              <input
                type="checkbox"
                className="mr-2 align-middle"
                checked={draft.platforms.includes(platform)}
                onChange={() =>
                  onChange({
                    ...draft,
                    platforms: toggleValue(draft.platforms, platform),
                  })
                }
              />
              {PLATFORM_LABEL[platform]}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="text-sm">
        <legend className="text-ink-dim">Usage</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {USAGES.map((usage) => (
            <label
              key={usage}
              className={`cursor-pointer rounded-sm border px-3 py-1.5 ${
                draft.usage.includes(usage)
                  ? "border-accent text-accent"
                  : "border-line text-ink-dim"
              }`}
            >
              <input
                type="checkbox"
                className="mr-2 align-middle"
                checked={draft.usage.includes(usage)}
                onChange={() =>
                  onChange({
                    ...draft,
                    usage: toggleValue(draft.usage, usage),
                  })
                }
              />
              {USAGE_LABEL[usage]}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex items-center gap-2 text-sm text-ink-dim">
        <input
          type="checkbox"
          checked={draft.exclusive}
          onChange={(e) => onChange({ ...draft, exclusive: e.target.checked })}
        />
        Exclusive to this brand
      </label>

      <label className="block text-sm">
        <span className="text-ink-dim">Contract / thread URL</span>
        <input
          value={draft.contractUrl}
          onChange={(e) => onChange({ ...draft, contractUrl: e.target.value })}
          className="mt-1 w-full rounded-sm border border-line bg-bg px-3 py-2 outline-none focus:border-accent"
          placeholder="https://"
        />
      </label>

      <label className="block text-sm">
        <span className="text-ink-dim">Notes</span>
        <textarea
          value={draft.notes}
          onChange={(e) => onChange({ ...draft, notes: e.target.value })}
          rows={3}
          className="mt-1 w-full rounded-sm border border-line bg-bg px-3 py-2 outline-none focus:border-accent"
        />
      </label>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-sm border border-line px-4 py-2 text-sm text-ink-dim"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-sm bg-accent px-4 py-2 text-sm font-medium text-bg"
        >
          Save asset
        </button>
      </div>
    </form>
  );
}

const statusClass: Record<AssetStatus, string> = {
  active: "border-ok/50 text-ok",
  expiring: "border-warn/50 text-warn",
  expired: "border-stop/50 text-stop",
};

export function StatusBadge({ status }: { status: AssetStatus }) {
  return (
    <span
      className={`inline-flex rounded-sm border px-2 py-0.5 text-xs uppercase tracking-wide ${statusClass[status]}`}
    >
      {status}
    </span>
  );
}
