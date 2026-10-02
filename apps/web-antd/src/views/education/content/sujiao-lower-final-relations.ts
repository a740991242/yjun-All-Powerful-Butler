import type { Lesson, Question } from '../learning/types';

import { classCapacityFacts } from '../learning/class-capacity';
import { sujiaoLowerSource as source } from './sujiao-lower-source';

const id = 'sj-lower-final-relations';
function tasks(review: boolean): Question[] {
  const larger = review ? 18 : 19;
  const smaller = review ? 9 : 12;
  const difference = larger - smaller;
  const variant = review ? 'review' : 'main';
  const capacity = {
    kind: 'class-capacity' as const,
    variant: variant as 'main' | 'review',
  };
  const rows = {
    kind: 'comparison-rows' as const,
    counts: [larger, smaller] as [number, number],
  };
  const bars = {
    kind: 'comparison-bars' as const,
    reference: smaller,
    difference,
    direction: 'more' as const,
  };
  const { classes, rooms } = classCapacityFacts(variant);
  const totals = classes.map((row) => row.first + row.second);
  const people = review ? 40 : 38;
  const tables = review ? 20 : 10;
  const chairs = review ? 8 : 7;
  const above = review ? 16 : 13;
  const below = review ? 7 : 6;
  const common = (key: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
  });
  const number = (
    key: string,
    prompt: string,
    value: number,
    explanation: string,
  ): Question => ({
    ...common(key),
    prompt,
    rule: { kind: 'number', value },
    hint: '先确定求的是合计、相差还是某一方的全部数量，再选对应条件。',
    explanation,
  });
  const choice = (
    key: string,
    prompt: string,
    choices: Question['choices'],
    value: string,
    explanation: string,
  ): Question => ({
    ...common(key),
    prompt,
    choices,
    rule: { kind: 'choice', value },
    hint: '读清已知条件、比较标准和问题范围，不按多或少一个字猜运算。',
    explanation,
  });
  return [
    {
      ...number(
        'more-difference',
        'A组比B组多几张卡？图中每个图形表示一张卡。',
        difference,
        `${larger}－${smaller}＝${difference}，配对后多出的部分是相差数量。`,
      ),
      visual: rows,
    },
    {
      ...number(
        'less-difference',
        'B组比A组少几张卡？图中每个图形表示一张卡。',
        difference,
        `少多少也是两组相差${difference}张，不是B组的全部${smaller}张。`,
      ),
      visual: rows,
    },
    {
      ...number(
        'total',
        'A、B两组一共几张卡？两组没有重复的卡。',
        larger + smaller,
        `${larger}＋${smaller}＝${larger + smaller}，合计与相差不是同一个问题。`,
      ),
      visual: rows,
    },
    {
      ...number(
        'target-more',
        `A组有${smaller}张，B组比A组多${difference}张，B组有几张？`,
        larger,
        `B组的全部数量包括标准${smaller}张和多出的${difference}张，合起来${larger}张。`,
      ),
      visual: bars,
    },
    {
      ...number(
        'target-less',
        `A组有${larger}张，B组比A组少${difference}张，B组有几张？`,
        smaller,
        `${larger}－${difference}＝${smaller}，求少的一方的全部数量。`,
      ),
      visual: {
        kind: 'comparison-bars',
        reference: larger,
        difference,
        direction: 'less',
      },
    },
    {
      ...choice(
        'scope',
        '图中问B组一共有几张，应数或计算哪一段？',
        [
          { id: 'whole', label: 'B组整段，包括与A相同和多出的部分' },
          { id: 'extra', label: '只算多出的短段' },
        ],
        'whole',
        '求B组全部数量不能只回答差值；线段图是关系示意，不按画出的长度测数量。',
      ),
      visual: bars,
    },
    {
      ...common('class-totals'),
      prompt: '每班分为不重叠的两队，已列出全班所有人。依次填A、B、C班总人数。',
      visual: capacity,
      rule: { kind: 'steps', values: totals },
      hint: '每班只合并自己这一行的两队，不能跨班拼人数。',
      explanation: classes
        .map(
          (row, i) => `${row.id}班${row.first}＋${row.second}＝${totals[i]}人`,
        )
        .join('；'),
    },
    {
      ...common('assign'),
      prompt:
        '三个班同时活动，每班整班使用一个教室，一个教室只安排一个班，不拆班、不合班。依次选择A、B、C班的教室，每室用一次。',
      visual: capacity,
      choices: rooms.map((room) => ({
        id: room.id,
        label: `${room.id}教室（${room.capacity}人）`,
      })),
      rule: { kind: 'sequence', values: ['Y', 'Z', 'X'] },
      hint: '先看每班全部人数，再核对容量和教室是否已被其他班占用。',
      explanation: `C班${totals[2]}人只能用X，A班${totals[0]}人用Y，B班${totals[1]}人用Z；每班都够坐且没有重复教室。`,
    },
    {
      ...common('alone'),
      prompt:
        '另一个问题：只有B班单独活动，其他班不使用教室。选出全部能容纳B班的教室，不要求空位最少。',
      visual: capacity,
      choices: rooms.map((room) => ({
        id: room.id,
        label: `${room.id}教室（${room.capacity}人）`,
      })),
      rule: { kind: 'set', values: ['X', 'Y', 'Z'] },
      hint: '本题与三个班同时安排不同，只比较B班人数与各教室容量。',
      explanation: `B班${totals[1]}人，三个教室都够；不能把上一题分配结果当成唯一可用教室。`,
    },
    {
      ...common('shortages'),
      prompt: `${people}人每人需要1张桌子和1把椅子，已有${tables}张桌子、${chairs}把椅子。依次填还缺桌子几张、椅子几把。`,
      rule: { kind: 'steps', values: [people - tables, people - chairs] },
      hint: '桌子与椅子分别按每人一件核对，不能把两种物品的数量加在一起抵用。',
      explanation: `缺桌子${people}－${tables}＝${people - tables}张，缺椅子${people}－${chairs}＝${people - chairs}把。`,
    },
    choice(
      'same-reference',
      `A组比同一个标准数量多${above}张，B组比这个标准少${below}张，标准至少${below}张。哪组卡更多？`,
      [
        { id: 'A', label: 'A组更多' },
        { id: 'B', label: 'B组更多' },
        { id: 'equal', label: '两组相同' },
      ],
      'A',
      '两组分别在同一标准的上方和下方，可以比较，不必先知道标准的具体数量。',
    ),
    number(
      'reference-difference',
      `A组比同一个标准多${above}张，B组比这个标准少${below}张，标准至少${below}张。A比B多几张？`,
      above + below,
      `相差包括标准两边的${above}与${below}，合计${above + below}张；不是两个差值相减。`,
    ),
    choice(
      'unknown',
      review
        ? '只记录A班一队14人，另一队人数未记录，能确定全班人数吗？'
        : '只记录A班一队12人，另一队人数未记录，能确定全班人数吗？',
      [
        { id: 'ask', label: '不能，需补齐另一队人数，未记录不等于0' },
        { id: 'zero', label: '能，另一队没写就当0人' },
      ],
      'ask',
      '新情境条件不足，不借用例表的另一队人数，也不能把缺失信息当0。',
    ),
    {
      ...choice(
        'reuse',
        '三个班同时活动，一室只能安排一班。因为三个班分别都能坐进X教室，就把三班都安排在X，可以吗？',
        [
          { id: 'no', label: '不可以，还要满足一室一班且三班同时' },
          { id: 'yes', label: '可以，只需各班人数不超容量' },
        ],
        'no',
        '单独够坐是必要条件，不能替代同时安排时教室不重复的条件。',
      ),
      visual: capacity,
    },
  ];
}
export const sujiaoLowerFinalRelationsDraft: Lesson = {
  id,
  title: '期末应用：数量关系与教室安排',
  textbookTitle: '期末复习：数量关系与综合应用',
  page: 89,
  status: 'preparing',
  version: 1,
  goal: '区分求合计、求相差与按差求数量，读配对人数表，按容量和同时使用条件安排教室，并用共同标准解释相差。',
  prerequisite:
    '已学习100以内加减与数量比较；准备卡片和纸笔，用纸面模拟班级与教室，不组织真实人员或收集姓名。',
  parentTip:
    '依据已读89、91～94页相应数量关系与应用范围设计原创例题。图示不提供待求答案；能算出人数不代表完成真实场地安排。实物、纸面与解释独立人工确认，开放反思不评分。',
  steps: [
    {
      title: '同一数据，不同问题',
      text: 'A有19张、B有12张。A比B多7张，B比A少7张，两组合计31张。求多多少和少多少都求相差；一共求合计，不能只看关键词就选算式。',
      visual: { kind: 'comparison-rows', counts: [19, 12] },
      activity: '实际一一配对卡片，指出共同部分、多出部分和两组全部。',
    },
    {
      title: '按差求一方的全部数量',
      text: '标准组12张，另一组多7张，另一组全部是19张；标准组19张，另一组少7张，另一组全部是12张。先明确标准、差和所求对象，B整段问号不是仅问多出的短段。',
      visual: {
        kind: 'comparison-bars',
        reference: 12,
        difference: 7,
        direction: 'more',
      },
      activity:
        '实际画两种关系图，标标准、差和所求整段，不用尺子量示意图求数量。',
    },
    {
      title: '人数表按行合并',
      text: '每班两队不重叠、已列出全班。A班12加20为32人，B班13加10为23人，C班18加20为38人。先找班级，再读该行两列；跨行合并会混淆班级，未记录人数的新情境不能当0。',
      visual: { kind: 'class-capacity', variant: 'main' },
      activity: '纸面分别圈出每班两队，写各班总人数并说明信息来源。',
    },
    {
      title: '单独够坐与同时安排',
      text: '三班同时且一室一班、不拆班。C班38人只够用X；A班32人用Y正好，B班23人用Z。若另问B班单独活动，X、Y、Z都够，不只Z。容量相等也够坐，人数够坐与空位最少是不同问题。',
      visual: { kind: 'class-capacity', variant: 'main' },
      activity:
        '实际用纸卡安排三班，再改单班问题，逐项核对容量、同时与不重复条件。',
    },
    {
      title: '共同标准与分别补齐',
      text: 'A比同一标准多13张，B比它少6张，A比B多19张，不需要先猜标准。可用自己注明的示例标准20张核对：A33、B14，差19；20只是另选例子。桌椅缺额则按每人一件分别求，不能把桌子和椅子互相替代。',
      activity:
        '纸面选一个足够大的共同标准，标明这是自己选的示例，画两边差值；另列桌椅缺额。',
    },
    {
      title: '检查条件与表达',
      text: '先问范围、单位和条件是否齐全，再算与检验。原表是原创教学例子，不是学校实际人数或场地容量；真实安排由学校核验。记录自己的方法、困难或新问题，不把网页正确答案当真实活动完成。',
      activity: '讲述一个不同问法会改答案的问题，指出还需核对的条件。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际摆卡或画图，分别解释求相差、求合计、比标准多求全部、比标准少求全部四种关系。',
      '实际在纸面按班级配对两队人数，算各班合计，并口述为什么不能跨行合并；无需记录真实姓名。',
      '实际用纸卡安排三班同时进教室，逐项核对不拆班、一室一班和容量，再指出B班单独有哪些选择。',
      '实际自己选并注明一个共同标准，画标准两边数量与差，再分别说明桌子和椅子缺额的单位。',
    ].map((prompt, i): Question => ({
      id: `${id}-manual-${i}`,
      knowledge: `${id}-manual-${i}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '真实纸面或实物完成并由家长查看后确认，未做可暂时跳过。',
      explanation: '独立记录实际操作与表达，客观答对不自动确认人工任务。',
    })),
    ...[
      '哪个问题你容易把相差当全部？记录自己的例子和改进办法。',
      '你怎样检查同时安排的条件？写真实想法、还需帮助的地方或自己提出的新问题。',
    ].map((prompt, i): Question => ({
      id: `${id}-reflection-${i}`,
      knowledge: `${id}-reflection-${i}`,
      prompt,
      rule: { kind: 'reflection' },
      hint: '记录自己的真实想法，没有唯一答案。',
      explanation: '保留原话、correct为null，不代替人工任务或自动认定掌握。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '89、91～94页数量关系与容量范围及原创题核验',
    notes: `依据实际读取ISBN ${source.isbn}印刷89、91～94页相应数量关系与应用范围；教学数据原创，未复制扫描，复习改变真实数量，不替代其他期末内容或全年覆盖核验。`,
  },
};
