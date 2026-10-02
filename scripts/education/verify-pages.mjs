/* Production-only smoke check: run after pnpm build:pages.
 * Uses a temporary static server and fresh Chrome profiles; never reads user data.
 * Tests eight catalog routes and one representative complete learning/backup flow.
 * This does not certify curriculum coverage or regional textbook assignments.
 * Usage: rtk proxy node scripts/education/verify-pages.mjs
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
    for (const width of [375, 768, 1200]) {
      const ctx = await browser.newContext({
        viewport: { width, height: 1000 },
      });
      p = await ctx.newPage();
      const api = [];
      const bad = [];
      const errors = [];
      p.on('pageerror', (e) => errors.push(e.message));
      p.on('response', (r) => {
        if (r.url().startsWith(origin) && r.status() >= 400)
          bad.push([r.status(), r.url()]);
      });
      p.on('request', (r) => {
        if (r.url().startsWith(origin) && /\/(api|auth)\//.test(r.url()))
          api.push(r.url());
      });
      const click = async (name) =>
        p
          .getByRole('button', { name, exact: true })
          .filter({ visible: true })
          .last()
          .click();
      const read = () =>
        p.evaluate(
          () =>
            new Promise((resolve, reject) => {
              const req = indexedDB.open('butler-grade-one', 1);
              req.onsuccess = () => {
                const db = req.result;
                const tx = db.transaction('library', 'readonly');
                const r = tx.objectStore('library').get('state');
                r.onsuccess = () => {
                  resolve(r.result);
                  db.close();
                };
                r.addEventListener('error', reject, { once: true });
              };
              req.addEventListener('error', reject, { once: true });
            }),
        );
      await p.goto(`${url}#/education/primary/p1/math/sujiao/upper`, {
        waitUntil: 'domcontentloaded',
      });
      await p.getByPlaceholder('请输入用户名').waitFor();
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
        .getByRole('button', { name: '导出备份', exact: true })
        .waitFor({ timeout: 60_000 });
      await p.goto(`${url}#/education?stage=primary&grade=p1`, {
        waitUntil: 'domcontentloaded',
      });
      await p
        .getByRole('combobox', { name: '省份 / 地区', exact: true })
        .waitFor();
      const chooseArea = async (id, label, search = false) => {
        const input = p.locator(`#${id}`);
        await input.focus();
        if (search) await input.fill(label);
        await input.press('ArrowDown');
        await p
          .locator('.ant-select-dropdown')
          .filter({ visible: true })
          .last()
          .getByText(label, { exact: true })
          .click();
      };
      const region = p.getByRole('region', {
        name: '按地区与学校资料选教材',
        exact: true,
      });
      const applyArea = region.getByRole('button', {
        name: '应用已核验数学版本并进入课程',
        exact: true,
      });
      await chooseArea('education-region-school', '苏州市吴江区绸都小学');
      await chooseArea('education-region-year', '2025—2026');
      if (await applyArea.isDisabled())
        throw new Error('exact school evidence unavailable');
      await chooseArea('education-region-province', '浙江', true);
      if (
        !(await applyArea.isDisabled()) ||
        (await region.getByText('待核验', { exact: true }).count()) !== 4
      )
        throw new Error('stale regional evidence');
      const areaText = await region.innerText();
      if (
        !areaText.includes('未选择城市（手动选版）') ||
        !areaText.includes('未选择学校（手动选版）')
      )
        throw new Error('stale city or school');
      await chooseArea('education-region-province', '江苏', true);
      if (!(await applyArea.isDisabled()))
        throw new Error('school silently restored');
      const volumes = [
        ['chinese', 'pep-2024', 'upper', 72],
        ['chinese', 'pep-2024', 'lower', 46],
        ['math', 'pep-2024', 'upper', 28],
        ['math', 'pep-2024', 'lower', 18],
        ['math', 'sujiao', 'upper', 71],
        ['math', 'sujiao', 'lower', 87],
        ['ethics', 'pep-2024', 'upper', 12],
        ['ethics', 'pep-2024', 'lower', 12],
      ];
      for (const [subject, edition, volume, count] of volumes) {
        await p.goto(
          `${url}#/education/primary/p1/${subject}/${edition}/${volume}`,
          { waitUntil: 'domcontentloaded' },
        );
        await p.waitForFunction(
          () =>
            [...document.querySelectorAll('button')].filter(
              (b) => b.textContent.trim() === '导出备份',
            ).length === 1,
        );
        await p
          .getByRole('button', { name: '导出备份', exact: true })
          .waitFor();
        if (
          (await p
            .getByRole('button', { name: '进入课程', exact: true })
            .count()) !== count
        )
          throw new Error(`catalog count ${[subject, edition, volume]}`);
        if (
          await p.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          )
        )
          throw new Error('catalog overflow');
      }
      await p.goto(`${url}#/education/primary/p1/math/sujiao/upper`, {
        waitUntil: 'domcontentloaded',
      });
      await p.waitForFunction(
        () =>
          [...document.querySelectorAll('button')].filter(
            (b) => b.textContent.trim() === '导出备份',
          ).length === 1,
      );
      await p.getByRole('button', { name: '导出备份', exact: true }).waitFor();
      const title = '期末探索：先移两块，再自由拼长方体';
      await p
        .locator('div.rounded-xl')
        .filter({ has: p.getByRole('heading', { name: title, exact: true }) })
        .getByRole('button', { name: '进入课程', exact: true })
        .click();
      await p.getByRole('button', { name: '下一步', exact: true }).waitFor();
      const sid = new URLSearchParams(p.url().split('?')[1]).get('session');
      for (let i = 0; i < 4; i++) await click('下一步');
      await click('开始练习');
      let partial = false;
      let wrong = false;
      while (true) {
        const lib = await read();
        const s = lib.sessions.find((s) => s.id === sid);
        const q = s.questions[s.questionIndex];
        if (!q) throw new Error('session missing');
        await p.getByText(q.prompt, { exact: true }).waitFor();
        if (q.rule.kind === 'manual') await click('暂时跳过');
        else if (q.rule.kind === 'reflection') {
          await p
            .getByRole('textbox', { name: '我的学习反思', exact: true })
            .fill('生产验收隔离记录：实际搭摆未做，未来计划另记。');
          await click('保存反思');
        } else {
          if (q.knowledge === 'sj-upper-final-moves-total') {
            await p.getByRole('spinbutton').nth(0).fill('2');
            await p.getByRole('spinbutton').nth(2).fill('0');
            await p.waitForFunction(
              () =>
                new Promise((resolve) => {
                  const r = indexedDB.open('butler-grade-one', 1);
                  r.onsuccess = () => {
                    const db = r.result;
                    const rr = db
                      .transaction('library')
                      .objectStore('library')
                      .get('state');
                    rr.onsuccess = () => {
                      const s = rr.result.sessions.find(
                        (s) => s.phase === 'practice',
                      );
                      resolve(
                        JSON.stringify(s.responses[s.questionIndex].draft) ===
                          '[2,null,0]',
                      );
                      db.close();
                    };
                  };
                }),
            );
            await p.reload({ waitUntil: 'domcontentloaded' });
            await p.getByRole('spinbutton').first().waitFor();
            if (
              (await p.getByRole('spinbutton').nth(1).inputValue()) !== '' ||
              (await p.getByRole('spinbutton').nth(2).inputValue()) !== '0'
            )
              throw new Error('draft');
            partial = true;
            for (let i = 0; i < 3; i++)
              await p
                .getByRole('spinbutton')
                .nth(i)
                .fill(String([2, 4, 4][i]));
            await click('提交答案');
            await p
              .getByText('再想一想，可以修改后重试', { exact: true })
              .waitFor();
            wrong = true;
          }
          if (q.rule.kind === 'steps') {
            for (let i = 0; i < q.rule.values.length; i++)
              await p
                .getByRole('spinbutton')
                .nth(i)
                .fill(String(q.rule.values[i]));
          } else if (q.rule.kind === 'number')
            await p.getByRole('spinbutton').fill(String(q.rule.value));
          else
            await p
              .getByRole('radio', {
                name: q.choices.find((c) => c.id === q.rule.value).label,
                exact: true,
              })
              .check();
          await click('提交答案');
          await p.getByText('答对了', { exact: true }).waitFor();
        }
        if (s.questionIndex === s.questions.length - 1) break;
        if (q.rule.kind !== 'manual') await click('下一题');
      }
      await click('完成并保存记录');
      await p.getByText('本次学习已完成', { exact: true }).waitFor();
      const completedLibrary = await read();
      const done = completedLibrary.sessions.find((s) => s.id === sid);
      if (
        !partial ||
        !wrong ||
        done.questions.length !== 15 ||
        done.responses.filter((r) => r.skipped).length !== 5
      )
        throw new Error('completion');
      await click('返回课程目录');
      const downloadPromise = p.waitForEvent('download');
      await click('导出备份');
      const download = await downloadPromise;
      const backup = JSON.parse(
        await fs.readFile(await download.path(), 'utf8'),
      );
      if (!JSON.stringify(backup).includes(sid))
        throw new Error('export lost session');
      const upload = p.locator('input[type=file]');
      await upload.setInputFiles({
        name: 'backup.json',
        mimeType: 'application/json',
        buffer: Buffer.from(JSON.stringify(backup)),
      });
      const modal = p.getByRole('dialog');
      await modal.getByText('检查备份后合并', { exact: true }).waitFor();
      const previewText = await modal.innerText();
      if (!previewText.includes('0次学习')) throw new Error('dedup preview');
      await modal.getByRole('button', { name: '确 定', exact: true }).click();
      await p.getByText('备份已合并', { exact: true }).waitFor();
      await p.getByRole('dialog').waitFor({ state: 'hidden' });
      const mergedLibrary = await read();
      if (mergedLibrary.sessions.filter((s) => s.id === sid).length !== 1)
        throw new Error('dedup import');
      await upload.setInputFiles({
        name: 'wrong-version.json',
        mimeType: 'application/json',
        buffer: Buffer.from(
          JSON.stringify({
            ...backup,
            data: { ...backup.data, schemaVersion: 999 },
          }),
        ),
      });
      await p
        .getByText('暂不支持这个备份版本，原档案未改变。', { exact: true })
        .waitFor();
      const rejectedLibrary = await read();
      if (rejectedLibrary.sessions.filter((s) => s.id === sid).length !== 1)
        throw new Error('invalid import changed state');
      await click('新增档案');
      await p
        .getByRole('dialog')
        .getByLabel('昵称', { exact: true })
        .fill('生产验收第二档案');
      await p
        .getByRole('dialog')
        .getByRole('button', { name: '确 定', exact: true })
        .click();
      await p.getByRole('dialog').waitFor({ state: 'hidden' });
      const addedProfileLibrary = await read();
      if (addedProfileLibrary.profiles.length !== 2)
        throw new Error('profile add');
      await p
        .getByText('还没有学习记录，选择一节课程开始吧。', { exact: true })
        .waitFor();
      await p.locator('#learning-profile').focus();
      await p.locator('#learning-profile').press('ArrowUp');
      await p.locator('#learning-profile').press('Enter');
      await p.getByText(title, { exact: true }).first().waitFor();
      const switchedProfileLibrary = await read();
      if (switchedProfileLibrary.activeProfileId !== done.profileId)
        throw new Error('profile switch');
      await p.screenshot({
        path: `/tmp/butler-pages-final-${width}.png`,
        fullPage: true,
      });
      // Changing textbook must preserve the isolated user's old completed snapshot.
      await click('语文 · 下册');
      await p.waitForFunction(
        () =>
          [...document.querySelectorAll('button')].filter(
            (b) => b.textContent.trim() === '导出备份',
          ).length === 1,
      );
      await p.getByRole('button', { name: '导出备份', exact: true }).waitFor();
      const changedSubjectLibrary = await read();
      if (!changedSubjectLibrary.sessions.some((s) => s.id === sid))
        throw new Error('cross subject lost');
      await p.reload({ waitUntil: 'domcontentloaded' });
      await p.waitForFunction(
        () =>
          [...document.querySelectorAll('button')].filter(
            (b) => b.textContent.trim() === '导出备份',
          ).length === 1,
      );
      await p.getByRole('button', { name: '导出备份', exact: true }).waitFor();
      const reloadedLibrary = await read();
      if (!reloadedLibrary.sessions.some((s) => s.id === sid))
        throw new Error('reload lost');
      await click('数学 · 下册');
      await p.waitForFunction(
        () =>
          [...document.querySelectorAll('button')].filter(
            (b) => b.textContent.trim() === '导出备份',
          ).length === 1,
      );
      await p.getByRole('button', { name: '导出备份', exact: true }).waitFor();
      if (!p.url().includes('/math/sujiao/lower'))
        throw new Error('edition persistence');
      const edition = p.getByRole('combobox', {
        name: '数学教材版本',
        exact: true,
      });
      await edition.focus();
      await edition.press('ArrowUp');
      await edition.press('Enter');
      await p.waitForURL('**/math/pep-2024/lower');
      await p.reload({ waitUntil: 'domcontentloaded' });
      await p.getByRole('button', { name: '导出备份', exact: true }).waitFor();
      const changedVersionLibrary = await read();
      if (!changedVersionLibrary.sessions.some((s) => s.id === sid))
        throw new Error('version changed history');
      await p.goto(`${url}#/education/primary/p1/math/bad/lower`, {
        waitUntil: 'domcontentloaded',
      });
      await p
        .getByText('没有这个教材版本，请选择上方的已核验教材。', {
          exact: false,
        })
        .waitFor();
      if (errors.length > 0 || bad.length > 0 || api.length > 0)
        throw new Error(JSON.stringify({ errors, bad, api }));
      console.log(
        JSON.stringify({
          width,
          login: true,
          provinceGuard: true,
          catalogs: 8,
          taskFlow: 15,
          draftReload: true,
          backupExport: true,
          duplicateImport: true,
          invalidImport: true,
          profileIsolation: true,
          editionSwitch: true,
          recordPreservation: true,
          hashBase: true,
          errors,
          bad,
          api,
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
