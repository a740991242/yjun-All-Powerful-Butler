import { expect, it } from 'vitest';

import {
  blankSurveyTable,
  sujiaoSurveysDraft as lesson,
  surveyExample,
} from '../content/sujiao-surveys';
import { exportBackup, parseBackup } from './backup';
import { createSession, evaluate, submitResponse } from './engine';
import { fold } from './fold';
import { sparseArray } from './sparse-array';
import { initialLibrary } from './storage';
import {
  blankSurvey,
  isSurveyTableState,
  isSurveyTableVisual,
  matchingSurveyState,
  setSurveyCount,
} from './survey-table';
it('separates unrecorded null from confirmed zero, validates one-mark/one-object tables and rejects inconsistent or corrupt rows', () => {
  const blank = blankSurveyTable();
  expect(isSurveyTableVisual(blank)).toBe(true);
  expect(blankSurvey(blank)).toBe(true);
  for (const index of [0, 1, 2, 3])
    for (const review of [false, true])
      expect(isSurveyTableVisual(surveyExample(index, review))).toBe(true);
  const example = surveyExample(0, false);
  expect(example.rows[0]!.count).toBeNull();
  expect(example.rows[0]!.marks!.count).toBe(5);
  for (const rows of [
    [],
    sparseArray(2),
    [
      { label: 'A', marks: null, count: 61 },
      { label: 'B', marks: null, count: 0 },
    ],
    [
      { label: 'A', marks: null, count: 60 },
      { label: 'B', marks: null, count: 60 },
    ],
    [
      { label: 'A', marks: { symbol: ['circle'], count: 2 }, count: 2 },
      { label: 'B', marks: null, count: 0 },
    ],
    [
      { label: 'A', marks: { symbol: 'circle', count: 2 }, count: 3 },
      { label: 'B', marks: null, count: 0 },
    ],
    [
      { label: 'A', marks: null, count: 2 },
      { label: 'A', marks: null, count: 0 },
    ],
  ])
    expect(isSurveyTableVisual({ ...blank, rows })).toBe(false);
  expect(isSurveyTableVisual({ ...blank, answer: 2 })).toBe(false);
});
it('saves fixed-category counts immutably, including larger real groups, without editing authored examples or equating blanks with zero', () => {
  const initial = { counts: [null, null] };
  const visual = blankSurveyTable();
  const first = setSurveyCount(visual, initial, 0, 31);
  expect(initial.counts).toEqual([null, null]);
  expect(first.counts).toEqual([31, null]);
  const complete = setSurveyCount(visual, first, 1, 0);
  expect(complete.counts).toEqual([31, 0]);
  expect(matchingSurveyState(complete, visual)).toBe(true);
  expect(setSurveyCount(visual, complete, 1, null).counts).toEqual([31, null]);
  expect(setSurveyCount(visual, { counts: [60, 40] }, 1, 41).counts).toEqual([
    60, 40,
  ]);
  for (const counts of [
    [],
    sparseArray(2),
    [1],
    [-1, 0],
    [1.5, 0],
    [61, 0],
    [60, 41],
    [undefined, 1],
  ])
    expect(isSurveyTableState({ counts })).toBe(false);
  expect(matchingSurveyState({ counts: [1, 2, 3] }, visual)).toBe(false);
  expect(matchingSurveyState(complete, surveyExample(0, false))).toBe(false);
  expect(() => setSurveyCount(visual, initial, -1, 2)).toThrow(Error);
  expect(() => setSurveyCount(surveyExample(0, false), initial, 0, 2)).toThrow(
    Error,
  );
});
it('covers actual recording, count reading, totals and tied maximum categories with changed review data', () => {
  expect(lesson.steps).toHaveLength(4);
  expect(lesson.questions).toHaveLength(26);
  expect(lesson.reviewQuestions).toHaveLength(22);
  for (const questions of [lesson.questions, lesson.reviewQuestions!])
    for (const q of questions) {
      if (q.visual?.kind !== 'survey-table') continue;
      expect(isSurveyTableVisual(q.visual)).toBe(true);
      const counts = q.visual.rows.map((r) => r.marks?.count ?? r.count);
      if (q.id.includes('-read-')) {
        const index = Number(q.id.split('-').at(-1));
        expect(evaluate(q.rule, counts[index] ?? null)).toBe(true);
      }
      if (q.id.endsWith('-total'))
        expect(
          evaluate(
            q.rule,
            fold(counts, 0, (sum: number, c) => sum + (c ?? 0)),
          ),
        ).toBe(true);
      if (q.id.endsWith('-most')) {
        const max = Math.max(...counts.map((c) => c ?? 0));
        expect(
          evaluate(
            q.rule,
            counts.flatMap((c, i) => (c === max ? [String(i)] : [])),
          ),
        ).toBe(true);
      }
    }
  const tie = lesson.reviewQuestions!.find((q) => q.id.endsWith('-3-most'))!;
  expect(evaluate(tie.rule, ['0'])).toBe(false);
  expect(evaluate(tie.rule, ['0', '1'])).toBe(true);
  for (const review of lesson.reviewQuestions!) {
    const original = lesson.questions.find(
      (q) => q.knowledge === review.knowledge,
    )!;
    if (review.visual) expect(review.visual).not.toEqual(original.visual);
    else expect(review.prompt).not.toBe(original.prompt);
  }
});
it('round-trips user counts and wrong-first history, rejecting objective, missing, mismatched and nonblank question bindings', () => {
  const library = initialLibrary('调查');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const index = session.questions.findIndex((q) => q.id.endsWith('-3-most'));
  for (const answer of [['0', '1'], ['0']]) {
    session.responses[index]!.draft = answer;
    session.responses[index] = submitResponse(
      session.questions[index]!,
      session.responses[index]!,
    );
  }
  expect(session.responses[index]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  const manual = session.questions.find((q) => q.id.endsWith('-manual-0'))!;
  const tool = { counts: [31, 0] };
  session.tools = {
    'step-3': { surveyTable: tool },
    [`question-${manual.id}`]: { surveyTable: { counts: [4, 0] } },
  };
  library.sessions.push(session);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(session);
  for (const key of [
    `question-${session.questions[index]!.id}`,
    'question-missing',
  ]) {
    const bad = structuredClone(library);
    bad.sessions[0]!.tools = { [key]: { surveyTable: tool } };
    expect(() => parseBackup(exportBackup(bad))).toThrow(Error);
  }
  const mismatch = structuredClone(library);
  mismatch.sessions[0]!.tools![`question-${manual.id}`]!.surveyTable = {
    counts: [1, 2, 3],
  };
  expect(() => parseBackup(exportBackup(mismatch))).toThrow(Error);
  const authored = structuredClone(library);
  authored.sessions[0]!.questions.find((q) => q.id === manual.id)!.visual =
    surveyExample(0, false);
  expect(() => parseBackup(exportBackup(authored))).toThrow(Error);
  const old = structuredClone(library);
  delete old.sessions[0]!.tools;
  expect(parseBackup(exportBackup(old)).data.sessions[0]).toEqual(
    old.sessions[0],
  );
});
