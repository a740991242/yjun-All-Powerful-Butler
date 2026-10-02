/* Production backup-volume acceptance. Run after pnpm build:pages.
 * Isolated Chrome contexts only. A UI-created attempt seeds synthetic large
 * snapshots; never reads user records or claims these fixtures are real study.
 * Usage: rtk proxy node scripts/education/verify-backup-parts.mjs
 */
import { Buffer } from 'node:buffer';
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

    const route = `${url}#/education/primary/p1/math/pep-2024/upper`;
    const errors = [];
    const contexts = [];
    const open = async (width) => {
      const context = await browser.newContext({
        viewport: { width, height: 1000 },
      });
      contexts.push(context);
      const page = await context.newPage();
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(route);
      await page.getByPlaceholder('请输入用户名').fill('yj88888888');
      await page.getByPlaceholder('密码', { exact: true }).fill('yyds123456');
      await page.locator('button').filter({ hasText: '登录' }).click();
      await page.waitForFunction(
        () =>
          [...document.querySelectorAll('button')].filter(
            (b) => b.textContent.trim() === '导出备份',
          ).length === 1,
      );
      return page;
    };
    const read = (page) =>
      page.evaluate(
        () =>
          new Promise((resolve, reject) => {
            const request = indexedDB.open('butler-grade-one', 1);
            request.addEventListener('error', () => reject(request.error));
            request.addEventListener('success', () => {
              const db = request.result;
              const tx = db.transaction('library', 'readonly');
              const result = tx.objectStore('library').get('state');
              tx.addEventListener('complete', () => {
                resolve(result.result);
                db.close();
              });
              tx.addEventListener('abort', () => {
                reject(tx.error);
                db.close();
              });
            });
          }),
      );
    const writeFixture = (page, state) =>
      page.evaluate(
        (state) =>
          new Promise((resolve, reject) => {
            const request = indexedDB.open('butler-grade-one', 1);
            request.addEventListener('error', () => reject(request.error));
            request.addEventListener('success', () => {
              const db = request.result;
              const tx = db.transaction('library', 'readwrite');
              tx.objectStore('library').put(state, 'state');
              tx.addEventListener('complete', () => {
                resolve();
                db.close();
              });
              tx.addEventListener('abort', () => {
                reject(tx.error);
                db.close();
              });
            });
          }),
        state,
      );
    try {
      p = await open(375);
      await p
        .getByRole('button', { name: '进入课程', exact: true })
        .first()
        .click();
      await p.getByRole('button', { name: '下一步', exact: true }).waitFor();
      const baseline = await read(p);
      if (baseline.sessions.length !== 1)
        throw new Error('UI seed session missing');
      const seed = baseline.sessions[0];
      // Synthetic volume fixture: preserve the UI seed intact, then add 200
      // distinct snapshots. These are test data, not claimed child attempts.
      const source = structuredClone(baseline);
      for (let index = 0; index < 200; index++) {
        const session = structuredClone(seed);
        session.id = `backup-volume-fixture-${index}`;
        session.questions[0].material = '字'.repeat(16_000);
        if (index >= 190) {
          session.mode = 'review';
          session.originalSessionId = seed.id;
        }
        source.sessions.push(session);
      }
      if (Buffer.byteLength(JSON.stringify(source)) <= 8 * 1024 * 1024)
        throw new Error('fixture did not exercise multiple parts');
      await writeFixture(p, source);
      await p.goto(route);
      await p.reload();
      await p.getByRole('button', { name: '导出备份', exact: true }).click();
      const partsModal = p.getByRole('dialog');
      await partsModal.getByText('下载全部备份分卷', { exact: true }).waitFor();
      const buttons = partsModal.getByRole('button', { name: /^下载第/ });
      const count = await buttons.count();
      if (count < 2) throw new Error('export did not offer multiple downloads');
      if (
        await p.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        )
      )
        throw new Error('mobile parts dialog overflow');
      const files = [];
      for (let index = 0; index < count; index++) {
        const downloading = p.waitForEvent('download');
        await buttons.nth(index).click();
        const download = await downloading;
        const buffer = await fs.readFile(await download.path());
        const data = JSON.parse(buffer.toString()).data;
        if (buffer.length > 8 * 1024 * 1024)
          throw new Error('part exceeded import bound');
        if (
          !download
            .suggestedFilename()
            .includes(`part-${index + 1}-of-${count}`)
        )
          throw new Error('part filename not distinguishable');
        for (const session of data.sessions)
          if (
            session.originalSessionId &&
            !data.sessions.some(
              (parent) => parent.id === session.originalSessionId,
            )
          )
            throw new Error('part has orphan review');
        files.push(buffer);
      }
      if (JSON.stringify(await read(p)) !== JSON.stringify(source))
        throw new Error('export modified source records');
      await p.screenshot({ path: '/tmp/butler-backup-parts-375.png' });
      const target = await open(1200);
      const targetState = await read(target);
      if (targetState.sessions.length > 0) throw new Error('target not empty');
      const importPart = async (buffer) => {
        await target.locator('input[type=file]').setInputFiles({
          name: 'part.json',
          mimeType: 'application/json',
          buffer,
        });
        const modal = target.getByRole('dialog');
        await modal.getByText('检查备份后合并', { exact: true }).waitFor();
        await modal.getByRole('button', { name: '确 定', exact: true }).click();
        await modal.waitFor({ state: 'hidden' });
      };
      for (const buffer of files.toReversed()) await importPart(buffer);
      const restored = await read(target);
      if (restored.sessions.length !== source.sessions.length)
        throw new Error('incomplete part restoration');
      const sorted = (data) =>
        data.sessions.toSorted((a, b) => a.id.localeCompare(b.id));
      if (JSON.stringify(sorted(restored)) !== JSON.stringify(sorted(source)))
        throw new Error('restored snapshots differ');
      for (const buffer of files) await importPart(buffer);
      if (JSON.stringify(await read(target)) !== JSON.stringify(restored))
        throw new Error('reimport changed existing records');
      await target.reload();
      await target
        .getByRole('button', { name: '导出备份', exact: true })
        .waitFor();
      if (JSON.stringify(await read(target)) !== JSON.stringify(restored))
        throw new Error('restored records did not persist');
      const failingPage = await open(375);
      await failingPage
        .getByRole('button', { name: '只做练习', exact: true })
        .first()
        .click();
      await failingPage.getByRole('spinbutton').waitFor();
      const beforeFailure = await read(failingPage);
      const attempt = beforeFailure.sessions[0];
      if (!attempt || attempt.questions[0].rule.kind !== 'number')
        throw new Error('save failure fixture requires numeric practice');
      // Abort writes until an explicit retry. All changes remain in page memory.
      await failingPage.evaluate(() => {
        window.backupQaTransaction = IDBDatabase.prototype.transaction;
        IDBDatabase.prototype.transaction = function (...args) {
          const tx = window.backupQaTransaction.apply(this, args);
          if (args[1] === 'readwrite') queueMicrotask(() => tx.abort());
          return tx;
        };
      });
      await failingPage.getByRole('spinbutton').fill('0');
      const unsaved = failingPage.getByText(
        '本地保存失败，当前记录仍保留在页面中。请导出备份或重试保存。',
        { exact: true },
      );
      await unsaved.waitFor();
      if (
        JSON.stringify(await read(failingPage)) !==
        JSON.stringify(beforeFailure)
      )
        throw new Error('failed draft save modified disk');
      const unsavedDownload = failingPage.waitForEvent('download');
      await failingPage
        .getByRole('button', { name: '导出备份', exact: true })
        .click();
      const unsavedFile = await unsavedDownload;
      const exported = JSON.parse(
        await fs.readFile(await unsavedFile.path(), 'utf8'),
      );
      if (exported.data.sessions[0].responses[0].draft !== 0)
        throw new Error('unsaved zero draft missing from backup');
      await failingPage.screenshot({
        path: '/tmp/butler-backup-unsaved-375.png',
      });
      await failingPage.evaluate(() => {
        IDBDatabase.prototype.transaction = window.backupQaTransaction;
        delete window.backupQaTransaction;
      });
      await failingPage
        .getByRole('button', { name: '重试存储', exact: true })
        .click();
      await unsaved.waitFor({ state: 'hidden' });
      const recovered = await read(failingPage);
      if (recovered.sessions[0].responses[0].draft !== 0)
        throw new Error('retry lost zero draft');
      await failingPage.reload();
      await failingPage.getByRole('spinbutton').waitFor();
      if ((await failingPage.getByRole('spinbutton').inputValue()) !== '0')
        throw new Error('retried draft missing after reload');
      const originalState = await read(failingPage);
      const originalDraft = originalState.sessions[0];
      await failingPage
        .getByRole('button', { name: '新增档案', exact: true })
        .click();
      const newProfile = failingPage.getByRole('dialog');
      await newProfile
        .getByLabel('昵称', { exact: true })
        .fill('隔离草稿第二档案');
      await newProfile
        .getByRole('button', { name: '确 定', exact: true })
        .click();
      await newProfile.waitFor({ state: 'hidden' });
      await failingPage
        .getByText('还没有学习记录，选择一节课程开始吧。', { exact: true })
        .waitFor();
      await failingPage
        .getByRole('button', { name: '只做练习', exact: true })
        .first()
        .click();
      await failingPage.getByRole('spinbutton').fill('1');
      await failingPage.reload();
      await failingPage.getByRole('spinbutton').waitFor();
      if ((await failingPage.getByRole('spinbutton').inputValue()) !== '1')
        throw new Error('second profile draft not restored');
      const twoDrafts = await read(failingPage);
      if (
        twoDrafts.sessions.length !== 2 ||
        JSON.stringify(
          twoDrafts.sessions.find((item) => item.id === originalDraft.id),
        ) !== JSON.stringify(originalDraft)
      )
        throw new Error('second profile mutated original unfinished snapshot');
      await failingPage.locator('#learning-profile').focus();
      await failingPage.locator('#learning-profile').press('ArrowUp');
      await failingPage.locator('#learning-profile').press('Enter');
      await failingPage
        .getByRole('button', { name: '继续上次学习', exact: true })
        .click();
      await failingPage.getByRole('spinbutton').waitFor();
      if ((await failingPage.getByRole('spinbutton').inputValue()) !== '0')
        throw new Error('profile switch lost unfinished zero draft');
      const switched = await read(failingPage);
      if (
        switched.activeProfileId !== originalDraft.profileId ||
        JSON.stringify(sorted(switched)) !== JSON.stringify(sorted(twoDrafts))
      )
        throw new Error('profile switching changed saved session snapshots');
      if (errors.length > 0) throw new Error(JSON.stringify(errors));
      console.log(
        JSON.stringify({
          syntheticSessions: 200,
          preservedUiSession: seed.id,
          parts: count,
          everyPartWithin8MB: true,
          reverseOrderRestore: true,
          repeatedImport: true,
          exactSnapshotsAfterReload: true,
          unsavedDraftExport: true,
          explicitRetryPersisted: true,
          unfinishedProfileDraftIsolation: true,
          mobileOverflow: false,
          errors,
        }),
      );
    } finally {
      for (const context of contexts) await context.close();
    }
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
