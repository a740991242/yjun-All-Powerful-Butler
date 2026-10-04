/* Inspect current published curriculum resources in an isolated browser.
 * This is an inventory, not a copyright or pedagogical completion certificate.
 * Usage: rtk proxy node scripts/education/audit-resources.mjs [local Vite URL]
 * JSON is written to stdout; no learner storage or source files are modified.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

const educationRoot = fileURLToPath(
  new URL('../../apps/web-antd/src/views/education/', import.meta.url),
);
const publicRoot = fileURLToPath(
  new URL('../../apps/web-antd/public/', import.meta.url),
);
const media = /\.(?:png|jpe?g|webp|gif|svg|pdf|mp3|wav|ogg|mp4)$/i;
async function sourceInventory(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await sourceInventory(filename)));
    else files.push(filename);
  }
  return files.toSorted((a, b) => a.localeCompare(b));
}
const classical = [
  ['咏鹅', '骆宾王', '曲项向天歌'],
  ['画', '原页未署作者', '远看山有色'],
  ['悯农（其二）', '李绅', '锄禾日当午'],
  ['江南', '汉乐府', '江南可采莲'],
  ['古朗月行（节选）', '李白', '小时不识月'],
  ['风', '李峤', '解落三秋叶'],
  ['春晓', '孟浩然', '春眠不觉晓'],
  ['寻隐者不遇', '贾岛', '松下问童子'],
  ['赠汪伦', '李白', '李白乘舟将欲行'],
  ['静夜思', '李白', '床前明月光'],
  ['人之初（古籍节选）', '不新增个人署名', '人之初，性本善'],
  ['池上', '白居易', '小娃撑小艇'],
  ['小池', '杨万里', '泉眼无声惜细流'],
  ['画鸡', '唐寅', '头上红冠不用裁'],
];
async function main() {
  const base = new URL(process.argv[2] || 'http://127.0.0.1:5666');
  if (!['127.0.0.1', '[::1]', 'localhost'].includes(base.hostname))
    throw new Error(
      'Use a local Vite server; do not inspect user browser storage.',
    );
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  let report;
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(base.origin, { waitUntil: 'networkidle' });
    report = await page.evaluate(async () => {
      const [cn, math, sj, ethics, ethicsMessages, bnu] = await Promise.all([
        import('/src/views/education/content/chinese.ts'),
        import('/src/views/education/content/math.ts'),
        import('/src/views/education/content/sujiao.ts'),

        import('/src/views/education/content/ethics.ts'),
        import('/src/locales/langs/zh-CN/educationEthics.json'),
        import('/src/views/education/content/bnu.ts'),
      ]);
      const ethicsText = (key) => {
        let value = ethicsMessages.default;
        for (const part of key.split('.').slice(1)) {
          if (!value || typeof value !== 'object')
            throw new Error(`Missing ethics text ${key}`);
          value = value[part];
        }
        if (typeof value !== 'string')
          throw new Error(`Missing ethics text ${key}`);
        return value;
      };
      const books = [
        ...cn.chineseBooks,
        ...math.mathBooks,
        ...sj.sujiaoBooks,
        ...ethics.createEthicsBooks(ethicsText),
        bnu.bnuUpperBook,
      ];
      return { books };
    });
    await context.close();
  } finally {
    await browser.close();
  }
  const markers = [];
  const multiline = new Map();
  const shortMaterials = new Map();
  const strings = [];
  const urls = new Map();
  function walk(value, location, lessonId) {
    if (Array.isArray(value)) {
      value.forEach((entry, i) => walk(entry, `${location}[${i}]`, lessonId));
    } else if (value && typeof value === 'object') {
      const current =
        value.textbookTitle && value.questions ? value.id : lessonId;
      for (const [key, entry] of Object.entries(value))
        walk(entry, `${location}.${key}`, current);
    } else if (typeof value === 'string') {
      strings.push({ value, location, lessonId });
      // Include short materials even without punctuation or quotation marks.
      // A character card and a modern quotation both need an inspectable origin.
      if (
        location.endsWith('.material') &&
        (value.match(/\n/g)?.length ?? 0) < 2
      ) {
        if (!shortMaterials.has(value)) shortMaterials.set(value, []);
        shortMaterials
          .get(value)
          .push({ location, lessonId: lessonId ?? null });
      }
      for (const match of value.matchAll(
        /https?:\/\/[A-Za-z0-9:/?#@!$&'()*+,;=%._~-]+/g,
      )) {
        const url = match[0].replace(/[.,;)]+$/, '');
        if (!urls.has(url)) urls.set(url, []);
        urls.get(url).push({ location, lessonId: lessonId ?? null });
      }
      if (/data:|<(?:img|audio|video|iframe|script)\b|base64/i.test(value))
        markers.push(location);
      if (
        (value.match(/\n/g)?.length ?? 0) >= 2 &&
        (location.endsWith('.material') || /[，。？！]/.test(value)) &&
        !location.endsWith('.review.notes')
      ) {
        if (!multiline.has(value)) multiline.set(value, []);
        multiline.get(value).push({ location, lessonId: lessonId ?? null });
      }
    }
  }
  walk(report, 'curriculum');
  const files = await sourceInventory(educationRoot);
  const publicFiles = await sourceInventory(publicRoot);
  const mediaEmbeddingComponents = [];
  const svgComponents = [];
  for (const filename of files.filter((f) => f.endsWith('.vue'))) {
    const text = await readFile(filename, 'utf8');
    const relative = path.relative(educationRoot, filename);
    if (/<svg\b/.test(text)) svgComponents.push(relative);
    if (
      /<(?:img|audio|video|iframe)\b|v-html\b|new Audio\b|speechSynthesis/.test(
        text,
      )
    )
      mediaEmbeddingComponents.push(relative);
  }
  const output = {
    schemaVersion: 1,
    inspectedAt: new Date().toISOString(),
    limitation:
      'Inventory of currently registered course text and source files. URLs are provenance references, not proof that a link is live, that editions match, or that rights/content review is complete. Modern quotations and single-line text still require source review; multiline and short-material inventories are review aids, not automatic classifications. Short materials include all registered question materials with fewer than two line breaks, without a length or punctuation threshold; step text and other fields are not included in that list. All material fields with two or more line breaks enter the multiline inventory even without Chinese punctuation; questionMaterialCoverage reports any material reference missed by both inventories. No learner data is read.',
    books: report.books.map((book) => {
      const lessons = book.units.flatMap((unit) => unit.lessons);
      return {
        id: book.id,
        available: lessons.filter((l) => l.status === 'available').length,
        otherEntries: lessons.filter((l) => l.status !== 'available').length,
        specialties: book.specialties?.length ?? 0,
        transitions: book.transitions?.length ?? 0,
      };
    }),
    provenanceUrls: [...urls]
      .toSorted(([a], [b]) => a.localeCompare(b))
      .map(([url, references]) => ({ url, references })),
    embeddedMediaMarkers: markers,
    localEducationMediaFiles: files
      .filter((f) => media.test(f))
      .map((f) => path.relative(educationRoot, f)),
    publicMediaFiles: publicFiles
      .filter((f) => media.test(f))
      .map((f) => path.relative(publicRoot, f)),
    svgComponents,
    mediaEmbeddingComponents,
    classicalTextAnchors: classical.map(([title, credit, anchor]) => ({
      title,
      credit,
      anchor,
      references: strings
        .filter((s) => s.value.includes(anchor))
        .map(({ location, lessonId }) => ({
          location,
          lessonId: lessonId ?? null,
        })),
    })),
    shortMaterialReviewCandidates: [...shortMaterials].map(
      ([text, references]) => ({
        text,
        references,
      }),
    ),
    questionMaterialCoverage: {
      references: strings.filter((entry) =>
        entry.location.endsWith('.material'),
      ).length,
      uniqueTexts: new Set(
        strings
          .filter((entry) => entry.location.endsWith('.material'))
          .map((entry) => entry.value),
      ).size,
      uncoveredReferences: strings.filter(
        (entry) =>
          entry.location.endsWith('.material') &&
          !shortMaterials.has(entry.value) &&
          !multiline.has(entry.value),
      ),
    },
    multilineReviewCandidates: [...multiline].map(([text, references]) => ({
      text,
      references,
    })),
  };
  console.log(JSON.stringify(output, null, 2));
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
