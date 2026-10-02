import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
import { stockRows } from '../learning/stock-table';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-practical-problems';
function tasks(review: boolean): Question[] {
  const visual = {
    kind: 'stock-table' as const,
    variant: review ? ('review' as const) : ('main' as const),
  };
  const rows = stockRows(visual);
  const sumA = review ? 36 : 23;
  const sumB = review ? 7 : 8;
  const capacity = review ? 43 : 30;
  const more = review ? 25 : 18;
  const less = review ? 8 : 9;
  const difference = more - less;
  const group = review ? 30 : 20;
  const total = review ? 52 : 35;
  const part = review ? 8 : 7;
  const red = review ? 48 : 24;
  const blue = review ? 7 : 8;
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
    hint: '先指出已知量、要求的量和单位，再选合并、去掉或比较的关系；算完核对题意。',
    explanation,
  });
  const choice = (
    key: string,
    prompt: string,
    options: string[],
    value: string,
    explanation: string,
    table = false,
  ): Question => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
    ...(table ? { visual } : {}),
    choices: options.map((label, i) => ({ id: String(i), label })),
    rule: { kind: 'choice', value },
    hint: '不跨行套用数量，不把未知量当0；区分能算的量与条件不足的问题。',
    explanation,
  });
  return [
    {
      id: `${id}-${review ? 'r' : 'q'}-table`,
      knowledge: `${id}-table`,
      prompt: `看表，纸卡原有${required(rows[0]).initial}张。按A、B、C顺序填写三种物品各自的剩余量。`,
      visual,
      rule: {
        kind: 'steps',
        values: rows.map((row) => row.initial - row.sold),
      },
      hint: '每一行用原有减卖出，A、B、C对准各自物品；空格不是0。',
      explanation: `${rows
        .map(
          (row) =>
            `${row.id}：${row.initial}－${row.sold}＝${row.initial - row.sold}`,
        )
        .join('；')}。各行单位分别保留。`,
    },
    choice(
      'row',
      `求C行原有${required(rows[2]).initial}枚书签、卖出${required(rows[2]).sold}枚之后的剩余量，哪条算式对应同一行？`,
      [
        `${required(rows[2]).initial}－${required(rows[2]).sold}`,
        `${required(rows[2]).initial}－${required(rows[0]).sold}`,
        `${required(rows[2]).initial}＋${required(rows[2]).sold}`,
      ],
      '0',
      'C行的原有与卖出配对，不能减A行的卖出量。',
      true,
    ),
    choice(
      'meaning',
      `B行原有${required(rows[1]).initial}张贴纸、卖出${required(rows[1]).sold}张。空格B应该表示什么？`,
      ['卖出后还留下的贴纸数量', '已经卖出的数量', '没有写数字，所以一定是0'],
      '0',
      '空格是待求的剩余量；未填写不表示已确认0。',
      true,
    ),
    choice(
      'capacity',
      `有${sumA}张和${sumB}张纸卡，两堆没有重叠。盒子最多放${capacity}张，能把这些卡全部放进去吗？`,
      ['能，合计不超过容量', '不能，合计超过容量'],
      review ? '0' : '1',
      `${sumA}＋${sumB}＝${sumA + sumB}，与${capacity}比较；等于容量也能全部放入。`,
    ),
    number(
      'shortage',
      `还是${sumA}张与${sumB}张、容量${capacity}张的盒子。若把全部卡放入，至少缺多少张的容量？够放则填0。`,
      Math.max(0, sumA + sumB - capacity),
      '先合计再比较，0可以表示已核验够放，不把空白当0。',
    ),
    number(
      'equalize',
      `小组甲有${less}张卡，小组乙有${more}张卡。只给甲添卡、乙不改变，甲至少再添多少张，才和乙同样多？`,
      difference,
      `${more}－${less}＝${difference}（张），添到较少的一组。`,
    ),
    choice(
      'reverse',
      `甲${less}张、乙${more}张，下面两句话怎样判断：“乙比甲多${difference}张”“甲比乙少${difference}张”？`,
      [
        '两句都正确，比较的是同一个差',
        '前句正确，后句一定错误',
        '两组的差随说话方向变化',
      ],
      '0',
      '多与少的说法方向相反，但对应的差相同；不能把多的数量当差。',
    ),
    choice(
      'condition',
      `一次报名只分甲乙两组，每人只记一次。已知甲组${group}人，要算两组一共有多少人，还需补什么条件？`,
      ['乙组报名人数', '甲组每个人身高', '活动日期'],
      '0',
      '需知道另一组的人数，不能自行把未知人数补成0或沿用别题示例。',
    ),
    choice(
      'unknown',
      `仍只知道甲组${group}人、乙组人数未给。现在能直接断定总报名人数就是${group}吗？`,
      ['不能，乙组人数未知，需要补充条件', '能，未写出的数量一律算0'],
      '0',
      '未知与已知0不同，条件不足时不编唯一数值。',
    ),
    number(
      'join',
      `有${sumA}张纸卡，又收到${sumB}张，总共多少张？`,
      sumA + sumB,
      `合并两个部分，${sumA}＋${sumB}＝${sumA + sumB}（张）。`,
    ),
    number(
      'remaining',
      `原有${review ? 60 : 41}张纸卡，送出${review ? 8 : 6}张，还剩多少张？`,
      review ? 52 : 35,
      review
        ? '60－8＝52（张），个位0需要拆十。'
        : '41－6＝35（张），不是41＋6，也不能忽略退位。',
    ),
    number(
      'missing-part',
      `两份纸卡合计${total}张，一份${part}张，另一份多少张？`,
      total - part,
      `总数减去已知部分，${total}－${part}＝${total - part}（张）。`,
    ),
    {
      id: `${id}-${review ? 'r' : 'q'}-questions`,
      knowledge: `${id}-questions`,
      prompt: `只有“红卡${red}张、蓝卡${blue}张”两条信息，哪些问题能直接算出？全部选出。`,
      choices: [
        { id: 'sum', label: '红蓝卡合起来共有多少张？' },
        { id: 'difference', label: '红卡比蓝卡多多少张？' },
        { id: 'price', label: '买这些卡共花多少钱？' },
      ],
      rule: { kind: 'set', values: ['sum', 'difference'] },
      hint: '可以合并或比较已知数量；费用还需要价格信息。',
      explanation: `总张数${red + blue}与差${red - blue}均由条件可求，未给价格不能算花费。`,
    },
  ];
}
export const sujiaoPracticalProblemsDraft: Lesson = {
  id,
  title: '加减应用：读库存表、够放与补条件',
  textbookTitle: '两位数加减·练习七与练习八应用',
  page: 69,
  version: 1,
  status: 'preparing',
  goal: '按行列读取原有、卖出和剩余，计算后比较容量，理解同样多和差，识别信息不足并提出可回答的问题。',
  prerequisite:
    '会两位数加减整十数和一位数（含进退位）；准备纸笔和自制数量卡。',
  parentTip: `依据ISBN ${source.isbn}实际读印刷63、69～70页的相关应用范围，原创纸卡、库存与报名例子。表内不复制原图、不给剩余答案，复习改原有/卖出、容量够放与恰满情形及差。报名只是假设两组每人一次，不记录姓名、不从外貌归类；未知条件不默认0。`,
  steps: [
    {
      title: '先按同一行读取数量',
      text: '库存表每行是一种物品。A纸卡原有43张，卖出7张，剩余用43－7；B贴纸原有30张，卖出6张；C书签原有52枚，卖出9枚。A、B、C是待求量，不是0。只配对同一行，别把另一种物品的卖出数拿来减。',
      visual: { kind: 'stock-table', variant: 'main' },
      activity: '在纸上抄三行已知量，分别标单位，再填写各自剩余。',
    },
    {
      title: '算合计后再判断够不够',
      text: '两堆不重叠的卡为23张和8张，合计31张。盒子最多放30张，31比30多1，所以全部放入还缺1张容量。若总数等于容量，则正好够；并非一定要小于才够。',
      activity: '画出两部分与容量，比较31和30，说明判断依据。',
    },
    {
      title: '添到同样多与多、少的方向',
      text: '甲9张、乙18张，只给甲添9张后才相等。乙比甲多9和甲比乙少9说的是同一个差。不能把乙原有18当成需添数量，也不能同时改变乙。',
      activity: '实际用两组数量卡，添到较少的一组，再两方向口述差。',
    },
    {
      title: '未知量不是0，补条件再求总数',
      text: '假设报名只分甲乙两组、每人只记一次。只知道甲20人，还需乙人数才能求总数。可以自己补一个合理的乙人数，再算总数并明确“我补的条件”；不能把自己的示例说成原题唯一答案，也不能以未写出推0。',
      activity:
        '纸面补一个乙人数，使总数在99以内，注明条件是自己补的，列式核对。',
    },
    {
      title: '提出问题并核对能否回答',
      text: '知道红卡24张、蓝卡8张，可以问共有多少或红比蓝多多少；没有单价不能算花费。自由提问可有多种表达，先说所需条件再回答。换成另一张库存表要重新读数据，别背上次结果。',
      visual: { kind: 'stock-table', variant: 'review' },
      activity:
        '对新表或红蓝卡信息提出自己的问题，标注已知条件与是否需补条件。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际在纸上填写三行库存表，分别写原有减卖出的算式和单位，再逐行核对，不跨行取数。',
      '实际画两堆23与8张卡、容量30张的比较；另摆甲9与乙18张两组卡，只给甲添到同样多，口述差和需添量。',
      '实际给甲20人、乙未知的两组报名补一个明确合理的乙人数，总数在99以内，写“我补的条件”并列式，再换另一条件核对。',
    ].map((prompt, i): Question => ({
      id: `${id}-manual-${i}`,
      knowledge: `${id}-manual-${i}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '纸面填写、真实摆卡或补条件与表达完成后独立确认，可暂时跳过。',
      explanation: '静态表和网页得分不自动确认真实任务。',
    })),
    {
      id: `${id}-own-question`,
      knowledge: `${id}-own-question`,
      prompt:
        '已知红卡24张、蓝卡8张。写一个你自己提出的问题、它需要的条件和你的回答；条件不足可以注明还缺什么。',
      rule: { kind: 'reflection' },
      hint: '可以有不同问题，保留真实原话，不强制唯一标准答案。',
      explanation: '自主问题原话保存为null，不评分，不替代纸面活动。',
    },
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt: '你怎样先读条件再选算式？记录一个发现或仍需核对的问题。',
      rule: { kind: 'reflection' },
      hint: '记录真实过程，不要求唯一表达。',
      explanation: '反思null单独保存，不评分。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '已读应用范围与原创问题核验',
    notes: `ISBN ${source.isbn}印刷63、69～70页相关范围，改变真实条件的复习。版次印次未知，不证明完整练习七/八或整单元已全部实现。`,
  },
};
