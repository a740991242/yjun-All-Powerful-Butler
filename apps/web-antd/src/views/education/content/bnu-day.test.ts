import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  bnuDayClockHands,
  clockPoint,
  isBnuDayClockVisual,
  isClockVisual,
} from '../learning/clock';
import { createSession, evaluate } from '../learning/engine';
import { required } from '../learning/required';
import { bnuUpperBook } from './bnu';
import { bnuDayRecordLesson as lesson } from './bnu-day';
const by = (suffix: string) =>
  required(
    lesson.questions.find(
      (question) => question.id === `${lesson.id}-${suffix}`,
    ),
  );
it('reads all six original times and both whole and half hand conditions', () => {
  for (const [suffix, answer, hour, minute] of [
    ['q1', 7, 7, 0],
    ['eight-half', '8时半', 8, 30],
    ['nine-half', '9时半', 9, 30],
    ['twelve', 12, 12, 0],
    ['four', 4, 4, 0],
    ['nine', 9, 9, 0],
  ] as const) {
    expect(evaluate(by(suffix).rule, answer)).toBe(true);
    expect(by(suffix).visual).toEqual({ kind: 'clock', hour, minute });
  }
  expect(evaluate(by('clock-parts').rule, [12, 6])).toBe(true);
  expect(evaluate(by('clock-parts').rule, [6, 12])).toBe(false);
  expect(() => evaluate(by('clock-parts').rule, [0, null])).toThrow(
    'educationLearning.answerRequired',
  );
  for (const [suffix, answer] of [
    ['short', '已过8，未到9'],
    ['twelve-half', '12时半'],
    ['period', '不能确定'],
    ['routine', '不能，要看自己的实际情况'],
    ['math-example', '9时'],
    ['football-example', '4时半'],
    ['unknown', '先记待核对再观察'],
    ['clarity', '补实际时段和事情'],
    ['after-nine', '刚过9时'],
  ] as const)
    expect(evaluate(by(suffix).rule, answer)).toBe(true);
  expect(evaluate(by('order').rule, ['wake', 'learn', 'play'])).toBe(true);
  expect(evaluate(by('order').rule, ['play', 'wake', 'learn'])).toBe(false);
});
it('adds a fixed observation marker without broadening the old whole/half clock contract', () => {
  expect(isBnuDayClockVisual({ kind: 'bnu-day-clock' })).toBe(true);
  for (const model of [
    null,
    [],
    { kind: 'bnu-day-clock', hour: 9 },
    { kind: 'bnu-day-clock', answer: '9时' },
    { kind: 'clock', hour: 9, minute: 5 },
  ])
    expect(isBnuDayClockVisual(model)).toBe(false);
  expect(isClockVisual({ kind: 'clock', hour: 9, minute: 5 })).toBe(false);
  expect(bnuDayClockHands()).toEqual({ hour: 272.5, minute: 30 });
  const long = clockPoint(bnuDayClockHands().minute, 82);
  const short = clockPoint(bnuDayClockHands().hour, 52);
  expect(long.x).toBeCloseTo(161);
  expect(long.y).toBeCloseTo(48.9859168897);
  expect(short.x).toBeLessThan(120);
  expect(short.y).toBeLessThan(120);
  expect(evaluate(by('after-nine').rule, '9时整')).toBe(false);
  expect(evaluate(by('after-nine').rule, '9时半')).toBe(false);
});
it('keeps six personal records and three self-assessment dimensions ungraded and physical activities separate', () => {
  expect(lesson.steps).toHaveLength(6);
  expect(lesson.questions).toHaveLength(36);
  expect(
    lesson.questions.filter(
      (q) => !['manual', 'reflection'].includes(q.rule.kind),
    ),
  ).toHaveLength(17);
  const manual = lesson.questions.filter((q) => q.rule.kind === 'manual');
  expect(manual.map((q) => q.id.split('-actual-')[1])).toEqual([
    'book-six',
    'dial',
    'record',
    'check',
    'share',
    'listen',
    'sunday',
  ]);
  for (const q of manual) expect(evaluate(q.rule, 'confirmed')).toBeNull();
  for (let i = 1; i <= 6; i++)
    expect(evaluate(by(`record-${i}`).rule, '未选')).toBeNull();
  for (const suffix of [
    'evaluate-record',
    'evaluate-time',
    'evaluate-listen',
    'preference',
    'reflection',
    'plan',
  ])
    expect(evaluate(by(suffix).rule, '尚未观察，准备下次核对。')).toBeNull();
  const day = required(bnuUpperBook.units.find((unit) => unit.id === 'day'));
  expect(day.lessons).toEqual([lesson]);
  expect(
    bnuUpperBook.units
      .flatMap((unit) => unit.lessons)
      .some((q) => q.status === 'preparing'),
  ).toBe(true);
});
it('round trips observation snapshots, own records and partial zero drafts without rewriting schema one', () => {
  const now = '2026-10-04T00:00:00.000Z';
  const session = createSession(lesson, 'bnu-math-p1-upper-2024', 'child', {
    now,
    seed: 7,
  });
  required(
    session.responses.find((q) => q.questionId.endsWith('-clock-parts')),
  ).draft = [0, null];
  required(
    session.responses.find((q) => q.questionId.endsWith('-record-1')),
  ).draft = '上午8时，实际吃早饭。';
  const data = {
    schemaVersion: 1 as const,
    profiles: [{ id: 'child', nickname: '隔离核对', createdAt: now }],
    activeProfileId: 'child',
    sessions: [session],
  };
  const encoded = exportBackup(data, now);
  expect(parseBackup(encoded).data).toEqual(JSON.parse(JSON.stringify(data)));
  expect(() =>
    parseBackup(
      encoded.replace(
        '"kind": "bnu-day-clock"',
        '"kind": "bnu-day-clock", "answer": "9时"',
      ),
    ),
  ).toThrow('educationLearning.invalidBackup');
});
it('changes all four review conditions and rejects old copied answers', () => {
  const review = required(lesson.reviewQuestions);
  expect(review).toHaveLength(4);
  const answers = [6, '10时半', 11, '不能，时段不同'];
  for (let i = 0; i < review.length; i++)
    expect(evaluate(required(review[i]).rule, required(answers[i]))).toBe(true);
  expect(evaluate(required(review[0]).rule, 7)).toBe(false);
  expect(evaluate(required(review[1]).rule, '8时半')).toBe(false);
  expect(evaluate(required(review[2]).rule, 12)).toBe(false);
});
