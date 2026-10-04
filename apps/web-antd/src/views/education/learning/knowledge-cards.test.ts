import { describe, expect, it } from 'vitest';

import { finalPracticeLessons } from '../content/math-final-practice';
import { exportBackup, parseBackup } from './backup';
import { createSession, statistics } from './engine';
import {
  isKnowledgeCard,
  knowledgeCards,
  selectedKnowledgeCard,
} from './knowledge-cards';
import { required } from './required';

describe('bounded knowledge cards and saved learning snapshots', () => {
  it('connects four distinct topics to safe nonrecursive models with explicit equations', () => {
    expect(knowledgeCards.map((card) => card.topic)).toEqual([
      'numbers',
      'calculation',
      'relations',
      'shapes',
    ]);
    expect(knowledgeCards.map((card) => card.visual.kind)).toEqual([
      'place-value',
      'ten-frame',
      'count',
      'block-cards',
    ]);
    expect(selectedKnowledgeCard(0).equation).toBe('17 = 10 + 7');
    expect(selectedKnowledgeCard(1).visual).toEqual({
      kind: 'ten-frame',
      left: 8,
      right: 6,
    });
    expect(selectedKnowledgeCard(2).visual).toEqual({
      kind: 'count',
      count: 5,
      other: 7,
    });
    expect(selectedKnowledgeCard(3).equation).toBe('1 + 1 + 1 + 1 = 4');
    for (const invalid of [
      -1,
      4,
      0.5,
      Number.NaN,
      Infinity,
      '1',
      null,
      undefined,
    ]) {
      expect(isKnowledgeCard(invalid)).toBe(false);
    }
    expect(selectedKnowledgeCard(undefined)).toBe(knowledgeCards[0]);
  });
  it('restores every card selection without scoring or replacing old v1 question snapshots', () => {
    const lesson = required(
      finalPracticeLessons.find((l) => l.id === 'mu-final-links'),
    );
    expect(lesson.version).toBe(3);
    const oldLesson = structuredClone(lesson);
    oldLesson.version = 1;
    oldLesson.questions = oldLesson.questions.slice(0, 21);
    oldLesson.steps = oldLesson.steps.slice(0, 6);
    oldLesson.reviewQuestions = oldLesson.reviewQuestions?.slice(0, 10);
    required(oldLesson.steps[0]).visual = { kind: 'place-value', value: 17 };
    const now = '2026-10-03T00:00:00.000Z';
    const old = createSession(oldLesson, 'pep-math-p1-upper-2024', 'child', {
      now,
      seed: 17,
    });
    const original = JSON.stringify(old);
    const session = createSession(lesson, old.bookId, old.profileId, {
      now,
      seed: 17,
    });
    const responses = JSON.stringify(session.responses);
    for (let index = 0; index < 4; index++) {
      session.tools = { 'step-0': { knowledgeCard: index } };
      const state = {
        schemaVersion: 1 as const,
        activeProfileId: 'child',
        profiles: [{ id: 'child', nickname: '学习者', createdAt: now }],
        sessions: [old, session],
      };
      const restored = parseBackup(exportBackup(state)).data;
      expect(restored).toEqual(state);
      expect(JSON.stringify(restored.sessions[0])).toBe(original);
      expect(JSON.stringify(session.responses)).toBe(responses);
      expect(statistics(session).accuracy).toBeNull();
      expect(session.completedAt).toBeUndefined();
      for (const invalid of [-1, 4, 0.5, '0', null, { topic: 'numbers' }]) {
        const damaged = structuredClone(state);
        Object.assign(required(damaged.sessions[1]).tools?.['step-0'] ?? {}, {
          knowledgeCard: invalid,
        });
        expect(() =>
          parseBackup(
            JSON.stringify({
              ...JSON.parse(exportBackup(state)),
              data: damaged,
            }),
          ),
        ).toThrow('educationLearning.invalidBackup');
      }
      const damaged = JSON.parse(exportBackup(state));
      damaged.data.sessions[1].questions[0].visual = {
        kind: 'knowledge-map',
        children: [{ kind: 'knowledge-map' }],
      };
      expect(() => parseBackup(JSON.stringify(damaged))).toThrow(
        'educationLearning.invalidBackup',
      );
    }
  });
});
