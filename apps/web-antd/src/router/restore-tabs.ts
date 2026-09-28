import type { RouteMeta, Router, RouteRecordName } from 'vue-router';

interface CachedTab {
  name?: RouteRecordName;
  path?: string;
  fullPath?: string;
  meta?: RouteMeta;
}

/** Fixed tabs have only path; old session snapshots may contain invalid routes. */
export function restoreCachedTabs<T extends CachedTab>(
  tabs: T[],
  router: Router,
): T[] {
  return tabs.flatMap((tab) => {
    if (!tab || !tab.name || !router.hasRoute(tab.name)) return [];
    const path = [tab.fullPath, tab.path].find(
      (value) => typeof value === 'string' && value.startsWith('/'),
    );
    if (!path) return [];
    try {
      const route = router.resolve(path);
      if (route.name !== tab.name) return [];
      return [
        {
          ...tab,
          path: route.path,
          fullPath: route.fullPath,
          meta: { ...tab.meta, ...route.meta },
        },
      ];
    } catch {
      // A stale tab must not prevent login or route initialization.
      return [];
    }
  });
}
