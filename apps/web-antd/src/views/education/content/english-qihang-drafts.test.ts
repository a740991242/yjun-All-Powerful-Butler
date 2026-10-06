import type { Answer, Question } from '../learning/types';

import { describe, expect, it } from 'vitest';

import { evaluate, validAnswer } from '../learning/engine';
import { required } from '../learning/required';
import { englishQihangDraftLessons } from './english-qihang-drafts';

const expectedGreetings = [
  '问好',
  '问好',
  '很高兴认识你',
  'Let’s play!',
  'OK!',
  '两句都能问好',
];
const expectedNames = [
  '我叫An',
  '说话者',
  'I’m An.／My name is An.',
  'Bo',
  '不需要',
];
function checkOptions(question: Question, expected: Answer) {
  expect(evaluate(question.rule, expected)).toBe(true);
  expect(
    question.choices?.filter((choice) => choice.id === expected),
  ).toHaveLength(1);
  for (const choice of question.choices ?? []) {
    expect(evaluate(question.rule, choice.id)).toBe(choice.id === expected);
  }
}

describe('原创英语准备课的交际与数量', () => {
  it('问候的两种形式均合法，邀请与同意按给定情境判题', () => {
    const lesson = required(englishQihangDraftLessons[0]);
    expect(
      lesson.questions.filter((question) => question.rule.kind === 'choice'),
    ).toHaveLength(6);
    expectedGreetings.forEach((answer, index) => {
      checkOptions(required(lesson.questions[index]), answer);
    });
    checkOptions(required(lesson.reviewQuestions?.[0]), 'Nice to meet you.');
    checkOptions(required(lesson.reviewQuestions?.[1]), 'Let’s play!');
  });

  it('自我介绍跟随本次说话者，换名字后的复习不沿用旧答案', () => {
    const lesson = required(englishQihangDraftLessons[1]);
    expect(
      lesson.questions.filter((question) => question.rule.kind === 'choice'),
    ).toHaveLength(5);
    expectedNames.forEach((answer, index) => {
      checkOptions(required(lesson.questions[index]), answer);
    });
    checkOptions(required(lesson.reviewQuestions?.[0]), 'Lin');
    checkOptions(required(lesson.reviewQuestions?.[1]), 'I’m Lin.');
  });

  it('六个数字词全部双向覆盖，复习改变顺序且图与问题一致', () => {
    const lesson = required(englishQihangDraftLessons[2]);
    const pairs = [
      [1, 'one'],
      [2, 'two'],
      [3, 'three'],
      [4, 'four'],
      [5, 'five'],
      [6, 'six'],
    ] as const;
    pairs.forEach(([count, word], index) => {
      const picture = required(lesson.questions[index]);
      expect(picture.visual).toEqual({ kind: 'count', count });
      checkOptions(picture, word);
      const meaning = required(lesson.questions[index + 6]);
      expect(meaning.prompt).toContain(word);
      expect(evaluate(meaning.rule, count)).toBe(true);
      expect(evaluate(meaning.rule, count === 6 ? 1 : count + 1)).toBe(false);
      expect(evaluate(meaning.rule, 0)).toBe(false);
      expect(validAnswer(meaning.rule, null)).toBe(false);
    });
    const order = ['four', 'one', 'six', 'two', 'five', 'three'];
    const counts = [4, 1, 6, 2, 5, 3];
    order.forEach((word, index) => {
      const question = required(lesson.reviewQuestions?.[index]);
      expect(question.visual).toEqual({ kind: 'count', count: counts[index] });
      checkOptions(question, word);
    });
  });

  it('不将样例数字、未知数量或拼写能力代替真实点数', () => {
    const lesson = required(englishQihangDraftLessons[3]);
    expect(
      lesson.questions.filter((question) => question.rule.kind === 'choice'),
    ).toHaveLength(6);
    const expected = [
      'two',
      'five',
      '不相配',
      '6个点',
      '不能，先实际数',
      '请陪学者代写，再自己核对5个点',
    ];
    expected.forEach((answer, index) => {
      checkOptions(required(lesson.questions[index]), answer);
    });
    checkOptions(required(lesson.reviewQuestions?.[0]), 'three');
    checkOptions(required(lesson.reviewQuestions?.[1]), '相配');
    checkOptions(required(lesson.reviewQuestions?.[2]), '待实际数，不填样例');
  });

  it('实际听说、对话和制作只有人工记录，反思不评分，草稿不开放', () => {
    const ids = new Set<string>();
    for (const lesson of englishQihangDraftLessons) {
      expect(lesson.status).toBe('preparing');
      for (const question of [
        ...lesson.questions,
        ...(lesson.reviewQuestions ?? []),
      ]) {
        expect(ids.has(question.id)).toBe(false);
        ids.add(question.id);
        if (question.rule.kind === 'manual') {
          expect(evaluate(question.rule, 'confirmed')).toBeNull();
          expect(validAnswer(question.rule, '未做')).toBe(false);
          expect(validAnswer(question.rule, null)).toBe(false);
          expect(validAnswer(question.rule, 0)).toBe(false);
        }
        if (question.rule.kind === 'reflection') {
          expect(
            evaluate(question.rule, '还没有听说，只做了文字配对。'),
          ).toBeNull();
          expect(validAnswer(question.rule, '')).toBe(false);
          expect(validAnswer(question.rule, null)).toBe(false);
        }
      }
    }
  });

  it('颜色题按情境和本次图例判定，不把个人喜好当固定答案', () => {
    const lesson = required(englishQihangDraftLessons[4]);
    const expected = [
      '红色',
      '蓝色',
      '黄色',
      '绿色',
      '橙色',
      'What’s the colour?',
      'It’s blue.',
      '我喜欢绿色',
      'blue',
      '橙色',
      '5',
    ];
    expect(
      lesson.questions.filter((question) => question.rule.kind === 'choice'),
    ).toHaveLength(11);
    expected.forEach((answer, index) =>
      checkOptions(required(lesson.questions[index]), answer),
    );
    checkOptions(required(lesson.reviewQuestions?.[0]), 'It’s yellow.');
    checkOptions(required(lesson.reviewQuestions?.[1]), 'red');
    checkOptions(
      required(lesson.reviewQuestions?.[2]),
      '不必，可以分别表达喜好',
    );
    expect(
      lesson.questions.find((question) => question.id.endsWith('-mix'))?.rule,
    ).toEqual({ kind: 'manual' });
    expect(
      lesson.questions.find((question) => question.id.endsWith('-today'))?.rule,
    ).toEqual({ kind: 'reflection' });
    expect(lesson.steps[3]?.text).toContain('实际色调受颜料和比例影响');
    expect(lesson.steps[3]?.text).toContain('purple为这次探索的补充');
  });

  it('六种用品包括pencil case，换物品复习、未知物品与真实拥有分开', () => {
    const lesson = required(englishQihangDraftLessons[5]);
    const expected = [
      '铅笔',
      '尺子',
      '书包',
      '橡皮',
      '书',
      '笔盒或笔袋',
      'Don’t worry.',
      'Here’s a ruler.',
      '一起分享吧',
      'Thank you!',
      '不能，先实际观察',
      'ruler',
    ];
    expect(
      lesson.questions.filter((question) => question.rule.kind === 'choice'),
    ).toHaveLength(12);
    expected.forEach((answer, index) =>
      checkOptions(required(lesson.questions[index]), answer),
    );
    checkOptions(required(lesson.reviewQuestions?.[0]), 'Here’s a book.');
    checkOptions(
      required(lesson.reviewQuestions?.[1]),
      '不同，前者是笔盒或笔袋，后者是铅笔',
    );
    checkOptions(required(lesson.reviewQuestions?.[2]), 'book');
    expect(
      lesson.questions.find((question) => question.id.endsWith('-own'))?.rule,
    ).toEqual({ kind: 'manual' });
  });

  it('八个人物场所设施词齐全，提议、模拟、实做与my/our区别保留', () => {
    const lesson = required(englishQihangDraftLessons[6]);
    const expected = [
      '教室',
      '教师',
      '黑板',
      '课桌',
      '椅子',
      '地面',
      '窗户',
      '门',
      '早晨问好',
      '我们的',
      'Let’s clean the desk.',
      '不能证明，须实际做并观察',
      'chair',
    ];
    expect(
      lesson.questions.filter((question) => question.rule.kind === 'choice'),
    ).toHaveLength(13);
    expected.forEach((answer, index) =>
      checkOptions(required(lesson.questions[index]), answer),
    );
    checkOptions(required(lesson.reviewQuestions?.[0]), '我的');
    checkOptions(
      required(lesson.reviewQuestions?.[1]),
      'Let’s clean the door.',
    );
    checkOptions(required(lesson.reviewQuestions?.[2]), 'chair');
    expect(
      lesson.questions.find((question) => question.id.endsWith('-tidy'))?.rule,
    ).toEqual({ kind: 'manual' });
    expect(
      lesson.questions.find((question) => question.id.endsWith('-plan'))?.rule,
    ).toEqual({ kind: 'reflection' });
    expect(lesson.parentTip).toContain('只是教案引用的学生单元起点');
  });
});
