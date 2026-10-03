/* Production-only smoke check: run after pnpm build:pages.
 * Uses a temporary static server and fresh Chrome profiles; never reads user data.
 * Tests eight catalog routes and one representative complete learning/backup flow.
 * This does not certify curriculum coverage or regional textbook assignments.
 * Usage: rtk proxy node scripts/education/verify-pages.mjs
 * Use --generic-only to check only the Suzhou generic course entry in three widths.
 * Use --mobile-only for a focused 375px rerun after verifier-only changes.
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
const genericOnly = process.argv.includes('--generic-only');
const widths = process.argv.includes('--mobile-only')
  ? [375]
  : [375, 768, 1200];
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
    for (const width of widths) {
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
      const read = (page = p) =>
        page.evaluate(
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
      // Generic learning preferences must work without any school/year matching.
      const generic = p.getByRole('region', {
        name: '苏州通用课程 · 一年级',
        exact: true,
      });
      const beforeGeneric = await read();
      await chooseArea('education-entry-math-edition', '人教版（2024审定）');
      const applyGeneric = generic.getByRole('button', {
        name: '一键选择苏州通用课程',
        exact: true,
      });
      await applyGeneric.click();
      for (const name of [
        '语文 · 人教版（2024审定） · 上册',
        '数学 · 苏教版 · 上册',
        '道德与法治 · 人教版（2024审定） · 上册',
      ]) {
        await p.getByRole('button', { name, exact: true }).waitFor();
      }
      await chooseArea('education-generic-volume', '下册');
      if (
        await p
          .getByText(
            '已应用3个学科课程入口。未适用学科保留原选择，可从下方进入对应册次。',
            { exact: true },
          )
          .count()
      )
        throw new Error('stale generic applied volume');
      await applyGeneric.click();
      await p
        .getByRole('button', {
          name: '数学 · 苏教版 · 下册',
          exact: true,
        })
        .waitFor();
      if (
        (await p.evaluate(() =>
          localStorage.getItem('butler-grade-one-math-edition-v1'),
        )) !== 'sujiao'
      )
        throw new Error('generic math preference');
      if (JSON.stringify(await read()) !== JSON.stringify(beforeGeneric))
        throw new Error('generic course choice changed learning records');
      if (
        await p.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        )
      )
        throw new Error('generic course overflow');
      await p
        .locator('button[aria-haspopup="menu"]')
        .filter({ has: p.locator('svg.lucide-languages') })
        .click();
      await p.getByText('English', { exact: true }).click();
      const genericEnglish = p.getByRole('region', {
        name: 'Suzhou general courses · Grade 1',
        exact: true,
      });
      await genericEnglish.waitFor();
      const genericEnglishText = await genericEnglish.innerText();
      if (!genericEnglishText.includes('without a school or academic year'))
        throw new Error('generic English boundary');
      const wasDark = await p.evaluate(() =>
        document.documentElement.classList.contains('dark'),
      );
      await p.locator('.theme-toggle svg').click();
      await p.waitForFunction(
        (value) =>
          document.documentElement.classList.contains('dark') !== value,
        wasDark,
      );
      await p.waitForTimeout(700);
      if (
        await p.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        )
      )
        throw new Error('generic English overflow');
      await genericEnglish.screenshot({
        path: `/tmp/butler-generic-courses-en-${width}.png`,
      });
      await p.locator('.theme-toggle svg').click();
      await p.waitForFunction(
        (value) =>
          document.documentElement.classList.contains('dark') === value,
        wasDark,
      );
      await p.waitForTimeout(700);
      await p
        .locator('button[aria-haspopup="menu"]')
        .filter({ has: p.locator('svg.lucide-languages') })
        .click();
      await p.getByText('简体中文', { exact: true }).click();
      await generic.waitFor();
      await generic.screenshot({
        path: `/tmp/butler-generic-courses-${width}.png`,
      });
      await p
        .getByRole('button', {
          name: '数学 · 苏教版 · 下册',
          exact: true,
        })
        .click();
      await p.waitForURL(`${url}#/education/primary/p1/math/sujiao/lower`);
      await p.getByRole('button', { name: '导出备份', exact: true }).waitFor();
      await p.goto(`${url}#/education?stage=primary&grade=p1`, {
        waitUntil: 'domcontentloaded',
      });
      await p
        .getByRole('combobox', { name: '省份 / 地区', exact: true })
        .waitFor();
      if (genericOnly) {
        if (errors.length > 0 || bad.length > 0 || api.length > 0)
          throw new Error(JSON.stringify({ errors, bad, api }));
        console.log(
          JSON.stringify({
            width,
            genericCourses: true,
            volumeSwitch: true,
            preference: true,
            recordsUnchanged: true,
            languagesAndThemes: true,
            hashBase: true,
            errors,
            bad,
            api,
          }),
        );
        await ctx.close();
        continue;
      }
      const region = p.getByRole('region', {
        name: '按地区与学校资料选教材',
        exact: true,
      });
      const applyArea = region.getByRole('button', {
        name: '一键应用可用学科版本',
        exact: true,
      });
      await chooseArea('education-region-system', '六三学制（小学六年）');
      await chooseArea('education-region-school', '苏州市吴江区绸都小学');
      await chooseArea('education-region-year', '2025—2026');
      if (await applyArea.isDisabled())
        throw new Error('exact school evidence unavailable');
      await applyArea.click();
      await p
        .getByText(
          '已应用3个学科课程入口。未适用学科保留原选择，可从下方进入对应册次。',
          { exact: true },
        )
        .waitFor();
      await chooseArea('education-region-province', '浙江', true);
      if (
        (await applyArea.isDisabled()) ||
        (await region.getByText('待核验', { exact: true }).count()) !== 2 ||
        (await region.getByText('已核验', { exact: true }).count()) !== 0
      )
        throw new Error('stale regional evidence');
      const areaText = await region.innerText();
      if (
        !areaText.includes('未选择城市（手动选版）') ||
        !areaText.includes('未选择学校（手动选版）')
      )
        throw new Error('stale city or school');
      await chooseArea('education-region-province', '江苏', true);
      if ((await region.getByText('已核验', { exact: true }).count()) !== 0)
        throw new Error('school silently restored');
      await chooseArea('education-region-system', '五四学制（小学五年）');
      if (!(await applyArea.isDisabled()))
        throw new Error('five-four incorrectly applied');
      await chooseArea('education-region-system', '尚未确认学制');
      if (!(await applyArea.isDisabled()))
        throw new Error('unknown system incorrectly applied');
      const volumes = [
        ['chinese', 'pep-2024', 'upper', 72],
        ['chinese', 'pep-2024', 'lower', 46],
        ['math', 'pep-2024', 'upper', 50],
        ['math', 'pep-2024', 'lower', 44],
        ['math', 'sujiao', 'upper', 71],
        ['math', 'sujiao', 'lower', 87],
        ['ethics', 'pep-2024', 'upper', 16],
        ['ethics', 'pep-2024', 'lower', 16],
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
      if (width === 1200) {
        const beforeReject = await read();
        for (const buffer of [
          Buffer.from('{broken-json'),
          Buffer.from(
            JSON.stringify({
              ...backup,
              data: { ...backup.data, activeProfileId: 'missing-profile' },
            }),
          ),
          Buffer.alloc(8 * 1024 * 1024 + 1, 'x'),
        ]) {
          await upload.setInputFiles({
            name: 'invalid-record.json',
            mimeType: 'application/json',
            buffer,
          });
          const rejection = p.getByText(
            buffer.length > 8 * 1024 * 1024
              ? '备份文件不能超过8 MB。'
              : '备份文件格式或记录校验失败，原档案未改变。',
            { exact: true },
          );
          await rejection.waitFor();
          if (JSON.stringify(await read()) !== JSON.stringify(beforeReject))
            throw new Error('rejected file mutated persisted library');
          await rejection.waitFor({ state: 'hidden' });
        }

        // Simulate a failed IndexedDB write in this isolated test profile.
        // Only the next readwrite transaction is aborted; reads remain usable.
        await upload.setInputFiles({
          name: 'backup.json',
          mimeType: 'application/json',
          buffer: Buffer.from(JSON.stringify(backup)),
        });
        await modal.getByText('检查备份后合并', { exact: true }).waitFor();
        await p.evaluate(() => {
          const original = IDBDatabase.prototype.transaction;
          IDBDatabase.prototype.transaction = function (...args) {
            const tx = original.apply(this, args);
            if (args[1] === 'readwrite') {
              IDBDatabase.prototype.transaction = original;
              queueMicrotask(() => tx.abort());
            }
            return tx;
          };
        });
        await modal.getByRole('button', { name: '确 定', exact: true }).click();
        await p
          .getByText(
            '无法读取或保存本地学习档案。请检查浏览器存储权限，不要清除原记录。',
            { exact: true },
          )
          .waitFor();
        if (JSON.stringify(await read()) !== JSON.stringify(beforeReject))
          throw new Error('failed import mutated persisted library');
        await modal.getByRole('button', { name: '取 消', exact: true }).click();
        await modal.waitFor({ state: 'hidden' });

        const restoredContext = await browser.newContext({
          viewport: { width: 1200, height: 1000 },
        });
        try {
          const restoredPage = await restoredContext.newPage();
          restoredPage.on('pageerror', (error) => errors.push(error.message));
          await restoredPage.goto(
            `${url}#/education/primary/p1/math/sujiao/upper`,
          );
          await restoredPage
            .getByPlaceholder('请输入用户名')
            .fill('yj88888888');
          await restoredPage
            .getByPlaceholder('密码', { exact: true })
            .fill('yyds123456');
          await restoredPage
            .locator('button')
            .filter({ hasText: '登录' })
            .click();
          await restoredPage
            .getByRole('button', { name: '导出备份', exact: true })
            .waitFor();
          const initialRestoredState = await read(restoredPage);
          if (initialRestoredState.sessions.length > 0)
            throw new Error('restore context was not empty');
          await restoredPage.locator('input[type=file]').setInputFiles({
            name: 'restore.json',
            mimeType: 'application/json',
            buffer: Buffer.from(JSON.stringify(backup)),
          });
          const restoreModal = restoredPage.getByRole('dialog');
          await restoreModal
            .getByText('检查备份后合并', { exact: true })
            .waitFor();
          await restoreModal
            .getByRole('button', { name: '确 定', exact: true })
            .click();
          await restoredPage.getByText('备份已合并', { exact: true }).waitFor();
          await restoredPage.reload();
          await restoredPage
            .getByRole('button', { name: '导出备份', exact: true })
            .waitFor();
          const restored = await read(restoredPage);
          for (const session of backup.data.sessions) {
            const actual = restored.sessions.find(
              (item) => item.id === session.id,
            );
            if (JSON.stringify(actual) !== JSON.stringify(session))
              throw new Error(
                'fresh restore changed session snapshot or response',
              );
          }
          for (const profile of backup.data.profiles) {
            if (
              JSON.stringify(
                restored.profiles.find((item) => item.id === profile.id),
              ) !== JSON.stringify(profile)
            )
              throw new Error('fresh restore changed profile');
          }
        } finally {
          await restoredContext.close();
        }
      }
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
      const beforeBnu = await read();
      await p.goto(`${url}#/education/primary/p1/math/bnu-2024/upper`, {
        waitUntil: 'domcontentloaded',
      });
      await p.waitForFunction(
        () =>
          [...document.querySelectorAll('button')].filter(
            (button) => button.textContent.trim() === '导出备份',
          ).length === 1,
      );
      await p.getByRole('button', { name: '导出备份', exact: true }).waitFor();
      if (
        (await p
          .getByRole('button', { name: '进入课程', exact: true })
          .count()) !== 3
      )
        throw new Error('BNU partial availability');
      await p.getByText('校园里的数量与认识新同伴', { exact: true }).waitFor();
      await p
        .getByRole('button', { name: '进入课程', exact: true })
        .first()
        .click();
      await p.getByRole('button', { name: '下一步', exact: true }).waitFor();
      const bnuId = new URLSearchParams(p.url().split('?')[1]).get('session');
      for (let step = 0; step < 4; step++) await click('下一步');
      await click('开始练习');
      const findSession = async (id) => {
        const library = await read();
        const session = library.sessions.find((item) => item.id === id);
        if (!session) throw new Error(`Missing session ${id}`);
        return session;
      };
      const answerObjective = async (question) => {
        await (question.rule.kind === 'number'
          ? p.getByRole('spinbutton').fill(String(question.rule.value))
          : p
              .getByRole('radio', {
                name: question.choices.find(
                  (item) => item.id === question.rule.value,
                ).label,
                exact: true,
              })
              .check());
      };
      let bnuWrong = false;
      let bnuDraft = false;
      const savedDraft = async (index, draft) => {
        for (let attempt = 0; attempt < 50; attempt++) {
          const stored = await findSession(bnuId);
          const value = stored.responses[index]?.draft;
          if (JSON.stringify(value) === JSON.stringify(draft)) return;
          await p.waitForTimeout(100);
        }
        throw new Error('BNU draft did not reach IndexedDB');
      };
      while (true) {
        const session = await findSession(bnuId);
        const question = session.questions[session.questionIndex];
        await p.getByText(question.prompt, { exact: true }).waitFor();
        if (question.rule.kind === 'manual') await click('暂时跳过');
        else if (question.rule.kind === 'reflection') {
          const draft = '隔离测试：原书与实际交流未做，保留一个数字用途问题。';
          await p
            .getByRole('textbox', { name: '我的学习反思', exact: true })
            .fill(draft);
          await savedDraft(session.questionIndex, draft);
          await p.reload({ waitUntil: 'domcontentloaded' });
          await p
            .getByRole('textbox', { name: '我的学习反思', exact: true })
            .waitFor();
          if (
            (await p
              .getByRole('textbox', { name: '我的学习反思', exact: true })
              .inputValue()) !== draft
          )
            throw new Error('BNU reflection reload');
          await click('保存反思');
        } else {
          if (question.id.endsWith('q1')) {
            await p.getByRole('spinbutton').fill('0');
            await savedDraft(session.questionIndex, 0);
            await p.reload({ waitUntil: 'domcontentloaded' });
            await p.getByRole('spinbutton').waitFor();
            if ((await p.getByRole('spinbutton').inputValue()) !== '0')
              throw new Error('BNU zero draft');
            bnuDraft = true;
            await p.getByRole('spinbutton').fill('2');
            await click('提交答案');
            await p
              .getByText('再想一想，可以修改后重试', { exact: true })
              .waitFor();
            bnuWrong = true;
          }
          await answerObjective(question);
          if (question.id.endsWith('q2')) {
            await p
              .getByText(question.prompt, { exact: true })
              .scrollIntoViewIfNeeded();
            await p.screenshot({
              path: `/tmp/butler-bnu-practice-${width}.png`,
            });
          }
          await click('提交答案');
          await p.getByText('答对了', { exact: true }).waitFor();
        }
        if (session.questionIndex === session.questions.length - 1) break;
        if (question.rule.kind !== 'manual') await click('下一题');
      }
      await click('完成并保存记录');
      await p.getByText('本次学习已完成', { exact: true }).waitFor();
      const afterBnu = await read();
      const bnuSession = afterBnu.sessions.find((item) => item.id === bnuId);
      if (
        !bnuWrong ||
        !bnuDraft ||
        bnuSession.bookId !== 'bnu-math-p1-upper-2024' ||
        bnuSession.questions.length !== 11 ||
        bnuSession.responses.filter((item) => item.skipped).length !== 4
      )
        throw new Error('BNU course completion');
      for (const session of beforeBnu.sessions) {
        if (
          JSON.stringify(
            afterBnu.sessions.find((item) => item.id === session.id),
          ) !== JSON.stringify(session)
        )
          throw new Error('BNU changed old session');
      }
      await click('返回课程目录');
      const bnuDownload = p.waitForEvent('download');
      await click('导出备份');
      const bnuFile = await bnuDownload;
      const bnuBackup = JSON.parse(
        await fs.readFile(await bnuFile.path(), 'utf8'),
      );
      if (
        JSON.stringify(
          bnuBackup.data.sessions.find((item) => item.id === bnuId),
        ) !== JSON.stringify(bnuSession)
      )
        throw new Error('BNU export lost snapshot');
      const activityFlows = [];
      for (const [title, stepCount, taskCount, manualCount, lessonId] of [
        ['操场观察、分组与按条件选物', 6, 18, 7, 'bnu-upper-school-games'],
        [
          '生活物品的大小、长短与轻重观察',
          5,
          13,
          4,
          'bnu-upper-school-harvest',
        ],
      ]) {
        const previous = await read();
        await p.getByText(title, { exact: true }).waitFor();
        const entry = p.getByText(title, { exact: true }).locator('xpath=..');
        await entry
          .getByRole('button', { name: '进入课程', exact: true })
          .click();
        await p.getByRole('button', { name: '下一步', exact: true }).waitFor();
        const activityId = new URLSearchParams(p.url().split('?')[1]).get(
          'session',
        );
        for (let step = 1; step < stepCount; step++) await click('下一步');
        await click('开始练习');
        const activityDraft = async (index, draft) => {
          for (let attempt = 0; attempt < 50; attempt++) {
            const stored = await findSession(activityId);
            const response = stored.responses[index];
            if (JSON.stringify(response?.draft) === JSON.stringify(draft))
              return;
            await p.waitForTimeout(100);
          }
          throw new Error('Activity draft not saved');
        };
        while (true) {
          const session = await findSession(activityId);
          const index = session.questionIndex;
          const question = session.questions[index];
          await p.getByText(question.prompt, { exact: true }).waitFor();
          if (question.rule.kind === 'manual') await click('暂时跳过');
          else if (question.rule.kind === 'reflection') {
            const draft =
              '隔离测试：实际纸片和原书活动未做，记录一个待核对的问题。';
            await p
              .getByRole('textbox', { name: '我的学习反思', exact: true })
              .fill(draft);
            await activityDraft(index, draft);
            await p.reload({ waitUntil: 'domcontentloaded' });
            await p
              .getByRole('textbox', { name: '我的学习反思', exact: true })
              .waitFor();
            if (
              (await p
                .getByRole('textbox', { name: '我的学习反思', exact: true })
                .inputValue()) !== draft
            )
              throw new Error('Activity reflection reload');
            await click('保存反思');
          } else {
            if (question.id.endsWith('-q1')) {
              if (question.rule.kind === 'number') {
                await p.getByRole('spinbutton').fill('0');
                await activityDraft(index, 0);
                await p.reload({ waitUntil: 'domcontentloaded' });
                await p.getByRole('spinbutton').waitFor();
                if ((await p.getByRole('spinbutton').inputValue()) !== '0')
                  throw new Error('Activity zero reload');
              } else {
                const wrong = question.choices.find(
                  (item) => item.id !== question.rule.value,
                );
                await p
                  .getByRole('radio', { name: wrong.label, exact: true })
                  .check();
              }
              await click('提交答案');
              await p
                .getByText('再想一想，可以修改后重试', { exact: true })
                .waitFor();
            }
            await answerObjective(question);
            if (
              question.id.endsWith(
                lessonId === 'bnu-upper-school-games' ? '-q7' : '-q4',
              )
            ) {
              await p
                .getByText(question.prompt, { exact: true })
                .scrollIntoViewIfNeeded();
              await p.screenshot({
                path: `/tmp/butler-${lessonId}-${width}.png`,
              });
            }
            await click('提交答案');
            await p.getByText('答对了', { exact: true }).waitFor();
          }
          if (index === session.questions.length - 1) break;
          if (question.rule.kind !== 'manual') await click('下一题');
        }
        await click('完成并保存记录');
        await p.getByText('本次学习已完成', { exact: true }).waitFor();
        const complete = await findSession(activityId);
        if (
          complete.questions.length !== taskCount ||
          complete.lessonId !== lessonId ||
          complete.responses.filter((r) => r.skipped).length !== manualCount
        )
          throw new Error('Activity completion identity');
        const first = complete.responses.find((r) =>
          r.questionId.endsWith('-q1'),
        );
        if (
          JSON.stringify(first.submissions.map((s) => s.correct)) !==
          '[false,true]'
        )
          throw new Error('Activity mistake history');
        await click('返回课程目录');
        const newReview = p
          .getByText(title, { exact: true })
          .filter({ visible: true })
          .last()
          .locator('xpath=..');
        await newReview
          .getByRole('button', { name: '同知识点新题', exact: true })
          .click();
        await p
          .getByRole('button', { name: '提交答案', exact: true })
          .waitFor();
        const reviewId = new URLSearchParams(p.url().split('?')[1]).get(
          'session',
        );
        const fresh = await findSession(reviewId);
        if (
          fresh.questions.length !== 4 ||
          fresh.originalSessionId !== activityId
        )
          throw new Error('Activity fresh review identity');
        for (let index = 0; index < fresh.questions.length; index++) {
          const question = fresh.questions[index];
          await p.getByText(question.prompt, { exact: true }).waitFor();
          await answerObjective(question);
          await click('提交答案');
          await p.getByText('答对了', { exact: true }).waitFor();
          if (index < fresh.questions.length - 1) await click('下一题');
        }
        await click('完成并保存记录');
        await p.getByText('本次学习已完成', { exact: true }).waitFor();
        await click('返回课程目录');
        const after = await read();
        if (
          JSON.stringify(after.sessions.find((s) => s.id === activityId)) !==
          JSON.stringify(complete)
        )
          throw new Error('Review altered main attempt');
        for (const session of previous.sessions)
          if (
            JSON.stringify(after.sessions.find((s) => s.id === session.id)) !==
            JSON.stringify(session)
          )
            throw new Error('Activity changed old record');
        const downloading = p.waitForEvent('download');
        await click('导出备份');
        const backupFile = await downloading;
        const backup = JSON.parse(
          await fs.readFile(await backupFile.path(), 'utf8'),
        );
        if (
          JSON.stringify(backup.data.sessions) !==
          JSON.stringify(after.sessions)
        )
          throw new Error('Activity backup changed sessions');
        activityFlows.push({
          lessonId,
          taskCount,
          review: 4,
          skipped: manualCount,
        });
      }
      await click('数学 · 下册');
      await p.getByText('北师大版下册课程筹备中', { exact: true }).waitFor();
      await p.waitForFunction(
        () =>
          [...document.querySelectorAll('button')].filter(
            (button) => button.textContent.trim() === '导出备份',
          ).length === 0,
      );
      if (
        await p.getByRole('button', { name: '进入课程', exact: true }).count()
      )
        throw new Error('BNU lower uses another book');
      await chooseArea('grade-one-math-edition', '苏教版');
      await p.waitForURL('**/math/sujiao/lower');
      await p.waitForFunction(
        () =>
          [...document.querySelectorAll('button')].filter(
            (button) => button.textContent.trim() === '导出备份',
          ).length === 1,
      );
      await p.getByRole('button', { name: '导出备份', exact: true }).waitFor();
      const switchedLibrary = await read();
      if (!switchedLibrary.sessions.some((item) => item.id === bnuId))
        throw new Error('BNU switch lost history');
      if (errors.length > 0 || bad.length > 0 || api.length > 0)
        throw new Error(JSON.stringify({ errors, bad, api }));
      console.log(
        JSON.stringify({
          width,
          login: true,
          provinceGuard: true,
          catalogs: 8,
          bnuCourse: 11,
          activityFlows,
          bnuUnavailableLower: true,
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
