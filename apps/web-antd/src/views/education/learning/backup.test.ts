import type { Lesson, LibraryState } from './types';

import { describe, expect, it } from 'vitest';

import {
  exportBackup,
  isLibraryState,
  parseBackup,
  previewMerge,
} from './backup';
import { initialCardGame } from './card-game';
import { createSession, submitResponse } from './engine';
import { initialShapeJoin } from './shape-join';
import { initialLibrary } from './storage';

const lesson: Lesson = {
  id: 'count',
  title: '数一数',
  textbookTitle: '认识1～5',
  page: 13,
  goal: '一一对应',
  prerequisite: '观察',
  parentTip: '点一个数一个',
  version: 1,
  status: 'available',
  steps: [],
  review: { date: '2026-09-30', reviewer: 'test', notes: 'fixture' },
  questions: [
    {
      id: 'count-1',
      knowledge: 'count-1-5',
      prompt: '有几枚圆片？',
      rule: { kind: 'number', value: 3 },
      visual: { kind: 'count', count: 3 },
      hint: '点一个数一个。',
      explanation: '三枚圆片，用3表示。',
    },
  ],
};
function library(): LibraryState {
  const value = initialLibrary('小同学');
  value.sessions.push(
    createSession(lesson, 'pep-math-p1-upper-2024', value.activeProfileId),
  );
  return value;
}
describe('local evidence backups', () => {
  it('preserves dense sequence and set histories and rejects missing slots in a claimed submission', () => {
    for (const kind of ['sequence', 'set'] as const) {
      const state = library();
      const session = state.sessions[0]!;
      const question = session.questions[0]!;
      question.rule = { kind, values: ['a', 'b', 'c'] };
      question.choices = ['a', 'b', 'c'].map((id) => ({ id, label: id }));
      delete question.visual;
      session.responses[0]!.draft = ['c', 'b', 'a'];
      session.responses[0] = submitResponse(question, session.responses[0]!);
      session.responses[0]!.draft = ['a', 'b', 'c'];
      session.responses[0] = submitResponse(question, session.responses[0]!);
      const backup = exportBackup(state);
      expect(parseBackup(backup).data).toEqual(state);
      expect(session.responses[0]!.submissions[0]!.correct).toBe(
        kind === 'set',
      );
      for (const missingIndex of [0, 1, 2]) {
        const malformed = parseBackup(backup);
        const answer =
          malformed.data.sessions[0]!.responses[0]!.submissions[0]!.answer;
        if (!Array.isArray(answer)) throw new Error('Expected array fixture');
        Reflect.deleteProperty(answer, String(missingIndex));
        expect(isLibraryState(malformed.data)).toBe(false);
        // JSON serializes an array hole as null: neither form is accepted.
        expect(() => parseBackup(JSON.stringify(malformed))).toThrow(
          'educationLearning.invalidBackup',
        );
        expect(parseBackup(backup).data).toEqual(state);
      }
    }
  });

  it('round trips card actions and rejects impossible claims or tools without a saved model', () => {
    const state = library();
    const session = state.sessions[0]!;
    session.questions[0]!.visual = {
      kind: 'card-game',
      mode: 'pair',
      decks: [
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [9, 8, 7, 6, 5, 4, 3, 2, 1],
      ],
    };
    session.tools = {
      'question-count-1': {
        cardGame: {
          ...initialCardGame(),
          actions: [{ type: 'draw' }, { type: 'draw' }],
          selected: [0, 1],
        },
      },
    };
    expect(parseBackup(exportBackup(state)).data).toEqual(state);
    session.tools['question-count-1']!.cardGame!.actions.push({
      type: 'claim',
      player: 0,
      ids: [0, 1],
    });
    session.tools['question-count-1']!.cardGame!.selected = [];
    expect(parseBackup(exportBackup(state)).data).toEqual(state);
    const wrong = structuredClone(state);
    wrong.sessions[0]!.tools!['question-count-1']!.cardGame!.actions.push({
      type: 'claim',
      player: 1,
      ids: [0, 1],
    });
    expect(isLibraryState(wrong)).toBe(false);
    for (const key of ['step-0', 'question-missing']) {
      const unbound = structuredClone(state);
      unbound.sessions[0]!.tools = {
        [key]: session.tools['question-count-1']!,
      };
      expect(isLibraryState(unbound)).toBe(false);
    }
    session.questions[0]!.visual = { kind: 'count', count: 3 };
    expect(isLibraryState(state)).toBe(false);
  });
  it('round trips triangle selection and positions, rejecting overlaps and unrelated question bindings', () => {
    const value = library();
    const session = value.sessions[0]!;
    session.questions[0]!.visual = { kind: 'shape-join' };
    session.tools = { 'question-count-1': { shapeJoin: initialShapeJoin() } };
    expect(parseBackup(exportBackup(value)).data).toEqual(value);
    const overlap = structuredClone(value);
    overlap.sessions[0]!.tools!['question-count-1']!.shapeJoin!.pieces[1] = {
      x: 0,
      y: 0,
      turn: 0,
    };
    expect(isLibraryState(overlap)).toBe(false);
    session.questions[0]!.visual = { kind: 'count', count: 3 };
    expect(isLibraryState(value)).toBe(false);
    delete session.tools;
    expect(isLibraryState(value)).toBe(true);
  });
  it('restores quantity-preserving exchanges and rejects mismatched task totals or invented units', () => {
    const state = library();
    const session = state.sessions[0]!;
    session.questions[0]!.visual = { kind: 'place-value', value: 23 };
    session.tools = {
      'question-count-1': { placeValue: { value: 23, hundreds: 0, tens: 1 } },
      'step-0': { placeValue: { value: 100, hundreds: 0, tens: 10 } },
    };
    expect(parseBackup(exportBackup(state)).data).toEqual(state);
    for (const invalid of [
      { value: 23, hundreds: 0, tens: 3 },
      { value: 100, hundreds: 1, tens: 1 },
      { value: 101, hundreds: 1, tens: 0 },
      { value: 23, hundreds: 0, tens: 1, unexpected: true },
      { value: 24, hundreds: 0, tens: 1 },
    ]) {
      const malformed = structuredClone(state);
      Object.assign(malformed.sessions[0]!.tools!['question-count-1']!, {
        placeValue: invalid,
      });
      expect(isLibraryState(malformed)).toBe(false);
    }
    session.questions[0]!.visual = { kind: 'count', count: 23 };
    expect(isLibraryState(state)).toBe(false);
  });
  it('restores read-aloud help snapshots while accepting legacy records with absent optional fields', () => {
    const state = library();
    const session = state.sessions[0]!;
    const response = session.responses[0]!;
    response.readingHelp = true;
    response.draft = 3;
    session.responses[0] = submitResponse(session.questions[0]!, response);
    expect(parseBackup(exportBackup(state)).data).toEqual(state);
    delete session.responses[0]!.readingHelp;
    delete session.responses[0]!.submissions[0]!.readingHelp;
    expect(parseBackup(exportBackup(state)).data).toEqual(state);
  });
  it('rejects malformed or contradictory reading-help flags instead of discarding evidence', () => {
    const state = library();
    const session = state.sessions[0]!;
    session.responses[0]!.draft = 3;
    session.responses[0] = submitResponse(
      session.questions[0]!,
      session.responses[0]!,
    );
    const contradictory = structuredClone(state);
    contradictory.sessions[0]!.responses[0]!.submissions[0]!.readingHelp = true;
    expect(isLibraryState(contradictory)).toBe(false);
    for (const invalid of ['yes', 1, null, [], {}]) {
      const malformedResponse = structuredClone(state);
      Object.assign(malformedResponse.sessions[0]!.responses[0]!, {
        readingHelp: invalid,
      });
      expect(isLibraryState(malformedResponse)).toBe(false);
      const malformedSubmission = structuredClone(state);
      Object.assign(
        malformedSubmission.sessions[0]!.responses[0]!.submissions[0]!,
        { readingHelp: invalid },
      );
      expect(isLibraryState(malformedSubmission)).toBe(false);
    }
  });
  it('accepts the bounded hundred-chart diagram and rejects out-of-range initial positions', () => {
    const state = library();
    state.sessions[0]!.questions[0]!.visual = {
      kind: 'hundred-chart',
      value: 100,
    };
    state.sessions[0]!.tools = { 'step-0': { position: 90 } };
    expect(parseBackup(exportBackup(state)).data).toEqual(state);
    state.sessions[0]!.questions[0]!.visual = {
      kind: 'hundred-chart',
      value: 0,
    };
    expect(isLibraryState(state)).toBe(false);
    state.sessions[0]!.questions[0]!.visual = {
      kind: 'hundred-chart',
      value: 101,
    };
    expect(isLibraryState(state)).toBe(false);
  });
  it('rejects unanswerable choice snapshots and invented completion of unanswered tasks', () => {
    const missingOptions = library();
    missingOptions.sessions[0]!.questions[0]!.rule = {
      kind: 'choice',
      value: 'missing',
    };
    expect(isLibraryState(missingOptions)).toBe(false);
    missingOptions.sessions[0]!.questions[0]!.choices = [
      { id: 'other', label: 'Other' },
    ];
    expect(isLibraryState(missingOptions)).toBe(false);
    const completed = library();
    completed.sessions[0]!.phase = 'summary';
    completed.sessions[0]!.completedAt = completed.sessions[0]!.updatedAt;
    expect(isLibraryState(completed)).toBe(false);
    completed.sessions[0]!.responses[0]!.skipped = true;
    expect(isLibraryState(completed)).toBe(true);
  });
  it('restores bounded tool interactions and accepts older records without tool fields', () => {
    const state = library();
    state.sessions[0]!.tools = {
      'step-0': { touched: [1, 3] },
      'step-1': { transferred: 1 },
      'step-2': { broken: true, removed: 7 },
      'question-count-1': { position: 29 },
    };
    expect(parseBackup(exportBackup(state)).data.sessions[0]?.tools).toEqual(
      state.sessions[0]!.tools,
    );
    delete state.sessions[0]!.tools;
    expect(parseBackup(exportBackup(state)).data).toEqual(state);
    for (const invalid of [
      { 'step-0': { touched: [1, 1] } },
      { 'step-0': { touched: [201] } },
      { 'step-0': { transferred: 11 } },
      { 'step-0': { position: -1 } },
      { 'step-0': { broken: 'yes' } },
      { 'step-0': { removed: 10 } },
      { 'step-0': { removed: -1 } },
      { 'unbounded-key': { position: 10 } },
      { 'step-0': { touched: [], unrecognized: 'ignore me' } },
    ]) {
      const forged = JSON.parse(exportBackup(state));
      forged.data.sessions[0].tools = invalid;
      expect(() => parseBackup(JSON.stringify(forged))).toThrow(
        'invalidBackup',
      );
    }
  });
  it('round trips unfinished drafts, later attempts and hint evidence', () => {
    const state = library();
    const session = state.sessions[0]!;
    session.phase = 'practice';
    session.responses[0]!.draft = 2;
    session.responses[0] = submitResponse(
      session.questions[0]!,
      session.responses[0]!,
    );
    session.responses[0]!.draft = 3;
    session.responses[0]!.hintUsed = true;
    session.responses[0] = submitResponse(
      session.questions[0]!,
      session.responses[0]!,
    );
    expect(parseBackup(exportBackup(state)).data).toEqual(state);
  });
  it('rejects wrong formats, future schemas, tampered grading and invalid profile references', () => {
    expect(() => parseBackup('not json')).toThrow('invalidBackup');
    expect(() =>
      parseBackup(JSON.stringify({ data: { schemaVersion: 2 } })),
    ).toThrow('backupVersion');
    const state = library();
    state.sessions[0]!.profileId = 'unknown';
    expect(isLibraryState(state)).toBe(false);
    const forged = library();
    const session = forged.sessions[0]!;
    session.responses[0]!.draft = 2;
    session.responses[0] = submitResponse(
      session.questions[0]!,
      session.responses[0]!,
    );
    session.responses[0]!.submissions[0]!.correct = true;
    expect(isLibraryState(forged)).toBe(false);
  });
  it('previews additions without overwriting existing attempts, nicknames or selected profile', () => {
    const current = library();
    const incoming = structuredClone(current);
    incoming.profiles[0]!.nickname = 'different';
    incoming.sessions[0]!.lessonTitle = 'changed';
    const another = library();
    incoming.profiles.push(...another.profiles);
    incoming.sessions.push(...another.sessions);
    const before = structuredClone(current);
    const preview = previewMerge(current, incoming);
    expect(preview).toMatchObject({ profiles: 1, sessions: 1, duplicates: 1 });
    expect(preview.result.profiles[0]!.nickname).toBe('小同学');
    expect(preview.result.sessions[0]!.lessonTitle).toBe('数一数');
    expect(preview.result.activeProfileId).toBe(current.activeProfileId);
    expect(current).toEqual(before);
  });
  it('rejects duplicate IDs, missing response rows and review references to another profile', () => {
    const duplicate = library();
    duplicate.sessions.push(structuredClone(duplicate.sessions[0]!));
    expect(isLibraryState(duplicate)).toBe(false);
    const missing = library();
    missing.sessions[0]!.responses = [];
    expect(isLibraryState(missing)).toBe(false);
    const state = library();
    const other = library();
    state.profiles.push(...other.profiles);
    state.sessions.push(...other.sessions);
    state.sessions[0]!.originalSessionId = other.sessions[0]!.id;
    expect(isLibraryState(state)).toBe(false);
  });
});
