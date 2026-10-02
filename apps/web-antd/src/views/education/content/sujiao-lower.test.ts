import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createStudyLibrary } from '../learning/library';
import { mathBooks } from './math';
import { sujiaoBooks } from './sujiao';
import { sujiaoAssemblyCandidatesDraft } from './sujiao-assembly-candidates';
import { sujiaoBeadBudgetDraft } from './sujiao-bead-budget';
import { sujiaoCalculationLinksDraft } from './sujiao-calculation-links';
import { sujiaoCalculationReviewDraft } from './sujiao-calculation-review';
import { sujiaoChildActivitiesDraft } from './sujiao-child-activities';
import { sujiaoCircularNumbersDraft } from './sujiao-circular-numbers';
import { sujiaoClassSurveysDraft } from './sujiao-class-surveys';
import { sujiaoClassificationDraft } from './sujiao-classification';
import { sujiaoClassificationApplicationsDraft } from './sujiao-classification-applications';
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
import { sujiaoFinalClassificationReviewDraft } from './sujiao-final-classification-review';
import { sujiaoFinalCountingDraft } from './sujiao-final-counting';
import { sujiaoFinalDataQuestionsDraft } from './sujiao-final-data-questions';
import { sujiaoFinalEmbeddedDraft } from './sujiao-final-embedded';
import { sujiaoFinalEquationsDraft } from './sujiao-final-equations';
import { sujiaoFinalFourShapesDraft } from './sujiao-final-four-shapes';
import { sujiaoFinalNumbersShapesDraft } from './sujiao-final-numbers-shapes';
import { sujiaoFinalParadeDraft } from './sujiao-final-parade';
import { sujiaoFirstDrafts } from './sujiao-first-drafts';
import { sujiaoFoldCutJoinDraft } from './sujiao-fold-cut-join';
import { sujiaoGeoboardShiftDraft } from './sujiao-geoboard-shift';
import { sujiaoGuessAndDigitsDraft } from './sujiao-guess-and-digits';
import {
  sujiaoLowerBook as book,
  sujiaoLowerLessons,
  sujiaoLowerTextbook,
} from './sujiao-lower';
import { sujiaoLowerFinalNumbersDraft } from './sujiao-lower-final-numbers';
import { sujiaoLowerFinalRelationsDraft } from './sujiao-lower-final-relations';
import { sujiaoLowerFirstPracticeDraft } from './sujiao-lower-first-practice';
import { sujiaoLowerFirstReviewDraft } from './sujiao-lower-first-review';
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
import { sujiaoNumberUnitReviewDraft } from './sujiao-number-unit-review';
import { sujiaoObservationReviewDraft } from './sujiao-observation-review';
import { sujiaoOcclusionDraft } from './sujiao-occlusion';
import { sujiaoPaperFoldsDraft } from './sujiao-paper-folds';
import { sujiaoPlaneCuttingDraft } from './sujiao-plane-cutting';
import { sujiaoPlanePatternsDraft } from './sujiao-plane-patterns';
import { sujiaoPlaneRecognitionDraft } from './sujiao-plane-recognition';
import { sujiaoPlaneReviewDraft } from './sujiao-plane-review';
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
import { findTextbook } from './textbooks';

it('registers the inspected ISBN separately from PEP and upper volumes without inventing edition dates', () => {
  expect(sujiaoBooks).toContain(book);
  expect(book.id).toBe('sujiao-math-p1-lower-9787574312951');
  expect(book.subject).toBe('math');
  expect(book.volume).toBe('lower');
  expect(book.edition).toBe('sujiao');
  expect(findTextbook('math', 'sujiao', 'lower')).toBe(sujiaoLowerTextbook);
  expect(sujiaoLowerTextbook.resourceId).toBe('978-7-5743-1295-1');
  expect(source.edition).toBeNull();
  expect(source.printing).toBeNull();
  expect(book.units.map((u) => [u.id, u.page])).toEqual(
    source.contents.map((u) => [u.id, u.page]),
  );
  expect(new Set([...sujiaoBooks, ...mathBooks].map((b) => b.id)).size).toBe(4);
});
it('releases independent copies of released tested packs and leaves unfinished content without runnable tasks', () => {
  const drafts = [
    ...sujiaoFirstDrafts,
    sujiaoLowerFirstPracticeDraft,
    sujiaoLowerFirstReviewDraft,
    sujiaoPlaneRecognitionDraft,
    sujiaoPlaneReviewDraft,
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
    sujiaoObservationReviewDraft,
    sujiaoViewpointJugDraft,
    sujiaoViewpointHouseDraft,
    sujiaoMotionOrderDraft,
    sujiaoMotionSequencesDraft,
    sujiaoOcclusionDraft,
    sujiaoNumberFramesDraft,
    sujiaoNumberConditionsDraft,
    sujiaoComparisonApplicationsDraft,
    sujiaoEstimationDraft,
    sujiaoFiftyDraft,
    sujiaoLowerFinalNumbersDraft,
    sujiaoFinalClassificationReviewDraft,
    sujiaoFinalDataQuestionsDraft,
    sujiaoFinalEquationsDraft,
    sujiaoFinalCountingDraft,
    sujiaoFinalNumbersShapesDraft,
    sujiaoFinalFourShapesDraft,
    sujiaoFinalParadeDraft,
    sujiaoFinalEmbeddedDraft,
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
    sujiaoCalculationReviewDraft,
    sujiaoPracticalProblemsDraft,
    sujiaoQuantityDifferenceDraft,
    sujiaoComparisonTargetDraft,
    sujiaoCarryAddDraft,
    sujiaoBorrowSubtractDraft,
    sujiaoTwoDigitTensDraft,
    sujiaoTwoDigitOnesDraft,
  ].filter((l) => l.id.startsWith('sj-lower-'));
  expect(sujiaoLowerLessons).toHaveLength(87);
  expect(
    book.units[0]!.lessons.filter((l) => l.status === 'available'),
  ).toEqual(sujiaoLowerLessons.filter((l) => l.page < 22));
  expect(book.units[1]!.lessons[0]!.id).toBe('sj-lower-plane-recognition');
  expect(sujiaoLowerLessons.map((l) => l.page)).toEqual([
    2, 4, 6, 7, 8, 10, 14, 16, 17, 17, 18, 18, 20, 21, 23, 25, 26, 27, 28, 29,
    29, 30, 30, 31, 31, 31, 31, 32, 33, 35, 37, 38, 38, 39, 39, 40, 40, 41, 41,
    43, 45, 45, 46, 46, 47, 47, 48, 49, 50, 50, 51, 52, 52, 52, 53, 58, 60, 63,
    64, 66, 68, 69, 70, 70, 72, 74, 76, 77, 79, 80, 81, 82, 84, 84, 85, 88, 88,
    89, 90, 90, 91, 91, 92, 92, 93, 93, 94,
  ]);
  for (const live of sujiaoLowerLessons) {
    const draft = drafts.find((l) => l.id === live.id)!;
    expect(draft.status).toBe('preparing');
    expect(live.status).toBe('available');
    expect(live).not.toBe(draft);
    expect(live.questions).not.toBe(draft.questions);
    expect(live.questions).toEqual(draft.questions);
    expect(live.reviewQuestions).toEqual(draft.reviewQuestions);
    expect(live.version).toBe(draft.version);
    expect(live.review.notes).toContain(source.isbn);
    expect(live.review.notes).toContain('版次与印次仍未核验');
    expect(live.review.notes).not.toContain('未注册');
  }
  for (const pending of book.units
    .flatMap((u) => u.lessons)
    .filter((l) => l.status === 'preparing')) {
    expect(pending.questions).toHaveLength(0);
    expect(pending.steps).toHaveLength(0);
  }
  expect(
    new Set(book.units.flatMap((u) => u.lessons).map((l) => l.id)).size,
  ).toBe(87);
  const questions = sujiaoLowerLessons.flatMap((l) => l.questions);
  expect(
    questions.filter((q) => !['manual', 'reflection'].includes(q.rule.kind)),
  ).toHaveLength(1102);
  expect(questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(303);
  expect(questions.filter((q) => q.rule.kind === 'reflection')).toHaveLength(
    143,
  );
});
it('starts every released lesson with lower-volume identity while preserving upper and PEP sessions and backups', async () => {
  const library = createStudyLibrary({
    load: async () => null,
    save: async () => {},
  });
  await library.initialize('孩子');
  const upper = sujiaoBooks.find((b) => b.volume === 'upper')!;
  const pep = mathBooks.find((b) => b.volume === 'lower')!;
  const upperSession = await library.start(
    upper.units[0]!.lessons[0]!,
    upper.id,
  );
  const pepSession = await library.start(
    pep.units.flatMap((u) => u.lessons).find((l) => l.status === 'available')!,
    pep.id,
  );
  for (const lesson of sujiaoLowerLessons) {
    const session = await library.start(lesson, book.id);
    expect(session.bookId).toBe(book.id);
    expect(session.lessonId).toBe(lesson.id);
    expect(session.lessonVersion).toBe(lesson.version);
    expect(session.questions).toHaveLength(lesson.questions.length);
  }
  expect(library.sessions.value).toHaveLength(89);
  expect(library.sessions.value.find((s) => s.id === upperSession.id)).toEqual(
    upperSession,
  );
  expect(library.sessions.value.find((s) => s.id === pepSession.id)).toEqual(
    pepSession,
  );
  const saved = library.state.value;
  if (!saved) throw new Error('library not initialized');
  expect(parseBackup(exportBackup(saved)).data.sessions).toEqual(
    saved.sessions,
  );
  for (const pending of [
    { ...book.units[0]!.lessons[0]!, status: 'preparing' as const },
  ]) {
    await expect(library.start(pending, book.id)).rejects.toThrow(
      'educationLearning.notAvailable',
    );
  }
  expect(library.sessions.value).toHaveLength(89);
});
