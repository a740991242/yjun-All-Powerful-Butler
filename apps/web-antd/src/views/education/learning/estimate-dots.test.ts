import { expect, it } from 'vitest';

import { sujiaoEstimationDraft as lesson } from '../content/sujiao-estimation';
import { exportBackup, parseBackup } from './backup';
import { createSession, evaluate } from './engine';
import {
  estimateDots,
  initialEstimateDots,
  isEstimateDotsState,
  isEstimateDotsVisual,
} from './estimate-dots';
import { initialLibrary } from './storage';
it('renders ten real reference dots and changes actual review quantity without overlaps', () => {
  for (const [variant, total] of [
    ['main', 63],
    ['review', 47],
  ] as const) {
    const dots = estimateDots(variant);
    expect(dots).toHaveLength(total);
    expect(dots.filter((d) => d.reference)).toHaveLength(10);
    for (let i = 0; i < dots.length; i++)
      for (let j = i + 1; j < dots.length; j++)
        expect(
          Math.hypot(dots[i]!.x - dots[j]!.x, dots[i]!.y - dots[j]!.y),
        ).toBeGreaterThan(14);
    expect(
      dots.every((d) => d.x >= 7 && d.x <= 293 && d.y >= 7 && d.y <= 235),
    ).toBe(true);
  }
  expect(isEstimateDotsVisual({ kind: 'estimate-dots', variant: 'main' })).toBe(
    true,
  );
  expect(
    isEstimateDotsVisual({ kind: 'estimate-dots', variant: ['main'] }),
  ).toBe(false);
  expect(
    isEstimateDotsVisual({
      kind: 'estimate-dots',
      variant: 'main',
      answer: 63,
    }),
  ).toBe(false);
});
it('preserves zero, an inaccurate locked estimate and separately counted quantity with strict sequencing', () => {
  const initial = initialEstimateDots('main');
  expect(isEstimateDotsState(initial)).toBe(true);
  expect(
    isEstimateDotsState({ ...initial, estimate: 0, locked: true, counted: 63 }),
  ).toBe(true);
  for (const bad of [
    { ...initial, locked: true },
    { ...initial, counted: 63 },
    { ...initial, estimate: 100 },
    { ...initial, estimate: 0.5 },
    { ...initial, extra: 1 },
  ])
    expect(isEstimateDotsState(bad)).toBe(false);
  const library = initialLibrary('估数');
  const s = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const manual = s.questions.find((q) => q.id.endsWith('-manual-web'))!;
  s.tools = {
    'step-0': {
      estimateDots: {
        variant: 'main',
        estimate: 60,
        locked: true,
        counted: 63,
      },
    },
    [`question-${manual.id}`]: {
      estimateDots: {
        variant: 'review',
        estimate: 50,
        locked: true,
        counted: 47,
      },
    },
  };
  library.sessions.push(s);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(s);
  const wrong = JSON.parse(exportBackup(library));
  wrong.data.sessions[0].tools[`question-${manual.id}`].estimateDots.variant =
    'main';
  expect(() => parseBackup(JSON.stringify(wrong))).toThrow(Error);
  const objective = s.questions.find((q) => q.rule.kind === 'number')!;
  const bound = JSON.parse(exportBackup(library));
  bound.data.sessions[0].tools[`question-${objective.id}`] = {
    estimateDots: initialEstimateDots('main'),
  };
  expect(() => parseBackup(JSON.stringify(bound))).toThrow(Error);
  expect(s.responses.every((r) => r.submissions.length === 0)).toBe(true);
});
it('changes review groups and context while not grading the initial estimate', () => {
  expect(lesson.questions).toHaveLength(12);
  expect(lesson.reviewQuestions).toHaveLength(8);
  expect(
    evaluate(
      lesson.questions.find((q) => q.id.endsWith('-q-group-total'))!.rule,
      63,
    ),
  ).toBe(true);
  expect(
    evaluate(
      lesson.reviewQuestions!.find((q) => q.id.endsWith('-r-group-total'))!
        .rule,
      47,
    ),
  ).toBe(true);
  for (const q of lesson.reviewQuestions!)
    expect(q.prompt).not.toBe(
      lesson.questions.find((o) => o.knowledge === q.knowledge)!.prompt,
    );
});
