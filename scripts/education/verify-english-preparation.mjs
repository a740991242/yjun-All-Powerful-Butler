/* Run after build:pages. Isolated Chrome and production base; no user storage.
 * Checks all 13 original activities at 375px, representative flows at 768/1200,
 * both catalogs, strict volume boundaries, real exports and retained old records.
 * --representative-only checks two main flows plus review/backup at all widths.
 * Automated answers test UI wiring, not child mastery or actual oral activities.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

const root = fileURLToPath(
  new URL('../../apps/web-antd/dist/', import.meta.url),
);
const base = '/yjun-All-Powerful-Butler/';
const representativeOnly = process.argv.includes('--representative-only');
const server = http.createServer(async (req, res) => {
  try {
    const pathname = new URL(req.url, 'http://local').pathname;
    assert.ok(pathname.startsWith(base));
    const file = path.resolve(
      root,
      decodeURIComponent(pathname.slice(base.length)) || 'index.html',
    );
    assert.ok(file.startsWith(root));
    const mime = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.woff2': 'font/woff2',
    };
    res.writeHead(200, {
      'Content-Type': mime[path.extname(file)] || 'application/octet-stream',
    });
    res.end(await fs.readFile(file));
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
let browser;
let lastPage;
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const url = `http://127.0.0.1:${server.address().port}${base}`;
  for (const width of [375, 768, 1200]) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
    });
    const p = await context.newPage();
    lastPage = p;
    const errors = [];
    p.on('pageerror', (e) => errors.push(e.message));
    p.on('response', (r) => {
      if (r.url().startsWith(url) && r.status() >= 400) errors.push(r.url());
    });
    p.on('request', (r) => {
      if (r.url().startsWith(url) && /\/(api|auth)\//.test(r.url()))
        errors.push(r.url());
    });
    const click = (name) =>
      p
        .getByRole('button', { name, exact: true })
        .filter({ visible: true })
        .last()
        .click();
    const read = () =>
      p.evaluate(
        () =>
          new Promise((resolve, reject) => {
            const request = indexedDB.open('butler-grade-one', 1);
            request.addEventListener('error', reject, { once: true });
            request.addEventListener(
              'success',
              () => {
                const db = request.result;
                const result = db
                  .transaction('library', 'readonly')
                  .objectStore('library')
                  .get('state');
                result.addEventListener('error', reject, { once: true });
                result.addEventListener(
                  'success',
                  () => {
                    resolve(result.result);
                    db.close();
                  },
                  { once: true },
                );
              },
              { once: true },
            );
          }),
      );
    const readSession = async (sid) => {
      const data = await read();
      return data.sessions.find((session) => session.id === sid);
    };
    const waitSaved = (sid, expected) =>
      p.waitForFunction(
        ({ sid, expected }) =>
          new Promise((resolve, reject) => {
            const request = indexedDB.open('butler-grade-one', 1);
            request.addEventListener('error', reject, { once: true });
            request.addEventListener(
              'success',
              () => {
                const db = request.result;
                const result = db
                  .transaction('library', 'readonly')
                  .objectStore('library')
                  .get('state');
                result.addEventListener('error', reject, { once: true });
                result.addEventListener(
                  'success',
                  () => {
                    const session = result.result.sessions.find(
                      (item) => item.id === sid,
                    );
                    resolve(
                      session &&
                        ((expected.step !== undefined &&
                          session.phase === 'practice') ||
                          Object.entries(expected).every(
                            ([key, value]) => session[key] === value,
                          )),
                    );
                    db.close();
                  },
                  { once: true },
                );
              },
              { once: true },
            );
          }),
        { sid, expected },
      );
    const catalog = async () => {
      await p.waitForFunction(
        () =>
          [...document.querySelectorAll('button')].filter(
            (button) =>
              button.textContent.trim() === '导出备份' &&
              button.getBoundingClientRect().height > 0,
          ).length === 1,
      );
      await p.getByRole('button', { name: '导出备份', exact: true }).waitFor();
    };
    const noOverflow = async () =>
      assert.equal(
        await p.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
      );
    await p.goto(`${url}#/education/primary/p1/math/pep-2024/upper`);
    await p.getByPlaceholder('请输入用户名').fill('yj88888888');
    await p.getByPlaceholder('密码', { exact: true }).fill('yyds123456');
    await p.locator('button').filter({ hasText: '登录' }).click();
    await catalog();
    await p
      .getByRole('button', { name: '进入课程', exact: true })
      .first()
      .click();
    await click('返回课程目录');
    await catalog();
    const initial = await read();
    const old = structuredClone(initial.sessions[0]);
    const finishPractice = async (sid, wrongFirst = false) => {
      let submittedWrong = false;
      while (true) {
        const s = await readSession(sid);
        const q = s.questions[s.questionIndex];
        await p.getByText(q.prompt, { exact: true }).waitFor();
        if (q.visual?.kind === 'clock') {
          await p.getByText(q.prompt, { exact: true }).scrollIntoViewIfNeeded();
          await p.screenshot({
            path: `/tmp/butler-english-preparation-clock-${width}.png`,
          });
        }
        if (q.rule.kind === 'manual') {
          await click('暂时跳过');
        } else {
          if (q.rule.kind === 'reflection') {
            await p
              .getByRole('textbox', { name: '我的学习反思', exact: true })
              .fill('自动验收记录：未做实际口语或绘画，计划与实际分开。');
            await click('保存反思');
            await p.getByText('已记录反思', { exact: true }).waitFor();
          } else {
            if (wrongFirst && !submittedWrong && q.rule.kind === 'choice') {
              await p
                .getByRole('radio', {
                  name: q.choices.find((c) => c.id !== q.rule.value).label,
                  exact: true,
                })
                .check();
              await click('提交答案');
              await p
                .getByText('再想一想，可以修改后重试', { exact: true })
                .waitFor();
              submittedWrong = true;
            }
            await (q.rule.kind === 'number'
              ? p.getByRole('spinbutton').fill(String(q.rule.value))
              : p
                  .getByRole('radio', {
                    name: q.choices.find((c) => c.id === q.rule.value).label,
                    exact: true,
                  })
                  .check());
            await click('提交答案');
            await p.getByText('答对了', { exact: true }).waitFor();
          }
          if (s.questionIndex < s.questions.length - 1) await click('下一题');
        }
        if (s.questionIndex === s.questions.length - 1) break;
        await waitSaved(sid, { questionIndex: s.questionIndex + 1 });
      }
      await click('完成并保存记录');
      await p.getByText('本次学习已完成', { exact: true }).waitFor();
      const done = await readSession(sid);
      assert.ok(done.completedAt);
      assert.equal(done.activities.length, 0);
      for (const [index, question] of done.questions.entries()) {
        if (question.rule.kind === 'manual')
          assert.ok(done.responses[index].skipped);
        if (question.rule.kind === 'reflection')
          assert.equal(done.responses[index].submissions[0].correct, null);
      }
      await click('返回课程目录');
      await catalog();
    };
    for (const [volume, count] of [
      ['upper', 7],
      ['lower', 6],
    ]) {
      await p.goto(
        `${url}#/education/primary/p1/english-preparation/${volume}`,
      );
      await p
        .locator('.learning-workspace .ant-card-head-title')
        .filter({
          hasText: `原创英语启蒙 · ${volume === 'upper' ? '上册' : '下册'}`,
        })
        .waitFor();
      await catalog();
      assert.equal(
        await p.getByRole('button', { name: '进入课程', exact: true }).count(),
        count,
      );
      assert.equal(await p.getByText('教材第', { exact: false }).count(), 0);
      await noOverflow();
      await p.screenshot({
        path: `/tmp/butler-english-preparation-${volume}-${width}.png`,
        fullPage: true,
      });
      const titles = await p
        .locator('.learning-workspace h4')
        .allTextContents();
      for (const [index, title] of titles.entries()) {
        if (
          (width !== 375 || representativeOnly) &&
          index !== (volume === 'upper' ? 0 : 4)
        )
          continue;
        const card = p
          .locator('.learning-workspace h4')
          .filter({ hasText: title })
          .locator('..');
        await card
          .getByRole('button', { name: '进入课程', exact: true })
          .click();
        await p.getByRole('button', { name: '下一步', exact: true }).waitFor();
        const sid = new URL(p.url()).hash.match(/session=([^&]+)/)[1];
        let session = await readSession(sid);
        while (session.phase === 'learn') {
          const step = session.step;
          await p
            .getByRole('button', { name: /^(下一步|开始练习)$/ })
            .filter({ visible: true })
            .last()
            .click();
          await waitSaved(sid, { step: step + 1 });
          session = await readSession(sid);
        }
        await finishPractice(sid, index === 0 && volume === 'upper');
        assert.deepEqual(await readSession(old.id), old);
        console.log(JSON.stringify({ width, volume, title, complete: true }));
      }
    }
    await p.goto(`${url}#/education/primary/p1/english-preparation/upper`);
    await p
      .locator('.learning-workspace .ant-card-head-title')
      .filter({ hasText: '原创英语启蒙 · 上册' })
      .waitFor();
    await catalog();
    const beforeReview = await read();
    const wrongOriginal = beforeReview.sessions.find(
      (session) =>
        session.bookId === 'original-english-preparation-p1-upper-v1' &&
        session.responses.some(
          (response) => response.submissions[0]?.correct === false,
        ),
    );
    assert.ok(wrongOriginal);
    await p
      .getByRole('button', { name: '同知识点新题', exact: true })
      .first()
      .click();
    await p.getByRole('button', { name: '提交答案', exact: true }).waitFor();
    const reviewId = new URL(p.url()).hash.match(/session=([^&]+)/)[1];
    await finishPractice(reviewId);
    const afterReview = await read();
    const review = afterReview.sessions.find(
      (session) => session.id === reviewId,
    );
    assert.equal(review.mode, 'review');
    assert.equal(review.originalSessionId, wrongOriginal.id);
    assert.deepEqual(
      afterReview.sessions.find((session) => session.id === wrongOriginal.id),
      wrongOriginal,
    );
    assert.ok(
      review.questions.every(
        (question) =>
          !wrongOriginal.questions.some(
            (original) => original.id === question.id,
          ),
      ),
    );
    const beforeExport = await read();
    const downloading = p.waitForEvent('download');
    await click('导出备份');
    const download = await downloading;
    const backup = JSON.parse(await fs.readFile(await download.path(), 'utf8'));
    assert.deepEqual(backup.data, JSON.parse(JSON.stringify(beforeExport)));
    await p.locator('input[type=file]').setInputFiles(await download.path());
    const modal = p.getByRole('dialog');
    await modal.getByText('检查备份后合并', { exact: true }).waitFor();
    const previewText = await modal.innerText();
    assert.ok(previewText.includes('0次学习'));
    await modal.getByRole('button', { name: '确 定', exact: true }).click();
    await p.getByText('备份已合并', { exact: true }).waitFor();
    await modal.waitFor({ state: 'hidden' });
    assert.deepEqual(await read(), beforeExport);
    await p.reload();
    await catalog();
    assert.deepEqual(await read(), beforeExport);
    await p
      .locator('button[aria-haspopup="menu"]')
      .filter({ has: p.locator('svg.lucide-languages') })
      .click();
    await p.getByText('English', { exact: true }).click();
    await p
      .getByRole('button', { name: 'Export backup', exact: true })
      .waitFor();
    const englishText = await p.locator('body').innerText();
    assert.ok(englishText.includes('Original English Foundations'));
    if (
      !(await p.evaluate(() =>
        document.documentElement.classList.contains('dark'),
      ))
    )
      await p.locator('.theme-toggle svg').click();
    await p.waitForFunction(() =>
      document.documentElement.classList.contains('dark'),
    );
    await p.waitForTimeout(700);
    await noOverflow();
    await p.screenshot({
      path: `/tmp/butler-english-preparation-en-dark-${width}.png`,
      fullPage: true,
    });
    assert.deepEqual(await read(), beforeExport);
    await p.goto(`${url}#/education/primary/p1/english-preparation/middle`);
    await p
      .getByText('Invalid volume. Choose the upper or lower volume.', {
        exact: true,
      })
      .waitFor();
    await p.waitForFunction(
      () =>
        [...document.querySelectorAll('button')].filter(
          (button) =>
            button.textContent.trim() === 'Export backup' &&
            button.getBoundingClientRect().height > 0,
        ).length === 0,
    );
    assert.equal(
      await p
        .getByRole('button', { name: 'Export backup', exact: true })
        .count(),
      0,
    );
    assert.deepEqual(await read(), beforeExport);
    assert.deepEqual(errors, []);
    console.log(
      JSON.stringify({
        width,
        backup: true,
        oldRecords: true,
        invalidVolume: true,
        englishDark: true,
      }),
    );
    await context.close();
  }
} catch (error) {
  if (lastPage && !lastPage.isClosed()) {
    await lastPage.screenshot({
      path: '/tmp/butler-english-preparation-failure.png',
      fullPage: true,
    });
    const failureText = await lastPage.locator('body').innerText();
    console.log(failureText.slice(-4000));
  }
  throw error;
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
