import { describe, expect, it } from 'vitest';

import { mathBooks } from '../content/math';
import { createSession } from './engine';
import { answerLabel, filterHistory } from './history';

describe('local learning history', () => {
  it('keeps all records beyond 20 and combines filters without changing stored order', () => {
    const lesson = mathBooks[0]!.units[0]!.lessons[0]!;
    const sessions = Array.from({ length: 35 }, (_, index) => {
      const session = createSession(lesson, mathBooks[0]!.id, 'profile', {
        mode: index % 2 ? 'practice' : 'lesson',
        now: new Date(Date.UTC(2026, 8, 1 + index)).toISOString(),
      });
      session.id = `record-${index}`;
      session.lessonTitle = index % 2 ? '数一数' : '比较数量';
      if (index % 3 === 0) session.completedAt = session.updatedAt;
      return session;
    });
    const original = sessions.map((session) => session.id);
    const all = filterHistory(sessions, '', 'all', 'all');
    expect(all).toHaveLength(35);
    expect(all.at(-1)?.id).toBe('record-0');
    const filtered = filterHistory(
      sessions,
      ' 数一数 ',
      'completed',
      'practice',
    );
    expect(filtered.length).toBeGreaterThan(0);
    expect(
      filtered.every(
        (session) =>
          session.completedAt &&
          session.mode === 'practice' &&
          session.lessonTitle === '数一数',
      ),
    ).toBe(true);
    expect(filterHistory(sessions, '不存在', 'all', 'all')).toEqual([]);
    expect(sessions.map((session) => session.id)).toEqual(original);
  });

  it('renders historical choice labels, preserves zero/negative answers, and never fills missing fields', () => {
    const question = mathBooks[0]!.units[0]!.lessons[0]!.questions[0]!;
    const snapshot = {
      ...question,
      choices: [{ id: 'old', label: '当时的选项' }],
    };
    expect(answerLabel(snapshot, 'old')).toBe('当时的选项');
    expect(answerLabel(snapshot, [0, null, -1])).toBe('0、—、-1');
    expect(answerLabel(snapshot, ['old', 'removed'])).toBe(
      '当时的选项、removed',
    );
    expect(answerLabel(snapshot, 'lǜ')).toBe('lǜ');
  });
});
