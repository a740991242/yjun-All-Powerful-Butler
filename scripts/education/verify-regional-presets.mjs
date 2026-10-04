/* Verify personal regional presets in the actual Pages build with isolated Chrome profiles.
 * Creates one native unfinished learning record and checks it remains unchanged.
 * Personal choices never certify school adoption or curriculum completeness.
 * Usage: rtk proxy node scripts/education/verify-regional-presets.mjs [--mobile-only] [--all-areas] [--province-defaults]
 * --all-areas checks personal upper/lower sets for every navigation area; it
 * does not infer local textbook adoption or create unsupported course packs.
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
const allAreas = process.argv.includes('--all-areas');
const provinceDefaults = process.argv.includes('--province-defaults');
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
      await p.goto(`${url}#/education/primary/p1/math/pep-2024/upper`, {
        waitUntil: 'networkidle',
      });
      if (p.url().includes('login')) {
        await p.getByPlaceholder('请输入用户名').fill('yj88888888');
        await p.getByPlaceholder('密码', { exact: true }).fill('yyds123456');
        await p.locator('button').filter({ hasText: '登录' }).click();
        await p.waitForTimeout(1500);
        await p.goto(`${url}#/education/primary/p1/math/pep-2024/upper`, {
          waitUntil: 'networkidle',
        });
      }
      await p
        .getByRole('button', { name: '进入课程', exact: true })
        .first()
        .click();
      await p.getByRole('button', { name: '下一步', exact: true }).waitFor();
      await p.getByRole('button', { name: '下一步', exact: true }).click();
      await p.waitForFunction(async () => {
        const data = await window.qaLoad();
        return data?.sessions.length === 1 && data.sessions[0].step === 1;
      });
      const library = await p.evaluate(async () =>
        JSON.stringify(await window.qaLoad()),
      );
      await p.goto(`${url}#/education?stage=primary&grade=p1`, {
        waitUntil: 'networkidle',
      });
      const choose = async (id, label, search = false) => {
        if (
          ['education-region-city', 'education-region-school'].includes(id) &&
          !(await p.locator(`#${id}`).isVisible())
        )
          await p
            .getByText('教材选用资料参考（可选）', { exact: true })
            .click();
        const input = p.locator(`#${id}`);
        await input.focus();
        if (search) await input.fill(label);
        await input.press('ArrowDown');
        const popup = p
          .locator('.ant-select-dropdown')
          .filter({ visible: true })
          .last();
        if (id.startsWith('education-custom-')) {
          await popup.locator('.ant-select-item-option').first().waitFor();
          await p.waitForTimeout(500);
          const hs = await popup
            .locator('.ant-select-item-option')
            .evaluateAll((es) =>
              es.map((e) => e.getBoundingClientRect().height),
            );
          if (hs.some((h) => h < 44))
            throw new Error('preset option touch size');
        }
        await popup
          .getByText(label, { exact: true })
          .filter({ visible: true })
          .last()
          .click();
        await p.waitForFunction(() =>
          [...document.querySelectorAll('.ant-select-dropdown')].every(
            (e) =>
              e.classList.contains('ant-select-dropdown-hidden') ||
              getComputedStyle(e).display === 'none',
          ),
        );
        await p.waitForTimeout(300);
      };
      const custom = () =>
        p.getByRole('region', { name: '我的地区教材组合', exact: true });
      const click = async (name) =>
        custom().getByRole('button', { name, exact: true }).click();
      const mathLabel = () =>
        p
          .locator(
            '.ant-select:has(#education-custom-math) .ant-select-selection-item',
          )
          .textContent();
      const assertKeep = async () => {
        if (
          !(await custom()
            .getByRole('button', { name: '一键应用我的组合', exact: true })
            .isDisabled())
        )
          throw new Error('unexpected saved scope');
        if ((await mathLabel()) !== '不更改此学科')
          throw new Error('inherited math edition');
      };
      const raw = () => p.evaluate(() => window.qaStored());
      if (provinceDefaults) {
        const region = p.getByRole('region', {
          name: '按地区切换教材组合',
          exact: true,
        });
        if (await p.locator('#education-region-school').isVisible())
          throw new Error('school required on initial view');
        const apply = region.getByRole('button', {
          name: '一键应用可用学科版本',
          exact: true,
        });
        if (!(await apply.isDisabled()))
          throw new Error('unknown system applied');
        await choose('education-region-system', '六三学制（小学六年）');
        for (const volume of ['上册', '下册']) {
          await choose('education-region-volume', volume);
          await apply.click();
          for (const label of [
            '语文 · 人教版（2024审定）',
            '数学 · 苏教版',
            '道德与法治 · 人教版（2024审定）',
          ])
            await p
              .getByRole('button', {
                name: `${label} · ${volume}`,
                exact: true,
              })
              .waitFor();
          if (
            (await p.evaluate(() =>
              localStorage.getItem('butler-grade-one-math-edition-v1'),
            )) !== 'sujiao'
          )
            throw new Error('Jiangsu math not applied');
        }
        await choose('education-region-province', '广东', true);
        await apply.click();
        if ((await p.getByRole('button', { name: /^数学 ·/ }).count()) !== 0)
          throw new Error('Jiangsu edition leaked into other province');
        if (
          (await p.evaluate(() =>
            localStorage.getItem('butler-grade-one-math-edition-v1'),
          )) !== 'sujiao'
        )
          throw new Error('unconfigured math lost preference');
        await choose('education-region-province', '福建', true);
        await region
          .getByText('该参考目录可选数学版本：', { exact: false })
          .waitFor();
        const reference = region.locator(
          'a[href="https://jyt.fujian.gov.cn/xxgk/zywj/202408/t20240812_6500947.htm"]',
        );
        await reference.waitFor();
        await region
          .getByText('参考2024年省级目录中的可选版本', { exact: false })
          .waitFor();
        for (const volume of ['上册', '下册']) {
          await choose('education-region-volume', volume);
          await apply.click();
          for (const subject of ['语文', '数学', '道德与法治'])
            await p
              .getByRole('button', {
                name: `${subject} · 人教版（2024审定） · ${volume}`,
                exact: true,
              })
              .waitFor();
          if (
            (await p.evaluate(() =>
              localStorage.getItem('butler-grade-one-math-edition-v1'),
            )) !== 'pep-2024'
          )
            throw new Error('Fujian default math not applied');
        }
        await region
          .getByText('参考2024年省级目录中的可选版本', { exact: false })
          .evaluate((e) => e.scrollIntoView({ block: 'center' }));
        await p.waitForTimeout(300);
        await p.screenshot({ path: `/tmp/butler-fujian-default-${width}.png` });
        await choose('education-region-system', '五四学制（小学五年）');
        if (!(await apply.isDisabled()))
          throw new Error('Fujian five-four applied');
        await choose('education-region-system', '六三学制（小学六年）');
        await choose('education-region-province', '山西', true);
        await region
          .locator(
            'a[href="https://xxgk.yczf.gov.cn/xzf/ycjyj/fdzdgknr/gzdt/202409/P020240909607430404832.pdf"]',
          )
          .waitFor();
        await region.getByText('按选用市分列', { exact: false }).waitFor();
        for (const volume of ['上册', '下册']) {
          await choose('education-region-volume', volume);
          await apply.click();
          for (const subject of ['语文', '数学', '道德与法治'])
            await p
              .getByRole('button', {
                name: `${subject} · 人教版（2024审定） · ${volume}`,
                exact: true,
              })
              .waitFor();
          if (
            (await p.evaluate(() =>
              localStorage.getItem('butler-grade-one-math-edition-v1'),
            )) !== 'pep-2024'
          )
            throw new Error('Shanxi math not applied');
        }
        await region
          .getByText('参考2024年省级目录中的可选版本', { exact: false })
          .evaluate((e) => e.scrollIntoView({ block: 'center' }));
        await p.waitForTimeout(300);
        await p.screenshot({ path: `/tmp/butler-shanxi-default-${width}.png` });
        await choose('education-region-province', '湖南', true);
        await choose('education-region-volume', '上册');
        await region
          .getByText('参考2025年省级目录中的可选版本', { exact: false })
          .waitFor();
        await region
          .locator(
            'a[href="https://fgw.yzcity.gov.cn/fgw/031005/202509/820220824b5e42d2bd0511558b8de68b.shtml"]',
          )
          .waitFor();
        await apply.click();
        for (const subject of ['语文', '数学', '道德与法治'])
          await p
            .getByRole('button', {
              name: `${subject} · 人教版（2024审定） · 上册`,
              exact: true,
            })
            .waitFor();
        if (
          (await p.evaluate(() =>
            localStorage.getItem('butler-grade-one-math-edition-v1'),
          )) !== 'pep-2024'
        )
          throw new Error('Hunan upper math not applied');
        await region
          .getByText('参考2025年省级目录中的可选版本', { exact: false })
          .evaluate((e) => e.scrollIntoView({ block: 'center' }));
        await p.waitForTimeout(300);
        await p.screenshot({ path: `/tmp/butler-hunan-default-${width}.png` });
        await choose('education-region-system', '五四学制（小学五年）');
        if (!(await apply.isDisabled()))
          throw new Error('Hunan five-four applied');
        await choose('education-region-system', '六三学制（小学六年）');
        await choose('education-region-volume', '下册');
        await apply.click();
        if ((await p.getByRole('button', { name: /^数学 ·/ }).count()) !== 0)
          throw new Error('Hunan upper math leaked into lower volume');
        if (
          await region
            .getByText('参考2025年省级目录中的可选版本', { exact: false })
            .count()
        )
          throw new Error('upper catalog displayed for lower volume');
        if (
          (await p.evaluate(() =>
            localStorage.getItem('butler-grade-one-math-edition-v1'),
          )) !== 'pep-2024'
        )
          throw new Error('Hunan unknown lower math erased manual preference');
        await choose('education-region-province', '江苏', true);
        await choose('education-region-volume', '上册');
        await apply.click();
        if (await p.locator('#education-region-school').isVisible())
          throw new Error('school reference opened automatically');
        await region.evaluate((e) => e.scrollIntoView({ block: 'start' }));
        await p.waitForTimeout(300);
        await p.screenshot({
          path: `/tmp/butler-province-defaults-${width}.png`,
          fullPage: true,
        });
        if (
          (await p.evaluate(async () =>
            JSON.stringify(await window.qaLoad()),
          )) !== library
        )
          throw new Error('native history changed');
        if ((await raw()) !== null)
          throw new Error('default overwrote personal presets');
        if (
          await p.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          )
        )
          throw new Error('default page overflow');
        await p
          .locator('button')
          .filter({ has: p.locator('svg.lucide-languages') })
          .click();
        await p.getByText('English', { exact: true }).last().click();
        await p
          .getByRole('region', {
            name: 'Switch textbook combinations by area',
            exact: true,
          })
          .waitFor();
        await p
          .getByText('Textbook adoption references (optional)', { exact: true })
          .waitFor();
        if (await p.locator('#education-region-school').isVisible())
          throw new Error('English requires school');
        const htmlClass = await p.locator('html').getAttribute('class');
        if (!htmlClass.includes('dark'))
          await p.locator('.theme-toggle svg').click();
        await choose('education-region-province', 'Fujian', true);
        const englishCatalog = p.getByText(
          'The 2024 provincial catalog lists alternatives.',
          { exact: false },
        );
        await englishCatalog.waitFor();
        await p
          .getByText('Mathematics alternatives in the reference catalog:', {
            exact: false,
          })
          .waitFor();
        await englishCatalog.evaluate((e) =>
          e.scrollIntoView({ block: 'center' }),
        );
        await p.waitForTimeout(500);
        if (
          await p.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          )
        )
          throw new Error('English dark overflow');
        await p.screenshot({
          path: `/tmp/butler-province-defaults-${width}-en-dark.png`,
          fullPage: true,
        });
        await choose('education-region-province', 'Hunan', true);
        await choose('education-region-volume', 'Upper volume');
        const hunanEnglishCatalog = p.getByText(
          'The 2025 provincial catalog lists alternatives.',
          { exact: false },
        );
        await hunanEnglishCatalog.waitFor();
        await hunanEnglishCatalog.evaluate((e) =>
          e.scrollIntoView({ block: 'center' }),
        );
        await p.waitForTimeout(500);
        if (
          await p.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          )
        )
          throw new Error('Hunan English dark overflow');
        await p.screenshot({
          path: `/tmp/butler-hunan-default-${width}-en-dark.png`,
        });
        if (
          (await p.evaluate(async () =>
            JSON.stringify(await window.qaLoad()),
          )) !== library
        )
          throw new Error('language changed native history');
        if (errors.length > 0 || bad.length > 0 || api.length > 0)
          throw new Error(JSON.stringify({ errors, bad, api }));
        console.log(
          JSON.stringify({
            width,
            provinceDefaults: true,
            JiangsuUpperLowerThreeSubjects: true,
            FujianUpperLowerThreeSubjects: true,
            ShanxiUpperLowerThreeSubjects: true,
            HunanUpperThreeSubjectsLowerTwoSubjects: true,
            HunanUpperCatalogNotInheritedByLower: true,
            HunanEnglishDarkCatalog: true,
            provincialCatalogAlternativesShown: true,
            FujianEnglishDarkCatalog: true,
            schoolOptionalCollapsed: true,
            otherProvinceDoesNotInheritMath: true,
            nativeHistoryUnchanged: true,
            personalPresetsUnchanged: true,
            EnglishDark: true,
          }),
        );
        await c.close();
        continue;
      }
      if (allAreas) {
        const zh = JSON.parse(
          await fs.readFile(
            `${repo}/apps/web-antd/src/locales/langs/zh-CN/educationLearning.json`,
            'utf8',
          ),
        );
        const areas = [
          'beijing',
          'tianjin',
          'hebei',
          'shanxi',
          'inner-mongolia',
          'liaoning',
          'jilin',
          'heilongjiang',
          'shanghai',
          'jiangsu',
          'zhejiang',
          'anhui',
          'fujian',
          'jiangxi',
          'shandong',
          'henan',
          'hubei',
          'hunan',
          'guangdong',
          'guangxi',
          'hainan',
          'chongqing',
          'sichuan',
          'guizhou',
          'yunnan',
          'tibet',
          'shaanxi',
          'gansu',
          'qinghai',
          'ningxia',
          'xinjiang',
          'hong-kong',
          'macau',
          'taiwan',
        ];
        const expected = [];
        await choose('education-region-system', zh['regionalSystem_six-three']);
        const plan = (i, volume) =>
          volume === 'upper'
            ? ['pep-2024', 'sujiao', 'bnu-2024'][i % 3]
            : ['sujiao', 'pep-2024'][i % 2];
        const editionLabel = (edition) => {
          if (edition === 'sujiao') return zh.sujiaoEdition;
          if (edition === 'bnu-2024') return zh.bnuEdition;
          return zh.pepEdition;
        };
        const assertApplied = async (edition, volume) => {
          await p
            .getByRole('button', {
              name: `数学 · ${editionLabel(edition)} · ${zh[volume]}`,
              exact: true,
            })
            .waitFor();
          for (const subject of ['语文', '道德与法治']) {
            await p
              .getByRole('button', {
                name: `${subject} · ${zh.pepEdition} · ${zh[volume]}`,
                exact: true,
              })
              .waitFor();
          }
          await p.waitForFunction(
            (edition) =>
              localStorage.getItem('butler-grade-one-math-edition-v1') ===
              edition,
            edition,
          );
          if (
            (await p.evaluate(async () =>
              JSON.stringify(await window.qaLoad()),
            )) !== library
          )
            throw new Error(
              'all-area application mutated the native learning record',
            );
          if (
            await p.evaluate(
              () => document.documentElement.scrollWidth > innerWidth,
            )
          )
            throw new Error('all-area page overflow');
        };
        for (const [i, province] of areas.entries()) {
          await choose(
            'education-region-province',
            zh[`regionalProvince_${province}`],
            true,
          );
          for (const volume of ['upper', 'lower']) {
            await choose('education-region-volume', zh[volume]);
            await assertKeep();
            const edition = plan(i, volume);
            await choose('education-custom-chinese', zh.pepEdition);
            await choose('education-custom-math', editionLabel(edition));
            await choose('education-custom-ethics', zh.pepEdition);
            await click('保存当前地区组合');
            await custom()
              .getByText(zh.regionalPresetSaved, { exact: true })
              .waitFor();
            expected.push({
              scope: {
                province,
                city: '',
                school: '',
                academicYear: '2026-2027',
                volume,
                schoolSystem: 'six-three',
              },
              editions: {
                chinese: 'pep-2024',
                math: edition,
                ethics: 'pep-2024',
              },
            });
            const actual = JSON.parse(await raw());
            if (JSON.stringify(actual.entries) !== JSON.stringify(expected))
              throw new Error(`all-area scope mismatch: ${province}/${volume}`);
            await click('一键应用我的组合');
            await assertApplied(edition, volume);
          }
          console.log(
            JSON.stringify({
              width,
              checkedAreas: i + 1,
              savedScopes: expected.length,
            }),
          );
        }
        const beforeReload = await raw();
        await p.reload({ waitUntil: 'networkidle' });
        await choose('education-region-system', zh['regionalSystem_six-three']);
        if ((await raw()) !== beforeReload)
          throw new Error('all-area sets lost on reload');
        for (const province of ['beijing', 'shandong', 'taiwan']) {
          await choose(
            'education-region-province',
            zh[`regionalProvince_${province}`],
            true,
          );
          for (const volume of ['upper', 'lower']) {
            await choose('education-region-volume', zh[volume]);
            const edition = plan(areas.indexOf(province), volume);
            if ((await mathLabel()) !== editionLabel(edition))
              throw new Error(
                `all-area restored wrong edition: ${province}/${volume}`,
              );
            await click('一键应用我的组合');
            await assertApplied(edition, volume);
          }
        }
        if ((await raw()) !== beforeReload)
          throw new Error('all-area application rewrote saved sets');
        if (errors.length > 0 || bad.length > 0 || api.length > 0)
          throw new Error(JSON.stringify({ errors, bad, api }));
        console.log(
          JSON.stringify({
            width,
            allAreas: 34,
            savedUpperLowerScopes: 68,
            nativeSessionUnchanged: true,
            reloadAllScopesUnchanged: true,
            restoredUiScopes: 6,
            threeSubjectApplication: true,
            actualSchoolAdoptionClaimed: false,
          }),
        );
        await c.close();
        continue;
      }
      await choose('education-region-city', '苏州');
      await choose('education-region-system', '六三学制（小学六年）');
      await choose('education-custom-chinese', '人教版（2024审定）');
      await choose('education-custom-math', '北师大版（2024审核，部分课程）');
      await choose('education-custom-ethics', '人教版（2024审定）');
      await click('保存当前地区组合');
      await custom()
        .getByText('组合已保存到此浏览器，尚未应用。', { exact: true })
        .waitFor();
      await click('一键应用我的组合');
      await p
        .getByRole('button', {
          name: '数学 · 北师大版（2024审核，部分课程） · 上册',
          exact: true,
        })
        .waitFor();
      if (
        (await p.evaluate(() =>
          localStorage.getItem('butler-grade-one-math-edition-v1'),
        )) !== 'bnu-2024'
      )
        throw new Error('BNU navigation preference not applied');
      await choose('education-region-province', '广东', true);
      await assertKeep();
      await choose('education-custom-math', '人教版（2024审定）');
      await click('保存当前地区组合');
      await click('一键应用我的组合');
      await p
        .getByRole('button', {
          name: '数学 · 人教版（2024审定） · 上册',
          exact: true,
        })
        .waitFor();
      if (JSON.parse(await raw()).entries.length !== 2)
        throw new Error('province set lost');
      await choose('education-region-volume', '下册');
      await assertKeep();
      await p.locator('#education-custom-math').focus();
      await p.locator('#education-custom-math').press('ArrowDown');
      const pending = p
        .locator('.education-regional-preset-options .ant-select-item-option')
        .filter({ hasText: '北师大版' });
      const pendingClass = await pending.getAttribute('class');
      if (!pendingClass.includes('disabled'))
        throw new Error('preparing lower edition selectable');
      await p.locator('#education-custom-math').press('Escape');
      await choose('education-custom-math', '苏教版');
      await click('保存当前地区组合');
      await click('一键应用我的组合');
      await p
        .getByRole('button', { name: '数学 · 苏教版 · 下册', exact: true })
        .waitFor();
      await choose('education-region-volume', '上册');
      if ((await mathLabel()) !== '人教版（2024审定）')
        throw new Error('upper set not restored');
      await click('一键应用我的组合');
      await choose('education-region-year', '2025—2026');
      await assertKeep();
      await choose('education-region-year', '2026—2027');
      if ((await mathLabel()) !== '人教版（2024审定）')
        throw new Error('year-specific set lost');
      await choose('education-region-province', '江苏', true);
      await assertKeep();
      await choose('education-region-city', '苏州');
      if ((await mathLabel()) !== '北师大版（2024审核，部分课程）')
        throw new Error('city set not restored');
      await choose('education-region-school', '苏州市吴江区绸都小学');
      await assertKeep();
      await choose('education-region-school', '未选择学校（手动选版）');
      if ((await mathLabel()) !== '北师大版（2024审核，部分课程）')
        throw new Error('school scope fallback');
      await choose('education-region-system', '五四学制（小学五年）');
      if (
        !(await custom()
          .getByRole('button', { name: '一键应用我的组合', exact: true })
          .isDisabled())
      )
        throw new Error('five-four applied');
      await choose('education-region-system', '六三学制（小学六年）');
      await click('一键应用我的组合');
      const savedBeforeReload = await raw();
      await p.reload({ waitUntil: 'networkidle' });
      await choose('education-region-system', '六三学制（小学六年）');
      await choose('education-region-city', '苏州');
      if (
        (await mathLabel()) !== '北师大版（2024审核，部分课程）' ||
        (await raw()) !== savedBeforeReload
      )
        throw new Error('reload lost set');
      if (width === 375) {
        const before = await raw();
        await choose('education-custom-math', '人教版（2024审定）');
        await p.evaluate(() => (window.qaFailWrite = true));
        await click('保存当前地区组合');
        await custom()
          .getByText('教材组合未保存成功，原组合仍保留。请重试保存。', {
            exact: true,
          })
          .waitFor();
        if ((await raw()) !== before)
          throw new Error('failed write changed store');
        await p.evaluate(() => (window.qaFailWrite = false));
        await click('保存当前地区组合');
        await choose('education-custom-math', '北师大版（2024审核，部分课程）');
        await click('保存当前地区组合');
        const intact = await raw();
        await p.evaluate(() =>
          sessionStorage.setItem('qa-preset-read', 'true'),
        );
        await p.reload({ waitUntil: 'networkidle' });
        await custom()
          .getByText('无法读取已保存的教材组合。原数据未覆盖，请重试读取。', {
            exact: true,
          })
          .waitFor();
        if (
          (await raw()) !== intact ||
          !(await custom()
            .getByRole('button', { name: '保存当前地区组合', exact: true })
            .isDisabled())
        )
          throw new Error('failed read overwritten');
        await p.evaluate(() => {
          window.qaFailRead = false;
          sessionStorage.removeItem('qa-preset-read');
        });
        await click('重试读取教材组合');
        await choose('education-region-system', '六三学制（小学六年）');
        await p.evaluate(() =>
          localStorage.setItem(
            'butler-grade-one-regional-presets-v1',
            '{"schemaVersion":999,"entries":[]}',
          ),
        );
        await p.reload({ waitUntil: 'networkidle' });
        await custom()
          .getByText('无法读取已保存的教材组合。原数据未覆盖，请重试读取。', {
            exact: true,
          })
          .waitFor();
        if (
          (await raw()) !== '{"schemaVersion":999,"entries":[]}' ||
          !(await custom()
            .getByRole('button', { name: '保存当前地区组合', exact: true })
            .isDisabled())
        )
          throw new Error('invalid stored data overwritten');
        await p.evaluate(
          (v) =>
            localStorage.setItem('butler-grade-one-regional-presets-v1', v),
          intact,
        );
        await click('重试读取教材组合');
        await choose('education-region-system', '六三学制（小学六年）');
        await choose('education-region-province', '广东', true);
        await click('删除保存组合');
        await p
          .locator('.ant-popconfirm-buttons button.ant-btn-primary')
          .click();
        await assertKeep();
        if (JSON.parse(await raw()).entries.length !== 2)
          throw new Error('remove wrong scope');
        await choose('education-region-volume', '下册');
        if ((await mathLabel()) !== '苏教版')
          throw new Error('remove deleted other volume');
        await choose('education-region-volume', '上册');
        await choose('education-region-province', '江苏', true);
        await choose('education-region-city', '苏州');
      }
      await click('一键应用我的组合');
      if (
        (await p.evaluate(async () =>
          JSON.stringify(await window.qaLoad()),
        )) !== library
      )
        throw new Error('preset changed learning record');
      await p.locator('#education-custom-math').scrollIntoViewIfNeeded();
      await p.waitForTimeout(400);
      await p.screenshot({
        path: `/tmp/butler-regional-preset-zh-fields-${width}.png`,
      });
      await custom()
        .getByRole('button', { name: '一键应用我的组合', exact: true })
        .scrollIntoViewIfNeeded();
      await p.screenshot({
        path: `/tmp/butler-regional-preset-zh-actions-${width}.png`,
      });
      await p
        .locator('button[aria-haspopup="menu"]')
        .filter({ has: p.locator('svg.lucide-languages') })
        .click();
      await p.getByText('English', { exact: true }).click();
      await p.waitForFunction(() => document.documentElement.lang === 'en-US');
      if (
        !(await p.evaluate(() =>
          document.documentElement.classList.contains('dark'),
        ))
      )
        await p.locator('.theme-toggle svg').click();
      await p.waitForTimeout(700);
      if (
        !(await p.evaluate(() =>
          document.documentElement.classList.contains('dark'),
        ))
      )
        throw new Error('dark theme not active');
      const en = p.getByRole('region', {
        name: 'My regional textbook set',
        exact: true,
      });
      await p.locator('#education-custom-math').scrollIntoViewIfNeeded();
      await p.screenshot({
        path: `/tmp/butler-regional-preset-en-fields-${width}.png`,
      });
      await en
        .getByRole('button', { name: 'Apply my saved set', exact: true })
        .scrollIntoViewIfNeeded();
      await p.screenshot({
        path: `/tmp/butler-regional-preset-en-actions-${width}.png`,
      });
      if (
        await p.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        )
      )
        throw new Error('English page overflow');
      const overlaps = await en.locator('label').evaluateAll((es) =>
        es.some((e) => {
          const select = e.parentElement.querySelector('.ant-select');
          return (
            select &&
            e.getBoundingClientRect().bottom >
              select.getBoundingClientRect().top
          );
        }),
      );
      if (overlaps) throw new Error('label and input overlap');
      const small = await en
        .locator('button,.ant-select-selector')
        .evaluateAll((es) =>
          es
            .filter((e) => e.getBoundingClientRect().height)
            .map((e) => e.getBoundingClientRect().height)
            .filter((h) => h < 44),
        );
      if (small.length > 0) throw new Error('small touch controls');
      if (
        (await raw()) === null ||
        (await p.evaluate(async () =>
          JSON.stringify(await window.qaLoad()),
        )) !== library
      )
        throw new Error('language changed data');
      if (errors.length > 0 || bad.length > 0 || api.length > 0)
        throw new Error(JSON.stringify({ errors, bad, api }));
      console.log(
        JSON.stringify({
          width,
          savedScopes: JSON.parse(await raw()).entries.length,
          threeSubjects: true,
          bnuLabel: true,
          provinceCitySchoolYearVolumeIsolation: true,
          reload: true,
          systemGuard: true,
          pendingLowerDisabled: true,
          oldNativeSessionUnchanged: true,
          englishDark: true,
          failureRetry: width === 375,
          invalidRead: width === 375,
          removeScopeOnly: width === 375,
        }),
      );
      await c.close();
    }
  } finally {
    if (b) await b.close();
    await new Promise((r) => server.close(r));
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
