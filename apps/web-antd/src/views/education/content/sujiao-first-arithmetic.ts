import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';

type Operation = 'add' | 'subtract';

export const sujiaoFirstArithmeticSources = {
  checkedAt: '2026-10-01',
  addition: [
    'http://app.xxsx.cn/resources-detail/38138/63',
    'http://app.xxsx.cn/resources-detail/38139/63',
  ],
  subtraction: [
    'http://app.xxsx.cn/resources-detail/38140/63',
    'http://app.xxsx.cn/resources-detail/38141/63',
  ],
} as const;

function arithmeticTasks(operation: Operation, review: boolean): Question[] {
  const add = operation === 'add';
  const id = `sj-upper-first-${operation}`;
  const prefix = review ? 'r' : 'q';
  const pairs = (() => {
    if (add)
      return review
        ? [
            [1, 2],
            [3, 1],
            [2, 2],
            [4, 1],
          ]
        : [
            [1, 1],
            [2, 1],
            [1, 3],
            [2, 3],
          ];
    return review
      ? [
          [3, 2],
          [4, 1],
          [5, 3],
          [4, 2],
        ]
      : [
          [2, 1],
          [3, 1],
          [4, 3],
          [5, 1],
        ];
  })();
  const sign = add ? '+' : '-';
  const storyLeft = review ? 3 : 2;
  const storyRight = add ? 2 : 1;
  const lineLeft = (() => {
    if (add) return review ? 1 : 3;
    return review ? 4 : 5;
  })();
  const lineRight = 2;
  const path = Array.from(
    { length: lineRight },
    (_, index) => lineLeft + (add ? index + 1 : -index - 1),
  );
  return [
    ...pairs.map(([left, right], index): Question => {
      const a = required(left);
      const b = required(right);
      const value = add ? a + b : a - b;
      return {
        id: `${id}-${prefix}-calculate-${index}`,
        knowledge: `${id}-calculate-${index}`,
        prompt: add
          ? `第一组有${a}个圆点，第二组有${b}个，把两组合起来一共有几个？${a} + ${b} = □。`
          : `原来有${a}块积木，拿走${b}块，还剩几块？${a} - ${b} = □。`,
        visual: add
          ? { kind: 'count', count: a, other: b }
          : { kind: 'count', count: a },
        rule: { kind: 'number', value },
        hint: add
          ? `先数${a}，再接着数${b}次；不要把起点再算一次。`
          : `从${a}开始，每拿走一块就往回数一个数，共拿走${b}块。图中仍画原来的数量，可以用实际积木操作。`,
        explanation: add
          ? `${a}添上${b}，一共有${value}，所以${a} + ${b} = ${value}。`
          : `${a}拿走${b}，剩下${value}，所以${a} - ${b} = ${value}。`,
      };
    }),
    {
      id: `${id}-${prefix}-operator`,
      knowledge: `${id}-meaning`,
      prompt: (() => {
        if (add)
          return review
            ? '盒子里有1支笔，又放入3支，求现在的总数应使用哪个符号？'
            : '桌上有2本书，又放上1本，求现在的总数应使用哪个符号？';
        return review
          ? '有4张卡片，拿走2张，求剩下的张数应使用哪个符号？'
          : '有5个杯子，拿走1个，求剩下的个数应使用哪个符号？';
      })(),
      choices: [
        { id: '+', label: '+' },
        { id: '-', label: '-' },
      ],
      rule: { kind: 'choice', value: sign },
      hint: add
        ? '把两部分合起来或添上，用加法。'
        : '从原来的数量里去掉一部分，用减法。',
      explanation: add
        ? '求添上后的总数，用加号。'
        : '求拿走后的剩余，用减号。',
    },
    {
      id: `${id}-${prefix}-story`,
      knowledge: `${id}-story`,
      prompt: add
        ? `篮子里原来有${storyLeft}个球，再放入${storyRight}个，现在共有几个球？`
        : `篮子里原来有${storyLeft}个球，拿出${storyRight}个，还剩几个球？`,
      rule: {
        kind: 'number',
        value: add ? storyLeft + storyRight : storyLeft - storyRight,
      },
      hint: '找出原来有多少、数量怎样改变、问题在问什么，再摆物计算。',
      explanation: `${storyLeft} ${sign} ${storyRight} = ${add ? storyLeft + storyRight : storyLeft - storyRight}。球的数量与算式的数一一对应。`,
    },
    {
      id: `${id}-${prefix}-path`,
      knowledge: `${id}-counting-path`,
      prompt: `数线上从${lineLeft}出发，${add ? '向右接着数' : '向左倒着数'}${lineRight}次，按顺序填出每次到达的数。起点${lineLeft}不用填。`,
      visual: { kind: 'number-line', minimum: 0, maximum: 5, value: lineLeft },
      rule: { kind: 'steps', values: path },
      hint: '每次只移动到相邻的一个数，移动次数对应添上或拿走的数量；起点不是第1次到达的数。',
      explanation: `依次到达${path.join('、')}，最后到${path.at(-1)}，所以${lineLeft} ${sign} ${lineRight} = ${path.at(-1)}。`,
    },
    {
      id: `${id}-${prefix}-term`,
      knowledge: `${id}-terms`,
      prompt: (() => {
        if (add)
          return review
            ? '1 + 3 = 4中，4是这道加法算式的什么？'
            : '2 + 1 = 3中，3是这道加法算式的什么？';
        return review
          ? '4 - 1 = 3中，3是这道减法算式的什么？'
          : '5 - 2 = 3中，3是这道减法算式的什么？';
      })(),
      choices: add
        ? [
            { id: 'sum', label: '和，表示合起来的总数' },
            { id: 'addend', label: '加数，表示其中的一部分' },
          ]
        : [
            { id: 'difference', label: '差，表示剩下的数量' },
            { id: 'subtrahend', label: '减数，表示拿走的数量' },
          ],
      rule: { kind: 'choice', value: add ? 'sum' : 'difference' },
      hint: '看等号后面的得数在这个故事里表示什么。',
      explanation: add
        ? '加法的得数叫和，表示两部分合起来的总数。'
        : '减法的得数叫差，表示去掉一部分后剩下的数量。',
    },
  ];
}

function manualTasks(operation: Operation): Question[] {
  const add = operation === 'add';
  const id = `sj-upper-first-${operation}`;
  return [
    {
      id: `${id}-manual-objects`,
      knowledge: `${id}-physical`,
      prompt: add
        ? '用两种积木分别摆出两部分，合起来；再从第一部分接着数第二部分。说出两种数法的结果是否相同。'
        : '先摆5块积木，实际拿走2块，逐块倒着数；再点数剩下的积木。说出两种数法的结果是否相同。',
      rule: { kind: 'manual' },
      hint: '每块只数一次，接着数或倒着数时，不把起点算成一次移动。',
      explanation: '实际操作与说理由孩子或家长确认，完成与掌握分开。',
    },
    {
      id: `${id}-manual-story`,
      knowledge: `${id}-oral-paper`,
      prompt: add
        ? '自己讲一个总数不超过5的添上或合起来的故事，在纸上写算式并读给家长听。'
        : '自己讲一个从5以内数量里拿走一部分、仍有剩余的故事，在纸上写算式并读给家长听。',
      rule: { kind: 'manual' },
      hint: '说清原来的数量、添上或拿走的数量、要问什么。每个数都要对应故事中的数量。',
      explanation:
        '故事、实际书写和朗读人工查看，不把算式答对当作表达任务自动完成。',
    },
  ];
}

export const sujiaoFirstAdditionDraft: Lesson = {
  id: 'sj-upper-first-add',
  textbookTitle: '加法',
  title: '5以内加法：合起来与接着数',
  page: 25,
  version: 1,
  status: 'preparing',
  goal: '理解添上和合起来的数量关系，读写加法算式，用逐一点数、接着数和数线计算5以内加法。',
  prerequisite:
    '能点数1～5并理解同样多；准备两种积木、纸笔。此课先使用两个正数相加，不代替0的教学。',
  parentTip:
    '先让孩子说明两部分和总数；接着数从原数的下一个数开始，移动次数与新增数量相同。写符号须参考教材或教师示范。',
  steps: [
    {
      title: '两部分合起来',
      text: '摆2块积木，再摆另外2块，两部分合起来求总数。可以把每块都数一次，也可以先数一部分再接着数另一部分。',
      visual: { kind: 'count', count: 2, other: 2 },
      activity: '用两种颜色摆出两部分，逐块移动到同一个盒子里，数总数量。',
    },
    {
      title: '用加法写出来',
      text: '2块添上2块，共有4块，写成2 + 2 = 4，读作2加2等于4。2和2是加数，4是和；加号表示把两部分合起来，等号表示两边数量相等。',
      activity:
        '指着实际物品说明两个加数与和各表示什么，对照教师示范在纸上写并读算式。',
    },
    {
      title: '接着数，起点不重复',
      text: '从2接着数2次：第一次到3，第二次到4。起点2已经表示原来的数量，不能把2当作新添的第1块再数一次。数线上每次向右到相邻的数。',
      visual: { kind: 'number-line', minimum: 0, maximum: 5, value: 2 },
      activity:
        '用纸画数线或移动积木，边添1块边报下一个数，比较与全部点数的结果。',
    },
    {
      title: '把生活变化讲清楚',
      text: '说清原来有多少，又添多少，求现在一共有多少。用实物表示故事，再写算式；不能只说一个得数而不解释数量怎样变化。',
      activity:
        '自己讲一个5以内加法故事，家长听完后请孩子摆物解释，必要时仅帮读。',
    },
  ],
  questions: [...arithmeticTasks('add', false), ...manualTasks('add')],
  reviewQuestions: arithmeticTasks('add', true),
  review: {
    date: sujiaoFirstArithmeticSources.checkedAt,
    reviewer: '公开书页范围核验与原创课程草稿',
    notes: `依据上册印刷第25～26页：${sujiaoFirstArithmeticSources.addition.join('；')}。原创故事、学具与练习；复习更换数量与数线起点，不复制教材插画。尚待完整版本身份确认，暂未注册正式课包。`,
  },
};

export const sujiaoFirstSubtractionDraft: Lesson = {
  id: 'sj-upper-first-subtract',
  textbookTitle: '减法',
  title: '5以内减法：拿走与倒着数',
  page: 27,
  version: 1,
  status: 'preparing',
  goal: '理解去掉一部分求剩余，读写减法算式，用实物、倒着数和数线计算5以内仍有剩余的减法。',
  prerequisite:
    '能数1～5、知道总数量；准备5块积木、纸笔。本课不代替0及减到0的教学。',
  parentTip:
    '图中的圆点表示原来的数量，不自动删除；孩子须按题目实际拿走积木。数线起点不计为第1步，完成操作不自动计为答对。',
  steps: [
    {
      title: '从原来的数量拿走',
      text: '先摆4块积木，拿走1块。原来有4，拿走1，问还剩多少；点数剩下的积木，不把拿走的也算进去。',
      visual: { kind: 'count', count: 4 },
      activity: '实际拿走1块，指清原有、拿走、剩余的数量。',
    },
    {
      title: '用减法写出来',
      text: '4拿走1，剩下3，写成4 - 1 = 3，读作4减1等于3。4是被减数，1是减数，3是差。减号表示从原有数量中去掉一部分。',
      activity: '在纸上写算式并读出来，解释三个数分别对应哪些积木。',
    },
    {
      title: '每拿走一块，往回数一次',
      text: '从5开始，拿走1块数到4，再拿走1块数到3。倒着数2次后到3，不把起点5当作一次拿走。数线上每次向左到相邻的数。',
      visual: { kind: 'number-line', minimum: 0, maximum: 5, value: 5 },
      activity: '实际拿走2块，再点数剩余，与倒着数的结果比较。',
    },
    {
      title: '说一个去掉的故事',
      text: '说清原来有多少、去掉多少、问剩下多少，再摆物和写算式。图里画原来数量时，必须根据故事去掉对应部分，不能把图上原有数量直接填作答案。',
      activity:
        '讲一个仍有剩余的5以内减法故事，在纸上写算式，家长查看实际操作和表达。',
    },
  ],
  questions: [
    ...arithmeticTasks('subtract', false),
    ...manualTasks('subtract'),
  ],
  reviewQuestions: arithmeticTasks('subtract', true),
  review: {
    date: sujiaoFirstArithmeticSources.checkedAt,
    reviewer: '公开书页范围核验与原创课程草稿',
    notes: `依据上册印刷第27～28页：${sujiaoFirstArithmeticSources.subtraction.join('；')}。原创问答与实际摆物，复习改变减数、故事数量及数线起点。尚待完整版本身份确认，暂未注册正式课包。`,
  },
};

export const sujiaoFirstArithmeticDrafts = [
  sujiaoFirstAdditionDraft,
  sujiaoFirstSubtractionDraft,
];
