import type { Lesson, Question } from '../learning/types';

export const sujiaoTenSources = {
  checkedAt: '2026-10-01',
  links: [
    'http://app.xxsx.cn/resources-detail/38185/63',
    'http://app.xxsx.cn/resources-detail/38186/63',
  ],
  format:
    '公开列表提供的mainPic预览，印刷第63～64页；不是本轮成功加载的正文content图片',
} as const;

function tasks(review: boolean): Question[] {
  const id = `sj-upper-recognize-ten-${review ? 'r' : 'q'}`;
  const numbers = review ? [10, 9, 8] : [8, 9, 10];
  return [
    {
      id: `${id}-quantity`,
      knowledge: 'sj-ten-count',
      prompt: review
        ? '两组圆点合起来一共有几个？'
        : '逐个点数这一组圆点，一共有几个？',
      visual: review
        ? { kind: 'count', count: 6, other: 4 }
        : { kind: 'count', count: 10 },
      rule: { kind: 'number', value: 10 },
      hint: '一个圆点数一次，两组也要把所有圆点数完。',
      explanation: '一共有10个。两组不是2个圆点，组数与物品个数不同。',
    },
    {
      id: `${id}-after-nine`,
      knowledge: 'sj-ten-after-nine',
      prompt: review
        ? '从8开始接着数：8、9、□。填几？'
        : '9块积木再添1块，现在有几块？',
      rule: { kind: 'number', value: 10 },
      hint: '从9再接着数一个。',
      explanation: '9再添1就是10，10排在9后面。',
    },
    {
      id: `${id}-before-ten`,
      knowledge: 'sj-ten-before-ten',
      prompt: review
        ? '8、□、10，方框里应填几？'
        : '0～10按顺序排列，10紧前面的数是多少？',
      rule: { kind: 'number', value: 9 },
      hint: '按顺序读一遍0到10。',
      explanation: '9紧接在10前面。',
    },
    {
      id: `${id}-order`,
      knowledge: 'sj-ten-order',
      prompt: review
        ? '把10、9、8的数字卡按从小到大排好。'
        : '把8、9、10的数字卡按从小到大排好。',
      choices: numbers.map((n) => ({ id: String(n), label: String(n) })),
      rule: { kind: 'sequence', values: ['8', '9', '10'] },
      hint: '数字写在卡片上的位置不决定大小。',
      explanation: '从小到大是8、9、10。',
    },
    {
      id: `${id}-compare`,
      knowledge: 'sj-ten-compare',
      prompt: review
        ? '9和10相比，较大的数是多少？'
        : '10和9相比，较大的数是多少？',
      rule: { kind: 'number', value: 10 },
      hint: '9个再添1个成为10个。',
      explanation: '10比9大。',
    },
    {
      id: `${id}-bundle`,
      knowledge: 'sj-ten-unit',
      prompt: review
        ? '10根小棒扎成1捆，每捆都是10根。这1捆共有几根？'
        : '1捆里扎着10根小棒，问小棒根数，应填几？',
      rule: { kind: 'number', value: 10 },
      hint: '问题问根数，不是捆数。',
      explanation: '1捆有10根，扎起来不减少小棒数量。',
    },
    {
      id: `${id}-ten-unit`,
      knowledge: 'sj-ten-one-ten',
      prompt: review
        ? '把10个一合成整十，得到几个十？'
        : '10个一可以合成几个十？',
      rule: { kind: 'number', value: 1 },
      hint: '以10个为一组，数有几组。',
      explanation: '10个一是1个十，1表示十的个数。',
    },
    {
      id: `${id}-digits`,
      knowledge: 'sj-ten-two-digits',
      prompt: review ? '写数量十，数字10由几个数字组成？' : '10是几位数？',
      rule: { kind: 'number', value: 2 },
      hint: '看看写10用了哪两个数字。',
      explanation: '10由1和0组成，是两位数。',
    },
    {
      id: `${id}-zero`,
      knowledge: 'sj-ten-zero-ones',
      prompt: review
        ? '写10时右边的0表示什么？'
        : '10里的0说明整个数量没有物品吗？选择正确解释。',
      choices: [
        { id: 'ones', label: '有1个十，没有剩余的单个一，总数仍是10' },
        { id: 'empty', label: '总数是0，一个物品也没有' },
      ],
      rule: { kind: 'choice', value: 'ones' },
      hint: '把10根扎成一捆后，仍然有10根。',
      explanation: '0表示个位上没有单个一，不把整十数量抹掉。',
    },
    {
      id: `${id}-conservation`,
      knowledge: 'sj-ten-exchange',
      prompt: review
        ? '一捆10根小棒拆开后，总根数怎样变化？'
        : '10根散棒扎成1捆后，总根数怎样变化？',
      choices: [
        { id: 'same', label: '仍是10根，数量不变' },
        { id: 'one', label: '变成1根' },
        { id: 'more', label: '变成更多根' },
      ],
      rule: { kind: 'choice', value: 'same' },
      hint: '只改变摆放方式，没有添或拿走小棒。',
      explanation: '拆捆、扎捆改变计数单位，不改变物品总数。',
    },
  ];
}

export const sujiaoTenRecognitionDraft: Lesson = {
  id: 'sj-upper-recognize-ten',
  textbookTitle: '认识10',
  title: '认识10：10个一是1个十',
  page: 63,
  status: 'preparing',
  version: 1,
  goal: '点数10，理解9添1是10、10个一是1个十，区分根数与捆数，认识10的顺序、大小和两位写法。',
  prerequisite: '会点数0～9；准备10根小棒、松紧带、数字卡和纸笔。',
  parentTip:
    '先按根逐个数，再扎成捆。不要把1捆误说成1根，也不把10里的0解释成总数为0。原书预览用了计数器，这里采用原创小棒活动表达同一数量关系。',
  steps: [
    {
      title: '9再添1，认识10',
      text: '先摆9根小棒，再添1根，逐根数一遍得到10。10在9后面，比9大。',
      visual: { kind: 'count', count: 9, other: 1 },
      activity: '实际摆9根再添1根，对照0～10数字卡读数。',
    },
    {
      title: '10个一合成1个十',
      text: '10根散棒扎成1捆，每捆都是10根。10个一是1个十。图中的拆捆和扎捆改变摆法，不改变总根数；先拆开看清10根，再扎回来。',
      visual: { kind: 'place-value', value: 10 },
      activity: '实际逐根数10根，扎成一捆，拆开再数，分别说捆数与根数。',
    },
    {
      title: '10是两位数',
      text: '10用1和0两个数字写成，读作十。左边1表示1个十，右边0表示没有剩余的单个一；合起来仍是10。对照教材或教师示范在纸上练写10，屏幕字体不替代笔顺示范。',
      activity: '在纸上写10，指出1和0的不同位置及各自含义。',
    },
    {
      title: '顺序、生活和第几',
      text: '从0接着数到10，再倒着读。生活里可以找10个为一组的物品。实际摆10张编号卡：一共有10张是数量，第10张是从指定方向数到的位置，换方向要重新确定。',
      visual: { kind: 'number-line', minimum: 0, maximum: 10, value: 10 },
      activity:
        '实际摆10张卡，从左、从右各指出第10张；观察生活中10个一组的物品。',
    },
  ],
  questions: [
    ...tasks(false),
    {
      id: 'sj-ten-manual-bundle',
      knowledge: 'sj-ten-physical-exchange',
      prompt:
        '实际数10根，扎成1捆，再拆开数；分别说根数、捆数与总数量是否改变，请家长查看。',
      rule: { kind: 'manual' },
      hint: '实际动手后再确认，不用图上操作代替实物。',
      explanation: '实际操作人工确认，不自动计入客观正确率。',
    },
    {
      id: 'sj-ten-manual-write',
      knowledge: 'sj-ten-paper',
      prompt: '对照教材或教师示范，在纸上练写10，说出两个数字的位置与含义。',
      rule: { kind: 'manual' },
      hint: '1和0共同组成10。',
      explanation: '实际书写与表达人工查看，不自动评价笔顺。',
    },
    {
      id: 'sj-ten-manual-position',
      knowledge: 'sj-ten-life-position',
      prompt:
        '实际摆10张卡，从左、从右各指出第10张，再找一种生活中10个为一组的物品，说清数量和位置的区别。',
      rule: { kind: 'manual' },
      hint: '先说明从哪个方向开始数。',
      explanation: '实物方向、生活观察与表达人工确认，完成不等于掌握。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: sujiaoTenSources.checkedAt,
    reviewer: '公开预览范围核验与原创课程草稿',
    notes: `依据${sujiaoTenSources.format}：${sujiaoTenSources.links.join('；')}。小棒、圆点和卡片为原创替代活动，不复制计数器图片、描红或插画。不声明已核验准确封面版权版次或整个10单元；未注册正式课程。`,
  },
};
