import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import { twentyCompleteQuestions } from './math-twenty-complete-practice';
import { twentyPracticeLessons } from './math-twenty-practice';

function calculate(text: string) {
  const m = /^(\d+)([+−])(\d+)$/.exec(text);
  if (!m) throw new Error(`Unexpected arithmetic: ${text}`);
  return m[2] === '+'
    ? Number(m[1]) + Number(m[3])
    : Number(m[1]) - Number(m[3]);
}
it('independently checks every oral value, matching candidate, comparison and missing addend', () => {
  for (const review of [false, true]) {
    const qs = twentyCompleteQuestions(review);
    expect(qs).toHaveLength(31);
    for (const q of qs) {
      if (q.id.includes('-oral-')) {
        const value = calculate(q.prompt.split('=')[0]!);
        for (let n = 0; n <= 20; n++)
          expect(evaluate(q.rule, n)).toBe(n === value);
      } else if (q.id.includes('-pair-')) {
        const expression = /为(\d+[+−]\d+)选/.exec(q.prompt)![1]!;
        const value = calculate(expression);
        const choices = q.choices!;
        expect(
          choices.filter((c) => calculate(c.label) === value),
        ).toHaveLength(1);
        for (const c of choices)
          expect(evaluate(q.rule, c.id)).toBe(calculate(c.label) === value);
      } else if (q.id.includes('-compare-')) {
        const [left, right] = q.prompt.split('，')[0]!.split(' □ ');
        const a = calculate(left!);
        const b = Number(right);
        let expected = '＝';
        if (a < b) expected = '＜';
        else if (a > b) expected = '＞';
        for (const c of q.choices!)
          expect(evaluate(q.rule, c.id)).toBe(c.id === expected);
      } else if (q.id.includes('-blank-')) {
        const m = /^(\d+)\+□=(\d+)/.exec(q.prompt)!;
        for (let n = 0; n <= 20; n++)
          expect(evaluate(q.rule, n)).toBe(Number(m[1]) + n === Number(m[2]));
      }
    }
  }
});
it('computes both stages of all twelve chains independently and keeps final zero separate from missing', () => {
  for (const review of [false, true]) {
    const chains = twentyCompleteQuestions(review).filter((q) =>
      q.id.includes('-chain-'),
    );
    expect(chains).toHaveLength(6);
    for (const q of chains) {
      const m = /^(\d+)([+−])(\d+)([+−])(\d+)/.exec(q.prompt)!;
      const first = calculate(`${m[1]}${m[2]}${m[3]}`);
      const last = calculate(`${first}${m[4]}${m[5]}`);
      expect(evaluate(q.rule, [first, last])).toBe(true);
      expect(evaluate(q.rule, [first + 1, last])).toBe(false);
      expect(evaluate(q.rule, [first, last + 1])).toBe(false);
      expect(() => evaluate(q.rule, [first, null])).toThrow(
        'educationLearning.answerRequired',
      );
    }
    expect(chains.at(-1)!.rule).toEqual({ kind: 'steps', values: [10, 0] });
  }
});
it('preserves v1 questions and restores the expanded lesson with draft, error and separate source confirmations', () => {
  const lesson = twentyPracticeLessons[2]!;
  expect(lesson.version).toBe(3);
  expect(lesson.steps).toHaveLength(9);
  expect(lesson.questions).toHaveLength(61);
  expect(lesson.reviewQuestions).toHaveLength(35);
  const state = initialLibrary('整组核对');
  const old = createSession(
    {
      ...lesson,
      version: 1,
      questions: lesson.questions.slice(0, 19),
      steps: lesson.steps.slice(0, 6),
      reviewQuestions: lesson.reviewQuestions!.slice(0, 4),
    },
    'pep-math-p1-upper-2024',
    state.activeProfileId,
    { seed: 1 },
  );
  const next = createSession(
    lesson,
    'pep-math-p1-upper-2024',
    state.activeProfileId,
    { seed: 2 },
  );
  const sources = next.questions.filter((q) =>
    q.id.includes('-actual-source-'),
  );
  expect(sources).toHaveLength(11);
  expect(sources.find((q) => q.id.endsWith('-route'))!.prompt).toContain(
    '四行五列全部二十式',
  );
  for (const q of sources) {
    expect(q.rule.kind).toBe('manual');
    const i = next.questions.indexOf(q);
    next.responses[i] = submitResponse(q, {
      ...next.responses[i]!,
      draft: 'confirmed',
    });
    expect(next.responses[i]!.submissions[0]!.correct).toBeNull();
  }
  const index = next.questions.findIndex((q) =>
    q.id.endsWith('-complete-chain-5'),
  );
  next.responses[index]!.draft = [10, 1];
  next.responses[index] = submitResponse(
    next.questions[index]!,
    next.responses[index]!,
  );
  next.responses[index]!.draft = [10, 0];
  next.responses[index] = submitResponse(
    next.questions[index]!,
    next.responses[index]!,
  );
  expect(next.responses[index]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  next.responses[
    next.questions.findIndex((q) => q.id.endsWith('-complete-chain-0'))
  ]!.draft = [10, null];
  state.sessions.push(old, next);
  expect(parseBackup(exportBackup(state)).data).toEqual(state);
  expect(old.questions).toHaveLength(19);
});
