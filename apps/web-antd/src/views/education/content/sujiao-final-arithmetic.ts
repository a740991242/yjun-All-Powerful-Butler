import type { Lesson, QuantityTableVisual, Question } from '../learning/types';

import { quantityTableMissing } from '../learning/quantity-table';
import { sujiaoUpperSource as source } from './sujiao-upper-source';
const id = 'sj-upper-final-arithmetic';
function table(review: boolean): QuantityTableVisual {
  return {
    kind: 'quantity-table',
    columns: ['A组', 'B组', 'C组'],
    parts: review ? ['蓝球', '黄球'] : ['红球', '白球'],
    values: review
      ? [
          [4, null, 3],
          [3, 5, null],
          [null, 9, 9],
        ]
      : [
          [3, null, 2],
          [5, 4, null],
          [null, 9, 8],
        ],
  };
}
function tasks(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  const calculations: [number, '+' | '-', number][] = review
    ? [
        [7, '+', 3],
        [9, '-', 0],
        [8, '-', 5],
        [10, '+', 7],
        [18, '-', 3],
        [16, '-', 10],
      ]
    : [
        [6, '+', 4],
        [8, '-', 0],
        [9, '-', 4],
        [10, '+', 5],
        [17, '-', 2],
        [14, '-', 10],
      ];
  const equations: [string, number][] = review
    ? [
        ['10 + 7 = □ + 3', 14],
        ['9 - 5 = 10 - □', 6],
        ['□ + 6 = 10', 4],
        ['8 - □ = 5', 3],
      ]
    : [
        ['10 + 5 = □ + 2', 13],
        ['8 - 3 = 10 - □', 5],
        ['□ + 4 = 10', 6],
        ['9 - □ = 6', 3],
      ];
  const visual = table(review);
  return [
    ...calculations.map(([a, operator, b], i): Question => ({
      id: `${prefix}-calculate-${i}`,
      knowledge: `${id}-calculate-${i}`,
      prompt: `${a} ${operator} ${b} = 几？`,
      rule: { kind: 'number', value: operator === '+' ? a + b : a - b },
      hint:
        i >= 3
          ? '保留或拆开一个十，先算几个一；减去一个十后看还剩几个一。'
          : '可以接着数、倒着数或用分与合；减0数量不变。',
      explanation: `${a} ${operator} ${b} = ${operator === '+' ? a + b : a - b}。`,
    })),
    ...equations.map(([expression, value], i): Question => ({
      id: `${prefix}-equation-${i}`,
      knowledge: `${id}-equation-${i}`,
      prompt: `${expression}，空格填几？`,
      rule: { kind: 'number', value },
      hint: '先计算已知一边，再使另一边同样多。等号表示两边结果相等，不是把左边的得数直接抄进空格。',
      explanation: `空格填${value}，代回完整等式核对两边相等。`,
    })),
    {
      id: `${prefix}-max-add`,
      knowledge: `${id}-max-add`,
      prompt: review
        ? '空格只能填0～10整数。5 + □ < 10，最大能填几？'
        : '空格只能填0～10整数。4 + □ < 10，最大能填几？',
      rule: { kind: 'number', value: review ? 4 : 5 },
      hint: '先找恰好等于10的边界，再退一步。小于不包括相等。',
      explanation: review
        ? '填5时等于10，不符合；填4时9<10，最大4。'
        : '填6时等于10，不符合；填5时9<10，最大5。',
    },
    {
      id: `${prefix}-max-subtract`,
      knowledge: `${id}-max-subtract`,
      prompt: review
        ? '空格只能填0～10整数。10 - □ > 4，最大能填几？'
        : '空格只能填0～10整数。10 - □ > 2，最大能填几？',
      rule: { kind: 'number', value: review ? 5 : 7 },
      hint: '减去越多，剩下越少。找到等于右边时的减数，再少减1，保证严格大于。',
      explanation: review
        ? '填6时差等于4，不能选；填5时差5>4，最大5。'
        : '填8时差等于2，不能选；填7时差3>2，最大7。',
    },
    {
      id: `${prefix}-max-two-sides`,
      knowledge: `${id}-max-two-sides`,
      prompt: review
        ? '空格只能填0～9整数。10 + □ < 12 + 3，最大能填几？'
        : '空格只能填0～9整数。10 + □ < 11 + 3，最大能填几？',
      rule: { kind: 'number', value: review ? 4 : 3 },
      hint: '先算右边完整结果，再找左边严格小于的最大数；相等不能选。',
      explanation: review
        ? '右边15，填5时相等，填4时14<15，所以最大4。'
        : '右边14，填4时相等，填3时13<14，所以最大3。',
    },
    {
      id: `${prefix}-table`,
      knowledge: `${id}-table`,
      prompt: `每列是一组独立的球，不把不同列合并。按A、B、C顺序依次填每列“待填”的数量。`,
      visual,
      rule: { kind: 'steps', values: quantityTableMissing(visual) },
      hint: '缺总数就将两部分相加，缺一部分就从总数减去另一部分；先确认所在列和行。',
      explanation: `A、B、C列的空格依次为${quantityTableMissing(visual).join('、')}。每列两部分相加都等于本列合计。`,
    },
    {
      id: `${prefix}-table-reading`,
      knowledge: `${id}-table-reading`,
      prompt: review
        ? '表中C组的合计9包含哪些球？'
        : '表中B组的合计9包含哪些球？',
      visual,
      choices: [
        {
          id: 'column',
          label: review ? '只包含C组蓝球与黄球' : '只包含B组红球与白球',
        },
        { id: 'all', label: '包括A、B、C三组全部的球' },
        { id: 'first', label: '只包括A组的球' },
      ],
      rule: { kind: 'choice', value: 'column' },
      hint: '同一列是同一组，合计行只属于上方对应列。',
      explanation: review
        ? 'C组的合计只包括C组两部分；不能跨列合并。'
        : 'B组的合计只包括B组两部分；不能跨列合并。',
    },
    {
      id: `${prefix}-chain`,
      knowledge: `${id}-chain`,
      prompt: review
        ? '原有5个物品，又添5个，再拿走4个。依次填添加后与拿走后的数量。'
        : '原有4个物品，又添6个，再拿走3个。依次填添加后与拿走后的数量。',
      rule: { kind: 'steps', values: review ? [10, 6] : [10, 7] },
      hint: '第二次从第一次结果继续，不回到原来的数量。',
      explanation: review ? '先5+5=10，再10-4=6。' : '先4+6=10，再10-3=7。',
    },
    {
      id: `${prefix}-one-kind`,
      knowledge: `${id}-one-kind`,
      prompt: review
        ? '有5块饼干、3个水果，吃掉2块饼干，还剩几块饼干？'
        : '有7块饼干、2个水果，吃掉3块饼干，还剩几块饼干？',
      rule: { kind: 'number', value: review ? 3 : 4 },
      hint: '这里只问饼干剩多少，水果数量不参与这个问题；先找所求对象。',
      explanation: review
        ? '5-2=3块饼干，水果3个不加入。'
        : '7-3=4块饼干，水果2个不加入。',
    },
    {
      id: `${prefix}-combine`,
      knowledge: `${id}-combine`,
      prompt: review
        ? '停车架原有3辆车，又停进4辆，一共几辆？'
        : '书架原有5本书，又放上3本，一共几本？',
      rule: { kind: 'number', value: review ? 7 : 8 },
      hint: '这里问同一类物品合起来的数量，选择加法。',
      explanation: review ? '3+4=7辆。' : '5+3=8本。',
    },
    {
      id: `${prefix}-check`,
      knowledge: `${id}-check`,
      prompt: review
        ? '有人说：10 - 6 = 4，所以4 + 6应当等于什么？'
        : '有人说：6 + 4 = 10，所以10 - 6应当等于什么？',
      rule: { kind: 'number', value: review ? 10 : 4 },
      hint: '总数减去一部分得到另一部分；两部分合起来又回到总数。',
      explanation: review
        ? '4+6=10，用加法检查减法。'
        : '10-6=4，用减法检查两部分的关系。',
    },
  ];
}
const manual: [string, string][] = [
  [
    'method',
    '选一道10以内加法和一道十几加减法，实际摆物或画图，说明自己的办法，再用另一种方法检查。',
  ],
  [
    'table',
    '在纸上做一张两部分数量表，各列独立，试留总数空格或一部分空格，实际摆物填写并逐列核对。',
  ],
  [
    'boundary',
    '用0～10数字卡试填一个严格小于或大于的算式，找最大可填数，再试边界相等的数，说清为何不能选。',
  ],
  [
    'story',
    '编一个有两类物品的故事，提出只问其中一类剩多少的问题，画图列式，说清另一个数量为何不参与。',
  ],
];
export const sujiaoFinalArithmeticLesson: Lesson = {
  id,
  textbookTitle: '期末复习：运算、数量关系与实际问题',
  title: '期末复习：等式、不等式与两部分数量表',
  page: 89,
  status: 'available',
  version: 1,
  goal: '复习加减与连续变化，用两部分关系求缺数，严格检查等号和不等号，逐列表格与故事中的所求对象。',
  prerequisite:
    '掌握10以内加减法及十几不进位、不退位加减，准备19个安全物品、数字卡与纸笔。',
  parentTip:
    '例示数量和情境原创。最大填数题只在指定整数范围内求解，严格不等号不能包含相等；表中每列独立，缺数都可唯一确定。先帮读不等于提示解法，首次帮助与错误分别保留。实际画图、摆物、口述人工确认。',
  steps: [
    {
      title: '回顾自己的加减办法',
      text: '加法可以接着数或用分与合，减法可以倒着数，也可以用总数与部分的关系检查。十几加减保留一个十先算几个一，减去10后剩下几个一。选办法后代回检查，不只报答案。',
      activity:
        '实际用同一组物品说明加法与减法，再举十几的例子，口述怎样检查。',
    },
    {
      title: '等号两边必须同样多',
      text: '10+5=□+2，左边15，空格应是13，右边13+2也为15。8-3=10-□，左边5，空格也是5。空格可以出现在任何一边，不能把等号当成“后面直接写得数”。',
      activity: '用数字卡试填一个正确数和一个错误数，分别算等号两边并比较。',
    },
    {
      title: '最大可填数与严格边界',
      text: '4+□<10，填6时相等不符合，最大填5。10-□>2，填8时相等也不符合，最大填7。先明确0～10整数范围，再检查边界；减数越大，差越小。',
      activity:
        '逐一试数字卡，找到所有满足的数，再比较其中最大者，验证相等为什么排除。',
    },
    {
      title: '数量表逐列看两部分与总数',
      text: '每列是独立一组，两部分合起来是该列合计。总数缺了用加法，一部分缺了用总数减去另一部分。先指出列和行，不把A、B、C列合并。待填表示尚未给出的数量，不表示0。',
      visual: table(false),
      activity:
        '纸上画两部分数量表，实际摆物，分别留总数和一部分空格，再填写并检查。',
    },
    {
      title: '先确定问题究竟问什么',
      text: '有7块饼干、2个水果，吃3块饼干，只问剩几块饼干，用7-3，不加入水果。若同一类物品原有5又添3，求合起来用加法。读清对象、已知与所求，再选算式。',
      activity: '自己编两类物品故事，画图圈出所求类别，解释哪些数量参与。',
    },
    {
      title: '连续变化与反向检查',
      text: '4+6-3先得10，再从10减3得7，第二步不能重新从4开始。用两部分关系或反向变化检查，说明算式、数量和单位都对应；完成不自动说明已熟练掌握。',
      activity:
        '实际演示两次变化，写中间和最后数量，再挑一题用另一种办法检查并说需要帮助的地方。',
    },
  ],
  questions: [
    ...tasks(false),
    ...manual.map(([key, prompt]): Question => ({
      id: `${id}-manual-${key}`,
      knowledge: `${id}-physical-${key}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '实际操作、画图和说出依据后，再由家长确认。',
      explanation: '实物、纸笔与口述人工确认；图示答对不替代活动或掌握判断。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '同版期末正文核验与原创教学检查',
    notes: `依据实际查看ISBN ${source.isbn}、2024年7月第1版、2025年7月第2次印刷上册第89、91页（${source.preview}）运算办法、数量关系、缺数、最大填数与数量表和实际故事。数值、情境及表格均原创，不复制教材图题；本课不代表剩余期末课程或全年已完成。`,
  },
};
