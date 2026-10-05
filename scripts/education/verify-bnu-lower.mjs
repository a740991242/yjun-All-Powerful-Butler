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
  if (process.argv.includes('--hundred-harvest'))
    return {
      index: 29,
      lessonId: 'bnu-lower-harvest',
      zero: '-site-zero',
      retry: '-beads95',
      manual: 9,
      steps: 6,
      review: 5,
      key: 'hundred-harvest',
    };
  if (process.argv.includes('--hundred-chart'))
    return {
      index: 28,
      lessonId: 'bnu-lower-hundred-chart',
      zero: '-hundred-tens-zero',
      retry: '-fragment-58-centre',
      manual: 15,
      steps: 8,
      review: 5,
      key: 'hundred-chart',
    };
  if (process.argv.includes('--comparison-practice'))
    return {
      index: 27,
      lessonId: 'bnu-lower-comparison-practice',
      zero: '-zero-compatible',
      retry: '-long-jump',
      manual: 5,
      steps: 5,
      review: 5,
      key: 'comparison-practice',
    };
  if (process.argv.includes('--breeding'))
    return {
      index: 26,
      lessonId: 'bnu-lower-breeding',
      zero: '-site-zero',
      retry: '-sheep-choice',
      manual: 9,
      steps: 8,
      review: 5,
      key: 'breeding',
    };
  if (process.argv.includes('--red-fruit'))
    return {
      index: 25,
      lessonId: 'bnu-lower-red-fruit',
      zero: '-open-below30',
      retry: '-open-below30',
      manual: 12,
      steps: 8,
      review: 5,
      key: 'red-fruit',
    };
  if (process.argv.includes('--count-beans'))
    return {
      index: 24,
      lessonId: 'bnu-lower-count-beans',
      zero: '-zero-tens',
      retry: '-twenty-eight-beads',
      manual: 16,
      steps: 8,
      review: 5,
      key: 'count-beans',
    };
  if (process.argv.includes('--count-hundred'))
    return {
      index: 23,
      lessonId: 'bnu-lower-count-hundred',
      zero: '-zero-ones',
      retry: '-eggs-right',
      manual: 14,
      steps: 9,
      review: 5,
      key: 'count-hundred',
    };
  if (process.argv.includes('--around-numbers'))
    return {
      index: 22,
      lessonId: 'bnu-lower-around-numbers',
      zero: '-zero-remainder',
      retry: '-circle-count',
      manual: 14,
      steps: 8,
      review: 5,
      key: 'around-numbers',
    };
  if (process.argv.includes('--subtraction-practice'))
    return {
      index: 21,
      lessonId: 'bnu-lower-subtraction-practice',
      zero: '-zero-missing',
      retry: '-kicks-difference-example',
      manual: 16,
      steps: 8,
      review: 5,
      key: 'subtraction-practice',
    };
  if (process.argv.includes('--subtraction-harvest'))
    return {
      index: 20,
      lessonId: 'bnu-lower-subtraction-harvest',
      zero: '-zero-empty',
      retry: '-counter-remaining',
      manual: 9,
      steps: 5,
      review: 5,
      key: 'subtraction-harvest',
    };
  if (process.argv.includes('--subtraction-table'))
    return {
      index: 19,
      lessonId: 'bnu-lower-subtraction-table',
      zero: '-zero-complete',
      retry: '-outside',
      manual: 10,
      steps: 8,
      review: 5,
      key: 'subtraction-table',
    };
  if (process.argv.includes('--countryside'))
    return {
      index: 18,
      lessonId: 'bnu-lower-countryside',
      zero: '-zero-hidden',
      retry: '-pencils-hidden',
      manual: 10,
      steps: 8,
      review: 5,
      key: 'countryside',
    };
  if (process.argv.includes('--parachute'))
    return {
      index: 17,
      lessonId: 'bnu-lower-parachute',
      zero: '-zero-difference',
      retry: '-peach-difference',
      manual: 10,
      steps: 9,
      review: 5,
      key: 'parachute',
    };
  if (process.argv.includes('--meeting'))
    return {
      index: 16,
      lessonId: 'bnu-lower-meeting',
      zero: '-zero-missing',
      retry: '-shovel-missing',
      manual: 10,
      steps: 9,
      review: 5,
      key: 'meeting',
    };
  if (process.argv.includes('--complement'))
    return {
      index: 15,
      lessonId: 'bnu-lower-complement-game',
      zero: null,
      retry: '-ducks-hidden',
      manual: 10,
      steps: 9,
      review: 5,
      key: 'complement',
    };
  if (process.argv.includes('--hide'))
    return {
      index: 14,
      lessonId: 'bnu-lower-hide-and-seek',
      zero: null,
      retry: '-hidden',
      manual: 10,
      steps: 9,
      review: 5,
      key: 'hide',
    };
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
      const inspectAroundNumbers = async (scene, variant, label) => {
        const figure = p.locator(
          `[data-bnu-around-numbers][data-scene="${scene}"][data-variant="${variant}"]`,
        );
        await figure.waitFor();
        const counts = {
          circles: { main: 62, review: 43 },
          triangles: { main: 12, review: 14 },
        };
        const expected = counts[scene][variant];
        if ((await figure.locator('[data-around-marker]').count()) !== expected)
          throw new Error('Around number markers changed');
        if (
          scene === 'triangles' &&
          ((await figure.locator('[data-around-marker="large"]').count()) !==
            (variant === 'main' ? 7 : 6) ||
            (await figure.locator('[data-around-marker="small"]').count()) !==
              (variant === 'main' ? 5 : 8))
        )
          throw new Error('Triangle size groups changed');
        const bounds = await figure.locator('svg').evaluate((svg) => {
          const r = svg.getBoundingClientRect();
          return [...svg.querySelectorAll('[data-around-marker]')].every(
            (n) => {
              const b = n.getBoundingClientRect();
              return (
                b.left >= r.left &&
                b.right <= r.right &&
                b.top >= r.top &&
                b.bottom <= r.bottom
              );
            },
          );
        });
        if (!bounds) throw new Error('Around number marker outside SVG');
        const font = await figure
          .locator('figcaption')
          .evaluate((n) => Number.parseFloat(getComputedStyle(n).fontSize));
        if (font < 20) throw new Error('Around diagram text too small');
        if (
          (await figure
            .locator('[data-around-hint]')
            .evaluate((n) => Number.parseFloat(getComputedStyle(n).fontSize))) <
          20
        )
          throw new Error('Visible scroll hint missing or too small');
        const scroller = figure.locator('[data-around-scroll]');
        await scroller.evaluate((n) => {
          n.scrollLeft = 0;
        });
        await scroller.focus();
        await p.keyboard.press('ArrowRight');
        await p.waitForTimeout(200);
        const keyboard = await scroller.evaluate(
          (n) => n.scrollWidth <= n.clientWidth || n.scrollLeft > 0,
        );
        if (!keyboard) throw new Error('Around diagram keyboard scroll failed');

        for (const edge of ['first', 'last']) {
          await scroller.evaluate((n, side) => {
            n.scrollLeft = side === 'first' ? 0 : n.scrollWidth;
          }, edge);
          await scroller.evaluate((n) => n.scrollIntoView({ block: 'center' }));
          await p.waitForTimeout(150);
          const fits = await scroller.evaluate((n) => {
            const r = n.getBoundingClientRect();
            return (
              r.left >= 0 &&
              r.right <= innerWidth &&
              r.top >= 0 &&
              r.bottom <= innerHeight &&
              document.documentElement.scrollWidth <= innerWidth
            );
          });
          if (!fits) throw new Error('Around number scroll viewport overflow');
          await p.screenshot({
            path: `/tmp/butler-bnu-around-${scene}-${variant}-${label}-${width}-${edge}.png`,
          });
        }
      };
      const inspectHundredWeather = async (variant, label) => {
        const figure = p.locator(
          `[data-hundred-weather][data-variant="${variant}"]`,
        );
        await figure.waitFor();
        const expected =
          variant === 'main'
            ? { S: 35, C: 35, rows: 7, columns: 10 }
            : { S: 12, C: 8, rows: 4, columns: 5 };
        for (const type of ['S', 'C'])
          if (
            (await figure.locator(`[data-weather-cell="${type}"]`).count()) !==
            expected[type]
          )
            throw new Error('Weather category count changed');
        const exactRows =
          variant === 'main'
            ? [
                'SSSSSSSSSS',
                'CCCCCCCCCC',
                'SSSCCCCCCC',
                'CCCSSSSSSS',
                'CCCCCCSSSS',
                'SSSSSSCCCC',
                'CCCCCSSSSS',
              ]
            : ['SSCCC', 'SSSSC', 'CSSCC', 'SSSCS'];
        const cells = await figure
          .locator('[data-weather-cell]')
          .evaluateAll((nodes) =>
            nodes.map((n) => n.dataset.weatherCell).join(''),
          );
        if (cells !== exactRows.join(''))
          throw new Error('Weather positions changed');
        const bounds = await figure.locator('svg').evaluate((svg) => {
          const r = svg.getBoundingClientRect();
          return [...svg.querySelectorAll('[data-weather-cell]')].every((n) => {
            const b = n.getBoundingClientRect();
            return (
              b.left >= r.left &&
              b.right <= r.right &&
              b.top >= r.top &&
              b.bottom <= r.bottom
            );
          });
        });
        if (!bounds) throw new Error('Weather cell outside SVG');
        const fonts = await figure
          .locator('figcaption,p')
          .evaluateAll((nodes) =>
            nodes
              .slice(0, 3)
              .map((n) => Number.parseFloat(getComputedStyle(n).fontSize)),
          );
        if (fonts.some((n) => n < 20))
          throw new Error('Weather heading, legend or scroll hint too small');
        const cloudFill = await figure
          .locator('[data-weather-cell="C"] path')
          .last()
          .evaluate((n) => getComputedStyle(n).fill);
        if (['none', 'rgba(0, 0, 0, 0)', 'transparent'].includes(cloudFill))
          throw new Error('Cloud fails to cover its sun');
        const scroll = figure.locator('[data-weather-scroll]');
        await scroll.evaluate((n) => {
          n.scrollLeft = 0;
        });
        await scroll.focus();
        await p.keyboard.press('ArrowRight');
        await p.waitForTimeout(200);
        if (
          !(await scroll.evaluate(
            (n) => n.scrollWidth <= n.clientWidth || n.scrollLeft > 0,
          ))
        )
          throw new Error('Weather keyboard scroll failed');
        for (const edge of ['first', 'last']) {
          await scroll.evaluate((n, e) => {
            n.scrollLeft = e === 'first' ? 0 : n.scrollWidth;
            n.scrollIntoView({ block: 'center' });
          }, edge);
          await p.waitForTimeout(150);
          if (
            !(await scroll.evaluate((n) => {
              const r = n.getBoundingClientRect();
              return (
                r.left >= 0 &&
                r.right <= innerWidth &&
                r.top >= 0 &&
                r.bottom <= innerHeight &&
                document.documentElement.scrollWidth <= innerWidth
              );
            }))
          )
            throw new Error('Weather scroll viewport overflow');
          await p.screenshot({
            path: `/tmp/butler-bnu-hundred-weather-${variant}-${label}-${width}-${edge}.png`,
          });
        }
      };
      const inspectPlaceCounters = async (values, label) => {
        const figure = p.locator('[data-place-counters]');
        await figure.waitFor();
        if (
          (await figure.locator('[data-counter-panel]').count()) !==
          values.length
        )
          throw new Error('Place counter panel count changed');
        for (const [i, value] of values.entries()) {
          const panel = figure.locator('[data-counter-panel]').nth(i);
          const expected = {
            hundreds: Math.floor(value / 100),
            tens: Math.floor(value / 10) % 10,
            ones: value % 10,
          };
          for (const key of ['hundreds', 'tens', 'ones']) {
            if (
              (await panel.locator(`[data-counter-bead="${key}"]`).count()) !==
              expected[key]
            )
              throw new Error('Counter bead count or place changed');
            if (
              (await panel.locator(`[data-counter-rod="${key}"]`).count()) !== 1
            )
              throw new Error('Counter place label missing');
          }
          const bounds = await panel.evaluate((svg) => {
            const r = svg.getBoundingClientRect();
            return [...svg.querySelectorAll('path,ellipse,text')].every((n) => {
              const b = n.getBoundingClientRect();
              return (
                b.left >= r.left &&
                b.right <= r.right &&
                b.top >= r.top &&
                b.bottom <= r.bottom
              );
            });
          });
          if (!bounds) throw new Error('Place counter element outside SVG');
          const fonts = await panel
            .locator('text')
            .evaluateAll((nodes) =>
              nodes.map((n) => Number.parseFloat(getComputedStyle(n).fontSize)),
            );
          if (fonts.some((n) => n < 20))
            throw new Error('Place labels below 20px');
        }
        const fonts = await figure
          .locator('figcaption,p')
          .evaluateAll((nodes) =>
            nodes
              .slice(0, 3)
              .map((n) => Number.parseFloat(getComputedStyle(n).fontSize)),
          );
        if (fonts.some((n) => n < 20))
          throw new Error('Counter title legend or scroll hint too small');
        const scroller = figure.locator('[data-counter-scroll]');
        await scroller.evaluate((n) => {
          n.scrollLeft = 0;
        });
        await scroller.focus();
        await p.keyboard.press('ArrowRight');
        await p.waitForTimeout(200);
        if (
          !(await scroller.evaluate(
            (n) => n.scrollWidth <= n.clientWidth || n.scrollLeft > 0,
          ))
        )
          throw new Error('Counter keyboard scroll failed');
        for (const edge of ['first', 'last']) {
          await scroller.evaluate((n, e) => {
            n.scrollLeft = e === 'first' ? 0 : n.scrollWidth;
            n.scrollIntoView({ block: 'center' });
          }, edge);
          await p.waitForTimeout(150);
          if (
            !(await scroller.evaluate((n) => {
              const r = n.getBoundingClientRect();
              return (
                r.left >= 0 &&
                r.right <= innerWidth &&
                r.top >= 0 &&
                r.bottom <= innerHeight &&
                document.documentElement.scrollWidth <= innerWidth
              );
            }))
          )
            throw new Error('Counter scroll viewport overflow');
          await p.screenshot({
            path: `/tmp/butler-bnu-beans-counters-${label}-${width}-${edge}.png`,
          });
        }
      };
      const inspectMarkedLine = async (values, label) => {
        const figure = p.locator('[data-marked-number-line]');
        await figure.waitFor();
        const svg = figure.locator('svg');
        if ((await svg.locator('[data-line-tick]').count()) !== 11)
          throw new Error('Incomplete fixed number line ticks');
        if ((await svg.locator('[data-line-mark]').count()) !== values.length)
          throw new Error('Marked number line count changed');
        const ticks = await svg
          .locator('[data-line-tick] text')
          .allTextContents();
        if (
          JSON.stringify(ticks) !==
          JSON.stringify(Array.from({ length: 11 }, (_, i) => String(i * 10)))
        )
          throw new Error('Number line tick values changed');
        for (const [i, value] of values.entries()) {
          const mark = svg.locator(`[data-line-mark="${value}"]`);
          const dot = mark.locator('circle');
          if (
            Math.abs(
              Number(await dot.getAttribute('cx')) - (44 + (value * 912) / 100),
            ) > 0.001
          )
            throw new Error('Number line point placed on wrong scale');
          const text = svg.locator(`[data-line-label="${value}"] text`);
          if (
            (await text.textContent()) !== String(value) ||
            Number(await text.getAttribute('y')) !== 44 + i * 32
          )
            throw new Error('Number line label or separate row changed');
        }
        const geometry = await svg.evaluate((n) => {
          const box = n.getBoundingClientRect();
          const labels = [...n.querySelectorAll('[data-line-label] text')].map(
            (x) => x.getBoundingClientRect(),
          );
          const inside = [...n.querySelectorAll('text,line,circle,rect')].every(
            (x) => {
              const r = x.getBoundingClientRect();
              return (
                r.left >= box.left &&
                r.right <= box.right &&
                r.top >= box.top &&
                r.bottom <= box.bottom
              );
            },
          );
          const noOverlap = labels.every((a, i) =>
            labels.every(
              (b, j) =>
                i === j ||
                a.right <= b.left ||
                b.right <= a.left ||
                a.bottom <= b.top ||
                b.bottom <= a.top,
            ),
          );
          const large = [...n.querySelectorAll('text')].every(
            (x) => Number.parseFloat(getComputedStyle(x).fontSize) >= 20,
          );
          return inside && noOverlap && large;
        });
        if (!geometry)
          throw new Error(
            'Number line labels overlap, clip or become too small',
          );
        const fonts = await figure
          .locator('figcaption,p')
          .evaluateAll((nodes) =>
            nodes
              .slice(0, 3)
              .every(
                (n) => Number.parseFloat(getComputedStyle(n).fontSize) >= 20,
              ),
          );
        if (!fonts) throw new Error('Number line legend below 20px');
        const scroller = figure.locator('[data-marked-line-scroll]');
        await scroller.evaluate((n) => {
          n.scrollLeft = 0;
        });
        await scroller.focus();
        await p.keyboard.press('ArrowRight');
        await p.waitForTimeout(200);
        const keyboard = await scroller.evaluate(
          (n) => n.scrollWidth <= n.clientWidth || n.scrollLeft > 0,
        );
        if (!keyboard) throw new Error('Number line keyboard scrolling failed');
        for (const edge of ['first', 'last']) {
          await scroller.evaluate((n, e) => {
            n.scrollLeft = e === 'first' ? 0 : n.scrollWidth;
            n.scrollIntoView({ block: 'center' });
          }, edge);
          await p.waitForTimeout(150);
          const fits = await scroller.evaluate((n) => {
            const r = n.getBoundingClientRect();
            return (
              r.left >= 0 &&
              r.right <= innerWidth &&
              r.top >= 0 &&
              r.bottom <= innerHeight &&
              document.documentElement.scrollWidth <= innerWidth
            );
          });
          if (!fits) throw new Error('Number line scroll viewport clipped');
          await p.screenshot({
            path: `/tmp/butler-bnu-breeding-line-${label}-${width}-${edge}.png`,
          });
        }
      };
      const inspectBnuTable = async (visual, label) => {
        const figure = p.locator('[data-bnu-hundred-table]');
        await figure.waitFor();
        const mainGivens = [
          1, 10, 12, 19, 23, 28, 34, 37, 45, 46, 55, 56, 64, 67, 73, 78, 82, 89,
          91, 100,
        ];
        const reviewGivens = [
          2, 9, 13, 18, 24, 27, 35, 36, 44, 47, 54, 57, 65, 66, 74, 77, 83, 88,
          92, 99,
        ];
        const isFull = ['complete', 'full'].includes(visual.scene);
        let expected;
        if (isFull) {
          const givens = visual.variant === 'main' ? mainGivens : reviewGivens;
          expected = Array.from({ length: 10 }, (_, r) =>
            Array.from({ length: 10 }, (_, c) => {
              const n = r * 10 + c + 1;
              return visual.scene === 'complete' || givens.includes(n)
                ? n
                : null;
            }),
          );
        } else {
          const main = {
            'fifty-eight': [
              [58, null, 60],
              [null, null, null],
              [78, null, 80],
            ],
            'sixty-seven': [
              [null, null, null],
              [null, 67, null],
              [null, null, null],
            ],
            'practice-one': [
              [27, 28, null],
              [null, 38, null],
              [null, null, 49],
            ],
            'practice-two': [
              [null, 31, null],
              [40, null, 42],
              [null, 51, null],
            ],
            'practice-three': [
              [null, null, null],
              [null, 85, null],
              [null, null, null],
            ],
          };
          const review = {
            'fifty-eight': [
              [48, null, 50],
              [null, null, null],
              [68, null, 70],
            ],
            'sixty-seven': [
              [null, null, null],
              [null, 76, null],
              [null, null, null],
            ],
            'practice-one': [
              [37, 38, null],
              [null, 48, null],
              [null, null, 59],
            ],
            'practice-two': [
              [null, 51, null],
              [60, null, 62],
              [null, 71, null],
            ],
            'practice-three': [
              [null, null, null],
              [null, 64, null],
              [null, null, null],
            ],
          };
          expected = (visual.variant === 'main' ? main : review)[visual.scene];
        }
        if (!expected) throw new Error('Unknown hundred-table fixture');
        const cells = figure.locator('[data-bnu-table-cell]');
        if ((await cells.count()) !== expected.flat().length)
          throw new Error('Hundred table lost cells');
        let blank = 0;
        for (const [r, row] of expected.entries()) {
          for (const [c, value] of row.entries()) {
            const cell = figure.locator(
              `[data-bnu-table-cell="${r + 1}-${c}"]`,
            );
            const content = await cell.textContent();
            const actual = content.trim();
            const letter = value === null && (!isFull || visual.row === r + 1);
            if (value !== null) {
              if (actual !== String(value))
                throw new Error('Hundred table given changed');
            } else if (letter) {
              if (actual !== String.fromCodePoint(65 + blank++))
                throw new Error('Hundred table letter order changed');
            } else if (!['Blank', '空'].includes(actual))
              throw new Error('Hundred table blank exposed an answer');
          }
        }
        const readable = await cells.evaluateAll((nodes) =>
          nodes.every((n) => {
            const cell = n.closest('td');
            const a = n.getBoundingClientRect();
            const b = cell.getBoundingClientRect();
            return (
              Number.parseFloat(getComputedStyle(n).fontSize) >= 20 &&
              b.height >= 44 &&
              a.left >= b.left &&
              a.right <= b.right &&
              a.top >= b.top &&
              a.bottom <= b.bottom
            );
          }),
        );
        if (!readable)
          throw new Error('Hundred table text clipped or too small');
        const legends = await figure
          .locator('figcaption,p')
          .evaluateAll((nodes) =>
            nodes
              .slice(0, -1)
              .every(
                (n) => Number.parseFloat(getComputedStyle(n).fontSize) >= 20,
              ),
          );
        if (!legends) throw new Error('Hundred table legend below 20px');
        const scroller = figure.locator('[data-bnu-table-scroll]');
        await scroller.evaluate((n) => {
          n.scrollLeft = 0;
          n.scrollTop = 0;
          n.scrollIntoView({ block: 'center' });
        });
        await scroller.focus();
        await p.keyboard.press('ArrowRight');
        await p.waitForTimeout(150);
        if (
          !(await scroller.evaluate(
            (n) => n.scrollWidth <= n.clientWidth || n.scrollLeft > 0,
          ))
        )
          throw new Error('Hundred table keyboard horizontal scroll failed');
        const beforeDown = await scroller.evaluate((n) => ({
          height: n.scrollHeight,
          client: n.clientHeight,
          top: n.scrollTop,
          focused: document.activeElement === n,
        }));
        await scroller.press('ArrowDown');
        await p.waitForTimeout(300);
        if (
          !(await scroller.evaluate(
            (n) => n.scrollHeight <= n.clientHeight || n.scrollTop > 0,
          ))
        )
          throw new Error(
            `Hundred table keyboard vertical scroll failed: ${label} ${JSON.stringify(beforeDown)} ${JSON.stringify(await scroller.evaluate((n) => ({ height: n.scrollHeight, client: n.clientHeight, top: n.scrollTop, focused: document.activeElement === n })))}`,
          );
        for (const edge of ['first', 'last']) {
          await scroller.evaluate((n, e) => {
            n.scrollLeft = e === 'first' ? 0 : n.scrollWidth;
            n.scrollTop = e === 'first' ? 0 : n.scrollHeight;
            n.scrollIntoView({ block: 'center' });
          }, edge);
          await p.waitForTimeout(100);
          const fits = await scroller.evaluate((n) => {
            const r = n.getBoundingClientRect();
            return (
              r.left >= 0 &&
              r.right <= innerWidth &&
              r.top >= 0 &&
              r.bottom <= innerHeight &&
              document.documentElement.scrollWidth <= innerWidth
            );
          });
          if (!fits) throw new Error('Hundred table scroll viewport clipped');
          if (
            !isFull ||
            label.startsWith('learn') ||
            visual.row === 1 ||
            visual.row === 10
          )
            await p.screenshot({
              path: `/tmp/butler-bnu-hundred-table-${label}-${width}-${edge}.png`,
            });
        }
      };
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
          .count()) !== 30
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
      if (flow.key === 'hundred-chart')
        await inspectBnuTable(
          { scene: 'full', variant: 'main' },
          'learn-initial',
        );
      for (
        let step = 0;
        step < (flow.steps || (flow.key === 'practice' ? 8 : 7)) - 1;
        step++
      ) {
        await click('下一步');
        await wait(
          (d) => d.sessions.find((s) => s.id === sid).step === step + 1,
        );
        if (flow.key === 'meeting' && step === 6) {
          const strip = p.locator('[data-number-strip]');
          const numbers = await strip.locator('li').allTextContents();
          if (numbers.map((n) => n.trim()).join(',') !== '11,12,13,14,15,16,17')
            throw new Error('Meeting table original row changed');
          const font = await strip
            .locator('li')
            .evaluateAll((nodes) =>
              nodes.every(
                (n) => Number.parseFloat(getComputedStyle(n).fontSize) >= 20,
              ),
            );
          if (!font) throw new Error('Meeting number row too small');
          const region = strip.locator('[role="region"]');
          await region.evaluate((n) => n.scrollIntoView({ block: 'center' }));
          await region.evaluate((n) => {
            n.scrollLeft = 0;
          });
          await p.screenshot({
            path: `/tmp/butler-bnu-meeting-row-left-${width}.png`,
          });
          await region.focus();
          await region.press('End');
          await region.evaluate((n) => {
            n.scrollLeft = n.scrollWidth;
          });
          const finalFits = await strip
            .locator('li')
            .last()
            .evaluate((n) => {
              const a = n.getBoundingClientRect();
              const b = n.closest('[role="region"]').getBoundingClientRect();
              return a.left >= b.left && a.right <= b.right;
            });
          if (!finalFits) throw new Error('Meeting final number inaccessible');
          await p.screenshot({
            path: `/tmp/butler-bnu-meeting-row-right-${width}.png`,
          });
        }
        if (flow.key === 'hundred-chart' && [0, 1, 2, 3, 5].includes(step)) {
          const scenes = {
            0: 'complete',
            1: 'fifty-eight',
            2: 'sixty-seven',
            3: 'complete',
            5: 'practice-one',
          };
          await inspectBnuTable(
            { scene: scenes[step], variant: 'main' },
            `learn-${step + 1}`,
          );
          if (step === 0) {
            const state = JSON.stringify(await read());
            await p
              .locator('button[aria-haspopup="menu"]')
              .filter({ has: p.locator('svg.lucide-languages') })
              .click();
            await p.getByText('English', { exact: true }).click();
            await p
              .getByText(
                'Hundred chart and fragments: observe rows and columns',
                { exact: true },
              )
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
            await inspectBnuTable(
              { scene: 'complete', variant: 'main' },
              'learn-english-theme',
            );
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
            if (JSON.stringify(await read()) !== state)
              throw new Error(
                'Hundred table language/theme mutated learning records',
              );
          }
        }
        if (flow.key === 'breeding' && [0, 5].includes(step)) {
          const values = step === 0 ? [22, 92, 100] : [10, 38, 50, 51, 98];
          await inspectMarkedLine(values, `learn-${step + 1}`);
          const state = JSON.stringify(await read());
          await p
            .locator('button[aria-haspopup="menu"]')
            .filter({ has: p.locator('svg.lucide-languages') })
            .click();
          await p.getByText('English', { exact: true }).click();
          await p
            .getByText(
              'The site uses a fixed 0–100 scale. Labels have separate rows to avoid overlap; compare the horizontal positions of the points.',
              { exact: true },
            )
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
          await inspectMarkedLine(values, `english-theme-${step + 1}`);
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
          if (JSON.stringify(await read()) !== state)
            throw new Error(
              'Number line language or theme mutated learning records',
            );
        }
        if (
          (flow.key === 'count-beans' && (step === 0 || step === 1)) ||
          (flow.key === 'hundred-harvest' && [0, 2].includes(step)) ||
          (flow.key === 'red-fruit' && [0, 1, 3].includes(step))
        ) {
          const diagramValues = {
            'count-beans': { 0: [28, 22], 1: [97, 98, 99, 100] },
            'hundred-harvest': { 0: [95, 92, 85, 79], 2: [85] },
            'red-fruit': { 0: [21, 18], 1: [32, 34, 100, 99], 3: [45, 54] },
          };
          const values = diagramValues[flow.key][step];
          await inspectPlaceCounters(values, `learn-${step + 1}`);
          const state = JSON.stringify(await read());
          await p
            .locator('button[aria-haspopup="menu"]')
            .filter({ has: p.locator('svg.lucide-languages') })
            .click();
          await p.getByText('English', { exact: true }).click();
          await p
            .getByText(
              'One hundreds bead represents 100, one tens bead 10 and one ones bead 1. The number of physical beads is different from the number represented.',
              { exact: true },
            )
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
          await inspectPlaceCounters(values, `english-theme-${step + 1}`);
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
          if (JSON.stringify(await read()) !== state)
            throw new Error('Counter language/theme changed records');
        }
        if (flow.key === 'count-hundred' && step === 0) {
          for (const [label, hundreds, tens] of [
            ['1个百拆成10个十', 0, 10],
            ['1个十拆成10个一', 0, 9],
          ]) {
            await click(label);
            await wait((d) => {
              const tool = d.sessions.find((s) => s.id === sid).tools?.[
                'step-1'
              ]?.placeValue;
              return (
                tool?.value === 100 &&
                tool.hundreds === hundreds &&
                tool.tens === tens
              );
            });
          }
          await p.reload({ waitUntil: 'networkidle' });
          const afterSplitReload = await read();
          if (
            JSON.stringify(
              afterSplitReload.sessions.find((s) => s.id === sid).tools[
                'step-1'
              ].placeValue,
            ) !== JSON.stringify({ value: 100, hundreds: 0, tens: 9 })
          )
            throw new Error('Source hundred split lost on reload');
          await p.screenshot({
            path: `/tmp/butler-bnu-hundred-source-split-${width}.png`,
          });
          for (const [label, hundreds, tens] of [
            ['10个一换1个十', 0, 10],
            ['10个十换1个百', 1, 0],
          ]) {
            await click(label);
            await wait((d) => {
              const tool = d.sessions.find((s) => s.id === sid).tools?.[
                'step-1'
              ]?.placeValue;
              return (
                tool?.value === 100 &&
                tool.hundreds === hundreds &&
                tool.tens === tens
              );
            });
          }
        }
        if (flow.key === 'count-hundred' && step === 5) {
          await inspectHundredWeather('main', 'learn');
          const state = JSON.stringify(await read());
          await p
            .locator('button[aria-haspopup="menu"]')
            .filter({ has: p.locator('svg.lucide-languages') })
            .click();
          await p.getByText('English', { exact: true }).click();
          await p
            .getByText(
              'Classify each whole icon as sun alone or sun with cloud. The sun within a cloud icon is not another cell.',
              { exact: true },
            )
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
          await inspectHundredWeather('main', 'english-theme');
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
          if (JSON.stringify(await read()) !== state)
            throw new Error('Weather language/theme changed records');
        }
        if (flow.key === 'around-numbers' && (step === 2 || step === 3)) {
          const scene = step === 2 ? 'circles' : 'triangles';
          await inspectAroundNumbers(scene, 'main', 'learn');
          const state = JSON.stringify(await read());
          await p
            .locator('button[aria-haspopup="menu"]')
            .filter({ has: p.locator('svg.lucide-languages') })
            .click();
          await p.getByText('English', { exact: true }).click();
          await p
            .getByText(
              scene === 'circles'
                ? 'Each circle represents one item. Check every row.'
                : 'In this diagram, each large triangle represents ten items and each small triangle one. Size alone does not establish a value.',
              { exact: true },
            )
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
          await inspectAroundNumbers(scene, 'main', 'english-theme');
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
            .getByText(
              scene === 'circles'
                ? '每个圆表示1个，按行逐个核对。'
                : '本图约定：每个大三角形表示10个，每个小三角形表示1个。大小本身不能决定数量。',
              { exact: true },
            )
            .waitFor();
          if (JSON.stringify(await read()) !== state)
            throw new Error('Around diagram language/theme changed records');
        }
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
        if (q.visual?.kind === 'bnu-hundred-table')
          await inspectBnuTable(q.visual, q.id);
        if (q.visual?.kind === 'marked-number-line')
          await inspectMarkedLine(q.visual.values, q.id);
        if (q.visual?.kind === 'place-counters')
          await inspectPlaceCounters(q.visual.values, q.id);
        if (q.visual?.kind === 'bnu-hundred-weather')
          await inspectHundredWeather(q.visual.variant, 'question');
        if (
          flow.key === 'around-numbers' &&
          q.visual?.kind === 'bnu-around-numbers'
        )
          await inspectAroundNumbers(
            q.visual.scene,
            q.visual.variant,
            'question',
          );
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
          if (q.rule.kind === 'number-interval') {
            const input = p.getByRole('spinbutton');
            if (q.id.endsWith(flow.zero)) {
              await input.fill('0');
              await wait(
                (d) =>
                  d.sessions.find((item) => item.id === sid).responses[index]
                    .draft === 0,
              );
              await p.reload({ waitUntil: 'networkidle' });
              if ((await input.inputValue()) !== '0')
                throw new Error('Interval zero draft lost');
            }
            await input.evaluate((n) =>
              n
                .closest('.ant-input-number')
                .scrollIntoView({ block: 'center' }),
            );
            await p.waitForTimeout(200);
            const fits = await input.evaluate((n) => {
              const r = n.closest('.ant-input-number').getBoundingClientRect();
              return (
                Number.parseFloat(getComputedStyle(n).fontSize) >= 20 &&
                r.height >= 44 &&
                r.left >= 0 &&
                r.right <= innerWidth &&
                r.top >= 0 &&
                r.bottom <= innerHeight
              );
            });
            if (!fits)
              throw new Error(
                'Open number interval field clipped or too small',
              );
            if (q.id.endsWith(flow.retry)) {
              await input.fill('30');
              await click('提交答案');
              await p
                .getByText('再想一想，可以修改后重试', { exact: true })
                .waitFor();
            }
            await input.fill(String(q.rule.minimum));
            await click('提交答案');
            await p.getByText('答对了', { exact: true }).waitFor();
            await p.screenshot({
              path: `/tmp/butler-bnu-red-open-${q.id}-${width}.png`,
            });
            await input.fill(String(q.rule.maximum));
          } else if (q.rule.kind === 'number') {
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
              await p
                .getByRole('spinbutton')
                .fill(flow.key === 'complement' ? '19' : '3');
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
          } else if (
            q.rule.kind === 'arithmetic-pair' &&
            flow.key === 'parachute'
          ) {
            await p.getByRole('spinbutton').first().fill('9');
            await wait(
              (d) =>
                JSON.stringify(
                  d.sessions.find((item) => item.id === sid).responses[index]
                    .draft,
                ) === '[9,null]',
            );
            await p.reload({ waitUntil: 'networkidle' });
            const values = await p
              .getByRole('spinbutton')
              .evaluateAll((nodes) => nodes.map((n) => n.value));
            if (JSON.stringify(values) !== '["9",""]')
              throw new Error('Free difference partial pair lost');
            for (let i = 0; i < 2; i++) {
              const input = p.getByRole('spinbutton').nth(i);
              await input.evaluate((n) =>
                n.scrollIntoView({ block: 'center' }),
              );
              await p.waitForTimeout(150);
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
                throw new Error('Free difference input size or clipping');
              await input.fill(String([14, 6][i]));
            }
            await p.screenshot({
              path: `/tmp/butler-bnu-parachute-pair-${width}.png`,
            });
            await click('提交答案');
            await p
              .getByText('再想一想，可以修改后重试', { exact: true })
              .waitFor();
            await p.getByRole('spinbutton').nth(0).fill('20');
            await p.getByRole('spinbutton').nth(1).fill('11');
          } else if (
            q.rule.kind === 'arithmetic-pair' &&
            flow.key === 'complement'
          ) {
            if (q.id.endsWith('-free-pair')) {
              await p.getByRole('spinbutton').nth(0).fill('0');
              await wait(
                (d) =>
                  JSON.stringify(
                    d.sessions.find((s) => s.id === sid).responses[index].draft,
                  ) === '[0,null]',
              );
              await p.reload({ waitUntil: 'networkidle' });
              const values = await p
                .getByRole('spinbutton')
                .evaluateAll((nodes) => nodes.map((n) => n.value));
              if (JSON.stringify(values) !== '["0",""]')
                throw new Error('Complement zero/empty draft lost');
              for (let i = 0; i < 2; i++) {
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
                  throw new Error('Complement input size or clipping');
                await input.fill(String([7, 6][i]));
              }
              await p.screenshot({
                path: `/tmp/butler-bnu-complement-pair-${width}.png`,
              });
              await click('提交答案');
              await p
                .getByText('再想一想，可以修改后重试', { exact: true })
                .waitFor();
            }
            await p
              .getByRole('spinbutton')
              .nth(0)
              .fill(q.id.endsWith('-free-pair') ? '7' : '0');
            await p
              .getByRole('spinbutton')
              .nth(1)
              .fill(q.id.endsWith('-free-pair') ? '7' : String(q.rule.result));
          } else if (
            q.rule.kind === 'arithmetic-pair' &&
            flow.key === 'subtraction-practice'
          ) {
            if (q.id.endsWith('-free-add-twelve')) {
              await p.getByRole('spinbutton').first().fill('0');
              await wait(
                (d) =>
                  JSON.stringify(
                    d.sessions.find((item) => item.id === sid).responses[index]
                      .draft,
                  ) === '[0,null]',
              );
              await p.reload({ waitUntil: 'networkidle' });
              const values = await p
                .getByRole('spinbutton')
                .evaluateAll((nodes) => nodes.map((n) => n.value));
              if (JSON.stringify(values) !== '["0",""]')
                throw new Error('Practice zero/empty pair lost');
              for (let i = 0; i < 2; i++) {
                const input = p.getByRole('spinbutton').nth(i);
                await input.evaluate((n) =>
                  n.scrollIntoView({ block: 'center' }),
                );
                await p.waitForTimeout(150);
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
                  throw new Error('Practice pair size or clipping');
                await input.fill(String([6, 5][i]));
              }
              await p.screenshot({
                path: `/tmp/butler-bnu-subtraction-practice-pair-${width}.png`,
              });
              await click('提交答案');
              await p
                .getByText('再想一想，可以修改后重试', { exact: true })
                .waitFor();
            }
            const pair =
              q.rule.operation === 'subtract'
                ? [q.rule.maximum, q.rule.maximum - q.rule.result]
                : [0, q.rule.result];
            for (const [i, value] of pair.entries())
              await p.getByRole('spinbutton').nth(i).fill(String(value));
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
          } else if (
            q.rule.kind === 'steps' &&
            ((flow.key === 'hundred-harvest' &&
              q.id.endsWith('-counter-digits')) ||
              (flow.key === 'hundred-chart' && q.id.endsWith('-row-1')) ||
              (flow.key === 'breeding' && q.id.endsWith('-sorted-cards')) ||
              (flow.key === 'comparison-practice' &&
                q.id.endsWith('-sorted-scores')))
          ) {
            const partials = {
              'hundred-harvest': [9, null, null, null, null, null, null, null],
              breeding: [10, null, null, null, null],
              'comparison-practice': [95, null, null, null],
              'hundred-chart': [2, null, null, null, null, null, null, null],
            };
            const wrongs = {
              'hundred-harvest': [9, 5, 9, 2, 8, 5, 9, 7],
              breeding: [10, 38, 50, 98, 51],
              'comparison-practice': [95, 88, 91, 79],
              'hundred-chart': [1, 2, 3, 4, 5, 6, 7, 8],
            };
            const partial = partials[flow.key];
            const wrong = wrongs[flow.key];
            await p.getByRole('spinbutton').first().fill(String(partial[0]));
            await wait(
              (d) =>
                JSON.stringify(
                  d.sessions.find((item) => item.id === sid).responses[index]
                    .draft,
                ) === JSON.stringify(partial),
            );
            await p.reload({ waitUntil: 'networkidle' });
            const fields = await p
              .getByRole('spinbutton')
              .evaluateAll((nodes) => nodes.map((n) => n.value));
            if (
              JSON.stringify(fields) !==
              JSON.stringify(
                partial.map((value) => (value === null ? '' : String(value))),
              )
            )
              throw new Error('Complete-card sort partial draft lost');
            for (const [i, value] of wrong.entries()) {
              const input = p.getByRole('spinbutton').nth(i);
              await input.evaluate((n) =>
                n
                  .closest('.ant-input-number')
                  .scrollIntoView({ block: 'center' }),
              );
              await p.waitForTimeout(150);
              const fits = await input.evaluate((n) => {
                const r = n
                  .closest('.ant-input-number')
                  .getBoundingClientRect();
                return (
                  Number.parseFloat(getComputedStyle(n).fontSize) >= 20 &&
                  r.height >= 44 &&
                  r.left >= 0 &&
                  r.right <= innerWidth &&
                  r.top >= 0 &&
                  r.bottom <= innerHeight
                );
              });
              if (!fits)
                throw new Error(
                  'Complete-card sort field clipped or too small',
                );
              await input.fill(String(value));
              if (i === 0 || i === wrong.length - 1)
                await p.screenshot({
                  path: `/tmp/butler-bnu-${flow.key}-sort-${width}-${i}.png`,
                });
            }
            await click('提交答案');
            await p
              .getByText('再想一想，可以修改后重试', { exact: true })
              .waitFor();
            for (const [i, value] of q.rule.values.entries())
              await p.getByRole('spinbutton').nth(i).fill(String(value));
          } else if (
            q.rule.kind === 'steps' &&
            flow.key === 'red-fruit' &&
            q.id.endsWith('-ruler-ticks')
          ) {
            await p.getByRole('spinbutton').first().fill('35');
            const partial = [35, ...Array.from({ length: 13 }, () => null)];
            try {
              await wait(
                (d) =>
                  JSON.stringify(
                    d.sessions.find((item) => item.id === sid).responses[index]
                      .draft,
                  ) === JSON.stringify(partial),
              );
            } catch (error) {
              const saved = await current();
              console.log(
                'Number line partial diagnostic',
                JSON.stringify({
                  questionId: q.id,
                  index,
                  draft: saved.responses[index].draft,
                  inputs: await p
                    .getByRole('spinbutton')
                    .evaluateAll((nodes) => nodes.map((n) => n.value)),
                }),
              );
              await p.screenshot({
                path: `/tmp/butler-bnu-red-ruler-failure-${width}.png`,
              });
              throw error;
            }
            await p.reload({ waitUntil: 'networkidle' });
            const drafts = await p
              .getByRole('spinbutton')
              .evaluateAll((nodes) => nodes.map((n) => n.value));
            if (
              JSON.stringify(drafts) !==
              JSON.stringify(['35', ...Array.from({ length: 13 }, () => '')])
            )
              throw new Error('Fourteen-field number line partial draft lost');
            for (const [i, value] of q.rule.values.entries()) {
              const input = p.getByRole('spinbutton').nth(i);
              await input.evaluate((n) =>
                n
                  .closest('.ant-input-number')
                  .scrollIntoView({ block: 'center' }),
              );
              await p.waitForTimeout(150);
              const fits = await input.evaluate((n) => {
                const r = n
                  .closest('.ant-input-number')
                  .getBoundingClientRect();
                return (
                  Number.parseFloat(getComputedStyle(n).fontSize) >= 20 &&
                  r.height >= 44 &&
                  r.left >= 0 &&
                  r.right <= innerWidth &&
                  r.top >= 0 &&
                  r.bottom <= innerHeight
                );
              });
              if (!fits)
                throw new Error(
                  'Fourteen-field number line input clipped or too small',
                );
              await input.fill(String(i === 13 ? 99 : value));
              if (i === 0 || i === 13)
                await p.screenshot({
                  path: `/tmp/butler-bnu-red-ruler-${width}-${i}.png`,
                });
            }
            await click('提交答案');
            await p
              .getByText('再想一想，可以修改后重试', { exact: true })
              .waitFor();
            await p.getByRole('spinbutton').last().fill('100');
          } else if (
            q.rule.kind === 'steps' &&
            flow.key === 'count-beans' &&
            q.id.endsWith('-near-hundred')
          ) {
            await p.getByRole('spinbutton').first().fill('97');
            await wait(
              (d) =>
                JSON.stringify(
                  d.sessions.find((item) => item.id === sid).responses[index]
                    .draft,
                ) === '[97,null,null,null]',
            );
            await p.reload({ waitUntil: 'networkidle' });
            const values = await p
              .getByRole('spinbutton')
              .evaluateAll((nodes) => nodes.map((n) => n.value));
            if (JSON.stringify(values) !== '["97","","",""]')
              throw new Error('Counter sequence partial draft lost');
            for (const [i, value] of [97, 98, 99, 1].entries()) {
              const input = p.getByRole('spinbutton').nth(i);
              await input.evaluate((n) =>
                n.scrollIntoView({ block: 'center' }),
              );
              await p.waitForTimeout(150);
              const fits = await input.evaluate((n) => {
                const r = n
                  .closest('.ant-input-number')
                  .getBoundingClientRect();
                return (
                  Number.parseFloat(getComputedStyle(n).fontSize) >= 20 &&
                  r.height >= 44 &&
                  r.left >= 0 &&
                  r.right <= innerWidth &&
                  r.top >= 0 &&
                  r.bottom <= innerHeight
                );
              });
              if (!fits)
                throw new Error('Counter sequence field clipped or too small');
              await input.fill(String(value));
              if (i === 0 || i === 3)
                await p.screenshot({
                  path: `/tmp/butler-bnu-beans-fields-${width}-${i}.png`,
                });
            }
            await click('提交答案');
            await p
              .getByText('再想一想，可以修改后重试', { exact: true })
              .waitFor();
            for (const [i, value] of q.rule.values.entries())
              await p.getByRole('spinbutton').nth(i).fill(String(value));
          } else if (
            q.rule.kind === 'steps' &&
            flow.key === 'count-hundred' &&
            q.id.endsWith('-count-first')
          ) {
            await p.getByRole('spinbutton').first().fill('75');
            await wait(
              (d) =>
                JSON.stringify(
                  d.sessions.find((s) => s.id === sid).responses[index].draft,
                ) === '[75,null,null,null,null,null,null,null,null,null]',
            );
            await p.reload({ waitUntil: 'networkidle' });
            const values = await p
              .getByRole('spinbutton')
              .evaluateAll((nodes) => nodes.map((n) => n.value));
            if (JSON.stringify(values) !== '["75","","","","","","","","",""]')
              throw new Error('Ten-field partial draft lost');
            for (let i = 0; i < 10; i++) {
              const input = p.getByRole('spinbutton').nth(i);
              await input.evaluate((n) =>
                n.scrollIntoView({ block: 'center' }),
              );
              await p.waitForTimeout(150);
              const fits = await input.evaluate((n) => {
                const r = n
                  .closest('.ant-input-number')
                  .getBoundingClientRect();
                return (
                  Number.parseFloat(getComputedStyle(n).fontSize) >= 20 &&
                  r.height >= 44 &&
                  r.left >= 0 &&
                  r.right <= innerWidth &&
                  r.top >= 0 &&
                  r.bottom <= innerHeight
                );
              });
              if (!fits)
                throw new Error(
                  'Ten-field counting input clipped or too small',
                );
              await input.fill(String(74 + i));
              if (i === 0 || i === 9)
                await p.screenshot({
                  path: `/tmp/butler-bnu-hundred-fields-${width}-${i}.png`,
                });
            }
            await click('提交答案');
            await p
              .getByText('再想一想，可以修改后重试', { exact: true })
              .waitFor();
            for (const [i, value] of q.rule.values.entries())
              await p.getByRole('spinbutton').nth(i).fill(String(value));
          } else if (
            q.rule.kind === 'steps' &&
            flow.key === 'around-numbers' &&
            q.id.endsWith('-group-fives')
          ) {
            await p.getByRole('spinbutton').first().fill('0');
            await wait(
              (d) =>
                JSON.stringify(
                  d.sessions.find((item) => item.id === sid).responses[index]
                    .draft,
                ) === '[0,null,null]',
            );
            await p.reload({ waitUntil: 'networkidle' });
            const values = await p
              .getByRole('spinbutton')
              .evaluateAll((nodes) => nodes.map((n) => n.value));
            if (JSON.stringify(values) !== '["0","",""]')
              throw new Error('Around numbers zero/partial draft lost');
            for (const [i, value] of [12, 0, 60].entries()) {
              const input = p.getByRole('spinbutton').nth(i);
              await input.evaluate((n) =>
                n.scrollIntoView({ block: 'center' }),
              );
              await p.waitForTimeout(150);
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
                throw new Error('Around numbers fields clipped or too small');
              await input.fill(String(value));
              if (i === 0 || i === 2)
                await p.screenshot({
                  path: `/tmp/butler-bnu-around-numbers-fields-${width}-${i}.png`,
                });
            }
            await click('提交答案');
            await p
              .getByText('再想一想，可以修改后重试', { exact: true })
              .waitFor();
            for (const [i, value] of [12, 2, 62].entries())
              await p.getByRole('spinbutton').nth(i).fill(String(value));
          } else if (
            q.rule.kind === 'steps' &&
            flow.key === 'subtraction-practice' &&
            q.id.endsWith('-line-each')
          ) {
            await p.getByRole('spinbutton').first().fill('17');
            await wait(
              (d) =>
                JSON.stringify(
                  d.sessions.find((item) => item.id === sid).responses[index]
                    .draft,
                ) === '[17,null,null,null,null,null,null,null,null]',
            );
            await p.reload({ waitUntil: 'networkidle' });
            const values = await p
              .getByRole('spinbutton')
              .evaluateAll((nodes) => nodes.map((n) => n.value));
            if (JSON.stringify(values) !== '["17","","","","","","","",""]')
              throw new Error('Nine-step number line partial draft lost');
            for (const [i, value] of [
              17, 16, 15, 14, 13, 12, 11, 10, 9,
            ].entries()) {
              const input = p.getByRole('spinbutton').nth(i);
              await input.evaluate((n) =>
                n.scrollIntoView({ block: 'center' }),
              );
              await p.waitForTimeout(150);
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
                throw new Error('Nine-step input size or clipping');
              await input.fill(String(value));
              if (i === 0 || i === 8)
                await p.screenshot({
                  path: `/tmp/butler-bnu-subtraction-practice-line-${width}-${i}.png`,
                });
            }
          } else if (q.rule.kind === 'steps') {
            if (
              flow.key === 'subtraction-harvest' &&
              q.id.endsWith('-counter-exchange')
            ) {
              await p.getByRole('spinbutton').first().fill('0');
              await wait(
                (d) =>
                  JSON.stringify(
                    d.sessions.find((item) => item.id === sid).responses[index]
                      .draft,
                  ) === '[0,null,null]',
              );
              await p.reload({ waitUntil: 'networkidle' });
              const values = await p
                .getByRole('spinbutton')
                .evaluateAll((nodes) => nodes.map((n) => n.value));
              if (JSON.stringify(values) !== '["0","",""]')
                throw new Error('Counter exchange partial zero lost');
              for (let i = 0; i < 3; i++) {
                const input = p.getByRole('spinbutton').nth(i);
                await input.evaluate((n) =>
                  n.scrollIntoView({ block: 'center' }),
                );
                await p.waitForTimeout(150);
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
                  throw new Error('Counter exchange field size or clipping');
                await input.fill(String([1, 13, 23][i]));
                if (i === 0 || i === 2)
                  await p.screenshot({
                    path: `/tmp/butler-subtraction-harvest-field-${i}-${width}.png`,
                  });
              }
              await click('提交答案');
              await p
                .getByText('再想一想，可以修改后重试', { exact: true })
                .waitFor();
            }
            if (flow.key === 'subtraction-table' && q.id.endsWith('-blank-a')) {
              await p.getByRole('spinbutton').first().fill('10');
              await wait(
                (d) =>
                  JSON.stringify(
                    d.sessions.find((item) => item.id === sid).responses[index]
                      .draft,
                  ) === '[10,null]',
              );
              await p.reload({ waitUntil: 'networkidle' });
              const values = await p
                .getByRole('spinbutton')
                .evaluateAll((nodes) => nodes.map((n) => n.value));
              if (JSON.stringify(values) !== '["10",""]')
                throw new Error('Subtraction operands partial draft lost');
              const grid = p.locator('[data-arithmetic-grid="bnu-subtract"]');
              const labels = await grid.locator('tbody td').allTextContents();
              if (
                labels.filter((label) => /^空格 [A-S]$/.test(label.trim()))
                  .length !== 19
              )
                throw new Error('Missing original table blanks');
              const scroller = grid.locator('.ant-table-content');
              await scroller.evaluate((node) => {
                node.scrollIntoView({ block: 'start' });
                node.scrollLeft = 0;
              });
              await p.screenshot({
                path: `/tmp/butler-bnu-subtraction-table-left-${width}.png`,
              });
              await scroller.evaluate((node) => {
                node.scrollLeft = node.scrollWidth;
              });
              await p.screenshot({
                path: `/tmp/butler-bnu-subtraction-table-right-${width}.png`,
              });
              for (let i = 0; i < 2; i++) {
                const input = p.getByRole('spinbutton').nth(i);
                await input.evaluate((n) =>
                  n.scrollIntoView({ block: 'center' }),
                );
                await p.waitForTimeout(150);
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
                  throw new Error('Subtraction operand input small or clipped');
              }
              await p.getByRole('spinbutton').nth(1).fill('6');
              await click('提交答案');
              await p
                .getByText('再想一想，可以修改后重试', { exact: true })
                .waitFor();
            }
            if (flow.key === 'countryside' && q.id.endsWith('-six-groups')) {
              await p.getByRole('spinbutton').first().fill('11');
              await wait(
                (d) =>
                  JSON.stringify(
                    d.sessions.find((item) => item.id === sid).responses[index]
                      .draft,
                  ) === '[11,null,null,null,null,null]',
              );
              await p.reload({ waitUntil: 'networkidle' });
              const values = await p
                .getByRole('spinbutton')
                .evaluateAll((nodes) => nodes.map((n) => n.value));
              if (JSON.stringify(values) !== '["11","","","","",""]')
                throw new Error('Countryside partial six-place row lost');
              for (let i = 0; i < 6; i++) {
                const input = p.getByRole('spinbutton').nth(i);
                await input.evaluate((n) =>
                  n.scrollIntoView({ block: 'center' }),
                );
                await p.waitForTimeout(150);
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
                  throw new Error('Countryside row field size or clipping');
                await input.fill(String(5 + i));
                if (i === 0 || i === 5)
                  await p.screenshot({
                    path: `/tmp/butler-bnu-countryside-input-${i}-${width}.png`,
                  });
              }
              await click('提交答案');
              await p
                .getByText('再想一想，可以修改后重试', { exact: true })
                .waitFor();
            }
            if (flow.key === 'meeting' && q.id.endsWith('-table-six')) {
              await p.getByRole('spinbutton').first().fill('6');
              await wait(
                (d) =>
                  JSON.stringify(
                    d.sessions.find((item) => item.id === sid).responses[index]
                      .draft,
                  ) === '[6,null,null,null,null,null]',
              );
              await p.reload({ waitUntil: 'networkidle' });
              const values = await p
                .getByRole('spinbutton')
                .evaluateAll((nodes) => nodes.map((n) => n.value));
              if (JSON.stringify(values) !== '["6","","","","",""]')
                throw new Error('Meeting partial six-place row lost');
              for (let i = 0; i < 6; i++) {
                const input = p.getByRole('spinbutton').nth(i);
                await input.evaluate((n) =>
                  n.scrollIntoView({ block: 'center' }),
                );
                await p.waitForTimeout(150);
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
                  throw new Error('Meeting row field size or clipping');
                await input.fill(String(5 + i));
                if (i === 0 || i === 5)
                  await p.screenshot({
                    path: `/tmp/butler-bnu-meeting-input-${i}-${width}.png`,
                  });
              }
              await click('提交答案');
              await p
                .getByText('再想一想，可以修改后重试', { exact: true })
                .waitFor();
            }
            if (flow.key === 'hide' && q.id.endsWith('-exchange')) {
              await p.getByRole('spinbutton').first().fill('0');
              await wait(
                (d) =>
                  JSON.stringify(
                    d.sessions.find((s) => s.id === sid).responses[index].draft,
                  ) === '[0,null,null]',
              );
              await p.reload({ waitUntil: 'networkidle' });
              const values = await p
                .getByRole('spinbutton')
                .evaluateAll((nodes) => nodes.map((n) => n.value));
              if (JSON.stringify(values) !== '["0","",""]')
                throw new Error('Exchange zero/empty draft lost');
              for (let i = 0; i < 3; i++) {
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
                  throw new Error('Exchange input size or clipping');
                await input.fill(String([1, 13, 23][i]));
              }
              await p.screenshot({
                path: `/tmp/butler-bnu-hide-exchange-${width}.png`,
              });
              await click('提交答案');
              await p
                .getByText('再想一想，可以修改后重试', { exact: true })
                .waitFor();
            }
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
            if (flow.key === 'addition' && q.id.endsWith('-horizontal')) {
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
            if (flow.key === 'red-fruit' && q.id.endsWith('-connect-less')) {
              if ((await p.getByRole('checkbox').count()) !== 9)
                throw new Error('Incomplete original nine-card classification');
              await p.getByRole('checkbox', { name: '8', exact: true }).check();
              await wait(
                (d) =>
                  JSON.stringify(
                    d.sessions.find((item) => item.id === sid).responses[index]
                      .draft,
                  ) === '["8"]',
              );
              await p.reload({ waitUntil: 'networkidle' });
              if (
                !(await p
                  .getByRole('checkbox', { name: '8', exact: true })
                  .isChecked())
              )
                throw new Error('Partial red-fruit card selection lost');
              await click('提交答案');
              await p
                .getByText('再想一想，可以修改后重试', { exact: true })
                .waitFor();
              for (const edge of ['first', 'last']) {
                const target =
                  edge === 'first'
                    ? p.getByRole('checkbox').first()
                    : p.getByRole('checkbox').last();
                await target.evaluate((n) =>
                  n
                    .closest('.ant-checkbox-wrapper')
                    .scrollIntoView({ block: 'center' }),
                );
                await p.waitForTimeout(200);
                const fits = await target.evaluate((n) => {
                  const wrapper = n.closest('.ant-checkbox-wrapper');
                  const r = wrapper.getBoundingClientRect();
                  return (
                    Number.parseFloat(getComputedStyle(wrapper).fontSize) >=
                      20 &&
                    r.height >= 44 &&
                    r.left >= 0 &&
                    r.right <= innerWidth &&
                    r.top >= 0 &&
                    r.bottom <= innerHeight
                  );
                });
                if (!fits)
                  throw new Error(
                    'Red-fruit card checkbox clipped or too small',
                  );
                await p.screenshot({
                  path: `/tmp/butler-bnu-red-cards-${width}-${edge}.png`,
                });
              }
            }
            if (q.id.endsWith('-result-twelve')) {
              if ((await p.getByRole('checkbox').count()) !== 29)
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
        (flow.key === 'red-fruit' ? '[false,true,true]' : '[false,true]')
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
        if (q.visual?.kind === 'bnu-hundred-table')
          await inspectBnuTable(q.visual, q.id);
        if (q.visual?.kind === 'marked-number-line')
          await inspectMarkedLine(q.visual.values, q.id);
        if (q.visual?.kind === 'place-counters')
          await inspectPlaceCounters(q.visual.values, q.id);
        if (q.visual?.kind === 'bnu-hundred-weather')
          await inspectHundredWeather(q.visual.variant, 'question');
        if (
          flow.key === 'around-numbers' &&
          q.visual?.kind === 'bnu-around-numbers'
        )
          await inspectAroundNumbers(
            q.visual.scene,
            q.visual.variant,
            'question',
          );
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
          let left = Math.max(q.rule.minimum, q.rule.result - q.rule.maximum);
          let right = q.rule.result - left;
          if (q.rule.operation === 'subtract') {
            left = q.rule.maximum;
            right = left - q.rule.result;
          }
          await p.getByRole('spinbutton').nth(0).fill(String(left));
          await p.getByRole('spinbutton').nth(1).fill(String(right));
        } else if (q.rule.kind === 'number-interval') {
          await p.getByRole('spinbutton').fill(String(q.rule.minimum));
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
