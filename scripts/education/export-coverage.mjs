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
    await page.goto(base.origin, { waitUntil: 'networkidle' });
    report = await page.evaluate(async () => {
      const [
        cn,
        math,
        sj,
        textbooks,
        characters,
        ethics,
        ethicsMessages,
        bnu,
        bnuLower,
        bnuAudit,
        bnuLowerAudit,
        bnuLowerTwoAudit,
        bnuClassroomAudit,
        bnuPencilsAudit,
        bnuHideAudit,
        bnuComplementAudit,
        bnuMeetingAudit,
        bnuParachuteAudit,
        bnuCountrysideAudit,
        bnuSubtractionTableAudit,
        bnuSubtractionHarvestAudit,
        bnuSubtractionPracticeAudit,
        bnuAroundNumbersAudit,
        bnuCountHundredAudit,
        bnuCountBeansAudit,
        bnuRedFruitAudit,
        bnuBreedingAudit,
        bnuComparisonPracticeAudit,
        bnuHundredChartAudit,
        bnuHarvestAudit,
        bnuNumberPracticeAudit,
        bnuFillGameAudit,
        bnuRabbitGuestsAudit,
        bnuPineconesAudit,
        bnuFrogsAudit,
        bnuWrittenAudit,
        bnuInterestingAudit,
      ] = await Promise.all([
        import('/src/views/education/content/chinese.ts'),
        import('/src/views/education/content/math.ts'),
        import('/src/views/education/content/sujiao.ts'),
        import('/src/views/education/content/textbooks.ts'),
        import('/src/views/education/content/characters.ts'),
        import('/src/views/education/content/ethics.ts'),
        import('/src/locales/langs/zh-CN/educationEthics.json'),
        import('/src/views/education/content/bnu.ts'),
        import('/src/views/education/content/bnu-lower.ts'),
        import('/src/views/education/content/bnu-final-audit.ts'),
        import('/src/views/education/content/bnu-lower-unit-one-audit.ts'),
        import('/src/views/education/content/bnu-lower-unit-two-audit.ts'),
        import('/src/views/education/content/bnu-lower-classroom-audit.ts'),
        import('/src/views/education/content/bnu-lower-pencils-audit.ts'),
        import('/src/views/education/content/bnu-lower-hide-audit.ts'),
        import('/src/views/education/content/bnu-lower-complement-audit.ts'),
        import('/src/views/education/content/bnu-lower-meeting-audit.ts'),
        import('/src/views/education/content/bnu-lower-parachute-audit.ts'),
        import('/src/views/education/content/bnu-lower-countryside-audit.ts'),
        import('/src/views/education/content/bnu-lower-subtraction-table-audit.ts'),
        import('/src/views/education/content/bnu-lower-subtraction-harvest-audit.ts'),
        import('/src/views/education/content/bnu-lower-subtraction-practice-audit.ts'),
        import('/src/views/education/content/bnu-lower-around-numbers-audit.ts'),
        import('/src/views/education/content/bnu-lower-count-hundred-audit.ts'),
        import('/src/views/education/content/bnu-lower-count-beans-audit.ts'),
        import('/src/views/education/content/bnu-lower-red-fruit-audit.ts'),
        import('/src/views/education/content/bnu-lower-breeding-audit.ts'),
        import('/src/views/education/content/bnu-lower-comparison-practice-audit.ts'),
        import('/src/views/education/content/bnu-lower-hundred-chart-audit.ts'),
        import('/src/views/education/content/bnu-lower-harvest-audit.ts'),
        import('/src/views/education/content/bnu-lower-number-practice-audit.ts'),
        import('/src/views/education/content/bnu-lower-fill-game-audit.ts'),
        import('/src/views/education/content/bnu-lower-rabbit-guests-audit.ts'),
        import('/src/views/education/content/bnu-lower-pinecones-audit.ts'),
        import('/src/views/education/content/bnu-lower-frogs-audit.ts'),
        import('/src/views/education/content/bnu-lower-written-audit.ts'),
        import('/src/views/education/content/bnu-lower-interesting-audit.ts'),
      ]);
      const models = [
        ...textbooks.textbooks,
        textbooks.findTextbook('math', 'sujiao', 'upper'),
        textbooks.findTextbook('math', 'sujiao', 'lower'),
        ...ethics.ethicsTextbooks,
        bnu.bnuUpperTextbook,
        bnuLower.bnuLowerTextbook,
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
        bnu.bnuUpperBook,
        bnuLower.bnuLowerBook,
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
          '一年级原有人教语文/数学四册、苏教数学上下册、人教道法上下册及北师大数学上下册已开放范围；教材课目和原创课包分别列示。',
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
                ...(book.id === bnu.bnuUpperBook.id && unit.id === 'final'
                  ? { sourceAudit: bnuAudit.bnuFinalAudit }
                  : {}),
                ...(book.id === bnuLower.bnuLowerBook.id && unit.id === 'u3'
                  ? {
                      sourceAudit: {
                        ...bnuPencilsAudit.bnuLowerPencilsAudit,
                        scope:
                          '印刷27～43页买铅笔、捉迷藏、凑数游戏、开会啦、跳伞表演、美丽的田园、做个减法表、我的收获与完整巩固应用所列活动及明示迁移；原角色分组未知保留核对记录，第三单元原活动对应已实现，不代表全册、全年或最终教师审校完成。',
                        activities: [
                          ...bnuPencilsAudit.bnuLowerPencilsAudit.activities,
                          ...bnuHideAudit.bnuLowerHideAudit.activities,
                          ...bnuComplementAudit.bnuLowerComplementAudit
                            .activities,
                          ...bnuMeetingAudit.bnuLowerMeetingAudit.activities,
                          ...bnuParachuteAudit.bnuLowerParachuteAudit
                            .activities,
                          ...bnuCountrysideAudit.bnuLowerCountrysideAudit
                            .activities,
                          ...bnuSubtractionTableAudit
                            .bnuLowerSubtractionTableAudit.activities,
                          ...bnuSubtractionHarvestAudit
                            .bnuLowerSubtractionHarvestAudit.activities,
                          ...bnuSubtractionPracticeAudit
                            .bnuLowerSubtractionPracticeAudit.activities,
                        ],
                      },
                    }
                  : {}),
                ...(book.id === bnuLower.bnuLowerBook.id && unit.id === 'u4'
                  ? {
                      sourceAudit: {
                        ...bnuAroundNumbersAudit.bnuLowerAroundNumbersAudit,
                        scope:
                          '第44～59页身边的数、数一数、数豆子、红果比较、小小养殖场、比较排序、完整百数表、我的收获与巩固应用五十五项原活动逐项对应；最终教师审校未核验，不证明全册或全年完成。',
                        activities: [
                          ...bnuAroundNumbersAudit.bnuLowerAroundNumbersAudit
                            .activities,
                          ...bnuCountHundredAudit.bnuLowerCountHundredAudit
                            .activities,
                          ...bnuCountBeansAudit.bnuLowerCountBeansAudit
                            .activities,
                          ...bnuRedFruitAudit.bnuLowerRedFruitAudit.activities,
                          ...bnuBreedingAudit.bnuLowerBreedingAudit.activities,
                          ...bnuComparisonPracticeAudit
                            .bnuLowerComparisonPracticeAudit.activities,
                          ...bnuHundredChartAudit.bnuLowerHundredChartAudit
                            .activities,
                          ...bnuHarvestAudit.bnuLowerHarvestAudit.activities,
                          ...bnuNumberPracticeAudit.bnuLowerNumberPracticeAudit
                            .activities,
                        ],
                      },
                    }
                  : {}),
                ...(book.id === bnuLower.bnuLowerBook.id && unit.id === 'u5'
                  ? {
                      sourceAudit: {
                        ...bnuRabbitGuestsAudit.bnuLowerRabbitGuestsAudit,
                        scope:
                          '印刷62～71全部原活动对应；72页起后续、整册与全年仍未完成。',
                        activities: [
                          ...bnuRabbitGuestsAudit.bnuLowerRabbitGuestsAudit
                            .activities,
                          ...bnuPineconesAudit.bnuLowerPineconesAudit
                            .activities,
                          ...bnuFrogsAudit.bnuLowerFrogsAudit.activities,
                          ...bnuWrittenAudit.bnuLowerWrittenAudit.activities,
                          ...bnuInterestingAudit.bnuLowerInterestingAudit
                            .activities,
                        ],
                      },
                    }
                  : {}),
                ...(book.id === bnuLower.bnuLowerBook.id && unit.id === 'games'
                  ? { sourceAudit: bnuFillGameAudit.bnuLowerFillGameAudit }
                  : {}),
                ...(book.id === bnuLower.bnuLowerBook.id && unit.id === 'u1'
                  ? { sourceAudit: bnuLowerAudit.bnuLowerUnitOneAudit }
                  : {}),
                ...(book.id === bnuLower.bnuLowerBook.id && unit.id === 'u2'
                  ? { sourceAudit: bnuLowerTwoAudit.bnuLowerUnitTwoAudit }
                  : {}),
                ...(book.id === bnuLower.bnuLowerBook.id &&
                unit.id === 'classroom'
                  ? { sourceAudit: bnuClassroomAudit.bnuLowerClassroomAudit }
                  : {}),
              };
            }),
            specialties: (book.specialties || []).map((lesson) =>
              lessonRow(lesson),
            ),
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
