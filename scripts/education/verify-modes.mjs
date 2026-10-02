/* Production mode entry and unfinished snapshot check. Fresh profiles only.
 * Run after pnpm build:pages. Does not certify completed learning or content quality. */
import * as fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

const repo = fileURLToPath(new URL('../../', import.meta.url)).replace(
  /\/$/,
  '',
);
const base = '/yjun-All-Powerful-Butler/';
const root = `${repo}/apps/web-antd/dist`;
(async () => {
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://local');
      if (!url.pathname.startsWith(base)) {
        res.writeHead(404);
        res.end();
        return;
      }
      const rel =
        decodeURIComponent(url.pathname.slice(base.length)) || 'index.html';
      const file = path.resolve(root, rel);
      if (!file.startsWith(`${root}/`)) throw new Error('path');
      const bytes = await fs.readFile(file);
      const types = {
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.html': 'text/html',
        '.json': 'application/json',
        '.svg': 'image/svg+xml',
        '.png': 'image/png',
        '.woff2': 'font/woff2',
      };
      res.writeHead(200, {
        'Content-Type': types[path.extname(file)] || 'application/octet-stream',
      });
      res.end(bytes);
    } catch {
      res.writeHead(404);
      res.end();
    }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const url = origin + base;
  let browser;
  let p;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });

    for (const width of [375, 768, 1200]) {
      const ctx = await browser.newContext({
        viewport: { width, height: 1000 },
      });
      p = await ctx.newPage();
      const errors = [];
      p.on('pageerror', (error) => errors.push(error.message));
      const read = () =>
        p.evaluate(
          () =>
            new Promise((resolve, reject) => {
              const request = indexedDB.open('butler-grade-one', 1);
              request.addEventListener('success', () => {
                const db = request.result;
                const transaction = db.transaction('library', 'readonly');
                const item = transaction.objectStore('library').get('state');
                item.addEventListener('success', () => {
                  resolve(item.result);
                  db.close();
                });
                item.addEventListener('error', reject);
              });
              request.addEventListener('error', reject);
            }),
        );
      const go = async (route) => {
        await p.goto(`${url}#${route}`, { waitUntil: 'domcontentloaded' });
        await p.locator('#__app-loading__').waitFor({ state: 'detached' });
        await p.waitForFunction(
          () =>
            [...document.querySelectorAll('button')].filter(
              (button) => button.textContent.trim() === '导出备份',
            ).length === 1,
        );
        await p
          .getByRole('button', { name: '导出备份', exact: true })
          .waitFor();
      };
      await p.goto(`${url}#/education/primary/p1/math/sujiao/upper`);
      await p.getByPlaceholder('请输入用户名').fill('yj88888888');
      await p.getByPlaceholder('密码', { exact: true }).fill('yyds123456');
      await p.locator('button').filter({ hasText: '登录' }).click();
      await p.waitForFunction(
        () =>
          [...document.querySelectorAll('button')].filter(
            (button) => button.textContent.trim() === '导出备份',
          ).length === 1,
      );
      await p.getByRole('button', { name: '导出备份', exact: true }).waitFor();
      const cases = [
        ['math', 'sujiao', 'upper', 'sujiao-math-p1-upper-2024', 9],
        ['math', 'sujiao', 'lower', 'sujiao-math-p1-lower-9787574312951', 11],
        ['math', 'pep-2024', 'upper', 'pep-math-p1-upper-2024', 5],
        ['math', 'pep-2024', 'lower', 'pep-math-p1-lower-2024', 6],
        ['chinese', 'pep-2024', 'upper', 'pep-chinese-p1-upper-2024', null],
        ['chinese', 'pep-2024', 'lower', 'pep-chinese-p1-lower-2024', null],
      ];
      const expected = [];
      for (const [subject, edition, volume, bookId, count] of cases) {
        const route = `/education/primary/p1/${subject}/${edition}/${volume}`;
        await go(route);
        const starts = p.getByRole('button', {
          name: '开始专项练习',
          exact: true,
        });
        const actual = await starts.count();
        if ((count !== null && actual !== count) || actual === 0)
          throw new Error(`specialties ${bookId}: ${actual}`);
        if (subject === 'math' && volume === 'upper') {
          await p
            .getByRole('button', { name: '进入数学下册衔接练习', exact: true })
            .click();
          await p.waitForURL(
            (current) =>
              current.hash === `#/education/primary/p1/math/${edition}/lower`,
          );
          const transitionCount = await p
            .getByRole('button', { name: '开始衔接练习', exact: true })
            .count();
          if (transitionCount !== 3) throw new Error('lower transitions');
          await go(route);
        }
        for (const size of [6, 12, 20]) {
          const input = p.locator('#specialty-count');
          await input.focus();
          await input.press('ArrowDown');
          await p
            .locator('.ant-select-dropdown')
            .filter({ visible: true })
            .last()
            .getByText(`${size}题`, { exact: true })
            .click();
          const card = starts.first().locator('..');
          const title = await card.locator('h3').innerText();
          const cardText = await card.innerText();
          const match = cardText.match(/题库\s*(\d+)\s*题/);
          if (!match) throw new Error('pool count missing');
          const length = Math.min(size, Number(match[1]));
          await starts.first().click();
          await p.waitForURL('**session=*');
          const id = new URLSearchParams(p.url().split('?')[1]).get('session');
          const state = await read();
          const session = state.sessions.find((item) => item.id === id);
          if (
            !session ||
            session.bookId !== bookId ||
            session.lessonTitle !== title ||
            session.mode !== 'practice' ||
            session.questions.length !== length ||
            session.completedAt ||
            session.responses.some(
              (response) => response.submissions.length > 0 || response.skipped,
            ) ||
            new Set(session.questions.map((item) => item.id)).size !== length
          )
            throw new Error(
              `practice snapshot ${bookId}/${size}: ${JSON.stringify(session)}`,
            );
          expected.push(session);
          await p.reload();
          await p.locator('#__app-loading__').waitFor({ state: 'detached' });
          const refreshedState = await read();
          if (
            JSON.stringify(
              refreshedState.sessions.find((item) => item.id === id),
            ) !== JSON.stringify(session)
          )
            throw new Error('refresh changed unfinished practice');
          await go(route);
        }
        const bridges = p.getByRole('button', {
          name: '开始衔接练习',
          exact: true,
        });
        const n = await bridges.count();
        for (let index = 0; index < n; index++) {
          const title = await bridges
            .nth(index)
            .locator('..')
            .locator('h3')
            .innerText();
          await bridges.nth(index).click();
          await p.waitForURL('**session=*');
          const id = new URLSearchParams(p.url().split('?')[1]).get('session');
          const transitionState = await read();
          const session = transitionState.sessions.find(
            (item) => item.id === id,
          );
          if (
            !session ||
            session.bookId !== bookId ||
            session.mode !== 'transition' ||
            session.lessonTitle !== title ||
            session.questions.length === 0 ||
            session.completedAt ||
            session.responses.some(
              (response) => response.submissions.length > 0 || response.skipped,
            )
          )
            throw new Error('transition snapshot');
          expected.push(session);
          await p.reload();
          await p.locator('#__app-loading__').waitFor({ state: 'detached' });
          const refreshedState = await read();
          if (
            JSON.stringify(
              refreshedState.sessions.find((item) => item.id === id),
            ) !== JSON.stringify(session)
          )
            throw new Error('refresh changed unfinished transition');
          await go(route);
        }
      }
      const final = await read();
      for (const session of expected)
        if (
          JSON.stringify(
            final.sessions.find((item) => item.id === session.id),
          ) !== JSON.stringify(session)
        )
          throw new Error('older snapshot changed');
      await go('/education/primary/p1/math/sujiao/lower');
      await p.locator('#specialty-count').scrollIntoViewIfNeeded();
      await p.screenshot({ path: `/tmp/butler-modes-${width}.png` });
      if (errors.length > 0) throw new Error(JSON.stringify(errors));
      console.log(
        JSON.stringify({
          width,
          sessions: expected.length,
          errors,
          status: 'passed',
          scope:
            'mode entry, lengths, unfinished refresh; not completed learning',
        }),
      );
      await ctx.close();
    }
  } catch (error) {
    if (p) {
      console.log(p.url());
      const failureText = await p.locator('body').innerText();
      console.log(failureText.slice(-3500));
      await p.screenshot({
        path: '/tmp/butler-pages-final-failure.png',
        fullPage: true,
      });
    }
    throw error;
  } finally {
    await browser?.close();
    await new Promise((resolve) => server.close(resolve));
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
