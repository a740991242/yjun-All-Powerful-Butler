import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { upperCharacters } from './characters';
import { chineseBooks } from './chinese';
import { consonantPacks } from './chinese-consonants';
import { firstPhonics } from './chinese-first-packs';
import { iuuPhonics } from './chinese-iuu';
import { unitTwoChineseLessons, unitTwoPageAudits } from './chinese-unit-two';

it('opens actual revised second-unit scopes independently and preserves old supplements and unknown publication details', () => {
  expect(unitTwoPageAudits.map((audit) => audit.pages)).toEqual([
    [20, 21],
    [22, 23],
    [24, 25],
    [26, 27],
    [28, 29, 30, 31],
  ]);
  const lessons = chineseBooks[0]!.units.flatMap((unit) => unit.lessons);
  for (const audit of unitTwoPageAudits) {
    expect(audit.isbn).toBeNull();
    expect(audit.editionDate).toBeNull();
    expect(audit.printingDate).toBeNull();
    if (audit.recognize) {
      expect(audit.recognize).toBe(upperCharacters[audit.itemId]!.recognize);
      expect(audit.write).toBe(upperCharacters[audit.itemId]!.write);
    }
    const lesson = unitTwoChineseLessons[audit.itemId]!;
    expect(lessons).toContain(lesson);
    expect(lesson.id).toBe(`cu-${audit.itemId}`);
    expect(lesson.title).toBe(audit.title);
    expect(lesson.review.notes).toContain('第三方原书公开预览');
    expect(lesson.review.notes).toContain('未知');
  }
  for (const supplement of [
    firstPhonics,
    iuuPhonics,
    consonantPacks['u2-3'],
    consonantPacks['u2-4'],
  ])
    expect(lessons).toContain(supplement);
  expect(unitTwoChineseLessons['u2-2']!.steps[0]!.text).toContain('不合并y w');
  expect(
    unitTwoChineseLessons['u2-4']!.questions.find((question) =>
      question.id.endsWith('-q-umlaut'),
    )!.rule,
  ).toEqual({ kind: 'choice', value: 'nǚ' });
  expect(
    unitTwoChineseLessons['u2-4']!.reviewQuestions!.find((question) =>
      question.id.endsWith('-r-umlaut'),
    )!.rule,
  ).toEqual({ kind: 'choice', value: 'lǜ' });
  expect(
    unitTwoChineseLessons['u2-5']!.questions.find((question) =>
      question.id.endsWith('-manual-write'),
    )!.material,
  ).toBe('会写范围：九、王。');
});
it('validates every answer and preserves manual/reflection evidence, a first error and different review material in snapshots', () => {
  const now = '2026-10-01T00:00:00.000Z';
  for (const lesson of Object.values(unitTwoChineseLessons)) {
    const session = createSession(lesson, chineseBooks[0]!.id, 'child', {
      seed: 12,
      now,
    });
    session.phase = 'practice';
    let missed: string | undefined;
    for (const [index, question] of session.questions.entries()) {
      if (question.rule.kind === 'choice') {
        const expected = question.rule.value;
        expect(
          question.choices!.filter((choice) => choice.id === expected),
        ).toHaveLength(1);
        expect(evaluate(question.rule, expected)).toBe(true);
        for (const choice of question.choices!)
          if (choice.id !== expected)
            expect(evaluate(question.rule, choice.id)).toBe(false);
        if (!missed) {
          missed = question.knowledge;
          session.responses[index] = submitResponse(
            question,
            {
              ...session.responses[index]!,
              draft: question.choices!.find((choice) => choice.id !== expected)!
                .id,
            },
            now,
          );
        }
      }
      const answer = (() => {
        if (question.rule.kind === 'choice') return question.rule.value;
        return question.rule.kind === 'manual'
          ? 'confirmed'
          : '还想练拼音\n请家长再示范。';
      })();
      session.responses[index] = submitResponse(
        question,
        { ...session.responses[index]!, draft: answer },
        now,
      );
      if (question.rule.kind !== 'choice')
        expect(
          session.responses[index]!.submissions.at(-1)!.correct,
        ).toBeNull();
    }
    expect(statistics(session).manual).toBe(
      lesson.questions.filter((question) => question.rule.kind === 'manual')
        .length,
    );
    const review = newReviewQuestions(lesson, session, [session]);
    expect(review).toHaveLength(1);
    expect(review[0]!.knowledge).toBe(missed);
    for (const question of lesson.reviewQuestions!) {
      const main = lesson.questions.find(
        (original) => original.knowledge === question.knowledge,
      )!;
      expect(
        JSON.stringify([question.prompt, question.material, question.visual]),
      ).not.toBe(JSON.stringify([main.prompt, main.material, main.visual]));
      if (question.rule.kind !== 'choice')
        throw new Error('expected objective');
      const expected = question.rule.value;
      expect(question.choices!.some((choice) => choice.id === expected)).toBe(
        true,
      );
    }
    expect(
      parseBackup(
        exportBackup({
          schemaVersion: 1,
          activeProfileId: 'child',
          profiles: [{ id: 'child', nickname: '陪读', createdAt: now }],
          sessions: [session],
        }),
      ).data.sessions[0],
    ).toEqual(session);
  }
});
it('anchors textbook-dependent modern reading and avoids fake personal info or fabricated audio assessment', () => {
  const garden = unitTwoChineseLessons['u2-5']!;
  const fields = garden.questions.filter((question) =>
    question.id.includes('-q-field-'),
  );
  expect(fields).toHaveLength(3);
  expect(fields.every((question) => question.material?.includes('虚构'))).toBe(
    true,
  );
  for (const question of garden.questions.filter((question) =>
    question.id.includes('-q-rabbit-'),
  ))
    expect(question.material).toContain('教材第');
  expect(
    garden.questions.find((question) => question.id.endsWith('-q-rabbit-seed'))!
      .rule,
  ).toEqual({ kind: 'choice', value: '菜子' });
  expect(
    garden.reviewQuestions!.find((question) =>
      question.id.endsWith('-r-rabbit-seed'),
    )!.rule,
  ).toEqual({ kind: 'choice', value: '一车白菜' });
  for (const lesson of Object.values(unitTwoChineseLessons))
    expect(lesson.parentTip).toMatch(/声音|发音|朗读/);
});

it('keeps the p31 erhua footnote scoped to its word, records actual speech manually and restores v1 snapshots unchanged', () => {
  const garden = unitTwoChineseLessons['u2-5']!;
  expect(garden.version).toBe(3);
  const main = garden.questions.find((q) => q.id === 'cu-u2-5-q-erhua')!;
  const fresh = garden.reviewQuestions!.find(
    (q) => q.id === 'cu-u2-5-r-erhua',
  )!;
  expect(evaluate(main.rule, '单独读一个ér音节')).toBe(false);
  expect(evaluate(main.rule, '每个儿字都不发音')).toBe(false);
  expect(evaluate(fresh.rule, 'nǎr')).toBe(true);
  expect(evaluate(fresh.rule, 'nǎ ér')).toBe(false);
  expect(main.material).toContain('第31页脚注');
  const oral = garden.questions.find((q) => q.id === 'cu-u2-5-manual-erhua')!;
  expect(oral.rule).toEqual({ kind: 'manual' });
  expect(oral.prompt).toContain('不自动评价');
  const now = '2026-10-04T00:00:00.000Z';
  const current = createSession(garden, chineseBooks[0]!.id, 'child', {
    now,
    seed: 31,
  });
  const mainIndex = current.questions.findIndex((q) => q.id === main.id);
  current.responses[mainIndex] = submitResponse(
    main,
    {
      ...current.responses[mainIndex]!,
      draft: '单独读一个ér音节',
    },
    now,
  );
  expect(newReviewQuestions(garden, current, [current])).toEqual([fresh]);
  const oralIndex = current.questions.findIndex((q) => q.id === oral.id);
  current.responses[oralIndex] = submitResponse(
    oral,
    {
      ...current.responses[oralIndex]!,
      draft: 'confirmed',
    },
    now,
  );
  expect(current.responses[oralIndex]!.submissions[0]!.correct).toBeNull();
  const old = createSession(
    {
      ...garden,
      version: 1,
      questions: garden.questions.filter(
        (q) => q.id !== main.id && q.id !== oral.id,
      ),
    },
    chineseBooks[0]!.id,
    'child',
    { now, seed: 28 },
  );
  expect(old.questions).toHaveLength(34);
  expect(current.questions).toHaveLength(36);
  const restored = parseBackup(
    exportBackup({
      schemaVersion: 1,
      activeProfileId: 'child',
      profiles: [{ id: 'child', nickname: '测试档案', createdAt: now }],
      sessions: [old, current],
    }),
  ).data.sessions;
  expect(restored).toEqual([old, current]);
  expect(restored[0]!.questions.some((q) => q.id === main.id)).toBe(false);
});

it('changes the vowel comparison and locates all eight garden characters in word cards', () => {
  const vowels = unitTwoChineseLessons['u2-1']!;
  expect(vowels.version).toBe(2);
  const main = vowels.questions.find((q) => q.id.endsWith('-q-marks'))!;
  const fresh = vowels.reviewQuestions!.find((q) => q.id.endsWith('-r-marks'))!;
  expect(main.prompt).toContain('á与à');
  expect(fresh.prompt).toContain('ē与ě');
  expect(fresh.explanation).toContain('第一声');
  expect(fresh.explanation).toContain('第三声');
  expect(evaluate(fresh.rule, '不同')).toBe(true);
  expect(evaluate(fresh.rule, '相同')).toBe(false);
  const garden = unitTwoChineseLessons['u2-5']!;
  const cards = [
    '本子',
    '学校',
    '学校',
    '班级',
    '班级',
    '姓名',
    '姓名',
    '王老师',
  ];
  const positions = [0, 0, 1, 0, 1, 0, 1, 0];
  const targets = ['本', '学', '校', '班', '级', '姓', '名', '王'];
  targets.forEach((target, i) => {
    const q = garden.reviewQuestions!.find(
      (q) => q.id === `cu-u2-5-r-char-${i}`,
    )!;
    expect(q.material).toBe(cards[i]);
    expect(q.prompt).toContain(`第${positions[i]! + 1}个字`);
    expect(q.prompt).not.toContain(`“${target}”`);
    expect([...q.material!][positions[i]!]).toBe(target);
    expect(q.rule).toEqual({ kind: 'choice', value: target });
    for (const choice of q.choices!)
      expect(evaluate(q.rule, choice.id)).toBe(choice.id === target);
  });
  expect(unitTwoChineseLessons['u2-2']!.version).toBe(1);
  expect(unitTwoChineseLessons['u2-3']!.version).toBe(1);
  expect(unitTwoChineseLessons['u2-4']!.version).toBe(1);
});
it('keeps old garden recognition cards and their first errors intact after the version change', () => {
  const now = '2026-10-04T00:00:00.000Z';
  const garden = unitTwoChineseLessons['u2-5']!;
  const old = structuredClone(garden);
  old.version = 2;
  old.questions = old
    .reviewQuestions!.filter((q) => /-r-char-[0-7]$/.test(q.id))
    .map((q) => {
      if (q.rule.kind !== 'choice') throw new Error('expected choice');
      return {
        ...q,
        prompt: `选出字卡“${q.rule.value}”所表示的字。`,
        material: q.rule.value,
      };
    });
  const saved = createSession(old, chineseBooks[0]!.id, 'child', {
    seed: 31,
    now,
  });
  for (const [i, q] of saved.questions.entries()) {
    if (q.rule.kind !== 'choice') throw new Error('expected choice');
    const answer = q.rule.value;
    saved.responses[i] = submitResponse(
      q,
      {
        ...saved.responses[i]!,
        draft: q.choices!.find((c) => c.id !== answer)!.id,
      },
      now,
    );
    saved.responses[i] = submitResponse(
      q,
      { ...saved.responses[i]!, draft: answer },
      now,
    );
  }
  const restored = parseBackup(
    exportBackup({
      schemaVersion: 1,
      activeProfileId: 'child',
      profiles: [{ id: 'child', nickname: '验收', createdAt: now }],
      sessions: [saved],
    }),
  ).data.sessions[0]!;
  expect(restored).toEqual(saved);
  expect(restored.lessonVersion).toBe(2);
  expect(
    restored.responses.every(
      (r) =>
        r.submissions[0]!.correct === false &&
        r.submissions[1]!.correct === true,
    ),
  ).toBe(true);
  expect(newReviewQuestions(garden, restored, [restored])).toEqual([]);
});
