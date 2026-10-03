import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { upperCharacters } from './characters';
import { chineseBooks } from './chinese';
import {
  gardenSixJobs,
  gardenSixLesson,
  gardenSixPageAudit,
} from './chinese-garden-six';
import { upperRecognitionPacks } from './chinese-upper-recognition';

it('publishes the observed formal lesson separately from recognition history with exact character and activity scopes', () => {
  const l = gardenSixLesson;
  const lessons = chineseBooks[0]!.units.flatMap((u) => u.lessons);
  expect(lessons).toContain(l);
  expect(l.id).toBe('cu-u6-5');
  expect(lessons).toContain(upperRecognitionPacks['u6-5']);
  expect(upperRecognitionPacks['u6-5']!.id).not.toBe(l.id);
  expect(gardenSixPageAudit.pages).toEqual([80, 81, 82, 83]);
  expect(gardenSixPageAudit.recognize).toBe(upperCharacters['u6-5']!.recognize);
  expect(gardenSixPageAudit.write).toBe(upperCharacters['u6-5']!.write);
  for (const field of ['isbn', 'editionDate', 'printingDate'] as const)
    expect(gardenSixPageAudit[field]).toBeNull();
  expect(gardenSixPageAudit.provider).toContain('第三方');
  expect(l.steps).toHaveLength(12);
  expect(l.questions.filter((q) => q.rule.kind === 'choice')).toHaveLength(33);
  expect(l.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(14);
  expect(l.questions.filter((q) => q.rule.kind === 'reflection')).toHaveLength(
    2,
  );
  expect(
    l.questions
      .filter((q) => q.id.includes('-q-char-'))
      .map((q) => (q.rule.kind === 'choice' ? q.rule.value : ''))
      .join(''),
  ).toBe('老师工厂医院生门卫');
  for (const key of [
    'read',
    'poem',
    'picture-write',
    'picture-say',
    'write',
    'order',
  ])
    expect(
      l.questions.find((q) => q.id.endsWith(`-manual-${key}`))!.rule.kind,
    ).toBe('manual');
  expect(
    l.questions.find((q) => q.id.endsWith('-manual-write'))!.prompt,
  ).toContain('工厂门卫');
});

it('records both source character groups and all three picture blanks without grading real reading or handwriting, preserving v1 history', () => {
  const l = gardenSixLesson;
  const additions = l.questions.filter((q) => q.id.endsWith('-complete'));
  expect(additions).toHaveLength(2);
  const groups = additions.find((q) => q.id.includes('components'))!;
  expect(groups.prompt).toContain('树林桃桥、花草莲菜两组全部八字');
  expect(groups.prompt).toContain('尚未读全可跳过');
  const picture = additions.find((q) => q.id.includes('picture-write'))!;
  expect(picture.prompt).toContain('第81页原图三处空格');
  expect(picture.prompt).toContain('尚未尝试完整可跳过');
  expect(picture.material).toContain('不预设唯一的三个答案');
  const now = '2026-10-04T00:00:00.000Z';
  const current = createSession(l, chineseBooks[0]!.id, 'child', {
    seed: 81,
    now,
  });
  expect(current.questions).toHaveLength(49);
  current.phase = 'practice';
  for (const q of additions) {
    const index = current.questions.findIndex((entry) => entry.id === q.id);
    current.responses[index] = submitResponse(
      q,
      { ...current.responses[index]!, draft: 'confirmed' },
      now,
    );
    expect(current.responses[index]!.submissions.at(-1)!.correct).toBeNull();
  }
  const old = createSession(
    {
      ...l,
      version: 1,
      questions: l.questions.filter(
        (q) => !additions.some((a) => a.id === q.id),
      ),
    },
    chineseBooks[0]!.id,
    'child',
    { seed: 81, now },
  );
  expect(old.questions).toHaveLength(47);
  expect(
    old.questions.find((q) => q.id.endsWith('-manual-components'))!.prompt,
  ).toContain('树林桃桥或花草莲菜');
  expect(
    old.questions.find((q) => q.id.endsWith('-manual-picture-write'))!.prompt,
  ).toContain('一个或几个');
  const restored = parseBackup(
    exportBackup({
      schemaVersion: 1,
      activeProfileId: 'child',
      profiles: [{ id: 'child', nickname: '陪读', createdAt: now }],
      sessions: [old, current],
    }),
  ).data;
  expect(restored.schemaVersion).toBe(1);
  expect(restored.sessions).toEqual([old, current]);
});
it('covers all observed garden columns with changed conditions and distinguishes source text, illustration and original picture prompts', () => {
  const l = gardenSixLesson;
  expect(gardenSixPageAudit.poet).toBe('李白');
  expect(gardenSixPageAudit.dynasty).toBe('唐');
  expect(gardenSixPageAudit.storyAuthorPrinted).toBe('稽鸿');
  expect(gardenSixPageAudit.adapted).toBe(true);
  expect(gardenSixJobs).toEqual([
    ['学校', '老师'],
    ['工厂', '工人'],
    ['医院', '医生'],
    ['传达室', '门卫'],
  ]);
  for (const [i, [place, person]] of gardenSixJobs.entries()) {
    expect(l.questions.find((q) => q.id.endsWith(`-q-job-${i}`))!.rule).toEqual(
      { kind: 'choice', value: person },
    );
    expect(
      l.reviewQuestions!.find((q) => q.id.endsWith(`-r-job-${i}`))!.rule,
    ).toEqual({ kind: 'choice', value: place });
  }
  for (const [key, main, review] of [
    ['order', '从上到下', '从左到右'],
    ['poem-image', '白玉盘', '瑶台镜'],
    ['reading-season', '秋天', '冬天'],
    ['reading-ending', '小松鼠的疑问', '自己的续讲'],
    ['reading-picture', '植物地下部分', '本页图示'],
  ]) {
    expect(l.questions.find((q) => q.id.endsWith(`-q-${key}`))!.rule).toEqual({
      kind: 'choice',
      value: main,
    });
    expect(
      l.reviewQuestions!.find((q) => q.id.endsWith(`-r-${key}`))!.rule,
    ).toEqual({ kind: 'choice', value: review });
  }
  expect(
    l.questions.find((q) => q.id.endsWith('-q-picture-word'))!.material,
  ).toContain('本站原创');
  expect(l.steps[8]!.text).toContain('已学');
  expect(l.steps[8]!.text).toContain('不增加新增会写数');
  expect(l.steps[9]!.text).toContain('小时不识月');
  expect(l.steps[9]!.text).toContain('节选');
  expect(l.steps[11]!.text).toContain('图示提示与原文疑问是不同信息');
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
  const s = createSession(gardenSixLesson, chineseBooks[0]!.id, 'child', {
    seed: 18,
    now,
  });
  s.phase = 'practice';
  for (const [i, q] of s.questions.entries()) {
    if (q.id.endsWith('-q-reading-season'))
      s.responses[i] = submitResponse(
        q,
        { ...s.responses[i]!, draft: '春天' },
        now,
      );
    s.responses[i] = submitResponse(
      q,
      {
        ...s.responses[i]!,
        draft: (() => {
          if (q.rule.kind === 'choice') return q.rule.value;
          return q.rule.kind === 'manual' ? 'confirmed' : '下次想练卫字。';
        })(),
      },
      now,
    );
    if (q.rule.kind !== 'choice')
      expect(s.responses[i]!.submissions.at(-1)!.correct).toBeNull();
  }
  expect(s.responses.filter((r) => r.submissions.length === 2)).toHaveLength(1);
  const review = newReviewQuestions(gardenSixLesson, s, [s]);
  expect(review).toHaveLength(1);
  expect(review[0]!.rule).toEqual({ kind: 'choice', value: '冬天' });
  expect(evaluate(review[0]!.rule, '秋天')).toBe(false);
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
