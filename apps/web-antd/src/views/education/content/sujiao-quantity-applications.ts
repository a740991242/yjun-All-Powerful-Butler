import type { Lesson, Question, Visual } from '../learning/types';

import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-quantity-applications';
function tasks(review: boolean): Question[] {
  const more: Visual = {
    kind: 'comparison-bars',
    reference: review ? 41 : 32,
    difference: review ? 8 : 7,
    direction: 'more',
  };
  const less: Visual = {
    kind: 'comparison-bars',
    reference: review ? 35 : 26,
    difference: review ? 6 : 4,
    direction: 'less',
  };
  const drawing = review ? 38 : 26;
  const calligraphy = review ? 30 : 20;
  const adult = review ? 20 : 16;
  const a = review ? 18 : 14;
  const b = review ? 9 : 8;
  const standard = review ? 40 : 30;
  const increase = review ? 18 : 24;
  const decrease = review ? 6 : 7;
  const shirts = review ? 32 : 23;
  const trousers = review ? 40 : 30;
  const base = (key: string, prompt: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
    hint: '先说清已知与求什么：求合计合起来，求差较多减较少，求另一部分从该范围总数减去已知部分。线段问号表示B全部；同一比较标准不随前一步答案改变。',
  });
  const number = (
    key: string,
    prompt: string,
    value: number,
    explanation: string,
    visual?: Visual,
  ): Question => ({
    ...base(key, prompt),
    rule: { kind: 'number', value },
    explanation,
    ...(visual ? { visual } : {}),
  });
  const choice = (
    key: string,
    prompt: string,
    choices: { id: string; label: string }[],
    value: string,
    explanation: string,
    visual?: Visual,
  ): Question => ({
    ...base(key, prompt),
    choices,
    rule: { kind: 'choice', value },
    explanation,
    ...(visual ? { visual } : {}),
  });
  return [
    number(
      'bar-more',
      `线段图以A的${more.reference}个为标准，B比A多${more.difference}个，问号求B全部。B有几个？`,
      more.reference + more.difference,
      `${more.reference}＋${more.difference}＝${more.reference + more.difference}，不是只报相差数。`,
      more,
    ),
    number(
      'bar-less',
      `另一线段图A有${less.reference}个，B比A少${less.difference}个，问号求B全部。B有几个？`,
      less.reference - less.difference,
      `${less.reference}－${less.difference}＝${less.reference - less.difference}；不能量图长短来代替已知条件。`,
      less,
    ),
    choice(
      'bar-question',
      `在A${more.reference}个、B比A多${more.difference}个的图中，B下方覆盖整段的问号求什么？`,
      [
        { id: 'B-total', label: 'B全部数量' },
        { id: 'difference', label: '相差部分的数量' },
        { id: 'length', label: '用尺量出的厘米数' },
      ],
      'B-total',
      '问号覆盖B整段，差已经给出；图是数量关系示意，不是按比例的测量题。',
      more,
    ),
    number(
      'exhibit-total',
      `原创展览只含${drawing}幅绘画与${calligraphy}幅书法，无重复。两类作品合计多少幅？`,
      drawing + calligraphy,
      `${drawing}＋${calligraphy}＝${drawing + calligraphy}，合计两类。`,
    ),
    number(
      'exhibit-difference',
      `仍是绘画${drawing}幅、书法${calligraphy}幅，两类相差多少幅？`,
      drawing - calligraphy,
      `${drawing}－${calligraphy}＝${drawing - calligraphy}；同样两个数，问题改求相差。`,
    ),
    number(
      'exhibit-part',
      `绘画共${drawing}幅，其中成人创作${adult}幅，其余全是学生创作。学生绘画有多少幅？不含书法。`,
      drawing - adult,
      `${drawing}－${adult}＝${drawing - adult}，从绘画范围求另一部分，不把书法并入。`,
    ),
    number(
      'same-context-difference',
      `同一整理任务，甲做${a}件、乙做${b}件，甲比乙多做几件？`,
      a - b,
      `${a}－${b}＝${a - b}，两数量已知求差。`,
    ),
    number(
      'same-context-less',
      `改变已知条件：甲做${a}件，乙比甲少做${a - b}件，乙做几件？`,
      b,
      `${a}－${a - b}＝${b}，已知较多数与差，求较少数。`,
    ),
    number(
      'same-context-more',
      `再改变条件：乙做${b}件，甲比乙多做${a - b}件，甲做几件？`,
      a,
      `${b}＋${a - b}＝${a}，已知较少数与差，求较多数。`,
    ),
    {
      ...base(
        'shared-reference',
        `黄卡有${standard}张，红卡比黄卡多${increase}张，绿卡比黄卡少${decrease}张。先填红卡，再填绿卡，均以黄卡为标准。`,
      ),
      rule: {
        kind: 'steps',
        values: [standard + increase, standard - decrease],
      },
      explanation: `红卡${standard}＋${increase}＝${standard + increase}，绿卡${standard}－${decrease}＝${standard - decrease}；较大差可先拆成几个十和几个一。`,
    },
    choice(
      'reference-not-result',
      `上述黄${standard}、红多${increase}、绿少${decrease}的题，已经算出红卡后，算绿卡仍应从哪一个数量减${decrease}？`,
      [
        { id: 'yellow', label: `黄卡${standard}张` },
        { id: 'red', label: `改用红卡${standard + increase}张` },
      ],
      'yellow',
      '红与绿各自和黄比较，不把刚算出的红当成绿的比较标准。',
    ),
    number(
      'matching',
      `有上衣${shirts}件、裤子${trousers}条。一件上衣配一条裤子，裤子不变，只补上衣，要补几件才能全部配套？`,
      trousers - shirts,
      `${trousers}－${shirts}＝${trousers - shirts}，每套一一对应，不是把件数和条数求合计当缺量。`,
    ),
  ];
}
export const sujiaoQuantityApplicationsDraft: Lesson = {
  id,
  title: '数量关系应用：读线段图与改变求问',
  textbookTitle: '简单的数量关系·综合应用',
  page: 76,
  version: 2,
  status: 'preparing',
  goal: '读懂示意图的已知与问号范围，同情境区分合计、差与部分，共同基准分别求数量并检查配套。',
  prerequisite: '会按比较标准求较多/较少数量，能分十与一计算；准备纸笔。',
  parentTip: `依据ISBN ${source.isbn}实际读印刷76～77页线段图、三种求问、配套、展览范围与共同基准。数字情境自制，图不按数值比例画，未知B不显示结果数；不教厘米测量，较大相差数用已学整十和一位分步，不作为整章两位数笔算。`,
  steps: [
    {
      title: '线段表示数量，问号指整段',
      text: 'A有32个，B比A多7个；A为已知标准，B下方问号覆盖全部B。图上的差7已经知道，求B应32＋7，不是再报7。线段只示意关系，不按数值比例画，不能量长度猜数量。',
      visual: {
        kind: 'comparison-bars',
        reference: 32,
        difference: 7,
        direction: 'more',
      },
      activity: '实际画两段示意，注明标准32、差7和B全段问号。',
    },
    {
      title: '较少的图与虚线差段',
      text: 'A有26个，B比A少4个，B整段是未知。B的短段加上相差部分对应A整段，用26－4。虚线相差段表示少出的部分，不是B额外拥有4个，也不是另一种物品。',
      visual: {
        kind: 'comparison-bars',
        reference: 26,
        difference: 4,
        direction: 'less',
      },
      activity: '纸面标出B与差段，解释为什么是求较少数。',
    },
    {
      title: '同一情境，可以问不同关系',
      text: '展览绘画26幅、书法20幅，求合计是26＋20，求差是26－20。绘画中成人16幅、其余学生，学生绘画是26－16，只看绘画范围。不因出现两个数就固定选同一种运算。',
      activity: '纸面分别写合计、差和部分三个问题，圈出各自数量范围。',
    },
    {
      title: '以同一基准分别计算',
      text: '黄30张，红比黄多24张，绿比黄少7张。红用30＋24，可先30＋20再加4；绿用30－7，不把红54张作为新的基准。甲乙任务也可改给数量或改问差，逐题重新分析。',
      activity: '实际写出红、绿各自指向黄的比较说明，不串用前一步结果。',
    },
    {
      title: '配套和自己提出问题',
      text: '23件上衣与30条裤子，一套各1，保持裤子不动，补上衣7件。原有信息可提出多个问题，但求价格要补单价、求创作者人数要补每人作品情况，不能凭作品幅数猜人数。真实画图、问题与过程独立保存。另选本课已有条件提出不同的问题，逐个说求谁、用哪几个条件并解答；缺条件先补问，不编答案。最后分别反思求差关系、加减解决实际问题、摆画帮助理解的表现，记录具体证据或待做，不自动评星。',
      activity: '实际用小纸卡一一配套，并根据已有信息提出一个能解答的问题。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际画32与多7、26与少4两张原创线段关系图，问号各盖B整段，标条件并说明不按比例量答案。',
      '实际用绘画26、书法20、成人绘画16的纸面记录分别编合计、差与学生绘画问题，核对数量范围。',
      '实际用黄30、红多24、绿少7分别列式，再用小卡模拟上衣23与裤子30的一一配套，口述各自基准。',
      '实际根据绘画26、书法20、成人绘画16等本课已给条件，口述或在纸上提出至少两个不同的问题，分别标清所求范围、所用条件并解答；给家人或同伴说明。可以有不同合法问题，缺条件先补问。没实际提问解答或交流就记录待做，网页反思不代替此项。',
    ].map((prompt, i): Question => ({
      id: `${id}-manual-${i}`,
      knowledge: `${id}-manual-${i}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '实际完成纸面/摆卡/口述后独立确认，可暂跳。',
      explanation: '网页答案不自动确认真实任务。',
    })),
    {
      id: `${id}-own-question`,
      knowledge: `${id}-own-question`,
      prompt:
        '根据本课已有数量自己提出一个问题，写下求什么、用哪些条件及怎样算；缺条件也可以如实记录。',
      rule: { kind: 'reflection' },
      hint: '允许不同问题，不强制唯一说法。',
      explanation: '开放问题null保存，不评分。',
    },
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '你怎样区分合计、相差、部分和共同基准？记录一个发现或待核对之处。',
      rule: { kind: 'reflection' },
      hint: '保留原话。',
      explanation: '反思null，与真实任务独立。',
    },
    ...(
      [
        [
          'understanding',
          '你能说明同单位两数量相差多少的关系吗？用自己本次的一例说明较多、较少与差；还没理解如实写待学习。',
        ],
        [
          'application',
          '你能按数量关系用加减解决实际问题吗？记录自己解过的一问、所用条件和检查过程；只有计划就说明尚未做。',
        ],
        [
          'representation',
          '摆一摆或画一画怎样帮助你理解数量关系？记录自己真实用过的摆法或图及发现；没做如实写待做。',
        ],
      ] as const
    ).map(([key, prompt]): Question => ({
      id: `${id}-evaluation-${key}`,
      knowledge: `${id}-evaluation-${key}`,
      prompt,
      rule: { kind: 'reflection' },
      hint: '按自己实际经历分别反思，不要求全部达到或给固定星数。',
      explanation:
        '开放表达保留原话、correct为null，不由答题成绩推定能力或确认实际活动。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '已读线段图与综合数量关系核验',
    notes: `ISBN ${source.isbn}印刷76～77页范围，原创数值/图示，版次印次未知，不宣称整单元完成。`,
  },
};
