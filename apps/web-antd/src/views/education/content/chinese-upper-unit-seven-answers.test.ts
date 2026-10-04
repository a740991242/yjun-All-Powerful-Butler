import { expect, it } from 'vitest';

import { evaluate } from '../learning/engine';
import { gardenSevenLesson } from './chinese-garden-seven';
import { twoTreasuresLesson } from './chinese-two-treasures';
import { littleBoatLesson, shadowLesson } from './chinese-unit-seven-reading';

it('independently checks every objective answer in both upper unit-seven practice forms', () => {
  const cases = [
    {
      lesson: littleBoatLesson,
      recognize: '船弯儿两头在里看见闪',
      main: ['小小', '弯弯', '闪闪', '蓝蓝', '小小的船里', '小船', 'ér', '月'],
      review: ['船', '月儿', '星星', '天', '星星与天', '诗中想象', 'de', '见'],
    },
    {
      lesson: shadowLesson,
      recognize: '影前常黑狗左右它好朋友',
      main: ['小黑狗', '前与后', 'zi', '在', '小安', '后'],
      review: ['好朋友', '左与右', 'you', '我', '小禾', '右'],
    },
    {
      lesson: twoTreasuresLesson,
      recognize: '件有和做也办到又才能',
      main: ['做工', '双手与大脑', 'hé', '和', '先想办法'],
      review: ['思考', '用手又用脑', 'zuò', '才', '实际尝试'],
    },
    {
      lesson: gardenSevenLesson,
      recognize: '爷奶叔姐妹',
      main: [
        '爷爷',
        '才',
        '山',
        '爸',
        '日',
        '昨',
        '东',
        '北',
        '得瓜',
        '始于足下',
        '轻声清楚地询问',
        '小猴子',
        '井里',
        '小猴子',
        '不见了',
      ],
      review: [
        '妹妹',
        '四',
        '心',
        '妈',
        '女',
        '春',
        '西',
        '南',
        '得豆',
        '更进一步',
        '适当提高声音让全班听清',
        '老猴子',
        '天上',
        '老猴子',
        '不用捞了',
      ],
    },
  ];
  let checked = 0;
  for (const { lesson, recognize, main, review } of cases) {
    for (const [questions, tail] of [
      [lesson.questions, main],
      [lesson.reviewQuestions!, review],
    ] as const) {
      const answers = [...recognize, ...tail];
      const objective = questions.filter((q) => q.rule.kind === 'choice');
      expect(objective).toHaveLength(answers.length);
      for (const [index, question] of objective.entries()) {
        const answer = answers[index]!;
        expect(question.rule).toEqual({ kind: 'choice', value: answer });
        expect(question.choices!.filter((c) => c.id === answer)).toHaveLength(
          1,
        );
        for (const choice of question.choices!)
          expect(evaluate(question.rule, choice.id)).toBe(choice.id === answer);
        checked++;
      }
    }
  }
  expect(checked).toBe(140);
});
