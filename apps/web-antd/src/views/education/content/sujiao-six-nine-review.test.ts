import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  countGroupsTotal,
  isCountGroupsVisual,
} from '../learning/count-groups';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { mathBooks } from './math';
import { sujiaoSixNineReviewDraft as lesson } from './sujiao-six-nine-review';

function savedSession() {
  const now = '2026-10-01T09:00:00.000Z';
  const session = createSession(lesson, 'unregistered-source-draft', 'child', {
    now,
    seed: 19,
  });
  session.phase = 'practice';
  const index = session.questions.findIndex((question) =>
    question.id.includes('-objects-'),
  );
  session.responses[index] = submitResponse(
    session.questions[index]!,
    { ...session.responses[index]!, draft: 1 },
    now,
  );
  for (const [position, question] of session.questions.entries()) {
    const draft = (() => {
      if (question.rule.kind === 'number' || question.rule.kind === 'choice')
        return question.rule.value;
      return question.rule.kind === 'steps'
        ? question.rule.values
        : 'confirmed';
    })();
    session.responses[position] = submitResponse(
      question,
      { ...session.responses[position]!, draft },
      now,
    );
  }
  return { session, index, now };
}

function backup(session: ReturnType<typeof createSession>, now: string) {
  return exportBackup(
    {
      schemaVersion: 1,
      activeProfileId: 'child',
      profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
      sessions: [session],
    },
    now,
  );
}

describe('sujiao six to nine comprehensive draft', () => {
  it('distinguishes container and object answers and checks arithmetic, patterns and linked clues', () => {
    for (const [review, tasks] of [
      lesson.questions,
      lesson.reviewQuestions!,
    ].entries()) {
      for (const question of tasks) {
        if (question.visual?.kind === 'count-groups') {
          expect(isCountGroupsVisual(question.visual)).toBe(true);
          const expected = question.id.includes('-groups-')
            ? question.visual.groups.length
            : countGroupsTotal(question.visual);
          const wrong = question.id.includes('-groups-')
            ? countGroupsTotal(question.visual)
            : question.visual.groups.length;
          expect(evaluate(question.rule, expected)).toBe(true);
          expect(evaluate(question.rule, wrong)).toBe(false);
        }
      }
      const patterns = tasks.find((question) =>
        question.id.endsWith('-pattern'),
      )!;
      expect(evaluate(patterns.rule, review ? [3, 1] : [7, 9])).toBe(true);
      expect(evaluate(patterns.rule, review ? [1, 3] : [9, 7])).toBe(false);
      const linked = tasks.find((question) => question.id.endsWith('-linked'))!;
      const red = review ? 3 : 4;
      const blue = 5;
      expect(red + red).toBe(review ? 6 : 8);
      expect(blue - red).toBe(review ? 2 : 1);
      expect(evaluate(linked.rule, [red, blue])).toBe(true);
      expect(evaluate(linked.rule, [blue, red])).toBe(false);
      const expected = review ? ['<', '>', '='] : ['>', '<', '='];
      for (const [index, question] of tasks
        .filter((q) => q.id.includes('-compare-'))
        .entries())
        expect(evaluate(question.rule, expected[index]!)).toBe(true);
      expect(
        evaluate(
          tasks.find((q) => q.id.endsWith('-knots'))!.rule,
          review ? 3 : 2,
        ),
      ).toBe(true);
    }
  });
  it('changes every review context, preserves knowledge and does not claim a registered book', () => {
    expect(lesson.status).toBe('preparing');
    expect(
      mathBooks.flatMap((book) =>
        book.units.flatMap((unit) => unit.lessons.map((item) => item.id)),
      ),
    ).not.toContain(lesson.id);
    const main = lesson.questions.filter((q) => q.rule.kind !== 'manual');
    expect(main).toHaveLength(11);
    expect(lesson.reviewQuestions).toHaveLength(11);
    for (const [index, q] of main.entries()) {
      const review = lesson.reviewQuestions![index]!;
      expect(review.knowledge).toBe(q.knowledge);
      expect(
        JSON.stringify({ prompt: review.prompt, visual: review.visual }),
      ).not.toBe(JSON.stringify({ prompt: q.prompt, visual: q.visual }));
    }
  });
  it('retains first mistakes, original groups and manual evidence in backups and rejects corrupt group diagrams', () => {
    const { session, index, now } = savedSession();
    expect(statistics(session).manual).toBe(3);
    expect(session.responses[index]!.submissions.map((s) => s.correct)).toEqual(
      [false, true],
    );
    expect(parseBackup(backup(session, now)).data.sessions[0]).toEqual(session);
    const corrupt = structuredClone(session);
    corrupt.questions[index]!.visual = { kind: 'count-groups', groups: [6, 5] };
    expect(() => parseBackup(backup(corrupt, now))).toThrow(Error);
    const extraRule = JSON.parse(backup(session, now));
    extraRule.data.sessions[0].questions[index].rule = {
      kind: 'count-groups',
      groups: [3, 3],
    };
    expect(() => parseBackup(JSON.stringify(extraRule))).toThrow(Error);
  });
});
