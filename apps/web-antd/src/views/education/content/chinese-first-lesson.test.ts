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
import { firstChineseLesson as lesson } from './chinese-first-lesson';
import { firstLessonTeachingSource as source } from './chinese-source-audit';

describe('source-scoped first Chinese lesson', () => {
  it('opens only the supported course, retains prior supplement and independent task scopes', () => {
    expect(source.publisher).toBe('人民教育出版社');
    expect(source.textbookPublication).toBe('2024年8月');
    expect(lesson.page).toBe(source.printedPage);
    expect(lesson.steps).toHaveLength(5);
    expect(lesson.questions).toHaveLength(15);
    expect(lesson.reviewQuestions).toHaveLength(12);
    expect(chineseBooks[0]!.units.flatMap((unit) => unit.lessons)).toContain(
      lesson,
    );
    expect(
      chineseBooks[0]!.units
        .flatMap((unit) => unit.lessons)
        .some((item) => item.id === 'cu-u1-1-recognition'),
    ).toBe(true);
    const tasks = [...lesson.questions, ...lesson.reviewQuestions!];
    expect(new Set(tasks.map((q) => q.id)).size).toBe(tasks.length);
    for (const q of tasks) {
      if (q.rule.kind !== 'choice') continue;
      expect(q.choices!.filter((c) => evaluate(q.rule, c.id))).toHaveLength(1);
      expect(
        lesson.reviewQuestions!.some((r) => r.knowledge === q.knowledge),
      ).toBe(true);
    }
    const scenes = lesson.questions.filter(
      (q) => q.visual?.kind === 'nature-scene' && q.rule.kind === 'choice',
    );
    expect(
      scenes.map((q) => (q.rule.kind === 'choice' ? q.rule.value : '')),
    ).toEqual(['1', '2', '3']);
    expect(
      lesson
        .reviewQuestions!.filter((q) => q.visual?.kind === 'nature-scene')
        .map((q) => (q.rule.kind === 'choice' ? q.rule.value : '')),
    ).toEqual(['2', '3', '1']);
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
  it('rejects unsupported scene variants and extraneous diagram fields without accepting corrupted history', () => {
    const now = '2026-09-30T03:00:00.000Z';
    const session = createSession(lesson, chineseBooks[0]!.id, 'child', {
      now,
    });
    const data = {
      schemaVersion: 1 as const,
      activeProfileId: 'child',
      profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
      sessions: [session],
    };
    const parsed = JSON.parse(exportBackup(data, now));
    const q = parsed.data.sessions[0].questions.find(
      (item: { visual?: { kind: string } }) =>
        item.visual?.kind === 'nature-scene',
    );
    q.visual.variant = 'ocean';
    expect(() => parseBackup(JSON.stringify(parsed))).toThrow(Error);
    q.visual.variant = 'hill';
    q.visual.value = 99;
    expect(() => parseBackup(JSON.stringify(parsed))).toThrow(Error);
  });
});
