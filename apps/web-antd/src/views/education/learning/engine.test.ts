import type { Lesson, Question } from './types';

import { describe, expect, it } from 'vitest';

import {
  createSession,
  evaluate,
  mistakes,
  shuffledQuestions,
  statistics,
  submitResponse,
  validAnswer,
} from './engine';

const question: Question = {
  id: 'zero',
  knowledge: 'zero',
  prompt: '1−1',
  rule: { kind: 'number', value: 0 },
  hint: '移走圆片。',
  explanation: '没有了，用0表示。',
};
const lesson: Lesson = {
  id: 'zero',
  textbookTitle: '认识0',
  title: '认识0',
  page: 30,
  goal: '区分0与没作答',
  prerequisite: '数1～5',
  parentTip: '实物操作',
  version: 1,
  status: 'available',
  steps: [],
  questions: [question],
  review: { date: '2026-09-30', reviewer: 'test', notes: 'fixture' },
};

describe('reviewed question grading', () => {
  it('never coerces missing input into zero', () => {
    expect(validAnswer(question.rule, null)).toBe(false);
    expect(validAnswer(question.rule, '')).toBe(false);
    expect(evaluate(question.rule, 0)).toBe(true);
    expect(() => evaluate(question.rule, null)).toThrow(Error);
    for (const value of [Number.NaN, Infinity, 0.5])
      expect(validAnswer(question.rule, value)).toBe(false);
  });
  it('accepts every valid partition without losing objects or allowing an empty group', () => {
    const rule = { kind: 'partition' as const, total: 5, parts: 2, minimum: 1 };
    for (let left = 1; left < 5; left++)
      expect(evaluate(rule, [left, 5 - left])).toBe(true);
    for (const values of [
      [0, 5],
      [2, 2],
      [-1, 6],
    ])
      expect(evaluate(rule, values)).toBe(false);
    expect(() => evaluate(rule, [1, 1, 3])).toThrow(Error);
  });
  it('compares sets without order while rejecting duplicates, and preserves ordered sequences', () => {
    expect(evaluate({ kind: 'set', values: ['a', 'b'] }, ['b', 'a'])).toBe(
      true,
    );
    expect(evaluate({ kind: 'set', values: ['a', 'b'] }, ['a', 'a', 'b'])).toBe(
      false,
    );
    expect(evaluate({ kind: 'sequence', values: ['a', 'b'] }, ['b', 'a'])).toBe(
      false,
    );
    expect(evaluate({ kind: 'steps', values: [2, 10, 13] }, [2, 10, 13])).toBe(
      true,
    );
  });
  it('normalizes Unicode tones but does not accept missing tones or v in place of ü', () => {
    const rule = {
      kind: 'text' as const,
      accepted: ['lǜ'],
      normalize: 'pinyin' as const,
    };
    expect(evaluate(rule, ' LU\u0308\u0300 ')).toBe(true);
    expect(evaluate(rule, 'lv')).toBe(false);
    expect(evaluate(rule, 'lü')).toBe(false);
    expect(evaluate({ kind: 'manual' }, 'confirmed')).toBeNull();
  });
});

describe('session evidence', () => {
  it('separates reading help from hints while retaining answer correctness', () => {
    const session = createSession(lesson, 'book', 'profile');
    const response = session.responses[0]!;
    response.readingHelp = true;
    response.draft = 0;
    session.responses[0] = submitResponse(question, response);
    expect(session.responses[0]!.submissions[0]).toMatchObject({
      correct: true,
      assisted: false,
      readingHelp: true,
    });
    expect(statistics(session)).toMatchObject({
      readingHelp: 1,
      assisted: 0,
      independent: 0,
      accuracy: null,
      finalCorrect: 1,
    });
  });
  it('does not retroactively change an independent first attempt when a parent helps later', () => {
    const session = createSession(lesson, 'book', 'profile');
    session.responses[0]!.draft = 1;
    session.responses[0] = submitResponse(question, session.responses[0]!);
    const first = structuredClone(session.responses[0]!.submissions[0]);
    session.responses[0]!.readingHelp = true;
    expect(submitResponse(question, session.responses[0]!)).toBe(
      session.responses[0],
    );
    session.responses[0]!.draft = 0;
    session.responses[0] = submitResponse(question, session.responses[0]!);
    expect(session.responses[0]!.submissions[0]).toEqual(first);
    expect(session.responses[0]!.submissions[1]?.readingHelp).toBe(true);
    expect(statistics(session)).toMatchObject({
      readingHelp: 0,
      independent: 1,
      firstCorrect: 0,
      accuracy: 0,
      finalCorrect: 1,
    });
    expect(mistakes(session)).toHaveLength(1);
  });
  it('allows hint and reading-help counts to overlap and excludes manual or skipped tasks from both first-attempt counts', () => {
    const manual = {
      ...question,
      id: 'manual',
      rule: { kind: 'manual' as const },
    };
    const session = createSession(lesson, 'book', 'profile', {
      questions: [question, manual, { ...question, id: 'skip' }],
    });
    for (const [index, item] of session.questions.entries()) {
      const response = session.responses[index]!;
      response.hintUsed = true;
      response.readingHelp = true;
      if (item.id === 'skip') response.skipped = true;
      else {
        response.draft = item.rule.kind === 'manual' ? 'confirmed' : 0;
        session.responses[index] = submitResponse(item, response);
      }
    }
    expect(statistics(session)).toMatchObject({
      readingHelp: 1,
      assisted: 1,
      independent: 0,
      manual: 1,
      skipped: 1,
    });
  });
  it('replays the same seed without mutating source questions or answers', () => {
    const questions = Array.from({ length: 8 }, (_, i) => ({
      ...question,
      id: String(i),
    }));
    expect(shuffledQuestions(questions, 42)).toEqual(
      shuffledQuestions(questions, 42),
    );
    expect(shuffledQuestions(questions, 42)).not.toEqual(
      shuffledQuestions(questions, 5),
    );
    const session = createSession(lesson, 'book', 'profile', { seed: 42 });
    session.questions[0]!.prompt = 'different';
    expect(question.prompt).toBe('1−1');
  });
  it('keeps first mistakes after correction and ignores identical double submissions', () => {
    const session = createSession(lesson, 'book', 'profile');
    const response = session.responses[0]!;
    response.draft = 1;
    session.responses[0] = submitResponse(question, response);
    const first = session.responses[0];
    expect(submitResponse(question, first)).toBe(first);
    first.draft = 0;
    session.responses[0] = submitResponse(question, first);
    expect(statistics(session)).toMatchObject({
      firstCorrect: 0,
      finalCorrect: 1,
      accuracy: 0,
    });
    expect(mistakes(session)).toHaveLength(1);
  });
  it('separates hints, manual confirmation, skips and independent first attempts', () => {
    const manual = {
      ...question,
      id: 'manual',
      rule: { kind: 'manual' as const },
    };
    const session = createSession(lesson, 'book', 'profile', {
      questions: [question, manual, { ...question, id: 'skip' }],
      seed: 0,
    });
    for (const [index, item] of session.questions.entries()) {
      const response = session.responses[index]!;
      if (item.id === 'skip') response.skipped = true;
      else {
        response.draft = item.id === 'manual' ? 'confirmed' : 0;
        response.hintUsed = item.id === 'zero';
        session.responses[index] = submitResponse(item, response);
      }
    }
    expect(statistics(session)).toMatchObject({
      total: 3,
      submitted: 2,
      skipped: 1,
      assisted: 1,
      manual: 1,
      independent: 0,
      accuracy: null,
    });
  });
});
