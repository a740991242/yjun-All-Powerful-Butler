import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import { sujiaoFinalShapesLesson as lesson } from './sujiao-final-shapes';

it('counts whole models and separates six blocks from height and overall shape', () => {
  for (const [review, tasks, counts, height] of [
    [false, lesson.questions, [3, 2, 2, 1], 2],
    [true, lesson.reviewQuestions!, [3, 2, 1, 2], 3],
  ] as const) {
    const question = (suffix: string) =>
      tasks.find(
        (q) => q.id === `${lesson.id}-${review ? 'r' : 'q'}-${suffix}`,
      )!;
    for (const [index, shape] of [
      'cube',
      'cuboid',
      'cylinder',
      'sphere',
    ].entries()) {
      const q = question(`count-${shape}`);
      expect(evaluate(q.rule, counts[index]!)).toBe(true);
      expect(evaluate(q.rule, 8)).toBe(false);
      if (q.visual?.kind !== 'solid-row') throw new Error('missing row');
      expect(q.visual.shapes.filter((x) => x === shape)).toHaveLength(
        counts[index]!,
      );
    }
    expect(evaluate(question('total').rule, 8)).toBe(true);
    expect(evaluate(question('total').rule, 4)).toBe(false);
    expect(evaluate(question('six').rule, 6)).toBe(true);
    expect(evaluate(question('height').rule, height)).toBe(true);
    expect(evaluate(question('height').rule, 6)).toBe(false);
    expect(evaluate(question('whole').rule, 'cuboid')).toBe(true);
    expect(evaluate(question('whole').rule, 'cube')).toBe(false);
    expect(tasks.filter((q) => q.rule.kind !== 'manual')).toHaveLength(19);
  }
});

it('retains wrong body-reference answers and does not auto-confirm physical activities', () => {
  const state = initialLibrary('检查');
  const session = createSession(
    lesson,
    'sujiao-math-p1-upper-2024',
    state.activeProfileId,
  );
  for (const suffix of ['front', 'left']) {
    const index = session.questions.findIndex(
      (q) => q.id === `${lesson.id}-q-${suffix}`,
    );
    const q = session.questions[index]!;
    session.responses[index]!.draft = 'before';
    session.responses[index] = submitResponse(q, session.responses[index]!);
    session.responses[index]!.draft = 'after';
    session.responses[index] = submitResponse(q, session.responses[index]!);
    expect(session.responses[index]!.submissions.map((s) => s.correct)).toEqual(
      [false, true],
    );
  }
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    7,
  );
  expect(
    lesson.questions.find((q) => q.id === `${lesson.id}-manual-composite`)?.rule
      .kind,
  ).toBe('manual');
  for (const [index, q] of session.questions.entries()) {
    if (q.rule.kind === 'manual')
      expect(session.responses[index]!.submissions).toHaveLength(0);
  }
  state.sessions.push(session);
  expect(parseBackup(exportBackup(state)).data).toEqual(state);
});

it('keeps original-page activities independent and restores v2 alongside v3 without auto-confirmation', () => {
  const state = initialLibrary('来源活动');
  const old = createSession(
    {
      ...lesson,
      version: 2,
      questions: lesson.questions.slice(0, 24),
      reviewQuestions: lesson.reviewQuestions!.slice(0, 19),
      steps: lesson.steps.slice(0, 6),
    },
    'sujiao-math-p1-upper-2024',
    state.activeProfileId,
    { seed: 1 },
  );
  const next = createSession(
    lesson,
    'sujiao-math-p1-upper-2024',
    state.activeProfileId,
    { seed: 2 },
  );
  const actual = next.questions.filter((q) =>
    q.knowledge.includes('-actual-source-'),
  );
  expect(actual).toHaveLength(2);
  for (const q of actual) expect(q.rule).toEqual({ kind: 'manual' });
  const i = next.questions.findIndex((q) =>
    q.knowledge.endsWith('four-counts'),
  );
  expect(next.responses[i]!.submissions).toEqual([]);
  next.responses[i] = submitResponse(next.questions[i]!, {
    ...next.responses[i]!,
    draft: 'confirmed',
  });
  expect(next.responses[i]!.submissions[0]!.correct).toBeNull();
  state.sessions.push(old, next);
  expect(parseBackup(exportBackup(state)).data).toEqual(state);
  expect(old.questions).toHaveLength(24);
  expect(next.questions).toHaveLength(26);
});

it('requires complete source matching and all four source counts rather than one example', () => {
  expect(
    lesson.questions.find((q) => q.knowledge.endsWith('object-links'))!.prompt,
  ).toContain('全部生活物品');
  expect(
    lesson.questions.find((q) => q.knowledge.endsWith('four-counts'))!.prompt,
  ).toContain('全部四个数量');
  expect(
    lesson.questions.find((q) => q.knowledge.endsWith('four-counts'))!.prompt,
  ).toContain('不直接抄本站数量');
});
