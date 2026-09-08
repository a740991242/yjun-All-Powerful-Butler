import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'Engineering',
    path: '/engineering',
    component: () => import('#/views/tools-pending/index.vue'),
    meta: {
      icon: 'lucide:code-xml',
      order: 0,
      title: 'tools.menu.engineering',
    },
  },
  {
    name: 'LifeTools',
    path: '/life-tools',
    redirect: '/life-tools/mortgage',
    meta: { icon: 'lucide:house', order: 1, title: 'tools.menu.life' },
    children: [
      {
        name: 'MortgageCalculator',
        path: 'mortgage',
        component: () => import('#/views/life-tools/mortgage/index.vue'),
        meta: {
          affixTab: true,
          icon: 'lucide:calculator',
          keepAlive: true,
          title: 'tools.menu.mortgage',
        },
      },
      {
        name: 'IncomeTaxCalculator',
        path: 'income-tax',
        component: () => import('#/views/life-tools/income-tax/index.vue'),
        meta: {
          icon: 'lucide:receipt-text',
          keepAlive: true,
          title: 'tools.menu.tax',
        },
      },
    ],
  },
  {
    name: 'Education',
    path: '/education',
    component: () => import('#/views/tools-pending/index.vue'),
    meta: { icon: 'lucide:book-open', order: 2, title: 'tools.menu.education' },
  },
  {
    name: 'Entertainment',
    path: '/entertainment',
    redirect: '/entertainment/magic-bottles',
    meta: {
      icon: 'lucide:gamepad-2',
      order: 3,
      title: 'tools.menu.entertainment',
    },
    children: [
      {
        name: 'MagicBottles',
        path: 'magic-bottles',
        component: () =>
          import('#/views/entertainment/magic-bottles/index.vue'),
        meta: {
          domCached: true,
          icon: 'lucide:flask-conical',
          title: 'tools.menu.game',
        },
      },
    ],
  },
  {
    name: 'Finance',
    path: '/finance',
    component: () => import('#/views/tools-pending/index.vue'),
    meta: {
      icon: 'lucide:chart-no-axes-combined',
      order: 4,
      title: 'tools.menu.finance',
    },
  },
];

export default routes;
