# 全能管家

简体中文 · [English](./README.md)

面向生活与工作的工具平台，包含研发工程、生活工具、教育学习、娱乐游戏和金融赚米五个分类。

## 已有功能

- 房贷计算：支持商业贷款、公积金贷款、两种还款方式及逐期还款明细。
- 个税计算：按累计预扣方式估算当月税额与税后工资。
- 魔彩瓶：颜色倒水小游戏，支持全屏、重新加载和新窗口打开。
- 中英文切换、明暗主题和页面标签缓存。
- 研发工程、教育学习、金融赚米目前为待扩展分类。

## 本地开发

使用 `package.json` 中声明的 Node.js 和 pnpm 版本，在项目根目录执行：

```bash
corepack pnpm install
corepack pnpm dev:antd
```

访问地址以开发服务输出为准。

```bash
corepack pnpm -F @vben/web-antd typecheck
corepack pnpm -F @vben/web-antd build
corepack pnpm exec vitest run apps/web-antd/src/views/life-tools/calculations.test.ts apps/web-antd/src/locales/tools.test.ts
```

当前应用位于 `apps/web-antd`，文案位于其 `src/locales/langs/`，品牌资源位于 `public/brand/`。开发与样式约定见 [AGENTS.md](./AGENTS.md)。

## 许可

见 [LICENSE](./LICENSE)。分发项目及其依赖时，应保留适用的版权与许可声明。

## 登录与 GitHub Pages 部署

这是纯前端工具站，不需要部署后端或数据库。默认账号为 `yj88888888`，密码为 `yyds123456`；登录校验、用户信息和权限均由浏览器内的本地模拟模块提供。登录状态由现有 Store 持久化，退出时清除。此登录仅控制界面入口，不是敏感数据的安全边界。

- `corepack pnpm dev:antd` 启动前端，不启动 Nitro 模拟服务。
- `corepack pnpm build:pages` 生成 `apps/web-antd/dist` 纯静态产物。
- 推送到 `main` 后，`.github/workflows/deploy.yml` 自动测试、构建并发布到 GitHub Pages。仓库 Settings → Pages 的 Source 使用 GitHub Actions。
- 生产访问路径为 `/yjun-All-Powerful-Butler/`，页面使用 hash 路由，刷新或打开深层链接无需服务器重写。重命名仓库时同步更新 `.env.production` 的 `VITE_BASE`。
- 房贷、个税在浏览器计算；魔彩瓶通过 iframe 加载独立游戏。

其他示例应用仍保留原有 `backend-mock` 包，但全能管家的开发和部署不使用它。
