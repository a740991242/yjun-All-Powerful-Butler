import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { exchangePlaceValue, placeValue } from '../learning/place-value';
import { mathBooks } from './math';
import { sujiaoTeensRecognitionDraft as lesson } from './sujiao-teens';

describe('sujiao recognition of eleven through nineteen', () => {
  it('covers every teen quantity and preserves digit meaning when unbundling', () => {
    for (const tasks of [lesson.questions, lesson.reviewQuestions!]) {
      const quantities = tasks.filter((q) => /-quantity-\d+$/.test(q.id));
      expect(quantities).toHaveLength(9);
      expect(
        quantities
          .map((q) => (q.rule.kind === 'number' ? q.rule.value : -1))
          .toSorted((a, b) => a - b),
      ).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19]);
      for (const q of quantities) {
        if (q.rule.kind !== 'number' || q.visual?.kind !== 'place-value')
          throw new Error('Expected number and sticks');
        expect(q.rule.value).toBe(q.visual.value);
        expect(evaluate(q.rule, q.visual.value)).toBe(true);
        expect(evaluate(q.rule, q.visual.value - 9)).toBe(false);
        expect(() => evaluate(q.rule, null)).toThrow(
          'educationLearning.answerRequired',
        );
      }
      for (const q of tasks.filter((q) => q.id.includes('-digits-'))) {
        if (q.visual?.kind !== 'place-value')
          throw new Error('Expected sticks');
        const value = q.visual.value;
        const split = exchangePlaceValue(value, undefined, 'split-ten');
        expect(placeValue(value, split)).toMatchObject({
          tens: 0,
          ones: value,
        });
        expect(evaluate(q.rule, [1, value % 10])).toBe(true);
        expect(evaluate(q.rule, [0, value])).toBe(false);
        expect(evaluate(q.rule, [value % 10, 1])).toBe(value === 11);
        expect(
          placeValue(value, exchangePlaceValue(value, split, 'bundle-ten')),
        ).toMatchObject({ tens: 1, ones: value % 10 });
      }
    }
  });
  it('requires all strict-between values, ordered cards and correct unit interpretation', () => {
    for (const tasks of [lesson.questions, lesson.reviewQuestions!]) {
      const interval = tasks.find((q) => q.id.endsWith('-between'))!;
      const [lo, hi] = interval.prompt.match(/\d+/g)!.map(Number);
      expect(evaluate(interval.rule, [String(lo! + 1), String(hi! - 1)])).toBe(
        true,
      );
      expect(
        evaluate(interval.rule, [
          String(lo!),
          String(lo! + 1),
          String(hi! - 1),
        ]),
      ).toBe(false);
      expect(evaluate(interval.rule, [String(lo! + 1)])).toBe(false);
      const order = tasks.find((q) => q.id.endsWith('-order'))!;
      const expected = Array.from({ length: 9 }, (_, i) => String(11 + i));
      expect(evaluate(order.rule, expected)).toBe(true);
      expect(evaluate(order.rule, expected.toReversed())).toBe(false);
      const single = tasks.find((q) => q.id.endsWith('-ones-total'))!;
      const total = Number(single.prompt.match(/\d+/)![0]);
      expect(evaluate(single.rule, total)).toBe(true);
      expect(evaluate(single.rule, total - 10)).toBe(false);
      const near = tasks.find((q) => q.id.endsWith('-near'))!;
      const n = Number(near.prompt.match(/\d+/)![0]);
      expect(evaluate(near.rule, n - 10 < 19 - n ? 'ten' : 'nineteen')).toBe(
        true,
      );
    }
  });
  it('compares equal tens by ones and includes equality, not just larger and smaller cases', () => {
    for (const tasks of [lesson.questions, lesson.reviewQuestions!]) {
      const signs = new Set<string>();
      for (const q of tasks.filter((q) => q.id.includes('-compare-'))) {
        const [a, b] = q.prompt.match(/\d+/g)!.slice(0, 2).map(Number);
        const expected = (() => {
          if (a! < b!) return 'less';
          return a! > b! ? 'greater' : 'equal';
        })();
        signs.add(expected);
        expect(evaluate(q.rule, expected)).toBe(true);
        expect(
          evaluate(q.rule, expected === 'equal' ? 'greater' : 'equal'),
        ).toBe(false);
      }
      expect([...signs].toSorted()).toEqual(['equal', 'greater', 'less']);
    }
    expect(lesson.version).toBe(2);
    expect(lesson.steps).toHaveLength(5);
    expect(
      lesson.questions.find((q) => q.id === 'sj-teens-manual-paper-count')?.rule
        .kind,
    ).toBe('manual');
  });
  it('retains separate draft identity, changed review contexts and first mistakes in backup', () => {
    expect(lesson.status).toBe('preparing');
    expect(
      mathBooks.flatMap((b) =>
        b.units.flatMap((u) => u.lessons.map((l) => l.id)),
      ),
    ).not.toContain(lesson.id);
    const main = lesson.questions.filter((q) => q.rule.kind !== 'manual');
    expect(main).toHaveLength(19);
    expect(lesson.reviewQuestions).toHaveLength(19);
    for (const [i, q] of main.entries()) {
      expect(lesson.reviewQuestions![i]!.knowledge).toBe(q.knowledge);
      expect(lesson.reviewQuestions![i]!.prompt).not.toBe(q.prompt);
    }
    const now = '2026-10-01T15:00:00.000Z';
    const session = createSession(
      lesson,
      'unregistered-source-draft',
      'child',
      { now, seed: 47 },
    );
    session.phase = 'practice';
    const first = session.questions.findIndex((q) =>
      q.id.endsWith('-ones-total'),
    );
    session.responses[first] = submitResponse(
      session.questions[first]!,
      { ...session.responses[first]!, draft: 5 },
      now,
    );
    for (const [i, q] of session.questions.entries()) {
      const draft = (() => {
        if (q.rule.kind === 'number' || q.rule.kind === 'choice')
          return q.rule.value;
        return q.rule.kind === 'steps' ||
          q.rule.kind === 'set' ||
          q.rule.kind === 'sequence'
          ? q.rule.values
          : 'confirmed';
      })();
      session.responses[i] = submitResponse(
        q,
        { ...session.responses[i]!, draft },
        now,
      );
    }
    expect(statistics(session).manual).toBe(4);
    expect(session.responses[first]!.submissions.map((s) => s.correct)).toEqual(
      [false, true],
    );
    const backup = exportBackup(
      {
        schemaVersion: 1,
        activeProfileId: 'child',
        profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
        sessions: [session],
      },
      now,
    );
    expect(parseBackup(backup).data.sessions[0]).toEqual(session);
  });
});
