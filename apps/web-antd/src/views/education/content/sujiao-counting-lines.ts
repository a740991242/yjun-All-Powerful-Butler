import type { Lesson, Question } from '../learning/types';

import { sujiaoLowerSource as source } from './sujiao-lower-source';

const id = 'sj-lower-counting-lines';
function tasks(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  const q = (key: string) => ({
    id: `${prefix}-${key}`,
    knowledge: `${id}-${key}`,
  });
  const patterns = [
    { key: 'forward-one', start: review ? 37 : 27, step: 1 },
    { key: 'backward-one', start: review ? 52 : 42, step: -1 },
    { key: 'forward-two', start: review ? 66 : 56, step: 2 },
    { key: 'forward-five', start: review ? 55 : 45, step: 5 },
    { key: 'forward-ten', start: review ? 40 : 30, step: 10 },
    { key: 'backward-two', start: review ? 84 : 74, step: -2 },
  ];
  const near = review ? 83 : 67;
  const minimum = review ? 80 : 60;
  const maximum = review ? 89 : 69;
  const between = review ? 70 : 80;
  return [
    ...patterns.map((p): Question => ({
      ...q(p.key),
      prompt: `从${p.start}开始，${p.step > 0 ? '每次多' : '倒数，每次少'}${Math.abs(p.step)}，接着填写后面四个数（不要重复起点）。`,
      rule: {
        kind: 'steps',
        values: Array.from({ length: 4 }, (_, i) => p.start + p.step * (i + 1)),
      },
      hint: '读清起点、方向和每次变化，跨整十也继续保持同样步长。',
      explanation: `起点${p.start}之后依次是${Array.from({ length: 4 }, (_, i) => p.start + p.step * (i + 1)).join('、')}。填的是后续数，不是数了几次。`,
    })),
    ...[review ? 49 : 39, review ? 60 : 50, review ? 80 : 90].map(
      (value, index): Question => ({
        ...q(`neighbors-${index}`),
        prompt: `依次填${value}前面紧挨着的数、后面紧挨着的数（每次相差1）。`,
        rule: { kind: 'steps', values: [value - 1, value + 1] },
        hint: '前一个少1，后一个多1；整十数的前一个仍可能在上一段十里。',
        explanation: `依次是${value - 1}、${value + 1}，不把十位相同当作相邻条件。`,
      }),
    ),
    {
      ...q('more-one-ten'),
      prompt: `比${review ? 69 : 49}大1的数、大10的数，依次填出来。`,
      rule: { kind: 'steps', values: review ? [70, 79] : [50, 59] },
      hint: '每次多1与每次多10是不同变化，先看增加的单位。',
      explanation: `分别是${review ? '70、79' : '50、59'}；多1可能跨整十，多10保持个位不变。`,
    },
    {
      ...q('less-one-ten'),
      prompt: `比${review ? 90 : 80}小1的数、小10的数，依次填出来。`,
      rule: { kind: 'steps', values: review ? [89, 80] : [79, 70] },
      hint: '倒数1个与倒数10个不同，整十少1要回到上一段十的末尾。',
      explanation: `分别是${review ? '89、80' : '79、70'}，个位0时不能直接写成负数个位。`,
    },
    {
      ...q('inclusive-count'),
      prompt: `从${review ? 39 : 29}开始一个一个数到${review ? 43 : 33}，起点和终点都说出来，一共说了几个数？`,
      rule: { kind: 'number', value: 5 },
      hint: '逐个列出来再数，说了几个数与最后说出的数不同；起点也算一次。',
      explanation: '含起点和终点共5个数，间隔是4个；个数与间隔不能混同。',
    },
    {
      ...q('move-count'),
      prompt: `从${review ? 72 : 62}出发，每次多1，到${review ? 76 : 64}，需要变化几次？起点不算一次变化。`,
      rule: { kind: 'number', value: review ? 4 : 2 },
      hint: '每向后到紧挨着的数一次才算一次变化，不把起点也当作走过一步。',
      explanation: `需要${review ? 4 : 2}次变化，经过的间隔与包括起点说出的数字个数不同。`,
    },
    {
      ...q('line-unit'),
      prompt: `这段数轴每两个紧挨着的整数位置，相差多少？观察${review ? '40～50' : '30～40'}这段。`,
      visual: {
        kind: 'number-line',
        minimum: review ? 40 : 30,
        maximum: review ? 50 : 40,
        value: review ? 45 : 35,
      },
      choices: [
        { id: 'one', label: '1' },
        { id: 'ten', label: '10' },
        { id: 'two', label: '2' },
      ],
      rule: { kind: 'choice', value: 'one' },
      hint: '看两个相邻位置，不能用这段首尾总相差代替每个小间隔。',
      explanation: '这里逐个整数排列，相邻差1，整段首尾差10但不是每格差10。',
    },
    {
      ...q('near'),
      prompt: `${near}更接近${minimum}还是${maximum}？沿这段数轴数间隔比较。`,
      visual: { kind: 'number-line', minimum, maximum, value: near },
      choices: [
        { id: 'left', label: String(minimum) },
        { id: 'right', label: String(maximum) },
      ],
      rule: { kind: 'choice', value: review ? 'left' : 'right' },
      hint: '分别数到两端所需的间隔，较少的那边更近，不看数字字形。',
      explanation: `到${minimum}有${near - minimum}个间隔，到${maximum}有${maximum - near}个间隔，所以更接近${review ? minimum : maximum}。`,
    },
    {
      ...q('strict-between'),
      prompt: `选出所有比${between}大、比${between + 10}小的数字卡，不包含两端。`,
      choices: [
        between,
        between + 1,
        between + 5,
        between + 9,
        between + 10,
      ].map((value) => ({ id: String(value), label: String(value) })),
      rule: {
        kind: 'set',
        values: [between + 1, between + 5, between + 9].map(String),
      },
      hint: '只在当前卡片中选，符合两个严格条件的都要选；端点不能选。',
      explanation: `本组应选${between + 1}、${between + 5}、${between + 9}；不是要求列出区间内所有整数。`,
    },
  ];
}

export const sujiaoCountingLinesDraft: Lesson = {
  id,
  title: '按步长数数与数轴：跨十、倒数和相邻数',
  textbookTitle: '认识20～99·数数与数轴',
  page: 45,
  version: 1,
  status: 'preparing',
  goal: '按1、2、5、10数，跨整十和倒数，区分数字个数与间隔，并观察数轴相邻位置与接近程度。',
  prerequisite:
    '已认识20～99组成与整十数，准备数字卡、纸笔、小棒或实际计数器。',
  parentTip:
    '依据已读44～45、47、50、52页有关数数/数轴范围制作原创任务。网页版数轴用等距整数位置表示，不冒充教材原图；完整数轴不作为缺格答案图。只读题图即使查看提示也不开放移动。真实拨珠与纸面操作独立确认，数字个数与变化次数分开。0～99数表、圆形数阵、估数和比较应用已有独立专题课；本课不代替整单元覆盖审核。',
  steps: [
    {
      title: '一个一个数，跨整十也继续',
      text: '从27出发，每次多1，后面是28、29、30、31。29后不是写成二十九一，而是30；从42倒数，后面41、40、39、38。先看起点和方向，再数后续数字。',
      visual: { kind: 'number-line', minimum: 27, maximum: 42, value: 29 },
      activity:
        '网页选择29，再到30观察相邻位置；实际用数字卡从27往后数、从42倒数。',
    },
    {
      title: '按2或5数，步长保持不变',
      text: '从56每次多2，接着58、60、62、64；从45每次多5，接着50、55、60、65。不是每次都多1，也不是只在同一段十里数。可以先逐根核对，再按等量分组数。',
      activity:
        '实际摆物或拨珠，每次添2或5，数清每次总数；跨整十后继续同一步长。',
    },
    {
      title: '按十数，倒数看清方向',
      text: '从30每次多10，接着40、50、60、70。从74每次少2，是72、70、68、66。按十数表示总数量，每次增加一个十；倒数则减少，不能因为看见“2”就一直加2。',
      activity:
        '用实际整捆数30、40等数，再用数字卡演示74开始每次少2；口述方向和步长。',
    },
    {
      title: '数轴位置、间隔与相邻数',
      text: '这段数轴每个位置表示一个整数，相邻差1。39前是38、后是40。62到64变化两次，但包括起点共说62、63、64三个数。数字个数、间隔数与最后的数字要分别说。',
      visual: { kind: 'number-line', minimum: 60, maximum: 69, value: 62 },
      activity:
        '在纸上画60～69的等距位置，指出62到64的两个间隔，再数包括起点的三个数字。',
    },
    {
      title: '接近两端与区间条件',
      text: '67距60有7个间隔，距69有2个间隔，更接近69。判断在两数之间先读清是否包含端点。比较一段数轴按同样单位数间隔，不用数字形状或网页上文字宽度判断。',
      visual: { kind: 'number-line', minimum: 60, maximum: 69, value: 67 },
      activity:
        '实际在纸上标67并分别指着数到两端；自己换一个数，说明怎样比较。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际用数字卡、小棒或计数器完成跨整十的正数与倒数，分别说清起点、方向、步长，请家长核对。',
      '实际按每次2、5和10个分组或拨珠数，边操作边说总数；换步长时重新明确规则，不能把组数当总数。',
      '在纸上画一段等距整数数轴，指出相邻数，分别数两个给定位置之间的间隔与包括端点的数字个数，再口述接近哪一端。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '实际操作与纸面解释完成后才确认；网页选择位置不自动代替。',
      explanation: '真实摆拨、画轴与表达人工确认，无条件可待做。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '哪次跨十或倒数容易弄错？你怎样区分“说了几个数”和“变化几次”？按真实想法记录下一步核对办法。',
      rule: { kind: 'reflection' },
      hint: '可以记录还不确定的地方，不需要唯一答案。',
      explanation: '开放记录保留原话、correct=null，不确认实物活动或评分。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '数数与数轴范围及原创活动核验',
    notes: `依据ISBN ${source.isbn}已读44～45、47、50、52页相关范围，原创数值、图示和练习。复习改变起点、邻数、间隔、数轴与接近方向。版次印次未知，不代表完整单元或练习六已完成。`,
  },
};
