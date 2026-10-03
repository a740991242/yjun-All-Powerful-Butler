/* Production-only smoke check: run after pnpm build:pages.
 * Uses a temporary static server and fresh Chrome profiles; never reads user data.
 * Tests eight catalog routes and one representative complete learning/backup flow.
 * This does not certify curriculum coverage or regional textbook assignments.
 * Usage: rtk proxy node scripts/education/verify-pages.mjs
 * Use --generic-only to check only the Suzhou generic course entry in three widths.
 * Use --bnu-lessons=id,id for named BNU activity flows plus the shared baseline; default checks all.
 * Use --bnu-demo-only for a focused three-width caterpillar interaction/reading check, without the shared baseline.
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
const demoOnly = process.argv.includes('--bnu-demo-only');
const requestedArgument = process.argv.find((value) =>
  value.startsWith('--bnu-lessons='),
);
const requestedBnu = requestedArgument
  ?.slice('--bnu-lessons='.length)
  .split(',');
if (
  requestedBnu &&
  (requestedBnu.some((id) => !/^bnu-upper-[a-z-]+$/.test(id)) ||
    new Set(requestedBnu).size !== requestedBnu.length ||
    genericOnly)
)
  throw new Error(
    'Provide distinct BNU lesson IDs and do not combine with generic-only.',
  );
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
      const verifyCaterpillarDemo = async () => {
        const sizes = await p.locator('.caterpillar-tool').evaluate((tool) => {
          const selector = tool.querySelector('.ant-select-selector');
          const item = tool.querySelector('.ant-select-selection-item');
          const label = tool.querySelector('label');
          return {
            height: selector.getBoundingClientRect().height,
            valueSize: Number.parseFloat(getComputedStyle(item).fontSize),
            labelSize: Number.parseFloat(getComputedStyle(label).fontSize),
            buttons: [...tool.querySelectorAll('button')].map(
              (button) => button.getBoundingClientRect().height,
            ),
            circles: tool.querySelectorAll('span.rounded-full').length,
          };
        });
        if (
          sizes.height < 44 ||
          sizes.valueSize < 20 ||
          sizes.labelSize < 20 ||
          sizes.buttons.some((height) => height < 44) ||
          sizes.circles !== 10
        )
          throw new Error(
            `Game reading and touch target sizes: ${JSON.stringify(sizes)}`,
          );
        for (const [card, count] of [
          [4, 4],
          [5, 9],
          [3, 12],
          [5, 7],
          [3, 10],
        ]) {
          await p.locator('#bnu-caterpillar-card').focus();
          await p.locator('#bnu-caterpillar-card').press('ArrowDown');
          await p.waitForFunction(() => {
            const item = document.querySelector(
              '.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option-content span',
            );
            return item && item.getBoundingClientRect().height >= 44;
          });
          const menuSize = await p
            .locator(
              '.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option-content span',
            )
            .first()
            .evaluate((item) => ({
              font: Number.parseFloat(getComputedStyle(item).fontSize),
              height: item.getBoundingClientRect().height,
            }));
          if (menuSize.font < 20 || menuSize.height < 44)
            throw new Error(
              `Game menu dimensions: ${JSON.stringify(menuSize)}`,
            );
          await p
            .locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
            .locator('.ant-select-item-option-content')
            .filter({ hasText: new RegExp(`^${card}$`) })
            .click();
          await p
            .locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
            .waitFor({ state: 'hidden' });
          await click('模拟这一回合');
          await p
            .getByText(`现在铺了${count}个圆片`, { exact: true })
            .waitFor();
          if (count === 12) {
            await p
              .getByText('超出身体2个；下一回合按摸到的数取走', {
                exact: true,
              })
              .waitFor();
            await p.screenshot({
              path: `/tmp/butler-bnu-caterpillar-overflow-${width}.png`,
            });
          }
        }
        if (
          !(await p
            .getByRole('button', { name: '模拟这一回合', exact: true })
            .isDisabled())
        )
          throw new Error('Game continued after reaching ten');
        await p
          .getByText('正好10个，成功！这一轮到此结束。', { exact: true })
          .waitFor();
        await p.screenshot({
          path: `/tmp/butler-bnu-caterpillar-success-${width}.png`,
        });
        await click('重新演示');
        await p.getByText('现在铺了0个圆片', { exact: true }).waitFor();
        if (
          await p
            .getByRole('list', { name: '演示回合记录', exact: true })
            .count()
        )
          throw new Error('Game reset retained old turns');
      };
      const verifySixCardDemo = async () => {
        const tool = p.getByRole('region', {
          name: '摸数卡规则演示',
          exact: true,
        });
        await tool.waitFor();
        const targets = await tool.locator('button').evaluateAll((buttons) =>
          buttons.map((button) => ({
            height: button.getBoundingClientRect().height,
            font: Number.parseFloat(getComputedStyle(button).fontSize),
          })),
        );
        if (targets.some((target) => target.height < 44 || target.font < 20))
          throw new Error('Six-card button target size');
        const values = [];
        for (let count = 1; count <= 6; count++) {
          const drawButton = tool.getByRole('button', {
            name: '随机摸一张',
            exact: true,
          });
          if (count === 2) {
            await drawButton.focus();
            await drawButton.press('Enter');
          } else await drawButton.click();
          await p.waitForFunction(
            (count) =>
              document.querySelectorAll('.six-card-tool ol li').length ===
              count,
            count,
          );
          const actual = await tool
            .locator('ol li .text-3xl')
            .allTextContents();
          values.push(Number(actual.at(-1)));
          if (
            values.some(
              (value) => !Number.isSafeInteger(value) || value < 1 || value > 5,
            )
          )
            throw new Error('Six-card drawn value outside deck');
          let total = 0;
          for (const value of values) total += value;
          await tool
            .getByText(`已摸${count}张，累计和${total}`, { exact: true })
            .waitFor();
          await tool
            .getByText(`未摸纸卡还剩${20 - count}张`, { exact: true })
            .waitFor();
          if (total > 6) {
            await tool
              .getByText(
                '和超过6，本轮出局；可以重新演示。出局只描述这一轮。',
                { exact: true },
              )
              .waitFor();
            if (
              !(await tool
                .getByRole('button', { name: '随机摸一张', exact: true })
                .isDisabled())
            )
              throw new Error('Drawing continued after out');
            break;
          }
          if (await drawButton.isDisabled())
            throw new Error(
              'An invented card-count limit blocked a legal total',
            );
        }
        await tool
          .getByRole('button', { name: '重新演示', exact: true })
          .click();
        await tool.getByText('已摸0张，累计和0', { exact: true }).waitFor();
        await tool.getByText('未摸纸卡还剩20张', { exact: true }).waitFor();
        if (await tool.locator('ol li').count())
          throw new Error('Reset kept six-card hand');
        // Controlled random inputs use normal UI buttons to prove fourth/fifth-card availability.
        const indices = [0, 4, 8, 12, 0, 3];
        for (let turn = 0; turn < indices.length; turn++) {
          await p.evaluate(
            (fraction) => {
              globalThis.sixCardOriginalRandom = Math.random;
              Math.random = () => fraction;
            },
            (indices[turn] + 0.1) / (20 - turn),
          );
          try {
            await tool
              .getByRole('button', { name: '随机摸一张', exact: true })
              .click();
            await p.waitForFunction(
              (count) =>
                document.querySelectorAll('.six-card-tool ol li').length ===
                count,
              turn + 1,
            );
          } finally {
            await p.evaluate(() => {
              Math.random = globalThis.sixCardOriginalRandom;
              delete globalThis.sixCardOriginalRandom;
            });
          }
          const expectedValues = [1, 1, 1, 1, 2, 2]
            .slice(0, turn + 1)
            .map(String);
          if (
            JSON.stringify(
              await tool.locator('ol li .text-3xl').allTextContents(),
            ) !== JSON.stringify(expectedValues)
          )
            throw new Error('Controlled physical deck draw mismatch');
          const total = [1, 2, 3, 4, 6, 8][turn];
          await tool
            .getByText(`已摸${turn + 1}张，累计和${total}`, { exact: true })
            .waitFor();
          const disabled = await tool
            .getByRole('button', { name: '随机摸一张', exact: true })
            .isDisabled();
          if (disabled !== (turn === 5))
            throw new Error(
              'Fourth/fifth card or strict-six boundary mismatch',
            );
        }
        await tool
          .getByRole('button', { name: '重新演示', exact: true })
          .click();

        await tool
          .getByRole('button', { name: '随机摸一张', exact: true })
          .click();
        await p.waitForFunction(
          () => document.querySelectorAll('.six-card-tool ol li').length === 1,
        );
        await tool
          .getByRole('button', { name: '我不再摸了', exact: true })
          .click();
        await tool
          .getByText(
            '本轮已停止。结果不超过6；与其他人的合法结果比较后才能判断谁获胜。',
            { exact: true },
          )
          .waitFor();
        if (
          !(await tool
            .getByRole('button', { name: '随机摸一张', exact: true })
            .isDisabled())
        )
          throw new Error('Drawing continued after voluntary stop');
        const beforeLanguage = await tool
          .locator('ol li .text-3xl')
          .allTextContents();
        await p
          .locator('button[aria-haspopup="menu"]')
          .filter({ has: p.locator('svg.lucide-languages') })
          .click();
        await p.getByText('English', { exact: true }).click();
        const englishTool = p.getByRole('region', {
          name: 'Number-card rule demonstration',
          exact: true,
        });
        await englishTool.waitFor();
        if (
          JSON.stringify(
            await englishTool.locator('ol li .text-3xl').allTextContents(),
          ) !== JSON.stringify(beforeLanguage)
        )
          throw new Error('Six-card locale switch reset hand');
        if (
          !(await englishTool
            .getByRole('button', { name: 'Draw one random card', exact: true })
            .isDisabled())
        )
          throw new Error('Six-card locale switch reset stop');
        const englishTargets = await englishTool
          .locator('button')
          .evaluateAll((buttons) =>
            buttons.map((button) => ({
              height: button.getBoundingClientRect().height,
              font: Number.parseFloat(getComputedStyle(button).fontSize),
            })),
          );
        if (
          englishTargets.some(
            (target) => target.height < 44 || target.font < 20,
          )
        )
          throw new Error('Six-card English touch size');
        await englishTool
          .getByRole('button', { name: 'New demonstration', exact: true })
          .evaluate((button) => button.scrollIntoView({ block: 'center' }));
        await p.screenshot({
          path: `/tmp/butler-bnu-six-card-demo-en-${width}.png`,
        });
        await p
          .locator('button[aria-haspopup="menu"]')
          .filter({ has: p.locator('svg.lucide-languages') })
          .click();
        await p.getByText('简体中文', { exact: true }).click();
        await tool
          .getByRole('button', { name: '重新演示', exact: true })
          .evaluate((button) => button.scrollIntoView({ block: 'center' }));
        await p.screenshot({
          path: `/tmp/butler-bnu-six-card-demo-${width}.png`,
        });
        await p.reload({ waitUntil: 'domcontentloaded' });
        await p.getByText('已摸0张，累计和0', { exact: true }).waitFor();
        await p.getByText('未摸纸卡还剩20张', { exact: true }).waitFor();
      };
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
      if (demoOnly) {
        await p.goto(`${url}#/education/primary/p1/math/bnu-2024/upper`, {
          waitUntil: 'domcontentloaded',
        });
        await p
          .getByText('十以内整理应用与毛毛虫游戏', { exact: true })
          .waitFor();
        await p
          .getByText('十以内整理应用与毛毛虫游戏', { exact: true })
          .locator('xpath=..')
          .getByRole('button', { name: '进入课程', exact: true })
          .click();
        for (let step = 0; step < 4; step++) await click('下一步');
        await verifyCaterpillarDemo();
        if (errors.length > 0 || bad.length > 0 || api.length > 0)
          throw new Error(
            `Demo browser errors: ${JSON.stringify({ errors, bad, api })}`,
          );
        console.log(
          JSON.stringify({
            width,
            demoOnly: true,
            sizes: true,
            overflow: true,
            stop: true,
            reset: true,
            errors,
            bad,
            api,
          }),
        );
        await ctx.close();
        continue;
      }
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
          .count()) !== 25
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
        const rule = question.rule;
        if (rule.kind === 'number') {
          await p.getByRole('spinbutton').fill(String(rule.value));
        } else if (rule.kind === 'choice') {
          const option = question.choices.find(
            (item) => item.id === rule.value,
          );
          await p
            .getByRole('radio', { name: option.label, exact: true })
            .check();
        } else if (rule.kind === 'set') {
          for (const value of rule.values) {
            const option = question.choices.find((item) => item.id === value);
            await p
              .getByRole('checkbox', { name: option.label, exact: true })
              .check();
          }
        } else if (rule.kind === 'steps') {
          for (let index = 0; index < rule.values.length; index++)
            await p
              .getByRole('spinbutton')
              .nth(index)
              .fill(String(rule.values[index]));
        } else if (rule.kind === 'equal-pairs') {
          const cards = rule.values.toSorted((a, b) => a - b);
          const arranged = [];
          while (cards.length > 0) arranged.push(cards.shift(), cards.pop());
          for (let index = 0; index < arranged.length; index++)
            await p
              .getByRole('spinbutton')
              .nth(index)
              .fill(String(arranged[index]));
        } else if (rule.kind === 'number-picks') {
          for (let index = 0; index < rule.fields.length; index++)
            await p
              .getByRole('spinbutton')
              .nth(index)
              .fill(String(rule.fields[index][0]));
        } else {
          throw new Error(`Unsupported BNU objective ${rule.kind}`);
        }
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
      const bnuFlows = [
        ['八件搭高、稳定与合作重试', 6, 24, 7, 'bnu-upper-building-tower'],
        [
          '按指令搭建、上下关系与通道观察',
          6,
          25,
          7,
          'bnu-upper-building-instructions',
        ],
        [
          '认识四种立体、分类与七件计数',
          6,
          25,
          7,
          'bnu-upper-solid-recognition',
        ],
        ['摸数卡、六的边界与共同获胜', 6, 29, 6, 'bnu-upper-six-card-game'],
        ['完整加减法表与分类规律', 6, 35, 6, 'bnu-upper-ten-fact-tables'],
        ['十以内整理应用与毛毛虫游戏', 6, 34, 7, 'bnu-upper-ten-organize-game'],
        ['两步变化、乘车与分类范围', 6, 27, 7, 'bnu-upper-two-step-changes'],
        ['求差、添入与移给的区别', 6, 22, 6, 'bnu-upper-difference-transfer'],
        ['已知总量与连续遮挡', 5, 20, 6, 'bnu-upper-hidden-quantities'],
        ['十的完整分合与开放等和配对', 6, 19, 6, 'bnu-upper-ten-partitions'],
        ['六到九完整分合与加减关系', 7, 35, 7, 'bnu-upper-six-nine-relations'],
        ['按用途整理与同批物品换标准', 6, 21, 6, 'bnu-upper-room-sort'],
        ['完整分类、更换标准与自主整理', 6, 25, 6, 'bnu-upper-classification'],
        ['介绍教室、相对位置与座位定位', 6, 22, 7, 'bnu-upper-classroom'],
        ['五以内取走、剩余与零的加减', 6, 24, 7, 'bnu-upper-five-subtract'],
        [
          '五以内加减整理、连续变化与算式卡',
          7,
          31,
          8,
          'bnu-upper-five-organize',
        ],
        ['五以内合并、增加与加法含义', 6, 18, 6, 'bnu-upper-five-add'],
        [
          '一到十点数、数序与一到五书写',
          6,
          21,
          6,
          'bnu-upper-life-count-order',
        ],
        ['逐一配对、比较符号与开放填数', 6, 24, 8, 'bnu-upper-life-comparison'],
        ['生活数量整理、序位与自主提问', 6, 23, 7, 'bnu-upper-life-organize'],
        ['六到十的表示、书写与顺倒数', 6, 19, 7, 'bnu-upper-life-six-ten'],
        ['零表示已知没有，空白不等于零', 5, 14, 5, 'bnu-upper-life-zero'],
        ['操场观察、分组与按条件选物', 6, 18, 7, 'bnu-upper-school-games'],
        [
          '生活物品的大小、长短与轻重观察',
          5,
          13,
          4,
          'bnu-upper-school-harvest',
        ],
      ];
      for (const id of requestedBnu || [])
        if (!bnuFlows.some((flow) => flow[4] === id))
          throw new Error(`Unknown BNU verification lesson: ${id}`);
      for (const [
        title,
        stepCount,
        taskCount,
        manualCount,
        lessonId,
      ] of bnuFlows.filter(
        (flow) => !requestedBnu || requestedBnu.includes(flow[4]),
      )) {
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
        for (let step = 1; step < stepCount; step++) {
          await click('下一步');
          if (lessonId === 'bnu-upper-ten-organize-game' && step === 4)
            await verifyCaterpillarDemo();
          if (lessonId === 'bnu-upper-six-card-game' && step === 4)
            await verifySixCardDemo();
          if (
            lessonId === 'bnu-upper-building-instructions' &&
            (step === 1 || step === 4)
          ) {
            const scene = step === 1 ? 'beam' : 'gate';
            const diagram = p.locator(
              `[data-bnu-building][data-building-scene="${scene}"]`,
            );
            await diagram.waitFor();
            const pieces = diagram.locator('[data-building-label]');
            const rows = await pieces.evaluateAll((elements) =>
              elements.map((element) => [
                element.dataset.buildingLabel,
                element.dataset.buildingShape,
                Number(
                  element.closest('[data-building-level]').dataset
                    .buildingLevel,
                ),
              ]),
            );
            const expected =
              scene === 'beam'
                ? [
                    ['D', 'cube', 3],
                    ['C', 'cuboid', 2],
                    ['A', 'cylinder', 1],
                    ['B', 'cylinder', 1],
                  ]
                : [
                    ['F', 'sphere', 4],
                    ['G', 'sphere', 4],
                    ['E', 'cuboid', 3],
                    ['C', 'cylinder', 2],
                    ['D', 'cylinder', 2],
                    ['A', 'cube', 1],
                    ['B', 'cube', 1],
                  ];
            if (JSON.stringify(rows) !== JSON.stringify(expected))
              throw new Error(
                'Building layer order differs from the source instructions',
              );
            const geometry = await diagram
              .locator('svg')
              .evaluateAll((elements) =>
                elements.every((svg) => {
                  const box = svg.querySelector('g').getBBox();
                  return (
                    box.x >= 0 &&
                    box.y >= 0 &&
                    box.x + box.width <= 240 &&
                    box.y + box.height <= 180
                  );
                }),
              );
            if (!geometry) throw new Error('Building SVG escapes its view box');
            for (const [position, piece] of [
              ['top', pieces.first()],
              ['bottom', pieces.last()],
            ]) {
              await piece.evaluate((element) =>
                element.scrollIntoView({
                  behavior: 'instant',
                  block: 'center',
                  inline: 'nearest',
                }),
              );
              await p.waitForTimeout(250);
              const visible = await piece.evaluate((element) => {
                const box = element.getBoundingClientRect();
                return (
                  box.left >= 0 &&
                  box.right <= innerWidth &&
                  box.top >= 0 &&
                  box.bottom <= innerHeight
                );
              });
              if (!visible)
                throw new Error(
                  'Building piece not fully visible after scrolling',
                );
              await p.screenshot({
                path: `/tmp/butler-bnu-building-${scene}-${position}-${width}.png`,
              });
            }
          }
          if (
            lessonId === 'bnu-upper-building-tower' &&
            (step === 1 || step === 2)
          ) {
            const scene = step === 1 ? 'tower-flat' : 'tower-upright';
            const diagram = p.locator(
              `[data-bnu-building][data-building-scene="${scene}"]`,
            );
            await diagram.waitFor();
            const pieces = diagram.locator('[data-building-label]');
            const rows = await pieces.evaluateAll((elements) =>
              elements.map((element) => [
                element.dataset.buildingLabel,
                element.dataset.buildingShape,
                Number(
                  element.closest('[data-building-level]').dataset
                    .buildingLevel,
                ),
              ]),
            );
            const expected = [
              ['H', 'sphere', 8],
              ['G', 'cylinder', 7],
              ['F', 'cylinder', 6],
              ['E', 'cube', 5],
              ['D', 'cube', 4],
              ['C', 'cuboid', 3],
              ['B', 'cuboid', 2],
              ['A', 'cuboid', 1],
            ];
            if (JSON.stringify(rows) !== JSON.stringify(expected))
              throw new Error('Tower plan lost or duplicated a piece');
            const bounds = await diagram
              .locator('svg')
              .evaluateAll((elements) =>
                elements.every((svg) => {
                  const group = svg.querySelector('g');
                  const box = group.getBBox();
                  const transform =
                    group.transform.baseVal.consolidate()?.matrix ||
                    new DOMMatrix();
                  return [
                    [box.x, box.y],
                    [box.x + box.width, box.y],
                    [box.x, box.y + box.height],
                    [box.x + box.width, box.y + box.height],
                  ].every(([x, y]) => {
                    const point = new DOMPoint(x, y).matrixTransform(transform);
                    return (
                      point.x >= 0 &&
                      point.y >= 0 &&
                      point.x <= 240 &&
                      point.y <= 180
                    );
                  });
                }),
              );
            if (!bounds)
              throw new Error('Rotated tower glyph escapes view box');
            for (const [position, piece] of [
              ['top', pieces.first()],
              ['bottom', pieces.last()],
            ]) {
              await piece.evaluate((element) =>
                element.scrollIntoView({
                  behavior: 'instant',
                  block: 'center',
                }),
              );
              await p.waitForTimeout(250);
              const visible = await piece.evaluate((element) => {
                const box = element.getBoundingClientRect();
                return (
                  box.left >= 0 &&
                  box.right <= innerWidth &&
                  box.top >= 0 &&
                  box.bottom <= innerHeight
                );
              });
              if (!visible)
                throw new Error(
                  'Tower piece not fully visible after scrolling',
                );
              await p.screenshot({
                path: `/tmp/butler-bnu-${scene}-${position}-${width}.png`,
              });
            }
          }
          if (lessonId === 'bnu-upper-solid-recognition' && step === 3) {
            const diagram = p.locator('.learning-visual');
            const models = diagram.locator('svg[role="img"]');
            if ((await models.count()) !== 7)
              throw new Error('Incomplete seven-object solid diagram');
            const shapeDescriptions = JSON.parse(
              await fs.readFile(
                `${repo}/apps/web-antd/src/locales/langs/zh-CN/educationLearning.json`,
                'utf8',
              ),
            );
            const expected = [
              'cuboid',
              'cube',
              'sphere',
              'cuboid',
              'cylinder',
              'cuboid',
              'cylinder',
            ].map((shape) => shapeDescriptions[`shape_${shape}`]);
            for (let model = 0; model < expected.length; model++)
              if (
                (await models.nth(model).getAttribute('aria-label')) !==
                `从左起第${model + 1}个模型：${expected[model]}`
              )
                throw new Error('Solid diagram and accessible sequence differ');
            await diagram.scrollIntoViewIfNeeded();
            await p.screenshot({
              path: `/tmp/butler-bnu-solid-row-start-${width}.png`,
            });
            const scroller = diagram.locator('.overflow-x-auto');
            await scroller.evaluate((element) => {
              element.scrollLeft = element.scrollWidth;
            });
            await p.waitForTimeout(200);
            const visible = await models.last().evaluate((element) => {
              const box = element.getBoundingClientRect();
              const parent =
                element.parentElement.parentElement.getBoundingClientRect();
              return (
                box.left >= parent.left - 1 && box.right <= parent.right + 1
              );
            });
            if (!visible)
              throw new Error('Last solid is clipped after local scroll');
            await p.screenshot({
              path: `/tmp/butler-bnu-solid-row-end-${width}.png`,
            });
          }
        }
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
                await p
                  .getByRole('spinbutton')
                  .fill(question.rule.value === 0 ? '1' : '0');
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
            if (
              lessonId === 'bnu-upper-life-comparison' &&
              question.id.endsWith('-q14')
            ) {
              await p.getByRole('spinbutton').nth(0).fill('0');
              await activityDraft(index, [0, null]);
              await p.reload({ waitUntil: 'domcontentloaded' });
              await p.getByRole('spinbutton').nth(0).waitFor();
              const first = await p.getByRole('spinbutton').nth(0).inputValue();
              const second = await p
                .getByRole('spinbutton')
                .nth(1)
                .inputValue();
              if (first !== '0' || second !== '')
                throw new Error('BNU open comparison partial zero reload');
            }
            if (
              lessonId === 'bnu-upper-five-add' &&
              question.id.endsWith('-q5')
            ) {
              await p.getByRole('spinbutton').nth(0).fill('0');
              await p.getByRole('spinbutton').nth(2).fill('3');
              await activityDraft(index, [0, null, 3]);
              await p.reload({ waitUntil: 'domcontentloaded' });
              await p.getByRole('spinbutton').nth(0).waitFor();
              const values = await p
                .getByRole('spinbutton')
                .evaluateAll((inputs) => inputs.map((input) => input.value));
              if (JSON.stringify(values) !== '["0","","3"]')
                throw new Error('BNU addition partial draft reload');
            }
            if (
              (lessonId === 'bnu-upper-room-sort' &&
                question.id.endsWith('-q5')) ||
              (lessonId === 'bnu-upper-classification' &&
                question.id.endsWith('-q12'))
            ) {
              const partial =
                lessonId === 'bnu-upper-room-sort' ? [0, null, 2] : [0, null];
              await p.getByRole('spinbutton').nth(0).fill('0');
              if (partial.length === 3)
                await p.getByRole('spinbutton').nth(2).fill('2');
              await activityDraft(index, partial);
              await p.reload({ waitUntil: 'domcontentloaded' });
              await p.getByRole('spinbutton').nth(0).waitFor();
              const displayed = await p
                .getByRole('spinbutton')
                .evaluateAll((inputs) => inputs.map((input) => input.value));
              if (
                JSON.stringify(displayed) !==
                JSON.stringify(
                  partial.map((value) => (value === null ? '' : String(value))),
                )
              )
                throw new Error('BNU classification partial zero reload');
              await p
                .locator('#__app-loading__')
                .waitFor({ state: 'detached' });
              await p
                .getByText(question.prompt, { exact: true })
                .scrollIntoViewIfNeeded();
              await p.screenshot({
                path: `/tmp/butler-${lessonId}-counts-${width}.png`,
                fullPage: true,
              });
            }
            if (
              lessonId === 'bnu-upper-six-nine-relations' &&
              question.id.endsWith('-partition-9')
            ) {
              const partial = [
                0,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                0,
              ];
              await p.getByRole('spinbutton').nth(0).fill('0');
              await p.getByRole('spinbutton').nth(9).fill('0');
              await activityDraft(index, partial);
              await p.reload({ waitUntil: 'domcontentloaded' });
              await p.getByRole('spinbutton').nth(0).waitFor();
              const values = await p
                .getByRole('spinbutton')
                .evaluateAll((inputs) => inputs.map((input) => input.value));
              if (
                JSON.stringify(values) !==
                JSON.stringify(
                  partial.map((value) => (value === null ? '' : String(value))),
                )
              )
                throw new Error('BNU nine-partition partial zero reload');
              await p
                .locator('#__app-loading__')
                .waitFor({ state: 'detached' });
            }
            if (
              lessonId === 'bnu-upper-ten-partitions' &&
              (question.id === 'bnu-upper-ten-partitions-parts' ||
                question.id.endsWith('-pairs'))
            ) {
              const partial =
                question.id === 'bnu-upper-ten-partitions-parts'
                  ? [0, null, null, null, null, null, null, null, null, null, 0]
                  : [1, null, null, null, null, null, null, 8];
              await p.getByRole('spinbutton').nth(0).fill(String(partial[0]));
              await p
                .getByRole('spinbutton')
                .nth(partial.length - 1)
                .fill(String(partial.at(-1)));
              await activityDraft(index, partial);
              await p.reload({ waitUntil: 'domcontentloaded' });
              await p.getByRole('spinbutton').nth(0).waitFor();
              await p
                .locator('#__app-loading__')
                .waitFor({ state: 'detached' });
              const displayed = await p
                .getByRole('spinbutton')
                .evaluateAll((inputs) => inputs.map((input) => input.value));
              if (
                JSON.stringify(displayed) !==
                JSON.stringify(
                  partial.map((n) => (n === null ? '' : String(n))),
                )
              )
                throw new Error('BNU ten partition/pair partial draft reload');
              if (question.rule.kind === 'equal-pairs') {
                const repeated = [1, 8, 1, 8, 1, 8, 1, 8];
                for (let field = 0; field < repeated.length; field++)
                  await p
                    .getByRole('spinbutton')
                    .nth(field)
                    .fill(String(repeated[field]));
                await click('提交答案');
                await p
                  .getByText('再想一想，可以修改后重试', { exact: true })
                  .waitFor();
              }
            }
            const applicationDrafts = {
              'bnu-upper-six-card-game-third-legal': [0, null, null],
              'bnu-upper-solid-recognition-counts': [0, null, null, null],
              'bnu-upper-building-instructions-counts': [0, null, null, null],
              'bnu-upper-building-tower-counts': [0, null, null, null],
              'bnu-upper-ten-fact-tables-add-10': [
                0,
                ...Array.from({ length: 10 }, () => null),
              ],
              'bnu-upper-ten-organize-game-game': [0, null, 0, null, null],
              'bnu-upper-two-step-changes-terminal': [0, null],
              'bnu-upper-difference-transfer-move': [0, null],
              'bnu-upper-hidden-quantities-stages': [0, null, 0],
            };
            const applicationPartial = applicationDrafts[question.id];
            if (applicationPartial) {
              await p.getByRole('spinbutton').nth(0).fill('0');
              if (applicationPartial[2] === 0)
                await p.getByRole('spinbutton').nth(2).fill('0');
              await activityDraft(index, applicationPartial);
              await p.reload({ waitUntil: 'domcontentloaded' });
              await p.getByRole('spinbutton').nth(0).waitFor();
              await p
                .locator('#__app-loading__')
                .waitFor({ state: 'detached' });
              const displayed = await p
                .getByRole('spinbutton')
                .evaluateAll((inputs) => inputs.map((input) => input.value));
              if (
                JSON.stringify(displayed) !==
                JSON.stringify(
                  applicationPartial.map((n) => (n === null ? '' : String(n))),
                )
              )
                throw new Error('BNU application partial zero/null reload');
            }
            await answerObjective(question);
            if (
              question.id.endsWith(
                {
                  'bnu-upper-six-card-game': '-third-legal',
                  'bnu-upper-solid-recognition': '-counts',
                  'bnu-upper-building-instructions': '-counts',
                  'bnu-upper-building-tower': '-counts',
                  'bnu-upper-ten-fact-tables': '-add-10',
                  'bnu-upper-ten-organize-game': '-game',
                  'bnu-upper-school-games': '-q7',
                  'bnu-upper-school-harvest': '-q4',
                  'bnu-upper-life-count-order': '-q10',
                  'bnu-upper-life-zero': '-q1',
                  'bnu-upper-life-six-ten': '-q5',
                  'bnu-upper-life-comparison': '-q14',
                  'bnu-upper-life-organize': '-q1',
                  'bnu-upper-five-add': '-q5',
                  'bnu-upper-five-subtract': '-q9',
                  'bnu-upper-classroom': '-q4',
                  'bnu-upper-six-nine-relations': '-partition-9',
                  'bnu-upper-ten-partitions': '-pairs',
                  'bnu-upper-two-step-changes': '-terminal',
                  'bnu-upper-difference-transfer': '-move',
                  'bnu-upper-hidden-quantities': '-stages',
                  'bnu-upper-room-sort': '-q9',
                  'bnu-upper-classification': '-q14',
                  'bnu-upper-five-organize': '-q16',
                }[lessonId],
              )
            ) {
              await p
                .getByText(question.prompt, { exact: true })
                .scrollIntoViewIfNeeded();
              if (
                [
                  'bnu-upper-building-instructions',
                  'bnu-upper-building-tower',
                  'bnu-upper-difference-transfer',
                  'bnu-upper-hidden-quantities',
                  'bnu-upper-six-card-game',
                  'bnu-upper-solid-recognition',
                  'bnu-upper-ten-fact-tables',
                  'bnu-upper-ten-organize-game',
                  'bnu-upper-two-step-changes',
                ].includes(lessonId)
              )
                await p
                  .getByRole('button', { name: '提交答案', exact: true })
                  .scrollIntoViewIfNeeded();
              await p.screenshot({
                path: `/tmp/butler-${lessonId}-${width}.png`,
              });
            }
            await click('提交答案');
            await p.getByText('答对了', { exact: true }).waitFor();
            if (
              lessonId === 'bnu-upper-life-comparison' &&
              question.id.endsWith('-q14')
            ) {
              await activityDraft(index, [0, 0]);
              await p.reload({ waitUntil: 'domcontentloaded' });
              await p.getByText(question.prompt, { exact: true }).waitFor();
              await p.getByText('答对了', { exact: true }).waitFor();
              for (let field = 0; field < 2; field++) {
                const value = await p
                  .getByRole('spinbutton')
                  .nth(field)
                  .inputValue();
                if (value !== '0')
                  throw new Error(
                    'Correct open zero pair did not survive reload',
                  );
              }
            }
            if (
              question.rule.kind === 'number' &&
              question.rule.value === 0 &&
              question.id.endsWith('-q1')
            ) {
              await activityDraft(index, 0);
              await p.reload({ waitUntil: 'domcontentloaded' });
              await p.getByText(question.prompt, { exact: true }).waitFor();
              await p.getByText('答对了', { exact: true }).waitFor();
              if ((await p.getByRole('spinbutton').inputValue()) !== '0')
                throw new Error('Correct zero did not survive reload');
            }
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
          fresh.questions.length !==
            (lessonId === 'bnu-upper-solid-recognition' ? 5 : 4) ||
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
          review: fresh.questions.length,
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
          bnuCourse: 25,
          bnuSelection: requestedBnu || 'all',
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
