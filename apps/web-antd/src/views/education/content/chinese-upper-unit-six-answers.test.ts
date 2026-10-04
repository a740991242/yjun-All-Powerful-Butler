import { expect, it } from 'vitest';

import { evaluate } from '../learning/engine';
import { duiyunLesson } from './chinese-duiyun';
import { flagLesson } from './chinese-flag';
import { gardenSixLesson } from './chinese-garden-six';
import { riyuemingLesson } from './chinese-riyueming';
import { schoolbagLesson } from './chinese-schoolbag';

it('checks every upper unit-six objective answer against separately stated reading and context expectations', () => {
  // Literal expectations keep an accidental change to the course answer rule
  // from silently changing the oracle. Spoken/written activities stay manual.
  const cases = [
    {
      lesson: duiyunLesson,
      recognize: '对歌雨风虫清绿桃红',
      main: ['雨', '风', '树', '虫', '水秀', '桃红', '红', '云', 'lǜ'],
      review: ['云', '雪', '花', '鸟', '山清', '柳绿', '绿', '山', 'yǔ'],
    },
    {
      lesson: riyuemingLesson,
      recognize: '力尖尘众双林森不条心金',
      main: [
        '明',
        '男',
        '尖',
        '尘',
        '从',
        '众',
        '林',
        '森',
        '眼泪',
        '幼小的植物',
        '不正或倾斜',
        '力气',
        '双手',
        '关心',
        '男',
      ],
      review: [
        '日＋月',
        '田＋力',
        '小＋大',
        '小＋土',
        '两个 人',
        '三个 人',
        '两个 木',
        '三个 木',
        '氵＋目',
        '艹＋田',
        '不＋正',
        '尘土',
        '金黄',
        '开心',
        '木',
      ],
    },
    {
      lesson: schoolbagLesson,
      recognize: '包尺作业笔刀宝贝少课早',
      main: [
        '橡皮',
        '尺子',
        '作业本',
        '笔袋',
        '铅笔',
        '转笔刀',
        '学校',
        'shǎo',
        '尺',
        '语文书',
      ],
      review: [
        '擦去铅笔痕迹',
        '画直线或测长度',
        '记录作业',
        '收纳笔等小文具',
        '写字或画图',
        '削铅笔用，成人协助',
        '学习用品',
        'bǐ',
        '本',
        '数学书',
      ],
    },
    {
      lesson: flagLesson,
      recognize: '升国旗中们声起多么向立',
      main: ['五星红旗', '慢慢', '立正', 'men', '中', '升'],
      review: ['中国', '迎风', '敬礼', 'me', '正', '声'],
    },
    {
      lesson: gardenSixLesson,
      recognize: '老师工厂医院生门卫',
      main: [
        '老师',
        '工人',
        '医生',
        '门卫',
        'nǐ',
        'nán',
        'shān',
        'xiě',
        '木字旁',
        '桃',
        '电影院',
        '电',
        '小鸟',
        '小鸟在飞',
        '从上到下',
        '工',
        '李白',
        '白玉盘',
        '青云端',
        '鼹鼠',
        '秋天',
        '金黄色',
        '植物地下部分',
        '小松鼠的疑问',
      ],
      review: [
        '学校',
        '工厂',
        '医院',
        '传达室',
        'lǐ',
        'lán',
        'sān',
        'zhǐ',
        '草字头',
        '莲',
        '生活超市',
        '市',
        '白云',
        '天空有白云',
        '从左到右',
        '门',
        '唐',
        '瑶台镜',
        '节选',
        '小松鼠',
        '冬天',
        '奇怪',
        '本页图示',
        '自己的续讲',
      ],
    },
  ];
  let checked = 0;
  for (const { lesson, recognize, main, review } of cases) {
    for (const [questions, tail] of [
      [lesson.questions, main],
      [lesson.reviewQuestions!, review],
    ] as const) {
      const expected = [...recognize, ...tail];
      const objective = questions.filter((q) => q.rule.kind === 'choice');
      expect(objective).toHaveLength(expected.length);
      for (const [index, question] of objective.entries()) {
        const answer = expected[index]!;
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
  expect(checked).toBe(230);
});
