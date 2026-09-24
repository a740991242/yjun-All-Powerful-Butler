import {
  defaults,
  upgradeLegacyTargets,
  upgradeV2Targets,
  validateTargets,
} from './model';

export const WISHLIST_KEY = 'all-in-one-butler:finance:wishlist:v3';
export const WISHLIST_CHANGED = 'finance:wishlist-changed';
const PREVIOUS_KEY = 'all-in-one-butler:finance:wishlist:v2';
const LEGACY_KEY = 'all-in-one-butler:finance:wishlist:v1';

export function readWishlist(storage: Pick<Storage, 'getItem'>) {
  const current = storage.getItem(WISHLIST_KEY);
  if (current !== null)
    return { targets: validateTargets(JSON.parse(current)), needsSave: false };
  const previous = storage.getItem(PREVIOUS_KEY);
  if (previous !== null)
    return { targets: upgradeV2Targets(JSON.parse(previous)), needsSave: true };
  const legacy = storage.getItem(LEGACY_KEY);
  return {
    targets:
      legacy === null
        ? defaults()
        : upgradeV2Targets(upgradeLegacyTargets(JSON.parse(legacy))),
    needsSave: true,
  };
}

export function heartTier(gap: null | number): null | number {
  if (gap === null || !Number.isFinite(gap) || gap < 0) return null;
  const tier = [2, 5, 10, 15, 20, 30].findIndex((limit) => gap <= limit);
  return tier === -1 ? 6 : tier;
}
