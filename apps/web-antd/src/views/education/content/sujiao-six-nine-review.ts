import type { Lesson, Question } from '../learning/types';

import { fold } from '../learning/fold';

export const sujiaoSixNineReviewSources = {
  checkedAt: '2026-10-01',
  pages: [
    'http://app.xxsx.cn/resources-detail/38152/63',
    'http://app.xxsx.cn/resources-detail/38163/63',
    'http://app.xxsx.cn/resources-detail/38173/63',
    'http://app.xxsx.cn/resources-detail/38174/63',
  ],
} as const;

function tasks(review: boolean): Question[] {
  const id = 'sj-upper-six-nine-review';
  const prefix = review ? 'r' : 'q';
  const groups = review
    ? [
        [2, 2, 2, 2],
        [4, 4],
      ]
    : [
        [3, 3, 3],
        [2, 2, 2],
      ];
  const groupTasks = groups.flatMap((counts, index): Question[] => [
    {
      id: `${id}-${prefix}-groups-${index}`,
      knowledge: `${id}-groups-${index}`,
      prompt: '每个框代表一个盒子，圆点代表盒里的积木。这张图共有几个盒子？',
      visual: { kind: 'count-groups', groups: counts },
      rule: { kind: 'number', value: counts.length },
      hint: '问盒数就数框，不把每块积木当成一个盒子。',
      explanation: `框有${counts.length}个，所以盒子有${counts.length}个。`,
    },
    {
      id: `${id}-${prefix}-objects-${index}`,
      knowledge: `${id}-objects-${index}`,
      prompt:
        '每个框代表一个盒子，圆点代表盒里的积木。所有盒子里共有几块积木？',
      visual: { kind: 'count-groups', groups: counts },
      rule: { kind: 'number', value: fold(counts, 0, (sum, n) => sum + n) },
      hint: '问积木数就数所有圆点；也可以一组一组接着数，不只报盒数。',
      explanation: `每组的积木合起来：${counts.join(' + ')} = ${fold(counts, 0, (sum, n) => sum + n)}。这里没有要求学习乘法。`,
    },
  ]);
  const comparisons: [string, number, string, number][] = review
    ? [
        ['3 + 3', 6, '7', 7],
        ['8 - 2', 6, '5', 5],
        ['9 - 4', 5, '2 + 3', 5],
      ]
    : [
        ['2 + 4', 6, '5', 5],
        ['9 - 3', 6, '7', 7],
        ['8 - 3', 5, '1 + 4', 5],
      ];
  return [
    ...groupTasks,
    ...comparisons.map(([left, a, right, b], index): Question => ({
      id: `${id}-${prefix}-compare-${index}`,
      knowledge: `${id}-compare-${index}`,
      prompt: `${left} ○ ${right}。先算两边，再选择比较符号。`,
      choices: ['>', '<', '='].map((label) => ({ id: label, label })),
      rule: {
        kind: 'choice',
        value: (() => {
          if (a === b) return '=';
          return a > b ? '>' : '<';
        })(),
      },
      hint: '比较的是两边的结果，不能只看算式里的某个数。',
      explanation: `左边结果${a}，右边结果${b}，所以用${(() => {
        if (a === b) return '=';
        return a > b ? '>' : '<';
      })()}。`,
    })),
    {
      id: `${id}-${prefix}-pattern`,
      knowledge: `${id}-growing-pattern`,
      prompt: review
        ? '依次摆9、7、5个圆点，按每次少2个的规律继续。填接下来两组的数量。'
        : '依次摆1、3、5个圆点，按每次多2个的规律继续。填接下来两组的数量。',
      rule: { kind: 'steps', values: review ? [3, 1] : [7, 9] },
      hint: '先看相邻两组怎样变化，再连续照同一规则做两次。',
      explanation: review
        ? '每次少2个：9、7、5、3、1。'
        : '每次多2个：1、3、5、7、9。',
    },
    {
      id: `${id}-${prefix}-repeat`,
      knowledge: `${id}-repeating-pattern`,
      prompt: review
        ? '卡片按“月、星、星”一组重复：月、星、星、月、星、星，接下来是哪组三张？'
        : '卡片按“圆、圆、方”一组重复：圆、圆、方、圆、圆、方，接下来是哪组三张？',
      choices: review
        ? [
            { id: 'same', label: '月、星、星' },
            { id: 'different', label: '星、月、月' },
          ]
        : [
            { id: 'same', label: '圆、圆、方' },
            { id: 'different', label: '方、圆、圆' },
          ],
      rule: { kind: 'choice', value: 'same' },
      hint: '找完整的重复小组，不能只看最后一张。',
      explanation: '每组三张的顺序固定，接下来仍接同一完整小组。',
    },
    {
      id: `${id}-${prefix}-linked`,
      knowledge: `${id}-linked-quantities`,
      prompt: review
        ? '两个一样的红盒各装同样多积木，合起来6块。蓝盒的块数比一个红盒多2块。依次填一个红盒、一个蓝盒的块数。'
        : '两个一样的红盒各装同样多积木，合起来8块。蓝盒的块数比一个红盒多1块。依次填一个红盒、一个蓝盒的块数。',
      rule: { kind: 'steps', values: review ? [3, 5] : [4, 5] },
      hint: '先摆两个相同数量的小组使总数符合第一条线索，再从一组的数量加上差量。',
      explanation: review
        ? '3 + 3 = 6，一个红盒3块；3 + 2 = 5，蓝盒5块。'
        : '4 + 4 = 8，一个红盒4块；4 + 1 = 5，蓝盒5块。',
    },
    {
      id: `${id}-${prefix}-knots`,
      knowledge: `${id}-connections`,
      prompt: review
        ? '把4段绳按顺序接成一条，不接成圈，每次接两段用1个结，需要几个结？'
        : '把3段绳按顺序接成一条，不接成圈，每次接两段用1个结，需要几个结？',
      rule: { kind: 'number', value: review ? 3 : 2 },
      hint: '先接2段需要1个结，每增加1段再增加1个结。只数两段之间的连接处。',
      explanation: review
        ? '4段排成一条有3处连接，需要3个结。'
        : '3段排成一条有2处连接，需要2个结。',
    },
  ];
}

export const sujiaoSixNineReviewDraft: Lesson = {
  id: 'sj-upper-six-nine-review',
  textbookTitle: '6～9的认识和加减法综合活动',
  title: '数清对象、比较结果与找规律',
  page: 39,
  status: 'preparing',
  version: 1,
  goal: '区分组数与物品数，先算后比较，按明确规律延续，用相关数量线索解释问题。',
  prerequisite:
    '认识0～9，理解9以内加减法及连续两次数量变化；准备积木、卡片和纸条。',
  parentTip:
    '先让孩子说清正在数什么；不能把盒数当块数。规律题说明给定规则，不把有限几个数认作唯一可能规律。用纸条替代长绳，连接操作由家长陪同。',
  steps: [
    {
      title: '数的是盒子还是积木',
      text: '三个盒子，每盒三块积木。数框得到盒数3，数全部积木得到块数9。两种数量都有意义，答案要对应问题所问的对象。',
      visual: { kind: 'count-groups', groups: [3, 3, 3] },
      activity: '用三个盒子摆物，分别数盒数和积木总数；改变每盒数量再说一次。',
    },
    {
      title: '比较算式先求结果',
      text: '2 + 4和5比较时，先得到6，再比较6和5。两边都有算式时分别计算，再比较结果；不能只比较开头的数字。',
      activity: '把一道比较题实际摆物说明，再换成两边都有算式。',
    },
    {
      title: '变化规律与重复规律',
      text: '每次多2个是数量逐渐变化；三张卡按固定顺序反复出现是重复小组。先说出规则，再继续摆，不只猜下一项。',
      activity: '摆两种规律，让家长按你说明的规则继续，检查是否一致。',
    },
    {
      title: '多条线索互相检查',
      text: '两个相同数量的小组合起来8个，可以实际摆成4和4。另一个数量比一组多1，是5。把得到的数量放回原来的两条线索分别检查。连接纸条时数连接处，段数与连接处数量不是同一个对象。',
      activity: '摆物检查两条线索，再用三段纸条连成一条，数连接处。',
    },
  ],
  questions: [
    ...tasks(false),
    {
      id: 'sj-upper-six-nine-review-manual-groups',
      knowledge: 'sj-upper-six-nine-review-physical',
      prompt:
        '实际分盒摆不超过9块积木，说出盒数、每盒块数与总块数。换盒子摆法，检查总块数是否改变。',
      rule: { kind: 'manual' },
      hint: '只换位置不增加或减少积木，总块数不变。',
      explanation: '实际分组、点数与解释由人工确认。',
    },
    {
      id: 'sj-upper-six-nine-review-manual-pattern',
      knowledge: 'sj-upper-six-nine-review-pattern-paper',
      prompt:
        '实际摆一个数量变化规律和一个卡片重复规律，说清规则，再在纸上记录接下来的两组。',
      rule: { kind: 'manual' },
      hint: '比较相邻变化或寻找完整重复小组。',
      explanation: '摆放、书写与表达人工确认。',
    },
    {
      id: 'sj-upper-six-nine-review-manual-reflect',
      knowledge: 'sj-upper-six-nine-review-reflection',
      prompt:
        '用纸条实际连接并解释段数与连接处数。再讲一个9以内的数量故事，指出自己还需要练习的问题，请家长听你说明。',
      rule: { kind: 'manual' },
      hint: '实际完成、会解释和熟练掌握是不同状态。',
      explanation: '操作与反思由人工确认，不自动评星或诊断掌握程度。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: sujiaoSixNineReviewSources.checkedAt,
    reviewer: '公开书页范围核验与原创课程草稿',
    notes: `依据印刷第39、45、51、52页：${sujiaoSixNineReviewSources.pages.join('；')}。原创分组图、比较、规律及关联数量，不复制教材插图。长队列与第48～50页整理活动由独立课包承接，本课不单独覆盖全部活动，不声明完整单元；同版上册2024年7月第1版、2025年7月第2次印刷已核验；正式课包另行注册。`,
  },
};
