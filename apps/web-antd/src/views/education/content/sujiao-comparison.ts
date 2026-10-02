import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';

export const sujiaoComparisonSources = {
  checkedAt: '2026-10-01',
  pages: [20, 21, 23],
  links: [
    'http://app.xxsx.cn/resources-detail/38113/63',
    'http://app.xxsx.cn/resources-detail/38134/63',
    'http://app.xxsx.cn/resources-detail/38136/63',
  ],
} as const;

const symbols = ['=', '>', '<'].map((label) => ({ id: label, label }));

function compareTasks(review: boolean): Question[] {
  const id = 'sj-upper-quantity-comparison';
  const prefix = review ? 'r' : 'q';
  // Equal, greater and smaller are all required; review changes each quantity.
  const pairs = review
    ? [
        [2, 2],
        [4, 1],
        [3, 5],
      ]
    : [
        [4, 4],
        [5, 2],
        [1, 3],
      ];
  return [
    ...pairs.map(([left, right], index): Question => {
      const a = required(left);
      const b = required(right);
      const relation = (() => {
        if (a === b) return '=';
        return a > b ? '>' : '<';
      })();
      return {
        id: `${id}-${prefix}-symbol-${index}`,
        knowledge: `${id}-symbol-${index}`,
        prompt: `第一组与第二组比较：${a} ○ ${b}，圆圈里选哪个符号？`,
        visual: { kind: 'count', count: a, other: b },
        choices: symbols,
        rule: { kind: 'choice', value: relation },
        hint: '先把两组一个对一个配好。没有多出的就是同样多；有多出的那组更多。符号开口朝较大的数。',
        explanation: `${a} ${relation} ${b}：第一组${(() => {
          if (a === b) return '与第二组同样多';
          return a > b ? '比第二组多' : '比第二组少';
        })()}。`,
      };
    }),
    {
      id: `${id}-${prefix}-reverse`,
      knowledge: `${id}-reverse-relation`,
      prompt: review
        ? '已经知道4比1多，反过来说1比4怎样？'
        : '已经知道5比2多，反过来说2比5怎样？',
      choices: [
        { id: 'more', label: '多' },
        { id: 'same', label: '同样多' },
        { id: 'less', label: '少' },
      ],
      rule: { kind: 'choice', value: 'less' },
      hint: '换了先说的那组，比较结果也要跟着换。',
      explanation: review ? '4 > 1，反过来是1 < 4。' : '5 > 2，反过来是2 < 5。',
    },
    {
      id: `${id}-${prefix}-equal-fill`,
      knowledge: `${id}-equality`,
      prompt: review ? '2 = □，方框里填几？' : '4 = □，方框里填几？',
      rule: { kind: 'number', value: review ? 2 : 4 },
      hint: '等号表示两边的数量相同。',
      explanation: review ? '2 = 2，两边都是2。' : '4 = 4，两边都是4。',
    },
    {
      id: `${id}-${prefix}-all-less`,
      knowledge: `${id}-all-less`,
      prompt: review
        ? '在这些数字卡中，把所有小于4的数选出来。'
        : '在这些数字卡中，把所有小于3的数选出来。',
      choices: [1, 2, 3, 4, 5].map((value) => ({
        id: String(value),
        label: String(value),
      })),
      rule: { kind: 'set', values: review ? ['1', '2', '3'] : ['1', '2'] },
      hint: '逐个比较；与指定数相等的不能选。',
      explanation: review
        ? '1、2、3都小于4；4等于4，5大于4。'
        : '1、2小于3；3等于3，4、5大于3。',
    },
    {
      id: `${id}-${prefix}-all-greater`,
      knowledge: `${id}-all-greater`,
      prompt: review
        ? '在这些数字卡中，把所有大于2的数选出来。'
        : '在这些数字卡中，把所有大于3的数选出来。',
      choices: [1, 2, 3, 4, 5].map((value) => ({
        id: String(value),
        label: String(value),
      })),
      rule: { kind: 'set', values: review ? ['3', '4', '5'] : ['4', '5'] },
      hint: '大于不是等于，别把指定数本身选进去。',
      explanation: review ? '3、4、5大于2。' : '4、5大于3。',
    },
    {
      id: `${id}-${prefix}-spacing`,
      knowledge: `${id}-quantity-conservation`,
      prompt: review
        ? '两组各有3块积木。只把第二组摆得更紧，没有添也没有拿走，两组数量怎样？'
        : '两组各有4块积木。只把第一组摆得更疏，没有添也没有拿走，两组数量怎样？',
      choices: [
        { id: 'first', label: '第一组多' },
        { id: 'equal', label: '两组同样多' },
        { id: 'second', label: '第二组多' },
      ],
      rule: { kind: 'choice', value: 'equal' },
      hint: '比较的是块数，不是排成一行的长度。重新配对或逐一点数。',
      explanation:
        '没有添、拿走积木，数量不变；摆得疏或紧不改变块数。实际摆一摆再确认。',
    },
  ];
}

/** Source-bounded original draft; exact cover/edition audit is still pending. */
export const sujiaoComparisonDraft: Lesson = {
  id: 'sj-upper-quantity-comparison',
  textbookTitle: '=和>、<',
  title: '数量比较：一个对一个与比较符号',
  page: 20,
  status: 'preparing',
  version: 1,
  goal: '通过一一对应比较5以内数量，认识等号、大于号和小于号，区分数量与排列长度。',
  prerequisite: '能逐一点数1～5；准备两种颜色的积木各5块及纸笔。',
  parentTip:
    '先实际配对，再读比较式。不要只教符号口诀或用行的长度猜数量；纸笔练写符号请参考教材或教师示范。',
  steps: [
    {
      title: '一个对一个，比较同样多',
      text: '两种积木各取3块，逐个配成一对。每块都有对应的一块，没有剩下，说明两组同样多，可以写3 = 3，读作3等于3。',
      activity: '实际摆两排积木，一个对一个配好，说出为什么同样多。',
      visual: { kind: 'count', count: 3, other: 3 },
    },
    {
      title: '有剩下的那组多',
      text: '一组取5块，另一组取3块，一个对一个配好。5块那组还有没配到的积木，所以5比3多，写5 > 3；反过来说3比5少，写3 < 5。',
      activity: '指出哪组还有剩下的，再从两种说法读比较式。',
      visual: { kind: 'count', count: 5, other: 3 },
    },
    {
      title: '先看两边的数，再选符号',
      text: '等号表示两边同样多。大于号和小于号的开口朝较大的数，尖端朝较小的数。先判断数量关系，再选符号；不要把“相等”算成“大于”或“小于”。',
      activity:
        '拿1～5数字卡，找出小于3和大于3的卡片，解释3为什么不在这两组里。',
    },
    {
      title: '摆法变了，数量是否变了？',
      text: '两组各摆4块，把一组拉开、另一组挤紧。虽然一行看起来更长，但没有增加或拿走积木。重新点数或配对，两组仍同样多。',
      activity: '实际改变间隔，再配对检查；在纸上对照教材练写=、>、<。',
    },
  ],
  questions: [
    ...compareTasks(false),
    {
      id: 'sj-upper-quantity-comparison-manual-pair',
      knowledge: 'sj-upper-quantity-comparison-physical-pair',
      prompt: '实际摆两种积木，分别做一次同样多和一组更多的配对，说出根据。',
      rule: { kind: 'manual' },
      hint: '每块只对应另一组的一块；观察是否有没配到的积木。',
      explanation: '实际配对和表达由孩子或家长确认，不用屏幕点选代替。',
    },
    {
      id: 'sj-upper-quantity-comparison-manual-spacing',
      knowledge: 'sj-upper-quantity-comparison-physical-spacing',
      prompt:
        '两组各摆4块，把其中一组拉开。重新配对验证是否同样多，并对照教材或教师示范在纸上练写三个比较符号。',
      rule: { kind: 'manual' },
      hint: '比较块数，不比较行的长度；实际写符号由家长查看。',
      explanation: '操作和纸笔练习由人工确认；确认完成不代表已掌握。',
    },
  ],
  reviewQuestions: compareTasks(true),
  review: {
    date: sujiaoComparisonSources.checkedAt,
    reviewer: '公开书页范围核验与原创课程草稿',
    notes: `本课依据上册印刷第20、21、23页：${sujiaoComparisonSources.links.join('；')}。本课不声称覆盖相邻页全部活动。活动及问答原创，不复制书页、插图或原题全文；封面与版本身份待确认，暂不注册正式课包。`,
  },
};
