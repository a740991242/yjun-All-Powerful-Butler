import { expect, it } from 'vitest';

import { sujiaoNumberFramesDraft as lesson } from '../content/sujiao-number-frames';
import { exportBackup, parseBackup } from './backup';
import { createSession, evaluate, submitResponse, validAnswer } from './engine';
import { isNumberFrameVisual, numberFrameCells } from './number-frame';
import { initialLibrary } from './storage';
it('rejects wrapping/out-of-chart frames and preserves one known cell with ordered blank letters', () => {
  expect(
    isNumberFrameVisual({
      kind: 'number-frame',
      layout: 'square',
      anchor: 0,
      known: 0,
    }),
  ).toBe(true);
  expect(
    isNumberFrameVisual({
      kind: 'number-frame',
      layout: 'cross',
      anchor: 88,
      known: 4,
    }),
  ).toBe(true);
  for (const data of [
    { kind: 'number-frame', layout: 'square', anchor: 9, known: 0 },
    { kind: 'number-frame', layout: 'square', anchor: 90, known: 0 },
    { kind: 'number-frame', layout: 'square', anchor: 88, known: 4 },
    { kind: 'number-frame', layout: 'cross', anchor: 10, known: 0 },
    { kind: 'number-frame', layout: 'cross', anchor: 99, known: 0 },
    { kind: 'number-frame', layout: ['cross'], anchor: 44, known: 0 },
    { kind: 'number-frame', layout: 'cross', anchor: 44, known: 5 },
    { kind: 'number-frame', layout: 'cross', anchor: 44.5, known: 0 },
    { kind: 'number-frame', layout: 'square', anchor: 0, known: 0, answer: 1 },
  ])
    expect(isNumberFrameVisual(data)).toBe(false);
  const cells = numberFrameCells({
    kind: 'number-frame',
    layout: 'cross',
    anchor: 43,
    known: 4,
  });
  expect(cells.map((c) => [c.x, c.y, c.value, c.letter])).toEqual([
    [1, 0, 33, 'A'],
    [0, 1, 42, 'B'],
    [1, 1, 43, 'C'],
    [2, 1, 44, 'D'],
    [1, 2, 53, null],
  ]);
});
it('checks all four square and five cross given positions and changed review values independently', () => {
  expect(lesson.questions).toHaveLength(15);
  expect(lesson.reviewQuestions).toHaveLength(11);
  const main = [
    [1, 10, 11],
    [27, 37, 38],
    [80, 81, 91],
    [88, 89, 98],
    [21, 22, 23, 32],
    [33, 43, 44, 53],
    [45, 54, 56, 65],
    [61, 70, 71, 81],
    [78, 87, 88, 89],
  ];
  const review = [
    [11, 20, 21],
    [36, 46, 47],
    [70, 71, 81],
    [77, 78, 87],
    [32, 33, 34, 43],
    [44, 54, 55, 64],
    [56, 65, 67, 76],
    [52, 61, 62, 72],
    [67, 76, 77, 78],
  ];
  for (let index = 0; index < 9; index++) {
    const q = lesson.questions.find((q) => q.id.endsWith(`-q-fill-${index}`))!;
    const r = lesson.reviewQuestions!.find((q) =>
      q.id.endsWith(`-r-fill-${index}`),
    )!;
    expect(q.rule).toEqual({ kind: 'steps', values: main[index] });
    expect(r.rule).toEqual({ kind: 'steps', values: review[index] });
    for (const [question, expected] of [
      [q, main[index]!],
      [r, review[index]!],
    ] as const) {
      expect(evaluate(question.rule, expected)).toBe(true);
      expect(validAnswer(question.rule, null)).toBe(false);
      for (let field = 0; field < expected.length; field++) {
        const partial: (null | number)[] = [...expected];
        partial[field] = null;
        expect(validAnswer(question.rule, partial)).toBe(false);
        // Literal chart answers above are independent of the frame renderer.
        // Check every supported value in each blank, including a real zero.
        for (let value = 0; value <= 99; value++) {
          const candidate = [...expected];
          candidate[field] = value;
          expect(evaluate(question.rule, candidate)).toBe(
            value === expected[field],
          );
        }
      }
    }
  }
  for (const [questions, marker] of [
    [lesson.questions, 'q'],
    [lesson.reviewQuestions!, 'r'],
  ] as const)
    expect(
      questions
        .filter((q) => q.rule.kind === 'steps')
        .map((q) => q.id.slice(q.id.lastIndexOf(`-${marker}-`))),
    ).toEqual(
      Array.from({ length: 9 }, (_, index) => `-${marker}-fill-${index}`),
    );
  for (const q of lesson.reviewQuestions!) {
    const old = lesson.questions.find((o) => o.knowledge === q.knowledge)!;
    expect(JSON.stringify([q.prompt, q.visual, q.choices])).not.toBe(
      JSON.stringify([old.prompt, old.visual, old.choices]),
    );
  }
});
it('round-trips hidden frame models, partial drafts and wrong-direction correction without auto confirming activities', () => {
  const library = initialLibrary('框数');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const index = session.questions.findIndex((q) => q.id.endsWith('-q-fill-0'));
  for (const draft of [
    [1, 2, 3],
    [1, 10, 11],
  ]) {
    session.responses[index]!.draft = draft;
    session.responses[index] = submitResponse(
      session.questions[index]!,
      session.responses[index]!,
    );
  }
  expect(session.responses[index]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  const partial = session.questions.findIndex((q) =>
    q.id.endsWith('-q-fill-1'),
  );
  session.responses[partial]!.draft = [27, null, null];
  const reflection = session.questions.findIndex(
    (q) => q.rule.kind === 'reflection',
  );
  session.responses[reflection]!.draft =
    '我先认给定格的位置，再看横竖方向，纸面遮格还没做。';
  session.responses[reflection] = submitResponse(
    session.questions[reflection]!,
    session.responses[reflection]!,
  );
  expect(session.responses[reflection]!.submissions[0]!.correct).toBeNull();
  expect(
    session.responses
      .filter((_, i) => session.questions[i]!.rule.kind === 'manual')
      .every((r) => r.submissions.length === 0),
  ).toBe(true);
  library.sessions.push(session);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(session);
  const bad = JSON.parse(exportBackup(library));
  bad.data.sessions[0].questions[index].visual.anchor = 9;
  expect(() => parseBackup(JSON.stringify(bad))).toThrow(Error);
});
