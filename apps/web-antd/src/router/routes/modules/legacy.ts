import type { RouteRecordRaw } from 'vue-router';

// 兼容演示账号的 homePath、已保存的偏好设置和旧书签。
const routes: RouteRecordRaw[] = [
  {
    name: 'LegacyDashboard',
    path: '/dashboard',
    alias: ['/dashboard/workspace', '/dashboard/analytics'],
    redirect: '/life-tools/mortgage',
    meta: { hideInMenu: true, hideInTab: true, title: 'tools.menu.life' },
  },
];

export default routes;
