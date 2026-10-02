import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { chineseBooks } from './chinese';
import { gardenOneComparison as lesson } from './chinese-garden-one';

describe('source-scoped first garden activity', () => {
  it('opens only the supported course, retains prior supplement and independent task scopes', () => {
    expect(lesson.page).toBe(15);
    expect(lesson.steps).toHaveLength(5);
    expect(lesson.questions).toHaveLength(15);
    expect(lesson.reviewQuestions).toHaveLength(12);
    const upper = chineseBooks[0]!.units.flatMap((unit) => unit.lessons);
    expect(upper).toContain(lesson);
    expect(upper.find((item) => item.id === 'cu-u1-5')!.status).toBe(
      'available',
    );
    expect(upper.find((item) => item.id === 'cu-u1-5')).not.toBe(lesson);
    expect(upper.some((item) => item.id === 'cu-u1-5-recognition')).toBe(true);
    expect(lesson.review.notes).toContain('只覆盖这一页');
    expect(
      lesson.questions.find((q) => q.id.endsWith('-write'))!.material,
    ).toBe('会写范围：六、七、八、十。');
    const tasks = [...lesson.questions, ...lesson.reviewQuestions!];
    expect(new Set(tasks.map((q) => q.id)).size).toBe(tasks.length);
    for (const q of tasks) {
      if (q.rule.kind !== 'choice') continue;
      expect(q.choices!.filter((c) => evaluate(q.rule, c.id))).toHaveLength(1);
      expect(
        lesson.reviewQuestions!.some((r) => r.knowledge === q.knowledge),
      ).toBe(true);
    }
    for (let n = 0; n < 5; n++) {
      expect(lesson.questions[n]!.visual).toEqual({
        kind: 'count',
        count: n + 6,
      });
      expect(lesson.reviewQuestions![n]!.visual?.kind).toBe('characters');
      expect(lesson.reviewQuestions![n]!.rule).toEqual({
        kind: 'choice',
        value: String(n + 6),
      });
    }
    const main = lesson.questions.filter((q) => q.id.includes('-shape-'));
    const reviews = lesson.reviewQuestions!.filter((q) =>
      q.id.includes('-shape-'),
    );
    expect(
      main.map((q) => (q.rule.kind === 'choice' ? q.rule.value : '')),
    ).toEqual(['天', '田', '目']);
    expect(
      reviews.map((q) => (q.rule.kind === 'choice' ? q.rule.value : '')),
    ).toEqual(['人', '口', '日']);
  });
  it('keeps a failed first answer, separate manual work and changed same-skill review in a complete backup', () => {
    const now = '2026-09-30T03:00:00.000Z';
    const session = createSession(lesson, chineseBooks[0]!.id, 'child', {
      seed: 4,
      now,
    });
    session.phase = 'practice';
    const firstIndex = session.questions.findIndex(
      (q) => q.rule.kind === 'choice',
    );
    const first = session.questions[firstIndex]!;
    if (first.rule.kind !== 'choice')
      throw new Error('Expected objective task');
    const correctValue = first.rule.value;
    session.responses[firstIndex] = submitResponse(
      first,
      {
        ...session.responses[firstIndex]!,
        draft: first.choices!.find((c) => c.id !== correctValue)!.id,
      },
      now,
    );
    for (const [index, q] of session.questions.entries()) {
      session.responses[index] = submitResponse(
        q,
        {
          ...session.responses[index]!,
          draft: q.rule.kind === 'choice' ? q.rule.value : 'confirmed',
        },
        now,
      );
    }
    expect(statistics(session).manual).toBe(3);
    expect(
      session.responses[firstIndex]!.submissions.map((s) => s.correct),
    ).toEqual([false, true]);
    const review = newReviewQuestions(lesson, session, [session]);
    expect(
      review.some(
        (q) => q.knowledge === first.knowledge && q.prompt !== first.prompt,
      ),
    ).toBe(true);
    const json = exportBackup(
      {
        schemaVersion: 1,
        activeProfileId: 'child',
        profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
        sessions: [session],
      },
      now,
    );
    expect(parseBackup(json).data.sessions[0]).toEqual(session);
  });
  it('rejects quantity corruption without losing the original snapshot', () => {
    const now = '2026-09-30T03:00:00.000Z';
    const session = createSession(lesson, chineseBooks[0]!.id, 'child', {
      now,
    });
    const json = exportBackup(
      {
        schemaVersion: 1,
        activeProfileId: 'child',
        profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
        sessions: [session],
      },
      now,
    );
    const parsed = JSON.parse(json);
    const q = parsed.data.sessions[0].questions.find(
      (item: { visual?: { kind: string } }) => item.visual?.kind === 'count',
    );
    q.visual.count = -1;
    expect(() => parseBackup(JSON.stringify(parsed))).toThrow(Error);
    expect(parseBackup(json).data.sessions[0]).toEqual(session);
  });
});
