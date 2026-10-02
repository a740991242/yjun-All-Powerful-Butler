import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';

export const sujiaoSixNineSources = {
  checkedAt: '2026-10-01',
  recognize: [
    'http://app.xxsx.cn/resources-detail/38149/63',
    'http://app.xxsx.cn/resources-detail/38150/63',
    'http://app.xxsx.cn/resources-detail/38151/63',
    'http://app.xxsx.cn/resources-detail/38152/63',
  ],
  arithmetic: [
    'http://app.xxsx.cn/resources-detail/38158/63',
    'http://app.xxsx.cn/resources-detail/38159/63',
    'http://app.xxsx.cn/resources-detail/38160/63',
    'http://app.xxsx.cn/resources-detail/38161/63',
    'http://app.xxsx.cn/resources-detail/38162/63',
    'http://app.xxsx.cn/resources-detail/38163/63',
  ],
} as const;

function countingTasks(review: boolean): Question[] {
  const id = 'sj-upper-recognize-6-9';
  const prefix = review ? 'r' : 'q';
  const values = [6, 7, 8, 9];
  const pairs = review
    ? [
        [6, 8],
        [9, 7],
        [6, 6],
      ]
    : [
        [7, 3],
        [8, 6],
        [9, 9],
      ];
  return [
    ...values.map((value): Question => ({
      id: `${id}-${prefix}-count-${value}`,
      knowledge: `${id}-count-${value}`,
      prompt: review
        ? '只点数第二组圆点，第二组共有几个？'
        : '逐一点数这一组圆点，一共有几个？',
      visual: {
        kind: 'count',
        count: review ? 3 : value,
        other: review ? value : undefined,
      },
      rule: { kind: 'number', value },
      hint: '先明确数哪一组，点一个数一个；最后说出的数表示这一组的总数量。',
      explanation: `指定的这一组共有${value}个，不把另一组一起算入。`,
    })),
    ...values.map((value): Question => ({
      id: `${id}-${prefix}-digit-${value}`,
      knowledge: `${id}-digit-${value}`,
      prompt: review
        ? '只看第一组，为它选择对应的数字卡。'
        : '为这些圆点选择表示数量的数字卡。',
      visual: { kind: 'count', count: value, other: review ? 2 : undefined },
      choices: values.map((number) => ({
        id: String(number),
        label: String(number),
      })),
      rule: { kind: 'choice', value: String(value) },
      hint: '数量不因物品种类改变；先数清楚，再选择数字。',
      explanation: `${value}个物体，用数字${value}表示。`,
    })),
    ...[5, 6, 7, 8].map((value): Question => ({
      id: `${id}-${prefix}-next-${value}`,
      knowledge: `${id}-next-${value}`,
      prompt: review
        ? `盒里有${value}块积木，再放1块，现在有几块？`
        : `先摆${value}个圆点，再添1个，变成几个？`,
      rule: { kind: 'number', value: value + 1 },
      hint: '添1个就接着数到下一个数，不重复报原来的数。',
      explanation: `${value}再添1个，得到${value + 1}个。`,
    })),
    {
      id: `${id}-${prefix}-order`,
      knowledge: `${id}-number-order`,
      prompt: review
        ? '把6、7、8、9按从大到小的顺序排好。'
        : '把6、7、8、9按从小到大的顺序排好。',
      choices: values.map((value) => ({
        id: String(value),
        label: String(value),
      })),
      rule: {
        kind: 'sequence',
        values: review ? ['9', '8', '7', '6'] : ['6', '7', '8', '9'],
      },
      hint: '先确定是顺着还是倒着，每次到相邻的数。',
      explanation: review ? '从大到小是9、8、7、6。' : '从小到大是6、7、8、9。',
    },
    ...pairs.map(([left, right], index): Question => ({
      id: `${id}-${prefix}-compare-${index}`,
      knowledge: `${id}-compare-${index}`,
      prompt: `${left} ○ ${right}，圆圈里选哪个比较符号？`,
      visual: { kind: 'count', count: required(left), other: required(right) },
      choices: ['=', '>', '<'].map((label) => ({ id: label, label })),
      rule: {
        kind: 'choice',
        value: (() => {
          if (left === right) return '=';
          return required(left) > required(right) ? '>' : '<';
        })(),
      },
      hint: '数清两组，或一个对一个配好，再比较多、少或同样多。',
      explanation: `${left} ${(() => {
        if (left === right) return '=';
        return required(left) > required(right) ? '>' : '<';
      })()} ${right}，开口朝较大的数；同样多用等号。`,
    })),
    {
      id: `${id}-${prefix}-complete`,
      knowledge: `${id}-complete`,
      prompt: review
        ? '需要9块积木，已经有7块，还需要添几块？'
        : '需要8块积木，已经有5块，还需要添几块？',
      rule: { kind: 'number', value: review ? 2 : 3 },
      hint: '从已有数量逐块添到目标数量，只数新添的块数。',
      explanation: review ? '从7添到9，添2块。' : '从5添到8，添3块。',
    },
    {
      id: `${id}-${prefix}-share`,
      knowledge: `${id}-two-parts`,
      prompt: review
        ? '把7块积木分到两个盒子，每盒至少1块。填写一种分法，两盒合起来必须仍有7块。'
        : '把6块积木分到两个盒子，每盒至少1块。填写一种分法，两盒合起来必须仍有6块。',
      rule: { kind: 'partition', total: review ? 7 : 6, parts: 2, minimum: 1 },
      hint: '两部分都要非空，数量合起来等于原来总数量；不一定平均分。',
      explanation:
        '有多种分法，实际总数保持不变即可。不能凭只认一种答案排除其它正确分法。',
    },
  ];
}

export const sujiaoSixNineRecognitionDraft: Lesson = {
  id: 'sj-upper-recognize-6-9',
  textbookTitle: '认识6～9',
  title: '认识6～9：数量、顺序与补齐',
  page: 36,
  status: 'preparing',
  version: 1,
  goal: '点数6～9并对应数字，理解添1后的顺序，比较大小、补齐数量和实际分成两部分。',
  prerequisite: '认识0～5，理解数量与数字对应；准备9块积木、数字卡和纸笔。',
  parentTip:
    '纸笔书写对照教材或教师示范，普通数字卡不是笔顺示范。点数两组时先明确目标组；分给两人不等于必须平均分。',
  steps: [
    {
      title: '从5添到6，再接着数',
      text: '先摆5块，再逐块添到6、7、8、9。每件物品只数一次，最后报出的数表示总数量；换方向再数，数量不变。',
      visual: { kind: 'count', count: 6 },
      activity: '实际从5逐块添到9，分别说出添后的数量。',
    },
    {
      title: '同样数量用同一数字',
      text: '6本书、6块积木都用6表示；7、8、9也分别表示对应数量。实际找物品配数字卡，再对照教材第37～38页或教师示范在纸上写数。',
      activity: '分别摆6～9件小物品配数字卡，实际练写数字6、7、8、9。',
    },
    {
      title: '顺着数、倒着数、比较',
      text: '数线从0到9，向右是越来越大的数，向左是越来越小的数。先顺着数再倒着数；比较两组数量时可以配对，不能只看摆得疏或紧。',
      visual: { kind: 'number-line', minimum: 0, maximum: 9, value: 6 },
      activity: '摆数字卡顺读与倒读，再换两组数量，说明大于、小于或等于。',
    },
    {
      title: '补齐与分开，总量要清楚',
      text: '目标需要8块，已有5块，要逐块添到8，数清新添几块。把6块分到两个盒子，各有至少1块，能有不同分法；合起来仍是6，不会因换盒子变多。',
      activity:
        '实际补齐一次，再用6或7块积木找两种分法，说出每盒和合起来的数量。',
    },
  ],
  questions: [
    ...countingTasks(false),
    {
      id: 'sj-upper-recognize-6-9-manual-write',
      knowledge: 'sj-upper-recognize-6-9-paper',
      prompt:
        '对照教材或教师示范，在纸上练写6、7、8、9，并分别画或摆对应数量，请家长查看。',
      rule: { kind: 'manual' },
      hint: '先数物再写数，真实纸笔单独查看。',
      explanation: '书写与数量对应人工确认，不自动判断笔顺或字形质量。',
    },
    {
      id: 'sj-upper-recognize-6-9-manual-share',
      knowledge: 'sj-upper-recognize-6-9-physical',
      prompt:
        '实际用6块或7块积木分到两个盒子，找两种不同分法，每盒至少1块。合起来再数一次。',
      rule: { kind: 'manual' },
      hint: '换分法时不增加或拿走积木，合起来总数保持不变。',
      explanation: '实际分配与说明人工确认，不用一次多字段答对代替实际操作。',
    },
    {
      id: 'sj-upper-recognize-6-9-manual-life',
      knowledge: 'sj-upper-recognize-6-9-life',
      prompt:
        '在身边找到一种数量为6、7、8或9的事物，说清数的对象，再换方向点数检查。',
      rule: { kind: 'manual' },
      hint: '说明数的是件数，不把盒数或盘数混进物品个数。',
      explanation: '实际观察与表达人工确认，完成不等于全部掌握。',
    },
  ],
  reviewQuestions: countingTasks(true),
  review: {
    date: sujiaoSixNineSources.checkedAt,
    reviewer: '公开书页范围核验与原创课程草稿',
    notes: `依据上册印刷第36～39页：${sujiaoSixNineSources.recognize.join('；')}。原创数量图与问答；成组计数、队列和全部综合活动不因此称为已实现。同版上册2024年7月第1版、2025年7月第2次印刷已核验；本文件保留源草稿，正式入口经独立复核后注册。`,
  },
};

function arithmeticTasks(review: boolean): Question[] {
  const id = 'sj-upper-six-nine-arithmetic';
  const prefix = review ? 'r' : 'q';
  const parts = review
    ? [
        [1, 5],
        [2, 5],
        [2, 6],
        [1, 8],
      ]
    : [
        [2, 4],
        [3, 4],
        [3, 5],
        [3, 6],
      ];
  const questions = parts.flatMap(([a, b], index): Question[] => {
    const left = required(a);
    const right = required(b);
    const total = left + right;
    return [
      ...[
        [left, right],
        [right, left],
      ].map(([first, second], order): Question => ({
        id: `${id}-${prefix}-add-${index}-${order}`,
        knowledge: `${id}-add-${index}-${order}`,
        prompt: `${first} + ${second} = □。两部分合起来有多少？`,
        visual: {
          kind: 'count',
          count: required(first),
          other: required(second),
        },
        rule: { kind: 'number', value: total },
        hint: '可以全部点数，也可以从一个加数接着数另一个加数那么多次。',
        explanation: `${first} + ${second} = ${total}。交换两部分的位置，没有增加或减少物品，总数量不变。`,
      })),
      ...[left, right].map((removed, order): Question => ({
        id: `${id}-${prefix}-subtract-${index}-${order}`,
        knowledge: `${id}-subtract-${index}-${order}`,
        prompt: `${total} - ${removed} = □。原来有${total}块，拿走${removed}块，剩下多少？`,
        visual: { kind: 'count', count: total },
        rule: { kind: 'number', value: total - removed },
        hint: '图里仍显示原来数量，请用实际积木拿走对应数量，或倒着数；别把拿走的也数进剩余。',
        explanation: `${total} - ${removed} = ${total - removed}。从总数量去掉一部分，剩下另一部分。`,
      })),
    ];
  });
  const start = review ? 5 : 4;
  return [
    ...questions,
    {
      id: `${id}-${prefix}-forward`,
      knowledge: `${id}-count-forward`,
      prompt: `从${start}开始接着数2次，按顺序填写每次到达的数，起点不用填。`,
      visual: { kind: 'number-line', minimum: 0, maximum: 9, value: start },
      rule: { kind: 'steps', values: [start + 1, start + 2] },
      hint: '每添1块到下一个数；起点不是第1次移动。',
      explanation: `依次到${start + 1}、${start + 2}，所以${start} + 2 = ${start + 2}。`,
    },
    {
      id: `${id}-${prefix}-backward`,
      knowledge: `${id}-count-backward`,
      prompt: `从${review ? 9 : 8}开始倒着数2次，按顺序填写每次到达的数，起点不用填。`,
      visual: {
        kind: 'number-line',
        minimum: 0,
        maximum: 9,
        value: review ? 9 : 8,
      },
      rule: { kind: 'steps', values: review ? [8, 7] : [7, 6] },
      hint: '每拿走1块，就往前一个较小的数；不要把起点再数一次。',
      explanation: review
        ? '从9倒着数2次，到8、7，9 - 2 = 7。'
        : '从8倒着数2次，到7、6，8 - 2 = 6。',
    },
    {
      id: `${id}-${prefix}-story-add`,
      knowledge: `${id}-story-add`,
      prompt: review
        ? '盒里有5支笔，再放入3支，现在共有几支？'
        : '桌上有4本书，又放上3本，现在共有几本？',
      rule: { kind: 'number', value: review ? 8 : 7 },
      hint: '先说明原有与新增，再求总数量。',
      explanation: review ? '5 + 3 = 8。' : '4 + 3 = 7。',
    },
    {
      id: `${id}-${prefix}-story-subtract`,
      knowledge: `${id}-story-subtract`,
      prompt: review
        ? '有9张卡片，拿出4张，还剩几张？'
        : '有7块积木，拿走2块，还剩几块？',
      rule: { kind: 'number', value: 5 },
      hint: '先说明原来和拿走的数量，再求剩下的数量。',
      explanation: review ? '9 - 4 = 5。' : '7 - 2 = 5。',
    },
  ];
}

export const sujiaoSixNineArithmeticDraft: Lesson = {
  id: 'sj-upper-six-nine-arithmetic',
  textbookTitle: '加法和减法',
  title: '6～9加减法：两部分与总数',
  page: 40,
  status: 'preparing',
  version: 1,
  goal: '通过同一总数与两部分理解两个加法、两个减法，使用接着数、倒着数，说明实际故事的数量关系。',
  prerequisite: '认识0～9和5以内加减法；准备9块两种颜色的积木、纸笔。',
  parentTip:
    '交换加数不改变和，但交换减法中的两个数不是同一回事。减法图显示原有数量，拿走操作须实际完成；不要仅背算式替代解释。',
  steps: [
    {
      title: '两部分合成一个总数',
      text: '一组2块，另一组4块，合起来有6块。先全部点数，再从4接着数2次到6，两种方法表示同一总数量。',
      visual: { kind: 'count', count: 2, other: 4 },
      activity: '用两种颜色摆总数6，再换7、8或9的总数摆出两部分。',
    },
    {
      title: '交换两部分，和不变',
      text: '2 + 4与4 + 2只是交换了两组的说法和位置，没有添上或拿走物品，所以得到同一个和。可以选从较大的数接着数较小数那么多次。',
      activity: '实际交换两组积木，写两道加法并解释为什么总数不变。',
    },
    {
      title: '从总数去掉一部分',
      text: '共有6块，去掉2块，剩4块；去掉4块，剩2块。两道减法都从总数开始，不能随便交换被减数与减数。',
      activity: '每次先重摆原总数，分别拿走两种颜色的一部分，检查剩余。',
    },
    {
      title: '接着数、倒着数与故事',
      text: '数线上加法向右，减法向左，每步到相邻数。起点不算第1步。先讲清原来、添上或拿走、问题求什么，再写算式；故事可以用身边物品原创表达。',
      visual: { kind: 'number-line', minimum: 0, maximum: 9, value: 6 },
      activity: '自己讲一个6～9范围的加法或减法故事，摆物解释并在纸上写算式。',
    },
  ],
  questions: [
    ...arithmeticTasks(false),
    {
      id: 'sj-upper-six-nine-arithmetic-manual-four',
      knowledge: 'sj-upper-six-nine-arithmetic-physical',
      prompt:
        '选一个6～9的总数，实际分成两个非空部分，用同一组物品说明两道加法和两道减法。',
      rule: { kind: 'manual' },
      hint: '每道减法都先重摆总数，再拿走一部分，指明剩下另一部分。',
      explanation: '实际操作与解释人工确认，不根据四个得数自动认定完成操作。',
    },
    {
      id: 'sj-upper-six-nine-arithmetic-manual-story',
      knowledge: 'sj-upper-six-nine-arithmetic-paper',
      prompt:
        '自己讲一个总数不超过9的加法或减法故事，实际摆物并在纸上写算式，请家长听你解释每个数的意思。',
      rule: { kind: 'manual' },
      hint: '明确原有、变化和要问的数量。',
      explanation: '故事、纸笔和说明人工确认，完成不等于掌握。',
    },
    {
      id: 'sj-upper-six-nine-arithmetic-manual-method',
      knowledge: 'sj-upper-six-nine-arithmetic-method',
      prompt:
        '选一道题，用全部点数和接着数或倒着数两种方法实际算一遍，说明结果是否一样。',
      rule: { kind: 'manual' },
      hint: '起点不重复计数，两种方法都对应同一组物品。',
      explanation: '方法比较由人工确认，不能用选择题替代实际过程。',
    },
  ],
  reviewQuestions: arithmeticTasks(true),
  review: {
    date: sujiaoSixNineSources.checkedAt,
    reviewer: '公开书页范围核验与原创课程草稿',
    notes: `依据上册印刷第40～45页：${sujiaoSixNineSources.arithmetic.join('；')}。原创算式族、物品与数线问答；复习更换两部分、起点和故事。这不是这些页的全部练习，同版上册2024年7月第1版、2025年7月第2次印刷已核验；本文件保留源草稿，正式入口经独立复核后注册。`,
  },
};

export const sujiaoSixNineDrafts = [
  sujiaoSixNineRecognitionDraft,
  sujiaoSixNineArithmeticDraft,
];
