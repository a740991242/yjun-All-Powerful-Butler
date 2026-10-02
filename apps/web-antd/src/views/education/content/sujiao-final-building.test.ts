import { expect, it } from 'vitest';

import { exportBackup, isLibraryState, parseBackup } from '../learning/backup';
import {
  cubeColumnsTotal,
  isCubeColumnsVisual,
} from '../learning/cube-columns';
import { createSession, submitResponse } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import { sujiaoFinalBuildingLesson as lesson } from './sujiao-final-building';
it('keeps one-cube depth, conserved quantities, explicit patterns and manual reflections', () => {
  expect(lesson.page).toBe(94);
  expect(lesson.questions.filter((q) => q.rule.kind !== 'manual')).toHaveLength(
    17,
  );
  expect(lesson.reviewQuestions).toHaveLength(17);
  const all = [...lesson.questions, ...lesson.reviewQuestions!];
  for (const q of all) {
    if (q.visual?.kind === 'cube-columns')
      expect(isCubeColumnsVisual(q.visual)).toBe(true);
    if (
      q.id.endsWith('-count') ||
      q.id.endsWith('-preserve') ||
      q.id.endsWith('-stairs')
    ) {
      if (q.visual?.kind !== 'cube-columns')
        throw new Error('missing original diagram');
      expect(q.rule).toEqual({
        kind: 'number',
        value: cubeColumnsTotal(q.visual),
      });
    }
  }
  expect(lesson.questions.find((q) => q.id.endsWith('-moving'))?.rule).toEqual({
    kind: 'number',
    value: 3,
  });
  expect(
    lesson.reviewQuestions!.find((q) => q.id.endsWith('-moving'))?.rule,
  ).toEqual({ kind: 'number', value: 2 });
  expect(lesson.parentTip).toContain('不能把有限数列');
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    5,
  );
});
it('preserves confusing column count with total and restores the expanded reviewed diagrams', () => {
  const state = initialLibrary('测试');
  const session = createSession(
    lesson,
    'sujiao-math-p1-upper-2024',
    state.activeProfileId,
  );
  const index = session.questions.findIndex((q) => q.id.endsWith('-count'));
  const q = session.questions[index]!;
  const response = session.responses[index]!;
  response.draft = 5;
  session.responses[index] = submitResponse(q, response);
  session.responses[index]!.draft = 9;
  session.responses[index] = submitResponse(q, session.responses[index]!);
  state.sessions.push(session);
  expect(session.responses[index]!.submissions.map((r) => r.correct)).toEqual([
    false,
    true,
  ]);
  expect(parseBackup(exportBackup(state)).data).toEqual(state);
  const bad = structuredClone(state);
  Object.assign(bad.sessions[0]!.questions[index]!.visual!, {
    heights: [4, 4, 4],
  });
  expect(isLibraryState(bad)).toBe(false);
});
