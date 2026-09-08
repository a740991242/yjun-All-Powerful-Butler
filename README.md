# All-in-One Butler

[简体中文](./README.zh-CN.md) · English

A workspace for everyday life and work, with engineering, everyday tools, learning, games, and finance categories.

## Available features

- Mortgage calculator: commercial and provident fund loans, two repayment methods, and payment schedules.
- Income tax calculator: cumulative withholding estimates and monthly take-home pay.
- Magic Bottles: an embedded color-sorting game with full-screen and reload controls.
- Simplified Chinese and English, light and dark themes, and persistent page tabs.
- Engineering, learning, and finance categories are ready for future tools.

## Development

Use the Node.js and pnpm versions declared in `package.json`. Run from this repository root:

```bash
corepack pnpm install
corepack pnpm dev:antd
```

Use the address printed by the development server.

```bash
corepack pnpm -F @vben/web-antd typecheck
corepack pnpm -F @vben/web-antd build
corepack pnpm exec vitest run apps/web-antd/src/views/life-tools/calculations.test.ts apps/web-antd/src/locales/tools.test.ts
```

The current application is in `apps/web-antd`. UI text is in its `src/locales/langs/` directory; local brand assets are in `public/brand/`. Follow [AGENTS.md](./AGENTS.md) for development and style conventions.

## License

See [LICENSE](./LICENSE). Preserve the applicable copyright and license notices when distributing this project or its dependencies.

## Sign-in and deployment

The initial account is `yj88888888`. Obtain the password from the project owner; it is not prefilled in the login form. The legacy demo accounts are disabled.

Production uses same-origin `/api` endpoints from `apps/web-antd/server/index.mjs`, without the external demo service. Run `corepack pnpm build:sites` to produce the frontend and Worker deployment output. `.openai/hosting.json` stores the Sites project ID. Configure `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `SESSION_SECRET` in the hosting platform, marking the last two as secrets. Rotate `SESSION_SECRET` with password changes to invalidate existing sessions.

Local development uses the account validator in `apps/backend-mock`; its password digest is for development only. Production credentials come from platform secrets.
