import type { Book, Lesson } from '../learning/types';
import type { Textbook } from './textbooks';

import { required } from '../learning/required';
import { sujiaoComparisonDraft } from './sujiao-comparison';
import { sujiaoDirectionComparisonLesson } from './sujiao-direction-comparison';
import { sujiaoFillArithmeticLesson } from './sujiao-fill-arithmetic';
import { sujiaoFinalArithmeticLesson } from './sujiao-final-arithmetic';
import { sujiaoFinalBuildingLesson } from './sujiao-final-building';
import { sujiaoFinalExplorationLesson } from './sujiao-final-exploration';
import { sujiaoFinalNumbersLesson } from './sujiao-final-numbers';
import { sujiaoFinalShapesLesson } from './sujiao-final-shapes';
import {
  sujiaoFirstAdditionDraft,
  sujiaoFirstSubtractionDraft,
} from './sujiao-first-arithmetic';
import { sujiaoCountingDraft } from './sujiao-first-drafts';
import { sujiaoFirstUnitReviewDraft } from './sujiao-first-unit-review';
import { sujiaoIntroGamesDraft } from './sujiao-intro-games';
import { sujiaoIntroShapesLesson } from './sujiao-intro-shapes';
import { sujiaoLowerBook } from './sujiao-lower';
import { sujiaoMissingAddendDraft } from './sujiao-missing-addend';
import { sujiaoSpecialties, sujiaoTransitions } from './sujiao-modes';
import { sujiaoNineConsolidationLesson } from './sujiao-nine-consolidation';
import { sujiaoPositionDraft } from './sujiao-position';
import { sujiaoRecognitionReviewLesson } from './sujiao-recognition-review';
import { sujiaoSequentialDraft } from './sujiao-sequential';
import {
  sujiaoSixNineArithmeticDraft,
  sujiaoSixNineRecognitionDraft,
} from './sujiao-six-nine';
import { sujiaoSixNineReviewDraft } from './sujiao-six-nine-review';
import {
  sujiaoSolidBuildDraft,
  sujiaoSolidRecognitionDraft,
} from './sujiao-solids';
import { sujiaoSumLinesLesson } from './sujiao-sum-lines';
import { sujiaoTakeTenLesson } from './sujiao-take-ten';
import { sujiaoTeenArithmeticDraft } from './sujiao-teen-arithmetic';
import { sujiaoTeensRecognitionDraft } from './sujiao-teens';
import { sujiaoTeensReviewDraft } from './sujiao-teens-review';
import { sujiaoTenRecognitionDraft } from './sujiao-ten';
import {
  sujiaoTenArithmeticDraft,
  sujiaoTenCompositionDraft,
} from './sujiao-ten-arithmetic';
import { sujiaoTenReviewLesson } from './sujiao-ten-review';
import { sujiaoTilingLesson } from './sujiao-tiling';
import { sujiaoEverydayTimeLesson } from './sujiao-time';
import { sujiaoUpperCardReviewLesson } from './sujiao-upper-card-review';
import { sujiaoUpperColourCountLesson } from './sujiao-upper-colour-count';
import { sujiaoUpperContinuousLesson } from './sujiao-upper-continuous';
import {
  sujiaoFourFiveDraft,
  sujiaoOrdinalDraft,
} from './sujiao-upper-count-order';
import { sujiaoUpperCubePairLesson } from './sujiao-upper-cube-pair';
import { sujiaoUpperExplorationReviewLesson } from './sujiao-upper-exploration-review';
import { sujiaoUpperFinalCalculationLesson } from './sujiao-upper-final-calculation';
import { sujiaoUpperFinalEvaluationLesson } from './sujiao-upper-final-evaluation';
import { sujiaoUpperFinalMovesLesson } from './sujiao-upper-final-moves';
import { sujiaoUpperFinalOrganizeLesson } from './sujiao-upper-final-organize';
import { sujiaoUpperFinalPairsLesson } from './sujiao-upper-final-pairs';
import { sujiaoUpperFinalReadingLesson } from './sujiao-upper-final-reading';
import { sujiaoUpperFinalStoriesLesson } from './sujiao-upper-final-stories';
import { sujiaoUpperFullCardsLesson } from './sujiao-upper-full-cards';
import { sujiaoUpperMonthRecordLesson } from './sujiao-upper-month-record';
import { sujiaoUpperNumberCultureLesson } from './sujiao-upper-number-culture';
import { sujiaoUpperNumberlineLesson } from './sujiao-upper-numberline';
import { sujiaoUpperOpenComparisonLesson } from './sujiao-upper-open-comparison';
import { sujiaoUpperPartTablesLesson } from './sujiao-upper-part-tables';
import { sujiaoUpperSolidInstructionsLesson } from './sujiao-upper-solid-instructions';
import { sujiaoUpperSolidPatternsLesson } from './sujiao-upper-solid-patterns';
import { sujiaoUpperSolidRecomposeLesson } from './sujiao-upper-solid-recompose';
import { sujiaoUpperSolidReviewLesson } from './sujiao-upper-solid-review';
import { sujiaoUpperSource as source } from './sujiao-upper-source';
import { sujiaoUpperTeensCounterLesson } from './sujiao-upper-teens-counter';
import { sujiaoUpperTeensEvaluationLesson } from './sujiao-upper-teens-evaluation';
import { sujiaoUpperTeensLayoutsLesson } from './sujiao-upper-teens-layouts';
import { sujiaoUpperTeensNumberlineLesson } from './sujiao-upper-teens-numberline';
import { sujiaoUpperTeensTablesLesson } from './sujiao-upper-teens-tables';
import { sujiaoUpperTenCounterLesson } from './sujiao-upper-ten-counter';
import { sujiaoUpperTenEvaluationLesson } from './sujiao-upper-ten-evaluation';
import { sujiaoUpperTenOpenActivitiesLesson } from './sujiao-upper-ten-open-activities';
import { sujiaoUpperTenOrderLesson } from './sujiao-upper-ten-order';
import { sujiaoUpperTenTablesLesson } from './sujiao-upper-ten-tables';
import {
  sujiaoZeroArithmeticDraft,
  sujiaoZeroRecognitionDraft,
} from './sujiao-zero';

const id = 'sujiao-math-p1-upper-2024';

export const sujiaoIntroGamesLesson: Lesson = {
  ...sujiaoIntroGamesDraft,
  status: 'available',
  review: {
    ...sujiaoIntroGamesDraft.review,
    notes: `${sujiaoIntroGamesDraft.review.notes.replace('保持筹备，未登记成完整教材或替换人教版。', '')} 当前开放已核验范围的本课；拼搭、拼图、围区域与路径由独立课包承接，其它单元按各自课包范围学习。本课完成不代表全册掌握，不替换人教版。`,
  },
};

function reviewedUpperLesson(draft: Lesson, pages: string): Lesson {
  return {
    ...draft,
    status: 'available',
    review: {
      date: source.checkedAt,
      reviewer: '同版原书正文核验与原创教学检查',
      notes: `已实际核对ISBN ${source.isbn}、2024年7月第1版、2025年7月第2次印刷的上册第${pages}页（${source.preview}）。讲解、图示与题目为原创，实物操作和写数须人工查看。仅开放本课范围，不代表其它活动或全册完成；保留人教版独立课包与记录。`,
    },
  };
}

export const sujiaoCountingLesson = reviewedUpperLesson(
  sujiaoCountingDraft,
  '12～13',
);
export const sujiaoFourFiveLesson = reviewedUpperLesson(
  sujiaoFourFiveDraft,
  '14～15',
);
export const sujiaoOrdinalLesson = reviewedUpperLesson(
  sujiaoOrdinalDraft,
  '16～17',
);

export const sujiaoZeroRecognitionLesson = reviewedUpperLesson(
  sujiaoZeroRecognitionDraft,
  '18～19',
);
export const sujiaoComparisonLesson = reviewedUpperLesson(
  sujiaoComparisonDraft,
  '20～23',
);

export const sujiaoFirstAdditionLesson = reviewedUpperLesson(
  sujiaoFirstAdditionDraft,
  '25～26',
);
export const sujiaoFirstSubtractionLesson = reviewedUpperLesson(
  sujiaoFirstSubtractionDraft,
  '27～28',
);
export const sujiaoZeroArithmeticLesson = reviewedUpperLesson(
  sujiaoZeroArithmeticDraft,
  '29～30',
);
export const sujiaoFirstUnitReviewLesson = reviewedUpperLesson(
  sujiaoFirstUnitReviewDraft,
  '22、24、30～31',
);

export const sujiaoPositionLesson = reviewedUpperLesson(
  sujiaoPositionDraft,
  '32～34',
);

export const sujiaoSixNineRecognitionLesson = reviewedUpperLesson(
  sujiaoSixNineRecognitionDraft,
  '36～39',
);
export const sujiaoSixNineArithmeticLesson = reviewedUpperLesson(
  sujiaoSixNineArithmeticDraft,
  '40～45',
);
export const sujiaoSequentialLesson = reviewedUpperLesson(
  sujiaoSequentialDraft,
  '46～48',
);
export const sujiaoSixNineReviewLesson = reviewedUpperLesson(
  sujiaoSixNineReviewDraft,
  '39、45、51～52',
);

export const sujiaoSolidRecognitionLesson = reviewedUpperLesson(
  sujiaoSolidRecognitionDraft,
  '54～56、59',
);
export const sujiaoSolidBuildLesson = reviewedUpperLesson(
  sujiaoSolidBuildDraft,
  '57～58、60～61',
);

export const sujiaoTenRecognitionLesson = reviewedUpperLesson(
  sujiaoTenRecognitionDraft,
  '63～65',
);
export const sujiaoTenCompositionLesson = reviewedUpperLesson(
  sujiaoTenCompositionDraft,
  '65～67',
);
export const sujiaoTenArithmeticLesson = reviewedUpperLesson(
  sujiaoTenArithmeticDraft,
  '66～69',
);
export const sujiaoMissingAddendLesson = reviewedUpperLesson(
  sujiaoMissingAddendDraft,
  '70～71',
);

export const sujiaoTeensRecognitionLesson = reviewedUpperLesson(
  sujiaoTeensRecognitionDraft,
  '79～81',
);
export const sujiaoTeenArithmeticLesson = reviewedUpperLesson(
  sujiaoTeenArithmeticDraft,
  '82～83',
);
export const sujiaoTeensReviewLesson = reviewedUpperLesson(
  sujiaoTeensReviewDraft,
  '83～87',
);

function pending(item: (typeof source.contents)[number]): Lesson {
  return {
    id: `sj-upper-pending-${item.id}`,
    textbookTitle: item.title,
    title: item.title,
    page: item.page,
    status: 'preparing',
    version: 1,
    goal: '原书目录已核验，完整原创教学与活动仍在制作。',
    prerequisite: '',
    parentTip: '',
    steps: [],
    questions: [],
    review: {
      date: source.checkedAt,
      reviewer: '原书目录核验',
      notes: '仅登记目录与纸面起始页，不开放尚未完成的课包。',
    },
  };
}

export const sujiaoUpperTextbook: Textbook = {
  id,
  subject: 'math',
  volume: 'upper',
  edition: 'sujiao',
  resourceId: source.isbn,
  source: source.preview,
  verifiedAt: source.checkedAt,
  units: source.contents.map((item) => ({
    id: item.id,
    title: item.title,
    items: [{ ...item, kind: item.id.startsWith('u') ? 'lesson' : 'activity' }],
  })),
};

const baseBooks: Book[] = [
  {
    id,
    subject: 'math',
    volume: 'upper',
    edition: 'sujiao',
    title: '苏教版一年级数学上册 · 原创教学',
    source: source.preview,
    verifiedAt: source.checkedAt,
    units: source.contents.map((item) => ({
      ...item,
      lessons: (() => {
        if (item.id === 'games')
          return [sujiaoIntroGamesLesson, sujiaoIntroShapesLesson];
        return (() => {
          if (item.id === 'u1')
            return [
              sujiaoCountingLesson,
              sujiaoFourFiveLesson,
              sujiaoOrdinalLesson,
              sujiaoZeroRecognitionLesson,
              sujiaoComparisonLesson,
              sujiaoRecognitionReviewLesson,
              sujiaoUpperColourCountLesson,
              sujiaoDirectionComparisonLesson,
              sujiaoFirstAdditionLesson,
              sujiaoFirstSubtractionLesson,
              sujiaoZeroArithmeticLesson,
              sujiaoFillArithmeticLesson,
              sujiaoFirstUnitReviewLesson,
              sujiaoUpperCardReviewLesson,
            ];
          return (() => {
            if (item.id === 'position') return [sujiaoPositionLesson];
            return (() => {
              if (item.id === 'u2')
                return [
                  sujiaoSixNineRecognitionLesson,
                  sujiaoUpperPartTablesLesson,
                  sujiaoSixNineArithmeticLesson,
                  sujiaoUpperNumberlineLesson,
                  sujiaoSequentialLesson,
                  sujiaoUpperContinuousLesson,
                  sujiaoNineConsolidationLesson,
                  sujiaoUpperFullCardsLesson,
                  sujiaoUpperOpenComparisonLesson,
                  sujiaoSixNineReviewLesson,
                  sujiaoUpperExplorationReviewLesson,
                ];
              return (() => {
                if (item.id === 'u3')
                  return [
                    sujiaoSolidRecognitionLesson,
                    sujiaoSolidBuildLesson,
                    sujiaoUpperSolidInstructionsLesson,
                    sujiaoUpperSolidReviewLesson,
                    sujiaoUpperCubePairLesson,
                    sujiaoUpperSolidPatternsLesson,
                    sujiaoUpperSolidRecomposeLesson,
                  ];
                return (() => {
                  if (item.id === 'u4')
                    return [
                      sujiaoTenRecognitionLesson,
                      sujiaoUpperTenCounterLesson,
                      sujiaoUpperTenTablesLesson,
                      sujiaoUpperTenOrderLesson,
                      sujiaoUpperNumberCultureLesson,
                      sujiaoUpperTenEvaluationLesson,
                      sujiaoUpperTenOpenActivitiesLesson,
                      sujiaoTenCompositionLesson,
                      sujiaoTenArithmeticLesson,
                      sujiaoMissingAddendLesson,
                      sujiaoTenReviewLesson,
                      sujiaoTilingLesson,
                      sujiaoSumLinesLesson,
                    ];
                  return (() => {
                    if (item.id === 'take-ten') return [sujiaoTakeTenLesson];
                    return (() => {
                      if (item.id === 'u5')
                        return [
                          sujiaoTeensRecognitionLesson,
                          sujiaoUpperTeensCounterLesson,
                          sujiaoUpperTeensNumberlineLesson,
                          sujiaoUpperTeensLayoutsLesson,
                          sujiaoUpperTeensTablesLesson,
                          sujiaoUpperMonthRecordLesson,
                          sujiaoUpperTeensEvaluationLesson,
                          sujiaoTeenArithmeticLesson,
                          sujiaoTeensReviewLesson,
                          sujiaoEverydayTimeLesson,
                        ];
                      return item.id === 'review'
                        ? [
                            sujiaoUpperFinalCalculationLesson,
                            sujiaoUpperFinalEvaluationLesson,
                            sujiaoUpperFinalPairsLesson,
                            sujiaoUpperFinalOrganizeLesson,
                            sujiaoUpperFinalReadingLesson,
                            sujiaoUpperFinalStoriesLesson,
                            sujiaoUpperFinalMovesLesson,
                            sujiaoFinalNumbersLesson,
                            sujiaoFinalArithmeticLesson,
                            sujiaoFinalShapesLesson,
                            sujiaoFinalExplorationLesson,
                            sujiaoFinalBuildingLesson,
                          ]
                        : [pending(item)];
                    })();
                  })();
                })();
              })();
            })();
          })();
        })();
      })(),
    })),
  },
  sujiaoLowerBook,
];

// Keep the canonical book objects: existing consumers share the lower-book registry.
for (const book of baseBooks) {
  book.specialties = sujiaoSpecialties(book);
  if (book.volume === 'lower')
    book.transitions = sujiaoTransitions(
      required(baseBooks[0]),
      required(baseBooks[1]),
    );
}
export const sujiaoBooks: Book[] = baseBooks;
