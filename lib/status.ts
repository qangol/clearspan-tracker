import type { Asset, AssetStatus } from "./types";

export const EXPIRING_WINDOW_DAYS = 14;

function utcDay(isoDate: string): number {
  const [year, month, day] = isoDate.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

export function todayIso(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function daysUntil(endIso: string, now = new Date()): number {
  const ms = utcDay(endIso) - utcDay(todayIso(now));
  return Math.round(ms / 86_400_000);
}

export function assetStatus(asset: Asset, now = new Date()): AssetStatus {
  const remaining = daysUntil(asset.endsAt, now);
  if (remaining < 0) return "expired";
  if (remaining <= EXPIRING_WINDOW_DAYS) return "expiring";
  return "active";
}

export function statusCounts(assets: Asset[], now = new Date()) {
  return assets.reduce(
    (acc, asset) => {
      acc[assetStatus(asset, now)] += 1;
      return acc;
    },
    { active: 0, expiring: 0, expired: 0 } as Record<AssetStatus, number>,
  );
}
