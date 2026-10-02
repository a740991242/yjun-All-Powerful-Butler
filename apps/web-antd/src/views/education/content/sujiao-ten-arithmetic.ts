import type { Lesson, Question } from '../learning/types';

export const sujiaoTenArithmeticSources = {
  checkedAt: '2026-10-01',
  links: [38_187, 38_188, 38_189, 38_190, 38_191].map(
    (id) => `http://app.xxsx.cn/resources-detail/${id}/63`,
  ),
  scope:
    '实际查看公开列表mainPic预览的印刷第65～69页，未将预览等同于本轮未加载成功的content正文或已确认版次',
};

function compositionTasks(review: boolean): Question[] {
  const id = `sj-upper-ten-composition-${review ? 'r' : 'q'}`;
  return [
    ...Array.from({ length: 11 }, (_, index): Question => {
      const left = review ? 10 - index : index;
      return {
        id: `${id}-part-${index}`,
        knowledge: `sj-ten-composition-part-${index}`,
        prompt: review
          ? `一共有10张卡，第一盒放${left}张，其余都放第二盒。第二盒有几张？`
          : `把10根小棒分成两部分，第一部分${left}根，第二部分几根？`,
        rule: { kind: 'number', value: 10 - left },
        hint: '总数不变，先摆出已有部分，再数另一部分。',
        explanation: `${left}和${10 - left}合成10。某部分是0时，这一部分没有物品；空答案不是0。`,
      };
    }),
    {
      id: `${id}-systematic`,
      knowledge: 'sj-ten-composition-systematic',
      prompt: review
        ? '分卡片时第一盒从3张变成4张，总数一直是10。第二盒怎样变化？'
        : '第一部分从2根变成3根，总数一直是10。第二部分怎样变化？',
      choices: [
        { id: 'less', label: '减少1个' },
        { id: 'more', label: '增加1个' },
        { id: 'same', label: '不变' },
      ],
      rule: { kind: 'choice', value: 'less' },
      hint: '物品从另一部分移来，没有额外增加。',
      explanation: '总数保持10，一部分多1，另一部分就少1。',
    },
    {
      id: `${id}-symmetry`,
      knowledge: 'sj-ten-composition-parts-order',
      prompt: review
        ? '两盒分别4张和6张，交换盒子的位置，总数怎样变化？'
        : '两部分分别3根和7根，交换它们的摆放位置，总数怎样变化？',
      choices: [
        { id: 'same', label: '总数仍是10' },
        { id: 'less', label: '总数减少' },
        { id: 'more', label: '总数增加' },
      ],
      rule: { kind: 'choice', value: 'same' },
      hint: '换位置没有添或拿走。',
      explanation: '两部分位置交换，总数量不变。',
    },
  ];
}

function arithmeticTasks(review: boolean): Question[] {
  const id = `sj-upper-ten-arithmetic-${review ? 'r' : 'q'}`;
  const pairs: [number, number][] = review
    ? [
        [2, 8],
        [5, 5],
      ]
    : [
        [3, 7],
        [4, 6],
      ];
  const result: Question[] = [];
  for (const [index, pair] of pairs.entries()) {
    const [left, right] = pair;
    for (const [position, [a, sign, b]] of (
      [
        [left, '+', right],
        [10, '-', left],
        [10, '-', right],
      ] as const
    ).entries()) {
      result.push({
        id: `${id}-equation-${index}-${position}`,
        knowledge: `sj-ten-family-${index}-${position}`,
        prompt: `${a} ${sign} ${b} = □。${review ? '用两部分关系检查。' : '先用小棒说明再填。'}`,
        rule: { kind: 'number', value: sign === '+' ? a + b : a - b },
        hint:
          sign === '+'
            ? '合并两部分求总数。'
            : '从总数中去掉一部分，剩另一部分。',
        explanation: `${left}和${right}合成10；10去掉${left}剩${right}，去掉${right}剩${left}。`,
      });
    }
  }
  const first = review ? 6 : 2;
  const removed = review ? 7 : 3;
  const known = review ? 8 : 4;
  result.push(
    {
      id: `${id}-story-join`,
      knowledge: 'sj-ten-story-join',
      prompt: `盒里原有${first}张卡，又放入${10 - first}张。现在共有几张？`,
      visual: { kind: 'count', count: first, other: 10 - first },
      rule: { kind: 'number', value: 10 },
      hint: '求合起来的数量，不只数新添的。',
      explanation: `${first} + ${10 - first} = 10，求的是现在总数。`,
    },
    {
      id: `${id}-story-remove`,
      knowledge: 'sj-ten-story-remove',
      prompt: `原来有10块积木，拿走${removed}块，还剩几块？`,
      rule: { kind: 'number', value: 10 - removed },
      hint: '从原有总数中去掉拿走的数量。',
      explanation: `10 - ${removed} = ${10 - removed}，求剩余。`,
    },
    {
      id: `${id}-story-other`,
      knowledge: 'sj-ten-story-other',
      prompt: `两盒共10张卡，第一盒${known}张，第二盒有几张？`,
      rule: { kind: 'number', value: 10 - known },
      hint: '知道总数和一部分，求另一部分。',
      explanation: `10 - ${known} = ${10 - known}。并没有实际拿走卡片，也能用减法求另一部分。`,
    },
    {
      id: `${id}-story-zero`,
      knowledge: 'sj-ten-story-zero-change',
      prompt: review
        ? '盒里10张卡，没有拿走任何一张，还剩几张？'
        : '盒里10张卡，没有再放入，现有几张？',
      rule: { kind: 'number', value: 10 },
      hint: '没有新增或拿走，原有数量保留。',
      explanation: review ? '10 - 0 = 10。' : '10 + 0 = 10。',
    },
    {
      id: `${id}-story-empty`,
      knowledge: 'sj-ten-story-empty',
      prompt: review
        ? '10根小棒分到第一盒，第二盒没有分到。第二盒有几根？'
        : '10根小棒全部拿走，还剩几根？',
      rule: { kind: 'number', value: 0 },
      hint: '确认指定部分没有物品才写0。',
      explanation: review ? '10分成10和0。' : '10 - 10 = 0。',
    },
    {
      id: `${id}-story-smaller`,
      knowledge: 'sj-ten-story-smaller',
      prompt: review
        ? '共有8块积木，第一盒3块，第二盒几块？'
        : '共有9张卡，第一盒6张，第二盒几张？',
      rule: { kind: 'number', value: review ? 5 : 3 },
      hint: '每题看清实际总数，不能看到本课就一律用10减。',
      explanation: review ? '8 - 3 = 5。' : '9 - 6 = 3。',
    },
    {
      id: `${id}-method`,
      knowledge: 'sj-ten-story-method',
      prompt: review
        ? '共10根小棒，第一盒8根，求第二盒根数，应选哪种方法？'
        : '共10张卡，第一盒4张，求第二盒张数，应选哪种方法？',
      choices: [
        { id: 'subtract', label: '总数减去已知的一部分' },
        { id: 'add', label: '总数再加已知的一部分' },
      ],
      rule: { kind: 'choice', value: 'subtract' },
      hint: '已知部分已经包含在总数里。',
      explanation: '求另一部分，不再把已包含的部分重复加到总数里。',
    },
    {
      id: `${id}-asked`,
      knowledge: 'sj-ten-story-question',
      prompt: review
        ? '有6块又添4块，问现在共有多少块。要求的是哪种数量？'
        : '有2张又添8张，问现在共有多少张。要求的是哪种数量？',
      choices: [
        { id: 'total', label: '合起来的总数量' },
        { id: 'new', label: '只问新增数量' },
      ],
      rule: { kind: 'choice', value: 'total' },
      hint: '先读清问题问“共有”还是“新添”。',
      explanation: '已知两部分，求总数，用加法合并。',
    },
  );
  return result;
}

const sourceReview = {
  date: sujiaoTenArithmeticSources.checkedAt,
  reviewer: '公开预览范围核验与原创课程草稿',
  notes: `依据${sujiaoTenArithmeticSources.scope}：${sujiaoTenArithmeticSources.links.join('；')}。物品故事与圆点为原创；0的端点结合已读含0知识作补充，不冒充每道教材原题。未实现第65页全部活动或第67页分组问题；未注册正式课包。`,
};

export const sujiaoTenCompositionDraft: Lesson = {
  id: 'sj-upper-ten-composition',
  textbookTitle: '10的组成',
  title: '把10分成两部分：有序找全',
  page: 65,
  version: 1,
  status: 'preparing',
  goal: '实际拆分10，有序找出两部分，解释一部分多1另一部分少1及交换两部分总数不变。',
  prerequisite: '认识10和0，能点数10个物品；准备10根小棒、两个盒子和纸笔。',
  parentTip:
    '按固定次序逐个移动，记录两部分，不让孩子只背顺口溜。0和10的端点作为原创巩固；把未填写与真正的0区分。',
  steps: [
    {
      title: '总数固定，两部分分开',
      text: '数清10根，第一盒放1根，第二盒放其余9根。两部分一起才是总数10。',
      visual: { kind: 'count', count: 1, other: 9 },
      activity: '实际分物并分别指明两个部分和总数。',
    },
    {
      title: '按顺序移动，避免遗漏',
      text: '从第二盒向第一盒移1根，变成2和8，再移1根变成3和7。第一部分多1，第二部分少1，总数一直是10。',
      activity: '逐根移动，记录从1和9到9和1；最后检查有没有跳过一种分法。',
    },
    {
      title: '交换位置和相同的两部分',
      text: '3和7与7和3总数都是10；5和5两部分一样多。能说明摆物过程，比只背答案更重要。',
      visual: { kind: 'count', count: 5, other: 5 },
      activity: '交换两盒位置，再摆一次5和5，解释总数为何不变。',
    },
    {
      title: '某部分没有也要记录',
      text: '10根都放一盒，另一盒数量是0；还可以交换成0和10。10根始终都在，不是总数变成0。',
      visual: { kind: 'count', count: 10, other: 0 },
      activity: '实际摆出10和0、0和10，对照纸上记录说清0表示哪部分。',
    },
  ],
  questions: [
    ...compositionTasks(false),
    {
      id: 'sj-ten-composition-manual-list',
      knowledge: 'sj-ten-composition-physical',
      prompt:
        '实际把10根分到两盒，逐根移动，完整记录两部分数量并检查总数一直为10。',
      rule: { kind: 'manual' },
      hint: '一次只移动1根，观察两部分的变化。',
      explanation: '实际有序操作与纸上记录人工确认。',
    },
    {
      id: 'sj-ten-composition-manual-explain',
      knowledge: 'sj-ten-composition-explain',
      prompt: '实际演示交换两盒、5和5、10和0，说清各部分与总数，请家长查看。',
      rule: { kind: 'manual' },
      hint: '不要把空盒的数量当成整个总数。',
      explanation: '实物说明人工确认，完成不等于掌握。',
    },
  ],
  reviewQuestions: compositionTasks(true),
  review: sourceReview,
};

export const sujiaoTenArithmeticDraft: Lesson = {
  id: 'sj-upper-ten-arithmetic',
  textbookTitle: '10的加减法与解决问题',
  title: '合起来、剩下来与另一部分',
  page: 66,
  version: 1,
  status: 'preparing',
  goal: '用10的两部分关系解释加减法；读清已知和问题，区分求总数、求剩余、求另一部分，并检查答案。',
  prerequisite: '理解10的组成和9以内加减法；准备10根小棒、两个盒子和纸笔。',
  parentTip:
    '先让孩子说已知什么、求什么，不用“又就加、剩就减”代替理解。两部分同为5时，两道减法数值相同，不要求编造不同答案。',
  steps: [
    {
      title: '两部分合起来',
      text: '两盒分别3张和7张，合起来10张，写3 + 7 = 10。总数不是任意一个部分。',
      visual: { kind: 'count', count: 3, other: 7 },
      activity: '实际合并并数清总数，口头说明加号。',
    },
    {
      title: '总数去掉一部分',
      text: '10张去掉3张剩7张，去掉7张剩3张。3 + 7 = 10、10 - 3 = 7、10 - 7 = 3描述同一组数量关系。',
      activity: '每次重摆10张，分别去掉3张或7张，写出结果。',
    },
    {
      title: '先读问题再选方法',
      text: '原有2张又添8张，求现在共有多少，用加法。共有10张，其中4张在第一盒，求第二盒，用减法。第二种没有实际拿走，也是在求另一部分。',
      activity: '讲两个不同问题，圈出已知数量和所求数量，再实际摆物解释。',
    },
    {
      title: '检查单位和实际总数',
      text: '求另一部分后，把两部分合起来检查是否等于总数；求剩余后，把拿走的和剩余的合起来检查。总数是9或8时必须用实际总数，不能因为学10就一律用10。',
      activity:
        '自己讲一个加法和一个减法故事，纸上写算式、单位与答句，再摆物检查。',
    },
  ],
  questions: [
    ...arithmeticTasks(false),
    {
      id: 'sj-ten-arithmetic-manual-family',
      knowledge: 'sj-ten-arithmetic-physical',
      prompt:
        '把10根分成两部分，写一个加法和两个减法，逐个实际操作并解释三个算式的关系。',
      rule: { kind: 'manual' },
      hint: '每次先重摆同样的总数，避免沿用拿走后的数量。',
      explanation: '实际操作、纸笔与说明人工确认。',
    },
    {
      id: 'sj-ten-arithmetic-manual-story',
      knowledge: 'sj-ten-arithmetic-story-paper',
      prompt:
        '原创求总数和求另一部分的故事，分别说已知什么、求什么，写算式、单位和答句，并用摆物检查。',
      rule: { kind: 'manual' },
      hint: '只替换数字不能代替理解问题问什么。',
      explanation: '口头、纸笔和检查过程人工确认，不自动评价完整解题能力。',
    },
  ],
  reviewQuestions: arithmeticTasks(true),
  review: sourceReview,
};

export const sujiaoTenArithmeticDrafts = [
  sujiaoTenCompositionDraft,
  sujiaoTenArithmeticDraft,
];
