import type { Answer } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { motionScene } from '../learning/motion-frames';
import { initialLibrary } from '../learning/storage';
import { sujiaoMotionOrderDraft as lesson } from './sujiao-motion-order';
it('checks chronology against independently sorted frame positions and reverses approach/depart distance reasoning', () => {
  const main: Answer[] = [
    'BAC',
    'B',
    'C',
    'BCA',
    'BCA',
    'A',
    'no',
    'no',
    'no',
    1,
  ];
  const review: Answer[] = [
    'BCA',
    'B',
    'A',
    'ACB',
    'CBA',
    'A',
    'no',
    'no',
    'no',
    1,
  ];
  expect(lesson.questions).toHaveLength(15);
  expect(lesson.reviewQuestions).toHaveLength(10);
  for (const [qs, answers] of [
    [lesson.questions.slice(0, 10), main],
    [lesson.reviewQuestions!, review],
  ] as const) {
    qs.forEach((q, i) => expect(evaluate(q.rule, answers[i]!)).toBe(true));
    for (const i of [0, 3, 4]) {
      const v = qs[i]!.visual;
      if (v?.kind !== 'motion-frames') throw new Error('missing frames');
      const s = motionScene(v);
      const points = s.positions.map((x, index) => ({
        x,
        label: 'ABC'[index],
      }));
      const chronological = points.toSorted((a, b) =>
        s.direction === 'right' ? a.x - b.x : b.x - a.x,
      );
      expect(
        evaluate(qs[i]!.rule, chronological.map((p) => p.label).join('')),
      ).toBe(true);
      const distances = chronological.map((p) => Math.abs(p.x - s.landmark));
      if (v.scene === 'approach')
        expect(
          distances[0]! > distances[1]! && distances[1]! > distances[2]!,
        ).toBe(true);
      if (v.scene === 'depart')
        expect(
          distances[0]! < distances[1]! && distances[1]! < distances[2]!,
        ).toBe(true);
      if (v.scene === 'pass') {
        expect(distances[1]).toBeLessThan(distances[0]!);
        expect(distances[1]).toBeLessThan(distances[2]!);
      }
    }
  }
  lesson.reviewQuestions!.forEach((q, i) => {
    expect(q.knowledge).toBe(lesson.questions[i]!.knowledge);
    expect(q.prompt).not.toBe(lesson.questions[i]!.prompt);
  });
  expect(evaluate(lesson.reviewQuestions![0]!.rule, 'BAC')).toBe(false);
  expect(evaluate(lesson.questions[3]!.rule, 'ACB')).toBe(false);
  for (const i of [6, 7, 8])
    expect(evaluate(lesson.questions[i]!.rule, 'yes')).toBe(false);
  expect(evaluate(lesson.questions[9]!.rule, 3)).toBe(false);
});
it('preserves a mistaken sequence, correction and distinct unscored physical observations through backup', () => {
  const data = initialLibrary('运动过程');
  const s = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    data.activeProfileId,
  );
  data.sessions.push(s);
  const i = s.questions.findIndex((q) => q.id.endsWith('-q-depart-order'));
  for (const value of ['ACB', 'BCA']) {
    s.responses[i]!.draft = value;
    s.responses[i] = submitResponse(s.questions[i]!, s.responses[i]!);
  }
  expect(s.responses[i]!.submissions.map((a) => a.correct)).toEqual([
    false,
    true,
  ]);
  for (const suffix of ['-own-order', '-reflection']) {
    const j = s.questions.findIndex((q) => q.id.endsWith(suffix));
    s.responses[j]!.draft =
      suffix === '-own-order'
        ? '实际向左，先卡3再卡1后卡2，P固定。'
        : '先看方向，再看P哪侧。';
    s.responses[j] = submitResponse(s.questions[j]!, s.responses[j]!);
    expect(s.responses[j]!.submissions[0]!.correct).toBeNull();
  }
  expect(
    s.responses
      .filter((_, j) => s.questions[j]!.rule.kind === 'manual')
      .every((response) => response.submissions.length === 0),
  ).toBe(true);
  expect(parseBackup(exportBackup(data)).data.sessions[0]).toEqual(s);
});
