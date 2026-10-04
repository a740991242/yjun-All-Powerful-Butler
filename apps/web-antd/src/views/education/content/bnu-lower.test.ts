import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { bnuSchoolLesson, bnuUpperBook } from './bnu';
import {
  bnuLowerBook,
  bnuLowerSource,
  bnuLowerAncientCountLesson as lesson,
} from './bnu-lower';
import { bnuLowerBlocksLesson } from './bnu-lower-blocks';
import { bnuLowerPlaceValueLesson } from './bnu-lower-place-value';
import { editionTarget } from './edition-targets';
import { findTextbook } from './textbooks';

it('uses the actual 2024-approved lower contents with distinct book identity and honest remaining scope', () => {
  expect(bnuLowerBook.units.map(({ title, page }) => [title, page])).toEqual([
    ['20以内数与加法', 2],
    ['图形大变身（一）', 18],
    ['设计教室装饰图', 24],
    ['20以内数与减法', 27],
    ['100以内数的认识', 44],
    ['填数游戏', 60],
    ['100以内数加与减（一）', 62],
    ['有趣的平面图形（一）', 76],
    ['画数学连环画', 87],
    ['总复习', 90],
  ]);
  expect(findTextbook('math', 'bnu-2024', 'lower')?.id).toBe(
    'bnu-math-p1-lower-2024',
  );
  expect(bnuLowerBook.id).not.toBe(bnuUpperBook.id);
  expect(editionTarget('math', 'bnu-2024', 'lower')?.status).toBe('available');
  expect(editionTarget('english', 'bnu-2024', 'lower')).toBeUndefined();
  expect(bnuLowerSource.isbn).toBeNull();
  expect(bnuLowerSource.printing).toBeNull();
  expect(lesson.page).toBe(2);
  const all = bnuLowerBook.units.flatMap(({ lessons }) => lessons);
  expect(all.filter(({ status }) => status === 'available')).toEqual([
    lesson,
    bnuLowerPlaceValueLesson,
    bnuLowerBlocksLesson,
  ]);
  expect(all.filter(({ status }) => status === 'preparing')).toHaveLength(10);
  expect(
    all
      .filter(({ status }) => status === 'preparing')
      .every(
        ({ questions, steps }) => questions.length === 0 && steps.length === 0,
      ),
  ).toBe(true);
});

it('checks every authored numerical and choice answer independently, excluding unknown symbol meanings', () => {
  const q = (suffix: string) =>
    required(lesson.questions.find(({ id }) => id.endsWith(`-${suffix}`)));
  for (const [suffix, answer] of [
    ['one-to-one', 11],
    ['bundle', 10],
    ['eleven', 11],
    ['nineteen', 19],
    ['twenty', 20],
    ['zero-ones', 0],
    ['symbol-twelve', 12],
    ['symbol-fifteen', 15],
    ['unknown-symbol', '不能，需要先给出约定'],
    ['bundle-unit', '11根'],
    ['story', 11],
  ] as const)
    expect(evaluate(q(suffix).rule, answer)).toBe(true);
  expect(evaluate(q('bundle-unit').rule, '2根')).toBe(false);
  expect(evaluate(q('unknown-symbol').rule, '能，大石头一定代表10')).toBe(
    false,
  );
  expect(evaluate(q('symbol-fifteen').rule, 6)).toBe(false);
  expect(evaluate(q('twenty').rule, 2)).toBe(false);
  expect(() => evaluate(q('zero-ones').rule, null)).toThrow(
    'educationLearning.answerRequired',
  );
  const reviews = required(lesson.reviewQuestions);
  const answers = [14, 18, 0, '17根'] as const;
  reviews.forEach((review, index) => {
    expect(evaluate(review.rule, required(answers[index]))).toBe(true);
    expect(
      lesson.questions.some(
        ({ id, prompt }) => id === review.id || prompt === review.prompt,
      ),
    ).toBe(false);
  });
});

it('does not grade physical work, self-report or future plans as objective mastery', () => {
  const manuals = lesson.questions.filter(({ rule }) => rule.kind === 'manual');
  expect(manuals).toHaveLength(11);
  manuals.forEach(({ rule }) => expect(evaluate(rule, 'confirmed')).toBeNull());
  const reflections = lesson.questions.filter(
    ({ rule }) => rule.kind === 'reflection',
  );
  expect(reflections).toHaveLength(2);
  reflections.forEach(({ rule }) =>
    expect(evaluate(rule, '未做，下次再试')).toBeNull(),
  );
});

it('round-trips lower drafts and retries alongside an unchanged historical upper snapshot in schema 1', () => {
  const now = '2026-10-04T00:00:00.000Z';
  const old = createSession(bnuSchoolLesson, bnuUpperBook.id, 'child', {
    seed: 3,
    now,
  });
  const oldSnapshot = JSON.parse(JSON.stringify(old));
  const session = createSession(lesson, bnuLowerBook.id, 'child', {
    seed: 7,
    now,
  });
  const index = session.questions.findIndex(({ id }) =>
    id.endsWith('-symbol-twelve'),
  );
  const item = required(session.questions[index]);
  let response = required(session.responses[index]);
  response.draft = 3;
  response = submitResponse(item, response, now);
  response.draft = 12;
  session.responses[index] = submitResponse(item, response, now);
  expect(
    required(session.responses[index]).submissions.map(
      ({ correct }) => correct,
    ),
  ).toEqual([false, true]);
  required(
    session.responses.find(({ questionId }) =>
      questionId.endsWith('-zero-ones'),
    ),
  ).draft = 0;
  const data = {
    schemaVersion: 1 as const,
    profiles: [{ id: 'child', nickname: '测试', createdAt: now }],
    activeProfileId: 'child',
    sessions: [old, session],
  };
  const restored = parseBackup(exportBackup(data, now)).data;
  expect(restored).toEqual(JSON.parse(JSON.stringify(data)));
  expect(restored.sessions[0]).toEqual(oldSnapshot);
  expect(restored.sessions[1]?.bookId).toBe('bnu-math-p1-lower-2024');
});
