import type { Asset, Platform, Usage } from "./types";
import { PLATFORMS, USAGES } from "./types";
import { newId } from "./storage";

export const CSV_HEADERS = [
  "name",
  "creator",
  "platforms",
  "usage",
  "startsAt",
  "endsAt",
  "exclusive",
  "contractUrl",
  "notes",
] as const;

function escapeCell(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replaceAll('"', '""')}"`;
  return value;
}

function splitCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let quoted = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (quoted) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        current += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      cells.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells;
}

export function assetsToCsv(assets: Asset[]): string {
  const rows = [
    CSV_HEADERS.join(","),
    ...assets.map((asset) =>
      [
        asset.name,
        asset.creator,
        asset.platforms.join("|"),
        asset.usage.join("|"),
        asset.startsAt,
        asset.endsAt,
        asset.exclusive ? "true" : "false",
        asset.contractUrl,
        asset.notes,
      ]
        .map(escapeCell)
        .join(","),
    ),
  ];
  return `${rows.join("\n")}\n`;
}

function parseList<T extends string>(
  value: string,
  allowed: readonly T[],
): T[] {
  const set = new Set(allowed);
  return value
    .split(/[|;]/)
    .map((part) => part.trim().toLowerCase())
    .filter((part): part is T => set.has(part as T));
}

export function csvToAssets(text: string): Asset[] {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);
  if (lines.length < 2) return [];

  const header = splitCsvLine(lines[0]).map((h) => h.trim());
  const index = Object.fromEntries(header.map((h, i) => [h, i]));
  const now = new Date().toISOString();

  return lines.slice(1).flatMap((line) => {
    const cells = splitCsvLine(line);
    const get = (key: string) => (cells[index[key]] ?? "").trim();
    const name = get("name");
    const creator = get("creator");
    const startsAt = get("startsAt");
    const endsAt = get("endsAt");
    if (!name || !creator || !startsAt || !endsAt) return [];

    const platforms = parseList(get("platforms"), PLATFORMS) as Platform[];
    const usage = parseList(get("usage"), USAGES) as Usage[];

    return [
      {
        id: newId(),
        name,
        creator,
        platforms: platforms.length ? platforms : ["meta"],
        usage: usage.length ? usage : ["organic"],
        startsAt,
        endsAt,
        exclusive: ["true", "yes", "1"].includes(get("exclusive").toLowerCase()),
        contractUrl: get("contractUrl"),
        notes: get("notes"),
        createdAt: now,
      } satisfies Asset,
    ];
  });
}
