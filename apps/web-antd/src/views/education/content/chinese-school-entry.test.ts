import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { chineseBooks } from './chinese';
import {
  schoolEntryLessons,
  schoolEntryOriginalStory,
  schoolEntryPageAudits,
  schoolEntrySource,
} from './chinese-school-entry';

const counts = [
  ['school-1', 5, 4, 4, 2],
  ['school-2', 6, 3, 3, 1],
  ['school-3', 5, 3, 4, 1],
  ['school-4', 6, 3, 5, 2],
] as const;
it('opens all four separately observed introductory activities without fabricating character scopes or publication metadata', () => {
  const all = chineseBooks[0]!.units.flatMap((u) => u.lessons);
  for (const [id, steps, objective, manual, reflection] of counts) {
    const l = schoolEntryLessons[id]!;
    expect(all.filter((x) => x.id === `cu-${id}`)).toEqual([l]);
    expect(l.status).toBe('available');
    expect(l.steps).toHaveLength(steps);
    expect(l.questions.filter((q) => q.rule.kind === 'choice')).toHaveLength(
      objective,
    );
    expect(l.reviewQuestions).toHaveLength(objective);
    expect(l.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
      manual,
    );
    expect(
      l.questions.filter((q) => q.rule.kind === 'reflection'),
    ).toHaveLength(reflection);
    expect(schoolEntryPageAudits[id].recognize).toBe('');
    expect(schoolEntryPageAudits[id].write).toBe('');
    expect(l.questions.some((q) => q.id.includes('-q-char-'))).toBe(false);
    expect(l.questions.some((q) => q.id.includes('-manual-recite'))).toBe(
      false,
    );
  }
  expect(Object.values(schoolEntryPageAudits).map((x) => x.pages)).toEqual([
    [2, 3],
    [4, 5],
    [6],
    [7],
  ]);
  expect(schoolEntryPageAudits['school-3']).toMatchObject({
    creator: '北京市小学唱歌教研组',
    creationKind: '集体创作',
    adapted: true,
  });
  for (const key of ['isbn', 'editionDate', 'printingDate'] as const)
    expect(schoolEntrySource[key]).toBeNull();
  expect(schoolEntrySource.provider).toContain('第三方');
});
it('keeps actual reading, role exchange, listening and writing separate from observations and plans', () => {
  const l1 = schoolEntryLessons['school-1']!;
  const l3 = schoolEntryLessons['school-3']!;
  const l4 = schoolEntryLessons['school-4']!;
  expect(l1.steps[0]!.text).toContain('不按服饰猜');
  expect(l1.steps[1]!.text).toContain('教材角色不是系统对学习者身份的判断');
  expect(
    l1.questions.find((q) => q.id.endsWith('-manual-roles'))!.rule.kind,
  ).toBe('manual');
  expect(l3.steps[0]!.text).toContain('不要求必唱或背诵');
  expect(l3.steps[3]!.text).toContain('原创活动不是原书已印课后题');
  expect(
    l3.questions.find((q) => q.id.endsWith('-manual-prepare'))!.prompt,
  ).toContain('想做不等于已经整理');
  for (const key of ['look', 'read', 'write', 'tell', 'listen'])
    expect(
      l4.questions.find((q) => q.id.endsWith(`-manual-${key}`))!.rule.kind,
    ).toBe('manual');
  expect(l4.steps[3]!.text).toContain(schoolEntryOriginalStory);
  expect(schoolEntryOriginalStory).toContain('本站原创');
  expect(l4.steps[2]!.text).toContain('没有本项新增会写字清单');
  for (const [id, key, main, review] of [
    ['school-1', 'scene', '天安门', '五星红旗'],
    ['school-1', 'pronoun', '小禾和小安', '小安'],
    ['school-1', 'together', '团结友爱', '互相倾听'],
    ['school-1', 'clothing', '服饰多样', '不能据衣着确定能力'],
    ['school-2', 'objects', '五星红旗', '北京天安门'],
    ['school-2', 'place', '北京', '中华人民共和国'],
    ['school-2', 'rivers', '长江', '黄河'],
    ['school-3', 'speaker', '小鸟', '孩子'],
    ['school-3', 'destination', '学校', '小书包'],
    ['school-3', 'values', '爱学习', '爱劳动'],
    ['school-4', 'activity', '读书', '写字'],
    ['school-4', 'roles', '小禾', '小安'],
    ['school-4', 'order', '借来图画书', '归还图画书'],
  ]) {
    const l = schoolEntryLessons[id!]!;
    expect(l.questions.find((q) => q.id.endsWith(`-q-${key}`))!.rule).toEqual({
      kind: 'choice',
      value: main,
    });
    expect(
      l.reviewQuestions!.find((q) => q.id.endsWith(`-r-${key}`))!.rule,
    ).toEqual({ kind: 'choice', value: review });
  }
  for (const l of Object.values(schoolEntryLessons)) {
    const all = [...l.questions, ...l.reviewQuestions!];
    expect(new Set(all.map((q) => q.id)).size).toBe(all.length);
    for (const q of all) {
      if (q.rule.kind !== 'choice') continue;
      const value = q.rule.value;
      expect(new Set(q.choices!.map((c) => c.id)).size).toBe(q.choices!.length);
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
  }
});
it.each([
  ['school-1', 'scene', '五星红旗'],
  ['school-2', 'rivers', '黄河'],
  ['school-3', 'destination', '小书包'],
  ['school-4', 'roles', '小安'],
] as const)(
  'keeps wrong-first history and ungraded real activity evidence for %s across backup and changed review',
  (id, key, newValue) => {
    const l = schoolEntryLessons[id]!;
    const now = '2026-10-01T00:00:00.000Z';
    const s = createSession(l, chineseBooks[0]!.id, 'child', { seed: 18, now });
    s.phase = 'practice';
    let old = '';
    for (const [i, q] of s.questions.entries()) {
      if (q.id.endsWith(`-q-${key}`) && q.rule.kind === 'choice') {
        old = q.rule.value;
        s.responses[i] = submitResponse(
          q,
          {
            ...s.responses[i]!,
            draft: q.choices!.find((c) => c.id !== old)!.id,
          },
          now,
        );
        expect(s.responses[i]!.submissions.at(-1)!.correct).toBe(false);
      }
      s.responses[i] = submitResponse(
        q,
        {
          ...s.responses[i]!,
          draft: (() => {
            if (q.rule.kind === 'choice') return q.rule.value;
            return q.rule.kind === 'manual'
              ? 'confirmed'
              : '下一次想再讲一个故事。';
          })(),
        },
        now,
      );
      if (q.rule.kind !== 'choice')
        expect(s.responses[i]!.submissions.at(-1)!.correct).toBeNull();
    }
    expect(s.responses.filter((r) => r.submissions.length === 2)).toHaveLength(
      1,
    );
    const review = newReviewQuestions(l, s, [s]);
    expect(review).toHaveLength(1);
    expect(review[0]!.rule).toEqual({ kind: 'choice', value: newValue });
    expect(evaluate(review[0]!.rule, old)).toBe(false);
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
  },
);
