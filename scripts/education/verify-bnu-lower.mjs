/* Verify the independent BNU lower course against the Pages build.
 * Isolated profiles: full main/review flows, zero reload, retry history, backup
 * and unchanged PEP history at three widths. Physical tasks remain skipped.
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
function selectedFlow() {
  if (process.argv.includes('--pencils'))
    return {
      index: 13,
      lessonId: 'bnu-lower-buy-pencils',
      zero: null,
      retry: '-pine-eaten',
      manual: 11,
      steps: 9,
      review: 5,
      key: 'pencils',
    };
  if (process.argv.includes('--classroom'))
    return {
      index: 12,
      lessonId: 'bnu-lower-classroom-decoration',
      zero: null,
      retry: '-two-next-7',
      manual: 12,
      steps: 7,
      review: 4,
      key: 'classroom',
    };
  if (process.argv.includes('--trace-print'))
    return {
      index: 9,
      lessonId: 'bnu-lower-trace-print',
      zero: null,
      retry: '-main-shape-0',
      manual: 8,
      steps: 5,
      review: 4,
      key: 'trace',
    };
  if (process.argv.includes('--find-traces'))
    return {
      index: 10,
      lessonId: 'bnu-lower-find-traces',
      zero: null,
      retry: '-main-shape-0',
      manual: 8,
      steps: 7,
      review: 5,
      key: 'find',
    };
  if (process.argv.includes('--shadow-theatre'))
    return {
      index: 11,
      lessonId: 'bnu-lower-shadow-theatre',
      zero: null,
      retry: '-bigger',
      manual: 6,
      steps: 5,
      review: 4,
      key: 'shadow',
    };

  if (process.argv.includes('--unit-one-practice'))
    return {
      index: 8,
      lessonId: 'bnu-lower-unit-one-practice',
      zero: '-zero-unchecked',
      retry: '-sold',
      manual: 10,
      key: 'practice',
    };
  if (process.argv.includes('--harvest'))
    return {
      index: 7,
      lessonId: 'bnu-lower-unit-one-harvest',
      zero: '-zero-ones',
      retry: '-total',
      manual: 7,
      key: 'harvest',
    };
  if (process.argv.includes('--addition-table'))
    return {
      index: 6,
      lessonId: 'bnu-lower-make-addition-table',
      zero: '-zero-ones',
      retry: '-card-1',
      manual: 7,
      key: 'addition',
    };
  if (process.argv.includes('--rabbits'))
    return {
      index: 5,
      lessonId: 'bnu-lower-rabbit-homes',
      zero: '-zero-ones',
      retry: '-total',
      manual: 10,
      key: 'rabbits',
    };
  if (process.argv.includes('--chores'))
    return {
      index: 4,
      lessonId: 'bnu-lower-household-chores',
      zero: '-zero-ones',
      retry: '-sum-0',
      manual: 9,
      key: 'chores',
    };
  if (process.argv.includes('--farm'))
    return {
      index: 3,
      lessonId: 'bnu-lower-happy-farm',
      zero: '-zero-ones',
      retry: '-sum-0',
      manual: 9,
      key: 'farm',
    };
  if (process.argv.includes('--blocks'))
    return {
      index: 2,
      lessonId: 'bnu-lower-building-blocks',
      zero: '-zero-ones',
      retry: '-calc-0',
      manual: 9,
      key: 'blocks',
    };
  if (process.argv.includes('--place-value'))
    return {
      index: 1,
      lessonId: 'bnu-lower-ancient-count-two',
      zero: '-ten-zero',
      retry: '-draw-2',
      manual: 9,
      key: 'place',
    };
  return {
    index: 0,
    lessonId: 'bnu-lower-ancient-count-one',
    zero: '-zero-ones',
    retry: '-symbol-twelve',
    manual: 11,
    key: 'count',
  };
}
const flow = selectedFlow();
const base = '/yjun-All-Powerful-Butler/';
const root = `${repo}/apps/web-antd/dist`;
const server = http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url, 'http://local');
    if (!u.pathname.startsWith(base)) throw new Error('base');
    const file = path.resolve(
      root,
      decodeURIComponent(u.pathname.slice(base.length)) || 'index.html',
    );
    if (!file.startsWith(`${root}/`)) throw new Error('path');
    const bytes = await fs.readFile(file);
    res.setHeader(
      'Content-Type',
      {
        '.js': 'text/javascript',
        '.html': 'text/html',
        '.css': 'text/css',
        '.svg': 'image/svg+xml',
        '.json': 'application/json',
        '.png': 'image/png',
        '.woff2': 'font/woff2',
      }[path.extname(file)] || 'application/octet-stream',
    );
    res.end(bytes);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
(async () => {
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  let b;
  try {
    b = await chromium.launch({ channel: 'chrome', headless: true });
    for (const width of process.argv.includes('--mobile-only')
      ? [375]
      : [375, 768, 1200]) {
      const api = [];
      const bad = [];
      const c = await b.newContext({ viewport: { width, height: 1000 } });
      const errors = [];
      const p = await c.newPage();
      const origin = `http://127.0.0.1:${server.address().port}`;
      const url = origin + base;
      p.on('pageerror', (e) => errors.push(e.message));
      p.on('response', (r) => {
        if (r.url().startsWith(origin) && r.status() >= 400) bad.push(r.url());
      });
      p.on('request', (r) => {
        if (r.url().startsWith(origin) && /\/(api|auth)\//.test(r.url()))
          api.push(r.url());
      });
      await c.addInitScript(() => {
        const get = Storage.prototype.getItem;
        const key = 'butler-grade-one-regional-presets-v1';
        const set = Storage.prototype.setItem;
        window.qaFailRead = sessionStorage.getItem('qa-preset-read') === 'true';
        window.qaFailWrite = false;
        window.qaStored = () => get.call(localStorage, key);
        Storage.prototype.getItem = function (k) {
          if (k === key && window.qaFailRead) throw new Error('QA read denial');
          return get.call(this, k);
        };
        Storage.prototype.setItem = function (k, v) {
          if (k === key && window.qaFailWrite)
            throw new Error('QA write denial');
          return set.call(this, k, v);
        };
        window.qaLoad = () =>
          new Promise((resolve, reject) => {
            const open = indexedDB.open('butler-grade-one', 1);
            open.addEventListener('error', () => reject(open.error));
            open.onsuccess = () => {
              const db = open.result;
              const tx = db.transaction('library', 'readonly');
              const r = tx.objectStore('library').get('state');
              let data;
              r.onsuccess = () => (data = r.result);
              tx.oncomplete = () => {
                db.close();
                resolve(data);
              };
              tx.addEventListener('error', () => {
                db.close();
                reject(tx.error);
              });
            };
          });
      });

      const click = async (name) =>
        p
          .getByRole('button', { name, exact: true })
          .filter({ visible: true })
          .last()
          .click();
      const read = () => p.evaluate(() => window.qaLoad());
      const wait = async (fn) => {
        for (let attempt = 0; attempt < 100; attempt++) {
          const data = await read();
          if (fn(data)) return data;
          await p.waitForTimeout(100);
        }
        throw new Error('Native learning state did not settle');
      };
      const goto = async (route) =>
        p.goto(`${url}#${route}`, { waitUntil: 'networkidle' });
      await goto('/education/primary/p1/math/pep-2024/upper');
      if (p.url().includes('login')) {
        await p.getByPlaceholder('请输入用户名').fill('yj88888888');
        await p.getByPlaceholder('密码', { exact: true }).fill('yyds123456');
        await p.locator('button').filter({ hasText: '登录' }).click();
        await p.waitForTimeout(1500);
        await goto('/education/primary/p1/math/pep-2024/upper');
      }
      await p
        .getByRole('button', { name: '进入课程', exact: true })
        .first()
        .click();
      await click('下一步');
      const initial = await wait(
        (d) => d?.sessions.length === 1 && d.sessions[0].step === 1,
      );
      const previous = initial.sessions[0];
      await goto('/education/primary/p1/math/bnu-2024/lower');
      await p
        .getByText('一年级数学下册 · 北师大版（2024审核）', { exact: true })
        .waitFor();
      await p.getByText('图形大变身（一）', { exact: true }).first().waitFor();
      if (await p.getByText('第一单元覆盖复核', { exact: true }).count())
        throw new Error('Completed unit one still has the review placeholder');
      if (
        (await p
          .getByRole('button', { name: '进入课程', exact: true })
          .count()) !== 14
      )
        throw new Error('Unexpected lower availability');
      await p
        .getByRole('button', { name: '进入课程', exact: true })
        .nth(flow.index)
        .click();
      await wait((d) => d.sessions.length === 2);
      const started = await read();
      let session = started.sessions.find((s) => s.lessonId === flow.lessonId);
      const sid = session.id;
      const current = async () => {
        const state = await read();
        return state.sessions.find((s) => s.id === sid);
      };
      async function inspectClassroomPattern(variant) {
        const model = p.locator('[data-periodic-shapes]');
        const textFits = await model.locator('p').evaluateAll((nodes) =>
          nodes.every((n) => {
            const r = document.createRange();
            r.selectNodeContents(n);
            const text = r.getBoundingClientRect();
            const box = n.getBoundingClientRect();
            return (
              Number.parseFloat(getComputedStyle(n).fontSize) >= 20 &&
              text.left >= box.left - 1 &&
              text.right <= box.right + 1
            );
          }),
        );
        if (!textFits)
          throw new Error('Pattern instructions too small or overflowing');
        const svg = model.locator('svg').first();
        const counts = await svg.evaluate((n) => ({
          positions: [...n.children].filter(
            (x) => x.tagName.toLowerCase() === 'g',
          ).length,
          circles: n.querySelectorAll('circle').length,
          triangles: n.querySelectorAll('path').length,
          blanks: [...n.querySelectorAll('text')].filter(
            (x) => x.textContent.trim() === '?',
          ).length,
        }));
        if (
          JSON.stringify(counts) !==
          JSON.stringify({ positions: 9, circles: 4, triangles: 2, blanks: 3 })
        )
          throw new Error(
            `Incomplete repeated pattern: ${JSON.stringify(counts)}`,
          );
        const text = await svg.locator('text').evaluateAll((nodes) =>
          nodes.map((n) => {
            const r = n.getBBox();
            return {
              text: n.textContent.trim(),
              font: Number.parseFloat(getComputedStyle(n).fontSize),
              inside:
                r.x >= 0 &&
                r.y >= 0 &&
                r.x + r.width <= 648 &&
                r.y + r.height <= 104,
            };
          }),
        );
        if (text.some((t) => t.font < 20 || !t.inside))
          throw new Error('Pattern position font or clipping');
        if (
          text
            .filter((t) => t.text !== '?')
            .map((t) => t.text)
            .join(',') !== '1,2,3,4,5,6,7,8,9'
        )
          throw new Error('Pattern position labels changed');
        const scroll = svg.locator('..');
        await scroll.evaluate((n) => n.scrollIntoView({ block: 'center' }));
        await scroll.focus();
        await scroll.press('ArrowRight');
        await p.waitForTimeout(250);
        if (
          await scroll.evaluate(
            (n) => n.scrollWidth > n.clientWidth && n.scrollLeft === 0,
          )
        )
          throw new Error('Pattern keyboard scroll unavailable');
        for (const edge of ['left', 'right']) {
          await scroll.evaluate((n, edge) => {
            n.scrollLeft = edge === 'left' ? 0 : n.scrollWidth;
          }, edge);
          await p.screenshot({
            path: `/tmp/butler-bnu-classroom-${variant}-${edge}-${width}.png`,
          });
        }
        if (
          await p.evaluate(
            () => document.documentElement.scrollWidth > innerWidth + 1,
          )
        )
          throw new Error('Pattern overflows page');
        await scroll.evaluate((n) => {
          n.scrollLeft = 0;
        });
      }
      async function inspectShadow(variant, english = false) {
        const model = p.locator('[data-shadow-size]');
        const scenes = model.locator('[data-shadow-scene]');
        if ((await scenes.count()) !== 2)
          throw new Error('Missing shadow trials');
        const geometry = await scenes.evaluateAll((nodes) =>
          nodes.map((n) => {
            const object = n.querySelector('[data-shadow-object]');
            const shadow = n.querySelector('[data-shadow-strip]');
            return {
              label: n.dataset.shadowScene,
              objectX: Number(object.getAttribute('x1')),
              objectSize:
                Number(object.getAttribute('y2')) -
                Number(object.getAttribute('y1')),
              shadowSize:
                Number(shadow.getAttribute('y2')) -
                Number(shadow.getAttribute('y1')),
              aria: n.getAttribute('aria-label'),
            };
          }),
        );
        const nearIndex = variant === 'main' ? 0 : 1;
        if (
          geometry[nearIndex].objectX !== 100 ||
          geometry[1 - nearIndex].objectX !== 200 ||
          geometry.some((s) => s.objectSize !== 20) ||
          geometry[nearIndex].shadowSize <= geometry[1 - nearIndex].shadowSize
        )
          throw new Error('Shadow size or controlled conditions changed');
        if (
          !geometry[nearIndex].aria.includes(
            english ? 'nearer the light' : '靠近灯',
          ) ||
          !geometry[1 - nearIndex].aria.includes(
            english ? 'farther from the light' : '远离灯',
          )
        )
          throw new Error('Accessible condition missing');
        for (let i = 0; i < 2; i++) {
          const svg = scenes.nth(i);
          await svg.evaluate((n) => n.scrollIntoView({ block: 'center' }));
          const scroll = svg.locator('..');
          const size = await scroll.evaluate((n) => ({
            visible: n.clientWidth,
            all: n.scrollWidth,
          }));
          if (size.all > size.visible) {
            await scroll.focus();
            await scroll.press('ArrowRight');
            await p.waitForTimeout(200);
            if ((await scroll.evaluate((n) => n.scrollLeft)) <= 0)
              throw new Error('Shadow keyboard scrolling unavailable');
          }
          for (const edge of ['left', 'right']) {
            await scroll.evaluate((n, edge) => {
              n.scrollLeft = edge === 'left' ? 0 : n.scrollWidth;
            }, edge);
            await p.screenshot({
              path: `/tmp/butler-bnu-shadow-${variant}-${english ? 'en' : 'zh'}-${i}-${edge}-${width}.png`,
            });
          }
          await scroll.evaluate((n) => {
            n.scrollLeft = 0;
          });
        }
        if (
          await p.evaluate(
            () => document.documentElement.scrollWidth > innerWidth + 1,
          )
        )
          throw new Error('Shadow overflows whole page');
      }
      async function inspectAddition(variant) {
        const diagram = p.locator('[data-teen-addition-table]');
        if (
          (await diagram.locator('[data-teen-addition-blank]').count()) !==
            26 ||
          (await diagram.locator('[data-teen-addition-given]').count()) !== 10
        )
          throw new Error('Incomplete table geometry');
        const labels = await diagram
          .locator('[data-teen-addition-blank]')
          .allTextContents();
        if (
          labels.map((s) => s.trim()).join('') !== 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        )
          throw new Error('Table letters lost');
        const totals = await diagram
          .locator('[data-teen-addition-row]')
          .allTextContents();
        if (totals.map((s) => s.trim()).join(',') !== '11,12,13,14,15,16,17,18')
          throw new Error('Table rows changed');
        const scroll = diagram.locator('[data-teen-addition-scroll]');
        await scroll.scrollIntoViewIfNeeded();
        const size = await scroll.evaluate((n) => ({
          viewport: n.clientWidth,
          content: n.scrollWidth,
        }));
        if (size.content > size.viewport) {
          await scroll.focus();
          await scroll.press('ArrowRight');
          await p.waitForTimeout(250);
          if ((await scroll.evaluate((n) => n.scrollLeft)) <= 0)
            throw new Error('Table keyboard scroll unavailable');
        }
        await scroll.evaluate((n) => {
          n.scrollLeft = 0;
        });
        await p.screenshot({
          path: `/tmp/butler-bnu-addition-${variant}-left-${width}.png`,
        });
        await scroll.evaluate((n) => {
          n.scrollLeft = n.scrollWidth;
        });
        await p.waitForTimeout(100);
        await p.screenshot({
          path: `/tmp/butler-bnu-addition-${variant}-right-${width}.png`,
        });
        const font = await diagram
          .locator('[data-teen-addition-blank]')
          .first()
          .evaluate((n) => Number.parseFloat(getComputedStyle(n).fontSize));
        if (font < 20) throw new Error('Table type too small');
        const textFits = await diagram
          .locator('.ant-table-cell')
          .evaluateAll((nodes) =>
            nodes.every((n) => {
              const range = document.createRange();
              range.selectNodeContents(n);
              const text = range.getBoundingClientRect();
              const box = n.getBoundingClientRect();
              return (
                text.left >= box.left - 1 &&
                text.right <= box.right + 1 &&
                text.top >= box.top - 1 &&
                text.bottom <= box.bottom + 1
              );
            }),
          );
        if (!textFits) throw new Error('Table text overflows a cell');
        if (
          await p.evaluate(
            () => document.documentElement.scrollWidth > innerWidth + 1,
          )
        )
          throw new Error('Table overflows whole page');
        await scroll.evaluate((n) => {
          n.scrollLeft = 0;
        });
      }
      async function inspectStairs(variant) {
        const diagram = p.locator('[data-teen-stairs]');
        const svg = diagram.locator('svg');
        await svg.waitFor();
        await p
          .locator('.ant-notification-notice')
          .first()
          .waitFor({ state: 'hidden' });
        if (
          (await diagram.locator('[data-stair-marker]').count()) !== 13 ||
          (await diagram.locator('[data-stair-given]').count()) !== 10
        )
          throw new Error('Stair geometry count');
        if (
          (await diagram
            .locator('[data-stair-marker]')
            .evaluateAll((nodes) =>
              nodes.map((n) => n.dataset.stairMarker).join(''),
            )) !== 'ABCDEFGHI'
        )
          throw new Error('Stair identities');
        const geometry = await svg.evaluate((node) =>
          [...node.querySelectorAll('text')].map((n) => {
            const r = n.getBBox();
            return {
              font: Number.parseFloat(getComputedStyle(n).fontSize),
              inside:
                r.x >= 0 &&
                r.y >= 0 &&
                r.x + r.width <= 1120 &&
                r.y + r.height <= 590,
            };
          }),
        );
        if (geometry.some((g) => g.font < 20 || !g.inside))
          throw new Error('Stair text size or canvas clipping');
        await svg.evaluate((n) => n.scrollIntoView({ block: 'center' }));
        await p.waitForTimeout(200);
        const scroll = diagram.locator('[data-teen-stairs-scroll]');
        await scroll.focus();
        const before = await scroll.evaluate((n) => n.scrollLeft);
        await p.keyboard.press('ArrowRight');
        await p.waitForTimeout(200);
        if (
          await scroll.evaluate(
            (n) => n.scrollWidth > n.clientWidth && n.scrollLeft === 0,
          )
        )
          throw new Error('Stair keyboard scroll');
        await scroll.evaluate((n) => {
          n.scrollLeft = 0;
        });
        await p.screenshot({
          path: `/tmp/butler-bnu-practice-${variant}-left-${width}.png`,
        });
        await scroll.evaluate((n) => {
          n.scrollLeft = 280;
        });
        await p.waitForTimeout(200);
        await p.screenshot({
          path: `/tmp/butler-bnu-practice-${variant}-middle-${width}.png`,
        });
        await scroll.evaluate((n) => {
          n.scrollLeft = n.scrollWidth;
        });
        await p.waitForTimeout(200);
        await p.screenshot({
          path: `/tmp/butler-bnu-practice-${variant}-right-${width}.png`,
        });
        if (
          await p.evaluate(
            () => document.documentElement.scrollWidth > innerWidth + 1,
          )
        )
          throw new Error('Stairs overflow whole page');
        await scroll.evaluate((n, left) => {
          n.scrollLeft = left;
        }, before);
      }
      if (flow.key === 'practice') {
        await inspectStairs('main');
        const state = JSON.stringify(await read());
        await p
          .locator('button[aria-haspopup="menu"]')
          .filter({ has: p.locator('svg.lucide-languages') })
          .click();
        await p.getByText('English', { exact: true }).click();
        await p
          .getByText(
            'Count horizontal treads from level 1 at the lower left toward the upper right. A–I replace the nine source figures; their levels are not printed directly. Other level numbers remain as references. This diagram does not request climbing real stairs.',
            { exact: true },
          )
          .waitFor();
        const dark = await p.evaluate(() =>
          document.documentElement.classList.contains('dark'),
        );
        await p.locator('.theme-toggle svg').click();
        await p.waitForFunction(
          (was) => document.documentElement.classList.contains('dark') !== was,
          dark,
        );
        await p.waitForTimeout(500);
        await inspectStairs('english-theme');
        await p.locator('.theme-toggle svg').click();
        await p.waitForFunction(
          (was) => document.documentElement.classList.contains('dark') === was,
          dark,
        );
        await p.waitForTimeout(500);
        await p
          .locator('button[aria-haspopup="menu"]')
          .filter({ has: p.locator('svg.lucide-languages') })
          .click();
        await p.getByText('简体中文', { exact: true }).click();
        await p
          .getByText(
            '从左下第1级逐级向右上数，每个水平踏面算一级。本站A～I替代原九个图形，字母位置不直接写级数；其它踏面的数字保留作参照。图示不安排实际登台阶活动。',
            { exact: true },
          )
          .waitFor();
        if (JSON.stringify(await read()) !== state)
          throw new Error('Stairs language/theme changed learning records');
      }
      for (
        let step = 0;
        step < (flow.steps || (flow.key === 'practice' ? 8 : 7)) - 1;
        step++
      ) {
        await click('下一步');
        await wait(
          (d) => d.sessions.find((s) => s.id === sid).step === step + 1,
        );
        if (flow.key === 'addition' && step === 0) {
          await inspectAddition('main');
          const state = JSON.stringify(await read());
          await p
            .locator('button[aria-haspopup="menu"]')
            .filter({ has: p.locator('svg.lucide-languages') })
            .click();
          await p.getByText('English', { exact: true }).click();
          await p.getByText('Position 8', { exact: true }).waitFor();
          const dark = await p.evaluate(() =>
            document.documentElement.classList.contains('dark'),
          );
          await p.locator('.theme-toggle svg').click();
          await p.waitForFunction(
            (was) =>
              document.documentElement.classList.contains('dark') !== was,
            dark,
          );
          await p.waitForTimeout(500);
          await inspectAddition('english-theme');
          await p.locator('.theme-toggle svg').click();
          await p.waitForFunction(
            (was) =>
              document.documentElement.classList.contains('dark') === was,
            dark,
          );
          await p.waitForTimeout(500);
          await p
            .locator('button[aria-haspopup="menu"]')
            .filter({ has: p.locator('svg.lucide-languages') })
            .click();
          await p.getByText('简体中文', { exact: true }).click();
          await p.getByText('位置8', { exact: true }).waitFor();
          if (JSON.stringify(await read()) !== state)
            throw new Error('Table language/theme changed learning records');
        }
      }
      await p.screenshot({
        path: `/tmp/butler-bnu-lower-${flow.key}-step-${width}.png`,
      });
      await click('开始练习');
      await wait(
        (d) => d.sessions.find((s) => s.id === sid).phase === 'practice',
      );
      while (true) {
        session = await current();
        const index = session.questionIndex;
        const q = session.questions[index];
        await p.getByText(q.prompt, { exact: true }).waitFor();
        if (
          q.id === 'bnu-lower-building-blocks-actual-counter' &&
          (!q.prompt.includes('拨入个位5颗') || q.prompt.includes('拨去'))
        )
          throw new Error('Actual counter task used wrong operation');
        if (flow.key === 'classroom' && q.id.endsWith('-three-next-7')) {
          await inspectClassroomPattern('main');
          const state = JSON.stringify(await read());
          await p
            .locator('button[aria-haspopup="menu"]')
            .filter({ has: p.locator('svg.lucide-languages') })
            .click();
          await p.getByText('English', { exact: true }).click();
          await p
            .locator('[data-periodic-shapes]')
            .getByText(/^This diagram explicitly repeats/)
            .waitFor();
          const dark = await p.evaluate(() =>
            document.documentElement.classList.contains('dark'),
          );
          await p.locator('.theme-toggle svg').click();
          await p.waitForFunction(
            (was) =>
              document.documentElement.classList.contains('dark') !== was,
            dark,
          );
          await p.waitForTimeout(500);
          await inspectClassroomPattern('main-en');
          await p.locator('.theme-toggle svg').click();
          await p.waitForFunction(
            (was) =>
              document.documentElement.classList.contains('dark') === was,
            dark,
          );
          await p.waitForTimeout(500);
          await p
            .locator('button[aria-haspopup="menu"]')
            .filter({ has: p.locator('svg.lucide-languages') })
            .click();
          await p.getByText('简体中文', { exact: true }).click();
          await p
            .locator('[data-periodic-shapes]')
            .getByText(/^本图已明确从左起/)
            .waitFor();
          if (JSON.stringify(await read()) !== state)
            throw new Error('Pattern language/theme changed learning records');
        }
        if (q.id.endsWith('-bigger') && flow.key === 'shadow') {
          await inspectShadow('main');
          const state = JSON.stringify(await read());
          await p
            .locator('button[aria-haspopup="menu"]')
            .filter({ has: p.locator('svg.lucide-languages') })
            .click();
          await p.getByText('English', { exact: true }).click();
          await p
            .locator('[data-shadow-size]')
            .getByText(/The point light on the left/)
            .waitFor();
          const dark = await p.evaluate(() =>
            document.documentElement.classList.contains('dark'),
          );
          await p.locator('.theme-toggle svg').click();
          await p.waitForFunction(
            (was) =>
              document.documentElement.classList.contains('dark') !== was,
            dark,
          );
          await p.waitForTimeout(500);
          await inspectShadow('main', true);
          const labelFits = await p
            .locator('[data-shadow-size] span')
            .evaluateAll((nodes) =>
              nodes.every((n) => {
                const r = document.createRange();
                r.selectNodeContents(n);
                const a = r.getBoundingClientRect();
                const b = n.getBoundingClientRect();
                return a.left >= b.left - 1 && a.right <= b.right + 1;
              }),
            );
          if (!labelFits) throw new Error('English shadow legend overflows');
          await p.locator('.theme-toggle svg').click();
          await p.waitForFunction(
            (was) =>
              document.documentElement.classList.contains('dark') === was,
            dark,
          );
          await p.waitForTimeout(500);
          await p
            .locator('button[aria-haspopup="menu"]')
            .filter({ has: p.locator('svg.lucide-languages') })
            .click();
          await p.getByText('简体中文', { exact: true }).click();
          await p
            .locator('[data-shadow-size]')
            .getByText(/左边点光源和右边屏固定/)
            .waitFor();
          if (JSON.stringify(await read()) !== state)
            throw new Error(
              'Shadow language or theme changed learning records',
            );
        }
        if (q.rule.kind === 'manual') await click('暂时跳过');
        else if (q.rule.kind === 'reflection') {
          await p
            .getByRole('textbox', { name: '我的学习反思', exact: true })
            .fill('隔离验收：尚未实际操作，计划单独记录。');
          await click('保存反思');
        } else {
          if (q.rule.kind === 'number') {
            if (q.id.endsWith(flow.zero)) {
              await p.getByRole('spinbutton').fill('0');
              await wait(
                (d) =>
                  d.sessions.find((s) => s.id === sid).responses[index]
                    .draft === 0,
              );
              await p.reload({ waitUntil: 'networkidle' });
              if ((await p.getByRole('spinbutton').inputValue()) !== '0')
                throw new Error('Zero draft lost');
            }
            if (q.id.endsWith(flow.retry)) {
              await p.getByRole('spinbutton').fill('3');
              await click('提交答案');
              await p
                .getByText('再想一想，可以修改后重试', { exact: true })
                .waitFor();
            }
            await p.getByRole('spinbutton').fill(String(q.rule.value));
          } else if (q.rule.kind === 'number-picks') {
            await p.getByRole('spinbutton').first().fill('5');
            await wait(
              (d) =>
                JSON.stringify(
                  d.sessions.find((s) => s.id === sid).responses[index].draft,
                ) === '[5,null,null]',
            );
            await p.reload({ waitUntil: 'networkidle' });
            const values = await p
              .getByRole('spinbutton')
              .evaluateAll((nodes) => nodes.map((n) => n.value));
            if (JSON.stringify(values) !== '["5","",""]')
              throw new Error('Inequality partial draft lost');
            await p
              .getByRole('spinbutton')
              .nth(1)
              .evaluate((n) => n.scrollIntoView({ block: 'center' }));
            await p.waitForTimeout(200);
            const fields = await p
              .getByRole('spinbutton')
              .evaluateAll((nodes) =>
                nodes.map((n) => {
                  const r = n
                    .closest('.ant-input-number')
                    .getBoundingClientRect();
                  return {
                    height: r.height,
                    font: Number.parseFloat(getComputedStyle(n).fontSize),
                    fits:
                      r.left >= 0 &&
                      r.right <= innerWidth &&
                      r.top >= 0 &&
                      r.bottom <= innerHeight,
                  };
                }),
              );
            if (fields.some((f) => f.height < 44 || f.font < 20 || !f.fits))
              throw new Error('Inequality fields size or viewport');
            await p.screenshot({
              path: `/tmp/butler-bnu-practice-fields-${width}.png`,
            });
            for (const [i, v] of [4, 7, 14].entries())
              await p.getByRole('spinbutton').nth(i).fill(String(v));
            await click('提交答案');
            await p
              .getByText('再想一想，可以修改后重试', { exact: true })
              .waitFor();
            for (const [i, v] of [12, 15, 13].entries())
              await p.getByRole('spinbutton').nth(i).fill(String(v));
          } else if (q.rule.kind === 'arithmetic-pair') {
            await p.getByRole('spinbutton').nth(0).fill('0');
            await wait(
              (d) =>
                JSON.stringify(
                  d.sessions.find((s) => s.id === sid).responses[index].draft,
                ) === '[0,null]',
            );
            await p.reload({ waitUntil: 'networkidle' });
            const inputs = await p
              .getByRole('spinbutton')
              .evaluateAll((nodes) => nodes.map((n) => n.value));
            if (JSON.stringify(inputs) !== '["0",""]')
              throw new Error('Empty-house partial draft lost');
            await p.getByRole('spinbutton').nth(0).fill('5');
            await p.getByRole('spinbutton').nth(1).fill('6');
            await click('提交答案');
            await p
              .getByText('再想一想，可以修改后重试', { exact: true })
              .waitFor();
            await p.getByRole('spinbutton').nth(1).fill('7');
          } else if (q.rule.kind === 'steps') {
            if (flow.key === 'pencils' && q.id.endsWith('-one-by-one')) {
              await p.getByRole('spinbutton').first().fill('11');
              await wait(
                (d) =>
                  JSON.stringify(
                    d.sessions.find((s) => s.id === sid).responses[index].draft,
                  ) === '[11,null,null,null,null,null,null]',
              );
              await p.reload({ waitUntil: 'networkidle' });
              const draft = await p
                .getByRole('spinbutton')
                .evaluateAll((nodes) => nodes.map((n) => n.value));
              if (JSON.stringify(draft) !== '["11","","","","","",""]')
                throw new Error('Seven subtraction drafts lost');
              for (let i = 0; i < 7; i++) {
                const input = p.getByRole('spinbutton').nth(i);
                await input.evaluate((n) =>
                  n.scrollIntoView({ block: 'center' }),
                );
                const size = await input.evaluate((n) => {
                  const r = n
                    .closest('.ant-input-number')
                    .getBoundingClientRect();
                  return {
                    font: Number.parseFloat(getComputedStyle(n).fontSize),
                    height: r.height,
                    fits:
                      r.left >= 0 &&
                      r.right <= innerWidth &&
                      r.top >= 0 &&
                      r.bottom <= innerHeight,
                  };
                });
                if (size.font < 20 || size.height < 44 || !size.fits)
                  throw new Error('Subtraction input size or clipping');
                if (i === 0 || i === 6)
                  await p.screenshot({
                    path: `/tmp/butler-bnu-pencils-input-${i}-${width}.png`,
                  });
                await input.fill(String(12 - i));
              }
              await click('提交答案');
              await p
                .getByText('再想一想，可以修改后重试', { exact: true })
                .waitFor();
            }
            if (q.id === 'bnu-lower-ancient-count-one-source-parts-blocks') {
              await p.getByRole('spinbutton').first().fill('10');
              await wait(
                (d) =>
                  JSON.stringify(
                    d.sessions.find((s) => s.id === sid).responses[index].draft,
                  ) === '[10,null,null]',
              );
              await p.reload({ waitUntil: 'networkidle' });
              const values = await p
                .getByRole('spinbutton')
                .evaluateAll((nodes) => nodes.map((n) => n.value));
              if (JSON.stringify(values) !== '["10","",""]')
                throw new Error('Unit-block grouping partial draft lost');
              await p
                .getByRole('spinbutton')
                .nth(1)
                .evaluate((n) => n.scrollIntoView({ block: 'center' }));
              await p.waitForTimeout(200);
              const geometry = await p
                .getByRole('spinbutton')
                .evaluateAll((nodes) =>
                  nodes.map((n) => {
                    const r = n
                      .closest('.ant-input-number')
                      .getBoundingClientRect();
                    return {
                      height: r.height,
                      font: Number.parseFloat(getComputedStyle(n).fontSize),
                      fits:
                        r.left >= 0 &&
                        r.right <= innerWidth &&
                        r.top >= 0 &&
                        r.bottom <= innerHeight,
                    };
                  }),
                );
              if (geometry.some((f) => f.height < 44 || f.font < 20 || !f.fits))
                throw new Error('Unit-block grouping fields outside viewport');
              await p.screenshot({
                path: `/tmp/butler-bnu-count-fields-${width}.png`,
              });
              for (const [i, v] of [1, 8, 18].entries())
                await p.getByRole('spinbutton').nth(i).fill(String(v));
              await click('提交答案');
              await p
                .getByText('再想一想，可以修改后重试', { exact: true })
                .waitFor();
            }
            if (q.id === 'bnu-lower-building-blocks-counter-path') {
              await p.getByRole('spinbutton').first().fill('3');
              await wait(
                (d) =>
                  JSON.stringify(
                    d.sessions.find((s) => s.id === sid).responses[index].draft,
                  ) === '[3,null,null,null]',
              );
              await p.reload({ waitUntil: 'networkidle' });
              const values = await p
                .getByRole('spinbutton')
                .evaluateAll((nodes) => nodes.map((n) => n.value));
              if (JSON.stringify(values) !== '["3","","",""]')
                throw new Error('Counter partial process draft lost');
              await p
                .getByRole('spinbutton')
                .nth(1)
                .evaluate((n) => n.scrollIntoView({ block: 'center' }));
              await p.waitForTimeout(200);
              const geometry = await p
                .getByRole('spinbutton')
                .evaluateAll((nodes) =>
                  nodes.map((n) => {
                    const r = n
                      .closest('.ant-input-number')
                      .getBoundingClientRect();
                    return {
                      height: r.height,
                      font: Number.parseFloat(getComputedStyle(n).fontSize),
                      fits:
                        r.left >= 0 &&
                        r.right <= innerWidth &&
                        r.top >= 0 &&
                        r.bottom <= innerHeight,
                    };
                  }),
                );
              if (geometry.some((f) => f.height < 44 || f.font < 20 || !f.fits))
                throw new Error('Counter fields outside viewport');
              await p.screenshot({
                path: `/tmp/butler-bnu-counter-fields-${width}.png`,
              });
              for (const [i, v] of [3, 5, 8, 9].entries())
                await p.getByRole('spinbutton').nth(i).fill(String(v));
              await click('提交答案');
              await p
                .getByText('再想一想，可以修改后重试', { exact: true })
                .waitFor();
            }
            if (q.id === 'bnu-lower-rabbit-homes-source-first-0') {
              await p.getByRole('spinbutton').first().fill('2');
              await wait(
                (d) =>
                  JSON.stringify(
                    d.sessions.find((s) => s.id === sid).responses[index].draft,
                  ) === '[2,null,null,null]',
              );
              await p.reload({ waitUntil: 'networkidle' });
              const values = await p
                .getByRole('spinbutton')
                .evaluateAll((nodes) => nodes.map((n) => n.value));
              if (JSON.stringify(values) !== '["2","","",""]')
                throw new Error('Source first-addend partial draft lost');
              await p
                .getByRole('spinbutton')
                .nth(1)
                .evaluate((n) => n.scrollIntoView({ block: 'center' }));
              await p.waitForTimeout(200);
              const geometry = await p
                .getByRole('spinbutton')
                .evaluateAll((nodes) =>
                  nodes.map((n) => {
                    const r = n
                      .closest('.ant-input-number')
                      .getBoundingClientRect();
                    return {
                      height: r.height,
                      font: Number.parseFloat(getComputedStyle(n).fontSize),
                      fits:
                        r.left >= 0 &&
                        r.right <= innerWidth &&
                        r.top >= 0 &&
                        r.bottom <= innerHeight,
                    };
                  }),
                );
              if (geometry.some((f) => f.height < 44 || f.font < 20 || !f.fits))
                throw new Error('Source first-addend fields outside viewport');
              await p.screenshot({
                path: `/tmp/butler-bnu-source-first-fields-${width}.png`,
              });
              for (const [i, v] of [2, 2, 10, 12].entries())
                await p.getByRole('spinbutton').nth(i).fill(String(v));
              await click('提交答案');
              await p
                .getByText('再想一想，可以修改后重试', { exact: true })
                .waitFor();
            }
            if (flow.key === 'harvest' && q.id.endsWith('-seven-path')) {
              await p.getByRole('spinbutton').first().fill('3');
              await wait(
                (d) =>
                  JSON.stringify(
                    d.sessions.find((s) => s.id === sid).responses[index].draft,
                  ) === '[3,null,null,null]',
              );
              await p.reload({ waitUntil: 'networkidle' });
              const values = await p
                .getByRole('spinbutton')
                .evaluateAll((nodes) => nodes.map((n) => n.value));
              if (JSON.stringify(values) !== '["3","","",""]')
                throw new Error('Harvest partial decomposition lost');
              await p
                .getByRole('spinbutton')
                .nth(1)
                .evaluate((n) => n.scrollIntoView({ block: 'center' }));
              await p.waitForTimeout(200);
              const geometry = await p
                .getByRole('spinbutton')
                .evaluateAll((nodes) =>
                  nodes.map((n) => {
                    const r = n
                      .closest('.ant-input-number')
                      .getBoundingClientRect();
                    return {
                      height: r.height,
                      font: Number.parseFloat(getComputedStyle(n).fontSize),
                      fits:
                        r.left >= 0 &&
                        r.right <= innerWidth &&
                        r.top >= 0 &&
                        r.bottom <= innerHeight,
                    };
                  }),
                );
              if (geometry.some((f) => f.height < 44 || f.font < 20 || !f.fits))
                throw new Error(
                  'Harvest decomposition fields size or viewport',
                );
              await p.screenshot({
                path: `/tmp/butler-bnu-harvest-fields-${width}.png`,
              });
              for (const [i, v] of [2, 5, 10, 15].entries())
                await p.getByRole('spinbutton').nth(i).fill(String(v));
              await click('提交答案');
              await p
                .getByText('再想一想，可以修改后重试', { exact: true })
                .waitFor();
            }
            if (q.id.endsWith('-horizontal')) {
              await p.getByRole('spinbutton').first().fill('9');
              await wait(
                (d) =>
                  JSON.stringify(
                    d.sessions.find((s) => s.id === sid).responses[index].draft,
                  ) === '[9,null,null,null,null,null,null,null]',
              );
              await p.reload({ waitUntil: 'networkidle' });
              const fields = await p
                .getByRole('spinbutton')
                .evaluateAll((nodes) => nodes.map((n) => n.value));
              if (JSON.stringify(fields) !== '["9","","","","","","",""]')
                throw new Error('Eight-field table draft lost');
              await p
                .getByRole('spinbutton')
                .nth(3)
                .evaluate((n) => n.scrollIntoView({ block: 'center' }));
              await p.waitForTimeout(200);
              const sizes = await p
                .getByRole('spinbutton')
                .evaluateAll((nodes) =>
                  nodes.map((n) => {
                    const r = n
                      .closest('.ant-input-number')
                      .getBoundingClientRect();
                    return {
                      height: r.height,
                      font: Number.parseFloat(getComputedStyle(n).fontSize),
                      fits:
                        r.left >= 0 &&
                        r.right <= innerWidth &&
                        r.top >= 0 &&
                        r.bottom <= innerHeight,
                    };
                  }),
                );
              if (sizes.some((f) => f.height < 44 || f.font < 20 || !f.fits))
                throw new Error('Eight table inputs size or viewport');
              await p.screenshot({
                path: `/tmp/butler-bnu-addition-fields-${width}.png`,
              });
            }
            if (q.id.endsWith('-blank-A')) {
              await p.getByRole('spinbutton').nth(0).fill('5');
              await p.getByRole('spinbutton').nth(1).fill('6');
              await click('提交答案');
              await p
                .getByText('再想一想，可以修改后重试', { exact: true })
                .waitFor();
            }
            if (q.id.endsWith('-eleven-partners')) {
              await p.getByRole('spinbutton').first().fill('10');
              await wait(
                (d) =>
                  JSON.stringify(
                    d.sessions.find((s) => s.id === sid).responses[index].draft,
                  ) === '[10,null,null,null,null]',
              );
              await p.reload({ waitUntil: 'networkidle' });
              const values = await p
                .getByRole('spinbutton')
                .evaluateAll((nodes) => nodes.map((n) => n.value));
              if (JSON.stringify(values) !== '["10","","","",""]')
                throw new Error('Five partner blanks changed');
              await p
                .getByRole('spinbutton')
                .nth(2)
                .evaluate((n) => n.scrollIntoView({ block: 'center' }));
              await p.waitForTimeout(200);
              const fields = await p
                .getByRole('spinbutton')
                .evaluateAll((nodes) =>
                  nodes.map((n) => {
                    const rect = n
                      .closest('.ant-input-number')
                      .getBoundingClientRect();
                    return {
                      height: rect.height,
                      font: Number.parseFloat(getComputedStyle(n).fontSize),
                      fits:
                        rect.left >= 0 &&
                        rect.right <= innerWidth &&
                        rect.top >= 0 &&
                        rect.bottom <= innerHeight,
                    };
                  }),
                );
              if (fields.some((f) => f.height < 44 || f.font < 20 || !f.fits))
                throw new Error('Partner fields size or viewport');
              await p.screenshot({
                path: `/tmp/butler-bnu-rabbits-partners-${width}.png`,
              });
            }
            if (q.id.endsWith('-nine-first')) {
              await p.getByRole('spinbutton').nth(0).fill('1');
              await wait(
                (d) =>
                  JSON.stringify(
                    d.sessions.find((s) => s.id === sid).responses[index].draft,
                  ) === '[1,null,null,null]',
              );
              await p.reload({ waitUntil: 'networkidle' });
              const inputs = await p
                .getByRole('spinbutton')
                .evaluateAll((nodes) => nodes.map((n) => n.value));
              if (JSON.stringify(inputs) !== '["1","","",""]')
                throw new Error('Partial method draft changed');
              const sizes = await p
                .getByRole('spinbutton')
                .evaluateAll((nodes) =>
                  nodes.map((n) => ({
                    height: n
                      .closest('.ant-input-number')
                      .getBoundingClientRect().height,
                    font: Number.parseFloat(getComputedStyle(n).fontSize),
                  })),
                );
              if (sizes.some((s) => s.height < 44 || s.font < 20))
                throw new Error('Method inputs below child size requirements');
              await p
                .getByRole('spinbutton')
                .nth(1)
                .evaluate((element) =>
                  element.scrollIntoView({ block: 'center' }),
                );
              await p.waitForTimeout(200);
              const inView = await p
                .getByRole('spinbutton')
                .evaluateAll((nodes) =>
                  nodes.every((element) => {
                    const box = element.getBoundingClientRect();
                    return (
                      box.left >= 0 &&
                      box.right <= innerWidth &&
                      box.top >= 0 &&
                      box.bottom <= innerHeight
                    );
                  }),
                );
              if (!inView)
                throw new Error(
                  'Four method inputs do not fit the actual viewport',
                );
              await p.screenshot({
                path: `/tmp/butler-bnu-farm-method-${width}.png`,
              });
              for (let field = 0; field < 4; field++)
                await p
                  .getByRole('spinbutton')
                  .nth(field)
                  .fill(String([1, 5, 10, 14][field]));
              await click('提交答案');
              await p
                .getByText('再想一想，可以修改后重试', { exact: true })
                .waitFor();
            }
            for (let field = 0; field < q.rule.values.length; field++)
              await p
                .getByRole('spinbutton')
                .nth(field)
                .fill(String(q.rule.values[field]));
          } else if (q.rule.kind === 'set') {
            if (q.id.endsWith('-result-twelve')) {
              if ((await p.getByRole('checkbox').count()) !== 28)
                throw new Error('Incomplete expression card set');
              const first = q.choices.find((o) => o.id === 'result-twelve-4');
              await p
                .getByRole('checkbox', { name: first.label, exact: true })
                .check();
              await wait(
                (d) =>
                  JSON.stringify(
                    d.sessions.find((s) => s.id === sid).responses[index].draft,
                  ) === '["result-twelve-4"]',
              );
              await p.reload({ waitUntil: 'networkidle' });
              if (
                !(await p
                  .getByRole('checkbox', { name: first.label, exact: true })
                  .isChecked())
              )
                throw new Error('Partial card selection lost');
              await click('提交答案');
              await p
                .getByText('再想一想，可以修改后重试', { exact: true })
                .waitFor();
              await p.getByRole('checkbox').first().scrollIntoViewIfNeeded();
              await p.screenshot({
                path: `/tmp/butler-bnu-chores-cards-start-${width}.png`,
              });
              await p.getByRole('checkbox').last().scrollIntoViewIfNeeded();
              await p.screenshot({
                path: `/tmp/butler-bnu-chores-cards-end-${width}.png`,
              });
            }
            for (const value of q.rule.values) {
              const option = q.choices.find((o) => o.id === value);
              await p
                .getByRole('checkbox', { name: option.label, exact: true })
                .check();
            }
          } else if (q.rule.kind === 'sequence') {
            for (const [field, value] of q.rule.values.entries()) {
              const input = p.getByRole('combobox', {
                name: `第${field + 1}项`,
                exact: true,
              });
              await input.evaluate((n) =>
                n.closest('.ant-select').scrollIntoView({ block: 'center' }),
              );
              await input.focus();
              await input.press('ArrowDown');
              await p.waitForTimeout(350);
              const label = q.choices.find((o) => o.id === value).label;
              await p
                .locator(
                  '.ant-select-dropdown:visible .ant-select-item-option-content',
                )
                .filter({ hasText: new RegExp(`^${label}$`) })
                .click();
              await p
                .locator('.ant-select-dropdown:visible')
                .waitFor({ state: 'hidden' });
              if (field === 0) {
                await wait(
                  (d) =>
                    d.sessions.find((s) => s.id === sid).responses[index]
                      .draft?.[0] === value,
                );
                await p.reload({ waitUntil: 'networkidle' });
                if (
                  (await input.evaluate((n) =>
                    n
                      .closest('.ant-select')
                      ?.querySelector('.ant-select-selection-item')
                      ?.textContent?.trim(),
                  )) !== label
                )
                  throw new Error('Partial sequence draft lost');
              }
            }
          } else if (q.rule.kind === 'choice') {
            if (q.id.endsWith(flow.retry)) {
              const wrong = q.choices.find((o) => o.id !== q.rule.value);
              await p
                .getByRole('radio', { name: wrong.label, exact: true })
                .check();
              await wait(
                (d) =>
                  d.sessions.find((s) => s.id === sid).responses[index]
                    .draft === wrong.id,
              );
              await p.reload({ waitUntil: 'networkidle' });
              if (
                !(await p
                  .getByRole('radio', { name: wrong.label, exact: true })
                  .isChecked())
              )
                throw new Error('Choice draft lost');
              await click('提交答案');
              await p
                .getByText('再想一想，可以修改后重试', { exact: true })
                .waitFor();
            }
            const label =
              q.choices?.find((o) => o.id === q.rule.value)?.label ||
              q.rule.value;
            await p.getByRole('radio', { name: label, exact: true }).check();
          } else throw new Error(`Unhandled ${q.rule.kind}`);
          await click('提交答案');
          await p.getByText('答对了', { exact: true }).waitFor();
        }
        if (index === session.questions.length - 1) break;
        if (q.rule.kind !== 'manual') await click('下一题');
        await wait(
          (d) =>
            d.sessions.find((s) => s.id === sid).questionIndex === index + 1,
        );
      }
      await click('完成并保存记录');
      await p.getByText('本次学习已完成', { exact: true }).waitFor();
      session = await current();
      if (session.responses.filter((r) => r.skipped).length !== flow.manual)
        throw new Error('Physical activity must remain skipped');
      const retry = session.responses.find((r) =>
        r.questionId.endsWith(flow.retry),
      );
      if (
        JSON.stringify(retry.submissions.map((s) => s.correct)) !==
        '[false,true]'
      )
        throw new Error('Retry history changed');
      if (flow.key === 'practice') {
        const inequalities = session.responses.find(
          (r) => r.questionId === 'bnu-lower-unit-one-practice-inequalities',
        );
        if (
          JSON.stringify(
            inequalities.submissions.map((s) => [s.answer, s.correct]),
          ) !== '[[[4,7,14],false],[[12,15,13],true]]'
        )
          throw new Error('Inequality retry history changed');
      }
      if (flow.key === 'harvest') {
        const decomposition = session.responses.find((r) =>
          r.questionId.endsWith('-seven-path'),
        );
        if (
          JSON.stringify(
            decomposition.submissions.map((s) => [s.answer, s.correct]),
          ) !== '[[[2,5,10,15],false],[[3,5,10,15],true]]'
        )
          throw new Error('Harvest two-path retry history changed');
      }
      if (flow.key === 'addition') {
        const cell = session.responses.find((r) =>
          r.questionId.endsWith('-blank-A'),
        );
        if (
          JSON.stringify(cell.submissions.map((s) => [s.answer, s.correct])) !==
          '[[[5,6],false],[[6,5],true]]'
        )
          throw new Error('Position order retry history lost');
      }
      if (flow.key === 'count') {
        if (session.lessonVersion !== 2)
          throw new Error('Source count course version did not advance');
        const grouping = session.responses.find(
          (r) =>
            r.questionId === 'bnu-lower-ancient-count-one-source-parts-blocks',
        );
        if (
          JSON.stringify(
            grouping.submissions.map((s) => [s.answer, s.correct]),
          ) !== '[[[1,8,18],false],[[10,8,18],true]]'
        )
          throw new Error('Unit-block grouping retry history changed');
      }
      if (flow.key === 'blocks') {
        if (session.lessonVersion !== 2)
          throw new Error('Counter course version did not advance');
        const process = session.responses.find(
          (r) => r.questionId === 'bnu-lower-building-blocks-counter-path',
        );
        if (
          JSON.stringify(
            process.submissions.map((s) => [s.answer, s.correct]),
          ) !== '[[[3,5,8,9],false],[[3,5,8,18],true]]'
        )
          throw new Error('Counter material/value retry history changed');
      }
      if (flow.key === 'rabbits') {
        if (session.lessonVersion !== 2)
          throw new Error('Rabbit course version did not advance');
        const decomposition = session.responses.find(
          (r) => r.questionId === 'bnu-lower-rabbit-homes-source-first-0',
        );
        if (
          JSON.stringify(
            decomposition.submissions.map((s) => [s.answer, s.correct]),
          ) !== '[[[2,2,10,12],false],[[2,6,10,12],true]]'
        )
          throw new Error('Source first-addend retry history changed');
        const homes = session.responses.find((r) =>
          r.questionId.endsWith('-two-homes'),
        );
        if (
          JSON.stringify(
            homes.submissions.map((s) => [s.answer, s.correct]),
          ) !== '[[[5,6],false],[[5,7],true]]'
        )
          throw new Error('House allocation retry history lost');
      }
      if (flow.key === 'chores') {
        const category = session.responses.find((r) =>
          r.questionId.endsWith('-result-twelve'),
        );
        if (
          JSON.stringify(category.submissions.map((s) => s.correct)) !==
          '[false,true]'
        )
          throw new Error('Classification retry history lost');
      }
      if (flow.key === 'farm') {
        const method = session.responses.find((r) =>
          r.questionId.endsWith('-nine-first'),
        );
        if (
          JSON.stringify(
            method.submissions.map((s) => [s.answer, s.correct]),
          ) !==
          JSON.stringify([
            [[1, 5, 10, 14], false],
            [[1, 4, 10, 14], true],
          ])
        )
          throw new Error('Method retry history changed');
      }

      if (
        session.responses
          .filter(
            (r) =>
              r.questionId.endsWith('-reflection') ||
              r.questionId.endsWith('-plan'),
          )
          .some((r) => r.submissions.some((s) => s.correct !== null))
      )
        throw new Error('Reflection graded');
      await click('返回课程目录');
      await click('同知识点新题');
      await wait((d) => d.sessions.length === 3);
      const reviewing = await read();
      const review = reviewing.sessions.find((s) => s.mode === 'review');
      if (
        review.questions.length !==
          (flow.review || (flow.key === 'blocks' ? 6 : 4)) ||
        review.originalSessionId !== sid
      )
        throw new Error('Review identity');
      for (let index = 0; index < review.questions.length; index++) {
        const q = review.questions[index];
        await p.getByText(q.prompt, { exact: true }).waitFor();
        if (flow.key === 'classroom' && q.id.endsWith('-review-three-7'))
          await inspectClassroomPattern('review');
        if (flow.key === 'shadow' && q.id.endsWith('-review-bigger'))
          await inspectShadow('review');
        if (flow.key === 'practice' && q.id.endsWith('-review-stair'))
          await inspectStairs('review');
        if (flow.key === 'addition' && q.id.endsWith('-review-position'))
          await inspectAddition('review');
        if (q.rule.kind === 'set') {
          for (const value of q.rule.values) {
            const option = q.choices.find((o) => o.id === value);
            await p
              .getByRole('checkbox', { name: option.label, exact: true })
              .check();
          }
        } else if (q.rule.kind === 'number-picks') {
          for (const [field, values] of q.rule.fields.entries())
            await p.getByRole('spinbutton').nth(field).fill(String(values[0]));
        } else if (q.rule.kind === 'arithmetic-pair') {
          const left = Math.max(q.rule.minimum, q.rule.result - q.rule.maximum);
          await p.getByRole('spinbutton').nth(0).fill(String(left));
          await p
            .getByRole('spinbutton')
            .nth(1)
            .fill(String(q.rule.result - left));
        } else if (q.rule.kind === 'steps') {
          for (let field = 0; field < q.rule.values.length; field++)
            await p
              .getByRole('spinbutton')
              .nth(field)
              .fill(String(q.rule.values[field]));
        } else {
          await (q.rule.kind === 'number'
            ? p.getByRole('spinbutton').fill(String(q.rule.value))
            : p
                .getByRole('radio', {
                  name:
                    q.choices?.find((o) => o.id === q.rule.value)?.label ||
                    q.rule.value,
                  exact: true,
                })
                .check());
        }
        await click('提交答案');
        await p.getByText('答对了', { exact: true }).waitFor();
        if (index < review.questions.length - 1) {
          await click('下一题');
          await wait(
            (d) =>
              d.sessions.find((s) => s.id === review.id).questionIndex ===
              index + 1,
          );
        }
      }
      await click('完成并保存记录');
      await p.getByText('本次学习已完成', { exact: true }).waitFor();
      await click('返回课程目录');
      const final = await read();
      if (JSON.stringify(final.sessions[0]) !== JSON.stringify(previous))
        throw new Error('Historical PEP session modified');
      const downloading = p.waitForEvent('download');
      await click('导出备份');
      const download = await downloading;
      const backup = JSON.parse(
        await fs.readFile(await download.path(), 'utf8'),
      );
      if (
        JSON.stringify(backup.data.sessions) !== JSON.stringify(final.sessions)
      )
        throw new Error('Backup changed records');
      await p.screenshot({
        path: `/tmp/butler-bnu-lower-${flow.key}-complete-${width}.png`,
      });
      if (errors.length > 0 || bad.length > 0 || api.length > 0)
        throw new Error(JSON.stringify({ errors, bad, api }));
      console.log(
        JSON.stringify({
          width,
          mainTasks: session.questions.length,
          reviewTasks: review.questions.length,
          skipped: flow.manual,
          zeroReload: flow.zero !== null,
          retryHistory: true,
          oldSessionUnchanged: true,
          backup: true,
        }),
      );
      await c.close();
    }
  } finally {
    if (b) await b.close();
    await new Promise((resolve) => server.close(resolve));
  }
})();
