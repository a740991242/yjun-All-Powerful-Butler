import type { Lesson, Question, Visual } from '../learning/types';

import { sujiaoLowerSource as source } from './sujiao-lower-source';
const differenceId = 'sj-lower-quantity-difference';
const targetId = 'sj-lower-comparison-target';
function differenceTasks(review: boolean): Question[] {
  const large = review ? 17 : 13;
  const small = review ? 9 : 6;
  const more = review ? 'B' : 'A';
  const less = review ? 'A' : 'B';
  const d = large - small;
  const visual: Visual = {
    kind: 'comparison-rows',
    counts: review ? [9, 17] : [13, 6],
  };
  const base = (key: string, prompt: string) => ({
    id: `${differenceId}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${differenceId}-${key}`,
    prompt,
    visual,
    hint: '一对一对应，两行同单位；相差数是不配对的那部分，不是两行合起来的总数。求差用较多减较少，不因提问“少”而把减法顺序倒过来。',
  });
  const number = (
    key: string,
    prompt: string,
    value: number,
    explanation: string,
  ): Question => ({
    ...base(key, prompt),
    rule: { kind: 'number', value },
    explanation,
  });
  const choice = (
    key: string,
    prompt: string,
    choices: { id: string; label: string }[],
    value: string,
    explanation: string,
  ): Question => ({
    ...base(key, prompt),
    choices,
    rule: { kind: 'choice', value },
    explanation,
  });
  return [
    number(
      'more',
      `图中${more}行有${large}个、${less}行有${small}个标记。${more}比${less}多几个？`,
      d,
      `${large}－${small}＝${d}，一一对应后多出的部分是${d}个。`,
    ),
    number(
      'less',
      `仍是${more}行${large}个、${less}行${small}个。${less}比${more}少几个？`,
      d,
      `较少比较多少几个与较多比较少多几个，是同一个相差数${d}。`,
    ),
    {
      ...base(
        'both',
        `先填${more}比${less}多几个，再填${less}比${more}少几个。两项都问相差数。`,
      ),
      rule: { kind: 'steps', values: [d, d] },
      explanation: `两种说法都表示相差${d}个，不是一项正数另一项负数。`,
    },
    choice(
      'equation',
      `求图中两行相差几个，应该选哪个算式？${more}有${large}、${less}有${small}。`,
      [
        { id: 'subtract', label: `${large}－${small}` },
        { id: 'add', label: `${large}＋${small}` },
        { id: 'reverse', label: `${small}－${large}` },
      ],
      'subtract',
      '求相差数，用较多的数量减较少的数量；加法求合计，不能颠倒。',
    ),
    number(
      'missing-addend',
      `较少的${less}行是${small}个。${small}加几等于较多的${large}个？`,
      d,
      `${small}＋${d}＝${large}，可用加法检查相差数。`,
    ),
    choice(
      'difference-not-total',
      `有人说相差数是${large + small}，因为把${large}和${small}合起来了。这是在求什么？`,
      [
        { id: 'total', label: '两行合计，不是相差数' },
        { id: 'difference', label: '相差数，合计与相差总是一样' },
      ],
      'total',
      '总数与相差数问的是不同数量关系，不能只看都出现两个数。',
    ),
    number(
      'add-to-equal',
      `保持${more}的${large}个不动，只给${less}的${small}个添上标记，使两行一样多，要添几个？`,
      d,
      `较少的添${d}个达到${large}；这里只添一行，不是从另一行搬来。`,
    ),
    number(
      'remove-to-equal',
      `保持${less}的${small}个不动，只从${more}的${large}个中拿走一些，使两行一样多，要拿走几个？`,
      d,
      `较多的拿走相差的${d}个就与较少的一样。`,
    ),
    {
      ...number(
        'equal-zero',
        `另两行各有${review ? 8 : 9}个，同单位且范围相同，相差几个？`,
        0,
        '数量相同，相差0，不是漏填，也不需要添或拿。',
      ),
      visual: { kind: 'comparison-rows', counts: review ? [8, 8] : [9, 9] },
    },
    {
      ...number(
        'empty-row',
        `另一图A行有${review ? 7 : 9}个，B行已核对没有标记。两行相差几个？`,
        review ? 7 : 9,
        '已核对的空行是0；较多减0仍是较多的数量。',
      ),
      visual: { kind: 'comparison-rows', counts: [review ? 7 : 9, 0] },
    },
    choice(
      'which-more',
      `本题原图${more}行${large}个、${less}行${small}个，哪一行数量较多？不能固定认为上面一行更多。`,
      [
        { id: 'A', label: 'A行' },
        { id: 'B', label: 'B行' },
      ],
      more,
      '按实际数量比较，行的位置或标记形状不决定多少。',
    ),
    choice(
      'same-unit',
      `如果A记录${review ? 17 : 13}本书，B记录${review ? 9 : 6}页书，能像原图那样直接说“相差几个物品”吗？`,
      [
        { id: 'no', label: '不能，单位和所数对象不同，要先明确比较范围' },
        { id: 'yes', label: '能，只要两个数不一样就直接相减' },
      ],
      'no',
      '同一种数量、同单位才直接比较相差多少；页与本不能当同一种数量。',
    ),
  ];
}
function targetTasks(review: boolean): Question[] {
  const a = review ? 23 : 14;
  const d = review ? 6 : 5;
  const base = (key: string, prompt: string) => ({
    id: `${targetId}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${targetId}-${key}`,
    prompt,
    hint: '先指明谁的数量已知、以谁为比较标准、求谁。求较多数加差，求较少数减差；不要只看到“多”就加、看到“少”就减。',
  });
  const number = (
    key: string,
    prompt: string,
    value: number,
    explanation: string,
  ): Question => ({
    ...base(key, prompt),
    rule: { kind: 'number', value },
    explanation,
  });
  const choice = (
    key: string,
    prompt: string,
    choices: { id: string; label: string }[],
    value: string,
    explanation: string,
  ): Question => ({
    ...base(key, prompt),
    choices,
    rule: { kind: 'choice', value },
    explanation,
  });
  return [
    number(
      'more-target',
      `A有${a}张卡，B比A多${d}张，B有几张？`,
      a + d,
      `B在A的${a}张基础上多${d}张，${a}＋${d}＝${a + d}。`,
    ),
    number(
      'less-target',
      `A有${a}张卡，C比A少${d}张，C有几张？`,
      a - d,
      `C从A的${a}张中少${d}张，${a}－${d}＝${a - d}。`,
    ),
    choice(
      'reference',
      `A有${a}张，B比A多${d}张，要找B。这里的已知比较标准是谁的${a}张？`,
      [
        { id: 'A', label: 'A的数量' },
        { id: 'B', label: 'B的数量' },
        { id: 'difference', label: '把相差数当总数' },
      ],
      'A',
      '以已知的A为标准，B是待求数量。',
    ),
    choice(
      'what-difference-means',
      `A有${a}张，B比A多${d}张。${d}张表示什么？`,
      [
        { id: 'difference', label: 'B与A的相差数，不是B全部数量' },
        { id: 'B-total', label: 'B全部只有这么多张' },
      ],
      'difference',
      '差只表示多出的部分，B还包含与A一样多的那部分。',
    ),
    number(
      'more-word-less-target',
      `换一种说法：A有${a}张，A比B多${d}张。B有几张？`,
      a - d,
      `现在A较多、求较少B，${a}－${d}＝${a - d}；不能只看“多”字就加。`,
    ),
    number(
      'less-word-more-target',
      `A有${a}张，A比B少${d}张。B有几张？`,
      a + d,
      `A较少、求较多B，${a}＋${d}＝${a + d}；不能只看“少”字就减。`,
    ),
    choice(
      'word-trap',
      `A有${a}张，A比B多${d}张，要算B，正确方法是哪一种？`,
      [
        { id: 'subtract', label: `${a}－${d}，求较少的B` },
        { id: 'add', label: `${a}＋${d}，看到多就加` },
      ],
      'subtract',
      '比较方向与未知对象共同决定算式，不以单个词替代分析。',
    ),
    number(
      'zero-difference',
      `A有${a}张，B比A多0张，也就是一样多。B有几张？`,
      a,
      '相差0表示一样多，不把B当0，也不把0当未知。',
    ),
    choice(
      'missing-reference',
      `只知道B比A多${d}张，要确定B有几张，还需要哪一个条件？`,
      [
        { id: 'A-count', label: 'A的实际数量' },
        { id: 'colour', label: '卡片的颜色' },
        { id: 'none', label: '不用条件，B就是相差数' },
      ],
      'A-count',
      '只给相差数无法确定各自总量，未知A不能默认0。',
    ),
    choice(
      'check-direction',
      `A有${a}张，B比A多${d}张，有人把B算成${a - d}张。B比A还少，这符合题意吗？`,
      [
        { id: 'no', label: '不符合，待求的B应该较多' },
        { id: 'yes', label: '符合，只要做了减法即可' },
      ],
      'no',
      '用结果大小与原数量关系核对，发现方向相反就重查算式。',
    ),
    {
      ...base(
        'two-targets',
        `A有${a}张，B比A多${d}张，C比A少${d}张。先填B的张数，再填C的张数；两题都以A为标准。`,
      ),
      rule: { kind: 'steps', values: [a + d, a - d] },
      explanation: `B为${a + d}张，C为${a - d}张；不能把C改成比B少。`,
    },
    number(
      'changed-reference',
      `另一个情境，A有${a + d}张，A比B少${d}张。现在B有几张？不要沿用A有${a}张的旧条件。`,
      a + 2 * d,
      `${a + d}＋${d}＝${a + 2 * d}，条件变化后重新判断。`,
    ),
  ];
}
function endTasks(
  id: string,
  activities: string[],
  prompt: string,
): Question[] {
  return [
    ...activities.map((task, i): Question => ({
      id: `${id}-manual-${i}`,
      knowledge: `${id}-manual-${i}`,
      prompt: task,
      rule: { kind: 'manual' },
      hint: '真实摆放、纸面或口述后独立确认，可以暂跳。',
      explanation: '网页答对不自动完成纸面或实物任务。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt,
      rule: { kind: 'reflection' },
      hint: '保留真实发现或待解决的问题。',
      explanation: '开放反思null保存，不评分。',
    },
  ];
}
export const sujiaoQuantityDifferenceDraft: Lesson = {
  id: differenceId,
  title: '求相差多少：一一对应与两种说法',
  textbookTitle: '简单的数量关系·求相差数',
  page: 72,
  version: 1,
  status: 'preparing',
  goal: '按同单位一一对应理解相差数，区分多多少、少多少与合计，并用加减互相核对。',
  prerequisite: '会20以内减法和两位数减一位数；准备两种纸卡。',
  parentTip: `依据ISBN ${source.isbn}实际读印刷72～73、76页求差与同样多情境，原创两行图13/6，复习交换数量方向为9/17。图只标原数量与一一连接，不标相差结果；不把比较变成物品移动问题。`,
  steps: [
    {
      title: '找出已知数量与要问的数量',
      text: 'A有13个，B有6个标记，单位相同。问A比B多几个，是问差，不是问两行合起来的总数。图上A是圆形，B是方形，形状只区分两行，每个都代表同单位的1个。',
      visual: { kind: 'comparison-rows', counts: [13, 6] },
      activity: '用两种卡片实际摆13张和6张，先说清已知与要问什么。',
    },
    {
      title: '左边对齐，一张配一张',
      text: '从同一位置开始，每个B配一个A。虚线只表示一对，不多算物品。配完后A剩下没有配对的那部分，就是相差的数量。',
      visual: { kind: 'comparison-rows', counts: [13, 6] },
      activity: '实际把两行一一对齐，指出已经配成对与没有配成对的部分。',
    },
    {
      title: '多几个与少几个是同一个差',
      text: '13－6＝7，A比B多7个；反过来说B比A少7个，差不变。并不是说B要用6减13得到负数。也可用6＋7＝13核对。',
      visual: { kind: 'comparison-rows', counts: [13, 6] },
      activity: '纸面写两种说法和减法算式，再用加法核对。',
    },
    {
      title: '与合计、添到一样多分开',
      text: '13＋6＝19是合计，不是差。保持A不动，给B添7个会同样多；保持B不动，从A拿走7个也会同样多。这是只改变一行，不是把A的一些移给B，两行同时变化另行分析。',
      activity: '实际分别做只添较少行与只拿较多行，两次先恢复原来的13与6。',
    },
    {
      title: '数量相同、空行与反向位置',
      text: '两行各9个，相差0；A9个、B已核对没有，相差9。没有调查过的空白不能当0。复习改A9个、B17个，下面B反而更多，不看行位置或颜色猜数量。',
      visual: { kind: 'comparison-rows', counts: [9, 17] },
      activity: '实际交换多少两行，解释差不变，但谁较多要按新数量确定。',
    },
  ],
  questions: [
    ...differenceTasks(false),
    ...endTasks(
      differenceId,
      [
        '实际摆13张与6张纸卡，从同一边一一对应，指出未配对部分并说明单位。',
        '实际画两行图并记录“A多7”与“B少7”两种说法，再用6＋7＝13核对。',
        '实际保持一行不动，用添或拿使两行一样多；恢复原数后交换行位置，口述谁较多。',
      ],
      '你怎样知道“多几个”与“少几个”问的是同一个差？记录发现或还没明白的地方。',
    ),
  ],
  reviewQuestions: differenceTasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '已读求差范围与对应图核验',
    notes: `ISBN ${source.isbn}印刷72～73、76页范围，原创图与复习；版次印次未知，不代表整个单元。`,
  },
};
export const sujiaoComparisonTargetDraft: Lesson = {
  id: targetId,
  title: '按多或少求数量：先找比较标准',
  textbookTitle: '简单的数量关系·求较多数与较少数',
  page: 74,
  version: 1,
  status: 'preparing',
  goal: '区分已知基准数量、相差数与待求对象，分析较多或较少后列式，不按关键词机械选加减。',
  prerequisite: '会求相差数与两位数加减一位数；准备纸卡和数位记录。',
  parentTip: `依据ISBN ${source.isbn}实际读印刷74～75页与76页相关比较问题，原创14与5、复习23与6；先确定比较标准与求谁。待求数量不提前画成可直接数出的图，教学已知例子的图只用于观察；不把后续综合应用视为已完成。`,
  steps: [
    {
      title: '谁已知，以谁为标准，求谁',
      text: 'A有14张，B比A多5张，求B。先指A14张是已知比较标准，5张是相差数，B全部数量才是未知。不能把多5张说成B只有5张。',
      activity: '在纸面标“已知A14”“差5”“求B”，不用符号位置代替对象关系。',
    },
    {
      title: '求较多数，在基准上加差',
      text: 'B比A多5张，先有与A一样多的14张，再多5张。14＋5＝19。下面图给的是讲解后的14与19，供核对两种数量；练习待求图不提前画出答案。',
      visual: { kind: 'comparison-rows', counts: [14, 19] },
      activity: '实际摆A14张，再摆与A同样多的一行并添5张，独立数清核对。',
    },
    {
      title: '求较少数，在基准上减差',
      text: 'A有14张，C比A少5张，C是较少的一行，14－5＝9。比较标准仍是A，不把C误当比B少5张。',
      visual: { kind: 'comparison-rows', counts: [14, 9] },
      activity: '恢复基准14张，实际摆较少5张的行，画图解释为什么减。',
    },
    {
      title: '换说法，不能只看多或少',
      text: 'A14张，A比B多5张，求的是较少B，应14－5＝9。A14张，A比B少5张，求的是较多B，应14＋5＝19。多或少描述谁，要读完整；不是出现多就加。',
      activity: '纸面写两种相反描述，分别指出较多对象、较少对象与待求对象。',
    },
    {
      title: '用关系核对，条件变化重新想',
      text: '相差0是一样多，B与A都14张。只给“B比A多5”而不知道A，不能确定B总数。复习改A23张、差6；每题都重新看比较标准和求谁，保留真实摆卡与纸面记录。',
      activity:
        '实际改成23和6，另编一个较多或较少问题，检查答案大小是否符合原关系。',
    },
  ],
  questions: [
    ...targetTasks(false),
    ...endTasks(
      targetId,
      [
        '实际以14张为基准分别摆较多5张、较少5张的两行，先恢复基准再做第二次，逐一核对。',
        '实际纸面写“A14，A比B多5”和“A14，A比B少5”，圈出待求B，再画图或列式说明方向。',
        '实际另编一个同单位的较多或较少问题，明确已知基准、差与求谁，并口述结果大小核对。',
      ],
      '你怎样避免只看到“多”就加、看到“少”就减？保留真实解释或待解决的问题。',
    ),
  ],
  reviewQuestions: targetTasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '已读比较标准与目标数量范围核验',
    notes: `ISBN ${source.isbn}印刷74～76页范围，原创数值与复习；未知数量不画答案，版次印次未知。`,
  },
};
