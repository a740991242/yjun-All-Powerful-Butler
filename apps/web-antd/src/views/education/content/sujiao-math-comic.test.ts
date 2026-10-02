import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { isMathStoryVisual, mathStoryFacts } from '../learning/math-story';
import { initialLibrary } from '../learning/storage';
import { sujiaoMathComicDraft as lesson } from './sujiao-math-comic';
it('distinguishes shelf identifiers, intermediate quantities and returned borrowed books', () => {
  for (const [questions, values] of [
    [lesson.questions, [24, 16, 19, 5]],
    [lesson.reviewQuestions!, [35, 28, 33, 2]],
  ] as const) {
    for (const [index, key] of [
      'initial',
      'after-borrow',
      'after-return',
      'on-loan',
    ].entries()) {
      const q = questions.find((item) => item.id.endsWith(`-${key}`))!;
      expect(evaluate(q.rule, values[index]!)).toBe(true);
      expect(evaluate(q.rule, values[index]! + 1)).toBe(false);
    }
    const relevant = questions.find((q) => q.id.endsWith('-relevant'))!;
    expect(evaluate(relevant.rule, ['initial', 'borrowed', 'returned'])).toBe(
      true,
    );
    expect(evaluate(relevant.rule, ['initial', 'borrowed'])).toBe(false);
    expect(
      evaluate(relevant.rule, ['initial', 'borrowed', 'returned', 'shelf']),
    ).toBe(false);
    const unknown = questions.find((q) => q.id.endsWith('-unknown'))!;
    expect(unknown.visual).toBeUndefined();
    expect(evaluate(unknown.rule, 'zero')).toBe(false);
    expect(evaluate(unknown.rule, 'ask')).toBe(true);
  }
  const main = mathStoryFacts('main');
  const review = mathStoryFacts('review');
  expect(main).toEqual({ shelf: 12, initial: 24, borrowed: 8, returned: 3 });
  expect(review).toEqual({ shelf: 21, initial: 35, borrowed: 7, returned: 5 });
  expect(
    main.initial -
      main.borrowed +
      main.returned +
      main.borrowed -
      main.returned,
  ).toBe(main.initial);
  expect(lesson.steps).toHaveLength(5);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    5,
  );
  expect(
    lesson.questions.filter((q) => q.rule.kind === 'reflection'),
  ).toHaveLength(2);
});
it('retains a wrong intermediate answer and reflections without confirming paper creation', () => {
  const library = initialLibrary('连环画');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const index = session.questions.findIndex((q) =>
    q.id.endsWith('-after-return'),
  );
  for (const answer of [16, 19]) {
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
  for (const [i, q] of session.questions.entries())
    if (q.rule.kind === 'reflection') {
      session.responses[i]!.draft = '原创整理故事，纸面作品和分享还待做。';
      session.responses[i] = submitResponse(q, session.responses[i]!);
      expect(session.responses[i]!.submissions[0]!.correct).toBeNull();
    }
  expect(
    session.responses
      .filter((_, i) => session.questions[i]!.rule.kind === 'manual')
      .every((r) => r.submissions.length === 0),
  ).toBe(true);
  library.sessions.push(session);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(session);
});
it('rejects forged answers and arbitrary comic variants in imported snapshots', () => {
  expect(isMathStoryVisual({ kind: 'math-story', variant: 'main' })).toBe(true);
  expect(isMathStoryVisual({ kind: 'math-story', variant: 'review' })).toBe(
    true,
  );
  for (const value of [
    null,
    [],
    { kind: ['math-story'], variant: 'main' },
    { kind: 'math-story', variant: ['main'] },
    { kind: 'math-story', variant: 'other' },
    { kind: 'math-story', variant: 'main', final: 19 },
  ])
    expect(isMathStoryVisual(value)).toBe(false);
  const library = initialLibrary('连环画备份');
  library.sessions.push(
    createSession(
      lesson,
      'sujiao-math-p1-lower-9787574312951',
      library.activeProfileId,
    ),
  );
  const backup = JSON.parse(exportBackup(library));
  const index = library.sessions[0]!.questions.findIndex(
    (q) => q.visual?.kind === 'math-story',
  );
  expect(index).toBeGreaterThanOrEqual(0);
  const q = backup.data.sessions[0].questions[index];
  q.visual.final = 19;
  expect(() => parseBackup(JSON.stringify(backup))).toThrow(Error);
  delete q.visual.final;
  q.rule = q.visual;
  expect(() => parseBackup(JSON.stringify(backup))).toThrow(Error);
});
