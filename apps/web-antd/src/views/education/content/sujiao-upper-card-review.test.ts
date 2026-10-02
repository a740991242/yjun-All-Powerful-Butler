import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { sujiaoFirstUnitReviewLesson } from './sujiao';
import { sujiaoUpperCardReviewLesson as lesson } from './sujiao-upper-card-review';

describe('complete positive arithmetic cards and separate unit reflections', () => {
  it('covers exactly every legal card once, ordered outputs, result groups and every positive pair', () => {
    const add: string[] = [];
    const sub: string[] = [];
    for (let a = 1; a <= 5; a++)
      for (let b = 1; b <= 5; b++) {
        if (a + b <= 5) add.push(`${a}＋${b}`);
        if (a > b) sub.push(`${a}－${b}`);
      }
    expect(add).toHaveLength(10);
    expect(sub).toHaveLength(10);
    expect(lesson.questions).toHaveLength(17);
    expect(lesson.reviewQuestions).toHaveLength(9);
    for (const tasks of [lesson.questions, lesson.reviewQuestions!]) {
      for (const [key, operator, full] of [
        ['all-add-cards', '＋', add],
        ['all-subtract-cards', '－', sub],
      ] as const) {
        const q = tasks.find((q) => q.knowledge.endsWith(`-${key}`))!;
        const cards = q.prompt.match(
          new RegExp(`[1-5]${operator}[1-5]`, 'gu'),
        )!;
        expect(cards).toHaveLength(10);
        expect(cards.toSorted()).toEqual(full.toSorted());
        expect(new Set(cards).size).toBe(10);
        const results = cards.map((card) => {
          const [a, b] = card.split(operator).map(Number);
          return operator === '＋' ? a! + b! : a! - b!;
        });
        expect(evaluate(q.rule, results)).toBe(true);
        expect(
          evaluate(
            q.rule,
            results.map((n) => n + 1),
          ),
        ).toBe(false);
      }
      for (const q of tasks) {
        if (q.rule.kind === 'choice')
          expect(q.choices!.filter((c) => evaluate(q.rule, c.id))).toHaveLength(
            1,
          );
        if (q.rule.kind === 'set') {
          expect(evaluate(q.rule, q.rule.values)).toBe(true);
          expect(evaluate(q.rule, q.rule.values.slice(1))).toBe(false);
          const zero = q.choices!.find((c) => c.id.startsWith('0+'))!.id;
          expect(evaluate(q.rule, [...q.rule.values, zero])).toBe(false);
        }
      }
    }
    expect(
      lesson.questions.find((q) => q.knowledge.endsWith('-add-result-groups'))!
        .rule,
    ).toEqual({ kind: 'steps', values: [4, 1, 3, 2] });
    expect(
      lesson.questions.find((q) =>
        q.knowledge.endsWith('-subtract-result-groups'),
      )!.rule,
    ).toEqual({ kind: 'steps', values: [1, 4, 2, 3] });
    expect(
      lesson.questions.find((q) =>
        q.knowledge.endsWith('-one-picture-four-equations'),
      )!.rule,
    ).toEqual({ kind: 'steps', values: [5, 5, 3, 2] });
    expect(
      lesson.reviewQuestions!.find((q) =>
        q.knowledge.endsWith('-one-picture-four-equations'),
      )!.rule,
    ).toEqual({ kind: 'steps', values: [4, 4, 3, 1] });
    expect(
      lesson.questions.filter((q) => q.rule.kind === 'manual'),
    ).toHaveLength(5);
    expect(
      lesson.questions.filter((q) => q.rule.kind === 'reflection'),
    ).toHaveLength(3);
    for (const q of lesson.reviewQuestions!)
      expect(q.prompt).not.toBe(
        lesson.questions.find((m) => m.knowledge === q.knowledge)!.prompt,
      );
  });

  it('preserves ten-field drafts, first errors, null reflections and the old unit-review snapshot', () => {
    const now = '2026-10-02T08:00:00.000Z';
    const session = createSession(
      lesson,
      'sujiao-math-p1-upper-2024',
      'child',
      { now, seed: 41 },
    );
    const old = createSession(
      sujiaoFirstUnitReviewLesson,
      'sujiao-math-p1-upper-2024',
      'child',
      { now, seed: 42 },
    );
    const oldSnapshot = JSON.stringify(old);
    session.phase = 'practice';
    const index = session.questions.findIndex((q) =>
      q.knowledge.endsWith('-all-add-cards'),
    );
    session.responses[index]!.draft = [
      5,
      2,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      3,
    ];
    const data = {
      schemaVersion: 1 as const,
      activeProfileId: 'child',
      profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
      sessions: [session, old],
    };
    expect(
      parseBackup(exportBackup(data, now)).data.sessions[0]!.responses[index]!
        .draft,
    ).toEqual(session.responses[index]!.draft);
    session.responses[index] = submitResponse(
      session.questions[index]!,
      {
        ...session.responses[index]!,
        draft: Array.from({ length: 10 }, () => 2),
      },
      now,
    );
    for (const [i, q] of session.questions.entries()) {
      if (q.rule.kind === 'manual' || q.rule.kind === 'reflection') continue;
      const answer = (() => {
        if (q.rule.kind === 'steps' || q.rule.kind === 'set')
          return q.rule.values;
        if (q.rule.kind === 'choice') return q.rule.value;
        throw new Error('Unexpected objective rule');
      })();
      session.responses[i] = submitResponse(
        q,
        { ...session.responses[i]!, draft: answer },
        now,
      );
    }
    expect(statistics(session).manual).toBe(0);
    expect(statistics(session).reflections).toBe(0);
    expect(statistics(session).finalCorrect).toBe(9);
    for (const [i, q] of session.questions.entries())
      if (q.rule.kind === 'manual' || q.rule.kind === 'reflection') {
        const answer =
          q.rule.kind === 'manual'
            ? 'confirmed'
            : '这是原话自评：实际做过的单独说明，下次计划不是已经做过。';
        session.responses[i] = submitResponse(
          q,
          { ...session.responses[i]!, draft: answer },
          now,
        );
        expect(session.responses[i]!.submissions[0]!.correct).toBeNull();
      }
    expect(session.responses[index]!.submissions.map((s) => s.correct)).toEqual(
      [false, true],
    );
    expect(statistics(session).manual).toBe(5);
    expect(statistics(session).reflections).toBe(3);
    const restored = parseBackup(exportBackup(data, now)).data.sessions;
    expect(restored[0]).toEqual(session);
    expect(JSON.stringify(restored[1])).toBe(oldSnapshot);
    expect(old.lessonVersion).toBe(3);
  });
});
