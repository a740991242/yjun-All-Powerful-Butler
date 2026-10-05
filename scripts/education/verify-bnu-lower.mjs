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
  if (process.argv.includes('--square-challenge'))
    return {
      index: 46,
      lessonId: 'bnu-lower-square-challenge',
      zero: '-site-zero',
      retry: '-seven-count',
      manual: 10,
      steps: 12,
      review: 7,
      key: 'tangram-square',
    };
  if (process.argv.includes('--design'))
    return {
      index: 45,
      lessonId: 'bnu-lower-design',
      zero: '-site-zero',
      retry: '-windmill-four',
      manual: 8,
      steps: 9,
      review: 6,
      key: 'design',
    };
  if (process.argv.includes('--patterns-three'))
    return {
      index: 44,
      lessonId: 'bnu-lower-patterns',
      zero: '-site-zero',
      retry: '-source-total',
      manual: 9,
      steps: 9,
      review: 6,
      key: 'patterns-three',
    };
  if (process.argv.includes('--tangram-recognize'))
    return {
      index: 41,
      lessonId: 'bnu-lower-tangram-recognize',
      zero: '-site-zero',
      retry: '-blank-triangles',
      manual: 9,
      steps: 9,
      review: 7,
      key: 'tangram-recognize',
    };
  if (process.argv.includes('--tangram-patterns'))
    return {
      index: 42,
      lessonId: 'bnu-lower-tangram-patterns',
      zero: '-site-zero',
      retry: '-fish-pieces',
      manual: 11,
      steps: 12,
      review: 6,
      key: 'tangram-patterns',
    };
  if (process.argv.includes('--tangram-practice'))
    return {
      index: 43,
      lessonId: 'bnu-lower-tangram-practice',
      zero: '-site-zero',
      retry: '-first-pieces',
      manual: 14,
      steps: 9,
      review: 6,
      key: 'tangram-practice',
    };
  if (process.argv.includes('--fold-one'))
    return {
      index: 40,
      lessonId: 'bnu-lower-fold-one',
      zero: '-zero-square',
      retry: '-four-count',
      manual: 18,
      steps: 16,
      review: 6,
      key: 'fold-one',
    };

  if (process.argv.includes('--recognize-shapes'))
    return {
      index: 39,
      lessonId: 'bnu-lower-recognize-shapes',
      zero: '-site-zero',
      retry: '-train-rectangle',
      manual: 10,
      steps: 10,
      review: 8,
      key: 'recognize-shapes',
    };

  if (process.argv.includes('--calculation-review'))
    return {
      index: 38,
      lessonId: 'bnu-lower-calculation-review',
      zero: '-site-zero',
      retry: '-shortfall',
      manual: 10,
      steps: 10,
      review: 8,
      key: 'calculation-review',
    };

  if (process.argv.includes('--recycling'))
    return {
      index: 37,
      lessonId: 'bnu-lower-recycling',
      zero: '-site-zero',
      retry: '-total',
      manual: 8,
      steps: 10,
      review: 8,
      key: 'recycling',
    };

  if (process.argv.includes('--interesting'))
    return {
      index: 36,
      lessonId: 'bnu-lower-interesting',
      zero: '-site-zero',
      retry: '-addition-increase',
      manual: 10,
      steps: 10,
      review: 8,
      key: 'interesting',
    };

  if (process.argv.includes('--written'))
    return {
      index: 35,
      lessonId: 'bnu-lower-written',
      zero: '-site-zero',
      retry: '-add-missing-tens',
      manual: 12,
      steps: 10,
      review: 8,
      key: 'written',
    };

  if (process.argv.includes('--frogs'))
    return {
      index: 34,
      lessonId: 'bnu-lower-frogs',
      zero: '-site-zero',
      retry: '-add-beads',
      manual: 17,
      steps: 10,
      review: 9,
      key: 'frogs',
    };

  if (process.argv.includes('--pinecones'))
    return {
      index: 33,
      lessonId: 'bnu-lower-pinecones',
      zero: '-site-zero',
      retry: '-sub-ones',
      manual: 18,
      steps: 10,
      review: 9,
      key: 'pinecones',
    };

  if (process.argv.includes('--rabbit-guests'))
    return {
      index: 32,
      lessonId: 'bnu-lower-rabbit-guests',
      zero: '-site-zero',
      retry: '-add-beads',
      manual: 13,
      steps: 10,
      review: 9,
      key: 'rabbit-guests',
    };
  if (process.argv.includes('--fill-game'))
    return {
      index: 31,
      lessonId: 'bnu-lower-fill-game',
      zero: null,
      retry: '-intersection',
      manual: 6,
      steps: 8,
      review: 8,
      key: 'fill-game',
    };
  if (process.argv.includes('--number-practice'))
    return {
      index: 30,
      lessonId: 'bnu-lower-number-practice',
      zero: '-beads-zero',
      retry: '-cubes-loose',
      manual: 16,
      steps: 14,
      review: 10,
      key: 'number-practice',
    };
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
      const inspectBnuNumberReview = async (visual, label) => {
        const figure = p.locator('[data-bnu-number-review]');
        await figure.waitFor();
        const main = visual.variant === 'main';
        const trains = {
          'five-up': main
            ? [15, 20, 25, 'A', 35, 'B', 45, 'C', 'D']
            : [12, 17, 22, 'A', 32, 'B', 42, 'C', 'D'],
          'two-up': main
            ? [22, 'A', 26, 28, 'B', 32, 'C', 'D']
            : [41, 'A', 45, 47, 'B', 51, 'C', 'D'],
          'ten-up': main
            ? [10, 20, 30, 'A', 'B', 'C', 'D']
            : [9, 19, 29, 'A', 'B', 'C', 'D'],
          'five-down': main
            ? [100, 95, 90, 85, 'A', 'B', 'C', 'D']
            : [99, 94, 89, 84, 'A', 'B', 'C', 'D'],
        };
        if (trains[visual.scene]) {
          const expected = trains[visual.scene].map(String);
          const actual = await figure
            .locator('[data-bnu-train-cell]')
            .allTextContents();
          if (JSON.stringify(actual) !== JSON.stringify(expected))
            throw new Error(
              'Number review train positions, givens or blank letters changed',
            );
          const cells = await figure.locator('th,td').evaluateAll((ns) =>
            ns.every((n) => {
              const r = n.getBoundingClientRect();
              const range = document.createRange();
              range.selectNodeContents(n);
              const text = range.getBoundingClientRect();
              return (
                Number.parseFloat(getComputedStyle(n).fontSize) >= 20 &&
                r.height >= 56 &&
                text.left >= r.left &&
                text.right <= r.right &&
                text.top >= r.top &&
                text.bottom <= r.bottom
              );
            }),
          );
          if (!cells)
            throw new Error('Train teaching cells too small or text clipped');
        } else {
          const counts = {
            objects: [['object', main ? 43 : 52]],
            sticks: [
              ['bundle', main ? 3 : 4],
              ['stick', main ? 30 : 40],
              ['single', main ? 8 : 6],
            ],
            cubes: [
              ['rod', main ? 2 : 3],
              ['unit', main ? 20 : 30],
              ['single', main ? 15 : 12],
            ],
            counter: [
              ['tens-bead', main ? 2 : 3],
              ['ones-bead', main ? 5 : 2],
            ],
          }[visual.scene];
          if (!counts) throw new Error('Unknown number review scene');
          for (const [key, count] of counts)
            if (
              (await figure.locator(`[data-bnu-review-${key}]`).count()) !==
              count
            )
              throw new Error(
                `Original material count changed: ${visual.scene}/${key}`,
              );
          for (const [group, child] of [
            ['bundle', 'stick'],
            ['rod', 'unit'],
          ])
            for (const n of await figure
              .locator(`[data-bnu-review-${group}]`)
              .all())
              if (
                (await n.locator(`[data-bnu-review-${child}]`).count()) !== 10
              )
                throw new Error('Material group no longer contains ten units');
          const geometry = await figure.locator('svg').evaluate((svg) => {
            const r = svg.getBoundingClientRect();
            return [
              ...svg.querySelectorAll('circle,rect,ellipse,path,text'),
            ].every((n) => {
              const b = n.getBoundingClientRect();
              return (
                b.left >= r.left &&
                b.right <= r.right &&
                b.top >= r.top &&
                b.bottom <= r.bottom &&
                (n.tagName !== 'text' ||
                  Number.parseFloat(getComputedStyle(n).fontSize) >= 20)
              );
            });
          });
          if (!geometry)
            throw new Error(
              'Number review material glyph outside SVG or label too small',
            );
        }
        const fonts = await figure
          .locator('figcaption,p')
          .evaluateAll((ns) =>
            ns
              .slice(0, 3)
              .every(
                (n) => Number.parseFloat(getComputedStyle(n).fontSize) >= 20,
              ),
          );
        if (!fonts) throw new Error('Number review teaching legend too small');
        const region = figure.locator('[data-bnu-review-scroll]');
        await region.evaluate((n) => {
          n.scrollLeft = 0;
        });
        await region.focus();
        await p.keyboard.press('ArrowRight');
        await p.waitForTimeout(150);
        if (
          !(await region.evaluate(
            (n) => n.scrollWidth <= n.clientWidth || n.scrollLeft > 0,
          ))
        )
          throw new Error('Number review keyboard scroll failed');
        for (const edge of ['first', 'last']) {
          await region.evaluate((n, e) => {
            n.scrollLeft = 0;
            if (e === 'last' && n.querySelector('[data-bnu-train-cell]')) {
              n.scrollLeft = n.scrollWidth;
            } else if (e === 'last') {
              const r = n.getBoundingClientRect();
              const right = Math.max(
                ...[
                  ...n.querySelectorAll(
                    'th,[data-bnu-train-cell],circle,rect,ellipse',
                  ),
                ].map((x) => x.getBoundingClientRect().right),
              );
              n.scrollLeft = Math.max(0, right - r.left - n.clientWidth + 2);
            }
            n.scrollIntoView({ block: 'center' });
          }, edge);
          await p.waitForTimeout(150);
          const fits = await region.evaluate((n, e) => {
            const r = n.getBoundingClientRect();
            const nodes = [
              ...n.querySelectorAll(
                'th,[data-bnu-train-cell],circle,rect,ellipse',
              ),
            ];
            const target = nodes.toSorted(
              (a, b) =>
                a.getBoundingClientRect()[e === 'first' ? 'left' : 'right'] -
                b.getBoundingClientRect()[e === 'first' ? 'left' : 'right'],
            )[e === 'first' ? 0 : nodes.length - 1];
            const b = target?.getBoundingClientRect();
            return (
              r.left >= 0 &&
              r.right <= innerWidth &&
              r.top >= 0 &&
              r.bottom <= innerHeight &&
              document.documentElement.scrollWidth <= innerWidth &&
              b &&
              b.left >= r.left &&
              b.right <= r.right
            );
          }, edge);
          if (!fits)
            throw new Error('Number review viewport or end material clipped');
          await p.screenshot({
            path: `/tmp/butler-bnu-number-practice-${label}-${width}-${edge}.png`,
          });
        }
      };
      const inspectFillGrid = async (visual, label) => {
        const figure = p.locator('[data-bnu-fill-grid]');
        await figure.waitFor();
        const fixtures = {
          main: {
            three: [
              [1, 'A', 'B'],
              ['C', 1, 'D'],
              ['E', 2, 1],
            ],
            five: [
              [5, 1, 'A', 'B', 3],
              [1, 3, 'C', 'D', 4],
              [4, 2, 'E', 1, 5],
              [2, 'F', 4, 3, 1],
              [3, 4, 1, 'G', 2],
            ],
            'five-stage': [
              [5, 1, 'A', 'B', 3],
              [1, 3, 'C', 'D', 4],
              [4, 2, 3, 1, 5],
              [2, 5, 4, 3, 1],
              [3, 4, 1, 5, 2],
            ],
            'five-next': [
              [5, 1, 2, 'A', 3],
              [1, 3, 'B', 'C', 4],
              [4, 2, 3, 1, 5],
              [2, 5, 4, 3, 1],
              [3, 4, 1, 5, 2],
            ],
          },
          review: {
            three: [
              [2, 'A', 'B'],
              ['C', 2, 'D'],
              ['E', 3, 2],
            ],
            five: [
              [1, 2, 'A', 'B', 4],
              [2, 4, 'C', 'D', 5],
              [5, 3, 'E', 2, 1],
              [3, 'F', 5, 4, 2],
              [4, 5, 2, 'G', 3],
            ],
            'five-stage': [
              [1, 2, 'A', 'B', 4],
              [2, 4, 'C', 'D', 5],
              [5, 3, 4, 2, 1],
              [3, 1, 5, 4, 2],
              [4, 5, 2, 1, 3],
            ],
            'five-next': [
              [1, 2, 3, 'A', 4],
              [2, 4, 'B', 'C', 5],
              [5, 3, 4, 2, 1],
              [3, 1, 5, 4, 2],
              [4, 5, 2, 1, 3],
            ],
          },
        };
        const expected = fixtures[visual.variant][visual.scene];
        if (
          (await figure.locator('[data-bnu-fill-cell]').count()) !==
          expected.length ** 2
        )
          throw new Error('Fill game grid incomplete');
        for (const [r, row] of expected.entries())
          for (const [c, n] of row.entries())
            if (
              (await figure
                .locator(`[data-bnu-fill-cell="${r}-${c}"]`)
                .textContent()) !== String(n)
            )
              throw new Error('Fill game given or blank letter changed');
        const geometry = await figure.locator('th,td').evaluateAll((ns) =>
          ns.every((n) => {
            const r = n.getBoundingClientRect();
            const range = document.createRange();
            range.selectNodeContents(n);
            const b = range.getBoundingClientRect();
            return (
              Number.parseFloat(getComputedStyle(n).fontSize) >= 20 &&
              r.height >= 56 &&
              b.left >= r.left &&
              b.right <= r.right &&
              b.top >= r.top &&
              b.bottom <= r.bottom
            );
          }),
        );
        if (!geometry)
          throw new Error('Fill grid cell text clipped or too small');
        const fonts = await figure
          .locator('figcaption,p')
          .evaluateAll((ns) =>
            ns
              .slice(0, 3)
              .every(
                (n) => Number.parseFloat(getComputedStyle(n).fontSize) >= 20,
              ),
          );
        if (!fonts) throw new Error('Fill grid legend too small');
        const region = figure.locator('[data-bnu-fill-scroll]');
        await region.evaluate((n) => {
          n.scrollLeft = 0;
        });
        await region.focus();
        await p.keyboard.press('ArrowRight');
        await p.waitForTimeout(150);
        if (
          !(await region.evaluate(
            (n) => n.scrollWidth <= n.clientWidth || n.scrollLeft > 0,
          ))
        )
          throw new Error('Fill grid keyboard scroll failed');
        for (const edge of ['first', 'last']) {
          await region.evaluate((n, e) => {
            n.scrollLeft = e === 'first' ? 0 : n.scrollWidth;
            n.scrollIntoView({ block: 'center' });
          }, edge);
          await p.waitForTimeout(150);
          const fits = await region.evaluate((n, e) => {
            const r = n.getBoundingClientRect();
            const cells = [...n.querySelectorAll('th')];
            const b = (
              e === 'first' ? cells[0] : cells.at(-1)
            ).getBoundingClientRect();
            return (
              r.left >= 0 &&
              r.right <= innerWidth &&
              r.top >= 0 &&
              r.bottom <= innerHeight &&
              document.documentElement.scrollWidth <= innerWidth &&
              b.left >= r.left &&
              b.right <= r.right
            );
          }, edge);
          if (!fits)
            throw new Error(
              'Fill grid viewport or full endpoint column clipped',
            );
          await p.screenshot({
            path: `/tmp/butler-bnu-fill-game-${label}-${width}-${edge}.png`,
          });
        }
      };
      const inspectTwoLine = async (visual, label) => {
        const figure = p.locator('[data-bnu-two-line]');
        await figure.waitFor();
        const fixtures = {
          main: {
            add: {
              ticks: [37, 47, 57, 67, 77, 87],
              points: [37, 67, 69],
              jumps: [30, 2],
              range: [67, 77],
              op: '+',
            },
            subtract: {
              ticks: [26, 36, 46, 56, 66, 76],
              points: [76, 36, 33],
              jumps: [40, 3],
              range: [26, 36],
              op: '−',
            },
          },
          review: {
            add: {
              ticks: [37, 47, 57, 67, 77, 87],
              points: [47, 67, 71],
              jumps: [20, 4],
              range: [67, 77],
              op: '+',
            },
            subtract: {
              ticks: [26, 36, 46, 56, 66, 76],
              points: [76, 46, 44],
              jumps: [30, 2],
              range: [36, 46],
              op: '−',
            },
          },
        };
        const expected = fixtures[visual.variant][visual.scene];
        const svg = figure.locator('svg');
        const texts = await svg.locator('text').allTextContents();
        if (
          JSON.stringify(
            await svg.locator('[data-bnu-two-tick] text').allTextContents(),
          ) !== JSON.stringify(expected.ticks.map(String))
        )
          throw new Error('Two-jump tick scale changed');
        if (texts.includes(String(expected.points[2])))
          throw new Error('Two-jump view prints an extra final answer label');
        const arrows = svg.locator('[data-bnu-two-arrow]');
        if ((await arrows.count()) !== 2)
          throw new Error('Two-jump view needs both arrows');
        const x = (n) =>
          48 +
          (864 * (n - expected.ticks[0])) /
            (expected.ticks.at(-1) - expected.ticks[0]);
        for (let i = 0; i < 2; i++) {
          const arrow = arrows.nth(i);
          const from = expected.points[i];
          const to = expected.points[i + 1];
          const jump = expected.jumps[i];
          let aria;
          if (label.startsWith('english-')) {
            const direction = visual.scene === 'add' ? 'right' : 'left';
            aria =
              i === 0
                ? `The first arrow starts at ${from}, moves ${direction} by ${jump}, and reaches the labelled tick ${to}.`
                : `The second arrow starts at ${from}, moves ${direction} by ${jump}, and ends between ticks ${expected.range[0]} and ${expected.range[1]}, without an extra number label.`;
          } else {
            const direction = visual.scene === 'add' ? '右增加' : '左减少';
            aria =
              i === 0
                ? `第一段从刻度${from}向${direction}${jump}，到刻度${to}。`
                : `第二段从刻度${from}向${direction}${jump}，最后一点在刻度${expected.range[0]}和${expected.range[1]}之间，没有额外标出数字。`;
          }
          if (
            (await arrow.getAttribute('role')) !== 'img' ||
            (await arrow.getAttribute('aria-label')) !== aria
          )
            throw new Error(
              'Two-jump accessible givens changed or final answer leaked',
            );
          if (
            Number(await arrow.getAttribute('data-start')) !== from ||
            Number(await arrow.getAttribute('data-end')) !== to ||
            Number(await arrow.getAttribute('data-jump')) !== jump
          )
            throw new Error('Two-jump arrow order or conditions changed');
          if (
            (await arrow.getAttribute('d')) !==
            `M${x(from)} 100 Q${(x(from) + x(to)) / 2} ${i === 0 ? 24 : 64} ${x(to)} 100`
          )
            throw new Error('Two-jump drawn coordinates changed');
          const markerEnd = await arrow.getAttribute('marker-end');
          if (!markerEnd?.startsWith('url(#'))
            throw new Error('Two-jump arrowhead missing');
          if (
            (await svg.locator('[data-bnu-two-jump]').nth(i).textContent()) !==
            `${expected.op}${jump}`
          )
            throw new Error('Two-jump sign or change changed');
        }
        for (const [i, n] of expected.ticks.entries())
          if (
            (await svg
              .locator('[data-bnu-two-tick] path')
              .nth(i)
              .getAttribute('d')) !== `M${x(n)} 110V126`
          )
            throw new Error('Two-jump ticks drawn on wrong positions');
        if (
          !(await svg.locator('text,path').evaluateAll((nodes) =>
            nodes
              .filter((n) => !n.closest('defs'))
              .every((n) => {
                const b = n.getBBox();
                return (
                  b.x >= 0 &&
                  b.y >= 0 &&
                  b.x + b.width <= 960 &&
                  b.y + b.height <= 210 &&
                  (n.tagName !== 'text' ||
                    Number.parseFloat(getComputedStyle(n).fontSize) >= 20)
                );
              }),
          ))
        )
          throw new Error('Two-jump SVG labels or curves clipped or too small');
        if (
          !(await figure
            .locator('figcaption,p')
            .evaluateAll((nodes) =>
              nodes
                .slice(0, 3)
                .every(
                  (n) => Number.parseFloat(getComputedStyle(n).fontSize) >= 20,
                ),
            ))
        )
          throw new Error('Two-jump teaching text too small');
        const scroll = figure.locator('[data-bnu-two-scroll]');
        await scroll.evaluate((n) => (n.scrollLeft = 0));
        await scroll.focus();
        await p.keyboard.press('ArrowRight');
        if (
          !(await scroll.evaluate(
            (n) => n.scrollWidth <= n.clientWidth || n.scrollLeft > 0,
          ))
        )
          throw new Error('Two-jump keyboard scrolling failed');
        for (const [edge, value] of [
          ['first', expected.ticks[0]],
          ['last', expected.ticks.at(-1)],
          ['start', expected.points[0]],
          ['middle', expected.points[1]],
          ['end', expected.points[2]],
        ]) {
          const coordinate = x(value);
          await scroll.evaluate(
            (n, args) => {
              n.scrollLeft =
                args.edge === 'last'
                  ? n.scrollWidth
                  : Math.max(
                      0,
                      Math.min(
                        n.scrollWidth - n.clientWidth,
                        args.coordinate - n.clientWidth / 2,
                      ),
                    );
              n.scrollIntoView({ block: 'center' });
            },
            { edge, coordinate },
          );
          await p.waitForTimeout(150);
          const fits = await scroll.evaluate((n, coordinate) => {
            const r = n.getBoundingClientRect();
            return (
              r.left >= 0 &&
              r.right <= innerWidth &&
              r.top >= 0 &&
              r.bottom <= innerHeight &&
              coordinate - n.scrollLeft >= 20 &&
              coordinate - n.scrollLeft + 20 <= n.clientWidth &&
              document.documentElement.scrollWidth <= innerWidth + 1
            );
          }, coordinate);
          if (!fits)
            throw new Error('Two-jump viewport clips a tick or arrow endpoint');
          await p.screenshot({
            path: `/tmp/butler-bnu-frogs-${label}-${width}-${edge}.png`,
          });
        }
      };
      const inspectTenLine = async (visual, label) => {
        const figure = p.locator('[data-bnu-ten-line]');
        await figure.waitFor();
        const fixtures = {
          main: {
            add: {
              ticks: [20, 30, 40, 50, 60, 70, 80, 90],
              start: 30,
              end: 80,
              jump: '+50',
            },
            subtract: {
              ticks: [50, 60, 70, 80, 90, 100],
              start: 90,
              end: 60,
              jump: '−30',
            },
          },
          review: {
            add: {
              ticks: [20, 30, 40, 50, 60, 70, 80, 90],
              start: 20,
              end: 70,
              jump: '+50',
            },
            subtract: {
              ticks: [50, 60, 70, 80, 90, 100],
              start: 100,
              end: 60,
              jump: '−40',
            },
          },
        };
        const pineconeFixtures = {
          main: {
            add: {
              ticks: [21, 22, 23, 24, 25, 26],
              start: 22,
              end: 25,
              jump: '+3',
            },
            subtract: {
              ticks: [49, 59, 69, 79, 89, 99],
              start: 89,
              end: 59,
              jump: '−30',
            },
          },
          review: {
            add: {
              ticks: [21, 22, 23, 24, 25, 26],
              start: 23,
              end: 25,
              jump: '+2',
            },
            subtract: {
              ticks: [49, 59, 69, 79, 89, 99],
              start: 99,
              end: 79,
              jump: '−20',
            },
          },
        };
        const selected = flow.key === 'pinecones' ? pineconeFixtures : fixtures;
        const expected = selected[visual.variant][visual.scene];
        const svg = figure.locator('svg');
        if (
          JSON.stringify(
            await svg.locator('[data-bnu-ten-tick] text').allTextContents(),
          ) !== JSON.stringify(expected.ticks.map(String))
        )
          throw new Error('Whole-ten tick scale changed');
        const arrow = svg.locator('[data-bnu-ten-arrow]');
        const distance = Math.abs(expected.end - expected.start);
        let description;
        if (label.startsWith('english-')) {
          const direction = visual.scene === 'add' ? 'right' : 'left';
          description = `The arrow starts at ${expected.start}, moves ${direction} by ${distance}, and points to ${expected.end}.`;
        } else {
          const direction = visual.scene === 'add' ? '右，增加' : '左，减少';
          description = `箭头从刻度${expected.start}向${direction}${distance}，指向刻度${expected.end}。`;
        }
        if (
          (await arrow.getAttribute('role')) !== 'img' ||
          (await arrow.getAttribute('aria-label')) !== description
        )
          throw new Error('Whole-ten arrow accessibility conditions changed');
        if (
          Number(await arrow.getAttribute('data-start')) !== expected.start ||
          Number(await arrow.getAttribute('data-end')) !== expected.end ||
          (await svg.locator('[data-bnu-ten-jump]').textContent()) !==
            expected.jump
        )
          throw new Error('Whole-ten arrow conditions changed');
        const x = (n) =>
          48 +
          (864 * (n - expected.ticks[0])) /
            (expected.ticks.at(-1) - expected.ticks[0]);
        if (
          (await arrow.getAttribute('d')) !==
          `M${x(expected.start)} 100 Q${(x(expected.start) + x(expected.end)) / 2} 24 ${x(expected.end)} 100`
        )
          throw new Error(
            'Whole-ten arrow drawn on wrong positions or direction',
          );
        for (const [i, n] of expected.ticks.entries())
          if (
            Number(
              await svg
                .locator('[data-bnu-ten-tick] text')
                .nth(i)
                .getAttribute('x'),
            ) !== x(n)
          )
            throw new Error('Whole-ten tick coordinate changed');
        const marker = await arrow.getAttribute('marker-end');
        if (
          !marker?.startsWith('url(#') ||
          (await svg.locator('marker').count()) !== 1
        )
          throw new Error('Whole-ten arrowhead missing');
        const geometry = await svg.evaluate((n) => {
          const r = n.getBoundingClientRect();
          return [...n.querySelectorAll('path,text')]
            .filter((x) => !x.closest('defs'))
            .every((x) => {
              const b = x.getBoundingClientRect();
              return (
                b.left >= r.left &&
                b.right <= r.right &&
                b.top >= r.top &&
                b.bottom <= r.bottom &&
                (x.tagName !== 'text' ||
                  Number.parseFloat(getComputedStyle(x).fontSize) >= 20)
              );
            });
        });
        if (!geometry)
          throw new Error('Whole-ten text or path clipped or too small');
        if (
          !(await figure
            .locator('figcaption,p')
            .evaluateAll((ns) =>
              ns
                .slice(0, 3)
                .every(
                  (n) => Number.parseFloat(getComputedStyle(n).fontSize) >= 20,
                ),
            ))
        )
          throw new Error('Whole-ten legend too small');
        const region = figure.locator('[data-bnu-ten-scroll]');
        await region.evaluate((n) => {
          n.scrollLeft = 0;
        });
        await region.focus();
        await p.keyboard.press('ArrowRight');
        await p.waitForTimeout(150);
        if (
          !(await region.evaluate(
            (n) => n.scrollWidth <= n.clientWidth || n.scrollLeft > 0,
          ))
        )
          throw new Error('Whole-ten keyboard scroll failed');
        for (const edge of ['first', 'last', 'start', 'end']) {
          const value = edge === 'start' ? expected.start : expected.end;
          await region.evaluate(
            (n, { edge, x }) => {
              if (edge === 'first') n.scrollLeft = 0;
              else if (edge === 'last') n.scrollLeft = n.scrollWidth;
              else n.scrollLeft = x - n.clientWidth / 2;
              n.scrollIntoView({ block: 'center' });
            },
            { edge, x: x(value) },
          );
          await p.waitForTimeout(150);
          const fits = await region.evaluate(
            (n, { edge, value }) => {
              const r = n.getBoundingClientRect();
              const ticks = [...n.querySelectorAll('[data-bnu-ten-tick] text')];
              let target;
              if (edge === 'first') target = ticks[0];
              else if (edge === 'last') target = ticks.at(-1);
              else target = ticks.find((t) => t.textContent === String(value));
              const b = target.getBoundingClientRect();
              return (
                r.left >= 0 &&
                r.right <= innerWidth &&
                r.top >= 0 &&
                r.bottom <= innerHeight &&
                document.documentElement.scrollWidth <= innerWidth &&
                b.left >= r.left &&
                b.right <= r.right
              );
            },
            { edge, value },
          );
          if (!fits)
            throw new Error('Whole-ten full endpoint or viewport clipped');
          await p.screenshot({
            path: `/tmp/butler-bnu-${flow.key}-${label}-${width}-${edge}.png`,
          });
        }
      };
      const inspectWritten = async (visual, label) => {
        const v = visual.variant;
        const add =
          v === 'main'
            ? [
                [1, 2],
                [3, 1],
                [4, 3],
              ]
            : [
                [2, 1],
                [1, 3],
                [3, 4],
              ];
        const sub =
          v === 'main'
            ? [
                [3, 4],
                [2, 2],
                [1, 2],
              ]
            : [
                [3, 4],
                [1, 3],
                [2, 1],
              ];
        const one = (kind, rows, operator = '') => ({
          id: '1',
          kind,
          rows,
          operator,
        });
        let expected;
        switch (visual.scene) {
          case 'rods-add': {
            expected = [one('rods', add)];
            break;
          }
          case 'add-stage': {
            expected = [
              one(
                'written',
                [add[0], add[1], [null, v === 'main' ? 3 : 4]],
                '+',
              ),
            ];
            break;
          }
          case 'add-final': {
            expected = [one('written', add, '+')];
            break;
          }
          case 'rods-sub': {
            expected = [one('rods', sub)];
            break;
          }
          case 'sub-blank': {
            expected = [one('written', [sub[0], sub[1], [null, null]], '−')];
            break;
          }
          case 'sub-final': {
            expected = [one('written', sub, '−')];
            break;
          }
          case 'matching': {
            expected =
              v === 'main'
                ? [
                    {
                      id: 'A',
                      kind: 'rods',
                      rows: [
                        [2, 3],
                        [2, 1],
                        [4, 4],
                      ],
                      operator: '',
                    },
                    {
                      id: 'C',
                      kind: 'written',
                      rows: [
                        [3, 3],
                        [2, 1],
                        [1, 2],
                      ],
                      operator: '−',
                    },
                    {
                      id: 'B',
                      kind: 'rods',
                      rows: [
                        [3, 3],
                        [2, 1],
                        [1, 2],
                      ],
                      operator: '',
                    },
                    {
                      id: 'D',
                      kind: 'written',
                      rows: [
                        [2, 3],
                        [2, 1],
                        [4, 4],
                      ],
                      operator: '+',
                    },
                  ]
                : [
                    {
                      id: 'A',
                      kind: 'rods',
                      rows: [
                        [1, 2],
                        [2, 1],
                        [3, 3],
                      ],
                      operator: '',
                    },
                    {
                      id: 'C',
                      kind: 'written',
                      rows: [
                        [1, 2],
                        [2, 1],
                        [3, 3],
                      ],
                      operator: '+',
                    },
                    {
                      id: 'B',
                      kind: 'rods',
                      rows: [
                        [3, 4],
                        [1, 3],
                        [2, 1],
                      ],
                      operator: '',
                    },
                    {
                      id: 'D',
                      kind: 'written',
                      rows: [
                        [3, 4],
                        [1, 3],
                        [2, 1],
                      ],
                      operator: '−',
                    },
                  ];
            break;
          }
          case 'practice': {
            const operands =
              v === 'main'
                ? [
                    [
                      [4, 4],
                      [3, 2],
                    ],
                    [
                      [5, 4],
                      [2, 3],
                    ],
                    [
                      [7, 6],
                      [2, 3],
                    ],
                    [
                      [6, 8],
                      [1, 1],
                    ],
                  ]
                : [
                    [
                      [2, 3],
                      [4, 2],
                    ],
                    [
                      [6, 7],
                      [2, 4],
                    ],
                    [
                      [5, 2],
                      [3, 6],
                    ],
                    [
                      [8, 9],
                      [3, 5],
                    ],
                  ];
            expected = operands.map((r, i) => ({
              id: String(i + 1),
              kind: 'written',
              operator: i % 2 === 0 ? '+' : '−',
              rows: [...r, [null, null]],
            }));
            break;
          }
          default: {
            throw new Error('Unknown written scene');
          }
        }
        await p.locator('[data-bnu-written]').waitFor();
        await p.waitForTimeout(120);
        let blank = 0;
        const actual = await p
          .locator('[data-bnu-written-panel]')
          .evaluateAll((nodes) =>
            nodes.map((n) => ({
              id: n.dataset.panel,
              kind: n.dataset.kind,
              rows: [...n.querySelectorAll('tbody tr')].map((row) => {
                const cells = [...row.querySelectorAll('td')];
                return cells.slice(1).map((cell) => {
                  const rod = cell.querySelector('[data-bnu-written-rods]');
                  if (rod) {
                    const lines = [
                      ...rod.querySelectorAll('[data-bnu-written-rod]'),
                    ];
                    if (lines.length !== Number(rod.dataset.count))
                      throw new Error('Rod count mismatch');
                    for (const line of lines) {
                      const horizontal = rod.dataset.place === 'tens';
                      if (
                        horizontal
                          ? line.getAttribute('y1') !== line.getAttribute('y2')
                          : line.getAttribute('x1') !== line.getAttribute('x2')
                      )
                        throw new Error('Rod orientation mismatch');
                    }
                    if (!rod.getAttribute('aria-label'))
                      throw new Error('Missing rod equivalent');
                    return Number(rod.dataset.count);
                  }
                  const digit = cell.querySelector('[data-bnu-written-digit]');
                  return digit.dataset.blank === 'true'
                    ? digit.textContent.trim()
                    : Number(digit.textContent.trim());
                });
              }),
              signs: [...n.querySelectorAll('tbody tr')].map(
                (r) =>
                  r
                    .querySelector('td')
                    .textContent.trim()
                    .match(/^[+−]/)?.[0] || '',
              ),
            })),
          );
        const fixture = expected.map((x) => ({
          id: x.id,
          kind: x.kind,
          rows: x.rows.map((r) =>
            r.map((n) => (n === null ? String.fromCodePoint(65 + blank++) : n)),
          ),
          signs: ['', x.operator, ''],
        }));
        if (JSON.stringify(actual) !== JSON.stringify(fixture))
          throw new Error(
            `Written fixture ${label}: ${JSON.stringify(actual)}`,
          );
        const region = p.locator('[data-bnu-written-scroll]');
        const before = await region.evaluate((n) => ({
          client: n.clientWidth,
          scroll: n.scrollWidth,
        }));
        for (const edge of ['left', 'right']) {
          await region.evaluate((n, e) => {
            n.scrollLeft = e === 'left' ? 0 : n.scrollWidth;
          }, edge);
          await region.scrollIntoViewIfNeeded();
          await p.screenshot({
            path: `/tmp/butler-bnu-written-${label}-${width}-${edge}.png`,
          });
        }
        if (before.scroll > before.client) {
          await region.evaluate((n) => {
            n.scrollLeft = 0;
          });
          await region.focus();
          await p.keyboard.press('ArrowRight');
          if ((await region.evaluate((n) => n.scrollLeft)) <= 0)
            throw new Error('Written keyboard scrolling failed');
        }
        await region.evaluate((n) => {
          n.scrollLeft = 0;
        });
        const geometry = await p
          .locator('[data-bnu-written]')
          .evaluate((root) => {
            const small = [
              ...root.querySelectorAll(
                '[data-bnu-written-digit],thead span,tbody td:first-child span',
              ),
            ].filter(
              (n) => Number.parseFloat(getComputedStyle(n).fontSize) < 20,
            );
            const panels = [
              ...root.querySelectorAll('[data-bnu-written-panel]'),
            ].map((n) => n.getBoundingClientRect());
            const overlap = panels.some((a, i) =>
              panels.some(
                (b, j) =>
                  i !== j &&
                  Math.min(a.right, b.right) > Math.max(a.left, b.left) + 1 &&
                  Math.min(a.bottom, b.bottom) > Math.max(a.top, b.top) + 1,
              ),
            );
            return {
              small: small.length,
              overlap,
              page: document.documentElement.scrollWidth > innerWidth + 1,
            };
          });
        if (geometry.small || geometry.overlap || geometry.page)
          throw new Error(
            `Written geometry ${label}: ${JSON.stringify(geometry)}`,
          );
      };
      const inspectInteresting = async (visual, label) => {
        const fixtures = {
          main: {
            addition: [
              [11, 11, null],
              [12, 21, null],
              [13, 31, null],
              [14, null, null],
              [null, null, null],
              [null, null, null],
              [null, null, null],
              [null, null, null],
            ],
            subtraction: [
              [22, 11, null],
              [33, 21, null],
              [44, 31, null],
              [55, null, null],
              [null, null, null],
              [null, null, null],
              [null, null, null],
              [null, null, null],
            ],
            eleven: [
              [1, null, 12],
              [12, null, 23],
              [23, null, 34],
              [34, null, 45],
              [45, null, 56],
              [56, null, 67],
              [67, null, 78],
              [78, null, 89],
            ],
          },
          review: {
            addition: [
              [18, 81, null],
              [17, 71, null],
              [16, 61, null],
              [15, 51, null],
              [14, 41, null],
              [13, 31, null],
              [12, 21, null],
              [11, 11, null],
            ],
            subtraction: [
              [99, 81, null],
              [88, 71, null],
              [77, 61, null],
              [66, 51, null],
              [55, 41, null],
              [44, 31, null],
              [33, 21, null],
              [22, 11, null],
            ],
            eleven: [
              [2, null, 24],
              [12, null, 34],
              [22, null, 44],
              [32, null, 54],
              [42, null, 64],
              [52, null, 74],
              [62, null, 84],
              [72, null, 94],
            ],
          },
        };
        let blank = 0;
        const expected = fixtures[visual.variant][visual.scene].map((r) =>
          r.map((n) =>
            n === null ? String.fromCodePoint(65 + blank++) : String(n),
          ),
        );
        await p.locator('[data-bnu-interesting]').waitFor();
        await p.waitForTimeout(120);
        const actual = await p
          .locator('[data-bnu-interesting] tbody tr')
          .evaluateAll((nodes) =>
            nodes.map((row) =>
              [...row.querySelectorAll('[data-bnu-interesting-cell]')].map(
                (cell) =>
                  [...cell.childNodes]
                    .filter((n) => n.nodeType === Node.TEXT_NODE)
                    .map((n) => n.textContent)
                    .join('')
                    .trim(),
              ),
            ),
          );
        if (JSON.stringify(actual) !== JSON.stringify(expected))
          throw new Error(
            `Interesting fixture ${label}: ${JSON.stringify(actual)}`,
          );
        if ((await p.locator('[data-bnu-interesting-empty]').count()) !== blank)
          throw new Error('Missing visible empty-cell markers');
        const operations = await p
          .locator('[data-bnu-interesting-operator]')
          .allTextContents();
        if (
          JSON.stringify(operations) !==
          JSON.stringify(
            Array.from({ length: 8 }, () => [
              '',
              visual.scene === 'subtraction' ? '−' : '+',
              '=',
            ]).flat(),
          )
        )
          throw new Error('Interesting operations changed');
        const region = p.locator('[data-bnu-interesting-scroll]');
        const before = await region.evaluate((n) => ({
          client: n.clientWidth,
          scroll: n.scrollWidth,
        }));
        for (const edge of ['left', 'right']) {
          await region.evaluate((n, e) => {
            n.scrollLeft = e === 'left' ? 0 : n.scrollWidth;
          }, edge);
          await region.scrollIntoViewIfNeeded();
          await p.screenshot({
            path: `/tmp/butler-bnu-interesting-${label}-${width}-${edge}.png`,
          });
        }
        if (before.scroll > before.client) {
          await region.evaluate((n) => {
            n.scrollLeft = 0;
          });
          await region.focus();
          await p.keyboard.press('ArrowRight');
          if ((await region.evaluate((n) => n.scrollLeft)) <= 0)
            throw new Error('Interesting keyboard scrolling failed');
        }
        await region.evaluate((n) => {
          n.scrollLeft = 0;
        });
        const geometry = await p
          .locator('[data-bnu-interesting]')
          .evaluate((root) => {
            const bad = [
              ...root.querySelectorAll('thead span,tbody td span'),
            ].some((n) => Number.parseFloat(getComputedStyle(n).fontSize) < 20);
            const luminance = (color) => {
              const rgb = color
                .match(/[\d.]+/g)
                ?.slice(0, 3)
                .map(Number);
              if (!rgb || rgb.length !== 3)
                throw new Error('Unrecognized rendered color');
              return rgb
                .map((n) => n / 255)
                .map((n) =>
                  n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4,
                )
                .reduce(
                  (sum, n, i) => sum + n * [0.2126, 0.7152, 0.0722][i],
                  0,
                );
            };
            const bg = luminance(getComputedStyle(root).backgroundColor);
            const fg = luminance(
              getComputedStyle(root.querySelector('figcaption')).color,
            );
            const contrast =
              (Math.max(bg, fg) + 0.05) / (Math.min(bg, fg) + 0.05);
            const clipped = [
              ...root.querySelectorAll('[data-bnu-interesting-cell]'),
            ].some((n) => n.scrollWidth > n.clientWidth + 1);
            return {
              bad,
              clipped,
              contrast,
              page: document.documentElement.scrollWidth > innerWidth + 1,
            };
          });
        if (
          geometry.bad ||
          geometry.clipped ||
          geometry.page ||
          geometry.contrast < 4.5
        )
          throw new Error(
            `Interesting geometry ${label}: ${JSON.stringify(geometry)}`,
          );
      };
      const inspectRecycling = async (visual, label) => {
        const matched = visual.variant === 'main' ? 13 : 17;
        const extra = visual.variant === 'main' ? 3 : 2;
        const root = p.locator('[data-bnu-recycling]');
        await root.waitFor();
        if (visual.scene === 'circles') {
          for (const [key, count] of [
            ['lin', matched],
            ['matched', matched],
            ['extra', extra],
          ]) {
            if (
              (await root
                .locator(`[data-recycling-circle="${key}"]`)
                .count()) !== count
            )
              throw new Error(`Recycling circle count ${key}`);
          }
          const pairs = await root
            .locator('[data-recycling-circle="lin"]')
            .evaluateAll((nodes) => nodes.map((n) => n.getAttribute('cx')));
          const aligned = await root
            .locator('[data-recycling-circle="matched"]')
            .evaluateAll((nodes) => nodes.map((n) => n.getAttribute('cx')));
          if (JSON.stringify(pairs) !== JSON.stringify(aligned))
            throw new Error('Recycling one-to-one alignment');
          const last = Number(pairs.at(-1));
          const firstExtra = Number(
            await root
              .locator('[data-recycling-circle="extra"]')
              .first()
              .getAttribute('cx'),
          );
          if (firstExtra - last < 40)
            throw new Error('Recycling extra circles not separated');
        } else {
          if (
            (await root.locator('[data-recycling-bundle] rect').count()) !==
              10 ||
            (await root.locator('[data-recycling-rod="before"]').count()) !==
              (visual.variant === 'main' ? 3 : 7) ||
            (await root.locator('[data-recycling-rod="extra"]').count()) !==
              extra
          )
            throw new Error('Recycling stick diagram counts');
        }
        const geometry = await root.locator('svg').evaluate((svg) => ({
          clipped: [...svg.querySelectorAll('circle,rect,text')].some((n) => {
            const b = n.getBBox();
            return (
              b.x < 0 ||
              b.y < 0 ||
              b.x + b.width > 720 ||
              b.y + b.height > svg.viewBox.baseVal.height
            );
          }),
          small: [...svg.querySelectorAll('text')].some(
            (n) => Number.parseFloat(getComputedStyle(n).fontSize) < 20,
          ),
          page: document.documentElement.scrollWidth > innerWidth + 1,
        }));
        if (geometry.clipped || geometry.small || geometry.page)
          throw new Error(
            `Recycling geometry ${label}: ${JSON.stringify(geometry)}`,
          );
        const contrast = await root.evaluate((node) => {
          const luminance = (color) =>
            color
              .match(/[\d.]+/g)
              .slice(0, 3)
              .map(Number)
              .map((v) => v / 255)
              .map((v) =>
                v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4,
              )
              .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
          const bg = luminance(getComputedStyle(node).backgroundColor);
          const fg = luminance(
            getComputedStyle(node.querySelector('svg')).color,
          );
          return (Math.max(bg, fg) + 0.05) / (Math.min(bg, fg) + 0.05);
        });
        if (contrast < 4.5)
          throw new Error(`Recycling figure contrast ${label}: ${contrast}`);
        const region = root.locator('[data-bnu-recycling-scroll]');
        for (const edge of ['left', 'right']) {
          await region.evaluate((n, e) => {
            n.scrollLeft = e === 'left' ? 0 : n.scrollWidth;
          }, edge);
          await region.scrollIntoViewIfNeeded();
          await p.screenshot({
            path: `/tmp/butler-bnu-recycling-${label}-${width}-${edge}.png`,
          });
        }
        await region.evaluate((n) => {
          n.scrollLeft = 0;
        });
        if (await region.evaluate((n) => n.scrollWidth > n.clientWidth)) {
          await region.focus();
          await p.keyboard.press('ArrowRight');
          if ((await region.evaluate((n) => n.scrollLeft)) <= 0)
            throw new Error('Recycling keyboard scroll');
        }
        await region.evaluate((n) => {
          n.scrollLeft = 0;
        });
      };
      const inspectFoldOne = async (visual, label) => {
        const r = 60 * Math.SQRT2;
        const rect = (x, y, w, h) => [
          [x, y],
          [x + w, y],
          [x + w, y + h],
          [x, y + h],
        ];
        const arc = (a, b, sweep) => ({
          a,
          b,
          sweep,
          radius: Math.hypot(b[0] - a[0], b[1] - a[1]) / 2,
        });
        const semicircle = (x, y, r, lower = false) =>
          arc([x - r, y], [x + r, y], lower ? 0 : 1);
        const fixtures = {
          'square-mid': [rect(100, 60, 160, 80), rect(100, 140, 160, 80)],
          'square-diagonal': [
            [
              [100, 60],
              [260, 60],
              [260, 220],
            ],
            [
              [100, 60],
              [260, 220],
              [100, 220],
            ],
          ],
          'rectangle-mid': [rect(60, 60, 240, 80), rect(60, 140, 240, 80)],
          'triangle-mid': [
            [
              [60, 220],
              [180, 60],
              [180, 220],
            ],
            [
              [180, 60],
              [300, 220],
              [180, 220],
            ],
          ],
          'circle-mid': [
            semicircle(180, 140, 80),
            semicircle(180, 140, 80, true),
          ],
          'four-triangles': [
            [
              [120, 80],
              [240, 80],
              [180, 140],
            ],
            [
              [240, 80],
              [240, 200],
              [180, 140],
            ],
            [
              [240, 200],
              [120, 200],
              [180, 140],
            ],
            [
              [120, 200],
              [120, 80],
              [180, 140],
            ],
          ],
          'joined-triangle': [
            [
              [60, 220],
              [120, 160],
              [180, 220],
            ],
            [
              [120, 160],
              [180, 100],
              [180, 220],
            ],
            [
              [180, 100],
              [240, 160],
              [180, 220],
            ],
            [
              [180, 220],
              [240, 160],
              [300, 220],
            ],
          ],
          'joined-trapezoid': [
            [
              [40, 200],
              [40 + r, 200 - r],
              [40 + r, 200],
            ],
            [
              [40 + r, 200 - r],
              [40 + 2 * r, 200 - r],
              [40 + r, 200],
            ],
            [
              [40 + 2 * r, 200 - r],
              [40 + 2 * r, 200],
              [40 + r, 200],
            ],
            [
              [40 + 2 * r, 200 - r],
              [40 + 3 * r, 200],
              [40 + 2 * r, 200],
            ],
          ],
          'copy-triangle': [
            [
              [100, 220],
              [180, 140],
              [180, 220],
            ],
            [
              [180, 140],
              [260, 220],
              [180, 220],
            ],
          ],
          'copy-slant': [
            [
              [100, 180],
              [180, 100],
              [180, 180],
            ],
            [
              [180, 100],
              [260, 100],
              [180, 180],
            ],
          ],
          'copy-mushroom': [semicircle(180, 110, 80), rect(160, 110, 40, 120)],
          'copy-flag': [
            rect(130, 50, 40, 80),
            rect(130, 130, 40, 80),
            [
              [170, 50],
              [250, 130],
              [170, 130],
            ],
          ],
          flower: [
            arc([180, 30], [180, 110], 1),
            arc([180, 110], [180, 30], 1),
            arc([170, 120], [100, 80], 1),
            arc([190, 120], [260, 80], 0),
            rect(170, 110, 20, 130),
            [
              [170, 190],
              [120, 150],
              [120, 190],
            ],
            [
              [190, 190],
              [240, 150],
              [240, 190],
            ],
          ],
          fish: [
            [
              [150, 140],
              [90, 80],
              [100, 130],
            ],
            [
              [150, 140],
              [90, 200],
              [100, 150],
            ],
            rect(150, 100, 80, 40),
            rect(150, 140, 80, 40),
            semicircle(270, 100, 40),
            semicircle(270, 100, 40, true),
            semicircle(270, 180, 40),
            semicircle(270, 180, 40, true),
          ],
        };
        const squares = {
          'square-two-large': [
            [
              1,
              [
                [0, 2],
                [2, 0],
                [4, 2],
              ],
            ],
            [
              2,
              [
                [0, 2],
                [4, 2],
                [2, 4],
              ],
            ],
          ],
          'square-two-small': [
            [
              4,
              [
                [0, 1],
                [1, 0],
                [2, 1],
              ],
            ],
            [
              6,
              [
                [0, 1],
                [2, 1],
                [1, 2],
              ],
            ],
          ],
          'square-three': [
            [
              7,
              [
                [0, 0],
                [0, 2],
                [2, 2],
              ],
            ],
            [
              4,
              [
                [0, 0],
                [2, 0],
                [1, 1],
              ],
            ],
            [
              6,
              [
                [2, 0],
                [2, 2],
                [1, 1],
              ],
            ],
          ],
          'square-four-square': [
            [
              1,
              [
                [0, 2],
                [2, 0],
                [4, 2],
              ],
            ],
            [
              5,
              [
                [2, 2],
                [3, 3],
                [2, 4],
                [1, 3],
              ],
            ],
            [
              4,
              [
                [0, 2],
                [2, 2],
                [1, 3],
              ],
            ],
            [
              6,
              [
                [2, 2],
                [4, 2],
                [3, 3],
              ],
            ],
          ],
          'square-four-triangle': [
            [
              1,
              [
                [0, 2],
                [2, 0],
                [4, 2],
              ],
            ],
            [
              7,
              [
                [0, 2],
                [2, 2],
                [2, 4],
              ],
            ],
            [
              4,
              [
                [2, 2],
                [4, 2],
                [3, 3],
              ],
            ],
            [
              6,
              [
                [2, 2],
                [3, 3],
                [2, 4],
              ],
            ],
          ],
        };
        for (const [scene, recipe] of Object.entries(squares))
          fixtures[scene] = recipe.map(([id, points]) =>
            place(id, 80, 60, points),
          );
        const expected = fixtures[visual.scene];
        if (!expected) throw new Error('Unknown fold fixture');
        const root = p.locator('[data-bnu-fold-one]');
        await root.waitFor();
        const region = root.locator('[data-bnu-fold-scroll]');
        await region.scrollIntoViewIfNeeded();
        await p.waitForTimeout(150);
        const checks = await root.evaluate(
          (node, { expected, review }) => {
            const svg = node.querySelector('svg');
            const group = svg.firstElementChild;
            const pieces = [...svg.querySelectorAll('[data-fold-piece]')];
            const convert = ([x, y]) => (review ? [360 - x, 280 - y] : [x, y]);
            return {
              transform: group.getAttribute('transform'),
              viewBox: svg.getAttribute('viewBox'),
              caption: node.querySelector('figcaption').textContent.trim(),
              missingAria: !svg.getAttribute('aria-label'),
              rawKeys: node.textContent.includes('educationLearning.'),
              small: [...node.querySelectorAll('p,figcaption')].some(
                (n) => Number.parseFloat(getComputedStyle(n).fontSize) < 20,
              ),
              overflow: document.documentElement.scrollWidth > innerWidth + 1,
              pieces: pieces.map((g, i) => {
                const shape = g.querySelector('path');
                const text = g.querySelector('text');
                const title = g.querySelector('title');
                const bbox = shape.getBBox();
                const tb = text.getBBox();
                const exp = expected[i];
                const numbers = shape
                  .getAttribute('d')
                  .match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/g)
                  .map(Number);
                const values = Array.isArray(exp)
                  ? exp.flat()
                  : [
                      ...exp.a,
                      exp.radius,
                      exp.radius,
                      0,
                      0,
                      exp.sweep,
                      ...exp.b,
                    ];
                const match =
                  numbers.length === values.length &&
                  numbers.every((n, j) => Math.abs(n - values[j]) < 1e-7);
                const first = convert(Array.isArray(exp) ? exp[0] : exp.a);
                return {
                  match,
                  letter: g.dataset.foldPiece,
                  text: text.textContent.trim(),
                  font: Number.parseFloat(getComputedStyle(text).fontSize),
                  clipped:
                    bbox.x < 2 ||
                    bbox.y < 2 ||
                    bbox.x + bbox.width > 358 ||
                    bbox.y + bbox.height > 278 ||
                    tb.x < 2 ||
                    tb.y < 2 ||
                    tb.x + tb.width > 358 ||
                    tb.y + tb.height > 278,
                  title: title.textContent,
                  coordinates: title.textContent.includes(
                    `(${first[0]}, ${first[1]})`,
                  ),
                  labelTransform: text.getAttribute('transform'),
                  x: Number(text.getAttribute('x')),
                  y: Number(text.getAttribute('y')),
                };
              }),
            };
          },
          { expected, review: visual.variant === 'review' },
        );
        if (
          checks.transform !==
            (visual.variant === 'review' ? 'rotate(180 180 140)' : null) ||
          checks.viewBox !== '0 0 360 280' ||
          checks.pieces.length !== expected.length ||
          checks.small ||
          checks.missingAria ||
          checks.rawKeys ||
          checks.overflow
        )
          throw new Error(`Fold root ${label}: ${JSON.stringify(checks)}`);
        for (const [i, c] of checks.pieces.entries())
          if (
            !c.match ||
            c.letter !== String.fromCodePoint(65 + i) ||
            c.text !== c.letter ||
            c.font < 20 ||
            c.clipped ||
            !c.coordinates ||
            !c.title.includes(c.letter) ||
            c.labelTransform !==
              (visual.variant === 'review' ? `rotate(180 ${c.x} ${c.y})` : null)
          )
            throw new Error(
              `Fold geometry ${label} ${i}: ${JSON.stringify(c)}`,
            );
        if (
          !/^折剪拼观察图 \d+$|^Folding and composition diagram \d+$/.test(
            checks.caption,
          )
        )
          throw new Error(
            'Fold caption reveals answers or missing translation',
          );
        for (const edge of ['left', 'right']) {
          await region.evaluate((n, edge) => {
            n.scrollLeft = edge === 'left' ? 0 : n.scrollWidth;
          }, edge);
          const visible = await region.evaluate((n) => {
            const box = n.getBoundingClientRect();
            return box.left >= -1 && box.right <= innerWidth + 1;
          });
          if (!visible) throw new Error('Fold scrolling viewport outside page');
          await p.screenshot({
            path: `/tmp/butler-bnu-fold-${label}-${width}-${edge}.png`,
          });
        }
        await region.evaluate((n) => {
          n.scrollLeft = 0;
        });
        if (await region.evaluate((n) => n.scrollWidth > n.clientWidth)) {
          await region.focus();
          await p.keyboard.press('ArrowRight');
          if ((await region.evaluate((n) => n.scrollLeft)) <= 0)
            throw new Error('Fold keyboard right scrolling failed');
          await p.keyboard.press('ArrowLeft');
          if ((await region.evaluate((n) => n.scrollLeft)) !== 0)
            throw new Error('Fold keyboard left scrolling failed');
        }
        await region.evaluate((n) => {
          n.scrollLeft = 0;
        });
      };
      const inspectFoldPaper = async (label) => {
        const root = p.locator('[data-paper-fold]');
        await root.waitFor();
        const shapes = root.locator('svg polygon');
        if ((await shapes.count()) !== 2)
          throw new Error('Fold-to-square must stop at one fold');
        const expected = [
          '48,48 208,48 208,128 48,128',
          '48,48 128,48 128,128 48,128',
        ];
        for (let i = 0; i < 2; i++) {
          const shape = shapes.nth(i);
          await shape.scrollIntoViewIfNeeded();
          const geometry = await shape.evaluate((node) => {
            const b = node.getBBox();
            const svg = node.closest('svg');
            const box = svg.getBoundingClientRect();
            return {
              points: node.getAttribute('points'),
              box: svg.getAttribute('viewBox'),
              aria: svg.getAttribute('aria-label'),
              clipped:
                b.x < 2 ||
                b.y < 2 ||
                b.x + b.width > 254 ||
                b.y + b.height > 254,
              viewport: box.left >= -1 && box.right <= innerWidth + 1,
            };
          });
          if (
            geometry.points !== expected[i] ||
            geometry.box !== '0 0 256 256' ||
            !geometry.aria ||
            geometry.aria.includes('educationLearning.') ||
            geometry.clipped ||
            !geometry.viewport
          )
            throw new Error(
              `Fold-to-square geometry ${label}: ${JSON.stringify(geometry)}`,
            );
        }
        if (
          await root.evaluate(
            (node) =>
              [...node.querySelectorAll('p')].some(
                (n) => Number.parseFloat(getComputedStyle(n).fontSize) < 20,
              ) || document.documentElement.scrollWidth > innerWidth + 1,
          )
        )
          throw new Error('Paper-fold small text or page overflow');
        await p.screenshot({
          path: `/tmp/butler-bnu-fold-paper-${label}-${width}.png`,
        });
      };
      const inspectTangram = async (visual, label) => {
        const units = {
          1: [
            [0, 0],
            [4, 0],
            [2, 2],
          ],
          2: [
            [0, 0],
            [2, 2],
            [0, 4],
          ],
          3: [
            [4, 0],
            [4, 2],
            [3, 3],
            [3, 1],
          ],
          4: [
            [2, 2],
            [3, 1],
            [3, 3],
          ],
          5: [
            [2, 2],
            [3, 3],
            [2, 4],
            [1, 3],
          ],
          6: [
            [0, 4],
            [1, 3],
            [2, 4],
          ],
          7: [
            [4, 2],
            [4, 4],
            [2, 4],
          ],
        };
        const place = (
          id,
          x = 80,
          y = 60,
          points = units[id],
          normalize = false,
        ) => {
          const left = normalize ? Math.min(...points.map((p) => p[0])) : 0;
          const top = normalize ? Math.min(...points.map((p) => p[1])) : 0;
          return {
            id,
            points: points.map(([a, b]) => [
              x + (a - left) * 50,
              y + (b - top) * 50,
            ]),
          };
        };
        const fixtures = {
          square: [1, 2, 3, 4, 5, 6, 7].map((id) => place(id)),
          spread: [
            [1, 24, 24],
            [2, 240, 24],
            [3, 24, 274],
            [4, 124, 274],
            [5, 240, 274],
            [6, 24, 474],
            [7, 174, 474],
          ].map(([id, x, y]) => place(id, x, y, undefined, true)),
          trace: [
            place(3, 40, 40, undefined, true),
            place(5, 150, 40, undefined, true),
            place(7, 150, 240, undefined, true),
          ],
          'large-triangle': [1, 2].map((id) => place(id)),
          'small-triangle': [
            place(4, 80, 60, [
              [0, 0],
              [2, 0],
              [1, 1],
            ]),
            place(6, 80, 60, [
              [0, 0],
              [1, 1],
              [0, 2],
            ]),
          ],
          'goose-head': [3, 4].map((id) => place(id)),
          'fish-head': [1, 2].map((id) => place(id)),
        };
        const squares = {
          'square-two-large': [
            [
              1,
              [
                [0, 2],
                [2, 0],
                [4, 2],
              ],
            ],
            [
              2,
              [
                [0, 2],
                [4, 2],
                [2, 4],
              ],
            ],
          ],
          'square-two-small': [
            [
              4,
              [
                [0, 1],
                [1, 0],
                [2, 1],
              ],
            ],
            [
              6,
              [
                [0, 1],
                [2, 1],
                [1, 2],
              ],
            ],
          ],
          'square-three': [
            [
              7,
              [
                [0, 0],
                [0, 2],
                [2, 2],
              ],
            ],
            [
              4,
              [
                [0, 0],
                [2, 0],
                [1, 1],
              ],
            ],
            [
              6,
              [
                [2, 0],
                [2, 2],
                [1, 1],
              ],
            ],
          ],
          'square-four-square': [
            [
              1,
              [
                [0, 2],
                [2, 0],
                [4, 2],
              ],
            ],
            [
              5,
              [
                [2, 2],
                [3, 3],
                [2, 4],
                [1, 3],
              ],
            ],
            [
              4,
              [
                [0, 2],
                [2, 2],
                [1, 3],
              ],
            ],
            [
              6,
              [
                [2, 2],
                [4, 2],
                [3, 3],
              ],
            ],
          ],
          'square-four-triangle': [
            [
              1,
              [
                [0, 2],
                [2, 0],
                [4, 2],
              ],
            ],
            [
              7,
              [
                [0, 2],
                [2, 2],
                [2, 4],
              ],
            ],
            [
              4,
              [
                [2, 2],
                [4, 2],
                [3, 3],
              ],
            ],
            [
              6,
              [
                [2, 2],
                [3, 3],
                [2, 4],
              ],
            ],
          ],
        };
        for (const [scene, recipe] of Object.entries(squares))
          fixtures[scene] = recipe.map(([id, points]) =>
            place(id, 80, 60, points),
          );
        const expected = fixtures[visual.scene];
        if (!expected) throw new Error('Unknown tangram fixture');
        const height = { spread: 610, trace: 430 }[visual.scene] ?? 360;
        const root = p.locator('[data-bnu-tangram]');
        await root.waitFor();
        const region = root.locator('[data-tangram-scroll]');
        await region.scrollIntoViewIfNeeded();
        await p.waitForTimeout(150);
        const result = await root.evaluate(
          (node, { expected, height, review }) => {
            const svg = node.querySelector('svg');
            const caption = node.querySelector('figcaption').textContent.trim();
            const pieces = [...svg.querySelectorAll('[data-tangram-piece]')];
            return {
              box: svg.getAttribute('viewBox'),
              width: svg.getBoundingClientRect().width,
              height: svg.getBoundingClientRect().height,
              transform: svg.firstElementChild.getAttribute('transform'),
              caption,
              aria: svg.getAttribute('aria-label'),
              raw: node.textContent.includes('educationLearning.'),
              small: [...node.querySelectorAll('p,figcaption')].some(
                (n) => Number.parseFloat(getComputedStyle(n).fontSize) < 20,
              ),
              overflow: document.documentElement.scrollWidth > innerWidth + 1,
              pieces: pieces.map((g, i) => {
                const exp = expected[i];
                const poly = g.querySelector('polygon');
                const text = g.querySelector('text');
                const title = g.querySelector('title').textContent;
                const actual = poly
                  .getAttribute('points')
                  .trim()
                  .split(/\s+/)
                  .map((pair) => pair.split(',').map(Number));
                const box = poly.getBBox();
                const tb = text.getBBox();
                const label = [0, 1].map(
                  (axis) =>
                    exp.points.reduce((sum, point) => sum + point[axis], 0) /
                    exp.points.length,
                );
                const ariaCoordinates = exp.points.every(([x, y]) =>
                  title.includes(
                    `(${review ? 360 - x : x}, ${review ? height - y : y})`,
                  ),
                );
                return {
                  id: Number(g.dataset.tangramPiece),
                  text: text.textContent.trim(),
                  points: JSON.stringify(actual) === JSON.stringify(exp.points),
                  label: label.every(
                    (n, axis) =>
                      Math.abs(
                        n - Number(text.getAttribute(axis ? 'y' : 'x')),
                      ) < 1e-7,
                  ),
                  font: Number.parseFloat(getComputedStyle(text).fontSize),
                  coordinates: ariaCoordinates,
                  labelTransform: text.getAttribute('transform'),
                  expectedTransform: review
                    ? `rotate(180 ${label[0]} ${label[1]})`
                    : null,
                  clipped:
                    box.x < 2 ||
                    box.y < 2 ||
                    box.x + box.width > 358 ||
                    box.y + box.height > height - 2 ||
                    tb.x < 2 ||
                    tb.y < 2 ||
                    tb.x + tb.width > 358 ||
                    tb.y + tb.height > height - 2,
                };
              }),
            };
          },
          { expected, height, review: visual.variant === 'review' },
        );
        if (
          result.box !== `0 0 360 ${height}` ||
          Math.abs(result.width - 360) > 1 ||
          Math.abs(result.height - height) > 1 ||
          result.transform !==
            (visual.variant === 'review'
              ? `rotate(180 180 ${height / 2})`
              : null) ||
          !result.aria ||
          result.raw ||
          result.small ||
          result.overflow ||
          result.pieces.length !== expected.length ||
          /三角形|正方形|平行四边形|triangle|square|parallelogram/i.test(
            result.caption,
          )
        )
          throw new Error(`Tangram root ${label}: ${JSON.stringify(result)}`);
        result.pieces.forEach((piece, i) => {
          if (
            piece.id !== expected[i].id ||
            piece.text !== String(piece.id) ||
            !piece.points ||
            !piece.label ||
            piece.font < 20 ||
            !piece.coordinates ||
            piece.clipped ||
            piece.labelTransform !== piece.expectedTransform
          )
            throw new Error(`Tangram piece ${label}: ${JSON.stringify(piece)}`);
        });
        const scrolling = await region.evaluate((n) => ({
          width: n.clientWidth,
          scroll: n.scrollWidth,
        }));
        const initialScroll = await region.evaluate((n) => n.scrollLeft);
        const artwork = await region.evaluate((n) => {
          const frame = n.getBoundingClientRect();
          const boxes = [...n.querySelectorAll('polygon')].map((p) =>
            p.getBoundingClientRect(),
          );
          return {
            left: Math.min(...boxes.map((b) => b.left)) - frame.left,
            right: Math.max(...boxes.map((b) => b.right)) - frame.left,
            width:
              Math.max(...boxes.map((b) => b.right)) -
              Math.min(...boxes.map((b) => b.left)),
          };
        });
        if (
          scrolling.scroll > scrolling.width + 1 &&
          (artwork.left < 0 ||
            artwork.left > 24 ||
            (artwork.width <= scrolling.width - 40 &&
              artwork.right > scrolling.width - 8))
        )
          throw new Error(
            `Tangram initial artwork viewport ${label}: ${JSON.stringify(artwork)}`,
          );

        if (scrolling.scroll > scrolling.width + 1) {
          await region.evaluate((n) => (n.scrollLeft = 0));
          await region.focus();
          await region.press('ArrowRight');
          await p.waitForTimeout(100);
          if ((await region.evaluate((n) => n.scrollLeft)) <= 0)
            throw new Error('Tangram keyboard right unavailable');
          await region.evaluate((n) => (n.scrollLeft = n.scrollWidth));
          await region.press('ArrowLeft');
          await p.waitForTimeout(100);
          if (
            (await region.evaluate((n) => n.scrollLeft)) >=
            scrolling.scroll - scrolling.width
          )
            throw new Error('Tangram keyboard left unavailable');
        }
        await region.evaluate(
          (n, left) => (n.scrollLeft = left),
          initialScroll,
        );
        await p.screenshot({
          path: `/tmp/butler-bnu-${flow.key}-${label}-${width}.png`,
        });
      };
      const inspectTangramTeaching = async (step) => {
        const scenes = {
          'tangram-recognize': [
            'square',
            'spread',
            'spread',
            'square',
            'square',
            'spread',
            'square',
            'trace',
            null,
          ],
          'tangram-patterns': [null, 'goose-head', 'fish-head'],
          'tangram-practice': ['spread', 'large-triangle', 'small-triangle'],
          'tangram-square': [
            'square',
            null,
            'square-two-large',
            'square-two-small',
            'square-three',
            'square-four-square',
            'square-four-square',
            'square-four-square',
            'square-four-triangle',
            'square-four-triangle',
            null,
            null,
          ],
        };
        const scene = scenes[flow.key]?.[step];
        if (!scene) return;
        const visual = { kind: 'bnu-tangram', scene, variant: 'main' };
        await inspectTangram(visual, `learn-${step}`);
        const state = JSON.stringify(await read());
        await p
          .locator('button[aria-haspopup="menu"]')
          .filter({ has: p.locator('svg.lucide-languages') })
          .click();
        await p.getByText('English', { exact: true }).click();
        await p.waitForTimeout(600);
        await inspectTangram(visual, `learn-${step}-en`);
        const wasDark = await p.evaluate(() =>
          document.documentElement.classList.contains('dark'),
        );
        await p.locator('.theme-toggle svg').click();
        await p.waitForFunction(
          (was) => document.documentElement.classList.contains('dark') !== was,
          wasDark,
        );
        await p.waitForTimeout(600);
        await inspectTangram(visual, `learn-${step}-en-theme`);
        await p.locator('.theme-toggle svg').click();
        await p.waitForFunction(
          (was) => document.documentElement.classList.contains('dark') === was,
          wasDark,
        );
        await p.waitForTimeout(600);
        await p
          .locator('button[aria-haspopup="menu"]')
          .filter({ has: p.locator('svg.lucide-languages') })
          .click();
        await p.getByText('简体中文', { exact: true }).click();
        await p.waitForTimeout(600);
        if (JSON.stringify(await read()) !== state)
          throw new Error('Tangram language/theme changed records');
        await inspectTangram(visual, `learn-${step}-restored`);
      };
      const inspectFoldTeaching = async (step) => {
        const scenes = [
          'square-mid',
          'square-diagonal',
          'rectangle-mid',
          'triangle-mid',
          'circle-mid',
          'copy-triangle',
          'copy-slant',
          'copy-mushroom',
          'copy-flag',
          'flower',
          'fish',
          null,
          null,
          'four-triangles',
          'joined-triangle',
          'joined-trapezoid',
        ];
        const scene = scenes[step];
        if (!scene && step !== 12) return;
        const visual = { kind: 'bnu-fold-one', scene, variant: 'main' };
        await (step === 12
          ? inspectFoldPaper(`learn-${step}`)
          : inspectFoldOne(visual, `learn-${step}`));
        const state = JSON.stringify(await read());
        await p
          .locator('button[aria-haspopup="menu"]')
          .filter({ has: p.locator('svg.lucide-languages') })
          .click();
        await p.getByText('English', { exact: true }).click();
        await p.waitForTimeout(600);
        await (step === 12
          ? inspectFoldPaper(`learn-${step}-en`)
          : inspectFoldOne(visual, `learn-${step}-en`));
        const wasDark = await p.evaluate(() =>
          document.documentElement.classList.contains('dark'),
        );
        await p.locator('.theme-toggle svg').click();
        await p.waitForFunction(
          (was) => document.documentElement.classList.contains('dark') !== was,
          wasDark,
        );
        await p.waitForTimeout(600);
        await (step === 12
          ? inspectFoldPaper(`learn-${step}-en-theme`)
          : inspectFoldOne(visual, `learn-${step}-en-theme`));
        await p.locator('.theme-toggle svg').click();
        await p.waitForFunction(
          (was) => document.documentElement.classList.contains('dark') === was,
          wasDark,
        );
        await p.waitForTimeout(600);
        await p
          .locator('button[aria-haspopup="menu"]')
          .filter({ has: p.locator('svg.lucide-languages') })
          .click();
        await p.getByText('简体中文', { exact: true }).click();
        await p.waitForTimeout(600);
        if (JSON.stringify(await read()) !== state)
          throw new Error('Fold language/theme changed learning records');
      };
      const inspectRecognizeCards = async (visual, label) => {
        const cards = p.locator('svg[viewBox="0 0 144 144"]');
        await cards.first().waitFor();
        if ((await cards.count()) !== visual.cards.length)
          throw new Error(`Shape card count ${label}`);
        for (let index = 0; index < visual.cards.length; index++) {
          const card = cards.nth(index);
          await card.scrollIntoViewIfNeeded();
          const result = await card.evaluate((node, expected) => {
            const box = node.getBoundingClientRect();
            const group = node.querySelector('g');
            const child = group.firstElementChild;
            const geometry = group.getBoundingClientRect();
            const letter = node.parentElement.querySelector('span');
            const tag = child.tagName.toLowerCase();
            let shape = tag;
            if (tag === 'rect')
              shape =
                child.getAttribute('width') === child.getAttribute('height')
                  ? 'square'
                  : 'rectangle';
            if (tag === 'path') shape = 'triangle';
            return {
              shape,
              transform: group.getAttribute('transform'),
              letter: letter.textContent,
              font: Number.parseFloat(getComputedStyle(letter).fontSize),
              aria: node.getAttribute('aria-label'),
              clipped:
                geometry.left < box.left - 1 ||
                geometry.right > box.right + 1 ||
                geometry.top < box.top - 1 ||
                geometry.bottom > box.bottom + 1,
              viewport: box.left >= -1 && box.right <= innerWidth + 1,
              globalOverflow:
                document.documentElement.scrollWidth > innerWidth + 1,
              expectedTransform: `translate(72 72) rotate(${expected.turn}) scale(${expected.size === 1 ? 0.6 : 1})`,
            };
          }, visual.cards[index]);
          if (
            result.shape !== visual.cards[index].shape ||
            result.transform !== result.expectedTransform ||
            result.letter !== String.fromCodePoint(65 + index) ||
            result.font < 20 ||
            !result.aria ||
            result.clipped ||
            !result.viewport ||
            result.globalOverflow
          )
            throw new Error(
              `Shape geometry/readability ${label} ${index}: ${JSON.stringify(result)}`,
            );
        }
        await p.screenshot({
          path: `/tmp/butler-bnu-recognize-${label}-${width}.png`,
        });
      };
      const inspectDesign = async (visual, label) => {
        const root = p.locator('[data-bnu-pattern-design]');
        await root.waitFor();
        const svgCount = visual.scene === 'dot-grid' ? 1 : 4;
        if ((await root.locator('svg').count()) !== svgCount)
          throw new Error(`Design SVG inventory ${label}`);
        const outline = {
          triangle: [
            [-1, 0.6],
            [1, 0.6],
            [0, -Math.sqrt(3) + 0.6],
          ],
          hexagon: Array.from({ length: 6 }, (_, i) => [
            Math.cos((i * Math.PI) / 3),
            Math.sin((i * Math.PI) / 3),
          ]),
          trapezoid: [
            [-1.3, 0.65],
            [1.3, 0.65],
            [0.65, -0.65],
            [-0.65, -0.65],
          ],
          parallelogram: [
            [-1, -0.65],
            [0.5, -0.65],
            [1, 0.65],
            [-0.5, 0.65],
          ],
        };
        const wrong = visual.scene === 'triangle' ? 'hexagon' : 'triangle';
        const kinds =
          visual.variant === 'main'
            ? [visual.scene, visual.scene, wrong, visual.scene]
            : [visual.scene, wrong, visual.scene, visual.scene];
        for (let index = 0; index < svgCount; index++) {
          const svg = root.locator('svg').nth(index);
          await svg.evaluate((node) =>
            node.scrollIntoView({
              block: 'center',
              inline: 'nearest',
              behavior: 'instant',
            }),
          );
          await p.waitForTimeout(250);
          if (index === 0)
            await p.screenshot({
              path: `/tmp/butler-bnu-design-${label}-${width}-card-${index}.png`,
            });
          const result = await svg.evaluate((node) => ({
            rect: node.getBoundingClientRect().toJSON(),
            width: node.getBoundingClientRect().width,
            height: node.getBoundingClientRect().height,
            box: node.getAttribute('viewBox'),
            aria: node.getAttribute('aria-label'),
            points: node.querySelector('polygon')?.getAttribute('points'),
            seam: node.querySelector('polyline')?.getAttribute('points'),
            dots: [...node.querySelectorAll('circle')].map((c) => [
              Number(c.getAttribute('cx')),
              Number(c.getAttribute('cy')),
            ]),
            label: node.parentElement.querySelector('p')?.textContent?.trim(),
            font: node.parentElement.querySelector('p')
              ? Number.parseFloat(
                  getComputedStyle(node.parentElement.querySelector('p'))
                    .fontSize,
                )
              : 20,
            viewport:
              node.getBoundingClientRect().left >= 0 &&
              node.getBoundingClientRect().right <= innerWidth &&
              node.getBoundingClientRect().top >= 0 &&
              node.getBoundingClientRect().bottom <= innerHeight,
            overflow: document.documentElement.scrollWidth > innerWidth + 1,
          }));
          if (
            !result.aria ||
            result.font < 20 ||
            !result.viewport ||
            result.overflow
          )
            throw new Error(
              `Design readability ${label} ${JSON.stringify(result)}`,
            );
          if (visual.scene === 'dot-grid') {
            const count = visual.variant === 'main' ? 49 : 35;
            const dots = Array.from({ length: count }, (_, i) => [
              24 + (i % 7) * 24,
              24 + Math.floor(i / 7) * 24,
            ]);
            if (
              result.width !== 192 ||
              result.height !== 192 ||
              result.box !== '0 0 192 192' ||
              JSON.stringify(result.dots) !== JSON.stringify(dots)
            )
              throw new Error(`Design dots ${label}`);
          } else {
            const source = outline[kinds[index]];
            const scale = (
              visual.variant === 'main' ? [34, 29, 34, 36] : [29, 36, 34, 31]
            )[index];
            const angle =
              ((visual.variant === 'main'
                ? [0, 90, 0, 180]
                : [30, 0, 150, 270])[index] *
                Math.PI) /
              180;
            const transform = ([x, y]) => [
              72 + scale * (x * Math.cos(angle) - y * Math.sin(angle)),
              72 + scale * (x * Math.sin(angle) + y * Math.cos(angle)),
            ];
            const expected = source.map((point) => transform(point));
            const actual = result.points
              ?.split(' ')
              .map((p) => p.split(',').map(Number));
            const third =
              kinds[index] === 'triangle'
                ? [
                    (source[1][0] + source[2][0]) / 2,
                    (source[1][1] + source[2][1]) / 2,
                  ]
                : source[2];
            const expectedSeam =
              index === 3
                ? [
                    transform(third),
                    transform(source[0]),
                    ...(visual.variant === 'review' &&
                    kinds[index] === 'hexagon'
                      ? [transform(source[4])]
                      : []),
                  ]
                : [];
            const seam =
              result.seam?.split(' ').map((p) => p.split(',').map(Number)) ??
              [];
            const equals = (a, b) =>
              a?.length === b.length &&
              a.every((p, i) =>
                p.every((n, j) => Math.abs(n - b[i][j]) < 1e-7),
              );
            if (
              result.width !== 144 ||
              result.height !== 144 ||
              result.box !== '0 0 144 144' ||
              result.label !== String.fromCodePoint(65 + index) ||
              !equals(actual, expected) ||
              !equals(seam, expectedSeam) ||
              actual.some((p) => p.some((n) => n <= 8 || n >= 136))
            )
              throw new Error(
                `Design geometry ${label} ${index}: ${JSON.stringify(result)}`,
              );
          }
        }
        await p.screenshot({
          path: `/tmp/butler-bnu-design-${label}-${width}.png`,
        });
      };
      const inspectDesignTeaching = async (step) => {
        if (step < 3 || step > 7) return;
        const visual = {
          kind: 'bnu-pattern-design',
          scene: [
            'triangle',
            'hexagon',
            'trapezoid',
            'parallelogram',
            'dot-grid',
          ][step - 3],
          variant: 'main',
        };
        await inspectDesign(visual, `learn-${step}`);
        const state = JSON.stringify(await read());
        await p
          .locator('button[aria-haspopup="menu"]')
          .filter({ has: p.locator('svg.lucide-languages') })
          .click();
        await p.getByText('English', { exact: true }).click();
        await p.waitForTimeout(600);
        await inspectDesign(visual, `learn-${step}-en`);
        const dark = await p.evaluate(() =>
          document.documentElement.classList.contains('dark'),
        );
        await p.locator('.theme-toggle svg').click();
        await p.waitForFunction(
          (was) => document.documentElement.classList.contains('dark') !== was,
          dark,
        );
        await p.waitForTimeout(600);
        await inspectDesign(visual, `learn-${step}-en-theme`);
        await p.locator('.theme-toggle svg').click();
        await p.waitForFunction(
          (was) => document.documentElement.classList.contains('dark') === was,
          dark,
        );
        await p.waitForTimeout(600);
        await p
          .locator('button[aria-haspopup="menu"]')
          .filter({ has: p.locator('svg.lucide-languages') })
          .click();
        await p.getByText('简体中文', { exact: true }).click();
        await p.waitForTimeout(600);
        if (JSON.stringify(await read()) !== state)
          throw new Error('Design language/theme changed records');
      };
      const inspectPatternTeaching = async (step) => {
        if (![1, 2, 3].includes(step)) return;
        const visual =
          step === 3
            ? {
                kind: 'plane-cards',
                cards: [{ shape: 'circle', size: 2, turn: 0 }],
              }
            : {
                kind: 'plane-cards',
                cards: [
                  ...Array.from({ length: 4 }, (_, i) => ({
                    shape: 'triangle',
                    size: 2,
                    turn: i % 2 === 0 ? 0 : 90,
                  })),
                  ...Array.from({ length: 4 }, (_, i) => ({
                    shape: 'triangle',
                    size: 1,
                    turn: i % 2 === 0 ? 45 : 135,
                  })),
                ],
              };
        await inspectRecognizeCards(visual, `patterns-learn-${step}`);
        const state = JSON.stringify(await read());
        await p
          .locator('button[aria-haspopup="menu"]')
          .filter({ has: p.locator('svg.lucide-languages') })
          .click();
        await p.getByText('English', { exact: true }).click();
        await p.waitForTimeout(600);
        await inspectRecognizeCards(visual, `patterns-learn-${step}-en`);
        const wasDark = await p.evaluate(() =>
          document.documentElement.classList.contains('dark'),
        );
        await p.locator('.theme-toggle svg').click();
        await p.waitForFunction(
          (was) => document.documentElement.classList.contains('dark') !== was,
          wasDark,
        );
        await p.waitForTimeout(600);
        await inspectRecognizeCards(visual, `patterns-learn-${step}-en-theme`);
        await p.locator('.theme-toggle svg').click();
        await p.waitForFunction(
          (was) => document.documentElement.classList.contains('dark') === was,
          wasDark,
        );
        await p.waitForTimeout(600);
        await p
          .locator('button[aria-haspopup="menu"]')
          .filter({ has: p.locator('svg.lucide-languages') })
          .click();
        await p.getByText('简体中文', { exact: true }).click();
        await p.waitForTimeout(600);
        if (JSON.stringify(await read()) !== state)
          throw new Error('Pattern language/theme changed records');
      };
      const inspectCalculationReview = async (visual, label) => {
        const root = p.locator('[data-bnu-calculation-review]');
        await root.waitFor();
        const review = visual.variant === 'review';
        const fixtures = {
          baskets: review
            ? [
                '76−10',
                '52+14',
                '44+23',
                '32+34',
                '57+11',
                '89−23',
                '99−33',
                '98−31',
              ]
            : [
                '78−10',
                '52+12',
                '44+24',
                '32+36',
                '57+21',
                '89−21',
                '99−31',
                '98−30',
              ],
          balls: review ? [41, 32, 24, 8] : [42, 30, 23, 6],
          clothes: review ? [31, 42, 24, 45, 33] : [46, 52, 34, 53, 41],
        };
        const rows = await root
          .locator('tbody tr')
          .evaluateAll((nodes) =>
            nodes.map((row) =>
              [...row.querySelectorAll('[data-calculation-cell]')].map((n) =>
                n.textContent.trim(),
              ),
            ),
          );
        const squares = {
          'square-two-large': [
            [
              1,
              [
                [0, 2],
                [2, 0],
                [4, 2],
              ],
            ],
            [
              2,
              [
                [0, 2],
                [4, 2],
                [2, 4],
              ],
            ],
          ],
          'square-two-small': [
            [
              4,
              [
                [0, 1],
                [1, 0],
                [2, 1],
              ],
            ],
            [
              6,
              [
                [0, 1],
                [2, 1],
                [1, 2],
              ],
            ],
          ],
          'square-three': [
            [
              7,
              [
                [0, 0],
                [0, 2],
                [2, 2],
              ],
            ],
            [
              4,
              [
                [0, 0],
                [2, 0],
                [1, 1],
              ],
            ],
            [
              6,
              [
                [2, 0],
                [2, 2],
                [1, 1],
              ],
            ],
          ],
          'square-four-square': [
            [
              1,
              [
                [0, 2],
                [2, 0],
                [4, 2],
              ],
            ],
            [
              5,
              [
                [2, 2],
                [3, 3],
                [2, 4],
                [1, 3],
              ],
            ],
            [
              4,
              [
                [0, 2],
                [2, 2],
                [1, 3],
              ],
            ],
            [
              6,
              [
                [2, 2],
                [4, 2],
                [3, 3],
              ],
            ],
          ],
          'square-four-triangle': [
            [
              1,
              [
                [0, 2],
                [2, 0],
                [4, 2],
              ],
            ],
            [
              7,
              [
                [0, 2],
                [2, 2],
                [2, 4],
              ],
            ],
            [
              4,
              [
                [2, 2],
                [4, 2],
                [3, 3],
              ],
            ],
            [
              6,
              [
                [2, 2],
                [3, 3],
                [2, 4],
              ],
            ],
          ],
        };
        for (const [scene, recipe] of Object.entries(squares))
          fixtures[scene] = recipe.map(([id, points]) =>
            place(id, 80, 60, points),
          );
        const expected = fixtures[visual.scene];
        if (
          rows.length !== expected.length ||
          rows.some(
            (row, i) =>
              row[0] !== String(i + 1) ||
              row[visual.scene === 'baskets' ? 1 : 2] !== String(expected[i]),
          )
        )
          throw new Error(
            `Calculation table fixture ${label}: ${JSON.stringify(rows)}`,
          );
        if (visual.scene === 'clothes') {
          const labels = await root
            .locator('tbody tr td:nth-child(2)')
            .allTextContents();
          if (
            !labels.slice(0, 3).every((x) => /上衣|Top/.test(x)) ||
            !labels.slice(3).every((x) => /裤子|Trousers/.test(x))
          )
            throw new Error('Outfit categories');
          const content = await root.innerText();
          if (!content.includes(String(review ? 70 : 100)))
            throw new Error('Outfit budget');
        }
        const region = root.locator('[data-bnu-calculation-scroll]');
        for (const edge of ['left', 'right']) {
          await region.evaluate((n, e) => {
            n.scrollLeft = e === 'left' ? 0 : n.scrollWidth;
          }, edge);
          await region.scrollIntoViewIfNeeded();
          await p.screenshot({
            path: `/tmp/butler-bnu-calculation-review-${label}-${width}-${edge}.png`,
          });
        }
        await region.evaluate((n) => {
          n.scrollLeft = 0;
        });
        if (await region.evaluate((n) => n.scrollWidth > n.clientWidth)) {
          await region.focus();
          await p.keyboard.press('ArrowRight');
          if ((await region.evaluate((n) => n.scrollLeft)) <= 0)
            throw new Error('Calculation keyboard scroll');
        }
        const geometry = await root.evaluate((node) => ({
          small: [...node.querySelectorAll('thead span,tbody td span')].some(
            (n) => Number.parseFloat(getComputedStyle(n).fontSize) < 20,
          ),
          clipped: [...node.querySelectorAll('[data-calculation-cell]')].some(
            (n) => n.scrollWidth > n.clientWidth + 1,
          ),
          page: document.documentElement.scrollWidth > innerWidth + 1,
        }));
        if (geometry.small || geometry.clipped || geometry.page)
          throw new Error(
            `Calculation geometry ${label}: ${JSON.stringify(geometry)}`,
          );
        await region.evaluate((n) => {
          n.scrollLeft = 0;
        });
      };
      const inspectColumnDigits = async (model, label) => {
        const table = p
          .locator('.ant-table')
          .filter({ has: p.locator('thead') });
        const cells = await table
          .locator('tbody tr[data-row-key]')
          .evaluateAll((nodes) =>
            nodes.map((row) =>
              [...row.querySelectorAll('td')]
                .slice(1)
                .map((n) => n.textContent.trim()),
            ),
          );
        const expected = [
          model.left.map(String),
          model.right.map(String),
          ['A', 'B'],
        ];
        if (JSON.stringify(cells) !== JSON.stringify(expected))
          throw new Error(
            `Column digits fixture ${label}: ${JSON.stringify(cells)}`,
          );
        const geometry = await table.evaluate((root) => ({
          small: [...root.querySelectorAll('thead span,tbody td span')].some(
            (n) => Number.parseFloat(getComputedStyle(n).fontSize) < 20,
          ),
          clipped: [...root.querySelectorAll('thead span,tbody td span')].some(
            (n) => n.scrollWidth > n.clientWidth + 1,
          ),
          page: document.documentElement.scrollWidth > innerWidth + 1,
        }));
        if (geometry.small || geometry.clipped || geometry.page)
          throw new Error(
            `Column digits geometry ${label}: ${JSON.stringify(geometry)}`,
          );
        await table.scrollIntoViewIfNeeded();
        await p.screenshot({
          path: `/tmp/butler-bnu-column-${label}-${width}.png`,
        });
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
          .count()) !== 47
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
      if (flow.key.startsWith('tangram-')) await inspectTangramTeaching(0);
      if (flow.key === 'fold-one') await inspectFoldTeaching(0);
      if (flow.key === 'written')
        await inspectWritten(
          { scene: 'rods-add', variant: 'main' },
          'learn-initial',
        );
      if (flow.key === 'frogs')
        await inspectPlaceCounters([65, 32], 'frogs-learn-initial');
      if (flow.key === 'pinecones')
        await inspectPlaceCounters([45, 3, 30], 'pinecones-learn-initial');
      if (flow.key === 'rabbit-guests')
        await inspectPlaceCounters([20, 30, 50], 'rabbit-guests-learn-initial');
      if (flow.key === 'fill-game')
        await inspectFillGrid(
          { scene: 'three', variant: 'main' },
          'learn-initial',
        );
      if (flow.key === 'number-practice')
        await inspectBnuNumberReview(
          { scene: 'objects', variant: 'main' },
          'learn-initial',
        );
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
        if (flow.key.startsWith('tangram-'))
          await inspectTangramTeaching(step + 1);
        if (flow.key === 'design') await inspectDesignTeaching(step + 1);
        if (flow.key === 'patterns-three')
          await inspectPatternTeaching(step + 1);
        if (flow.key === 'fold-one') await inspectFoldTeaching(step + 1);
        if (flow.key === 'recognize-shapes' && [1, 2, 3, 7, 8].includes(step)) {
          const layouts = {
            1: [
              ['rectangle', 2, 0],
              ['triangle', 2, 45],
              ['circle', 1, 0],
              ['square', 2, 0],
              ['circle', 2, 0],
              ['square', 1, 0],
            ],
            2: [
              ['triangle', 1, 0],
              ['rectangle', 1, 45],
              ['rectangle', 2, 90],
              ['triangle', 2, 90],
              ['square', 2, 45],
            ],
            3: [
              ['square', 2, 0],
              ['square', 2, 45],
            ],
            7: [
              ['rectangle', 2, 0],
              ['rectangle', 2, 0],
              ['rectangle', 2, 0],
              ['rectangle', 2, 0],
              ['rectangle', 1, 0],
              ['square', 2, 0],
              ['triangle', 1, 0],
            ],
            8: Array.from({ length: 8 }, () => ['circle', 1, 0]),
          };
          const visual = {
            kind: 'plane-cards',
            cards: layouts[step].map(([shape, size, turn]) => ({
              shape,
              size,
              turn,
            })),
          };
          await inspectRecognizeCards(visual, `learn-${step + 1}`);
          const state = JSON.stringify(await read());
          await p
            .locator('button[aria-haspopup="menu"]')
            .filter({ has: p.locator('svg.lucide-languages') })
            .click();
          await p.getByText('English', { exact: true }).click();
          await p.waitForTimeout(600);
          await inspectRecognizeCards(visual, `learn-${step + 1}-en`);
          const wasDark = await p.evaluate(() =>
            document.documentElement.classList.contains('dark'),
          );
          await p.locator('.theme-toggle svg').click();
          await p.waitForFunction(
            (was) =>
              document.documentElement.classList.contains('dark') !== was,
            wasDark,
          );
          await p.waitForTimeout(600);
          await inspectRecognizeCards(visual, `learn-${step + 1}-en-theme`);
          await p.locator('.theme-toggle svg').click();
          await p.waitForFunction(
            (was) =>
              document.documentElement.classList.contains('dark') === was,
            wasDark,
          );
          await p.waitForTimeout(600);
          await p
            .locator('button[aria-haspopup="menu"]')
            .filter({ has: p.locator('svg.lucide-languages') })
            .click();
          await p.getByText('简体中文', { exact: true }).click();
          await p.waitForTimeout(600);
          if (JSON.stringify(await read()) !== state)
            throw new Error('Recognize-shape language/theme changed records');
        }
        if (flow.key === 'calculation-review' && [4, 6, 7].includes(step)) {
          const scene = { 4: 'baskets', 6: 'balls', 7: 'clothes' }[step];
          await inspectCalculationReview(
            { scene, variant: 'main' },
            `learn-${step + 1}`,
          );
          const state = JSON.stringify(await read());
          await p
            .locator('button[aria-haspopup="menu"]')
            .filter({ has: p.locator('svg.lucide-languages') })
            .click();
          await p.getByText('English', { exact: true }).click();
          await p
            .locator('[data-bnu-calculation-review] figcaption')
            .filter({ hasText: /[A-Za-z]/ })
            .waitFor();
          await inspectCalculationReview(
            { scene, variant: 'main' },
            `learn-${step + 1}-en`,
          );
          const wasDark = await p.evaluate(() =>
            document.documentElement.classList.contains('dark'),
          );
          await p.locator('.theme-toggle svg').click();
          await p.waitForFunction(
            (was) =>
              document.documentElement.classList.contains('dark') !== was,
            wasDark,
          );
          await p.waitForTimeout(600);
          await inspectCalculationReview(
            { scene, variant: 'main' },
            `learn-${step + 1}-en-theme`,
          );
          await p.locator('.theme-toggle svg').click();
          await p.waitForFunction(
            (was) =>
              document.documentElement.classList.contains('dark') === was,
            wasDark,
          );
          await p.waitForTimeout(600);
          await p
            .locator('button[aria-haspopup="menu"]')
            .filter({ has: p.locator('svg.lucide-languages') })
            .click();
          await p.getByText('简体中文', { exact: true }).click();
          await p
            .locator('[data-bnu-calculation-review] figcaption')
            .filter({ hasText: /[\u4E00-\u9FFF]/ })
            .waitFor();
          if (JSON.stringify(await read()) !== state)
            throw new Error(
              'Calculation review language/theme changed records',
            );
        }
        if (flow.key === 'recycling' && [1, 2].includes(step)) {
          const scene = { 1: 'rods', 2: 'circles' }[step];
          await inspectRecycling(
            { scene, variant: 'main' },
            `learn-${step + 1}`,
          );
          const state = JSON.stringify(await read());
          await p
            .locator('button[aria-haspopup="menu"]')
            .filter({ has: p.locator('svg.lucide-languages') })
            .click();
          await p.getByText('English', { exact: true }).click();
          await p
            .locator('[data-bnu-recycling] figcaption')
            .filter({ hasText: /[A-Za-z]/ })
            .waitFor();
          await inspectRecycling(
            { scene, variant: 'main' },
            `learn-${step + 1}-en`,
          );
          const wasDark = await p.evaluate(() =>
            document.documentElement.classList.contains('dark'),
          );
          await p.locator('.theme-toggle svg').click();
          await p.waitForFunction(
            (was) =>
              document.documentElement.classList.contains('dark') !== was,
            wasDark,
          );
          await p.waitForTimeout(600);
          await inspectRecycling(
            { scene, variant: 'main' },
            `learn-${step + 1}-en-theme`,
          );
          await p.locator('.theme-toggle svg').click();
          await p.waitForFunction(
            (was) =>
              document.documentElement.classList.contains('dark') === was,
            wasDark,
          );
          await p.waitForTimeout(600);
          await p
            .locator('button[aria-haspopup="menu"]')
            .filter({ has: p.locator('svg.lucide-languages') })
            .click();
          await p.getByText('简体中文', { exact: true }).click();
          await p
            .locator('[data-bnu-recycling] figcaption')
            .filter({ hasText: /[\u4E00-\u9FFF]/ })
            .waitFor();
          if (JSON.stringify(await read()) !== state)
            throw new Error('Recycling language/theme changed records');
        }
        if (flow.key === 'interesting' && [2, 4, 6].includes(step)) {
          const scene = { 2: 'addition', 4: 'subtraction', 6: 'eleven' }[step];
          await inspectInteresting(
            { scene, variant: 'main' },
            `learn-${step + 1}`,
          );
          const state = JSON.stringify(await read());
          await p
            .locator('button[aria-haspopup="menu"]')
            .filter({ has: p.locator('svg.lucide-languages') })
            .click();
          await p.getByText('English', { exact: true }).click();
          await p
            .locator('[data-bnu-interesting] figcaption')
            .filter({ hasText: /[A-Za-z]/ })
            .waitFor();
          await inspectInteresting(
            { scene, variant: 'main' },
            `learn-${step + 1}-en`,
          );
          const wasDark = await p.evaluate(() =>
            document.documentElement.classList.contains('dark'),
          );
          await p.locator('.theme-toggle svg').click();
          await p.waitForFunction(
            (was) =>
              document.documentElement.classList.contains('dark') !== was,
            wasDark,
          );
          await p.waitForTimeout(600);
          await inspectInteresting(
            { scene, variant: 'main' },
            `learn-${step + 1}-en-theme`,
          );
          await p.locator('.theme-toggle svg').click();
          await p.waitForFunction(
            (was) =>
              document.documentElement.classList.contains('dark') === was,
            wasDark,
          );
          await p.waitForTimeout(600);
          await p
            .locator('button[aria-haspopup="menu"]')
            .filter({ has: p.locator('svg.lucide-languages') })
            .click();
          await p.getByText('简体中文', { exact: true }).click();
          await p
            .locator('[data-bnu-interesting] figcaption')
            .filter({ hasText: /[\u4E00-\u9FFF]/ })
            .waitFor();
          if (JSON.stringify(await read()) !== state)
            throw new Error('Interesting language/theme changed records');
        }
        if (flow.key === 'written' && step < 7) {
          const scene = [
            'add-stage',
            'add-final',
            'rods-sub',
            'sub-blank',
            'sub-final',
            'matching',
            'practice',
          ][step];
          await inspectWritten({ scene, variant: 'main' }, `learn-${step + 1}`);
          if (['add-stage', 'matching', 'practice'].includes(scene)) {
            const state = JSON.stringify(await read());
            await p
              .locator('button[aria-haspopup="menu"]')
              .filter({ has: p.locator('svg.lucide-languages') })
              .click();
            await p.getByText('English', { exact: true }).click();
            await p
              .locator('[data-bnu-written] figcaption')
              .filter({ hasText: /[A-Za-z]/ })
              .waitFor();
            await inspectWritten(
              { scene, variant: 'main' },
              `learn-${step + 1}-en`,
            );
            const wasDark = await p.evaluate(() =>
              document.documentElement.classList.contains('dark'),
            );
            await p.locator('.theme-toggle svg').click();
            await p.waitForFunction(
              (was) =>
                document.documentElement.classList.contains('dark') !== was,
              wasDark,
            );
            await p.waitForTimeout(600);
            await inspectWritten(
              { scene, variant: 'main' },
              `learn-${step + 1}-en-theme`,
            );
            await p.locator('.theme-toggle svg').click();
            await p.waitForFunction(
              (was) =>
                document.documentElement.classList.contains('dark') === was,
              wasDark,
            );
            await p.waitForTimeout(600);
            await p
              .locator('button[aria-haspopup="menu"]')
              .filter({ has: p.locator('svg.lucide-languages') })
              .click();
            await p.getByText('简体中文', { exact: true }).click();
            await p
              .locator('[data-bnu-written] figcaption')
              .filter({ hasText: /[\u4E00-\u9FFF]/ })
              .waitFor();
            if (JSON.stringify(await read()) !== state)
              throw new Error('Written language/theme changed records');
          }
        }
        if (
          (flow.key === 'rabbit-guests' && [5, 6].includes(step)) ||
          (flow.key === 'frogs' && [5, 6].includes(step)) ||
          (flow.key === 'pinecones' && [4, 5].includes(step))
        ) {
          const inspectLine =
            flow.key === 'frogs' ? inspectTwoLine : inspectTenLine;
          const first = flow.key === 'pinecones' ? 4 : 5;
          const scene = step === first ? 'add' : 'subtract';
          await inspectLine({ scene, variant: 'main' }, `learn-${step + 1}`);
          const state = JSON.stringify(await read());
          await p
            .locator('button[aria-haspopup="menu"]')
            .filter({ has: p.locator('svg.lucide-languages') })
            .click();
          await p.getByText('English', { exact: true }).click();
          await p
            .locator(
              '[data-bnu-ten-line] figcaption, [data-bnu-two-line] figcaption',
            )
            .filter({
              hasText: {
                frogs: {
                  add: 'Two jumps: add tens, then ones',
                  subtract: 'Two jumps: subtract tens, then ones',
                },
                pinecones: {
                  add: 'Number line: increase to the right in ones',
                  subtract: 'Number line: decrease to the left in tens',
                },
                'rabbit-guests': {
                  add: 'Whole-ten line: increase to the right',
                  subtract: 'Whole-ten line: decrease to the left',
                },
              }[flow.key][scene],
            })
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
          await inspectLine(
            { scene, variant: 'main' },
            `english-theme-${step + 1}`,
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
              'Whole-ten language/theme changed learning records',
            );
        }
        if (flow.key === 'fill-game') {
          const scene = {
            0: 'three',
            1: 'three',
            2: 'five',
            3: 'five-stage',
            4: 'five-stage',
            5: 'five-next',
          }[step];
          if (scene)
            await inspectFillGrid(
              { scene, variant: 'main' },
              `learn-${step + 1}`,
            );
          if (step === 2) {
            const state = JSON.stringify(await read());
            await p
              .locator('button[aria-haspopup="menu"]')
              .filter({ has: p.locator('svg.lucide-languages') })
              .click();
            await p.getByText('English', { exact: true }).click();
            await p
              .locator('[data-bnu-fill-grid] figcaption')
              .filter({
                hasText: 'Five rows and columns: seven original blanks',
              })
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
            await inspectFillGrid(
              { scene: 'five', variant: 'main' },
              'english-theme',
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
                'Fill grid language/theme changed learning records',
              );
          }
        }
        if (flow.key === 'number-practice') {
          const scene = {
            0: 'sticks',
            1: 'counter',
            2: 'cubes',
            5: 'five-up',
            6: 'two-up',
            7: 'ten-up',
            8: 'five-down',
          }[step];
          if (scene)
            await inspectBnuNumberReview(
              { scene, variant: 'main' },
              `learn-${step + 1}`,
            );
          if (step === 2) {
            const state = JSON.stringify(await read());
            await p
              .locator('button[aria-haspopup="menu"]')
              .filter({ has: p.locator('svg.lucide-languages') })
              .click();
            await p.getByText('English', { exact: true }).click();
            await p
              .locator('[data-bnu-number-review] figcaption')
              .filter({ hasText: 'Ten-unit rods and loose units' })
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
            await inspectBnuNumberReview(
              { scene: 'cubes', variant: 'main' },
              'english-theme',
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
              throw new Error('Number review language/theme changed records');
          }
        }
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
          (flow.key === 'number-practice' && [9, 10].includes(step)) ||
          (flow.key === 'rabbit-guests' && [0, 1, 2, 4, 8].includes(step)) ||
          (flow.key === 'pinecones' && [0, 1, 8].includes(step)) ||
          (flow.key === 'frogs' && [0, 1, 2, 3, 8].includes(step)) ||
          (flow.key === 'red-fruit' && [0, 1, 3].includes(step))
        ) {
          const diagramValues = {
            'count-beans': { 0: [28, 22], 1: [97, 98, 99, 100] },
            'hundred-harvest': { 0: [95, 92, 85, 79], 2: [85] },
            'number-practice': { 9: [13], 10: [4, 22, 31, 40] },
            frogs: {
              0: [65, 95, 97],
              1: [65, 32, 97],
              2: [65, 35, 33],
              3: [65, 32, 33],
              8: [30, 0],
            },
            pinecones: { 0: [45, 3, 48], 1: [45, 30, 15], 8: [30, 0] },
            'rabbit-guests': {
              0: [20, 30, 50],
              1: [50, 40, 10],
              2: [50, 40, 10],
              4: [40, 20, 60],
              8: [20, 0],
            },
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
        if (
          q.visual?.kind === 'bnu-whole-ten-line' ||
          q.visual?.kind === 'bnu-pinecone-line'
        )
          await inspectTenLine(q.visual, q.id);
        if (
          flow.key === 'calculation-review' &&
          q.visual?.kind === 'column-digits'
        )
          await inspectColumnDigits(q.visual, q.id);
        if (flow.key === 'calculation-review' && q.id.endsWith('-written-1')) {
          const state = JSON.stringify(await read());
          await p
            .locator('button[aria-haspopup="menu"]')
            .filter({ has: p.locator('svg.lucide-languages') })
            .click();
          await p.getByText('English', { exact: true }).click();
          await p
            .locator('.ant-table thead')
            .filter({ hasText: 'Tens' })
            .waitFor();
          await inspectColumnDigits(q.visual, `${q.id}-en`);
          const dark = await p.evaluate(() =>
            document.documentElement.classList.contains('dark'),
          );
          await p.locator('.theme-toggle svg').click();
          await p.waitForFunction(
            (was) =>
              document.documentElement.classList.contains('dark') !== was,
            dark,
          );
          await p.waitForTimeout(600);
          await inspectColumnDigits(q.visual, `${q.id}-en-theme`);
          await p.locator('.theme-toggle svg').click();
          await p.waitForFunction(
            (was) =>
              document.documentElement.classList.contains('dark') === was,
            dark,
          );
          await p.waitForTimeout(600);
          await p
            .locator('button[aria-haspopup="menu"]')
            .filter({ has: p.locator('svg.lucide-languages') })
            .click();
          await p.getByText('简体中文', { exact: true }).click();
          await p
            .locator('.ant-table thead')
            .filter({ hasText: '十位' })
            .waitFor();
          if (JSON.stringify(await read()) !== state)
            throw new Error('Vertical table language/theme changed records');
        }

        if (q.visual?.kind === 'bnu-pattern-design')
          await inspectDesign(q.visual, q.id);
        if (q.visual?.kind === 'bnu-tangram')
          await inspectTangram(q.visual, q.id);
        if (q.visual?.kind === 'bnu-fold-one')
          await inspectFoldOne(q.visual, q.id);
        if (
          ['patterns-three', 'recognize-shapes'].includes(flow.key) &&
          q.visual?.kind === 'plane-cards'
        )
          await inspectRecognizeCards(q.visual, q.id);
        if (q.visual?.kind === 'bnu-calculation-review')
          await inspectCalculationReview(q.visual, q.id);
        if (q.visual?.kind === 'bnu-recycling')
          await inspectRecycling(q.visual, q.id);
        if (q.visual?.kind === 'bnu-interesting')
          await inspectInteresting(q.visual, q.id);
        if (q.visual?.kind === 'bnu-written')
          await inspectWritten(q.visual, q.id);
        if (q.visual?.kind === 'bnu-two-jump-line')
          await inspectTwoLine(q.visual, q.id);
        if (q.visual?.kind === 'bnu-fill-grid')
          await inspectFillGrid(q.visual, q.id);
        if (q.visual?.kind === 'bnu-number-review')
          await inspectBnuNumberReview(q.visual, q.id);
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
                .fill(
                  { complement: '19', 'calculation-review': '4' }[flow.key] ??
                    '3',
                );
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
          } else if (q.rule.kind === 'outfit') {
            await p.getByRole('spinbutton').nth(0).fill('3');
            await wait(
              (d) =>
                JSON.stringify(
                  d.sessions.find((s) => s.id === sid).responses[index].draft,
                ) === '[3,null]',
            );
            await p.reload({ waitUntil: 'networkidle' });
            await p.getByRole('spinbutton').nth(1).waitFor();
            if (
              (await p.getByRole('spinbutton').nth(0).inputValue()) !== '3' ||
              (await p.getByRole('spinbutton').nth(1).inputValue()) !== ''
            )
              throw new Error('Outfit partial lost');
            for (const input of await p.getByRole('spinbutton').all()) {
              await input.evaluate((n) =>
                n
                  .closest('.ant-input-number')
                  .scrollIntoView({ block: 'center', behavior: 'instant' }),
              );
              await p.waitForTimeout(200);
              const fit = await input.evaluate((n) => {
                const r = n
                  .closest('.ant-input-number')
                  .getBoundingClientRect();
                return {
                  font: Number.parseFloat(getComputedStyle(n).fontSize),
                  height: r.height,
                  left: r.left,
                  right: r.right,
                  top: r.top,
                  bottom: r.bottom,
                  width: innerWidth,
                  viewportHeight: innerHeight,
                };
              });
              if (
                fit.font < 20 ||
                fit.height < 44 ||
                fit.left < 0 ||
                fit.right > fit.width ||
                fit.top < 0 ||
                fit.bottom > fit.viewportHeight
              )
                throw new Error(
                  `Outfit input geometry: ${JSON.stringify(fit)}`,
                );
            }
            await p.screenshot({
              path: `/tmp/butler-bnu-outfit-partial-${width}.png`,
            });

            for (const values of [
              [2, 4],
              [3, 5],
            ]) {
              for (const [field, value] of values.entries())
                await p.getByRole('spinbutton').nth(field).fill(String(value));
              await click('提交答案');
              await wait(
                (d) =>
                  d.sessions.find((s) => s.id === sid).responses[index]
                    .submissions.length === (values[0] === 2 ? 1 : 2),
              );
            }
            const saved = await read();
            const response = saved.sessions.find((s) => s.id === sid).responses[
              index
            ];
            if (
              JSON.stringify(response.submissions.map((x) => x.correct)) !==
              '[false,true]'
            )
              throw new Error('Outfit budget history');
            if (index === session.questions.length - 1) break;
            await click('下一题');
            await wait(
              (d) =>
                d.sessions.find((s) => s.id === sid).questionIndex ===
                index + 1,
            );
            continue;
          } else if (q.rule.kind === 'column-digits') {
            const left = q.rule.left[0] * 10 + q.rule.left[1];
            const right = q.rule.right[0] * 10 + q.rule.right[1];
            const result =
              q.rule.operator === '+' ? left + right : left - right;
            const digits = [Math.floor(result / 10), result % 10];
            for (const [field, value] of digits.entries())
              await p.getByRole('spinbutton').nth(field).fill(String(value));
          } else if (q.rule.kind === 'reversed-addends') {
            const values =
              q.rule.count === 1 ? [22, 22] : [81, 18, 72, 27, 63, 36];
            if (q.rule.count === 3) {
              const partial = [81, null, null, null, null, null];
              await p.getByRole('spinbutton').first().fill('81');
              await wait(
                (d) =>
                  JSON.stringify(
                    d.sessions.find((x) => x.id === sid).responses[index].draft,
                  ) === JSON.stringify(partial),
              );
              await p.reload({ waitUntil: 'networkidle' });
              const fields = await p
                .getByRole('spinbutton')
                .evaluateAll((nodes) => nodes.map((n) => n.value));
              if (JSON.stringify(fields) !== '["81","","","","",""]')
                throw new Error('Reversed six-field partial lost');
              for (const [i, value] of [18, 81, 18, 81, 18, 81].entries())
                await p.getByRole('spinbutton').nth(i).fill(String(value));
              await click('提交答案');
              await p
                .getByText('再想一想，可以修改后重试', { exact: true })
                .waitFor();
            }
            for (const [i, value] of values.entries())
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
            ((flow.key === 'recycling' && q.id.endsWith('-circle-groups')) ||
              (flow.key === 'rabbit-guests' &&
                q.id.endsWith('-sub-backward')) ||
              (flow.key === 'pinecones' && q.id.endsWith('-eight-bottom')) ||
              (flow.key === 'frogs' && q.id.endsWith('-add-counter-digits')) ||
              (flow.key === 'written' && q.id.endsWith('-practice-digits')) ||
              (flow.key === 'interesting' && q.id.endsWith('-addition-all')) ||
              (flow.key === 'fill-game' &&
                (q.id.endsWith('-three-all') || q.id.endsWith('-five-all'))) ||
              (flow.key === 'number-practice' &&
                (q.id.endsWith('-cards-six') ||
                  q.id.endsWith('-beads-digits'))) ||
              (flow.key === 'hundred-harvest' &&
                q.id.endsWith('-counter-digits')) ||
              (flow.key === 'hundred-chart' && q.id.endsWith('-row-1')) ||
              (flow.key === 'breeding' && q.id.endsWith('-sorted-cards')) ||
              (flow.key === 'comparison-practice' &&
                q.id.endsWith('-sorted-scores')))
          ) {
            const partials = {
              recycling: [13, null, null],
              interesting: [22, ...Array.from({ length: 16 }, () => null)],
              written: [7, null, null, null, null, null, null, null],
              frogs: [6, null, null, null, null, null],
              pinecones: [65, null, null, null],
              'rabbit-guests': [40, null, null, null],
              'fill-game': q.id.endsWith('-three-all')
                ? [3, null, null, null, null]
                : [0, null, null, null, null, null, null],
              'number-practice': q.id.endsWith('-beads-digits')
                ? [0, null, null, null, null, null, null, null]
                : [25, null, null, null, null, null],
              'hundred-harvest': [9, null, null, null, null, null, null, null],
              breeding: [10, null, null, null, null],
              'comparison-practice': [95, null, null, null],
              'hundred-chart': [2, null, null, null, null, null, null, null],
            };
            const wrongs = {
              recycling: [13, 13, 0],
              interesting: [
                22, 33, 44, 41, 55, 15, 51, 66, 16, 61, 77, 17, 71, 88, 18, 81,
                0,
              ],
              written: [7, 6, 3, 1, 9, 9, 5, 0],
              frogs: [6, 5, 3, 2, 9, 0],
              pinecones: [65, 86, 40, 72],
              'rabbit-guests': [40, 30, 20, 0],
              'fill-game': q.id.endsWith('-three-all')
                ? [2, 3, 2, 3, 3]
                : [4, 2, 5, 2, 3, 5, 5],
              'number-practice': q.id.endsWith('-beads-digits')
                ? [0, 4, 2, 2, 3, 1, 0, 4]
                : [25, 28, 52, 58, 85, 82],
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
                  path: `/tmp/butler-bnu-${flow.key}${['fill-game', 'number-practice'].includes(flow.key) ? `-${q.id.slice(flow.lessonId.length + 1)}` : ''}-sort-${width}-${i}.png`,
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
        if (
          q.visual?.kind === 'bnu-whole-ten-line' ||
          q.visual?.kind === 'bnu-pinecone-line'
        )
          await inspectTenLine(q.visual, q.id);
        if (
          flow.key === 'calculation-review' &&
          q.visual?.kind === 'column-digits'
        )
          await inspectColumnDigits(q.visual, q.id);
        if (q.visual?.kind === 'bnu-pattern-design')
          await inspectDesign(q.visual, q.id);
        if (q.visual?.kind === 'bnu-tangram')
          await inspectTangram(q.visual, q.id);
        if (q.visual?.kind === 'bnu-fold-one')
          await inspectFoldOne(q.visual, q.id);
        if (
          ['patterns-three', 'recognize-shapes'].includes(flow.key) &&
          q.visual?.kind === 'plane-cards'
        )
          await inspectRecognizeCards(q.visual, q.id);
        if (q.visual?.kind === 'bnu-calculation-review')
          await inspectCalculationReview(q.visual, q.id);
        if (q.visual?.kind === 'bnu-recycling')
          await inspectRecycling(q.visual, q.id);
        if (q.visual?.kind === 'bnu-interesting')
          await inspectInteresting(q.visual, q.id);
        if (q.visual?.kind === 'bnu-written')
          await inspectWritten(q.visual, q.id);
        if (q.visual?.kind === 'bnu-two-jump-line')
          await inspectTwoLine(q.visual, q.id);
        if (q.visual?.kind === 'bnu-fill-grid')
          await inspectFillGrid(q.visual, q.id);
        if (q.visual?.kind === 'bnu-number-review')
          await inspectBnuNumberReview(q.visual, q.id);
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
        } else if (q.rule.kind === 'outfit') {
          for (const [field, value] of [1, 5].entries())
            await p.getByRole('spinbutton').nth(field).fill(String(value));
        } else if (q.rule.kind === 'column-digits') {
          const left = q.rule.left[0] * 10 + q.rule.left[1];
          const right = q.rule.right[0] * 10 + q.rule.right[1];
          const result = q.rule.operator === '+' ? left + right : left - right;
          for (const [field, value] of [
            Math.floor(result / 10),
            result % 10,
          ].entries())
            await p.getByRole('spinbutton').nth(field).fill(String(value));
        } else if (q.rule.kind === 'reversed-addends') {
          const values =
            q.rule.count === 1 ? [33, 33] : [61, 16, 52, 25, 43, 34];
          for (const [i, value] of values.entries())
            await p.getByRole('spinbutton').nth(i).fill(String(value));
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
