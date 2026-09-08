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
