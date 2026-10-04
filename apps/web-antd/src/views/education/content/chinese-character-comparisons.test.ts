import type { Lesson } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { lowerCharacters } from './characters';
import { chineseBooks } from './chinese';

const lowerLessons = chineseBooks[1]!.units.flatMap((unit) => unit.lessons);
const correctedIds = [
  'cl-u3-1',
  'cl-u3-2',
  'cl-u3-3',
  'cl-u3-4',
  'cl-u4-4',
  'cl-u5-1',
  'cl-u7-1',
  'cl-u7-2',
  'cl-u7-3',
  'cl-u7-4',
  'cl-u7-5',
  'cl-u8-4',
];
const oldChoices = [
  [
    'cl-u3-1',
    'cl-u3-1-q-writing',
    '只比较己与背，本课会写哪字？',
    ['己', '河', '背'],
    '己',
  ],
  [
    'cl-u3-1',
    'cl-u3-1-r-writing',
    '只比较河与忽，本课会写哪字？',
    ['己', '河', '背'],
    '河',
  ],
  [
    'cl-u3-2',
    'cl-u3-2-q-writing',
    '只比较从与孤，哪字为本课会写？',
    ['从', '回', '孤'],
    '从',
  ],
  [
    'cl-u3-2',
    'cl-u3-2-r-writing',
    '只比较回与邻，哪字为本课会写？',
    ['从', '回', '孤'],
    '回',
  ],
  [
    'cl-u3-3',
    'cl-u3-3-q-writing',
    '只比较快与跳，本课新增会写哪字？',
    ['快', '毛', '跳'],
    '快',
  ],
  [
    'cl-u3-3',
    'cl-u3-3-r-writing',
    '只比较毛与轮，本课新增会写哪字？',
    ['快', '毛', '跳'],
    '毛',
  ],
  [
    'cl-u3-4',
    'cl-u3-4-q-writing',
    '只比较止与母，本园地会写字是哪项？',
    ['止', '元', '页'],
    '止',
  ],
  [
    'cl-u3-4',
    'cl-u3-4-r-writing',
    '只比较元与页，本园地会写字是哪项？',
    ['止', '元', '页'],
    '元',
  ],
  [
    'cl-u4-4',
    'cl-u4-4-q-writing',
    '册与台中，本园地新增会写是哪字？',
    ['册', '衣', '被'],
    '册',
  ],
  [
    'cl-u4-4',
    'cl-u4-4-r-writing',
    '衣与被中，本园地新增会写是哪字？',
    ['册', '衣', '被'],
    '衣',
  ],
  [
    'cl-u5-1',
    'cl-u5-1-q-writing',
    '物与蚂中，哪个是本课会写字？',
    ['物', '网', '蚁'],
    '物',
  ],
  [
    'cl-u5-1',
    'cl-u5-1-r-writing',
    '换字：网与蚁中，哪个是本课会写字？',
    ['物', '网', '蚁'],
    '网',
  ],
  [
    'cl-u7-1',
    'cl-u7-1-q-writing',
    '笔与具中，本课会写的是哪项？',
    ['笔', '知', '会认字都要求写'],
    '笔',
  ],
  [
    'cl-u7-1',
    'cl-u7-1-r-writing',
    '换字：知与仔中，本课会写的是哪项？',
    ['笔', '知', '会认字都要求写'],
    '知',
  ],
  [
    'cl-u7-2',
    'cl-u7-2-q-writing',
    '灯与钟中，本课会写的是哪项？',
    ['灯', '课', '所有会认都要写'],
    '灯',
  ],
  [
    'cl-u7-2',
    'cl-u7-2-r-writing',
    '换字：课与经中，本课会写的是哪项？',
    ['灯', '课', '所有会认都要写'],
    '课',
  ],
  [
    'cl-u7-3',
    'cl-u7-3-q-writing',
    '国与虎中，本课会写的是哪项？',
    ['国', '都', '任意答案都相同'],
    '国',
  ],
  [
    'cl-u7-3',
    'cl-u7-3-r-writing',
    '换字：都与熊中，本课会写的是哪项？',
    ['国', '都', '任意答案都相同'],
    '都',
  ],
  [
    'cl-u7-4',
    'cl-u7-4-q-writing',
    '着与抱中，本课会写的是哪项？',
    ['着', '兔', '任意答案都相同'],
    '着',
  ],
  [
    'cl-u7-4',
    'cl-u7-4-r-writing',
    '换字：兔与追中，本课会写的是哪项？',
    ['着', '兔', '任意答案都相同'],
    '兔',
  ],
  [
    'cl-u7-5',
    'cl-u7-5-q-writing',
    '巾与刷中，本园地新增会写字是哪项？',
    ['巾', '洗', '任意项都相同'],
    '巾',
  ],
  [
    'cl-u7-5',
    'cl-u7-5-r-writing',
    '换字：洗与澡中，新增会写字是哪项？',
    ['巾', '洗', '任意项都相同'],
    '洗',
  ],
  [
    'cl-u8-4',
    'cl-u8-4-q-writing',
    '本园地四会写中，页与顶选哪项？',
    ['页', '户', '八会认全部必须写'],
    '页',
  ],
  [
    'cl-u8-4',
    'cl-u8-4-r-writing',
    '换字：户与胖中会写哪项？',
    ['页', '户', '八会认全部必须写'],
    '户',
  ],
  [
    'cl-u3-1',
    'cl-u3-1-r-char-11',
    '换方向：己与已中，自己末字是哪项？',
    [
      '玩',
      '得',
      '急',
      '直',
      '哭',
      '跟',
      '忽',
      '然',
      '听',
      '喊',
      '快',
      '己',
      '背',
    ],
    '己',
  ],
] as const;

it('includes both named characters in all current Chinese two-character comparisons', () => {
  let checked = 0;
  for (const book of chineseBooks) {
    for (const lesson of book.units.flatMap((unit) => unit.lessons)) {
      for (const question of [
        ...lesson.questions,
        ...(lesson.reviewQuestions ?? []),
      ]) {
        if (question.rule.kind !== 'choice') continue;
        if (!/会写|自己末字/.test(question.prompt)) continue;
        const pair = /([\u4E00-\u9FFF])与([\u4E00-\u9FFF])/.exec(
          question.prompt,
        );
        if (!pair) continue;
        checked++;
        const labels = question.choices!.map((choice) => choice.id);
        expect(labels, question.id).toContain(pair[1]);
        expect(labels, question.id).toContain(pair[2]);
      }
    }
  }
  expect(checked).toBeGreaterThan(60);
});

it('limits corrected writing comparisons to the named pair and checks both against the independent character table', () => {
  for (const id of correctedIds) {
    const lesson = lowerLessons.find((candidate) => candidate.id === id)!;
    expect(lesson.version).toBe(id === 'cl-u7-1' ? 3 : 2);
    const scope = lowerCharacters[id.slice(3)]!.write;
    for (const questions of [lesson.questions, lesson.reviewQuestions!]) {
      const question = questions.find((candidate) =>
        candidate.id.endsWith('-writing'),
      )!;
      const pair = /([\u4E00-\u9FFF])与([\u4E00-\u9FFF])/.exec(
        question.prompt,
      )!;
      const candidates = [pair[1]!, pair[2]!];
      expect(question.choices!.map((choice) => choice.id)).toEqual(candidates);
      for (const candidate of candidates)
        expect(evaluate(question.rule, candidate), question.id).toBe(
          scope.includes(candidate),
        );
      expect(
        candidates.filter((candidate) => scope.includes(candidate)),
      ).toHaveLength(1);
    }
  }
  const question = lowerLessons
    .find((lesson) => lesson.id === 'cl-u3-1')!
    .reviewQuestions!.find((candidate) => candidate.id.endsWith('-r-char-11'))!;
  expect(question.choices!.map((choice) => choice.id)).toEqual(['己', '已']);
  expect(evaluate(question.rule, '己')).toBe(true);
  expect(evaluate(question.rule, '已')).toBe(false);
});

it('keeps v1 comparison snapshots and both submissions unchanged in exported learning records', () => {
  const now = '2026-10-04T00:00:00.000Z';
  for (const [id, questionId, prompt, labels, answer] of oldChoices) {
    const lesson = lowerLessons.find((candidate) => candidate.id === id)!;
    const current = [...lesson.questions, ...lesson.reviewQuestions!].find(
      (question) => question.id === questionId,
    )!;
    expect(current.prompt).toBe(prompt);
    expect(current.rule).toEqual({ kind: 'choice', value: answer });
    const old: Lesson = structuredClone(lesson);
    old.version = 1;
    old.questions = [
      {
        ...structuredClone(current),
        choices: labels.map((label) => ({ id: label, label })),
      },
    ];
    const session = createSession(old, chineseBooks[1]!.id, 'child', {
      seed: 13,
      now,
    });
    session.phase = 'practice';
    const question = session.questions[0]!;
    const wrong = labels.find((label) => label !== answer)!;
    session.responses[0] = submitResponse(
      question,
      { ...session.responses[0]!, draft: wrong },
      now,
    );
    session.responses[0] = submitResponse(
      question,
      { ...session.responses[0]!, draft: answer },
      now,
    );
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
    expect(
      restored.questions[0]!.choices!.map((choice) => choice.label),
    ).toEqual(labels);
    expect(
      restored.responses[0]!.submissions.map(
        (submission) => submission.correct,
      ),
    ).toEqual([false, true]);
    expect(restored.questions[0]!.choices).not.toEqual(current.choices);
  }
});
