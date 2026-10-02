import type { Lesson, Question } from '../learning/types';

import { sujiaoLowerSource as source } from './sujiao-lower-source';

const id = 'sj-lower-calculation-review';

function tasks(review: boolean): Question[] {
  const add = review ? [48, 6] : [27, 6];
  const tens = review ? [34, 40] : [27, 30];
  const subtract = review ? [61, 8] : [43, 8];
  const start = review ? 73 : 62;
  const amount = review ? 26 : 17;
  const wholeTens = review ? 20 : 10;
  const ones = review ? 6 : 7;
  const middle = start - wholeTens;
  const result = start - amount;
  const base = (key: string, prompt: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
  });
  const choice = (
    key: string,
    prompt: string,
    options: string[],
    value: string,
    explanation: string,
  ): Question => ({
    ...base(key, prompt),
    choices: options.map((label, index) => ({ id: String(index), label })),
    rule: { kind: 'choice', value },
    hint: '先看加减的是几个十或几个一，比较题按数量变化说明，探索题别停在中间。',
    explanation,
  });
  return [
    choice(
      'estimate-add',
      `${add[0]}＋${add[1]}先不报完整得数：个位合起来满十，得数是几十多？`,
      ['二十多', '三十多', '四十多', '五十多'],
      review ? '3' : '1',
      review
        ? '8加6满十，4个十再添1个十，先判断五十多。'
        : '7加6满十，2个十再添1个十，先判断三十多。',
    ),
    choice(
      'estimate-tens',
      `${tens[0]}＋${tens[1]}先判断得数是几十多，再在纸上算完整结果核对。`,
      ['四十多', '五十多', '六十多', '七十多'],
      review ? '3' : '1',
      review
        ? '3个十添4个十是7个十，个位4保留，先判断七十多。'
        : '2个十添3个十是5个十，个位7保留，先判断五十多。',
    ),
    choice(
      'estimate-subtract',
      `${subtract[0]}－${subtract[1]}先判断得数是几十多：个位不够减，拆十后剩几个十？`,
      ['二十多', '三十多', '四十多', '五十多'],
      review ? '3' : '1',
      review
        ? '个位1不够减8，6个十拆1个十，保留5个十，得数五十多。'
        : '个位3不够减8，4个十拆1个十，保留3个十，得数三十多。',
    ),
    choice(
      'compare-add',
      review
        ? '不逐个求得数：46＋30与46＋3，前者怎样？'
        : '不逐个求得数：52＋40与52＋4，前者怎样？',
      [
        '较大，因为同一起点加的量更多',
        '较小，因为加数写了两位',
        '相等，只要起点一样',
      ],
      '0',
      '同一起点分别增加不同正数量，加得更多的结果更大；不需要先报两个完整得数。',
    ),
    choice(
      'compare-subtract',
      review
        ? '不逐个求得数：76－20与76－2，前者怎样？'
        : '不逐个求得数：87－30与87－3，前者怎样？',
      [
        '较大，因为减数更大',
        '较小，因为同一起点去掉的量更多',
        '相等，因为起点一样',
      ],
      '1',
      '同一起点，去掉更多，剩下更少；加法与减法比较的方向不同。',
    ),
    choice(
      'compare-exchange',
      review
        ? '不逐个求得数：3＋45和45＋3有什么关系？'
        : '不逐个求得数：2＋26和26＋2有什么关系？',
      ['第一道更大', '第二道更大', '相等，两部分交换顺序合计不变'],
      '2',
      '加法交换两个部分不改变合计，不能因此交换减法的原有和取走。',
    ),
    {
      ...base(
        'split-subtrahend',
        `探索${start}－${amount}：先把${amount}分成${wholeTens}和几？只填剩余的一位数。`,
      ),
      rule: { kind: 'number', value: ones },
      hint: '所减的整十与个位合起来必须是原减数。',
      explanation: `${wholeTens}＋${ones}＝${amount}，不能少减或多减。`,
    },
    {
      ...base(
        'exploration-steps',
        `探索${start}－${amount}：先减${wholeTens}，再减${ones}，依次填中间结果、最终结果。`,
      ),
      rule: { kind: 'steps', values: [middle, result] },
      hint: '第二步在第一步剩下的数量上继续减；个位不够要拆十。',
      explanation: `${start}－${wholeTens}＝${middle}，${middle}－${ones}＝${result}。两次合计减去${amount}。`,
    },
    choice(
      'middle-not-final',
      `算${start}－${amount}，只做到${start}－${wholeTens}＝${middle}就停止，已经完成吗？`,
      [`没有，还需减${ones}`, '完成，中间结果就是最后结果'],
      '0',
      `${middle}尚未减去剩余${ones}，不能当${start}－${amount}的答案。`,
    ),
    {
      ...base(
        'total-removed',
        `算${start}－${amount}，先减${wholeTens}再减${ones}，总共取走多少？`,
      ),
      rule: { kind: 'number', value: amount },
      hint: '合计取走的是减数，不是两步剩余数量的和。',
      explanation: `合计取走${wholeTens}＋${ones}＝${amount}。拆十不算又取走10。`,
    },
    choice(
      'check-exploration',
      `怎样核对${start}－${amount}＝${result}是否符合原数量？`,
      [
        `把剩余${result}与取走${amount}合起来，检查是否为${start}`,
        `再从${result}减${amount}`,
        `把中间${middle}直接当答案`,
      ],
      '0',
      `${result}＋${amount}＝${start}，说明剩余和取走两部分合回原有。`,
    ),
    {
      ...base(
        'complete-question',
        review
          ? '只有“红卡36张、蓝卡7张”两条信息，哪些问题能直接解答？全部选出。'
          : '只有“红卡24张、蓝卡8张”两条信息，哪些问题能直接解答？全部选出。',
      ),
      choices: [
        { id: 'total', label: '两种卡共有多少张？' },
        { id: 'difference', label: '红卡比蓝卡多多少张？' },
        { id: 'money', label: '买卡共花了多少钱？' },
      ],
      rule: { kind: 'set', values: ['total', 'difference'] },
      hint: '数量关系的条件齐全才能求解，未给单价不能猜费用。',
      explanation: '合计与差可由同单位数量求解；费用还缺价格等条件。',
    },
  ];
}

export const sujiaoCalculationReviewDraft: Lesson = {
  id,
  title: '计算整理：先判断、说理由与减两位数探索',
  textbookTitle: '两位数加减·练习与回顾',
  page: 70,
  version: 1,
  status: 'preparing',
  goal: '先判断得数几十多再核对、不计算比较并说理由，实际提问解答交流，探索分两次减并分别自评。',
  prerequisite:
    '学过两位数加减整十数与一位数（含进退位）；准备纸笔、安全小棒或计数器，可与家人交流。',
  parentTip: `依据ISBN ${source.isbn}已读印刷62、63、70页，使用原创例子。三种几十多判断与完整得数分开；不计算比较的实际口述人工确认。教材51减15探索改用62减17，先减整十再减一位；不要求本年级提前完成完整两位数竖式单元。真实提问、计算、交流和摆拨分别确认，计划不是已做，三项评价null、不自动评星。`,
  steps: [
    {
      title: '先判断几十多，再算完整得数',
      text: '27＋6的个位7＋6满十，先判断三十多，再算得33核对。27＋30先判断五十多，再算57。43－8个位不够减，要拆一个十，先判断三十多，再算35。先判断和后核对分别记录；不要算完后倒填成先判断。',
      activity:
        '纸面分“先判断”“计算核对”两栏，依次实际记录三题，尚未判断如实注明。',
    },
    {
      title: '不计算也能比较，但要说依据',
      text: '52＋40比52＋4大，因为同起点加40更多；87－30比87－3小，因为去掉30更多。2＋26与26＋2相等，因为交换两个部分合计不变。先不报完整得数，实际说理由，再另外计算验证；减法不能交换原有与取走。',
      activity:
        '先分别口述三种比较依据，由家人查看；后来计算只作核对，不能代替前面的解释。',
    },
    {
      title: '自己提出不同问题，解答并交流',
      text: '原创信息：红卡24张、蓝卡8张。可以问共有多少，也可以问相差多少；提两个不同问题，标清条件、列式、写单位并向家人说明。若问费用，先指出缺价格，不能编出原题金额。也可自己补一条明确的数量条件再提问，标记“我补的条件”，允许不同合理问题。',
      activity:
        '实际在纸面写两个问题和解答，与家人交流，确认是否问同单位数量；缺条件先说明。',
    },
    {
      title: '探索减两位数：两次要合计减对',
      text: '62－17可以把17拆成10和7，先62－10＝52，再52－7＝45。第二步个位2不够减7，要拆十。中间52还没减完；两次合计只取走17，拆十不额外减少10。用45＋17＝62核对，实际摆捆或拨珠并写过程；这是一种探索，不是要求掌握全部两位数竖式。',
      activity:
        '实际从6捆2根先取1捆，再拆一捆取7根，核对4捆5根；写两步和合回的检查。',
    },
    {
      title: '三个方面分别回顾',
      text: '分别记录：能否用小棒或计数器理解方法；能否计算两位数加减整十数和一位数；能否解决实际问题。可以写已会、还需帮助及具体例子，也可以写尚未做。三个方面不合成自动星级，答对网页题不证明实际摆拨或交流，未来准备做的事另写为计划。',
      activity:
        '独立留下三条真实自评，与家长核对已做和计划，保留不同的帮助需要。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际先判断27＋6、27＋30、43－8各是几十多，分别写在第一栏；随后计算完整得数写在第二栏核对。不能计算后倒填先判断，未做如实记录。',
      '实际先不求完整得数，口述52＋40与52＋4、87－30与87－3、2＋26与26＋2三组大小关系及理由；家长确认解释后再独立计算验证。',
      '实际根据红卡24张、蓝卡8张提出至少两个不同可回答问题，标条件、列式解答、保留单位，再与家人交流核对。若缺条件先注明，补的条件明确写“我补的条件”；未实际交流可暂跳。',
      '实际从6捆2根（每捆10根）演示62－17：先取1捆，剩5捆2根，再拆1捆取7根；核对4捆5根，纸面记录两步和剩余加取走的检查。',
      '实际换为73－26，先减20再减6，每步重新看剩余，纸面记录并摆拨说明个位不够减的处理，核对合计取走26。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '实际完成后由家长分别确认，网页答案与未来计划不能代替，未做可暂跳。',
      explanation: '只记录该实际任务的完成确认，不自动断言掌握或替代其它任务。',
    })),
    ...(
      [
        [
          'representation',
          '用小棒或计数器理解计算方法，你已实际做了什么、还需什么帮助？未操作可如实写尚未做。',
        ],
        [
          'calculation',
          '两位数加减整十数和一位数，你在哪类计算已会、哪类还需帮助？记录真实例子，不把探索两位数竖式当本单元要求。',
        ],
        [
          'application',
          '用加减解决实际问题，你怎样读条件、选算式和核对？记录已做例子或仍需帮助，不把未来计划当完成。',
        ],
      ] as const
    ).map(([key, prompt]): Question => ({
      id: `${id}-evaluation-${key}`,
      knowledge: `${id}-evaluation-${key}`,
      prompt,
      rule: { kind: 'reflection' },
      hint: '三个方面独立记录，没有固定表述，可写尚未做或仍需帮助。',
      explanation: '开放自评正确状态为null，不由成绩或计划自动评星。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '记下这次先判断、比较或分两次减的新发现；未来想试的事请明确写成计划。',
      rule: { kind: 'reflection' },
      hint: '保留真实想法，可写未解决的问题。',
      explanation: '反思null，计划与实际完成分别记录。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '已读整理活动与原创探索范围核验',
    notes: `ISBN ${source.isbn}印刷62、63、70页相关范围，原创题组；复习改起点、减数、判断数段，旧答案需重核。版次印次未知，最终教师审校尚待完成。`,
  },
};
