/* Export declared curriculum metadata from the running local Vite app.
 * Fresh browser context only: no login, learner records, or user browser storage.
 * Usage: rtk proxy node scripts/education/export-coverage.mjs [http://localhost:5666]
 */
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';
async function main() {
  const base = new URL(process.argv[2] || 'http://localhost:5666');
  if (!['127.0.0.1', '[::1]', 'localhost'].includes(base.hostname))
    throw new Error('Use a local Vite development server.');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  let report;
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(base.origin, { waitUntil: 'domcontentloaded' });
    report = await page.evaluate(async () => {
      const [cn, math, sj, textbooks, characters, ethics, ethicsMessages] =
        await Promise.all([
          import('/src/views/education/content/chinese.ts'),
          import('/src/views/education/content/math.ts'),
          import('/src/views/education/content/sujiao.ts'),
          import('/src/views/education/content/textbooks.ts'),
          import('/src/views/education/content/characters.ts'),
          import('/src/views/education/content/ethics.ts'),
          import('/src/locales/langs/zh-CN/educationEthics.json'),
        ]);
      const models = [
        ...textbooks.textbooks,
        textbooks.findTextbook('math', 'sujiao', 'upper'),
        textbooks.findTextbook('math', 'sujiao', 'lower'),
        ...ethics.ethicsTextbooks,
      ];
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
      ];
      const taskCounts = (qs) => ({
        objective: qs.filter(
          (q) => !['manual', 'reflection'].includes(q.rule.kind),
        ).length,
        manual: qs.filter((q) => q.rule.kind === 'manual').length,
        reflection: qs.filter((q) => q.rule.kind === 'reflection').length,
      });
      const lessonRow = (l) => ({
        id: l.id,
        title: l.title,
        textbookTitle: l.textbookTitle,
        page: l.page,
        version: l.version,
        status: l.status,
        goal: l.goal,
        prerequisite: l.prerequisite,
        referenceQuery: l.reference || null,
        steps: l.steps.length,
        tasks: taskCounts(l.questions),
        reviewTasks: taskCounts(l.reviewQuestions || []),
        knowledge: [...new Set(l.questions.map((q) => q.knowledge))],
        questionKinds: [...new Set(l.questions.map((q) => q.rule.kind))],
        visualKinds: [
          ...new Set(
            [...l.steps, ...l.questions].flatMap((entry) =>
              entry.visual ? [entry.visual.kind] : [],
            ),
          ),
        ],
        audit: l.review,
      });
      return {
        schemaVersion: 1,
        generatedAt: new Date().toISOString(),
        scope:
          '一年级原有人教语文/数学四册、苏教数学上下册及人教道法上下册；教材课目和原创课包分别列示。',
        limitation:
          '本清单导出代码中声明的身份、对应、目标、来源和开放状态，不替代正文逐页审校、教师验收、界面验收或地区学校选用证据。available只表示可进入本课包，不表示课目、单元、册次或全年完整。',
        fullPlanCompletion: 'not-verified',
        books: books.map((book) => {
          const model = models.find((m) => m?.id === book.id);
          if (!model) throw new Error(`Missing textbook model ${book.id}`);
          const available = book.units
            .flatMap((u) => u.lessons)
            .filter((l) => l.status === 'available');
          return {
            id: book.id,
            subject: book.subject,
            volume: book.volume,
            edition: book.edition,
            title: book.title,
            source: book.source,
            resourceId: model.resourceId,
            verifiedAt: book.verifiedAt,
            summary: {
              availablePacks: available.length,
              pendingEntries: book.units
                .flatMap((u) => u.lessons)
                .filter((l) => l.status === 'preparing' && !l.reference).length,
              referenceQueries: book.units
                .flatMap((u) => u.lessons)
                .filter((l) => l.reference).length,
              tasks: taskCounts(available.flatMap((l) => l.questions)),
            },
            units: model.units.map((unit) => {
              const actual = book.units.find((u) => u.id === unit.id);
              if (!actual)
                throw new Error(`Missing unit ${book.id}/${unit.id}`);
              return {
                id: unit.id,
                title: unit.title,
                items: unit.items.map((item) => {
                  let formalId = null;
                  if (book.subject === 'chinese')
                    formalId = `c${book.volume === 'upper' ? 'u' : 'l'}-${item.id}`;
                  if (book.subject === 'ethics') formalId = item.id;
                  const formal = formalId
                    ? actual.lessons.find((l) => l.id === formalId)
                    : null;
                  const charScope =
                    book.subject === 'chinese'
                      ? (book.volume === 'upper'
                          ? characters.upperCharacters
                          : characters.lowerCharacters)[item.id]
                      : null;
                  return {
                    id: item.id,
                    title: item.title,
                    page: item.page,
                    kind: item.kind,
                    formalLessonId: formal?.id || null,
                    formalLessonStatus: formal?.status || null,
                    referenceQuery: formal?.reference || null,
                    characters: charScope || null,
                    coverageCompletion: 'not-verified',
                  };
                }),
                lessons: actual.lessons.map((lesson) => lessonRow(lesson)),
              };
            }),
            transitions: (book.transitions || []).map((lesson) =>
              lessonRow(lesson),
            ),
          };
        }),
      };
    });
    await context.close();
  } finally {
    await browser.close();
  }
  const output = fileURLToPath(
    new URL('../../一年级教材覆盖清单.json', import.meta.url),
  );
  await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
  console.log(
    JSON.stringify(
      { output, books: report.books.map((b) => ({ id: b.id, ...b.summary })) },
      null,
      2,
    ),
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
