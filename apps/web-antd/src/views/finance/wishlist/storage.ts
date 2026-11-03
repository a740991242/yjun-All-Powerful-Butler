import {
  defaults,
  upgradeLegacyTargets,
  upgradeV2Targets,
  upgradeV3Targets,
  upgradeV4Targets,
  upgradeV5Targets,
  upgradeV6Targets,
  upgradeV7Targets,
  validateTargets,
} from './model';

export const WISHLIST_KEY = 'all-in-one-butler:finance:wishlist:v8';
export const WISHLIST_CHANGED = 'finance:wishlist-changed';
const V7_KEY = 'all-in-one-butler:finance:wishlist:v7';
const V6_KEY = 'all-in-one-butler:finance:wishlist:v6';
const V5_KEY = 'all-in-one-butler:finance:wishlist:v5';
const V4_KEY = 'all-in-one-butler:finance:wishlist:v4';
const V3_KEY = 'all-in-one-butler:finance:wishlist:v3';
const PREVIOUS_KEY = 'all-in-one-butler:finance:wishlist:v2';
const LEGACY_KEY = 'all-in-one-butler:finance:wishlist:v1';

export function readWishlist(storage: Pick<Storage, 'getItem'>) {
  const current = storage.getItem(WISHLIST_KEY);
  if (current !== null)
    return { targets: validateTargets(JSON.parse(current)), needsSave: false };
  const v7 = storage.getItem(V7_KEY);
  if (v7 !== null)
    return { targets: upgradeV7Targets(JSON.parse(v7)), needsSave: true };
  const v6 = storage.getItem(V6_KEY);
  if (v6 !== null)
    return {
      targets: upgradeV7Targets(upgradeV6Targets(JSON.parse(v6))),
      needsSave: true,
    };
  const v5 = storage.getItem(V5_KEY);
  if (v5 !== null)
    return {
      targets: upgradeV7Targets(
        upgradeV6Targets(upgradeV5Targets(JSON.parse(v5))),
      ),
      needsSave: true,
    };
  const v4 = storage.getItem(V4_KEY);
  if (v4 !== null)
    return {
      targets: upgradeV7Targets(
        upgradeV6Targets(upgradeV5Targets(upgradeV4Targets(JSON.parse(v4)))),
      ),
      needsSave: true,
    };
  const v3 = storage.getItem(V3_KEY);
  if (v3 !== null)
    return {
      targets: upgradeV7Targets(
        upgradeV6Targets(upgradeV5Targets(upgradeV3Targets(JSON.parse(v3)))),
      ),
      needsSave: true,
    };
  const previous = storage.getItem(PREVIOUS_KEY);
  if (previous !== null)
    return {
      targets: upgradeV7Targets(
        upgradeV6Targets(
          upgradeV5Targets(
            upgradeV3Targets(upgradeV2Targets(JSON.parse(previous))),
          ),
        ),
      ),
      needsSave: true,
    };
  const legacy = storage.getItem(LEGACY_KEY);
  return {
    targets:
      legacy === null
        ? defaults()
        : upgradeV7Targets(
            upgradeV6Targets(
              upgradeV5Targets(
                upgradeV3Targets(
                  upgradeV2Targets(upgradeLegacyTargets(JSON.parse(legacy))),
                ),
              ),
            ),
          ),
    needsSave: true,
  };
}

export function heartTier(gap: null | number): null | number {
  if (gap === null || !Number.isFinite(gap) || gap < 0) return null;
  const tier = [2, 5, 10, 15, 20, 30].findIndex((limit) => gap <= limit);
  return tier === -1 ? 6 : tier;
}
