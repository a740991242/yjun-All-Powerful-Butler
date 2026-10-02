import type { GridPathsVisual, Lesson, Question } from '../learning/types';

export const sujiaoFirstUnitReviewSources = {
  checkedAt: '2026-10-01',
  links: [
    'http://app.xxsx.cn/resources-detail/38135/63',
    'http://app.xxsx.cn/resources-detail/38137/63',
    'http://app.xxsx.cn/resources-detail/38143/63',
    'http://app.xxsx.cn/resources-detail/38144/63',
  ],
} as const;

export const sujiaoMainPaths: GridPathsVisual = {
  kind: 'grid-paths',
  paths: [
    {
      id: 'A',
      points: [
        [0, 0],
        [2, 0],
        [2, 2],
      ],
    },
    {
      id: 'B',
      points: [
        [0, 3],
        [5, 3],
      ],
    },
    {
      id: 'C',
      points: [
        [4, 0],
        [4, 2],
      ],
    },
  ],
};
export const sujiaoReviewPaths: GridPathsVisual = {
  kind: 'grid-paths',
  paths: [
    {
      id: 'A',
      points: [
        [0, 0],
        [3, 0],
        [3, 2],
      ],
    },
    {
      id: 'B',
      points: [
        [0, 3],
        [4, 3],
      ],
    },
    {
      id: 'C',
      points: [
        [5, 0],
        [5, 3],
      ],
    },
  ],
};

function tasks(review: boolean): Question[] {
  const id = 'sj-upper-unit-one-review';
  const prefix = review ? 'r' : 'q';
  const visual = review ? sujiaoReviewPaths : sujiaoMainPaths;
  const sumChoices = review
    ? [
        { id: 'one', label: '1 + 3' },
        { id: 'two', label: '2 + 2' },
        { id: 'three', label: '1 + 4' },
        { id: 'four', label: '4 + 0' },
      ]
    : [
        { id: 'one', label: '1 + 2' },
        { id: 'two', label: '3 + 2' },
        { id: 'three', label: '4 + 1' },
        { id: 'four', label: '2 + 3' },
      ];
  const actions = review
    ? ['取出拼图块', '把拼图块摆在桌上', '按照图样拼好', '把拼图块收回盒里']
    : ['取出画纸', '用笔画图', '检查画面是否完成', '把完成的画纸收好'];
  return [
    {
      id: `${id}-${prefix}-longest`,
      knowledge: `${id}-longest`,
      prompt: '沿着格边比较三条线，哪一条最长？',
      visual,
      choices: ['A', 'B', 'C'].map((label) => ({
        id: label,
        label: `${label}线`,
      })),
      rule: { kind: 'choice', value: review ? 'A' : 'B' },
      hint: '拐弯前后的每一小段都算进来，不只看起点到终点。',
      explanation: review
        ? 'A线走5格边，B线4格边，C线3格边，所以A最长。'
        : 'A线走4格边，B线5格边，C线2格边，所以B最长。',
    },
    {
      id: `${id}-${prefix}-bent-count`,
      knowledge: `${id}-bent-length`,
      prompt: 'A线沿格边一共走过几条小格边？',
      visual,
      rule: { kind: 'number', value: review ? 5 : 4 },
      hint: '先数横着的一段，再数竖着的一段，每条小格边只数一次。',
      explanation: review
        ? '横着3格边，再竖着2格边，合计5格边。'
        : '横着2格边，再竖着2格边，合计4格边。',
    },
    {
      id: `${id}-${prefix}-shortest`,
      knowledge: `${id}-shortest`,
      prompt: '三条线中哪一条最短？',
      visual,
      choices: ['A', 'B', 'C'].map((label) => ({
        id: label,
        label: `${label}线`,
      })),
      rule: { kind: 'choice', value: 'C' },
      hint: '按经过的格边数量比较，不能把图形的高或宽单独当作整条线的长。',
      explanation: review
        ? 'C线经过3格边，比A的5格边、B的4格边都少。'
        : 'C线经过2格边，比A的4格边、B的5格边都少。',
    },
    {
      id: `${id}-${prefix}-sum-group`,
      knowledge: `${id}-same-sum`,
      prompt: review
        ? '把所有得数是4的加法卡片选出来。'
        : '把所有得数是5的加法卡片选出来。',
      choices: sumChoices,
      rule: {
        kind: 'set',
        values: review ? ['one', 'two', 'four'] : ['two', 'three', 'four'],
      },
      hint: '逐张计算，把得数相同的放在一起；没有选中的也要检查。',
      explanation: review
        ? '1+3、2+2、4+0的得数都是4；1+4是5。'
        : '3+2、4+1、2+3的得数都是5；1+2是3。',
    },
    {
      id: `${id}-${prefix}-same-difference`,
      knowledge: `${id}-same-difference`,
      prompt: review
        ? '5 - 2 = 3，下面哪张减法卡片也得到3？'
        : '4 - 2 = 2，下面哪张减法卡片也得到2？',
      choices: review
        ? [
            { id: 'same', label: '4 - 1' },
            { id: 'other', label: '3 - 1' },
          ]
        : [
            { id: 'same', label: '3 - 1' },
            { id: 'other', label: '5 - 2' },
          ],
      rule: { kind: 'choice', value: 'same' },
      hint: '比较的是得数是否相同，不能只看算式开头的数。',
      explanation: review ? '5-2和4-1都得到3。' : '4-2和3-1都得到2。',
    },
    {
      id: `${id}-${prefix}-addition-pattern`,
      knowledge: `${id}-addition-pattern`,
      prompt: review
        ? '依次计算1 + 1、1 + 2、1 + 3、1 + 4，按卡片顺序填写四个得数。'
        : '依次计算1 + 1、2 + 1、3 + 1、4 + 1，按卡片顺序填写四个得数。',
      rule: { kind: 'steps', values: [2, 3, 4, 5] },
      hint: '每次只让一个加数增加1，另一个加数不变；先逐张摆物计算。',
      explanation:
        '得数依次为2、3、4、5，每次增加1。要先计算验证，不能只背排列。',
    },
    {
      id: `${id}-${prefix}-same-addend`,
      knowledge: `${id}-same-addend`,
      prompt: review
        ? '把第一个加数都是2的加法卡选出来。'
        : '把第一个加数都是3的加法卡选出来。',
      choices: review
        ? [
            { id: 'a', label: '2 + 1' },
            { id: 'b', label: '2 + 3' },
            { id: 'c', label: '1 + 2' },
            { id: 'd', label: '3 + 2' },
          ]
        : [
            { id: 'a', label: '3 + 1' },
            { id: 'b', label: '3 + 2' },
            { id: 'c', label: '2 + 3' },
            { id: 'd', label: '4 + 1' },
          ],
      rule: { kind: 'set', values: ['a', 'b'] },
      hint: '这次按第一个加数分组，不按得数，也不按第二个加数。',
      explanation: review
        ? '2+1、2+3的第一个加数都是2。'
        : '3+1、3+2的第一个加数都是3。',
    },
    {
      id: `${id}-${prefix}-sum-parts`,
      knowledge: `${id}-multiple-pairs`,
      prompt: `用两个至少为1的加数写一道和是${review ? 4 : 5}的加法，依次填两个加数。允许不同正确写法。`,
      rule: { kind: 'partition', total: review ? 4 : 5, parts: 2, minimum: 1 },
      hint: '用实物分成两部分，两部分都至少1个，合起来要正好是指定总数。',
      explanation: review
        ? '1和3、2和2、3和1都可以，检查两部分合起来是4。'
        : '1和4、2和3、3和2、4和1都可以，检查两部分合起来是5。',
    },
    {
      id: `${id}-${prefix}-subtraction-pattern`,
      knowledge: `${id}-subtraction-pattern`,
      prompt: review
        ? '依次计算4 - 1、4 - 2、4 - 3，按卡片顺序填写三个得数。'
        : '依次计算5 - 1、5 - 2、5 - 3、5 - 4，按卡片顺序填写四个得数。',
      rule: { kind: 'steps', values: review ? [3, 2, 1] : [4, 3, 2, 1] },
      hint: '每次从相同的原有数量开始，拿走的数量每次增加1，重新摆物验证。',
      explanation: review
        ? '依次剩3、2、1，每次少1。'
        : '依次剩4、3、2、1，每次少1。',
    },
    {
      id: `${id}-${prefix}-swap-addends`,
      knowledge: `${id}-swap-addends`,
      prompt: review
        ? '1 + 3和3 + 1的得数相同吗？'
        : '2 + 3和3 + 2的得数相同吗？',
      choices: [
        { id: 'same', label: '相同' },
        { id: 'different', label: '不相同' },
      ],
      rule: { kind: 'choice', value: 'same' },
      hint: '实际摆出两部分，交换摆放位置，没有增加或拿走物品，再计算。',
      explanation: review ? '1+3和3+1都得到4。' : '2+3和3+2都得到5。',
    },
    {
      id: `${id}-${prefix}-order`,
      knowledge: `${id}-life-order`,
      prompt: review
        ? '按照这个拼图活动的操作顺序，排列动作卡片。'
        : '按照这个画画活动的操作顺序，排列动作卡片。',
      choices: actions.map((label, index) => ({
        id: String(index + 1),
        label,
      })),
      rule: { kind: 'sequence', values: ['1', '2', '3', '4'] },
      hint: '先准备物品，再完成活动，最后收好。按题目给出的流程，不代表所有人的活动习惯完全相同。',
      explanation: actions.join(' → '),
    },
    {
      id: `${id}-${prefix}-no-change`,
      knowledge: `${id}-zero-change`,
      prompt: review
        ? '4块积木拿走0块和拿走4块，剩余数量相同吗？'
        : '3块积木拿走0块和拿走3块，剩余数量相同吗？',
      choices: [
        { id: 'same', label: '相同' },
        { id: 'different', label: '不相同' },
      ],
      rule: { kind: 'choice', value: 'different' },
      hint: '分别做两次操作，每次重新摆回原数量。',
      explanation: review
        ? '4-0剩4，4-4剩0，不相同。'
        : '3-0剩3，3-3剩0，不相同。',
    },
    {
      id: `${id}-${prefix}-position`,
      knowledge: `${id}-quantity-position`,
      prompt: review
        ? '共有4张卡片，只拿第3张，一共拿几张？'
        : '共有5张卡片，只拿第2张，一共拿几张？',
      rule: { kind: 'number', value: 1 },
      hint: '总数量、指定位置和实际取出的数量要分开。',
      explanation: '第几指定一个位置，所以只拿1张；不能把排第几当作拿几张。',
    },
  ];
}

function reflections(review: boolean): Question[] {
  return [
    review
      ? '复习以后，选一个现在会做的活动，说说用了什么办法，与上次有什么不同。'
      : '这一单元你会做哪些活动？选一个数数、比较或计算活动，说说自己用了什么办法。',
    review
      ? '现在还想练什么或问什么？写一个下次的小计划，可以请家长按你的原话代写。'
      : '还有哪里需要帮助，或想问什么？说一个下次想练的小步骤，不需要假装全部都会。',
  ].map((prompt, index): Question => ({
    id: `sj-upper-unit-one-review-${review ? 'r' : 'q'}-reflection-${index}`,
    knowledge: `sj-upper-unit-one-review-reflection-text-${index}`,
    prompt,
    rule: { kind: 'reflection' },
    hint: '孩子先说自己的想法，家长可以原话代写；不要求唯一答案。',
    explanation: '这是你的学习反思，不自动评分，也不代替实际活动和计算证据。',
  }));
}
export const sujiaoFirstUnitReviewDraft: Lesson = {
  id: 'sj-upper-unit-one-review',
  textbookTitle: '练习二与评价反思',
  title: '第一单元整理：比较、顺序与算式关联',
  page: 22,
  version: 3,
  status: 'preparing',
  goal: '综合比较方格线长短、生活操作顺序、同得数算式、数量与位置；通过实物讲故事，并说出还想问什么。',
  prerequisite:
    '已认识0～5、几与第几和5以内加减法。路径只比较相同格边，不提前教授厘米测量。',
  parentTip:
    '这是平台根据已核验活动组织的综合活动，不是教材单独课目或完整单元测评。客观练习与表达、自评、提问分别记录，不据一次成绩判断掌握。',
  steps: [
    {
      title: '线弯了，也要数整条线',
      text: '每个方格一样大，沿线逐段数经过的格边。遇到拐弯还要接着数，不用端点间的直线距离代替整条线。',
      visual: sujiaoMainPaths,
      activity: '在纸上画一条直线和一条折线，沿相同大小的方格边比较实际长短。',
    },
    {
      title: '用数字表示先后',
      text: '第1步、第2步表示活动的位置顺序，不表示要拿这么多个物品。活动要说明具体的流程，再把动作卡片按先后排列。',
      activity:
        '选择整理书包或准备画画，说出自己的实际步骤；不同流程需说明，不能直接认为别人的安排错。',
    },
    {
      title: '把同得数算式放一起',
      text: '不同算式可以得到相同结果。逐张算好再分类。也可以固定第一个加数，把第二个加数依次增加1，观察得数变化；整理减法时固定原有数量，每次多拿走1个，比较剩余怎样改变。',
      activity:
        '写几张5以内加减法卡，先按得数分组，再按第一个加数或原有数量分组，逐张计算检查；用不同的两个加数写和是5的算式。',
    },
    {
      title: '反思和提问，不自动评分',
      text: '选一个会做的活动说明理由，再选一个还想练的活动。可以问一句不懂的问题，也可以说一个还想认识的数。完成一次练习与掌握知识不是同一回事。',
      activity:
        '孩子讲一个加法或减法故事，说一个还想练的地方或问题；家长只记录实际表达，不替孩子说答案。',
    },
  ],
  questions: [
    ...tasks(false),
    ...reflections(false),
    {
      id: 'sj-upper-unit-one-review-manual-cards',
      knowledge: 'sj-upper-unit-one-review-physical-sort',
      prompt:
        '在纸上写几张5以内加减法卡片，先按得数分类，再固定一个加数或被减数排列，说明变化。用积木找出不同的两个正数相加得5的分法，再写成算式。',
      rule: { kind: 'manual' },
      hint: '例如按加法/减法，或按得数；说明你实际使用的分类办法。',
      explanation:
        '实际写卡、分类和解释人工确认，不把一道选卡题答对当作完成全部整理。',
    },
    {
      id: 'sj-upper-unit-one-review-manual-reflect',
      knowledge: 'sj-upper-unit-one-review-reflection',
      prompt:
        '讲一个5以内加减法故事，再说一个还想练的地方或不懂的问题。请家长听实际表达后确认。',
      rule: { kind: 'manual' },
      hint: '可以用积木演示；有疑问是学习的一部分，不用假装都会。',
      explanation: '故事、自评与提问由人工确认，不自动评定表达水平或单元掌握。',
    },
  ],
  reviewQuestions: [...tasks(true), ...reflections(true)],
  review: {
    date: sujiaoFirstUnitReviewSources.checkedAt,
    reviewer: '公开书页范围核验与原创课程草稿',
    notes: `活动范围来自上册印刷第22、24、30、31页：${sujiaoFirstUnitReviewSources.links.join('；')}。路径、动作流程、算式卡和问答为原创；不是这些页的所有练习，也不是完整单元验收。完整版本身份待确认，未注册正式课包。`,
  },
};
