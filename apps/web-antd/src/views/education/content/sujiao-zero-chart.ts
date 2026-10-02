import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-zero-chart';
function tasks(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  const q = (key: string) => ({
    id: `${prefix}-${key}`,
    knowledge: `${id}-${key}`,
  });
  const focus = review ? 62 : 47;
  const row = review ? 60 : 30;
  const ones = review ? 4 : 7;
  return [
    ...(['左边', '右边', '上面', '下面'] as const).map(
      (direction, index): Question => ({
        ...q(`neighbor-${index}`),
        prompt: `在这张0～99数表中，${focus}紧挨着的${direction}位置是哪个数？`,
        visual: { kind: 'zero-number-chart', value: focus },
        rule: {
          kind: 'number',
          value: focus + required([-1, 1, -10, 10][index]),
        },
        hint: '读清图上方向；横向相邻差1，竖向相邻差10。不能把下一排第一个数当本排右邻。',
        explanation: `原图${focus}的${direction}邻格为${focus + required([-1, 1, -10, 10][index])}，数表方向与顺着读数字不是同一问题。`,
      }),
    ),
    ...[
      { key: 'right-edge', value: review ? 19 : 9, direction: '右边' },
      { key: 'left-edge', value: review ? 40 : 10, direction: '左边' },
    ].map((p): Question => ({
      ...q(p.key),
      prompt: `${p.value}在本排还有紧挨着的${p.direction}格吗？只能在同一排找。`,
      visual: { kind: 'zero-number-chart', value: p.value },
      choices: [
        { id: 'none', label: '没有，已经到本排边界' },
        { id: 'wrap', label: '有，可以跨到另一排' },
      ],
      rule: { kind: 'choice', value: 'none' },
      hint: '表的每排保持十个位置，换排不是横向挨着。',
      explanation: '边界外没有本排邻格；不能只算加1或减1再跨排。',
    })),
    {
      ...q('first-row'),
      prompt: review ? '第一排最右边是哪个数？' : '第一排最左边从哪个数开始？',
      visual: { kind: 'zero-number-chart', value: review ? 25 : 15 },
      rule: { kind: 'number', value: review ? 9 : 0 },
      hint: '本表从0开始，第一排不是1～10。',
      explanation: '第一排依次0～9；0也占一个完整位置。',
    },
    {
      ...q('last-row'),
      prompt: review ? '最后一排最左边是哪个数？' : '最后一排最右边是哪个数？',
      visual: { kind: 'zero-number-chart', value: review ? 63 : 73 },
      rule: { kind: 'number', value: review ? 90 : 99 },
      hint: '这张表最后一排是90～99，没有100的位置。',
      explanation: '每排保持顺序，从90到99，不把别的1～100数表末格套进来。',
    },
    {
      ...q('horizontal'),
      prompt: `观察${review ? '61与62' : '43与44'}，同排从左向右到紧挨着的格，每次多多少？`,
      visual: { kind: 'zero-number-chart', value: review ? 61 : 43 },
      rule: { kind: 'number', value: 1 },
      hint: '比较相邻两个格，不把整排首尾的差当每格变化。',
      explanation: '本表横向相邻多1，但最后一格不能横跨下一排。',
    },
    {
      ...q('vertical'),
      prompt: `观察${review ? '24与34' : '17与27'}，同列从上到下到紧挨着的格，每次多多少？`,
      visual: { kind: 'zero-number-chart', value: review ? 24 : 17 },
      rule: { kind: 'number', value: 10 },
      hint: '同列看下一排，个位数字相同，数量多一个十。',
      explanation: '竖向相邻多10，不是多1。',
    },
    {
      ...q('same-row'),
      prompt: `选出以下卡片中与${row}在同一排的所有数。`,
      visual: { kind: 'zero-number-chart', value: row },
      choices: [row, row + 4, row + 9, row + 10, row - 1].map((v) => ({
        id: String(v),
        label: String(v),
      })),
      rule: {
        kind: 'set',
        values: [row, row + 4, row + 9].map(String),
      },
      hint: '本表这一排从整十到末尾9，不把前排末格或后排首格混进来。',
      explanation: `应选${row}、${row + 4}、${row + 9}；只在给出的卡片中选择。`,
    },
    {
      ...q('same-column'),
      prompt: `选出以下卡片中与${ones}在同一列的所有数。`,
      visual: { kind: 'zero-number-chart', value: ones },
      choices: [ones, ones + 20, ones + 90, ones * 10, ones * 10 + 9].map(
        (v) => ({ id: String(v), label: String(v) }),
      ),
      rule: {
        kind: 'set',
        values: [ones, ones + 20, ones + 90].map(String),
      },
      hint: '同列的个位相同；单个数字的位置也按第一排实际排布核对。',
      explanation: `应选${ones}、${ones + 20}、${ones + 90}；不能把数位交换当同列。`,
    },
    {
      ...q('position-count'),
      prompt: review
        ? '仍是完整0～99数表，换个观察位置后，格内数字共有几个？0的位置也算。'
        : '完整0～99数表，每格一个数，0的位置也算，一共有几个数？',
      visual: { kind: 'zero-number-chart', value: review ? 84 : 35 },
      rule: { kind: 'number', value: 100 },
      hint: '每排十个位置，按十个十数清；最大的数与数的个数不同。',
      explanation:
        '共有100个数，0也占位置；99是最大数字，不是位置总数。不用把表改成1～100。',
    },
  ];
}
export const sujiaoZeroChartDraft: Lesson = {
  id,
  title: '0～99数表：行列规律与边界',
  textbookTitle: '认识20～99·数表观察',
  page: 46,
  version: 1,
  status: 'preparing',
  goal: '按本册0～99的真实排列观察横竖规律、相邻格与边界，区分数值与位置个数。',
  prerequisite: '已认识两位数和按1/10数数，准备纸笔及数字卡。',
  parentTip:
    '依据已读第46页数表观察范围，本站独立原创图示，不改旧1～100模型。完整标数图用于读表观察，不冒充缺格练习或框数题；方形/十字框数另做，真实填表、圈数和口述独立确认。',
  steps: [
    {
      title: '第一排从0开始',
      text: '这张表第一排是0～9，第二排是10～19，最后一排90～99。与从1排到100的表不同，不能用旧表的行列位置替换。0在第一排第一格，最后一格99。',
      visual: { kind: 'zero-number-chart', value: 0 },
      activity: '观察第一格和最后一格；手机在表内左右滚动，行列顺序不改变。',
    },
    {
      title: '同排横看，每次多1',
      text: '一排从左向右按顺序数，紧挨着多1。30这一排从30到39；39右边已经没有本排位置，40在下一排最左，不能说它在39右边紧挨着。',
      visual: { kind: 'zero-number-chart', value: 39 },
      activity: '指着30这一排说数，再分别指出39与40的实际位置。',
    },
    {
      title: '同列竖看，每次多10',
      text: '例如7、17、27在同一列，每往下一排多10。27上方是17，下方37；27左边26、右边28。横与竖的问题要按原图位置核对。',
      visual: { kind: 'zero-number-chart', value: 27 },
      activity: '在纸上画一个小范围，标出27的四个邻格，分别说方向与变化。',
    },
    {
      title: '格数与真实填表、圈数',
      text: '每排十个位置，共十排，按十个十数有100个位置。99是最大的数，0也算一个位置。实际制作空表按顺序填数，再从2开始每次多2圈出数、从5开始每次多5做另一种标记，自己观察规律。网页完整表只作对照，不能当你已经填完或圈过。',
      visual: { kind: 'zero-number-chart', value: 99 },
      activity:
        '实际纸面填表、按2/5作不同标记，核对规则与范围，向家长说一个发现。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '在纸面空表按0～99的真实行列顺序填数，核对每排十个、第一格0和末格99，不把看过网页当填过。',
      '在实际纸面数表从2开始每次多2圈数，从5开始每次多5用另一种标记；分别说明起点、规则并核对。',
      '实际指着纸面一个数的横竖邻格和边界，说出发现，比较数字值与数字个数的区别。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '真实填表、圈记和口述由家长查看，网页只读表不自动确认。',
      explanation: '实际任务独立人工确认，没做可待做。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '记录你在0～99数表的横排、竖列或边界发现了什么，哪里还需要核对？按自己的话记录。',
      rule: { kind: 'reflection' },
      hint: '允许不同合理发现，不必照抄。',
      explanation: '开放记录null，不替代实际填表或框数活动。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '独立0～99排列与观察范围核验',
    notes: `依据ISBN ${source.isbn}已读第46页范围，图示和题目原创。版次印次未知；方形/十字框数与完整单元尚未完成。`,
  },
};
