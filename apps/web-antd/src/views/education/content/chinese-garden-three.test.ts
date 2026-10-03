import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { plantCards } from '../learning/nature-cards';
import { newReviewQuestions } from '../learning/review';
import { upperCharacters } from './characters';
import { chineseBooks } from './chinese';
import {
  gardenThreeLesson,
  gardenThreePageAudit,
} from './chinese-garden-three';
import { timetableLesson } from './chinese-timetable';

it('covers the inspected three-page garden while preserving the independent original timetable and unknown publication metadata', () => {
  const lessons = chineseBooks[0]!.units.flatMap((u) => u.lessons);
  expect(lessons).toContain(gardenThreeLesson);
  expect(lessons).toContain(timetableLesson);
  expect(timetableLesson.id).toBe('cu-u3-6-timetable');
  expect(timetableLesson.questions).toHaveLength(8);
  expect(gardenThreePageAudit.pages).toEqual([42, 43, 44]);
  expect(gardenThreePageAudit.recognize).toBe(
    upperCharacters['u3-6']!.recognize,
  );
  expect(gardenThreePageAudit.write).toBe(upperCharacters['u3-6']!.write);
  expect(gardenThreePageAudit.provider).toContain('第三方');
  for (const field of ['isbn', 'editionDate', 'printingDate'] as const)
    expect(gardenThreePageAudit[field]).toBeNull();
  expect(gardenThreeLesson.steps).toHaveLength(13);
  expect(
    gardenThreeLesson.questions.filter((q) => q.rule.kind === 'choice'),
  ).toHaveLength(33);
  expect(
    gardenThreeLesson.questions.filter((q) => q.rule.kind === 'manual'),
  ).toHaveLength(10);
  expect(
    gardenThreeLesson.questions.filter((q) => q.rule.kind === 'reflection'),
  ).toHaveLength(2);
  expect(
    gardenThreeLesson.questions
      .filter((q) => q.id.includes('-q-character-'))
      .map((q) => (q.rule.kind === 'choice' ? q.rule.value : null))
      .join(''),
  ).toBe(gardenThreePageAudit.recognize);
  expect(
    gardenThreeLesson.questions.find((q) => q.id.endsWith('-manual-write'))!
      .material,
  ).toContain('会写午、下');
  expect(
    gardenThreeLesson.steps.find(
      (step) => step.title === '在图里找事物与数量词',
    )!.text,
  ).toContain('鸟未指定品种');
});
it('derives every table and picture answer from the displayed original materials and changes practice conditions in reviews', () => {
  for (const q of [
    ...gardenThreeLesson.questions,
    ...gardenThreeLesson.reviewQuestions!,
  ]) {
    if (q.rule.kind !== 'choice') continue;
    const expected = q.rule.value;
    expect(q.choices!.filter((c) => c.id === expected)).toHaveLength(1);
    for (const c of q.choices!)
      expect(evaluate(q.rule, c.id)).toBe(c.id === expected);
    if (q.visual?.kind === 'timetable') {
      const table = q.visual;
      const day = table.days.findIndex((day) => q.prompt.includes(day));
      if (q.id.includes('-day-')) {
        expect(expected).toBe(
          table.rows.map((row) => row.subjects[day]).join(' → '),
        );
        continue;
      }
      const row = table.rows.find((row) => q.prompt.includes(row.period))!;
      expect(day).toBeGreaterThanOrEqual(0);
      expect(expected).toBe(row.subjects[day]);
    }
    if (q.id.includes('-picture-') && q.visual?.kind === 'nature-cards') {
      const index = Number(q.id.split('-').at(-1));
      const object = (['tree', 'bird', 'flower'] as const)[index]!;
      const count = plantCards(q.visual.variant === 'review').filter(
        (c) => c.object === object,
      ).length;
      const unit = { tree: '棵', bird: '只', flower: '朵' }[object];
      const noun = { tree: '树', bird: '鸟', flower: '花' }[object];
      expect(expected).toBe(`${count}${unit}${noun}`);
      expect(q.material).toContain('原创');
    }
    if (q.id.includes('-song-'))
      expect(q.material).toContain('共读教材印刷第44页');
  }
  for (const q of gardenThreeLesson.reviewQuestions!)
    expect(
      gardenThreeLesson.questions.some(
        (main) =>
          JSON.stringify([main.prompt, main.material, main.visual]) ===
          JSON.stringify([q.prompt, q.material, q.visual]),
      ),
    ).toBe(false);
});
it('retains wrong-first reading history, actual task and reflection evidence and exact backups, with genuinely different missed-skill review', () => {
  const now = '2026-10-01T00:00:00.000Z';
  const s = createSession(gardenThreeLesson, chineseBooks[0]!.id, 'child', {
    seed: 12,
    now,
  });
  s.phase = 'practice';
  for (const [i, q] of s.questions.entries()) {
    if (q.id.endsWith('-q-song-animal') && q.rule.kind === 'choice') {
      const expected = q.rule.value;
      s.responses[i] = submitResponse(
        q,
        {
          ...s.responses[i]!,
          draft: q.choices!.find((c) => c.id !== expected)!.id,
        },
        now,
      );
    }
    s.responses[i] = submitResponse(
      q,
      {
        ...s.responses[i]!,
        draft: (() => {
          if (q.rule.kind === 'choice') return q.rule.value;
          return q.rule.kind === 'manual'
            ? 'confirmed'
            : '还想读词。\n明天再试。';
        })(),
      },
      now,
    );
    if (q.rule.kind !== 'choice')
      expect(s.responses[i]!.submissions.at(-1)!.correct).toBeNull();
  }
  expect(statistics(s).manual).toBe(10);
  expect(s.responses.filter((r) => r.submissions.length === 2)).toHaveLength(1);
  const review = newReviewQuestions(gardenThreeLesson, s, [s]);
  expect(review).toHaveLength(1);
  expect(review[0]!.rule).toEqual({ kind: 'choice', value: '马' });
  expect(evaluate(review[0]!.rule, '鸟')).toBe(false);
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

it('reads complete ordered columns without altering the old timetable supplement or version-one snapshots', () => {
  expect(gardenThreeLesson.version).toBe(2);
  const added = gardenThreeLesson.questions.filter((q) =>
    q.id.includes('-q-day-'),
  );
  expect(added).toHaveLength(3);
  expect(
    added.map((q) => (q.rule.kind === 'choice' ? q.rule.value : null)),
  ).toEqual(['语文 → 数学 → 音乐', '数学 → 科学 → 美术', '美术 → 语文 → 体育']);
  expect(evaluate(added[1]!.rule, '美术 → 科学 → 数学')).toBe(false);
  expect(evaluate(added[1]!.rule, '数学 → 科学')).toBe(false);
  const actual = gardenThreeLesson.questions.find((q) =>
    q.id.endsWith('-manual-whole-day'),
  )!;
  expect(actual.rule).toEqual({ kind: 'manual' });
  expect(actual.prompt).toContain('空格不补猜课程');
  const old = createSession(
    {
      ...gardenThreeLesson,
      version: 1,
      questions: gardenThreeLesson.questions.filter(
        (q) => !added.includes(q) && q !== actual,
      ),
    },
    chineseBooks[0]!.id,
    'child',
    { seed: 42, now: '2026-10-04T00:00:00.000Z' },
  );
  expect(old.questions).toHaveLength(41);
  expect(timetableLesson.questions).toHaveLength(8);
  const restored = parseBackup(
    exportBackup({
      schemaVersion: 1,
      activeProfileId: 'child',
      profiles: [
        {
          id: 'child',
          nickname: '测试档案',
          createdAt: '2026-10-04T00:00:00.000Z',
        },
      ],
      sessions: [old],
    }),
  ).data.sessions[0];
  expect(restored).toEqual(old);
});
