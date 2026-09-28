import { createMemoryHistory, createRouter } from 'vue-router';

import { describe, expect, it } from 'vitest';

import { restoreCachedTabs } from './restore-tabs';

function routerForTest() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/life-tools/mortgage',
        name: 'MortgageCalculator',
        component: {},
        meta: { title: 'current', affixTab: true },
      },
      { path: '/:pathMatch(.*)*', name: 'NotFound', component: {} },
    ],
  });
}

describe('restore cached tabs', () => {
  it('restores a persisted fixed tab without fullPath across repeated reloads', () => {
    const router = routerForTest();
    const original = [
      {
        name: 'MortgageCalculator',
        path: '/life-tools/mortgage',
        meta: { title: 'old', custom: true },
      },
    ];
    const restored = restoreCachedTabs(original, router);
    expect(restored).toEqual([
      {
        ...original[0],
        fullPath: '/life-tools/mortgage',
        meta: { title: 'current', affixTab: true, custom: true },
      },
    ]);
    expect(restoreCachedTabs(restored, router)).toEqual(restored);
    expect(original[0]).not.toHaveProperty('fullPath');
  });
  it('preserves queries and hashes from fullPath', () => {
    const tabs = [
      {
        name: 'MortgageCalculator',
        path: '/life-tools/mortgage',
        fullPath: '/life-tools/mortgage?mode=direct#result',
      },
    ];
    expect(restoreCachedTabs(tabs, routerForTest())[0]?.fullPath).toBe(
      tabs[0]?.fullPath,
    );
  });
  it('falls back from empty fullPath to path', () => {
    const tabs = [
      {
        name: 'MortgageCalculator',
        path: '/life-tools/mortgage',
        fullPath: '',
      },
    ];
    expect(restoreCachedTabs(tabs, routerForTest())[0]?.fullPath).toBe(
      '/life-tools/mortgage',
    );
  });
  it('drops missing paths, removed routes and paths resolving to a different route', () => {
    const tabs = [
      { name: 'MortgageCalculator' },
      { name: 'RemovedPage', path: '/removed' },
      { name: 'MortgageCalculator', path: '/removed' },
      { path: '/life-tools/mortgage' },
    ];
    expect(restoreCachedTabs(tabs, routerForTest())).toEqual([]);
  });
});
