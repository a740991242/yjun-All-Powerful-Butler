import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { fold } from '../learning/fold';
import { queuePosition } from '../learning/queue';
import { sujiaoRecognitionReviewLesson as lesson } from './sujiao-recognition-review';

describe('recognition and comparison consolidation', () => {
  it('distinguishes card quantity, printed numbers and positions with reversed review direction', () => {
    expect(
      lesson.questions.filter((q) => q.rule.kind !== 'manual'),
    ).toHaveLength(12);
    expect(lesson.reviewQuestions).toHaveLength(12);
    for (const tasks of [lesson.questions, lesson.reviewQuestions!]) {
      const total = tasks.find((q) => q.id.endsWith('-total'))!;
      const position = tasks.find((q) => q.id.endsWith('-rank'))!;
      const content = tasks.find((q) => q.id.endsWith('-content'))!;
      if (total.visual?.kind !== 'queue') throw new Error('Expected cards');
      const queue = total.visual;
      expect(evaluate(total.rule, total.visual.labels.length)).toBe(true);
      const target = position.prompt.match(/写着(\d)/)![1]!;
      expect(
        evaluate(position.rule, queuePosition(total.visual, target)!),
      ).toBe(true);
      const rank = Number(content.prompt.match(/第(\d)/)![1]);
      expect(
        content
          .choices!.filter((c) => evaluate(content.rule, c.id))
          .map((c) => c.id),
      ).toEqual([
        total.visual.labels.find(
          (label) => queuePosition(queue, label) === rank,
        ),
      ]);
      const comparisons = tasks.filter((q) => q.visual?.kind === 'count');
      expect(comparisons).toHaveLength(3);
      for (const q of comparisons) {
        if (q.visual?.kind !== 'count') throw new Error('Expected counts');
        const { count, other } = q.visual;
        expect(
          evaluate(
            q.rule,
            (() => {
              if (count === other) return '=';
              return count > other! ? '>' : '<';
            })(),
          ),
        ).toBe(true);
      }
      const order = tasks.find((q) => q.id.endsWith('-descending'))!;
      const values = order
        .choices!.map((c) => Number(c.id))
        .toSorted((a, b) => b - a)
        .map(String);
      expect(evaluate(order.rule, values)).toBe(true);
      expect(evaluate(order.rule, [...values].toReversed())).toBe(false);
      const minimum = tasks.find((q) => q.id.endsWith('-minimum'))!;
      expect(evaluate(minimum.rule, 0)).toBe(true);
      expect(() => evaluate(minimum.rule, null)).toThrow(
        'educationLearning.answerRequired',
      );
    }
    expect(lesson.questions[0]!.visual).not.toEqual(
      lesson.reviewQuestions![0]!.visual,
    );
  });

  it('compares whole bent paths and keeps first errors and real activity separate in backup', () => {
    for (const tasks of [lesson.questions, lesson.reviewQuestions!]) {
      const longest = tasks.find((q) => q.id.endsWith('-longest'))!;
      if (longest.visual?.kind !== 'grid-paths')
        throw new Error('Expected paths');
      const lengths = longest.visual.paths
        .map((path) => ({
          id: path.id,
          length: fold(
            path.points.slice(1),
            0,
            (sum, p, index) =>
              sum +
              Math.abs(p[0] - path.points[index]![0]) +
              Math.abs(p[1] - path.points[index]![1]),
          ),
        }))
        .toSorted((a, b) => a.length - b.length);
      expect(evaluate(longest.rule, lengths.at(-1)!.id)).toBe(true);
      expect(
        evaluate(
          tasks.find((q) => q.id.endsWith('-shortest'))!.rule,
          lengths[0]!.id,
        ),
      ).toBe(true);
    }
    const now = '2026-10-01T05:00:00.000Z';
    const session = createSession(
      lesson,
      'sujiao-math-p1-upper-2024',
      'child',
      { now, seed: 7 },
    );
    session.phase = 'practice';
    const index = session.questions.findIndex((q) => q.id.endsWith('-minimum'));
    const question = session.questions[index]!;
    session.responses[index] = submitResponse(
      question,
      { ...session.responses[index]!, draft: 1 },
      now,
    );
    for (const [i, q] of session.questions.entries()) {
      const answer = (() => {
        if (q.rule.kind === 'choice' || q.rule.kind === 'number')
          return q.rule.value;
        return q.rule.kind === 'sequence' ? q.rule.values : 'confirmed';
      })();
      session.responses[i] = submitResponse(
        q,
        { ...session.responses[i]!, draft: answer },
        now,
      );
    }
    expect(session.responses[index]!.submissions.map((s) => s.correct)).toEqual(
      [false, true],
    );
    expect(statistics(session).manual).toBe(4);
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
});
