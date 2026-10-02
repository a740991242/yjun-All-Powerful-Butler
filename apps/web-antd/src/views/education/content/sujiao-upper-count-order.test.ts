import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { isQueueVisual, queuePosition } from '../learning/queue';
import { mathBooks } from './math';
import {
  sujiaoFourFiveDraft,
  sujiaoOrdinalDraft,
  sujiaoUpperCountOrderDrafts,
} from './sujiao-upper-count-order';

describe('sujiao count and order drafts', () => {
  it('covers 4/5 and two queue directions, while keeping drafts out of live books', () => {
    const liveIds = mathBooks.flatMap((book) =>
      book.units.flatMap((unit) => unit.lessons.map((lesson) => lesson.id)),
    );
    for (const lesson of sujiaoUpperCountOrderDrafts) {
      expect(lesson.status).toBe('preparing');
      expect(liveIds).not.toContain(lesson.id);
      const questions = [...lesson.questions, ...lesson.reviewQuestions!];
      expect(new Set(questions.map((q) => q.id)).size).toBe(questions.length);
      for (const q of questions) {
        if (q.rule.kind === 'choice')
          expect(
            q.choices!.filter((option) => evaluate(q.rule, option.id)),
          ).toHaveLength(1);
        if (q.visual?.kind === 'queue')
          expect(isQueueVisual(q.visual)).toBe(true);
      }
    }
    const count = sujiaoFourFiveDraft.questions.filter(
      (q) => q.visual?.kind === 'count',
    );
    for (const q of count) {
      if (q.visual?.kind !== 'count') continue;
      expect([4, 5]).toContain(q.visual.count);
      expect(
        evaluate(
          q.rule,
          q.rule.kind === 'choice' ? String(q.visual.count) : q.visual.count,
        ),
      ).toBe(true);
    }
    const main = sujiaoOrdinalDraft.questions.find(
      (q) => q.visual?.kind === 'queue',
    )!.visual!;
    const review = sujiaoOrdinalDraft.reviewQuestions!.find(
      (q) => q.visual?.kind === 'queue',
    )!.visual!;
    if (main.kind !== 'queue' || review.kind !== 'queue')
      throw new Error('Expected queues');
    expect(main.front).toBe('left');
    expect(review.front).toBe('right');
    expect(review.labels).not.toEqual(main.labels);
    expect(queuePosition(main, main.labels[0]!)).toBe(1);
    expect(queuePosition(review, review.labels.at(-1)!)).toBe(1);
  });
  it('preserves first errors and manual work, roundtrips queue diagrams, and rejects corrupt backups', () => {
    const now = '2026-09-30T03:00:00.000Z';
    for (const lesson of sujiaoUpperCountOrderDrafts) {
      const session = createSession(
        lesson,
        'unregistered-source-draft',
        'child',
        { now, seed: 7 },
      );
      session.phase = 'practice';
      const index = session.questions.findIndex(
        (q) => q.rule.kind === 'number',
      );
      const first = session.questions[index]!;
      session.responses[index] = submitResponse(
        first,
        { ...session.responses[index]!, draft: -1 },
        now,
      );
      for (const [position, q] of session.questions.entries()) {
        session.responses[position] = submitResponse(
          q,
          {
            ...session.responses[position]!,
            draft: (() => {
              if (q.rule.kind === 'number') return q.rule.value;
              return q.rule.kind === 'choice' ? q.rule.value : 'confirmed';
            })(),
          },
          now,
        );
      }
      expect(statistics(session).manual).toBe(2);
      expect(
        session.responses[index]!.submissions.map(
          (submission) => submission.correct,
        ),
      ).toEqual([false, true]);
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
      if (lesson !== sujiaoOrdinalDraft) continue;
      for (const patch of [
        { front: 'up' },
        { labels: ['小禾', '小禾'] },
        { selected: 1 },
      ]) {
        const data = JSON.parse(json);
        const q = data.data.sessions[0].questions.find(
          (question: { visual?: { kind: string } }) =>
            question.visual?.kind === 'queue',
        );
        Object.assign(q.visual, patch);
        expect(() => parseBackup(JSON.stringify(data))).toThrow(Error);
      }
      const data = JSON.parse(json);
      data.data.sessions[0].questions[0].rule = {
        kind: 'queue',
        labels: ['小禾', '小乐'],
        front: 'left',
      };
      expect(() => parseBackup(JSON.stringify(data))).toThrow(Error);
    }
  });
});
