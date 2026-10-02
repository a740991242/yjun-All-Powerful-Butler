import type { Book, Lesson } from '../learning/types';
import type { Textbook } from './textbooks';

import { sujiaoComparisonDraft } from './sujiao-comparison';
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
import {
  sujiaoFourFiveDraft,
  sujiaoOrdinalDraft,
} from './sujiao-upper-count-order';
import { sujiaoUpperSource as source } from './sujiao-upper-source';
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
    notes: `${sujiaoIntroGamesDraft.review.notes.replace('保持筹备，未登记成完整教材或替换人教版。', '')} 当前仅开放已核验范围的本课；其它活动与单元仍在制作，不代表全册完成，不替换人教版。`,
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

export const sujiaoBooks: Book[] = [
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
              sujiaoFirstAdditionLesson,
              sujiaoFirstSubtractionLesson,
              sujiaoZeroArithmeticLesson,
              sujiaoFillArithmeticLesson,
              sujiaoFirstUnitReviewLesson,
              pending(item),
            ];
          return (() => {
            if (item.id === 'position') return [sujiaoPositionLesson];
            return (() => {
              if (item.id === 'u2')
                return [
                  sujiaoSixNineRecognitionLesson,
                  sujiaoSixNineArithmeticLesson,
                  sujiaoSequentialLesson,
                  sujiaoNineConsolidationLesson,
                  sujiaoSixNineReviewLesson,
                  pending(item),
                ];
              return (() => {
                if (item.id === 'u3')
                  return [
                    sujiaoSolidRecognitionLesson,
                    sujiaoSolidBuildLesson,
                    pending(item),
                  ];
                return (() => {
                  if (item.id === 'u4')
                    return [
                      sujiaoTenRecognitionLesson,
                      sujiaoTenCompositionLesson,
                      sujiaoTenArithmeticLesson,
                      sujiaoMissingAddendLesson,
                      sujiaoTenReviewLesson,
                      sujiaoTilingLesson,
                      sujiaoSumLinesLesson,
                      pending(item),
                    ];
                  return (() => {
                    if (item.id === 'take-ten') return [sujiaoTakeTenLesson];
                    return (() => {
                      if (item.id === 'u5')
                        return [
                          sujiaoTeensRecognitionLesson,
                          sujiaoTeenArithmeticLesson,
                          sujiaoTeensReviewLesson,
                          sujiaoEverydayTimeLesson,
                          pending(item),
                        ];
                      return item.id === 'review'
                        ? [
                            sujiaoFinalNumbersLesson,
                            sujiaoFinalArithmeticLesson,
                            sujiaoFinalShapesLesson,
                            sujiaoFinalExplorationLesson,
                            sujiaoFinalBuildingLesson,
                            pending(item),
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
