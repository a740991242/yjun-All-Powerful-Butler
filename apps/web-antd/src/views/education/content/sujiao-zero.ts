import type { Lesson, Question } from '../learning/types';

export const sujiaoZeroSources = {
  checkedAt: '2026-10-01',
  recognition: [
    'http://app.xxsx.cn/resources-detail/38111/63',
    'http://app.xxsx.cn/resources-detail/38112/63',
  ],
  arithmetic: [
    'http://app.xxsx.cn/resources-detail/38142/63',
    'http://app.xxsx.cn/resources-detail/38143/63',
  ],
} as const;

function zeroRecognitionTasks(review: boolean): Question[] {
  const id = 'sj-upper-recognize-zero';
  const prefix = review ? 'r' : 'q';
  const target = review ? 4 : 5;
  const first = review ? 3 : 2;
  return [
    {
      id: `${id}-${prefix}-empty`,
      knowledge: `${id}-empty-quantity`,
      prompt: review
        ? '第二组没有圆点，用哪个数表示第二组的数量？'
        : '这一组一个圆点也没有，用哪个数表示数量？',
      visual: {
        kind: 'count',
        count: review ? 3 : 0,
        other: review ? 0 : undefined,
      },
      rule: { kind: 'number', value: 0 },
      hint: '一个也没有，也有确定的数量，可以用一个数字表示。',
      explanation: '一个也没有，用0表示。这里不是没有观察或不知道有多少。',
    },
    {
      id: `${id}-${prefix}-choose-empty`,
      knowledge: `${id}-zero-versus-one`,
      prompt: review
        ? '第一组有2个圆点，第二组没有。哪一组的数量是0？'
        : '第一组没有圆点，第二组有1个。哪一组的数量是0？',
      visual: { kind: 'count', count: review ? 2 : 0, other: review ? 0 : 1 },
      choices: [
        { id: 'first', label: '第一组' },
        { id: 'second', label: '第二组' },
      ],
      rule: { kind: 'choice', value: review ? 'second' : 'first' },
      hint: '找到一个也没有的那组。有1个不能说成0。',
      explanation: review
        ? '第二组没有圆点，数量是0。'
        : '第一组没有圆点，数量是0；第二组的数量是1。',
    },
    {
      id: `${id}-${prefix}-gone`,
      knowledge: `${id}-all-gone`,
      prompt: review
        ? '盒里原来有2张卡片，现在全部拿走，盒里还有几张？'
        : '篮子里原来有3块积木，现在全部拿走，篮子里还有几块？',
      rule: { kind: 'number', value: 0 },
      hint: '“全部拿走”以后还有没有留下的？可以实际摆物确认。',
      explanation: '全部拿走后，一个也没有，剩余数量是0。',
    },
    {
      id: `${id}-${prefix}-order`,
      knowledge: `${id}-zero-first`,
      prompt: review
        ? '从0开始接着数到5，把数字卡按顺序排好。'
        : '按从小到大的顺序排列0～5的数字卡。',
      choices: [0, 1, 2, 3, 4, 5].map((value) => ({
        id: String(value),
        label: String(value),
      })),
      rule: { kind: 'sequence', values: ['0', '1', '2', '3', '4', '5'] },
      hint: '先找表示一个也没有的数，每次添1个，就到下一个数。',
      explanation: '从0开始，依次是0、1、2、3、4、5。',
    },
    {
      id: `${id}-${prefix}-before-one`,
      knowledge: `${id}-before-one`,
      prompt: review
        ? '数线按0、1、2……的顺序标数，1前面的数是多少？'
        : '□、1、2、3、4、5，方框里填几？',
      rule: { kind: 'number', value: 0 },
      hint: '想一想从0开始的排列顺序。',
      explanation: '从0开始排列，0在1的前面。',
    },
    {
      id: `${id}-${prefix}-complement`,
      knowledge: `${id}-five-completion`,
      prompt: review
        ? `需要${target}块积木，已有${first}块，还需要添几块？`
        : `一盒需要${target}块积木，已有${first}块，还需要添几块？`,
      rule: { kind: 'number', value: target - first },
      hint: '实际摆出已有的数量，逐块添到目标数量，数新添了几块。',
      explanation: `从${first}添到${target}，需要再添${target - first}块。`,
    },
    {
      id: `${id}-${prefix}-full`,
      knowledge: `${id}-zero-needed`,
      prompt: review
        ? '要装5张卡，盒里已经有5张，还需要再装几张？'
        : '需要4块积木，已经有4块，还需要再添几块？',
      rule: { kind: 'number', value: 0 },
      hint: '已经达到要求，需要新增的数量是多少？',
      explanation: '已经足够，不需要再添，新增的数量是0；不是把原有物品拿走。',
    },
    {
      id: `${id}-${prefix}-meaning`,
      knowledge: `${id}-known-zero`,
      prompt: review
        ? '已经看清盘里没有水果，写0表示什么？'
        : '已经看清盒里没有积木，写0表示什么？',
      choices: [
        { id: 'empty', label: '一个也没有，数量是0' },
        { id: 'unknown', label: '没有查看，不知道数量' },
      ],
      rule: { kind: 'choice', value: 'empty' },
      hint: '0是已知数量，不是把不知道的数量随便填成0。',
      explanation:
        '观察后确认一个也没有，才用0表示这个数量；没有查看与数量0不同。',
    },
  ];
}

export const sujiaoZeroRecognitionDraft: Lesson = {
  id: 'sj-upper-recognize-zero',
  textbookTitle: '认识0',
  title: '认识0：一个也没有与从0开始',
  page: 18,
  version: 1,
  status: 'preparing',
  goal: '理解0表示一个也没有，认识0～5的顺序，观察需要添0个的情形，实际练写0。',
  prerequisite:
    '能点数1～5；准备5块积木、一个盒子和纸笔。此课认识数量，不提前要求掌握含0加减法。',
  parentTip:
    '区分已确认数量0与没有查看；生活中的0有不同用途，要说明正在观察的具体情境，不把所有位置的0都解释为空。',
  steps: [
    {
      title: '数过后，一个也没有',
      text: '盒里放2块积木，拿走1块，还剩1；再把最后1块拿走，盒里没有积木，用0表示数量。0也是一个数，不是没有写答案。',
      activity: '实际拿完盒里的积木，确认一个也没有后，拿出数字卡0。',
    },
    {
      title: '0和1不一样',
      text: '空盒数量是0；放入1块后，数量是1。比较两个盒子时，先观察指定的盒子，再表示数量，不能把另一盒的数量写进来。',
      visual: { kind: 'count', count: 0, other: 1 },
      activity: '家长准备一个空盒和一个有物品的盒，让孩子分别说数量。',
    },
    {
      title: '从0开始的顺序',
      text: '0、1、2、3、4、5依次排列，每次添1个就到下一个数。0在1的前面。尺上也能见到0，请家长帮助找到刻度起点，先观察，不在这里把“会认0”当作已经学会测量。',
      visual: { kind: 'number-line', minimum: 0, maximum: 5, value: 0 },
      activity: '摆好0～5数字卡，对照尺或纸数线读一读。',
    },
    {
      title: '没有需要新增的，也可以是0',
      text: '目标需要4块，盒里已有4块，就不用再添，新增数量为0。对照教材第18页或教师示范练写0，再在生活中找0，说清它所在的位置和用途。',
      activity: '先做一次补齐到5，再做一次已经足够不用添；在纸上实际练写0。',
    },
  ],
  questions: [
    ...zeroRecognitionTasks(false),
    {
      id: 'sj-upper-recognize-zero-manual-write',
      knowledge: 'sj-upper-recognize-zero-paper',
      prompt:
        '实际把盒里物品全部拿走，说出数量，再对照教材或教师示范，在纸上练写0，请家长查看。',
      rule: { kind: 'manual' },
      hint: '先确认一个也没有，再写表示数量的数字。',
      explanation: '实际观察和书写由人工确认；字体显示不是笔顺示范。',
    },
    {
      id: 'sj-upper-recognize-zero-manual-life',
      knowledge: 'sj-upper-recognize-zero-life',
      prompt:
        '在尺或其他身边物品上找到0，指出它的位置，请家长一起说说在这个物品里表示什么。',
      rule: { kind: 'manual' },
      hint: '说明具体情境，不能把所有的0都说成没有物品。',
      explanation: '生活观察与解释人工确认，不自动评价测量能力或温度知识。',
    },
  ],
  reviewQuestions: zeroRecognitionTasks(true),
  review: {
    date: sujiaoZeroSources.checkedAt,
    reviewer: '公开书页范围核验与原创课程草稿',
    notes: `依据上册印刷第18～19页：${sujiaoZeroSources.recognition.join('；')}。原创物品场景、问答与数量补齐；保留纸笔、生活观察，不复制教材插画或描红。准确版本身份待确认，未注册正式课包。`,
  },
};

function zeroArithmeticTasks(review: boolean): Question[] {
  const id = 'sj-upper-zero-arithmetic';
  const prefix = review ? 'r' : 'q';
  const value = review ? 4 : 3;
  const other = review ? 2 : 5;
  const equations: [number, '+' | '-', number][] = [
    [value, '+', 0],
    [0, '+', other],
    [value, '-', 0],
    [other, '-', other],
  ];
  return [
    ...equations.map(([left, sign, right], index): Question => ({
      id: `${id}-${prefix}-calculate-${index}`,
      knowledge: `${id}-calculate-${index}`,
      prompt: `${left} ${sign} ${right} = □。先用积木操作，再填得数。`,
      rule: {
        kind: 'number',
        value: sign === '+' ? left + right : left - right,
      },
      hint: (() => {
        if (sign === '+')
          return '添0个就是没有新增；从0个开始添物品，则数新增的数量。';
        return right === 0
          ? '拿走0个，原来的物品怎样变化？'
          : '把原来的全部拿走，看看还剩什么。';
      })(),
      explanation: `${left} ${sign} ${right} = ${sign === '+' ? left + right : left - right}。${(() => {
        if (right === 0) return '没有新增或拿走物品，数量不变。';
        return sign === '+'
          ? '原来一个也没有，数量就是新添的数量。'
          : '全部拿走后一个也没有，用0表示。';
      })()}`,
    })),
    {
      id: `${id}-${prefix}-no-new`,
      knowledge: `${id}-add-story`,
      prompt: review
        ? '盘里有4个球，没有再放入，现在有几个？'
        : '篮里有3个球，没有再放入，现在有几个？',
      rule: { kind: 'number', value },
      hint: '没有新添物品，原来的数量仍然保留。',
      explanation: `${value} + 0 = ${value}，没有添不是原来没有。`,
    },
    {
      id: `${id}-${prefix}-all-removed`,
      knowledge: `${id}-subtract-story`,
      prompt: review
        ? '原来有2块积木，把2块全部拿走，还剩几块？'
        : '原来有5块积木，把5块全部拿走，还剩几块？',
      rule: { kind: 'number', value: 0 },
      hint: '拿走的数量与原来的数量一样，有没有留下？',
      explanation: `${other} - ${other} = 0，全部拿走后没有剩余。`,
    },
    {
      id: `${id}-${prefix}-no-removal`,
      knowledge: `${id}-subtract-zero-story`,
      prompt: review
        ? '盒里有2张卡，没有拿走任何一张，盒里还有几张？'
        : '盒里有5张卡，没有拿走任何一张，盒里还有几张？',
      rule: { kind: 'number', value: other },
      hint: '拿走0张，不是剩下0张。',
      explanation: `${other} - 0 = ${other}，原来数量不变。`,
    },
    {
      id: `${id}-${prefix}-distinguish`,
      knowledge: `${id}-zero-situations`,
      prompt: review ? '哪句话表示2 - 2 = 0？' : '哪句话表示5 - 5 = 0？',
      choices: [
        { id: 'all', label: '原来有这些物品，全部拿走，没有剩下' },
        { id: 'none', label: '原来有这些物品，没有拿走，全部保留' },
      ],
      rule: { kind: 'choice', value: 'all' },
      hint: '看减数：是拿走与原来一样多，还是一个也没拿？',
      explanation:
        '拿走全部和拿走0个是两种变化，不能只看到算式里有0就混为一谈。',
    },
  ];
}

export const sujiaoZeroArithmeticDraft: Lesson = {
  id: 'sj-upper-zero-arithmetic',
  textbookTitle: '练习二',
  title: '含0的加减法：没有变化与全部拿走',
  page: 29,
  version: 1,
  status: 'preparing',
  goal: '用实物区分加0、从0开始加、减0与全部拿走，不把“拿走0”误解成“剩下0”。',
  prerequisite:
    '认识0，理解5以内加法和减法；准备5块积木和纸笔。本课是平台细分练习，不冒充教材单独课目。',
  parentTip:
    '先说明原有、新增或拿走、剩余三个数量。要求实际摆物，不能只让孩子背“有0就不变”。',
  steps: [
    {
      title: '添0个，原有数量不变',
      text: '先摆2块，没有再添，新增数量是0，仍有2块，写2 + 0 = 2。说清0表示新增数量，原来不是0块。',
      activity: '实际摆2块，保持不动，解释加0。',
    },
    {
      title: '从0个开始添',
      text: '空盒里原来0块，放入4块，数量变成4，写0 + 4 = 4。0表示原有数量，4表示新添数量，也表示现在的总数。',
      activity: '用空盒实际放入几块，自己写一道从0开始的加法。',
    },
    {
      title: '拿走0个，并没有拿走',
      text: '原来3块，没有拿走任何一块，拿走数量是0，仍有3块，写3 - 0 = 3。不能因为看到减号或0，就把答案写成0。',
      activity: '保持3块不动，指明原有、拿走和剩下的数量。',
    },
    {
      title: '全部拿走，剩下0个',
      text: '原来4块，把4块全部拿走，剩下0块，写4 - 4 = 0。这里减数等于原来的数量，与4 - 0 = 4不同。',
      activity: '连续演示一次拿走0块和一次全部拿走，比较两次剩余。',
    },
  ],
  questions: [
    ...zeroArithmeticTasks(false),
    {
      id: 'sj-upper-zero-arithmetic-manual-operation',
      knowledge: 'sj-upper-zero-arithmetic-physical',
      prompt:
        '分别实际演示添0个、从0开始添、拿走0个、全部拿走四种变化，逐次说出结果。',
      rule: { kind: 'manual' },
      hint: '每次先重摆原有数量，再按变化操作，不混用上一轮的物品数量。',
      explanation: '实际操作和说理单列人工确认，不自动计入客观正确率。',
    },
    {
      id: 'sj-upper-zero-arithmetic-manual-story',
      knowledge: 'sj-upper-zero-arithmetic-paper-story',
      prompt:
        '讲一个拿走0个和一个全部拿走的故事，在纸上分别写算式并说明两者区别。',
      rule: { kind: 'manual' },
      hint: '说清0是拿走的数量还是剩余数量，请家长查看纸笔与表达。',
      explanation: '故事与实际书写人工确认，完成不等于已经掌握。',
    },
  ],
  reviewQuestions: zeroArithmeticTasks(true),
  review: {
    date: sujiaoZeroSources.checkedAt,
    reviewer: '公开书页范围核验与原创课程草稿',
    notes: `依据上册印刷第29～30页含0算式与数量变化练习：${sujiaoZeroSources.arithmetic.join('；')}。原创分步骤操作和问答；这不是第29～30页全部练习的实现。准确版本身份待确认，未注册正式课包。`,
  },
};

export const sujiaoZeroDrafts = [
  sujiaoZeroRecognitionDraft,
  sujiaoZeroArithmeticDraft,
];
