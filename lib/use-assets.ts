"use client";

import { useCallback, useEffect, useState } from "react";
import type { Asset } from "./types";
import { DEMO_ASSETS } from "./demo";
import { loadAssets, saveAssets } from "./storage";

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadAssets();
    setAssets(stored ?? DEMO_ASSETS);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveAssets(assets);
  }, [assets, hydrated]);

  const upsert = useCallback((asset: Asset) => {
    setAssets((current) => {
      const index = current.findIndex((item) => item.id === asset.id);
      if (index === -1) return [asset, ...current];
      const next = [...current];
      next[index] = asset;
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setAssets((current) => current.filter((item) => item.id !== id));
  }, []);

  const replaceAll = useCallback((next: Asset[]) => {
    setAssets(next);
  }, []);

  const resetDemo = useCallback(() => {
    setAssets(DEMO_ASSETS);
  }, []);

  return { assets, hydrated, upsert, remove, replaceAll, resetDemo };
}
