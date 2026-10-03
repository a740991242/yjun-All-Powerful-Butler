import type { Lesson, Question } from '../learning/types';

import { bnuFinalColorCards } from '../learning/bnu-final-color';

const id = 'bnu-upper-final-color-patterns';
const colors = bnuFinalColorCards('main');
const regionAnswers = [
  4, 6, 6, 6, 9, 10, 10, 10, 10, 10, 10, 8, 3, 10, 10, 7, 10, 10, 8, 10, 9, 10,
  10, 10, 10, 10, 8, 9, 8,
];
const selected = [
  'R6',
  'R7',
  'R8',
  'R9',
  'R10',
  'R11',
  'R14',
  'R15',
  'R17',
  'R18',
  'R20',
  'R22',
  'R23',
  'R24',
  'R25',
  'R26',
];
const leftEquations = [
  '3+2+5=10',
  '3+5+2=10',
  '2+3+5=10',
  '2+5+3=10',
  '5+3+2=10',
  '5+2+3=10',
];

function q(
  suffix: string,
  prompt: string,
  rule: Question['rule'],
  explanation: string,
  visual?: Question['visual'],
): Question {
  return {
    id: `${id}-${suffix}`,
    knowledge: id,
    prompt,
    rule,
    explanation,
    hint: '先看所问的是一群、全体还是隐藏部分；逐式计算，逐区域保留，再逐层数圆点。0不表示空白。',
    ...(visual ? { visual } : {}),
  };
}
function set(
  suffix: string,
  prompt: string,
  values: string[],
  choices: string[],
  explanation: string,
): Question {
  return {
    ...q(suffix, prompt, { kind: 'set', values }, explanation),
    choices: choices.map((label) => ({ id: label, label })),
  };
}
function choice(
  suffix: string,
  prompt: string,
  value: string,
  choices: string[],
  explanation: string,
): Question {
  return {
    ...q(suffix, prompt, { kind: 'choice', value }, explanation),
    choices: choices.map((label) => ({ id: label, label })),
  };
}
function actual(suffix: string, prompt: string): Question {
  return q(
    `actual-${suffix}`,
    `${prompt}；真实做过再确认，未做或没有原书、材料、同伴可待做。`,
    { kind: 'manual' },
    '网页练习不能自动确认纸面涂色、接着画或真实交流；计划另记。',
  );
}
const colorCalculations = Array.from({ length: 5 }, (_, part) => {
  const first = part * 6;
  const cards = colors.slice(first, first + 6);
  return q(
    `color-calculate-${part + 1}`,
    `按顺序计算${cards.map((card) => `区域${card.position}（${card.expression}）`).join('、')}，每格填一个得数。`,
    { kind: 'steps', values: regionAnswers.slice(first, first + 6) },
    '只按所列区域顺序填写；同式在不同位置分别保留，三项加法从左到右。',
  );
});

export const bnuFinalColorPatternsLesson: Lesson = {
  id,
  textbookTitle: '总复习 · 计算、涂色与规律',
  title: '完整计算、涂色区域与圆点规律',
  page: 83,
  version: 1,
  status: 'available',
  goal: '完成12式和两幅小鸡图，逐区域计算全部29处，按指定结果选区域并接着画六幅圆点图。',
  prerequisite: '会10以内加法、连加连减与整体减去可见部分；会逐行数点。',
  parentTip:
    '对应北师大上册83页四项。区域卡是本站原创排列，不能冒原书涂色后的图案；实际发现须看原书。小鸡右图沿用左图同一群共10只、没有增减的条件，网页明确写出；若单独给一幅右图且不知道总数，就不能确定隐藏数。圆点图为逐层添一行的原创等价图，15和21保留全部点，可实际数，不要求提前学乘法或公式。实际纸笔、原画观察与未来计划分别保存。',
  review: {
    date: '2026-10-04',
    reviewer: '原书83页完整四项与区域逐项核对',
    notes:
      '第三方0061阅读器87对应印刷83，重新查看本地已读取大图；ISBN印次未知。12式、两图、29区域及六幅圆点接画完整对应，不打包原扫描画。',
  },
  steps: [
    {
      title: '十二个算式，四列全部完成',
      text: '第一列6+2、6+3、6+4；第二列7+1、7+2、7+3；第三列8+2、8+1、8+0；第四列3+7、2+8、1+9。每个算式独立计算，不把前一题的得数当下一题起点。加0仍保留原数。',
      activity: '实际完成原书十二式，再说同列或不同列的发现。',
    },
    {
      title: '先数三群小鸡，再求全体',
      text: '原左图三群分别3只、2只、5只。本站三组点各代表一只；合并三群，不重复数。连加先合前两群，再添第三群；也可交换群的计算次序，但不能用无关的5+5+0冒原图三群。',
      activity: '实际逐只点数原图，填两运算符三数量的完整算式和答句。',
      visual: { kind: 'count-groups', groups: [3, 2, 5] },
    },
    {
      title: '同一群的右图，分清可见与隐藏',
      text: '沿用上一图同一群共10只，明确没有增减。右图树前两群可见3只和4只，图中两个点框只表示这两群可见部分。先从全10只取去可见3只，再取去可见4只，剩下才是树后；也可先合可见部分再从总数减去。树本身不算小鸡。没有总数或没有同一群条件时，不能凭这幅图猜隐藏量。',
      activity: '实际对照原书两图核对同一群，完成右图全部算式并说明隐藏部分。',
      visual: { kind: 'count-groups', groups: [3, 4] },
    },
    {
      title: '二十九处都算，再按得数涂色',
      text: '原书要求把得数为10的算式涂色。本站将全部29处做成原创区域卡，位置与原画不同，编号只是查找位置。逐处算、逐处选择；两个0+8仍是两个不同区域，不去重，也不能把等于9或8的区域涂上。选完网页区域后，原书完整涂色和图案发现另做。',
      activity: '实际完整计算原书29处，涂所有得数10的区域，说实际发现。',
      visual: { kind: 'bnu-final-color', variant: 'main' },
    },
    {
      title: '从前三幅找每次添的整行',
      text: '原前三幅从上到下每行点数分别是1；1、2；1、2、3。每行右端对齐，每个圆圈是一个点；第二幅有两行，不能把两行误说成两个点。下一幅在原三行下面添四个点的一行，后面依次再添五个、六个点的一行。',
      activity: '实际接着画第4、5、6幅，保留前面整幅并在底部添新行。',
      visual: { kind: 'triangle-rows', rows: [1, 2, 3] },
    },
    {
      title: '逐层数全部点，再交流方法',
      text: '本站六幅完整等价图供逐行核对。第4～6幅的全部点已超过或达到十，不截掉点、不只数新增一行；可用圆片逐个数或保留上一幅总数再数添入。无需先学乘法或通用公式。真实画图、实际数点、发现疑问与未来计划分别记。',
      activity: '实际核对六幅全部点，向同伴解释添一行与全图数量的区别。',
      visual: { kind: 'triangle-rows', rows: [1, 2, 3, 4, 5, 6] },
    },
  ],
  questions: [
    q(
      'q1',
      '独立计算6+2，只填得数。',
      { kind: 'number', value: 8 },
      '从6添2得到8。',
    ),
    q(
      'column-1',
      '按顺序计算第一列6+2、6+3、6+4。',
      { kind: 'steps', values: [8, 9, 10] },
      '每式都从6出发。',
    ),
    q(
      'column-2',
      '按顺序计算第二列7+1、7+2、7+3。',
      { kind: 'steps', values: [8, 9, 10] },
      '每式都从7出发。',
    ),
    q(
      'column-3',
      '按顺序计算第三列8+2、8+1、8+0。',
      { kind: 'steps', values: [10, 9, 8] },
      '加0不改变8。',
    ),
    q(
      'column-4',
      '按顺序计算第四列3+7、2+8、1+9。',
      { kind: 'steps', values: [10, 10, 10] },
      '三式运算数不同但都得到10。',
    ),
    q(
      'chicks-total',
      '三群小鸡分别3只、2只、5只，合起来多少只？',
      { kind: 'number', value: 10 },
      '3+2+5=10，群数3与小鸡总数不同。',
      { kind: 'count-groups', groups: [3, 2, 5] },
    ),
    set(
      'chicks-equations',
      '选出全部用原图三群数量且各用一次的正确连加式。',
      leftEquations,
      [...leftEquations, '5+5+0=10', '3+2+4=9'],
      '六种次序都对应同三群；同得数不一定对应原群。',
    ),
    q(
      'chicks-add',
      '按3+2+5的顺序，先填第一步得数，再填全体总数。',
      { kind: 'steps', values: [5, 10] },
      '先3+2=5，再5+5=10；最后第二个5来自第三群。',
    ),
    q(
      'chicks-hidden',
      '同一群全10只、无增减，可见两群3只和4只。按10−3−4，先填第一步剩余，再填隐藏数。',
      { kind: 'steps', values: [7, 3] },
      '先剩7，再从7取去4剩3；两可见群合7不是隐藏量。',
      { kind: 'count-groups', groups: [3, 4] },
    ),
    set(
      'chicks-hidden-equations',
      '选出全部从同一群全10只分别取去可见两群的正确连减式。',
      ['10−3−4=3', '10−4−3=3'],
      ['10−3−4=3', '10−4−3=3', '3+4=7', '10−3−4=1'],
      '两种取去次序都求隐藏3；可见总7与树1棵不是答案。',
    ),
    choice(
      'chicks-unknown',
      '若只知道可见3只与4只，不知道全体总数或是否同一群，隐藏数能确定吗？',
      '不能，条件不足',
      ['不能，条件不足', '一定是0', '一定是3', '一定是7'],
      '未知隐藏不是0，沿用10必须有同一群且无增减条件。',
    ),
    ...colorCalculations,
    {
      ...q(
        'color-select',
        '全部29个区域中，选出所有得数为10的区域。',
        { kind: 'set', values: selected },
        '逐处计算，所有且只有得数10的区域入选；重复算式的区域分别判断。',
      ),
      choices: colors.map((card) => ({
        id: card.id,
        label: `区域${card.position}：${card.expression}`,
      })),
    },
    choice(
      'color-repeat',
      '区域12与区域27都写0+8，应怎样处理？',
      '各自保留并计算，都不选',
      [
        '各自保留并计算，都不选',
        '合并成一个区域',
        '其中一个选上',
        '两个都选上',
      ],
      '同式不等于同一位置，两处都得8，标准是10。',
    ),
    q(
      'dots-known',
      '按第1～3幅顺序填全部圆点数，不填行数。',
      { kind: 'steps', values: [1, 3, 6] },
      '1；1+2；1+2+3。',
      { kind: 'triangle-rows', rows: [1, 2, 3] },
    ),
    q(
      'dots-next',
      '按第4～6幅顺序填全部圆点数，不只填新添一行。',
      { kind: 'steps', values: [10, 15, 21] },
      '保留上一幅全部点再添4/5/6个，得到10/15/21，不截到10。',
      { kind: 'triangle-rows', rows: [4, 5, 6] },
    ),
    choice(
      'dots-row',
      '第5幅新添的一行有5个点，这5个是全图总数吗？',
      '不是，只是新添一行',
      ['不是，只是新添一行', '是，原来的点都不算', '超过10的点不算'],
      '前面四行仍在，不能丢弃。',
    ),
    choice(
      'dots-range',
      '数第6幅全部圆点时，超过10的点怎么办？',
      '继续逐个数，保留全部点',
      ['继续逐个数，保留全部点', '只保留前10个', '把超过10的点算成0'],
      '图中所有圆点都计数，本任务不要求乘法或公式。',
    ),
    actual('calculations', '实际纸面完成原书十二式并解释一组发现'),
    actual(
      'chicks',
      '实际点数原书两图、填写两条完整算式与答句，核对同一群条件',
    ),
    actual('color', '实际计算原书29处、完成得数10的全部涂色，再观察图案'),
    actual('draw', '实际接着画第4、5、6幅，分别保留整图并添底部一行'),
    actual('count', '实际逐行数或摆圆片核对六幅全部点数'),
    actual('exchange', '实际和同伴交流隐藏量、涂色或接画的一种方法并听取回应'),
    q(
      'reflection',
      '记录实际发现或困难；未做纸面可如实写未做，不编造图案。',
      { kind: 'reflection' },
      '开放记录没有唯一答案，不自动确认实做。',
    ),
    q(
      'question',
      '记录一个尚未核对的条件或疑问，没有也可如实写。',
      { kind: 'reflection' },
      '疑问不作为对错评分。',
    ),
    q(
      'plan',
      '写一个之后准备核对或尝试的计划，明确尚未做。',
      { kind: 'reflection' },
      '未来计划与实际完成分开。',
    ),
  ],
  reviewQuestions: [
    q(
      'review-column',
      '新顺序7+3、7+2、7+1，依次填得数。',
      { kind: 'steps', values: [10, 9, 8] },
      '按新顺序独立算，不套旧列8/9/10。',
    ),
    q(
      'review-hidden',
      '新群全9只、无增减，可见2只与3只。按9−2−3填中间剩余和隐藏数。',
      { kind: 'steps', values: [7, 4] },
      '先剩7再取3剩4，不套旧总10或最后3。',
      { kind: 'count-groups', groups: [2, 3] },
    ),
    {
      ...q(
        'review-color',
        '新区域卡改标准：选出全部得数为9的区域。',
        { kind: 'set', values: ['R1', 'R2', 'R3', 'R4', 'R6', 'R7'] },
        '条件与排列都改变，不能沿用得数10的区域编号。',
        { kind: 'bnu-final-color', variant: 'review' },
      ),
      choices: bnuFinalColorCards('review').map((card) => ({
        id: card.id,
        label: `区域${card.position}：${card.expression}`,
      })),
    },
    q(
      'review-dots',
      '新排列从左到右三行图、两行图、一行图，依次填全部圆点数。',
      { kind: 'steps', values: [6, 3, 1] },
      '先看每幅真实排列，不套旧从小到大1/3/6。',
      { kind: 'triangle-rows', rows: [3, 2, 1] },
    ),
  ],
};
