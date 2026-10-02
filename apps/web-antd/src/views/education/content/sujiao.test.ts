import { expect, it } from 'vitest';

import { createStudyLibrary } from '../learning/library';
import { mathBooks } from './math';
import {
  sujiaoBooks,
  sujiaoComparisonLesson,
  sujiaoCountingLesson,
  sujiaoFirstAdditionLesson,
  sujiaoFirstSubtractionLesson,
  sujiaoFirstUnitReviewLesson,
  sujiaoFourFiveLesson,
  sujiaoIntroGamesLesson,
  sujiaoMissingAddendLesson,
  sujiaoOrdinalLesson,
  sujiaoPositionLesson,
  sujiaoSequentialLesson,
  sujiaoSixNineArithmeticLesson,
  sujiaoSixNineRecognitionLesson,
  sujiaoSixNineReviewLesson,
  sujiaoSolidBuildLesson,
  sujiaoSolidRecognitionLesson,
  sujiaoTeenArithmeticLesson,
  sujiaoTeensRecognitionLesson,
  sujiaoTeensReviewLesson,
  sujiaoTenArithmeticLesson,
  sujiaoTenCompositionLesson,
  sujiaoTenRecognitionLesson,
  sujiaoUpperTextbook,
  sujiaoZeroArithmeticLesson,
  sujiaoZeroRecognitionLesson,
} from './sujiao';
import { sujiaoDirectionComparisonLesson } from './sujiao-direction-comparison';
import { sujiaoFillArithmeticLesson } from './sujiao-fill-arithmetic';
import { sujiaoFinalArithmeticLesson } from './sujiao-final-arithmetic';
import { sujiaoFinalBuildingLesson } from './sujiao-final-building';
import { sujiaoFinalExplorationLesson } from './sujiao-final-exploration';
import { sujiaoFinalNumbersLesson } from './sujiao-final-numbers';
import { sujiaoFinalShapesLesson } from './sujiao-final-shapes';
import { sujiaoIntroShapesLesson } from './sujiao-intro-shapes';
import { sujiaoNineConsolidationLesson } from './sujiao-nine-consolidation';
import { sujiaoRecognitionReviewLesson } from './sujiao-recognition-review';
import { sujiaoSumLinesLesson } from './sujiao-sum-lines';
import { sujiaoTakeTenLesson } from './sujiao-take-ten';
import { sujiaoTenReviewLesson } from './sujiao-ten-review';
import { sujiaoTilingLesson } from './sujiao-tiling';
import { sujiaoEverydayTimeLesson } from './sujiao-time';
import { sujiaoUpperCardReviewLesson } from './sujiao-upper-card-review';
import { sujiaoUpperColourCountLesson } from './sujiao-upper-colour-count';
import { sujiaoUpperContinuousLesson } from './sujiao-upper-continuous';
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
import { textbooks } from './textbooks';

it('registers a separate upper volume and exposes only reviewed lessons', () => {
  const book = sujiaoBooks[0]!;
  expect(book.id).toBe(sujiaoUpperTextbook.id);
  expect(book.edition).toBe('sujiao');
  expect(book.units.map((unit) => unit.page)).toEqual([
    1, 11, 32, 35, 53, 62, 75, 78, 88,
  ]);
  const lessons = book.units.flatMap((unit) => unit.lessons);
  expect(lessons.filter((lesson) => lesson.status === 'available')).toEqual([
    sujiaoIntroGamesLesson,
    sujiaoIntroShapesLesson,
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
    sujiaoPositionLesson,
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
    sujiaoSolidRecognitionLesson,
    sujiaoSolidBuildLesson,
    sujiaoUpperSolidInstructionsLesson,
    sujiaoUpperSolidReviewLesson,
    sujiaoUpperCubePairLesson,
    sujiaoUpperSolidPatternsLesson,
    sujiaoUpperSolidRecomposeLesson,
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
    sujiaoTakeTenLesson,
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
  ]);
  expect(new Set(lessons.map((lesson) => lesson.id)).size).toBe(lessons.length);
  for (const lesson of lessons.filter(
    (lesson) => lesson.status === 'preparing',
  )) {
    expect(lesson.questions).toHaveLength(0);
    expect(lesson.steps).toHaveLength(0);
  }
  expect(textbooks).toHaveLength(4);
  expect(textbooks.every((item) => item.edition === 'pep-2024')).toBe(true);
  expect(mathBooks.every((item) => item.id !== book.id)).toBe(true);
});

it('does not create a session for unfinished units', async () => {
  const book = sujiaoBooks[0]!;
  const pending = {
    ...sujiaoIntroGamesLesson,
    status: 'preparing' as const,
    steps: [],
    questions: [],
  };
  expect(
    book.units
      .flatMap((unit) => unit.lessons)
      .every((lesson) => lesson.status === 'available'),
  ).toBe(true);
  const library = createStudyLibrary({
    load: async () => null,
    save: async () => {},
  });
  await library.initialize('孩子');
  await expect(library.start(pending, book.id)).rejects.toThrow(
    'educationLearning.notAvailable',
  );
  expect(library.sessions.value).toHaveLength(0);
  const session = await library.start(sujiaoIntroGamesLesson, book.id);
  expect(session.bookId).toBe(book.id);
  expect(session.lessonId).toBe(sujiaoIntroGamesLesson.id);
  expect(library.sessions.value).toHaveLength(1);
});

it('starts every reviewed lesson under its own Sujiao identity', async () => {
  const book = sujiaoBooks[0]!;
  const library = createStudyLibrary({
    load: async () => null,
    save: async () => {},
  });
  await library.initialize('第一单元');
  for (const lesson of [
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
    sujiaoPositionLesson,
    sujiaoSixNineRecognitionLesson,
    sujiaoSixNineArithmeticLesson,
    sujiaoSequentialLesson,
    sujiaoNineConsolidationLesson,
    sujiaoSixNineReviewLesson,
    sujiaoSolidRecognitionLesson,
    sujiaoSolidBuildLesson,
    sujiaoUpperSolidInstructionsLesson,
    sujiaoUpperSolidReviewLesson,
    sujiaoUpperCubePairLesson,
    sujiaoUpperSolidPatternsLesson,
    sujiaoUpperSolidRecomposeLesson,
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
    sujiaoTakeTenLesson,
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
  ]) {
    const session = await library.start(lesson, book.id);
    expect(session.bookId).toBe(book.id);
    expect(session.lessonId).toBe(lesson.id);
    expect(session.questions.length).toBe(lesson.questions.length);
    expect(lesson.review.notes).toContain('2025年7月第2次印刷');
  }
  expect(library.sessions.value).toHaveLength(60);
  const main = sujiaoOrdinalLesson.questions.find((q) =>
    q.id.endsWith('-q-total'),
  )!;
  const review = sujiaoOrdinalLesson.reviewQuestions!.find((q) =>
    q.id.endsWith('-r-total'),
  )!;
  expect(main.rule).toEqual({ kind: 'number', value: 5 });
  expect(review.rule).toEqual({ kind: 'number', value: 4 });
});
