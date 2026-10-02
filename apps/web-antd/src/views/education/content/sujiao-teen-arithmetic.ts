import type { Lesson, Question } from '../learning/types';

export const sujiaoTeenArithmeticSource = {
  checkedAt: '2026-10-01',
  links: [38_204, 38_205].map(
    (id) => `http://app.xxsx.cn/resources-detail/${id}/63`,
  ),
};

function tasks(review: boolean): Question[] {
  const id = `sj-upper-teen-arithmetic-${review ? 'r' : 'q'}`;
  const equations: [number, '+' | '-', number][] = review
    ? [
        [12, '+', 4],
        [3, '+', 14],
        [16, '-', 3],
        [18, '-', 5],
        [17, '-', 10],
        [10, '+', 8],
        [19, '-', 9],
        [14, '+', 0],
      ]
    : [
        [11, '+', 5],
        [2, '+', 15],
        [17, '-', 4],
        [19, '-', 6],
        [18, '-', 10],
        [10, '+', 7],
        [16, '-', 6],
        [15, '-', 0],
      ];
  const start = review ? 14 : 12;
  const back = review ? 18 : 17;
  return [
    ...equations.map(([left, sign, right], index): Question => ({
      id: `${id}-equation-${index}`,
      knowledge: `sj-teen-equation-${index}`,
      prompt: `${left} ${sign} ${right} = □。${review ? '用小棒关系检查。' : '先说明十和一怎样变化。'}`,
      rule: {
        kind: 'number',
        value: sign === '+' ? left + right : left - right,
      },
      hint: (() => {
        if (sign === '+')
          return '整十先保留，合并单个一；调换加数位置也要认清哪个是十几。';
        return right === 10
          ? '拿走的是整十，剩单个一。'
          : '先从单个一中拿走指定数量，整十保留。';
      })(),
      explanation: `${left} ${sign} ${right} = ${sign === '+' ? left + right : left - right}。本题不用进位或退位；减10会拿走整捆十，不能当成只拿走1根。`,
    })),
    {
      id: `${id}-forward`,
      knowledge: 'sj-teen-count-on',
      prompt: `从${start}接着数，添2个。依次填写两次到达的数，不把起点算一次。`,
      visual: { kind: 'number-line', minimum: 10, maximum: 19, value: start },
      rule: { kind: 'steps', values: [start + 1, start + 2] },
      hint: '每添1个向前走一格。',
      explanation: `依次到${start + 1}、${start + 2}，共添2个。`,
    },
    {
      id: `${id}-backward`,
      knowledge: 'sj-teen-count-back',
      prompt: `从${back}倒着数，拿走2个。依次填写两次到达的数。`,
      visual: { kind: 'number-line', minimum: 10, maximum: 19, value: back },
      rule: { kind: 'steps', values: [back - 1, back - 2] },
      hint: '每拿走1个向后走一格，不重复起点。',
      explanation: `依次到${back - 1}、${back - 2}。`,
    },
    {
      id: `${id}-story-add`,
      knowledge: 'sj-teen-story-add',
      prompt: review
        ? '两盒分别12张和6张卡，合起来有几张？'
        : '盒里原有14张卡，又添3张，现在共有几张？',
      rule: { kind: 'number', value: review ? 18 : 17 },
      hint: '求两部分合起来的总数。',
      explanation: review
        ? '12 + 6 = 18，合起来18张。'
        : '14 + 3 = 17，现在17张。',
    },
    {
      id: `${id}-story-subtract`,
      knowledge: 'sj-teen-story-subtract',
      prompt: review
        ? '两盒共有19张卡，第一盒5张，第二盒几张？'
        : '原有18块积木，拿走4块，还剩几块？',
      rule: { kind: 'number', value: 14 },
      hint: '读清已知总数和一部分，求剩余或另一部分。',
      explanation: review
        ? '19 - 5 = 14，第二盒14张；没有实际拿走也能用减法。'
        : '18 - 4 = 14，还剩14块。',
    },
  ];
}

export const sujiaoTeenArithmeticDraft: Lesson = {
  id: 'sj-upper-teen-arithmetic',
  textbookTitle: '十几加几和相应的减法',
  title: '保留整十，算清单个一',
  page: 82,
  status: 'preparing',
  version: 1,
  goal: '理解11～19范围的不进位加法、不退位减法及减10，用小棒、接着数与倒数解释，读清故事问题。',
  prerequisite:
    '认识11～19是1个十和几个一，掌握10以内加减法；准备19根小棒、松紧带、盒子和纸笔。',
  parentTip:
    '只练不进位、不退位范围。单个一不够减时不能强套本课方法；减10是拿走整捆，减几是拿走散棒。数线起点不是第一次变化。',
  steps: [
    {
      title: '十几加几：合并单个一',
      text: '14根是1捆十和4根散棒，再添3根散棒，4和3合成7，整捆还在，得到17。也可以从14接着数15、16、17。',
      visual: { kind: 'place-value', value: 14 },
      activity: '实际保留1捆，把4根和新添3根合起来，解释14 + 3。',
    },
    {
      title: '十几减几：拿走散棒',
      text: '17根是1捆十和7根散棒，拿走4根散棒，剩3根散棒和整捆，得到13。也可以倒着数。本课散棒够减，不要求拆十退位。',
      visual: { kind: 'place-value', value: 17 },
      activity: '实际从散棒中拿走4根，说明哪部分变、哪部分没变。',
    },
    {
      title: '减10：拿走整捆',
      text: '18根拿走1捆十，剩8根，18 - 10 = 8。16根拿走6根散棒，剩整捆十，16 - 6 = 10。要看清拿走的是十还是单个一。',
      visual: { kind: 'place-value', value: 18 },
      activity: '分别实际演示减10与拿走全部散棒，重新摆总数后再做下一次。',
    },
    {
      title: '读题、列式和检查',
      text: '先说明已知数量与问题。求合起来用加法，求剩余或另一部分用减法。纸上写算式、单位和答句，再用摆物或相反变化检查，不用关键词代替理解。',
      activity:
        '自己讲一个不进位加法故事和一个不退位减法故事，实际摆物、纸笔并检查。',
    },
  ],
  questions: [
    ...tasks(false),
    {
      id: 'sj-teen-manual-operation',
      knowledge: 'sj-teen-physical',
      prompt:
        '用1捆十和散棒实际演示不进位加法、不退位减法、减10三种情况，逐次说明数量变化。',
      rule: { kind: 'manual' },
      hint: '每次重摆原数，分清整捆与单根。',
      explanation: '实物操作与说理人工确认，不由图示答对替代。',
    },
    {
      id: 'sj-teen-manual-story',
      knowledge: 'sj-teen-paper-story',
      prompt:
        '原创本课范围内的加法和减法故事，说明已知与所求，纸上写算式、单位和答句，用实物检查。',
      rule: { kind: 'manual' },
      hint: '加法得数不超过19，减法的散棒要够拿走；减10另作说明。',
      explanation: '故事、纸笔与检查人工确认，完成不等于掌握。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: sujiaoTeenArithmeticSource.checkedAt,
    reviewer: '公开预览范围核验与原创课程草稿',
    notes: `实际查看mainPic预览印刷第82～83页：${sujiaoTeenArithmeticSource.links.join('；')}。原创小棒替代原书计数器与插画，不声明content正文与预览同版。含0沿用已读知识作补充；本课未覆盖第83页连算或全部练习，未确认准确版次，未注册正式课程。`,
  },
};
