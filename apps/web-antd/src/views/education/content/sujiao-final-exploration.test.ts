import { expect, it } from 'vitest';

import { exportBackup, isLibraryState, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { gridPathLength, isGridPathsVisual } from '../learning/grid-paths';
import { initialLibrary } from '../learning/storage';
import {
  sujiaoFinalExplorationLesson as lesson,
  sujiaoFinalPaths,
  sujiaoFinalReviewPaths,
} from './sujiao-final-exploration';
import { sujiaoMainPaths } from './sujiao-first-unit-review';

it('accepts explicit square grids and keeps legacy bounds and snapshots unchanged', () => {
  for (const model of [sujiaoFinalPaths, sujiaoFinalReviewPaths]) {
    expect(isGridPathsVisual(model)).toBe(true);
    expect(model.paths.map((p) => gridPathLength(p.points))).toEqual([6, 6, 5]);
    for (const path of model.paths)
      expect(gridPathLength([...path.points].toReversed())).toBe(
        gridPathLength(path.points),
      );
  }
  expect(isGridPathsVisual(sujiaoMainPaths)).toBe(true);
  const { grid: _, ...withoutGrid } = sujiaoFinalPaths;
  expect(isGridPathsVisual(withoutGrid)).toBe(false);
  for (const grid of ['5x3', '6x6', null, undefined])
    expect(isGridPathsVisual({ ...sujiaoFinalPaths, grid })).toBe(false);
  for (const points of [
    [
      [0, 0],
      [5, 0],
      [5, 2],
    ],
    [
      [0, 0],
      [1, 1],
    ],
    [
      [0, 0],
      [6, 0],
    ],
    [
      [0, 0],
      [0, 6],
    ],
    [
      [0, 0],
      [2, 0],
      [0, 0],
    ],
  ]) {
    const model = structuredClone(sujiaoFinalPaths);
    model.paths[0]!.points = points as [number, number][];
    expect(isGridPathsVisual(model)).toBe(false);
  }
  const overlap = structuredClone(sujiaoFinalPaths);
  overlap.paths[2]!.points = [
    [0, 2],
    [0, 3],
  ];
  expect(isGridPathsVisual(overlap)).toBe(false);
});

it('excludes the person from front/behind counts and preserves the first endpoint-distance error', () => {
  for (const [review, tasks, behind, front] of [
    [false, lesson.questions, 16, 14],
    [true, lesson.reviewQuestions!, 15, 15],
  ] as const) {
    const q = (suffix: string) =>
      tasks.find(
        (q) => q.id === `${lesson.id}-${review ? 'r' : 'q'}-${suffix}`,
      )!;
    expect(evaluate(q('behind').rule, behind)).toBe(true);
    expect(evaluate(q('behind').rule, behind - 1)).toBe(false);
    expect(evaluate(q('front').rule, front)).toBe(true);
    expect(evaluate(q('front').rule, front + 1)).toBe(false);
    expect(evaluate(q('equal').rule, 3)).toBe(true);
    expect(evaluate(q('total').rule, 3)).toBe(false);
  }
  const state = initialLibrary('探索');
  const session = createSession(
    lesson,
    'sujiao-math-p1-upper-2024',
    state.activeProfileId,
  );
  const index = session.questions.findIndex(
    (q) => q.id === `${lesson.id}-q-path-B`,
  );
  const q = session.questions[index]!;
  session.responses[index]!.draft = 5;
  session.responses[index] = submitResponse(q, session.responses[index]!);
  session.responses[index]!.draft = 6;
  session.responses[index] = submitResponse(q, session.responses[index]!);
  expect(session.responses[index]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  state.sessions.push(session);
  expect(parseBackup(exportBackup(state)).data).toEqual(state);
  const invalid = structuredClone(state);
  Object.assign(invalid.sessions[0]!.questions[index]!.visual!, {
    grid: '6x6',
  });
  expect(isLibraryState(invalid)).toBe(false);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    9,
  );
});

it('accepts every complete nonnegative three-plate partition, including empty plates, with changed review total', () => {
  for (const [questions, total] of [
    [lesson.questions, 9],
    [lesson.reviewQuestions!, 8],
  ] as const) {
    const q = questions.find((q) => q.knowledge.endsWith('-open-partition'))!;
    let count = 0;
    for (let a = 0; a <= total; a++)
      for (let b = 0; b <= total; b++)
        for (let c = 0; c <= total; c++) {
          expect(evaluate(q.rule, [a, b, c]), `${total}:${a},${b},${c}`).toBe(
            a + b + c === total,
          );
          if (a + b + c === total) count++;
        }
    expect(count).toBe(total === 9 ? 55 : 45);
    expect(evaluate(q.rule, [total, 0, 0])).toBe(true);
    expect(evaluate(q.rule, [0, total, 0])).toBe(true);
    expect(() => evaluate(q.rule, [total, null, 0])).toThrow(
      'educationLearning.answerRequired',
    );
    expect(() => evaluate(q.rule, [total, 0])).toThrow(
      'educationLearning.answerRequired',
    );
    expect(evaluate(q.rule, [-1, total, 1])).toBe(false);
    expect(() => evaluate(q.rule, [0.5, total - 0.5, 0])).toThrow(
      'educationLearning.answerRequired',
    );
  }
});
it('keeps four original activities separate and preserves v2 records alongside new open drafts and errors', () => {
  const actual = lesson.questions.filter((q) =>
    q.knowledge.includes('-actual-source-'),
  );
  expect(actual).toHaveLength(4);
  for (const q of actual) expect(q.rule).toEqual({ kind: 'manual' });
  expect(
    actual.find((q) => q.knowledge.endsWith('queue-front'))!.prompt,
  ).toContain('不能以完成左图');
  expect(
    actual.find((q) => q.knowledge.endsWith('path-unit'))!.prompt,
  ).toContain('单位不是厘米');
  const state = initialLibrary('探索');
  const old = createSession(
    {
      ...lesson,
      version: 2,
      questions: lesson.questions.slice(0, 23),
      reviewQuestions: lesson.reviewQuestions!.slice(0, 18),
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
  const i = next.questions.findIndex((q) =>
    q.knowledge.endsWith('-open-partition'),
  );
  next.responses[i]!.draft = [9, null, 0];
  state.sessions.push(old, next);
  expect(parseBackup(exportBackup(state)).data).toEqual(state);
  next.responses[i] = submitResponse(next.questions[i]!, {
    ...next.responses[i]!,
    draft: [9, 1, 0],
  });
  next.responses[i] = submitResponse(next.questions[i]!, {
    ...next.responses[i]!,
    draft: [9, 0, 0],
  });
  const manual = next.questions.findIndex((q) =>
    q.knowledge.endsWith('queue-front'),
  );
  expect(next.responses[manual]!.submissions).toEqual([]);
  next.responses[manual] = submitResponse(next.questions[manual]!, {
    ...next.responses[manual]!,
    draft: 'confirmed',
  });
  expect(next.responses[manual]!.submissions[0]!.correct).toBeNull();
  expect(next.responses[i]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  expect(parseBackup(exportBackup(state)).data).toEqual(state);
  expect(old.questions).toHaveLength(23);
  expect(next.questions).toHaveLength(28);
});
