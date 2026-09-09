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

## Sign-in and GitHub Pages deployment

This is a frontend-only tool site. No backend or database deployment is needed. The initial account is `yj88888888` with password `yyds123456`. Login validation, profile information and permissions are mocked in the browser. Existing stores persist login state and clear it on logout. This login controls navigation; it is not a security boundary for private data.

- `corepack pnpm dev:antd` runs the frontend without the Nitro mock server.
- `corepack pnpm build:pages` generates static files in `apps/web-antd/dist`.
- Pushing to `main` triggers `.github/workflows/deploy.yml` to test, build and deploy to GitHub Pages. Select GitHub Actions as the publishing source in Settings → Pages.
- Production uses `/yjun-All-Powerful-Butler/` and hash routing, so deep links and refreshes do not require server rewrites. Update `VITE_BASE` in `.env.production` if the repository name changes.
- Mortgage and income-tax calculations run in the browser. Magic Bottles loads its standalone game through an iframe.

The monorepo retains `backend-mock` for its other example applications; All-in-One Butler does not use it in development or deployment.
