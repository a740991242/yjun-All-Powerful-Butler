import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { upperCharacters } from './characters';
import { chineseBooks } from './chinese';
import {
  schoolbagLesson,
  schoolbagPageAudit,
  schoolbagTools,
} from './chinese-schoolbag';
import { upperRecognitionPacks } from './chinese-upper-recognition';

it('publishes the observed formal lesson separately from recognition history with exact character and activity scopes', () => {
  const l = schoolbagLesson;
  const lessons = chineseBooks[0]!.units.flatMap((u) => u.lessons);
  expect(lessons).toContain(l);
  expect(l.id).toBe('cu-u6-3');
  expect(lessons).toContain(upperRecognitionPacks['u6-3']);
  expect(upperRecognitionPacks['u6-3']!.id).not.toBe(l.id);
  expect(schoolbagPageAudit.pages).toEqual([76, 77]);
  expect(schoolbagPageAudit.recognize).toBe(upperCharacters['u6-3']!.recognize);
  expect(schoolbagPageAudit.write).toBe(upperCharacters['u6-3']!.write);
  for (const field of [
    'author',
    'isbn',
    'editionDate',
    'printingDate',
  ] as const)
    expect(schoolbagPageAudit[field]).toBeNull();
  expect(schoolbagPageAudit.provider).toContain('第三方');
  expect(l.steps).toHaveLength(8);
  expect(l.questions.filter((q) => q.rule.kind === 'choice')).toHaveLength(21);
  expect(l.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(7);
  expect(l.questions.filter((q) => q.rule.kind === 'reflection')).toHaveLength(
    1,
  );
  expect(
    l.questions
      .filter((q) => q.id.includes('-q-char-'))
      .map((q) => (q.rule.kind === 'choice' ? q.rule.value : ''))
      .join(''),
  ).toBe('包尺作业笔刀宝贝少课早');
  for (const key of ['read', 'words', 'stationery', 'pack', 'write'])
    expect(
      l.questions.find((q) => q.id.endsWith(`-manual-${key}`))!.rule.kind,
    ).toBe('manual');
  expect(
    l.questions.find((q) => q.id.endsWith('-manual-write'))!.prompt,
  ).toContain('尺本刀不少');
});
it('maps the six vocabulary items to original use prompts while keeping actual packing, fiction and personification separate', () => {
  const l = schoolbagLesson;
  expect(schoolbagPageAudit.words).toEqual([
    '橡皮',
    '尺子',
    '作业本',
    '笔袋',
    '铅笔',
    '转笔刀',
  ]);
  expect(schoolbagTools.map((r) => r[0])).toEqual(schoolbagPageAudit.words);
  for (const [i, [tool, use]] of schoolbagTools.entries()) {
    expect(
      l.questions.find((q) => q.id.endsWith(`-q-tool-${i}`))!.rule,
    ).toEqual({ kind: 'choice', value: tool });
    expect(
      l.reviewQuestions!.find((q) => q.id.endsWith(`-r-tool-${i}`))!.rule,
    ).toEqual({ kind: 'choice', value: use });
  }
  expect(l.questions.some((q) => q.id.endsWith('-manual-recite'))).toBe(false);
  expect(
    l.questions.find((q) => q.id.endsWith('-q-reading-destination'))!.rule,
  ).toEqual({ kind: 'choice', value: '学校' });
  expect(
    l.reviewQuestions!.find((q) => q.id.endsWith('-r-reading-destination'))!
      .rule,
  ).toEqual({ kind: 'choice', value: '学习用品' });
  expect(
    l.questions.find((q) => q.id.endsWith('-q-fiction-plan'))!.material,
  ).toContain('本站虚构');
  expect(
    l.questions.find((q) => q.id.endsWith('-q-fiction-plan'))!.rule,
  ).toEqual({ kind: 'choice', value: '语文书' });
  expect(
    l.reviewQuestions!.find((q) => q.id.endsWith('-r-fiction-plan'))!.rule,
  ).toEqual({ kind: 'choice', value: '数学书' });
  expect(l.steps[1]!.text).toContain('不要求购买');
  expect(l.steps[3]!.text).toContain('不是物品自己会走');
  expect(l.steps[5]!.text).toContain('分别记录');
  const all = [...l.questions, ...l.reviewQuestions!];
  expect(new Set(all.map((q) => q.id)).size).toBe(all.length);
  for (const q of all) {
    if (q.rule.kind !== 'choice') continue;
    const value = q.rule.value;
    expect(q.choices!.filter((c) => c.id === value)).toHaveLength(1);
    for (const c of q.choices!)
      expect(evaluate(q.rule, c.id)).toBe(c.id === value);
  }
  for (const q of l.reviewQuestions!)
    expect(
      l.questions.some(
        (m) =>
          JSON.stringify([m.prompt, m.material, m.visual]) ===
          JSON.stringify([q.prompt, q.material, q.visual]),
      ),
    ).toBe(false);
});
it('preserves a wrong-first pair response and separate manual/reflection history through backup and changed review', () => {
  const now = '2026-10-01T00:00:00.000Z';
  const s = createSession(schoolbagLesson, chineseBooks[0]!.id, 'child', {
    seed: 18,
    now,
  });
  s.phase = 'practice';
  for (const [i, q] of s.questions.entries()) {
    if (q.id.endsWith('-q-reading-destination'))
      s.responses[i] = submitResponse(
        q,
        { ...s.responses[i]!, draft: '金银首饰' },
        now,
      );
    s.responses[i] = submitResponse(
      q,
      {
        ...s.responses[i]!,
        draft: (() => {
          if (q.rule.kind === 'choice') return q.rule.value;
          return q.rule.kind === 'manual' ? 'confirmed' : '下次想练尺字。';
        })(),
      },
      now,
    );
    if (q.rule.kind !== 'choice')
      expect(s.responses[i]!.submissions.at(-1)!.correct).toBeNull();
  }
  expect(s.responses.filter((r) => r.submissions.length === 2)).toHaveLength(1);
  const review = newReviewQuestions(schoolbagLesson, s, [s]);
  expect(review).toHaveLength(1);
  expect(review[0]!.rule).toEqual({ kind: 'choice', value: '学习用品' });
  expect(evaluate(review[0]!.rule, '学校')).toBe(false);
  expect(
    parseBackup(
      exportBackup({
        schemaVersion: 1,
        activeProfileId: 'child',
        profiles: [{ id: 'child', nickname: '陪读', createdAt: now }],
        sessions: [s],
      }),
    ).data.sessions[0],
  ).toEqual(s);
});
