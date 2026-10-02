import type { Lesson, Question } from './types';

import { expect, it } from 'vitest';

import { sujiaoBooks, sujiaoFirstUnitReviewLesson } from '../content/sujiao';
import { sujiaoArithmeticTablesDraft } from '../content/sujiao-arithmetic-tables';
import { exportBackup, parseBackup } from './backup';
import {
  createSession,
  evaluate,
  MAX_REFLECTION_LENGTH,
  mistakes,
  statistics,
  submitResponse,
  validAnswer,
} from './engine';
import { answerLabel } from './history';
import { initialLibrary } from './storage';

const question: Question = {
  id: 'reflection-test',
  knowledge: 'reflection-test',
  prompt: '还想练什么？',
  rule: { kind: 'reflection' },
  hint: '按自己的想法说。',
  explanation: '不自动评分。',
};
const lesson: Lesson = {
  ...sujiaoArithmeticTablesDraft,
  questions: [question],
};
it('accepts bounded child-authored text without grading its meaning or conflating it with confirmation', () => {
  for (const text of [
    '还不会减法。',
    '我不想说为什么。',
    '  我想摆小棒。\n再算一次。  ',
    '<b>我的话</b>',
    '字'.repeat(MAX_REFLECTION_LENGTH),
  ]) {
    expect(validAnswer(question.rule, text)).toBe(true);
    expect(evaluate(question.rule, text)).toBeNull();
    expect(answerLabel(question, text)).toBe(text);
  }
  for (const value of [
    null,
    '',
    '   ',
    '\n\t',
    12,
    ['我的话'],
    '字'.repeat(MAX_REFLECTION_LENGTH + 1),
  ]) {
    expect(validAnswer(question.rule, value)).toBe(false);
    expect(() => evaluate(question.rule, value)).toThrow(Error);
  }
});
it('keeps drafts and every revised reflection separate from objective accuracy and physical confirmation', () => {
  const objective: Question = {
    ...question,
    id: 'objective',
    rule: { kind: 'number', value: 4 },
  };
  const manual: Question = {
    ...question,
    id: 'physical',
    rule: { kind: 'manual' },
  };
  const state = initialLibrary('反思测试');
  const session = createSession(lesson, 'draft', state.activeProfileId, {
    questions: [question, objective, manual],
  });
  session.phase = 'practice';
  const index = session.questions.findIndex(
    (q) => q.rule.kind === 'reflection',
  );
  session.responses[index]!.draft = '我还想练';
  state.sessions.push(session);
  expect(
    parseBackup(exportBackup(state)).data.sessions[0]!.responses[index]!.draft,
  ).toBe('我还想练');
  session.responses[index] = submitResponse(
    session.questions[index]!,
    session.responses[index]!,
  );
  const original = structuredClone(session.responses[index]!.submissions[0]);
  expect(
    submitResponse(session.questions[index]!, session.responses[index]!),
  ).toBe(session.responses[index]);
  session.responses[index]!.draft = '我还想练减法。';
  session.responses[index]!.readingHelp = true;
  session.responses[index] = submitResponse(
    session.questions[index]!,
    session.responses[index]!,
  );
  expect(session.responses[index]!.submissions[0]).toEqual(original);
  expect(statistics(session)).toMatchObject({
    reflections: 1,
    manual: 0,
    independent: 0,
    accuracy: null,
    firstCorrect: 0,
    finalCorrect: 0,
  });
  const objectiveIndex = session.questions.findIndex(
    (q) => q.rule.kind === 'number',
  );
  session.responses[objectiveIndex]!.draft = 4;
  session.responses[objectiveIndex] = submitResponse(
    session.questions[objectiveIndex]!,
    session.responses[objectiveIndex]!,
  );
  expect(statistics(session)).toMatchObject({
    reflections: 1,
    manual: 0,
    independent: 1,
    accuracy: 1,
    firstCorrect: 1,
  });
  expect(mistakes(session)).toHaveLength(0);
  expect(parseBackup(exportBackup(state)).data.sessions[0]).toEqual(session);
});
it('rejects corrupt rules, overlong or non-text drafts, forged correctness and empty submissions while accepting empty drafts', () => {
  const state = initialLibrary('边界');
  const session = createSession(lesson, 'draft', state.activeProfileId);
  session.phase = 'practice';
  state.sessions.push(session);
  for (const draft of ['', '   ', '我想问']) {
    session.responses[0]!.draft = draft;
    expect(
      parseBackup(exportBackup(state)).data.sessions[0]!.responses[0]!.draft,
    ).toBe(draft);
  }
  for (const draft of [1, ['a'], '字'.repeat(MAX_REFLECTION_LENGTH + 1)]) {
    session.responses[0]!.draft = draft;
    expect(() => parseBackup(exportBackup(state))).toThrow(Error);
  }
  session.responses[0]!.draft = '我想再练一次。';
  session.responses[0] = submitResponse(
    session.questions[0]!,
    session.responses[0]!,
  );
  const copy = () => JSON.parse(exportBackup(state));
  for (const correct of [true, false]) {
    const data = copy();
    data.data.sessions[0].responses[0].submissions[0].correct = correct;
    expect(() => parseBackup(JSON.stringify(data))).toThrow(Error);
  }
  for (const text of ['', '   ', '字'.repeat(MAX_REFLECTION_LENGTH + 1)]) {
    const data = copy();
    data.data.sessions[0].responses[0].submissions[0].answer = text;
    expect(() => parseBackup(JSON.stringify(data))).toThrow(Error);
  }
  const extra = copy();
  extra.data.sessions[0].questions[0].rule.accepted = ['只有这句才对'];
  expect(() => parseBackup(JSON.stringify(extra))).toThrow(Error);
});
it('offers distinct reflections in live upper lessons and lower drafts without removing legacy physical confirmation', () => {
  expect(sujiaoBooks[0]!.units.flatMap((u) => u.lessons)).toContain(
    sujiaoFirstUnitReviewLesson,
  );
  expect(sujiaoFirstUnitReviewLesson.status).toBe('available');
  expect(sujiaoFirstUnitReviewLesson.version).toBe(3);
  expect(sujiaoArithmeticTablesDraft.version).toBe(2);
  for (const [item, count] of [
    [sujiaoFirstUnitReviewLesson, 2],
    [sujiaoArithmeticTablesDraft, 3],
  ] as const) {
    const main = item.questions.filter((q) => q.rule.kind === 'reflection');
    const review = item.reviewQuestions!.filter(
      (q) => q.rule.kind === 'reflection',
    );
    expect(main).toHaveLength(count);
    expect(review).toHaveLength(count);
    main.forEach((q, i) => {
      expect(q.knowledge).toBe(review[i]!.knowledge);
      expect(q.prompt).not.toBe(review[i]!.prompt);
      expect(evaluate(q.rule, '我还想练。')).toBeNull();
    });
  }
  expect(
    sujiaoFirstUnitReviewLesson.questions.find((q) =>
      q.id.endsWith('-manual-reflect'),
    )!.rule.kind,
  ).toBe('manual');
});
