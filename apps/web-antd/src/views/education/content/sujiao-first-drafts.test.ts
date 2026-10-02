import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { magicSolutions } from '../learning/magic-grid';
import { towerSolutions } from '../learning/number-tower';
import { chineseBooks } from './chinese';
import { mathBooks } from './math';
import {
  sujiaoCountingDraft,
  sujiaoFirstDrafts,
  sujiaoNineAddDraft,
} from './sujiao-first-drafts';

describe('bounded Sujiao source drafts', () => {
  it('keeps draft editions out of live PEP books and changes review diagrams within the observed range', () => {
    const live = [...mathBooks, ...chineseBooks].flatMap((book) =>
      book.units.flatMap((unit) => unit.lessons),
    );
    for (const draft of sujiaoFirstDrafts) {
      expect(draft.status).toBe('preparing');
      expect(live.some((lesson) => lesson.id === draft.id)).toBe(false);
      expect(draft.steps).toHaveLength(4);
      const tasks = [...draft.questions, ...draft.reviewQuestions!];
      expect(new Set(tasks.map((question) => question.id)).size).toBe(
        tasks.length,
      );
      for (const question of tasks) {
        if (question.rule.kind === 'choice') {
          expect(
            question.choices!.filter((option) =>
              evaluate(question.rule, option.id),
            ),
          ).toHaveLength(1);
        }
      }
      for (const question of draft.questions.filter(
        (q) => q.rule.kind !== 'manual',
      )) {
        expect(
          draft.reviewQuestions!.some(
            (review) =>
              review.knowledge === question.knowledge &&
              (review.prompt !== question.prompt ||
                JSON.stringify(review.visual) !==
                  JSON.stringify(question.visual)),
          ),
        ).toBe(true);
      }
    }
    for (const question of [
      ...sujiaoCountingDraft.questions,
      ...sujiaoCountingDraft.reviewQuestions!,
    ]) {
      if (question.visual?.kind !== 'count') continue;
      expect(question.visual.count).toBeGreaterThanOrEqual(1);
      expect(question.visual.count).toBeLessThanOrEqual(3);
      if (question.visual.other !== undefined) {
        expect(question.visual.other).toBeGreaterThanOrEqual(1);
        expect(question.visual.other).toBeLessThanOrEqual(3);
        expect(question.visual.other).not.toBe(question.visual.count);
      }
      const expected = question.prompt.includes('第二组选择')
        ? question.visual.other
        : question.visual.count;
      expect(
        evaluate(
          question.rule,
          question.rule.kind === 'choice' ? String(expected) : expected!,
        ),
      ).toBe(true);
    }
    for (const question of [
      ...sujiaoNineAddDraft.questions,
      ...sujiaoNineAddDraft.reviewQuestions!,
    ]) {
      if (
        question.visual?.kind === 'ten-frame' &&
        question.rule.kind === 'number'
      ) {
        expect(question.visual.left).toBe(9);
        expect(question.rule.value).toBe(
          question.visual.left + question.visual.right,
        );
        expect(question.rule.value).toBeLessThanOrEqual(19);
      }
    }
  });

  it('retains wrong first attempts and separates paper/physical confirmation in future session snapshots', () => {
    const now = '2026-09-30T03:00:00.000Z';
    for (const draft of sujiaoFirstDrafts) {
      const session = createSession(
        draft,
        'unregistered-source-draft',
        'child',
        { now, seed: 5 },
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
      for (const [position, question] of session.questions.entries()) {
        const answer = (() => {
          if (question.rule.kind === 'number') return question.rule.value;
          return (() => {
            if (question.rule.kind === 'choice') return question.rule.value;
            return (() => {
              if (
                question.rule.kind === 'steps' ||
                question.rule.kind === 'set'
              )
                return question.rule.values;
              return (() => {
                if (question.rule.kind === 'magic-grid')
                  return magicSolutions(question.rule.cells)[0]!;
                return (() => {
                  if (question.rule.kind === 'reflection')
                    return '我还想练退位减法。';
                  return question.rule.kind === 'tower'
                    ? towerSolutions(question.rule.rows)[0]!
                    : 'confirmed';
                })();
              })();
            })();
          })();
        })();
        session.responses[position] = submitResponse(
          question,
          { ...session.responses[position]!, draft: answer },
          now,
        );
      }
      expect(statistics(session).manual).toBe(3);
      expect(
        session.responses[index]!.submissions.map(
          (submission) => submission.correct,
        ),
      ).toEqual([false, true]);
      const restored = parseBackup(
        exportBackup(
          {
            schemaVersion: 1,
            activeProfileId: 'child',
            profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
            sessions: [session],
          },
          now,
        ),
      );
      expect(restored.data.sessions[0]).toEqual(session);
    }
  });
});

it('covers adding zero and an existing ten without forcing a make-ten split', () => {
  expect(sujiaoNineAddDraft.version).toBe(2);
  for (const questions of [
    sujiaoNineAddDraft.questions,
    sujiaoNineAddDraft.reviewQuestions!,
  ]) {
    const zero = questions.find((q) => q.id.endsWith('-zero'))!;
    const ten = questions.find((q) => q.id.endsWith('-ten'))!;
    expect(evaluate(zero.rule, 9)).toBe(true);
    expect(evaluate(zero.rule, 10)).toBe(false);
    expect(evaluate(ten.rule, 19)).toBe(true);
    expect(evaluate(ten.rule, 10)).toBe(false);
    expect(zero.visual).toBeUndefined();
    expect(ten.visual).toBeUndefined();
  }
});
