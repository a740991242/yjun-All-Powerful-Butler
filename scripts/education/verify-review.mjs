/* Production acceptance: first submissions, hint/reading assistance, skips,
 * immutable original attempts and distinct review pools. Fresh profiles only.
 * Run after pnpm build:pages: rtk proxy node scripts/education/verify-review.mjs
 */
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
    const signature = (q) =>
      JSON.stringify([
        q.prompt,
        q.material ?? '',
        q.choices ?? [],
        q.visual ?? null,
        q.rule,
      ]);
    const read = (page) =>
      page.evaluate(
        () =>
          new Promise((resolve, reject) => {
            const request = indexedDB.open('butler-grade-one', 1);
            request.addEventListener('error', () => reject(request.error));
            request.addEventListener('success', () => {
              const db = request.result;
              const tx = db.transaction('library', 'readonly');
              const record = tx.objectStore('library').get('state');
              tx.addEventListener('complete', () => {
                resolve(record.result);
                db.close();
              });
              tx.addEventListener('abort', () => {
                reject(tx.error);
                db.close();
              });
            });
          }),
      );
    for (const width of [375, 768, 1200]) {
      const context = await browser.newContext({
        viewport: { width, height: 1000 },
      });
      try {
        p = await context.newPage();
        const errors = [];
        p.on('pageerror', (e) => errors.push(e.message));
        const click = (name) =>
          p
            .getByRole('button', { name, exact: true })
            .filter({ visible: true })
            .last()
            .click();
        await p.goto(route);
        await p.getByPlaceholder('请输入用户名').fill('yj88888888');
        await p.getByPlaceholder('密码', { exact: true }).fill('yyds123456');
        await p.locator('button').filter({ hasText: '登录' }).click();
        await p.waitForFunction(
          () =>
            [...document.querySelectorAll('button')].filter(
              (b) => b.textContent.trim() === '导出备份',
            ).length === 1,
        );
        await p
          .getByRole('button', { name: '只做练习', exact: true })
          .first()
          .click();
        await p.getByRole('spinbutton').waitFor();
        let state = await read(p);
        const originalId = state.sessions[0].id;
        const active = async (id) => {
          const library = await read(p);
          return library.sessions.find((s) => s.id === id);
        };
        const answer = (q) => {
          if (q.rule.kind !== 'number' || q.visual?.kind !== 'count')
            throw new Error('counting fixture unavailable');
          const value = q.visual.count + (q.visual.other ?? 0);
          if (q.rule.value !== value)
            throw new Error('fixture rule disagrees with visible quantities');
          return value;
        };
        const submitted = async (id, index, count = 1) => {
          await p.waitForFunction(
            ({ id, index, count }) =>
              new Promise((resolve) => {
                const req = indexedDB.open('butler-grade-one', 1);
                req.onsuccess = () => {
                  const db = req.result;
                  const tx = db.transaction('library', 'readonly');
                  const r = tx.objectStore('library').get('state');
                  r.onsuccess = () => {
                    resolve(
                      (r.result.sessions.find((s) => s.id === id)?.responses[
                        index
                      ].submissions.length ?? 0) >= count,
                    );
                    db.close();
                  };
                };
              }),
            { id, index, count },
          );
        };
        await click('完成并保存记录');
        await p
          .getByText('还有题目没有提交，请先作答或明确跳过。', { exact: true })
          .waitFor();
        for (let index = 0; index < 6; index++) {
          const session = await active(originalId);
          const q = session.questions[index];
          if (index === 3) {
            await click('暂时跳过');
            continue;
          }
          if (index === 0) {
            await p.getByRole('spinbutton').fill('999');
            await click('提交答案');
            await submitted(originalId, index);
            await p
              .getByText('再想一想，可以修改后重试', { exact: true })
              .waitFor();
          }
          if (index === 0 || index === 1 || index === 5) {
            await click('查看提示');
            await p
              .getByText(q.hint, { exact: true })
              .filter({ visible: true })
              .last()
              .waitFor();
          }
          if (index === 2 || index === 5) await click('记录家长帮读题');
          await p.getByRole('spinbutton').fill(String(answer(q)));
          await click('提交答案');
          await submitted(originalId, index, index === 0 ? 2 : 1);
          await p.getByText('答对了', { exact: true }).waitFor();
          if (index < 5) await click('下一题');
        }
        await click('完成并保存记录');
        await p.getByText('本次学习已完成', { exact: true }).waitFor();
        const original = await active(originalId);
        const first = original.responses[0].submissions;
        if (
          first.length !== 2 ||
          first[0].correct !== false ||
          first[0].assisted ||
          first[1].correct !== true ||
          !first[1].assisted
        )
          throw new Error('hint or retry rewrote original first submission');
        const metric = async (label, value) => {
          const actual = await p
            .getByText(label, { exact: true })
            .locator('..')
            .locator('strong')
            .innerText();
          if (actual.trim() !== value)
            throw new Error(`metric ${label}: ${actual}`);
        };
        await metric('独立首次答对 / 独立首次作答', '1 / 2');
        await metric('使用提示作答', '2');
        await metric('首次由家长帮读的客观题', '2');
        await metric('未作答并跳过', '1');
        const firstQuestionRecord = p
          .getByText(`1. ${original.questions[0].prompt}`, { exact: true })
          .locator('..');
        await firstQuestionRecord
          .getByText('首次提交', { exact: true })
          .waitFor();
        await firstQuestionRecord
          .getByText('第 2 次提交', { exact: true })
          .waitFor();
        await firstQuestionRecord
          .getByText('当时的答案：999', { exact: true })
          .waitFor();
        await firstQuestionRecord
          .getByText(`当时的答案：${answer(original.questions[0])}`, {
            exact: true,
          })
          .waitFor();
        if (
          (await firstQuestionRecord
            .getByText('使用提示作答', { exact: true })
            .count()) !== 1
        )
          throw new Error('history mislabels first assistance versus retry');
        await firstQuestionRecord.scrollIntoViewIfNeeded();
        await p.screenshot({
          path: `/tmp/butler-review-first-attempt-${width}.png`,
        });
        const originalSnapshot = JSON.stringify(original);
        await p.reload();
        await p.getByText('本次学习已完成', { exact: true }).waitFor();
        await metric('独立首次答对 / 独立首次作答', '1 / 2');
        if (JSON.stringify(await active(originalId)) !== originalSnapshot)
          throw new Error('summary reload changed original');
        await p.locator('#__app-loading__').waitFor({ state: 'detached' });
        await p
          .getByText('独立首次答对 / 独立首次作答', { exact: true })
          .scrollIntoViewIfNeeded();
        await p.screenshot({ path: `/tmp/butler-review-summary-${width}.png` });
        await click('返回课程目录');
        await click('复习原错题');
        await p.getByRole('spinbutton').waitFor();
        state = await read(p);
        const originalReview = state.sessions.find((s) => s.id !== originalId);
        if (
          !originalReview ||
          originalReview.mode !== 'review' ||
          originalReview.originalSessionId !== originalId ||
          originalReview.questions.length !== 1
        )
          throw new Error(
            'original mistake review did not create a separate attempt',
          );
        if (
          JSON.stringify(originalReview.questions[0]) !==
          JSON.stringify(original.questions[0])
        )
          throw new Error('original review changed saved question');
        await p
          .getByRole('spinbutton')
          .fill(String(answer(originalReview.questions[0])));
        await click('提交答案');
        await submitted(originalReview.id, 0);
        await click('完成并保存记录');
        await p.getByText('本次学习已完成', { exact: true }).waitFor();
        await metric('独立首次答对 / 独立首次作答', '1 / 1');
        await click('返回课程目录');
        await click('同知识点新题');
        await p.getByRole('spinbutton').waitFor();
        state = await read(p);
        const fresh = state.sessions.find(
          (s) => s.id !== originalId && s.id !== originalReview.id,
        );
        if (
          !fresh ||
          fresh.originalSessionId !== originalId ||
          fresh.mode !== 'review' ||
          fresh.questions.length !== 6
        )
          throw new Error('new review unavailable');
        const oldQuestions = [
          ...original.questions,
          ...originalReview.questions,
        ];
        for (const q of fresh.questions)
          if (
            oldQuestions.some(
              (old) => old.id === q.id || signature(old) === signature(q),
            )
          )
            throw new Error('new review reused an old task');
        for (let index = 0; index < fresh.questions.length; index++) {
          await p
            .getByRole('spinbutton')
            .fill(String(answer(fresh.questions[index])));
          await click('提交答案');
          await submitted(fresh.id, index);
          await p.getByText('答对了', { exact: true }).waitFor();
          if (index < fresh.questions.length - 1) await click('下一题');
        }
        await click('完成并保存记录');
        await p.getByText('本次学习已完成', { exact: true }).waitFor();
        await metric('独立首次答对 / 独立首次作答', '6 / 6');
        if (JSON.stringify(await active(originalId)) !== originalSnapshot)
          throw new Error('review changed original attempt');
        await click('返回课程目录');
        if (
          !(await p
            .getByRole('button', { name: '同知识点新题', exact: true })
            .isDisabled())
        )
          throw new Error('exhausted new-question pool still enabled');
        const downloading = p.waitForEvent('download');
        await click('导出备份');
        const download = await downloading;
        const exported = JSON.parse(
          await fs.readFile(await download.path(), 'utf8'),
        );
        if (
          exported.data.sessions.length !== 3 ||
          JSON.stringify(
            exported.data.sessions.find((s) => s.id === originalId),
          ) !== originalSnapshot
        )
          throw new Error('backup changed review or original evidence');
        await p.goto(`${route}?session=${originalId}`);
        await p.getByText('本次学习已完成', { exact: true }).waitFor();
        await metric('独立首次答对 / 独立首次作答', '1 / 2');
        if (
          errors.length > 0 ||
          (await p.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ))
        )
          throw new Error(JSON.stringify(errors));
        console.log(
          JSON.stringify({
            width,
            firstWrongRetriedWithHint: true,
            hintBeforeFirst: 2,
            readingHelpBeforeFirst: 2,
            independentFirst: '1/2',
            explicitSkip: 1,
            originalReviewQuestions: 1,
            newDistinctQuestions: 6,
            exhaustedPoolDisabled: true,
            originalSnapshotImmutable: true,
            backup: true,
            errors,
          }),
        );
      } finally {
        await context.close();
      }
    }
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
