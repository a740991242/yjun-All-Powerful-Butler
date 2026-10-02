import type { Lesson, Question } from '../learning/types';

import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-final-numbers';
function tasks(review: boolean): Question[] {
  const value = review ? 62 : 47;
  const ones = value % 10;
  const tens = Math.floor(value / 10);
  const round = review ? 90 : 70;
  const cards = review ? [8, 20, 62, 90] : [9, 10, 47, 70];
  const ordered = review ? [62, 60, 90, 8] : [47, 40, 70, 9];
  const lower = review ? 60 : 40;
  const base = review ? 54 : 43;
  const carryAmount = review ? 7 : 8;
  const few = review ? 3 : 2;
  const many = review ? 30 : 20;
  const add = review ? 5 : 6;
  const carryStart = review ? 57 : 48;
  const borrowStart = review ? 80 : 70;
  const take = review ? 7 : 6;
  const visual = { kind: 'digit-counter' as const, tens, ones };
  const common = (key: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
  });
  const number = (
    key: string,
    prompt: string,
    answer: number,
    explanation: string,
  ): Question => ({
    ...common(key),
    prompt,
    rule: { kind: 'number', value: answer },
    hint: '先看问的是数位、数量、数序还是运算，再按条件核对。',
    explanation,
  });
  const steps = (
    key: string,
    prompt: string,
    values: number[],
    explanation: string,
  ): Question => ({
    ...common(key),
    prompt,
    rule: { kind: 'steps', values },
    hint: '按题目顺序填写，各空的单位与所用条件不要混淆。',
    explanation,
  });
  const choice = (
    key: string,
    prompt: string,
    choices: Question['choices'],
    answer: string,
    explanation: string,
  ): Question => ({
    ...common(key),
    prompt,
    choices,
    rule: { kind: 'choice', value: answer },
    hint: '根据单位、运算方向与已给条件判断，不照搬另一个问题的结果。',
    explanation,
  });
  return [
    {
      ...common('category'),
      prompt: '按一位数和两位数分类，选出这些数字卡中的全部两位数。',
      choices: cards.map((n) => ({ id: String(n), label: String(n) })),
      rule: {
        kind: 'set',
        values: cards.filter((n) => n >= 10).map(String),
      },
      hint: '10到99是两位数；数字0在个位仍要占位。',
      explanation: `${cards.filter((n) => n >= 10).join('、')}是两位数。还可以按是否整十等别的规则分类，但本题只用位数规则。`,
    },
    {
      ...number(
        'read',
        '读计数器，写出表示的数，不是问共有几颗珠。',
        value,
        `${tens}个十和${ones}个一组成${value}。`,
      ),
      visual,
    },
    {
      ...steps(
        'composition',
        '看同一个计数器，依次填十位有几颗珠、个位有几颗珠。',
        [tens, ones],
        `十位${tens}颗、个位${ones}颗，位置和单位不能交换。`,
      ),
      visual,
    },
    {
      ...number(
        'beads',
        '两根杆合起来，实际放了几颗珠？每颗只数一次。',
        tens + ones,
        `材料颗数${tens}＋${ones}＝${tens + ones}，不是计数器表示的数${value}。`,
      ),
      visual,
    },
    {
      ...choice(
        'zero',
        `十位${round / 10}颗珠，个位没有珠，应该怎样写这个数？`,
        [
          { id: 'keep', label: `写${round}，个位用0占位` },
          { id: 'omit', label: `写${round / 10}，删掉个位` },
        ],
        'keep',
        '个位没有单个一仍用0占位，十位珠不会因此移到个位。',
      ),
      visual: { kind: 'digit-counter', tens: round / 10, ones: 0 },
    },
    number(
      'next',
      `按每次增加1数，${review ? 69 : 49}后面紧接着是什么数？`,
      review ? 70 : 50,
      '个位满十要进一个十，不能写成个位10。',
    ),
    steps(
      'gaps',
      `按每次增加10排列：${review ? '30、40、□、60、□、80' : '20、30、□、50、□、70'}。依次填两个空。`,
      review ? [50, 70] : [40, 60],
      '每次增加一个十，两空各占一个位置；不把步长10当作增加1。',
    ),
    {
      ...common('between'),
      prompt: `选出全部严格大于${lower}、严格小于${lower + 10}的数。`,
      choices: [lower, lower + 1, lower + 7, lower + 9, lower + 10].map(
        (n) => ({ id: String(n), label: String(n) }),
      ),
      rule: {
        kind: 'set',
        values: [lower + 1, lower + 7, lower + 9].map(String),
      },
      hint: '两端不包含，两个条件都要满足。',
      explanation: `${lower + 1}、${lower + 7}、${lower + 9}符合；${lower}与${lower + 10}等于端点，不选。`,
    },
    {
      ...common('order'),
      prompt: '将这四张不同的数字卡从小到大排列，各选一次。',
      choices: ordered.map((n) => ({ id: String(n), label: String(n) })),
      rule: {
        kind: 'sequence',
        values: ordered.toSorted((a, b) => a - b).map(String),
      },
      hint: '先看位数，再看十位、个位；不要照显示顺序填写。',
      explanation: `从小到大是${ordered.toSorted((a, b) => a - b).join('、')}。`,
    },
    steps(
      'add-units',
      `依次计算${base}＋${many}、${base}＋${few}、${base}＋${carryAmount}。每道算式都从${base}开始。`,
      [base + many, base + few, base + carryAmount],
      `分别加${many / 10}个十、${few}个一、${carryAmount}个一，结果依次${base + many}、${base + few}、${base + carryAmount}；第三题需要进位。这是三道独立题，不是连加。`,
    ),
    steps(
      'subtract-units',
      `依次计算${base}－${many}、${base}－${few}、${base}－${carryAmount}。每道算式都从${base}开始。`,
      [base - many, base - few, base - carryAmount],
      `分别减${many / 10}个十、${few}个一、${carryAmount}个一，结果依次${base - many}、${base - few}、${base - carryAmount}；第三题需要退位。这是三道独立题，不是连减。`,
    ),
    {
      ...number(
        'carry',
        `原有${carryStart}根小棒，再添${add}根，现在多少根？图只给原来的分组。`,
        carryStart + add,
        `${carryStart}＋${add}＝${carryStart + add}，满十根换一捆；换捆不增加总量，添棒才增加。`,
      ),
      visual: {
        kind: 'regroup-sticks',
        operation: 'add',
        tens: Math.floor(carryStart / 10),
        ones: carryStart % 10,
        amount: add,
        stage: 'original',
      },
    },
    {
      ...number(
        'borrow',
        `原有${borrowStart}根小棒，拿走${take}根，现在多少根？图只给原来的分组。`,
        borrowStart - take,
        `${borrowStart}－${take}＝${borrowStart - take}。先拆一捆为10根，拆捆不减总量，再拿走${take}根。`,
      ),
      visual: {
        kind: 'regroup-sticks',
        operation: 'subtract',
        tens: borrowStart / 10,
        ones: 0,
        amount: take,
        stage: 'original',
      },
    },
    choice(
      'swap',
      review
        ? '54－7能像加法那样交换，直接用7－54计算吗？'
        : '43－8能像加法那样交换，直接用8－43计算吗？',
      [
        { id: 'no', label: '不能，减法要保留原来的减去方向' },
        { id: 'yes', label: '能，所有加减算式都能交换' },
      ],
      'no',
      '加法交换加数可不改变和，不能把这个规律套给减法。',
    ),
    choice(
      'classify',
      review
        ? '将54＋3与54＋7按“进位或不进位”分，它们属于同一类吗？'
        : '将43＋2与43＋8按“进位或不进位”分，它们属于同一类吗？',
      [
        { id: 'different', label: '不同类，先检查个位相加是否满十' },
        { id: 'same', label: '同类，只要加一位数就不进位' },
      ],
      'different',
      '分类要按明确标准，同为加一位数仍可能一个进位、一个不进位；不能一律说十位不变。',
    ),
    choice(
      'unknown',
      review
        ? '只知道盒里原有54张卡，未说明后来拿走多少，能确定剩余张数吗？'
        : '只知道盒里原有43张卡，未说明后来拿走多少，能确定剩余张数吗？',
      [
        { id: 'ask', label: '不能，先问清拿走数量，未说明不是0' },
        { id: 'zero', label: '能，把所有未说明的数量都当0' },
      ],
      'ask',
      '缺少操作数就不能给唯一剩余数量，新场景不借用其他题的数据。',
    ),
    number(
      'small-add',
      `计算${review ? '9＋5' : '8＋7'}。`,
      review ? 14 : 15,
      '20以内进位加法可以凑十，也可按条件用其他已学方法核对。',
    ),
    number(
      'small-subtract',
      `计算${review ? '14－5' : '15－7'}。`,
      review ? 9 : 8,
      '用退位减法或想加算减核对，不能把减法写成加法。',
    ),
  ];
}
export const sujiaoLowerFinalNumbersDraft: Lesson = {
  id,
  title: '期末整理：数位、数序与运算',
  textbookTitle: '期末复习：数与运算',
  page: 88,
  status: 'preparing',
  version: 1,
  goal: '综合整理1～99的分类、数位、数序与加减法，分清十和一、材料颗数与表示值、独立算式与连算，并用真实操作解释进退位。',
  prerequisite:
    '已学习两位数、整十数与一位数加减和20以内进退位；准备数字卡、计数器或纸面代替图、安全小棒和纸笔。',
  parentTip:
    '参考实际已读下册88～91页数与运算整理范围，原创数值与题目，不抄录原题。计数器和原小棒图只读；看图作答不证明实际拨珠、换捆或读写已完成。不同分类规则分别说明，不凭一次复习宣称全年掌握。',
  steps: [
    {
      title: '分类要先定标准',
      text: '1～9是一位数，10～99是两位数；两位数中的整十数个位为0。还可以按是否整十分类，同一批数字卡可以按不同标准整理，每次都要明确标准、逐张核对，不漏放、不重复。',
      activity: '实际将1～99中的一组数字卡做两种分类，说明每次的规则。',
    },
    {
      title: '数位、表示值和材料颗数',
      text: '十位4颗、个位7颗表示4个十与7个一，是47；材料合计11颗珠，不是47颗。十位7颗而个位0颗表示70，0仍占个位。前面写0不能将7变成两位数，不能把70的个位0删掉。',
      visual: { kind: 'digit-counter', tens: 4, ones: 7 },
      activity:
        '实际拨数或纸面画珠，分别说表示多少与放了几颗珠，再表示一个整十数。',
    },
    {
      title: '数序与两端条件',
      text: '按1数时49后面是50，按10数时30后面是40。严格大于40且小于50不包括40、50。排序先看位数，再比较十位和个位；各位置按要求填，不能从显示顺序猜答案。',
      activity: '纸面写数列和排序，圈出题目指定区间，核对是否包含两端。',
    },
    {
      title: '加减的是十还是一',
      text: '43＋20是加2个十，43＋2是加2个一；43＋8要进位。43－20是减2个十，43－2是减2个一；43－8要退位。每道独立算式都从原数开始，不能把上题结果当下题起点。',
      activity: '实际写出独立算式，标出所加减单位，说出怎样计算。',
    },
    {
      title: '操作变化与换组不同',
      text: '48添6根得到54；个位8加6满十后换捆，换组不另加数量。70拿6根，先拆一捆为10根，再拿走6根，剩64；拆捆本身不拿走任何棒。用实物核对各阶段总量，不能把进位或退位当所有算式的统一规则。',
      activity: '实际摆棒演示一次进位加法和一次退位减法，边换组边核对总量。',
    },
    {
      title: '检查方向与需要帮助的地方',
      text: '加法可以交换加数，减法不能照搬。未知条件不要当0，先问清。复习应分别检查读、写、摆、解释和算，自己说出还需帮助的内容，再选对应课继续练，不把一道题答对等同完整掌握。',
      activity: '用自己的记录举例，说明一项会做的内容和一项仍需练习的内容。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际用数字卡做位数和是否整十两种分类，逐张核对，不漏放或重复，说清不同规则。',
      '实际拨计数器或画对应数位图，读写47和70，分别说明材料颗数、十和一及0占位。',
      '实际纸面写数列、排序与独立加减算式，标明步长、是否包含端点、十与一的计算单位。',
      '实际摆棒演示48＋6和70－6，分别记录原数量、换组与添拿后的数量，口述换组总量不变。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '实际完成并由家长查看后才确认，尚未做可暂时跳过。',
      explanation: '图示正确不能替代真实读写、拨摆与解释，人工任务独立记录。',
    })),
    ...[
      '你用什么例子说明十位数字、个位数字与整个数的区别？记录自己的说明或还需帮助的地方。',
      '整理后你还想练哪一类加减题，为什么？如实记录，不把复习完成当全年已掌握。',
    ].map((prompt, index): Question => ({
      id: `${id}-reflection-${index}`,
      knowledge: `${id}-reflection-${index}`,
      prompt,
      rule: { kind: 'reflection' },
      hint: '写自己的真实想法，没有唯一答案。',
      explanation:
        '反思保留原话、correct为null，不替代实际人工任务或自动诊断掌握。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '88～91页数与运算范围及原创题核验',
    notes: `依据实际读取ISBN ${source.isbn}印刷88～91页数分类、数序、组成与运算整理范围，本站数值和图示原创；复习改变数位、边界与运算数据，不复制扫描、不替代剩余期末内容或全年覆盖验收。`,
  },
};
