import type { Asset, Platform, Usage } from "./types";
import { PLATFORMS, USAGES } from "./types";

export const STORAGE_KEY = "clearspan.assets.v1";

function isPlatform(value: string): value is Platform {
  return (PLATFORMS as readonly string[]).includes(value);
}

function isUsage(value: string): value is Usage {
  return (USAGES as readonly string[]).includes(value);
}

function isAsset(value: unknown): value is Asset {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<Asset>;
  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.creator === "string" &&
    Array.isArray(item.platforms) &&
    item.platforms.every((p) => typeof p === "string" && isPlatform(p)) &&
    Array.isArray(item.usage) &&
    item.usage.every((u) => typeof u === "string" && isUsage(u)) &&
    typeof item.startsAt === "string" &&
    typeof item.endsAt === "string" &&
    typeof item.exclusive === "boolean" &&
    typeof item.contractUrl === "string" &&
    typeof item.notes === "string" &&
    typeof item.createdAt === "string"
  );
}

export function loadAssets(): Asset[] | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(isAsset)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveAssets(assets: Asset[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
}

export function newId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `cs_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
