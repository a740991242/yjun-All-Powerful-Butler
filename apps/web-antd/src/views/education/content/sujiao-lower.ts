import type { Book, Lesson } from '../learning/types';
import type { Textbook } from './textbooks';

import { sujiaoAssemblyCandidatesDraft } from './sujiao-assembly-candidates';
import { sujiaoBeadBudgetDraft } from './sujiao-bead-budget';
import { sujiaoCalculationLinksDraft } from './sujiao-calculation-links';
import { sujiaoChildActivitiesDraft } from './sujiao-child-activities';
import { sujiaoCircularNumbersDraft } from './sujiao-circular-numbers';
import { sujiaoClassSurveysDraft } from './sujiao-class-surveys';
import { sujiaoClassificationDraft } from './sujiao-classification';
import { sujiaoClassificationApplicationsDraft } from './sujiao-classification-applications';
import { sujiaoClassificationAudit } from './sujiao-classification-audit';
import { sujiaoClassificationReviewDraft } from './sujiao-classification-review';
import { sujiaoClockCountingDraft } from './sujiao-clock-counting';
import { sujiaoComparisonApplicationsDraft } from './sujiao-comparison-applications';
import { sujiaoCompositeCountingDraft } from './sujiao-composite-counting';
import { sujiaoCountingLinesDraft } from './sujiao-counting-lines';
import { sujiaoCrossBalanceDraft } from './sujiao-cross-balance';
import { sujiaoCupClassificationDraft } from './sujiao-cup-classification';
import { sujiaoEqualSticksDraft } from './sujiao-equal-sticks';
import { sujiaoEqualizeTransfersDraft } from './sujiao-equalize-transfers';
import { sujiaoEstimationDraft } from './sujiao-estimation';
import { sujiaoFaceTracingDraft } from './sujiao-face-tracing';
import { sujiaoFiftyDraft } from './sujiao-fifty';
import { sujiaoFiftyAudit } from './sujiao-fifty-audit';
import { sujiaoFirstDrafts } from './sujiao-first-drafts';
import { sujiaoFoldCutJoinDraft } from './sujiao-fold-cut-join';
import { sujiaoGeoboardShiftDraft } from './sujiao-geoboard-shift';
import { sujiaoGuessAndDigitsDraft } from './sujiao-guess-and-digits';
import { sujiaoLowerFinalNumbersDraft } from './sujiao-lower-final-numbers';
import { sujiaoLowerFinalRelationsDraft } from './sujiao-lower-final-relations';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
import { sujiaoMathComicDraft } from './sujiao-math-comic';
import { sujiaoMixedCollagesDraft } from './sujiao-mixed-collages';
import { sujiaoMonthCalendarDraft } from './sujiao-month-calendar';
import { sujiaoMotionOrderDraft } from './sujiao-motion-order';
import { sujiaoMotionSequencesDraft } from './sujiao-motion-sequences';
import { sujiaoNatureClassificationDraft } from './sujiao-nature-classification';
import { sujiaoNumberConditionsDraft } from './sujiao-number-conditions';
import { sujiaoNumberFramesDraft } from './sujiao-number-frames';
import { sujiaoNumberUnitArithmeticDraft } from './sujiao-number-unit-arithmetic';
import { sujiaoNumberUnitAudit } from './sujiao-number-unit-audit';
import { sujiaoNumberUnitReviewDraft } from './sujiao-number-unit-review';
import { sujiaoObservationAudit } from './sujiao-observation-audit';
import { sujiaoObservationReviewDraft } from './sujiao-observation-review';
import { sujiaoOcclusionDraft } from './sujiao-occlusion';
import { sujiaoPaperFoldsDraft } from './sujiao-paper-folds';
import { sujiaoPlaneCuttingDraft } from './sujiao-plane-cutting';
import { sujiaoPlanePatternsDraft } from './sujiao-plane-patterns';
import { sujiaoPlaneRecognitionDraft } from './sujiao-plane-recognition';
import { sujiaoPoolClassificationDraft } from './sujiao-pool-classification';
import { sujiaoPracticalProblemsDraft } from './sujiao-practical-problems';
import { sujiaoQuantityApplicationsDraft } from './sujiao-quantity-applications';
import {
  sujiaoComparisonTargetDraft,
  sujiaoQuantityDifferenceDraft,
} from './sujiao-quantity-relations';
import {
  sujiaoBorrowSubtractDraft,
  sujiaoCarryAddDraft,
} from './sujiao-regrouping';
import { sujiaoRotatingPatchesDraft } from './sujiao-rotating-patches';
import { sujiaoSelectedNumberExtremaDraft } from './sujiao-selected-number-extrema';
import { sujiaoShapePatchesDraft } from './sujiao-shape-patches';
import { sujiaoSquareMosaicsDraft } from './sujiao-square-mosaics';
import { sujiaoSurveysDraft } from './sujiao-surveys';
import { sujiaoSymbolDigitsDraft } from './sujiao-symbol-digits';
import { sujiaoThreePieceJoinDraft } from './sujiao-three-piece-join';
import { sujiaoTriangleMosaicsDraft } from './sujiao-triangle-mosaics';
import { sujiaoTwelveSticksDraft } from './sujiao-twelve-sticks';
import {
  sujiaoTwoDigitOnesDraft,
  sujiaoTwoDigitTensDraft,
} from './sujiao-two-digit-arithmetic';
import { sujiaoTwoDigitCompositionDraft } from './sujiao-two-digit-composition';
import { sujiaoViewpointHouseDraft } from './sujiao-viewpoint-house';
import { sujiaoViewpointJugDraft } from './sujiao-viewpoint-jug';
import { sujiaoZeroChartDraft } from './sujiao-zero-chart';

// The ISBN identifies this inspected scan; 2024 approval is not an edition date.
const id = 'sujiao-math-p1-lower-9787574312951';
// New drafts do not become available merely by sharing the lower-volume prefix.
const releasedIds = new Set([
  'sj-lower-arithmetic-tables',
  'sj-lower-assembly-candidates',
  'sj-lower-bead-budget',
  'sj-lower-borrow-subtract',
  'sj-lower-calculation-applications',
  'sj-lower-calculation-links',
  'sj-lower-carry-add',
  'sj-lower-child-activities',
  'sj-lower-circular-numbers',
  'sj-lower-class-surveys',
  'sj-lower-classification',
  'sj-lower-classification-applications',
  'sj-lower-classification-review',
  'sj-lower-clock-counting',
  'sj-lower-comparison-applications',
  'sj-lower-comparison-target',
  'sj-lower-composite-counting',
  'sj-lower-conditions-pairs',
  'sj-lower-counting-lines',
  'sj-lower-cross-balance',
  'sj-lower-cup-classification',
  'sj-lower-eight-seven-add',
  'sj-lower-eight-seven-subtract',
  'sj-lower-equal-sticks',
  'sj-lower-equalize-transfers',
  'sj-lower-estimation',
  'sj-lower-face-tracing',
  'sj-lower-fifty',
  'sj-lower-final-numbers',
  'sj-lower-final-relations',
  'sj-lower-fold-cut-join',
  'sj-lower-geoboard-shift',
  'sj-lower-guess-and-digits',
  'sj-lower-magic-grid',
  'sj-lower-math-comic',
  'sj-lower-mixed-collages',
  'sj-lower-month-calendar',
  'sj-lower-motion-order',
  'sj-lower-motion-sequences',
  'sj-lower-nature-classification',
  'sj-lower-nine-add',
  'sj-lower-nine-subtract',
  'sj-lower-number-conditions',
  'sj-lower-number-frames',
  'sj-lower-number-towers',
  'sj-lower-number-unit-arithmetic',
  'sj-lower-number-unit-review',
  'sj-lower-observation-review',
  'sj-lower-occlusion',
  'sj-lower-paper-folds',
  'sj-lower-periodic-flags',
  'sj-lower-plane-cutting',
  'sj-lower-plane-patterns',
  'sj-lower-plane-recognition',
  'sj-lower-pool-classification',
  'sj-lower-practical-problems',
  'sj-lower-quantity-applications',
  'sj-lower-quantity-difference',
  'sj-lower-rotating-patches',
  'sj-lower-selected-number-extrema',
  'sj-lower-shape-patches',
  'sj-lower-small-add-inverse',
  'sj-lower-square-mosaics',
  'sj-lower-surveys',
  'sj-lower-symbol-digits',
  'sj-lower-three-piece-join',
  'sj-lower-triangle-mosaics',
  'sj-lower-twelve-sticks',
  'sj-lower-two-digit-composition',
  'sj-lower-two-digit-ones',
  'sj-lower-two-digit-tens',
  'sj-lower-unit-patterns',
  'sj-lower-viewpoint-house',
  'sj-lower-viewpoint-jug',
  'sj-lower-zero-chart',
]);
export const sujiaoLowerLessons: Lesson[] = [
  ...sujiaoFirstDrafts,
  sujiaoPlaneRecognitionDraft,
  sujiaoPlaneCuttingDraft,
  sujiaoCompositeCountingDraft,
  sujiaoPlanePatternsDraft,
  sujiaoShapePatchesDraft,
  sujiaoThreePieceJoinDraft,
  sujiaoEqualSticksDraft,
  sujiaoEqualizeTransfersDraft,
  sujiaoQuantityApplicationsDraft,
  sujiaoPaperFoldsDraft,
  sujiaoFaceTracingDraft,
  sujiaoRotatingPatchesDraft,
  sujiaoGeoboardShiftDraft,
  sujiaoAssemblyCandidatesDraft,
  sujiaoSquareMosaicsDraft,
  sujiaoTriangleMosaicsDraft,
  sujiaoMixedCollagesDraft,
  sujiaoMathComicDraft,
  sujiaoClassificationDraft,
  sujiaoNatureClassificationDraft,
  sujiaoCupClassificationDraft,
  sujiaoSurveysDraft,
  sujiaoClassSurveysDraft,
  sujiaoClassificationApplicationsDraft,
  sujiaoChildActivitiesDraft,
  sujiaoPoolClassificationDraft,
  sujiaoClassificationReviewDraft,
  sujiaoTwoDigitCompositionDraft,
  sujiaoCountingLinesDraft,
  sujiaoZeroChartDraft,
  sujiaoCircularNumbersDraft,
  sujiaoViewpointJugDraft,
  sujiaoViewpointHouseDraft,
  sujiaoMotionOrderDraft,
  sujiaoMotionSequencesDraft,
  sujiaoOcclusionDraft,
  sujiaoObservationReviewDraft,
  sujiaoNumberFramesDraft,
  sujiaoNumberConditionsDraft,
  sujiaoComparisonApplicationsDraft,
  sujiaoEstimationDraft,
  sujiaoFiftyDraft,
  sujiaoLowerFinalNumbersDraft,
  sujiaoLowerFinalRelationsDraft,
  sujiaoTwelveSticksDraft,
  sujiaoFoldCutJoinDraft,
  sujiaoBeadBudgetDraft,
  sujiaoMonthCalendarDraft,
  sujiaoNumberUnitReviewDraft,
  sujiaoClockCountingDraft,
  sujiaoGuessAndDigitsDraft,
  sujiaoNumberUnitArithmeticDraft,
  sujiaoSelectedNumberExtremaDraft,
  sujiaoCrossBalanceDraft,
  sujiaoSymbolDigitsDraft,
  sujiaoCalculationLinksDraft,
  sujiaoPracticalProblemsDraft,
  sujiaoQuantityDifferenceDraft,
  sujiaoComparisonTargetDraft,
  sujiaoCarryAddDraft,
  sujiaoBorrowSubtractDraft,
  sujiaoTwoDigitTensDraft,
  sujiaoTwoDigitOnesDraft,
]
  .filter((lesson) => releasedIds.has(lesson.id))
  .toSorted((a, b) => a.page - b.page)
  .map((draft) => ({
    ...structuredClone(draft),
    status: 'available',
    review: {
      date: source.checkedAt,
      reviewer: '已读原书范围、原创活动与学习流程核验',
      notes: `已实际核对公开扫描ISBN ${source.isbn}与印刷第1～94页及附页。本站${draft.title}对应纸面第${draft.page}页起的已核验活动范围，教学、题目与图示为原创；本课并非该页全部原题或完整单元。封面2024审核年份不代替版权版次；版次与印次仍未核验。仅开放已完成的本课内容，后续课目继续制作，不证明苏州各校选用；不打包原扫描图文。`,
    },
  }));
// Only remove a unit placeholder after its page-to-task coverage audit.
const implementedOriginalTeachingUnits = new Set<string>([
  sujiaoClassificationAudit.unit,
  sujiaoFiftyAudit.unit,
  sujiaoNumberUnitAudit.unit,
  sujiaoObservationAudit.unit,
]);
function pending(item: (typeof source.contents)[number]): Lesson {
  return {
    id: `sj-lower-pending-${item.id}`,
    title: item.id === 'u1' ? '第一单元 · 其余内容制作中' : item.title,
    textbookTitle: item.title,
    page: item.page,
    status: 'preparing',
    version: 1,
    goal: '原书目录已核验，尚未完成的原创教学与活动继续制作。',
    prerequisite: '',
    parentTip: '',
    steps: [],
    questions: [],
    review: {
      date: source.checkedAt,
      reviewer: '目录范围核验',
      notes: '只登记真实目录，不开放未完成内容。版权版次与印次仍未核验。',
    },
  };
}
export const sujiaoLowerTextbook: Textbook = {
  id,
  subject: 'math',
  volume: 'lower',
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
export const sujiaoLowerBook: Book = {
  id,
  subject: 'math',
  volume: 'lower',
  edition: 'sujiao',
  title: '苏教版一年级数学下册 · 原创教学',
  source: source.preview,
  verifiedAt: source.checkedAt,
  units: source.contents.map((item, index) => ({
    ...item,
    lessons: [
      ...sujiaoLowerLessons.filter(
        (lesson) =>
          lesson.page >= item.page &&
          lesson.page < (source.contents[index + 1]?.page ?? Infinity),
      ),
      ...(implementedOriginalTeachingUnits.has(item.id) ? [] : [pending(item)]),
    ],
  })),
};
