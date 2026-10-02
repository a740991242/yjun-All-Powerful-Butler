import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-calculation-links';
function tasks(review: boolean): Question[] {
  const addPairs = review
    ? [
        [8, 6],
        [38, 6],
        [68, 6],
      ]
    : [
        [7, 5],
        [27, 5],
        [47, 5],
      ];
  const subPairs = review
    ? [
        [14, 6],
        [44, 6],
        [74, 6],
      ]
    : [
        [13, 5],
        [33, 5],
        [63, 5],
      ];
  const startAdd = review ? 9 : 8;
  const stepAdd = review ? 8 : 7;
  const startSub = review ? 60 : 50;
  const stepSub = review ? 7 : 8;
  const number = (
    key: string,
    prompt: string,
    value: number,
    explanation: string,
  ): Question => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
    rule: { kind: 'number', value },
    hint: '先看个位运算是否满十或够减，算完还要合回保留的十；相同个位运算不代表总结果相同。',
    explanation,
  });
  const steps = (
    key: string,
    prompt: string,
    values: number[],
    explanation: string,
  ): Question => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
    rule: { kind: 'steps', values },
    hint: '按题目规定从左到右，每个结果作为下一步起点，符号也要核对。',
    explanation,
  });
  const compare = (
    key: string,
    left: string,
    right: string,
    value: string,
    explanation: string,
  ): Question => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt: `比较${left}与${right}，在中间选“＞”“＝”或“＜”。`,
    choices: [
      { id: 'gt', label: '＞' },
      { id: 'eq', label: '＝' },
      { id: 'lt', label: '＜' },
    ],
    rule: { kind: 'choice', value },
    hint: '同一起始数，加得更多就更大，减得更多就更小；也可各自算出结果核对。',
    explanation,
  });
  const mixed = review ? [71, 8, 20] : [52, 6, 30];
  const mixedTwo = review ? [4, 46, 7] : [3, 37, 4];
  return [
    ...addPairs.map(([a, b], i) =>
      number(
        `add-${i}`,
        `${a}＋${b}＝多少？`,
        required(a) + required(b),
        `${required(a) % 10}＋${b}先算个位，正确进位再合回原来的十，得${required(a) + required(b)}。`,
      ),
    ),
    ...subPairs.map(([a, b], i) =>
      number(
        `subtract-${i}`,
        `${a}－${b}＝多少？`,
        required(a) - required(b),
        `个位不够减时拆1个十，再计算并合回保留的十，得${required(a) - required(b)}。`,
      ),
    ),
    steps(
      'add-chain',
      `从${startAdd}开始连续加${stepAdd}三次，依次填出三个结果，不是每次都重新从${startAdd}开始。`,
      [startAdd + stepAdd, startAdd + 2 * stepAdd, startAdd + 3 * stepAdd],
      '每次以刚得到的数为起点，连续前进。',
    ),
    steps(
      'subtract-chain',
      `从${startSub}开始连续减${stepSub}三次，依次填出三个结果。`,
      [startSub - stepSub, startSub - 2 * stepSub, startSub - 3 * stepSub],
      '每次以刚得到的数为起点，连续减少，不把所减数字本身当结果。',
    ),
    steps(
      'mixed',
      `${mixed[0]}－${mixed[1]}＋${mixed[2]}，从左到右依次填两步结果。`,
      [
        required(mixed[0]) - required(mixed[1]),
        required(mixed[0]) - required(mixed[1]) + required(mixed[2]),
      ],
      '第一步减，第二步在第一步结果上加，不能把两个后续数都当所减量。',
    ),
    steps(
      'mixed-two',
      `${mixedTwo[0]}＋${mixedTwo[1]}－${mixedTwo[2]}，从左到右依次填两步结果。`,
      [
        required(mixedTwo[0]) + required(mixedTwo[1]),
        required(mixedTwo[0]) + required(mixedTwo[1]) - required(mixedTwo[2]),
      ],
      '第一步加，第二步减，算式里的方向不能只看第一个符号。',
    ),
    compare(
      'subtract-compare',
      review ? '76－20' : '87－30',
      review ? '76－2' : '87－3',
      'lt',
      '同一个起始数，减整十数比减对应的一位数更多，因此前者更小。',
    ),
    compare(
      'add-compare',
      review ? '63＋30' : '52＋40',
      review ? '63＋3' : '52＋4',
      'gt',
      '同一个起始数，加整十数比加对应的一位数更多，因此前者更大。',
    ),
    compare(
      'add-order',
      review ? '3＋45' : '2＋26',
      review ? '45＋3' : '26＋2',
      'eq',
      '加法两个加数交换顺序，合计相同。',
    ),
    {
      id: `${id}-${review ? 'r' : 'q'}-subtract-order`,
      knowledge: `${id}-subtract-order`,
      prompt: `因为加法可以交换顺序，就把${review ? '46－4' : '35－3'}写成${review ? '4－46' : '3－35'}来代替，合适吗？`,
      choices: [
        { id: 'no', label: '不合适，减法保留原有与减去的方向' },
        { id: 'yes', label: '合适，任何计算都可直接交换' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '减法原有量与减去量的角色不同，本课不计算一位数减去更大两位数的负数结果。',
      explanation: '不能把加法交换顺序推广为减法交换；根据原算式核对数量关系。',
    },
  ];
}
export const sujiaoCalculationLinksDraft: Lesson = {
  id,
  title: '关联口算与连算：逐步核对方向',
  textbookTitle: '两位数加减·关联口算与综合计算',
  page: 68,
  version: 1,
  status: 'preparing',
  goal: '从个位基本算式联系两位数运算，按连续步骤计算，比较结果并区分加法交换与减法方向。',
  prerequisite: '会两位数加减整十数和一位数，含进退位；准备纸笔。',
  parentTip: `依据ISBN ${source.isbn}实际读62、65、67～69页相关练习范围，例子与题组原创；本课安排综合练习，包含后续进退位，宜先完成两节换组课。连算明确从左到右，用中间结果接下一步，不以题组数量宣称完整练习覆盖。`,
  steps: [
    {
      title: '个位计算相关，总数仍看十位',
      text: '7＋5＝12，27＋5＝32，47＋5＝52。三个式子的个位都计算7＋5，但保留的十不同；不能一看到同样个位就把总得数都写12。满十后还需合回原十位。',
      activity: '纸面排三条算式，圈相同个位计算，再标保留的十。',
    },
    {
      title: '退位计算也可相联系',
      text: '13－5＝8，33－5＝28，63－5＝58。个位不足5都需拆十，但各自剩余十位不同。整十减法与减一位数也不同，如87－30比87－3减得更多。',
      activity: '实际摆或画拆十过程，分别写中间散根与保留的十。',
    },
    {
      title: '连续计算用上一次的结果',
      text: '从8连续加7，依次得到15、22、29，不是三个空格都15。从50连续减8，依次42、34、26。每次重新看起点与符号，纸面逐箭头核对。',
      activity: '实际画连续箭头，写每一步，不跳过中间结果。',
    },
    {
      title: '混合运算方向可以改变',
      text: '52－6＋30从左到右先得46，再得76；3＋37－4先得40，再得36。不能看到第一步减就把后面30也减掉。两步实际变化分别确认。',
      activity: '纸面写两步算式，指出哪步加、哪步减。',
    },
    {
      title: '比较与交换有条件',
      text: '52＋40比52＋4大，87－30比87－3小。2＋26与26＋2相等，但35－3不能换成3－35代替；减法方向由原有与取走角色决定。本课不要求计算负数。',
      activity: '实际口述三组比较依据，并用各自得数核对。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际在纸面把7＋5、27＋5、47＋5和13－5、33－5、63－5分组，标出相同个位运算与不同保留的十。',
      '实际画从8连加7三次和从50连减8三次的箭头，逐步记录，用每次新结果继续。',
      '实际书写52－6＋30与3＋37－4两步过程，标加减方向，再口述一组大小比较与减法不能直接交换的原因。',
    ].map((prompt, i): Question => ({
      id: `${id}-manual-${i}`,
      knowledge: `${id}-manual-${i}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '纸面记录与实际口述完成后才确认，可暂跳。',
      explanation: '网页结果不自动确认实际任务。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '你怎样避免每次重用最初的数，或把后面的加减方向看错？记录发现或待核对的问题。',
      rule: { kind: 'reflection' },
      hint: '保留真实方法，不强制唯一表达。',
      explanation: '反思null，不评分。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '已读关联与连算范围核验',
    notes: `ISBN ${source.isbn}相关已读62、65、67～69页，复习改变真实起点、步长与运算，版次印次未知，完整练习/单元尚待审核。`,
  },
};
