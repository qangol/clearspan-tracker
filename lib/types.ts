export const PLATFORMS = [
  "meta",
  "tiktok",
  "youtube",
  "telegram",
  "web",
] as const;

export type Platform = (typeof PLATFORMS)[number];

export const USAGES = ["organic", "paid", "whitelisting"] as const;

export type Usage = (typeof USAGES)[number];

export const STATUSES = ["active", "expiring", "expired"] as const;

export type AssetStatus = (typeof STATUSES)[number];

export type Asset = {
  id: string;
  name: string;
  creator: string;
  platforms: Platform[];
  usage: Usage[];
  startsAt: string;
  endsAt: string;
  exclusive: boolean;
  contractUrl: string;
  notes: string;
  createdAt: string;
};

export const PLATFORM_LABEL: Record<Platform, string> = {
  meta: "Meta",
  tiktok: "TikTok",
  youtube: "YouTube",
  telegram: "Telegram",
  web: "Web",
};

export const USAGE_LABEL: Record<Usage, string> = {
  organic: "Organic",
  paid: "Paid ads",
  whitelisting: "Whitelisting",
};

export const STATUS_LABEL: Record<AssetStatus, string> = {
  active: "Active",
  expiring: "Expiring",
  expired: "Expired",
};
