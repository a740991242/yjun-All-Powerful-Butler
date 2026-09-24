import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'Engineering',
    path: '/engineering',
    redirect: '/engineering/json',
    children: [
      {
        name: 'EngineeringJson',
        path: 'json',
        component: () => import('#/views/engineering/json.vue'),
        meta: { title: 'engineering.json', icon: 'lucide:braces' },
      },
      {
        name: 'EngineeringCompare',
        path: 'compare',
        component: () => import('#/views/engineering/compare.vue'),
        meta: { title: 'engineering.diff', icon: 'lucide:git-compare' },
      },
      {
        name: 'EngineeringSql',
        path: 'sql',
        component: () => import('#/views/engineering/sql.vue'),
        meta: { title: 'engineering.sql', icon: 'lucide:database' },
      },
      {
        name: 'EngineeringEncoding',
        path: 'encoding',
        component: () => import('#/views/engineering/encoding.vue'),
        meta: { title: 'engineering.encoding', icon: 'lucide:binary' },
      },
      {
        name: 'EngineeringRegex',
        path: 'regex',
        component: () => import('#/views/engineering/regex.vue'),
        meta: { title: 'engineering.regex', icon: 'lucide:regex' },
      },
      {
        name: 'EngineeringKnowledge',
        path: 'knowledge',
        component: () => import('#/views/engineering/knowledge.vue'),
        meta: { title: 'engineering.knowledge', icon: 'lucide:book-marked' },
      },
      {
        name: 'EngineeringCron',
        path: 'cron',
        component: () => import('#/views/engineering/cron.vue'),
        meta: { title: 'engineering.cron', icon: 'lucide:timer' },
      },
    ],
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
        name: 'LifeDates',
        path: 'dates',
        component: () => import('#/views/life-tools/dates/index.vue'),
        meta: { title: 'dates.title', icon: 'lucide:calendar-days' },
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
    redirect: '/finance/portfolio',
    children: [
      {
        name: 'FinanceCalendar',
        path: 'calendar',
        component: () => import('#/views/finance/calendar/index.vue'),
        meta: {
          title: 'investmentCalendar.titlePage',
          icon: 'lucide:calendar-range',
        },
      },
      {
        name: 'FinanceDataStatus',
        path: 'data-status',
        component: () => import('#/views/finance/data-status.vue'),
        meta: { title: 'dataStatus.title', icon: 'lucide:database-backup' },
      },
      {
        name: 'FinancePortfolio',
        path: 'portfolio',
        component: () => import('#/views/finance/portfolio/index.vue'),
        meta: {
          title: 'finance.menu.portfolio',
          icon: 'lucide:wallet',
          keepAlive: true,
        },
      },
      {
        name: 'FinanceWishlist',
        path: 'wishlist',
        component: () => import('#/views/finance/wishlist/index.vue'),
        meta: {
          title: 'wishlist.title',
          icon: 'lucide:heart',
          keepAlive: true,
        },
      },
      {
        name: 'FinanceEtfComparison',
        path: 'etf-comparison',
        component: () => import('#/views/finance/etf-comparison/index.vue'),
        meta: {
          title: 'finance.menu.etf',
          icon: 'lucide:chart-no-axes-combined',
          keepAlive: true,
        },
      },
    ],
    meta: {
      icon: 'lucide:chart-no-axes-combined',
      order: 4,
      title: 'tools.menu.finance',
    },
  },
];

export default routes;
