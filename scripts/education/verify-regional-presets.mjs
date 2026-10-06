/* Verify personal regional presets in the actual Pages build with isolated Chrome profiles.
 * Creates one native unfinished learning record and checks it remains unchanged.
 * Personal choices never certify school adoption or curriculum completeness.
 * Usage: rtk proxy node scripts/education/verify-regional-presets.mjs [--mobile-only] [--all-areas] [--province-defaults] [--publisher-defaults] [--bnu-2026-defaults] [--bnu-missing-volumes] [--ningxia-defaults] [--shanghai-english-catalog]
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
const shanghaiEnglishCatalog = process.argv.includes(
  '--shanghai-english-catalog',
);
const allAreas = process.argv.includes('--all-areas');
const provinceDefaults = process.argv.includes('--province-defaults');
const missingVolumes = process.argv.includes('--bnu-missing-volumes');
const bnu2026 = process.argv.includes('--bnu-2026-defaults');
const ningxiaDefaults = process.argv.includes('--ningxia-defaults');
const publisherDefaults = process.argv.includes('--publisher-defaults');
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
        await input.evaluate((e) => e.scrollIntoView({ block: 'center' }));
        await p.waitForTimeout(300);
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
      if (shanghaiEnglishCatalog) {
        const beforePresets = await raw();
        await choose('education-region-province', '上海', true);
        await choose('education-region-system', '五四学制（小学五年）');
        for (const [volume, year, approval, published, issued, attachment] of [
          [
            '上册',
            '2026—2027',
            'SD－XS－2024001',
            '2026-08-10',
            '2026-06-18',
            '00e155989221056fb74efd6f967939f0.pdf',
          ],
          [
            '下册',
            '2025—2026',
            'SD－XS－2024002',
            '2026-01-05',
            '2025-12-10',
            '9ba8430bf7e54d3e19fce9c17b45f5fb.pdf',
          ],
        ]) {
          await choose('education-region-year', year);
          await choose('education-region-volume', volume);
          const region = p.getByRole('region', {
            name: '按地区切换教材组合',
            exact: true,
          });
          await region
            .getByText('官方目录已列明，课程待制作', { exact: true })
            .waitFor();
          const text = await region.innerText();
          for (const value of [
            approval,
            published,
            issued,
            '沪教英语（上海五四学制）',
            '暂不能一键应用',
          ]) {
            if (!text.includes(value))
              throw new Error(`Missing catalog identity: ${value}`);
          }
          if ((await region.locator(`a[href$="${attachment}"]`).count()) !== 1)
            throw new Error('Wrong independent attachment');
          if (
            !(await region
              .getByRole('button', {
                name: '一键应用可用学科版本',
                exact: true,
              })
              .isDisabled())
          )
            throw new Error('Five-four entry applied to six-three course');
          if (
            (await p.evaluate(async () =>
              JSON.stringify(await window.qaLoad()),
            )) !== library
          )
            throw new Error('Old library changed');
          if ((await raw()) !== beforePresets)
            throw new Error('Personal presets changed');
          await p.screenshot({
            path: `/tmp/butler-shanghai-english-catalog-${volume}-${width}.png`,
            fullPage: true,
          });
        }
        await choose('education-region-year', '2026—2027');
        const region = p.getByRole('region', {
          name: '按地区切换教材组合',
          exact: true,
        });
        if (
          await region
            .getByText('官方目录已列明，课程待制作', { exact: true })
            .count()
        )
          throw new Error('Spring catalog inherited into 2027');
        await choose('education-region-volume', '上册');
        await choose('education-region-system', '六三学制（小学六年）');
        if (
          await region
            .getByRole('button', { name: '一键应用可用学科版本', exact: true })
            .isDisabled()
        )
          throw new Error('Available independent subjects blocked');
        await p
          .locator('button[aria-haspopup="menu"]')
          .filter({ has: p.locator('svg.lucide-languages') })
          .click();
        await p.getByText('English', { exact: true }).click();
        const englishRegion = p.getByRole('region', {
          name: 'Switch textbook combinations by area',
          exact: true,
        });
        await englishRegion
          .getByText('Official catalog entry; course pending', { exact: true })
          .waitFor();
        const englishCatalogText = await englishRegion.innerText();
        if (!englishCatalogText.includes('Shanghai English (five-four system)'))
          throw new Error('Missing English edition');
        await choose(
          'education-region-system',
          'Five-four system (five primary years)',
        );
        if (
          !(await englishRegion
            .getByRole('button', {
              name: 'Apply available subject editions together',
              exact: true,
            })
            .isDisabled())
        )
          throw new Error('English catalog applied');
        if (
          !(await p.evaluate(() =>
            document.documentElement.classList.contains('dark'),
          ))
        )
          await p.locator('.theme-toggle svg').click();
        await p.waitForFunction(() =>
          document.documentElement.classList.contains('dark'),
        );
        if (
          await p.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          )
        )
          throw new Error('Page overflow');
        await englishRegion
          .getByText('Official catalog entry; course pending', { exact: true })
          .scrollIntoViewIfNeeded();
        await p.screenshot({
          path: `/tmp/butler-shanghai-english-catalog-en-dark-${width}.png`,
          fullPage: true,
        });
        if (
          (await p.evaluate(async () =>
            JSON.stringify(await window.qaLoad()),
          )) !== library ||
          (await raw()) !== beforePresets
        )
          throw new Error('Saved state changed');
        if (errors.length > 0 || bad.length > 0 || api.length > 0)
          throw new Error(JSON.stringify({ errors, bad, api }));
        console.log(
          JSON.stringify({
            width,
            shanghaiEnglishCatalog: true,
            separateVolumes: true,
            futureSpringNotInherited: true,
            noFalseCourseAction: true,
            oldRecords: true,
            errors,
            bad,
            api,
          }),
        );
        await c.close();
        continue;
      }
      if (publisherDefaults || bnu2026 || missingVolumes || ningxiaDefaults) {
        const beforePresets = await raw();
        await choose('education-region-system', '六三学制（小学六年）');
        const cases =
          bnu2026 || ningxiaDefaults
            ? []
            : [
                {
                  year: '2025',
                  zh: '吉林',
                  en: 'Jilin',
                  volume: 'upper',
                  edition: 'bnu-2024',
                  source:
                    'https://www.bnupg.com/docs/2025-10/bdf31864139243a7b7454dc7a3d9e238.pdf',
                  application: '2025-05-06',
                },
                {
                  year: '2025',
                  zh: '黑龙江',
                  en: 'Heilongjiang',
                  volume: 'upper',
                  edition: 'bnu-2024',
                  source:
                    'https://www.bnupg.com/docs/2025-10/c417a22c9c7a4dec8f33f1725ed38f20.pdf',
                  application: '2025-05-26',
                },
                {
                  year: '2025',
                  zh: '广西',
                  en: 'Guangxi',
                  volume: 'lower',
                  edition: 'pep-2024',
                  source: 'https://www.gxcbcmjt.com/tzgg/content_4695',
                },
              ];
        if (bnu2026)
          cases.push(
            ...[
              {
                zh: '北京',
                en: 'Beijing',
                volume: 'upper',
                edition: 'bnu-2024',
                source:
                  'https://www.bnupg.com/docs/2026-09/9aa60cfad67a4816869f0c8bc7efff62.pdf',
              },
              {
                zh: '北京',
                en: 'Beijing',
                volume: 'lower',
                edition: 'bnu-2024',
                source:
                  'https://www.bnupg.com/docs/2026-09/1377da900b6a4dc3ba8d315b5223e043.pdf',
              },
              {
                zh: '甘肃',
                en: 'Gansu',
                volume: 'upper',
                edition: 'bnu-2024',
                source:
                  'https://www.bnupg.com/docs/2026-09/90fce52d76894c978c7e3aed76baf157.pdf',
              },
              {
                zh: '甘肃',
                en: 'Gansu',
                volume: 'lower',
                edition: 'bnu-2024',
                source:
                  'https://www.bnupg.com/docs/2026-09/c93ab5e93677432ab382cc0666677c15.pdf',
              },
              {
                zh: '广东',
                en: 'Guangdong',
                volume: 'upper',
                edition: 'bnu-2024',
                source:
                  'https://www.bnupg.com/docs/2026-09/86dc329a25ae4dac96c76fcdec989d1d.pdf',
              },
              {
                zh: '广东',
                en: 'Guangdong',
                volume: 'lower',
                edition: 'bnu-2024',
                source:
                  'https://www.bnupg.com/docs/2026-09/4f71fee8395d436182cbf3c4866e79fd.pdf',
              },
              {
                zh: '河北',
                en: 'Hebei',
                volume: 'upper',
                edition: 'bnu-2024',
                source:
                  'https://www.bnupg.com/docs/2026-09/e9fee79d14ff4850bf37f11c7318b9bd.pdf',
              },
              {
                zh: '河北',
                en: 'Hebei',
                volume: 'lower',
                edition: 'bnu-2024',
                source:
                  'https://www.bnupg.com/docs/2026-09/c804849000194353b19bd59a5e6aceff.pdf',
              },
              {
                zh: '内蒙古',
                en: 'Inner Mongolia',
                volume: 'upper',
                edition: 'bnu-2024',
                source:
                  'https://www.bnupg.com/docs/2026-09/f543b49506754463a82df0166857ad63.pdf',
              },
              {
                zh: '内蒙古',
                en: 'Inner Mongolia',
                volume: 'lower',
                edition: 'bnu-2024',
                source:
                  'https://www.bnupg.com/docs/2026-09/16eba170c1174da399b7e7744c09d174.pdf',
              },
              {
                zh: '陕西',
                en: 'Shaanxi',
                volume: 'upper',
                edition: 'bnu-2024',
                source:
                  'https://www.bnupg.com/docs/2026-09/2fa773c1866e4fccae5995a0428afecc.pdf',
              },
              {
                zh: '陕西',
                en: 'Shaanxi',
                volume: 'lower',
                edition: 'bnu-2024',
                source:
                  'https://www.bnupg.com/docs/2026-09/91b73f75d2664b6185fa0fd9eefa2f3c.pdf',
              },
              {
                zh: '四川',
                en: 'Sichuan',
                volume: 'upper',
                edition: 'bnu-2024',
                source:
                  'https://www.bnupg.com/docs/2026-09/f8a54a4648f648079e18637cecdff4ec.pdf',
              },
              {
                zh: '四川',
                en: 'Sichuan',
                volume: 'lower',
                edition: 'bnu-2024',
                source:
                  'https://www.bnupg.com/docs/2026-09/5253a17448c040eebd84b48ad7c49b42.pdf',
              },
              {
                zh: '天津',
                en: 'Tianjin',
                volume: 'upper',
                edition: 'bnu-2024',
                source:
                  'https://www.bnupg.com/docs/2026-09/e8fb49ea97304a2aae859c0d7e5f0ad4.pdf',
              },
              {
                zh: '天津',
                en: 'Tianjin',
                volume: 'lower',
                edition: 'bnu-2024',
                source:
                  'https://www.bnupg.com/docs/2026-09/69a9b0a1452c45f2900b05cd4921ab97.pdf',
              },
            ],
          );
        if (missingVolumes)
          cases.push(
            ...[
              {
                zh: '吉林',
                en: 'Jilin',
                volume: 'lower',
                edition: 'bnu-2024',
                source:
                  'https://www.bnupg.com/docs/2026-09/0409b5019f434d08b9a9b5f845701f4c.pdf',
                year: '2026',
                oppositeEdition: 'bnu-2024',
              },
              {
                zh: '黑龙江',
                en: 'Heilongjiang',
                volume: 'lower',
                edition: 'bnu-2024',
                source:
                  'https://www.bnupg.com/docs/2026-09/00f661a0008b4cd6a16ff1e9c8455aef.pdf',
                year: '2026',
                oppositeEdition: 'bnu-2024',
              },
              {
                zh: '江西',
                en: 'Jiangxi',
                volume: 'lower',
                edition: 'bnu-2024',
                source:
                  'https://www.bnupg.com/docs/2026-09/d6e6003b51334f2c8ce64731eaf586f3.pdf',
                year: '2026',
                oppositeEdition: 'pep-2024',
              },
              {
                zh: '广西',
                en: 'Guangxi',
                volume: 'upper',
                edition: 'bnu-2024',
                source:
                  'https://www.bnupg.com/docs/2026-09/9069fad62b904fcc9d53fa225b2ade57.pdf',
                year: '2026',
                oppositeEdition: 'pep-2024',
              },
            ],
          );
        if (ningxiaDefaults)
          cases.push(
            ...['upper', 'lower'].map((volume) => ({
              year: '2025',
              zh: '宁夏',
              en: 'Ningxia',
              volume,
              edition: 'bnu-2024',
              source:
                volume === 'upper'
                  ? 'https://www.huinong.gov.cn/zwgk/fdzdgknr/xzsyxsf/202506/P020250612556292803293.pdf'
                  : 'https://fzggw.nx.gov.cn/tzgg/202412/P020241206592878480909.et',
            })),
          );
        for (const language of ['zh', 'en']) {
          if (language === 'en') {
            await p
              .locator('button')
              .filter({ has: p.locator('svg.lucide-languages') })
              .click();
            await p.getByText('English', { exact: true }).last().click();
            const classes = await p.locator('html').getAttribute('class');
            if (!classes.includes('dark'))
              await p.locator('.theme-toggle svg').click();
          }
          const english = language === 'en';
          const region = p.getByRole('region', {
            name: english
              ? 'Switch textbook combinations by area'
              : '按地区切换教材组合',
            exact: true,
          });
          const apply = region.getByRole('button', {
            name: english
              ? 'Apply available subject editions together'
              : '一键应用可用学科版本',
            exact: true,
          });
          for (const item of cases) {
            await choose('education-region-province', item[language], true);
            const volumeLabels = english
              ? { upper: 'Upper volume', lower: 'Lower volume' }
              : { upper: '上册', lower: '下册' };
            const editionLabels = english
              ? {
                  'bnu-2024': 'BNU (2024 approved)',
                  'pep-2024': 'PEP (2024 approved)',
                }
              : {
                  'bnu-2024': '北师大版（2024审核）',
                  'pep-2024': '人教版（2024审定）',
                };
            const volumeLabel = volumeLabels[item.volume];
            await choose('education-region-volume', volumeLabel);
            const edition = editionLabels[item.edition];
            let scopeLabel = english
              ? `This combination references regional textbook information published for ${item.year || (bnu2026 ? '2026' : '2025')}.`
              : `参考${item.year || (bnu2026 ? '2026' : '2025')}年出版方公布的本地区教材资料`;
            if (ningxiaDefaults)
              scopeLabel = english
                ? 'This combination references government-approved regional textbook retail prices for 2025.'
                : '参考2025年政府核定的本地区教材零售价格表';
            const scope = region.getByText(scopeLabel, { exact: false });
            await scope.waitFor();
            const scopeText = await scope.textContent();
            if (!scopeText.includes(edition))
              throw new Error('publisher scope edition mismatch');
            let alternativesLabel = english
              ? 'Mathematics editions listed by this publisher:'
              : '该出版方资料列明的数学版本：';
            if (ningxiaDefaults)
              alternativesLabel = english
                ? 'Mathematics textbook editions checked in this price table:'
                : '该价格表列明并已核对的数学教材版本：';
            const alternatives = region.getByText(alternativesLabel, {
              exact: false,
            });
            const alternativesText = await alternatives.textContent();
            if (
              !alternativesText.includes(edition) ||
              alternativesText.includes(english ? 'SJ edition' : '苏教版')
            )
              throw new Error('publisher alternatives mismatch');
            if (
              item.edition === 'bnu-2024' &&
              alternativesText.includes(english ? 'PEP' : '人教版')
            )
              throw new Error('PEP invented from BNU publisher source');
            await region.locator(`a[href="${item.source}"]`).waitFor();
            if (ningxiaDefaults) {
              const upper = item.volume === 'upper';
              await region
                .getByText(
                  english
                    ? `Published: ${upper ? '2025-06-12' : '2024-12-06'}`
                    : `资料发布：${upper ? '2025-06-12' : '2024-12-06'}`,
                  { exact: false },
                )
                .waitFor();
              await region
                .getByText(
                  english
                    ? `Document date: ${upper ? '2025-06-09' : '2024-12-06'}`
                    : `文件日期：${upper ? '2025-06-09' : '2024-12-06'}`,
                  { exact: false },
                )
                .waitFor();
              if (
                !scopeText.includes(
                  english
                    ? 'not a claim of province-wide adoption'
                    : '不表示当前学年全省统一选用',
                )
              )
                throw new Error('price reference scope missing');
            }
            if (item.application) {
              await region
                .getByText(`申报日期${item.application}`, { exact: false })
                .waitFor();
              await region
                .getByText(
                  english
                    ? 'Published: Not stated; checked: 2026-10-06'
                    : '资料发布：未标注',
                  { exact: false },
                )
                .waitFor();
              if (
                await region
                  .getByText(english ? 'Document date:' : '文件日期：', {
                    exact: false,
                  })
                  .count()
              )
                throw new Error(
                  'application date presented as document issue date',
                );
            }
            await apply.click();
            for (const subject of english
              ? ['Chinese', 'Mathematics', 'Morality and Law']
              : ['语文', '数学', '道德与法治']) {
              const math = subject === '数学' || subject === 'Mathematics';
              const subjectEdition = math ? edition : editionLabels['pep-2024'];
              await p
                .getByRole('button', {
                  name: `${subject} · ${subjectEdition} · ${volumeLabel}`,
                  exact: true,
                })
                .waitFor();
            }
            const storedEdition = await p.evaluate(() =>
              localStorage.getItem('butler-grade-one-math-edition-v1'),
            );
            if (storedEdition !== item.edition)
              throw new Error(
                'publisher action stores wrong mathematics edition',
              );
            await scope.evaluate((e) => e.scrollIntoView({ block: 'center' }));
            await p.waitForTimeout(500);
            if (
              await p.evaluate(
                () => document.documentElement.scrollWidth > innerWidth,
              )
            )
              throw new Error('publisher layout overflow');
            await p.screenshot({
              path: `/tmp/butler-publisher-${item.en}-${item.volume}-${language}-${width}.png`,
            });
            await choose(
              'education-region-volume',
              volumeLabels[item.volume === 'upper' ? 'lower' : 'upper'],
            );
            await apply.click();
            const oppositeVolume = item.volume === 'upper' ? 'lower' : 'upper';
            const oppositeEdition = item.oppositeEdition || 'bnu-2024';
            await p
              .getByRole('button', {
                name: `${english ? 'Mathematics' : '数学'} · ${editionLabels[oppositeEdition]} · ${volumeLabels[oppositeVolume]}`,
                exact: true,
              })
              .waitFor();
            if (await region.locator(`a[href="${item.source}"]`).count())
              throw new Error(
                'publisher source or edition inherited by opposite volume',
              );
          }
        }
        if ((await raw()) !== beforePresets)
          throw new Error('publisher actions overwrite personal presets');
        const afterLibrary = await p.evaluate(async () =>
          JSON.stringify(await window.qaLoad()),
        );
        if (afterLibrary !== library)
          throw new Error('publisher actions alter native learning history');
        if (errors.length > 0 || bad.length > 0 || api.length > 0)
          throw new Error(JSON.stringify({ errors, bad, api }));
        console.log(
          JSON.stringify({
            width,
            publisherDefaults: !ningxiaDefaults,
            ningxiaPriceVolumePair: ningxiaDefaults,
            BnuUpperJilinHeilongjiang: !bnu2026 && !ningxiaDefaults,
            GuangxiPepLower: !bnu2026 && !ningxiaDefaults,
            Bnu2026ProvincePairs: bnu2026 ? 8 : 0,
            missingVolumes: missingVolumes ? 4 : 0,
            editionNotSubstituted: true,
            oppositeVolumeSourceNotInherited: true,
            applicationDateNotPublication: true,
            bilingualDark: true,
            nativeHistoryUnchanged: true,
            personalPresetsUnchanged: true,
            errors,
            bad,
            api,
          }),
        );
        await c.close();
        continue;
      }
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
        await choose('education-region-province', '西藏', true);
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
        await choose('education-region-province', '湖北', true);
        await choose('education-region-volume', '下册');
        await region
          .locator(
            'a[href="https://jyt.hubei.gov.cn/zfxxgk/zc_GK2020/qtzdgkwj_GK2020/202602/t20260224_5879252.shtml"]',
          )
          .waitFor();
        const hubeiCatalog = region.getByText(
          '参考2026年省级目录中的可选版本',
          { exact: false },
        );
        await hubeiCatalog.waitFor();
        await apply.click();
        for (const subject of ['语文', '数学', '道德与法治'])
          await p
            .getByRole('button', {
              name: `${subject} · 人教版（2024审定） · 下册`,
              exact: true,
            })
            .waitFor();
        const hubeiAlternatives = await region
          .getByText('该参考目录可选数学版本：', { exact: false })
          .textContent();
        if (
          !hubeiAlternatives.includes('北师大版') ||
          hubeiAlternatives.includes('苏教版')
        )
          throw new Error(
            'Hubei catalog alternatives differ from verified publishers',
          );
        await hubeiCatalog.evaluate((e) =>
          e.scrollIntoView({ block: 'center' }),
        );
        await p.waitForTimeout(300);
        await p.screenshot({ path: `/tmp/butler-hubei-default-${width}.png` });
        await choose('education-region-volume', '上册');
        await apply.click();
        for (const subject of ['语文', '数学', '道德与法治'])
          await p
            .getByRole('button', {
              name: `${subject} · 人教版（2024审定） · 上册`,
              exact: true,
            })
            .waitFor();
        await region
          .locator(
            'a[href="https://fgw.hubei.gov.cn/fbjd/zc/zcwj/gg/202508/P020250829700876060881.pdf"]',
          )
          .waitFor();
        const hubeiUpperCatalog = region.getByText(
          '参考2025年省级目录中的可选版本',
          { exact: false },
        );
        await hubeiUpperCatalog.waitFor();
        await region
          .getByText('资料发布：未标注；核验日期：2026-10-06', { exact: false })
          .waitFor();
        const hubeiUpperAlternatives = await region
          .getByText('该参考目录可选数学版本：', { exact: false })
          .textContent();
        if (
          !hubeiUpperAlternatives.includes('北师大版') ||
          hubeiUpperAlternatives.includes('苏教版')
        )
          throw new Error(
            'Hubei autumn alternatives differ from verified publishers',
          );
        await hubeiUpperCatalog.evaluate((e) =>
          e.scrollIntoView({ block: 'center' }),
        );
        await p.waitForTimeout(500);
        await p.screenshot({
          path: `/tmp/butler-hubei-upper-default-${width}.png`,
        });
        if (await hubeiCatalog.count())
          throw new Error('Hubei spring source leaked into upper volume');
        await choose('education-region-province', '河南', true);
        for (const [volume, date, url] of [
          [
            '上册',
            '2025-04-25',
            'https://pdsyx.zfcg.henan.gov.cn/cmsweb81e27e/nas/webfile2024/henan/rootfiles/2025/05/09/8993a114d7d74ce2bc515b627698f204.pdf',
          ],
          [
            '下册',
            '2024-11-05',
            'https://sanmenxia.zfcg.henan.gov.cn/cmsweb81e27e/henan/rootfiles/2024/11/18/46ca9c21f429404a90a55568df927080.pdf',
          ],
        ]) {
          await choose('education-region-volume', volume);
          await region.locator(`a[href="${url}"]`).waitFor();
          const digitalCatalog = region.getByText(
            '参考2025年省级数字教材推荐目录中的可选版本',
            { exact: false },
          );
          await digitalCatalog.waitFor();
          if (
            await region
              .getByText('参考2025年省级目录中的可选版本', { exact: false })
              .count()
          )
            throw new Error(
              'Henan digital source presented as printed catalog',
            );
          await region
            .getByText(`文件日期：${date}`, {
              exact: false,
            })
            .waitFor();
          const alternatives = await region
            .getByText('该参考目录可选数学版本：', { exact: false })
            .textContent();
          for (const publisher of ['人教版', '苏教版', '北师大版'])
            if (!alternatives.includes(publisher))
              throw new Error('Henan verified alternative missing');
          await apply.click();
          for (const subject of ['语文', '数学', '道德与法治'])
            await p
              .getByRole('button', {
                name: `${subject} · 人教版（2024审定） · ${volume}`,
                exact: true,
              })
              .waitFor();
          await digitalCatalog.evaluate((e) =>
            e.scrollIntoView({ block: 'center' }),
          );
          await p.waitForTimeout(500);
          await p.screenshot({
            path: `/tmp/butler-henan-${volume === '上册' ? 'upper' : 'lower'}-default-${width}.png`,
          });
        }
        await choose('education-region-province', '浙江', true);
        for (const [volume, filename] of [
          ['上册', '1414745c337344dd9269d68078249459.pdf'],
          ['下册', 'b92c77b7999b4d30ba3d7f95b6c7eb89.pdf'],
        ]) {
          await choose('education-region-volume', volume);
          const catalog = region.getByText('参考2025年省级目录中的可选版本', {
            exact: false,
          });
          await catalog.waitFor();
          await region.locator(`a[href$="/${filename}"]`).waitFor();
          await region
            .getByText('资料发布：未标注；核验日期：2026-10-06', {
              exact: false,
            })
            .waitFor();
          const alternatives = await region
            .getByText('该参考目录可选数学版本：', { exact: false })
            .textContent();
          if (
            !alternatives.includes('人教版') ||
            !alternatives.includes('北师大版') ||
            alternatives.includes('苏教版')
          )
            throw new Error('Zhejiang verified alternatives mismatch');
          await apply.click();
          for (const subject of ['语文', '数学', '道德与法治'])
            await p
              .getByRole('button', {
                name: `${subject} · 人教版（2024审定） · ${volume}`,
                exact: true,
              })
              .waitFor();
          await catalog.evaluate((e) => e.scrollIntoView({ block: 'center' }));
          await p.waitForTimeout(500);
          await p.screenshot({
            path: `/tmp/butler-zhejiang-${volume === '上册' ? 'upper' : 'lower'}-default-${width}.png`,
          });
        }
        for (const [province, volume, year, file, publishers] of [
          [
            '贵州',
            '上册',
            '2025',
            'P020260205655763222699.pdf',
            ['人教版', '苏教版'],
          ],
          [
            '贵州',
            '下册',
            '2026',
            'P020251121626568924282.pdf',
            ['人教版', '苏教版'],
          ],
          ['重庆', '上册', '2025', 't20250710_14802548_wap.html', ['人教版']],
        ]) {
          await choose('education-region-province', province, true);
          await choose('education-region-volume', volume);
          const catalog = region.getByText(
            `参考${year}年省级目录中的可选版本`,
            { exact: false },
          );
          await catalog.waitFor();
          await region.locator(`a[href$="/${file}"]`).waitFor();
          const alternatives = await region
            .getByText('该参考目录可选数学版本：', { exact: false })
            .textContent();
          for (const publisher of ['人教版', '苏教版', '北师大版'])
            if (
              alternatives.includes(publisher) !==
              publishers.includes(publisher)
            )
              throw new Error(`${province} ${volume} alternatives mismatch`);
          await region
            .getByText(
              province === '重庆'
                ? '资料发布：2025-07-10；核验日期：2026-10-06'
                : '资料发布：未标注；核验日期：2026-10-06',
              { exact: false },
            )
            .waitFor();
          await apply.click();
          for (const subject of ['语文', '数学', '道德与法治'])
            await p
              .getByRole('button', {
                name: `${subject} · 人教版（2024审定） · ${volume}`,
                exact: true,
              })
              .waitFor();
          await catalog.evaluate((e) => e.scrollIntoView({ block: 'center' }));
          await p.waitForTimeout(500);
          await p.screenshot({
            path: `/tmp/butler-new-province-${province}-${volume}-${width}.png`,
          });
        }
        await choose('education-region-volume', '下册');
        if (
          await region
            .getByText('参考2025年省级目录中的可选版本', { exact: false })
            .count()
        )
          throw new Error('Chongqing upper reference leaked into lower volume');
        await choose('education-region-province', '广西', true);
        await choose('education-region-volume', '下册');
        const guangxiSource = 'https://www.gxcbcmjt.com/tzgg/content_4695';
        const guangxiScope = region.getByText(
          '参考2025年出版方公布的本地区教材资料',
          { exact: false },
        );
        await guangxiScope.waitFor();
        await region.locator(`a[href="${guangxiSource}"]`).waitFor();
        await region
          .getByText('资料发布：2025-02-27', { exact: false })
          .waitFor();
        const guangxiAlternatives = await region
          .getByText('该出版方资料列明的数学版本：', { exact: false })
          .textContent();
        if (
          !guangxiAlternatives.includes('人教版') ||
          guangxiAlternatives.includes('苏教版') ||
          guangxiAlternatives.includes('北师大版')
        )
          throw new Error('Guangxi publisher editions mismatch');
        if (
          await region
            .getByText('参考2025年省级目录中的可选版本', { exact: false })
            .count()
        )
          throw new Error(
            'Publisher reference presented as government catalog',
          );
        await apply.click();
        for (const subject of ['语文', '数学', '道德与法治'])
          await p
            .getByRole('button', {
              name: `${subject} · 人教版（2024审定） · 下册`,
              exact: true,
            })
            .waitFor();
        await guangxiScope.evaluate((e) =>
          e.scrollIntoView({ block: 'center' }),
        );
        await p.screenshot({
          path: `/tmp/butler-guangxi-lower-default-${width}.png`,
        });
        await choose('education-region-volume', '上册');
        await apply.click();
        if (
          !(await p
            .getByRole('button', {
              name: '数学 · 北师大版（2024审核） · 上册',
              exact: true,
            })
            .count()) ||
          (await region.locator(`a[href="${guangxiSource}"]`).count())
        )
          throw new Error('Guangxi lower inherited by upper');
        await choose('education-region-province', '江西', true);
        await choose('education-region-volume', '上册');
        const jiangxiSource =
          'https://www.dingnan.gov.cn/dnxxxgk/jgysf/202601/40a87d0a7dc840c7b9ba57ce7a2ab8d8/files/75ccbb0d852d4057bbb7bc739e4d1d89.pdf';
        await region.locator(`a[href="${jiangxiSource}"]`).waitFor();
        await region
          .getByText('文件日期：2025-09-28', { exact: false })
          .waitFor();
        await region.getByText('资料发布：未标注', { exact: false }).waitFor();
        const jiangxiAlternatives = await region
          .getByText('该参考目录可选数学版本：', { exact: false })
          .textContent();
        if (
          !jiangxiAlternatives.includes('人教版') ||
          !jiangxiAlternatives.includes('北师大版') ||
          jiangxiAlternatives.includes('苏教版')
        )
          throw new Error('Jiangxi alternatives mismatch');
        await apply.click();
        for (const subject of ['语文', '数学', '道德与法治'])
          await p
            .getByRole('button', {
              name: `${subject} · 人教版（2024审定） · 上册`,
              exact: true,
            })
            .waitFor();
        await region
          .locator(`a[href="${jiangxiSource}"]`)
          .evaluate((e) => e.scrollIntoView({ block: 'center' }));
        await p.screenshot({
          path: `/tmp/butler-jiangxi-upper-default-${width}.png`,
        });
        await choose('education-region-volume', '下册');
        await apply.click();
        if (
          !(await p
            .getByRole('button', {
              name: '数学 · 北师大版（2024审核） · 下册',
              exact: true,
            })
            .count()) ||
          (await region.locator(`a[href="${jiangxiSource}"]`).count())
        )
          throw new Error('Jiangxi upper inherited by lower');
        await choose('education-region-province', '辽宁', true);
        for (const [volume, year, issued, published, url] of [
          [
            '上册',
            '2025',
            '2025-07-21',
            '2025-07-23',
            'https://fgw.ln.gov.cn/fgw/index/tzgg/2025072310032719554/index.shtml',
          ],
          [
            '下册',
            '2026',
            '2026-01-05',
            '2026-01-08',
            'https://fgw.ln.gov.cn/fgw/index/tzgg/2026010816275051643/index.shtml',
          ],
        ]) {
          await choose('education-region-volume', volume);
          const catalog = region.getByText(
            `参考${year}年省级目录中的可选版本`,
            { exact: false },
          );
          await catalog.waitFor();
          await region.locator(`a[href="${url}"]`).waitFor();
          await region
            .getByText(`文件日期：${issued}`, { exact: false })
            .waitFor();
          await region
            .getByText(`资料发布：${published}`, { exact: false })
            .waitFor();
          const alternatives = await region
            .getByText('该参考目录可选数学版本：', { exact: false })
            .textContent();
          if (
            !alternatives.includes('人教版') ||
            !alternatives.includes('北师大版') ||
            alternatives.includes('苏教版')
          )
            throw new Error('Liaoning verified alternatives mismatch');
          await apply.click();
          for (const subject of ['语文', '数学', '道德与法治'])
            await p
              .getByRole('button', {
                name: `${subject} · 人教版（2024审定） · ${volume}`,
                exact: true,
              })
              .waitFor();
          await catalog.evaluate((e) => e.scrollIntoView({ block: 'center' }));
          await p.waitForTimeout(500);
          await p.screenshot({
            path: `/tmp/butler-liaoning-${volume === '上册' ? 'upper' : 'lower'}-default-${width}.png`,
          });
        }
        await choose('education-region-province', '安徽', true);
        await choose('education-region-volume', '上册');
        const anhuiCatalog = region.getByText(
          '参考2025年省级目录中的可选版本',
          { exact: false },
        );
        await anhuiCatalog.waitFor();
        await region
          .locator(
            'a[href="https://www.jiuhuashan.gov.cn/OpennessContent/show/1675041.html"]',
          )
          .waitFor();
        await region
          .getByText('文件日期：2025-08-15', { exact: false })
          .waitFor();
        await region
          .getByText('资料发布：2025-08-20', { exact: false })
          .waitFor();
        const anhuiAlternatives = await region
          .getByText('该参考目录可选数学版本：', { exact: false })
          .textContent();
        for (const publisher of ['人教版', '苏教版', '北师大版'])
          if (!anhuiAlternatives.includes(publisher))
            throw new Error('Anhui upper alternative missing');
        await apply.click();
        for (const subject of ['语文', '数学', '道德与法治'])
          await p
            .getByRole('button', {
              name: `${subject} · 人教版（2024审定） · 上册`,
              exact: true,
            })
            .waitFor();
        await anhuiCatalog.evaluate((e) =>
          e.scrollIntoView({ block: 'center' }),
        );
        await p.waitForTimeout(500);
        await p.screenshot({
          path: `/tmp/butler-anhui-upper-default-${width}.png`,
        });
        await choose('education-region-volume', '下册');
        await anhuiCatalog.waitFor();
        await region
          .locator(
            'a[href="https://fzggw.ah.gov.cn/group6/M00/0C/9B/wKg8BmeQX3yADVmNAAr0AJTqIDc908.doc"]',
          )
          .waitFor();
        if (
          await region
            .locator(
              'a[href="https://www.jiuhuashan.gov.cn/OpennessContent/show/1675041.html"]',
            )
            .count()
        )
          throw new Error('Anhui autumn source leaked into lower');
        await region.getByText('第9、128、157项', { exact: false }).waitFor();
        await region.getByText('资料发布：未标注', { exact: false }).waitFor();
        const anhuiLowerAlternatives = await region
          .getByText('该参考目录可选数学版本：', { exact: false })
          .textContent();
        for (const publisher of ['人教版', '苏教版', '北师大版'])
          if (!anhuiLowerAlternatives.includes(publisher))
            throw new Error('Anhui spring alternative missing');
        await apply.click();
        for (const subject of ['语文', '数学', '道德与法治'])
          await p
            .getByRole('button', {
              name: `${subject} · 人教版（2024审定） · 下册`,
              exact: true,
            })
            .waitFor();
        await anhuiCatalog.evaluate((e) =>
          e.scrollIntoView({ block: 'center' }),
        );
        await p.waitForTimeout(500);
        await p.screenshot({
          path: `/tmp/butler-anhui-lower-default-${width}.png`,
        });
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
        await choose('education-region-province', 'Hubei', true);
        await choose('education-region-volume', 'Upper volume');
        const hubeiEnglishCatalog = p.getByText(
          'The 2025 provincial catalog lists alternatives.',
          { exact: false },
        );
        await hubeiEnglishCatalog.waitFor();
        await p
          .getByText('Published: Not stated; checked: 2026-10-06', {
            exact: false,
          })
          .waitFor();
        await hubeiEnglishCatalog.evaluate((e) =>
          e.scrollIntoView({ block: 'center' }),
        );
        await p.waitForTimeout(500);
        if (
          await p.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          )
        )
          throw new Error('Hubei English dark overflow');
        await p.screenshot({
          path: `/tmp/butler-hubei-upper-default-${width}-en-dark.png`,
        });
        await choose('education-region-province', 'Henan', true);
        for (const volume of ['Upper volume', 'Lower volume']) {
          await choose('education-region-volume', volume);
          const digitalCatalog = p.getByText(
            'The 2025 provincial digital textbook catalog lists alternatives.',
            { exact: false },
          );
          await digitalCatalog.waitFor();
          await p
            .getByText(
              `Document date: ${volume === 'Upper volume' ? '2025-04-25' : '2024-11-05'}`,
              { exact: false },
            )
            .waitFor();
          await p
            .getByText('Published: Not stated; checked: 2026-10-06', {
              exact: false,
            })
            .waitFor();
          await digitalCatalog.evaluate((e) =>
            e.scrollIntoView({ block: 'center' }),
          );
          await p.waitForTimeout(500);
          if (
            await p.evaluate(
              () => document.documentElement.scrollWidth > innerWidth,
            )
          )
            throw new Error('Henan English dark overflow');
          await p.screenshot({
            path: `/tmp/butler-henan-${volume === 'Upper volume' ? 'upper' : 'lower'}-default-${width}-en-dark.png`,
          });
        }
        await choose('education-region-province', 'Zhejiang', true);
        for (const volume of ['Upper volume', 'Lower volume']) {
          await choose('education-region-volume', volume);
          const catalog = p.getByText(
            'The 2025 provincial catalog lists alternatives.',
            { exact: false },
          );
          await catalog.waitFor();
          await p
            .getByText('Published: Not stated; checked: 2026-10-06', {
              exact: false,
            })
            .waitFor();
          await catalog.evaluate((e) => e.scrollIntoView({ block: 'center' }));
          await p.waitForTimeout(500);
          if (
            await p.evaluate(
              () => document.documentElement.scrollWidth > innerWidth,
            )
          )
            throw new Error('Zhejiang English dark overflow');
          await p.screenshot({
            path: `/tmp/butler-zhejiang-${volume === 'Upper volume' ? 'upper' : 'lower'}-default-${width}-en-dark.png`,
          });
        }
        for (const [province, volume, year] of [
          ['Guizhou', 'Upper volume', '2025'],
          ['Guizhou', 'Lower volume', '2026'],
          ['Chongqing', 'Upper volume', '2025'],
        ]) {
          await choose('education-region-province', province, true);
          await choose('education-region-volume', volume);
          const catalog = p.getByText(
            `The ${year} provincial catalog lists alternatives.`,
            { exact: false },
          );
          await catalog.waitFor();
          await p
            .getByText(
              province === 'Chongqing'
                ? 'Published: 2025-07-10; checked: 2026-10-06'
                : 'Published: Not stated; checked: 2026-10-06',
              { exact: false },
            )
            .waitFor();
          await catalog.evaluate((e) => e.scrollIntoView({ block: 'center' }));
          await p.waitForTimeout(500);
          if (
            await p.evaluate(
              () => document.documentElement.scrollWidth > innerWidth,
            )
          )
            throw new Error(`${province} English dark overflow`);
          await p.screenshot({
            path: `/tmp/butler-new-province-${province}-${volume}-${width}-en-dark.png`,
          });
        }
        await choose('education-region-volume', 'Lower volume');
        if (
          await p
            .getByText('The 2025 provincial catalog lists alternatives.', {
              exact: false,
            })
            .count()
        )
          throw new Error(
            'Chongqing English upper reference leaked into lower volume',
          );
        await choose('education-region-province', 'Guangxi', true);
        await choose('education-region-volume', 'Lower volume');
        const guangxiEnglishScope = p.getByText(
          'This combination references regional textbook information published for 2025.',
          { exact: false },
        );
        await guangxiEnglishScope.waitFor();
        await p.locator(`a[href="${guangxiSource}"]`).waitFor();
        await p
          .getByText('Published: 2025-02-27; checked: 2026-10-06', {
            exact: false,
          })
          .waitFor();
        if (
          await p
            .getByText('The 2025 provincial catalog lists alternatives.', {
              exact: false,
            })
            .count()
        )
          throw new Error(
            'English publisher reference presented as provincial catalog',
          );
        await p
          .getByRole('button', {
            name: 'Apply available subject editions together',
            exact: true,
          })
          .click();
        for (const subject of ['Chinese', 'Mathematics', 'Morality and Law'])
          await p
            .getByRole('button', {
              name: `${subject} · PEP (2024 approved) · Lower volume`,
              exact: true,
            })
            .waitFor();
        await guangxiEnglishScope.evaluate((e) =>
          e.scrollIntoView({ block: 'center' }),
        );
        await p.waitForTimeout(500);
        if (
          await p.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          )
        )
          throw new Error('Guangxi English dark overflow');
        await p.screenshot({
          path: `/tmp/butler-guangxi-lower-default-${width}-en-dark.png`,
        });
        await choose('education-region-volume', 'Upper volume');
        if (await p.locator(`a[href="${guangxiSource}"]`).count())
          throw new Error('English Guangxi lower inherited by upper');
        await choose('education-region-province', 'Jiangxi', true);
        await choose('education-region-volume', 'Upper volume');
        await p.locator(`a[href="${jiangxiSource}"]`).waitFor();
        await p
          .getByText('Document date: 2025-09-28', { exact: false })
          .waitFor();
        await p
          .getByText('Published: Not stated; checked: 2026-10-06', {
            exact: false,
          })
          .waitFor();
        await p
          .getByRole('button', {
            name: 'Apply available subject editions together',
            exact: true,
          })
          .click();
        for (const subject of ['Chinese', 'Mathematics', 'Morality and Law'])
          await p
            .getByRole('button', {
              name: `${subject} · PEP (2024 approved) · Upper volume`,
              exact: true,
            })
            .waitFor();
        await p
          .locator(`a[href="${jiangxiSource}"]`)
          .evaluate((e) => e.scrollIntoView({ block: 'center' }));
        await p.waitForTimeout(500);
        if (
          await p.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          )
        )
          throw new Error('Jiangxi English dark overflow');
        await p.screenshot({
          path: `/tmp/butler-jiangxi-upper-default-${width}-en-dark.png`,
        });
        await choose('education-region-volume', 'Lower volume');
        if (await p.locator(`a[href="${jiangxiSource}"]`).count())
          throw new Error('Jiangxi English upper source leaked into lower');
        await choose('education-region-province', 'Liaoning', true);
        for (const [volume, year, issued, published] of [
          ['Upper volume', '2025', '2025-07-21', '2025-07-23'],
          ['Lower volume', '2026', '2026-01-05', '2026-01-08'],
        ]) {
          await choose('education-region-volume', volume);
          const catalog = p.getByText(
            `The ${year} provincial catalog lists alternatives.`,
            { exact: false },
          );
          await catalog.waitFor();
          await p
            .getByText(`Document date: ${issued}`, { exact: false })
            .waitFor();
          await p
            .getByText(`Published: ${published}; checked: 2026-10-06`, {
              exact: false,
            })
            .waitFor();
          await catalog.evaluate((e) => e.scrollIntoView({ block: 'center' }));
          await p.waitForTimeout(500);
          if (
            await p.evaluate(
              () => document.documentElement.scrollWidth > innerWidth,
            )
          )
            throw new Error('Liaoning English dark overflow');
          await p.screenshot({
            path: `/tmp/butler-liaoning-${volume === 'Upper volume' ? 'upper' : 'lower'}-default-${width}-en-dark.png`,
          });
        }
        await choose('education-region-province', 'Anhui', true);
        await choose('education-region-volume', 'Upper volume');
        const anhuiEnglishCatalog = p.getByText(
          'The 2025 provincial catalog lists alternatives.',
          { exact: false },
        );
        await anhuiEnglishCatalog.waitFor();
        await p
          .getByText('Document date: 2025-08-15', { exact: false })
          .waitFor();
        await p
          .getByText('Published: 2025-08-20; checked: 2026-10-06', {
            exact: false,
          })
          .waitFor();
        await anhuiEnglishCatalog.evaluate((e) =>
          e.scrollIntoView({ block: 'center' }),
        );
        await p.waitForTimeout(500);
        if (
          await p.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          )
        )
          throw new Error('Anhui English dark overflow');
        await p.screenshot({
          path: `/tmp/butler-anhui-upper-default-${width}-en-dark.png`,
        });
        await choose('education-region-volume', 'Lower volume');
        await anhuiEnglishCatalog.waitFor();
        await p
          .locator(
            'a[href="https://fzggw.ah.gov.cn/group6/M00/0C/9B/wKg8BmeQX3yADVmNAAr0AJTqIDc908.doc"]',
          )
          .waitFor();
        await p
          .getByText('Published: Not stated; checked: 2026-10-06', {
            exact: false,
          })
          .waitFor();
        if (
          (await p
            .getByText('Document date: 2025-08-15', { exact: false })
            .count()) ||
          (await p
            .getByText('Published: 2025-08-20;', { exact: false })
            .count())
        )
          throw new Error('Anhui upper dates leaked into lower');
        await p
          .getByRole('button', {
            name: 'Apply available subject editions together',
            exact: true,
          })
          .click();
        for (const subject of ['Chinese', 'Mathematics', 'Morality and Law'])
          await p
            .getByRole('button', {
              name: `${subject} · PEP (2024 approved) · Lower volume`,
              exact: true,
            })
            .waitFor();
        await anhuiEnglishCatalog.evaluate((e) =>
          e.scrollIntoView({ block: 'center' }),
        );
        await p.waitForTimeout(500);
        if (
          await p.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          )
        )
          throw new Error('Anhui lower English dark overflow');
        await p.screenshot({
          path: `/tmp/butler-anhui-lower-default-${width}-en-dark.png`,
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
            HubeiUpperLowerThreeSubjects: true,
            HenanUpperLowerThreeSubjects: true,
            LiaoningUpperLowerThreeSubjects: true,
            ZhejiangUpperLowerThreeSubjects: true,
            ZhejiangVolumeSourcesAndUnknownDatesBilingual: true,
            LiaoningVolumeYearsSourcesDatesBilingual: true,
            AnhuiUpperLowerThreeSubjects: true,
            JiangxiBothVolumesThreeSubjects: true,
            JiangxiSourceDatesAndScopeBilingual: true,
            GuangxiLowerPublisherReferenceThreeSubjects: true,
            GuangxiPublisherScopeAndUpperIsolationBilingual: true,
            AnhuiUpperDatesAndScopeBilingual: true,
            AnhuiVolumeSourcesAndUnknownSpringDatesBilingual: true,
            HenanDigitalCatalogScopeBilingual: true,
            HenanVolumeSourcesAndDatesSeparate: true,
            HubeiUpperUnknownPublicationDateBilingual: true,
            HubeiUpperEnglishDarkCatalog: true,
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
      await choose('education-custom-math', '北师大版（2024审核）');
      await choose('education-custom-ethics', '人教版（2024审定）');
      await click('保存当前地区组合');
      await custom()
        .getByText('组合已保存到此浏览器，尚未应用。', { exact: true })
        .waitFor();
      await click('一键应用我的组合');
      await p
        .getByRole('button', {
          name: '数学 · 北师大版（2024审核） · 上册',
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
      if (pendingClass.includes('disabled'))
        throw new Error('authored BNU lower edition is disabled');
      await p.locator('#education-custom-math').press('Escape');
      await choose('education-custom-math', '北师大版（2024审核）');
      await click('保存当前地区组合');
      await click('一键应用我的组合');
      await p
        .getByRole('button', {
          name: '数学 · 北师大版（2024审核） · 下册',
          exact: true,
        })
        .waitFor();
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
      if ((await mathLabel()) !== '北师大版（2024审核）')
        throw new Error('city set not restored');
      await choose('education-region-school', '苏州市吴江区绸都小学');
      await assertKeep();
      await choose('education-region-school', '未选择学校（手动选版）');
      if ((await mathLabel()) !== '北师大版（2024审核）')
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
        (await mathLabel()) !== '北师大版（2024审核）' ||
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
        await choose('education-custom-math', '北师大版（2024审核）');
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
          bnuLowerSelectableAndApplied: true,
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
