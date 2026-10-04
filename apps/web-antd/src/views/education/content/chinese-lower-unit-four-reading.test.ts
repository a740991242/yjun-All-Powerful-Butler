import type { Lesson } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { lowerCharacters } from './characters';
import { chineseBooks } from './chinese';
import {
  lowerUnitFourReadingPageAudits as audits,
  lowerUnitFourReadingLessons as lessons,
  lowerUnitFourReadingSource as source,
} from './chinese-lower-unit-four-reading';

it('checks all three actual reading scopes and preserves the required recitation only for the ancient poem', () => {
  for (const [
    id,
    pages,
    rec,
    write,
    author,
    rad,
    extra,
    n,
    m,
    steps,
    recite,
  ] of [
    [
      'u4-1',
      [39],
      '静思床疑举望低故',
      '思前故床地乡',
      '李白',
      [],
      '',
      14,
      5,
      6,
      true,
    ],
    [
      'u4-2',
      [40, 41],
      '胆敢勇讲窗乱拉样笑再睡觉',
      '色讲笑把样再',
      '柯岩',
      ['提手旁'],
      '',
      29,
      7,
      7,
      false,
    ],
    [
      'u4-3',
      [42, 43],
      '端粽节总煮盼米枣甜分鲜肉',
      '节间吃米分肉',
      '屠再华',
      ['米字旁'],
      '了liǎo',
      19,
      9,
      8,
      false,
    ],
  ] as const) {
    const l = lessons[id]!;
    expect(
      chineseBooks[1]!.units
        .flatMap((u) => u.lessons)
        .find((x) => x.id === `cl-${id}`),
    ).toBe(l);
    expect(audits.find((a) => a.itemId === id)).toMatchObject({
      pages,
      recognize: rec,
      write,
      author,
      newRadicals: rad,
      additionalReadings: extra,
      reciteRequired: recite,
    });
    expect(lowerCharacters[id]!.recognize).toBe(rec);
    expect([...lowerCharacters[id]!.write].toSorted()).toEqual(
      [...write].toSorted(),
    );
    expect(lowerCharacters[id]!.writeVerified).toBe(true);
    expect(l.questions.filter((q) => q.rule.kind === 'choice')).toHaveLength(n);
    expect(l.reviewQuestions).toHaveLength(n);
    expect(l.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(m);
    expect(
      l.questions.filter((q) => q.rule.kind === 'reflection'),
    ).toHaveLength(2);
    expect(l.steps).toHaveLength(steps);
    expect(l.questions.some((q) => q.id.endsWith('-manual-recite'))).toBe(
      recite,
    );
  }
  for (const k of ['isbn', 'editionDate', 'printingDate'] as const)
    expect(source[k]).toBeNull();
  for (const word of [
    '胆子',
    '胆量',
    '大胆',
    '勇敢',
    '勇气',
    '勇士',
    '样子',
    '一样',
    '花样',
    '再见',
    '再三',
    '再次',
  ]) {
    expect(lessons['u4-2']!.steps[3]!.text).toContain(word);
  }
  expect(
    lessons['u4-3']!.questions.find((q) => q.id.endsWith('-manual-extension'))!
      .prompt,
  ).toContain('选做');
});
it('changes roles, word positions and familiar readings in every review without rewriting literary facts', () => {
  for (const [item, key, main, next] of [
    ['u4-1', 'light', '明月', '地上霜'],
    ['u4-1', 'action', '举头', '低头'],
    ['u4-1', 'sequence', '之前', '之后'],
    ['u4-2', 'helpers', '妈妈', '爸爸'],
    ['u4-2', 'word-11', '再', '次'],
    ['u4-2', 'radical', '提手旁', '拉'],
    ['u4-3', 'reading', 'liǎo', 'le'],
    ['u4-3', 'sharing', '邻居', '传说'],
    ['u4-3', 'radical', '米字旁', '粽'],
  ]) {
    const l = lessons[item!]!;
    const q = l.questions.find((q) => q.id.endsWith(`-q-${key}`))!;
    const n = l.reviewQuestions!.find((q) => q.id.endsWith(`-r-${key}`))!;
    expect(evaluate(q.rule, main!)).toBe(true);
    expect(evaluate(n.rule, next!)).toBe(true);
    expect(evaluate(n.rule, main!)).toBe(false);
  }
  expect(
    lessons['u4-1']!.questions.find((q) => q.id.endsWith('-q-light'))!.material,
  ).toBe('床前明月光，疑是地上霜。\n举头望明月，低头思故乡。');
  for (const l of Object.values(lessons)) {
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
  }
});
it.each([
  ['u4-1', 'action', '低头'],
  ['u4-2', 'helpers', '爸爸'],
  ['u4-3', 'reading', 'le'],
] as const)(
  'keeps wrong-first, manual and reflection evidence in backup and selective changed review %s',
  (item, key, next) => {
    const l = lessons[item]!;
    const now = '2026-10-01T00:00:00.000Z';
    const s = createSession(l, chineseBooks[1]!.id, 'child', { seed: 17, now });
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
              : '下一次想再读一组词，这是未来计划。';
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
    const rs = newReviewQuestions(l, s, [s]);
    expect(rs).toHaveLength(1);
    expect(rs[0]!.rule).toEqual({ kind: 'choice', value: next });
    expect(evaluate(rs[0]!.rule, old)).toBe(false);
    expect(
      parseBackup(
        exportBackup({
          schemaVersion: 1,
          activeProfileId: 'child',
          profiles: [{ id: 'child', nickname: '测试', createdAt: now }],
          sessions: [s],
        }),
      ).data.sessions[0],
    ).toEqual(s);
  },
);

it('offers exactly the two characters named by each writing prompt in main and review', () => {
  for (const [item, main, review] of [
    ['u4-1', ['思', '静'], ['乡', '疑']],
    ['u4-2', ['色', '胆'], ['再', '窗']],
    ['u4-3', ['节', '端'], ['肉', '枣']],
  ] as const) {
    const lesson = lessons[item]!;
    expect(lesson.version).toBe(2);
    for (const [questions, expected, prefix] of [
      [lesson.questions, main, 'q'],
      [lesson.reviewQuestions!, review, 'r'],
    ] as const) {
      const question = questions.find(
        (q) => q.id === `cl-${item}-${prefix}-writing`,
      )!;
      expect(question.prompt).toContain(`${expected[0]}与${expected[1]}`);
      expect(question.choices?.map((choice) => choice.id)).toEqual(expected);
      expect(lowerCharacters[item]!.write).toContain(expected[0]);
      expect(lowerCharacters[item]!.write).not.toContain(expected[1]);
      for (const candidate of expected)
        expect(evaluate(question.rule, candidate)).toBe(
          candidate === expected[0],
        );
    }
  }
});

const oldWritingQuestions = [
  [
    'u4-1',
    [
      {
        id: 'cl-u4-1-q-writing',
        knowledge: 'cl-u4-1-writing',
        prompt: '思与静中，本课会写字是哪项？',
        material: '先与家长共读指定原书页，按本题信息观察。',
        choices: [
          {
            id: '思',
            label: '思',
          },
          {
            id: '乡',
            label: '乡',
          },
          {
            id: '疑',
            label: '疑',
          },
        ],
        rule: {
          kind: 'choice',
          value: '思',
        },
        hint: '先看指定字词与原书信息，需要时请家长帮读。',
        explanation: '八认六写分开，实际写字按规范示范。',
      },
      {
        id: 'cl-u4-1-r-writing',
        knowledge: 'cl-u4-1-writing',
        prompt: '乡与疑中，本课会写字是哪项？',
        material: '先与家长共读指定原书页，按本题信息观察。',
        choices: [
          {
            id: '思',
            label: '思',
          },
          {
            id: '乡',
            label: '乡',
          },
          {
            id: '疑',
            label: '疑',
          },
        ],
        rule: {
          kind: 'choice',
          value: '乡',
        },
        hint: '先看指定字词与原书信息，需要时请家长帮读。',
        explanation: '八认六写分开，实际写字按规范示范。',
      },
    ],
  ],
  [
    'u4-2',
    [
      {
        id: 'cl-u4-2-q-writing',
        knowledge: 'cl-u4-2-writing',
        prompt: '色与胆中，本课会写字是哪项？',
        material: '先与家长共读指定原书页，按本题信息观察。',
        choices: [
          {
            id: '色',
            label: '色',
          },
          {
            id: '再',
            label: '再',
          },
          {
            id: '窗',
            label: '窗',
          },
        ],
        rule: {
          kind: 'choice',
          value: '色',
        },
        hint: '先看指定字词与原书信息，需要时请家长帮读。',
        explanation: '六写色讲笑把样再，不能把全部会认字都当会写。',
      },
      {
        id: 'cl-u4-2-r-writing',
        knowledge: 'cl-u4-2-writing',
        prompt: '再与窗中，本课会写字是哪项？',
        material: '先与家长共读指定原书页，按本题信息观察。',
        choices: [
          {
            id: '色',
            label: '色',
          },
          {
            id: '再',
            label: '再',
          },
          {
            id: '窗',
            label: '窗',
          },
        ],
        rule: {
          kind: 'choice',
          value: '再',
        },
        hint: '先看指定字词与原书信息，需要时请家长帮读。',
        explanation: '六写色讲笑把样再，不能把全部会认字都当会写。',
      },
    ],
  ],
  [
    'u4-3',
    [
      {
        id: 'cl-u4-3-q-writing',
        knowledge: 'cl-u4-3-writing',
        prompt: '节与端中，本课会写字是哪项？',
        material: '先与家长共读指定原书页，按本题信息观察。',
        choices: [
          {
            id: '节',
            label: '节',
          },
          {
            id: '肉',
            label: '肉',
          },
          {
            id: '枣',
            label: '枣',
          },
        ],
        rule: {
          kind: 'choice',
          value: '节',
        },
        hint: '先看指定字词与原书信息，需要时请家长帮读。',
        explanation: '六写节间吃米分肉与十二会认字分开。',
      },
      {
        id: 'cl-u4-3-r-writing',
        knowledge: 'cl-u4-3-writing',
        prompt: '肉与枣中，本课会写字是哪项？',
        material: '先与家长共读指定原书页，按本题信息观察。',
        choices: [
          {
            id: '节',
            label: '节',
          },
          {
            id: '肉',
            label: '肉',
          },
          {
            id: '枣',
            label: '枣',
          },
        ],
        rule: {
          kind: 'choice',
          value: '肉',
        },
        hint: '先看指定字词与原书信息，需要时请家长帮读。',
        explanation: '六写节间吃米分肉与十二会认字分开。',
      },
    ],
  ],
] as const;
it('restores v1 writing choices and wrong-first histories without replacing them with v2', () => {
  for (const [item, questions] of oldWritingQuestions) {
    const now = '2026-10-04T00:00:00.000Z';
    const oldLesson: Lesson = structuredClone(lessons[item]!);
    oldLesson.version = 1;
    oldLesson.questions = JSON.parse(JSON.stringify(questions));
    const session = createSession(oldLesson, chineseBooks[1]!.id, 'child', {
      seed: 17,
      now,
    });
    session.phase = 'practice';
    for (const [index, question] of session.questions.entries()) {
      if (question.rule.kind !== 'choice')
        throw new Error('Expected old writing choice');
      const value = question.rule.value;
      const wrong = question.choices!.find((choice) => choice.id !== value)!.id;
      session.responses[index] = submitResponse(
        question,
        { ...session.responses[index]!, draft: wrong },
        now,
      );
      session.responses[index] = submitResponse(
        question,
        { ...session.responses[index]!, draft: value },
        now,
      );
      expect(
        session.responses[index]!.submissions.map(
          (submission) => submission.correct,
        ),
      ).toEqual([false, true]);
    }
    const restored = parseBackup(
      exportBackup({
        schemaVersion: 1,
        activeProfileId: 'child',
        profiles: [{ id: 'child', nickname: '测试', createdAt: now }],
        sessions: [session],
      }),
    ).data.sessions[0]!;
    expect(restored).toEqual(session);
    expect(restored.lessonVersion).toBe(1);
    expect(restored.questions.map((q) => q.choices)).toEqual(
      questions.map((q) => q.choices),
    );
    expect(restored.questions[0]!.choices).not.toEqual(
      lessons[item]!.questions.find((q) => q.id.endsWith('-q-writing'))!
        .choices,
    );
  }
});
