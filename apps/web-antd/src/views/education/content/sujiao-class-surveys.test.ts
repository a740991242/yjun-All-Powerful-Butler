import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import { isSurveyTableVisual } from '../learning/survey-table';
import {
  classSurveyExample,
  sujiaoClassSurveysDraft as lesson,
} from './sujiao-class-surveys';
it('uses original explicit class criteria with independent counts and changed zero and tied maxima', () => {
  const expectedMain = [
    [4, 5],
    [3, 6],
    [2, 7],
    [0, 9],
  ];
  const expectedReview = [
    [6, 4],
    [7, 3],
    [0, 10],
    [5, 5],
  ];
  for (let index = 0; index < 4; index++)
    for (const review of [false, true]) {
      const visual = classSurveyExample(index, review);
      expect(isSurveyTableVisual(visual)).toBe(true);
      expect(visual.rows.map((r) => r.marks!.count)).toEqual(
        (review ? expectedReview : expectedMain)[index],
      );
      expect(visual.rows.map((r) => r.count)).toEqual(
        index % 2 === 0
          ? [null, null]
          : (review ? expectedReview : expectedMain)[index],
      );
    }
  for (const index of [-1, 4, 0.5, Infinity, Number.NaN])
    expect(() => classSurveyExample(index, false)).toThrow(Error);
  expect(lesson.steps).toHaveLength(5);
  expect(lesson.questions).toHaveLength(26);
  expect(lesson.reviewQuestions).toHaveLength(21);
  expect(
    lesson.reviewQuestions!.find((q) => q.id.endsWith('-r-3-most'))!.rule,
  ).toEqual({ kind: 'set', values: ['0', '1'] });
  expect(
    evaluate(
      lesson.reviewQuestions!.find((q) => q.id.endsWith('-r-3-most'))!.rule,
      ['0'],
    ),
  ).toBe(false);
  for (const q of lesson.reviewQuestions!) {
    const main = lesson.questions.find((o) => o.knowledge === q.knowledge)!;
    expect(main).toBeDefined();
    expect(JSON.stringify([q.prompt, q.visual, q.choices])).not.toBe(
      JSON.stringify([main.prompt, main.visual, main.choices]),
    );
  }
});
it('keeps separate actual survey counts and wrong-first history without permitting edits to objective examples', () => {
  const library = initialLibrary('班级调查');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const index = session.questions.findIndex((q) => q.id.endsWith('-q-3-most'));
  for (const draft of [['0', '1'], ['1']]) {
    session.responses[index]!.draft = draft;
    session.responses[index] = submitResponse(
      session.questions[index]!,
      session.responses[index]!,
    );
  }
  expect(session.responses[index]!.submissions.map((a) => a.correct)).toEqual([
    false,
    true,
  ]);
  const manual = session.questions.find((q) => q.id.endsWith('-manual-0'))!;
  session.tools = {
    'step-4': { surveyTable: { counts: [5, 0] } },
    [`question-${manual.id}`]: { surveyTable: { counts: [4, 0] } },
  };
  library.sessions.push(session);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(session);
  const objective = structuredClone(library);
  objective.sessions[0]!.tools = {
    [`question-${session.questions[index]!.id}`]: {
      surveyTable: { counts: [4, 0] },
    },
  };
  expect(() => parseBackup(exportBackup(objective))).toThrow(Error);
  const wrong = structuredClone(library);
  wrong.sessions[0]!.questions.find((q) => q.id === manual.id)!.visual =
    classSurveyExample(0, false);
  expect(() => parseBackup(exportBackup(wrong))).toThrow(Error);
  const corrupt = structuredClone(library);
  const q = corrupt.sessions[0]!.questions.find(
    (q) => q.visual?.kind === 'survey-table' && q.rule.kind === 'number',
  )!;
  if (q.visual?.kind !== 'survey-table') throw new Error('missing table');
  q.visual.rows[0]!.count = 59;
  expect(() => parseBackup(exportBackup(corrupt))).toThrow(Error);
});
