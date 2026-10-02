import type { Lesson, Question, QueueVisual } from '../learning/types';

import { queueNeighbours, queuePosition } from '../learning/queue';
import { required } from '../learning/required';

export const sujiaoCountOrderSources = {
  counting: [
    'http://app.xxsx.cn/resources-detail/38107/63',
    'http://app.xxsx.cn/resources-detail/38108/63',
  ],
  order: [
    'http://app.xxsx.cn/resources-detail/38109/63',
    'http://app.xxsx.cn/resources-detail/38110/63',
  ],
  checkedAt: '2026-09-30',
} as const;

function countingTasks(review: boolean): Question[] {
  const id = 'sj-upper-recognize-4-5';
  const prefix = review ? 'r' : 'q';
  return [
    ...[4, 5].map((value): Question => ({
      id: `${id}-${prefix}-count-${value}`,
      knowledge: `${id}-count`,
      prompt: review
        ? '只数第二组的圆点，第二组共有几个？'
        : '逐一点数圆点，一共有几个？',
      visual: {
        kind: 'count',
        count: review ? 3 : value,
        other: review ? value : undefined,
      },
      rule: { kind: 'number', value },
      hint: '每个圆点只数一次，最后数到的数表示总数。',
      explanation: `点数指定的一组，共有${value}个。`,
    })),
    ...[4, 5].map((value): Question => ({
      id: `${id}-${prefix}-match-${value}`,
      knowledge: `${id}-quantity-digit`,
      prompt: review
        ? '为第一组圆点选择对应的数字卡，第二组不用数。'
        : '为这一组圆点选择对应的数字卡。',
      visual: { kind: 'count', count: value, other: review ? 2 : undefined },
      choices: ['3', '4', '5'].map((label) => ({ id: label, label })),
      rule: { kind: 'choice', value: String(value) },
      hint: '先数清楚，再找表示这个数量的数字。',
      explanation: `有${value}个，用数字${value}表示。`,
    })),
    ...[3, 4].map((value): Question => ({
      id: `${id}-${prefix}-next-${value}`,
      knowledge: `${id}-one-more`,
      prompt: review
        ? `篮子里有${value}块积木，再放1块，现在有几块？`
        : `先摆${value}个圆点，再添1个，变成几个？`,
      rule: { kind: 'number', value: value + 1 },
      hint: '每添1个，就接着数下一个数。',
      explanation: `${value}再添1个，得到${value + 1}个。`,
    })),
    {
      id: `${id}-${prefix}-complete`,
      knowledge: `${id}-quantity-completion`,
      prompt: review
        ? '盒子上写着5，表示需要5块积木。原来有3块，还需添几块？'
        : '盒子上写着4，表示需要4块积木。原来有2块，还需添几块？',
      rule: { kind: 'number', value: 2 },
      hint: review ? '从3接着数到5，一次添1块。' : '从2接着数到4，一次添1块。',
      explanation: review
        ? '从3添到4，再添到5，一共添2块。'
        : '从2添到3，再添到4，一共添2块。',
    },
  ];
}

export const sujiaoFourFiveDraft: Lesson = {
  id: 'sj-upper-recognize-4-5',
  textbookTitle: '认识1～5',
  title: '认识4和5：数量对应与添1',
  page: 14,
  version: 1,
  status: 'preparing',
  goal: '点数4、5个物体，将数量与数字对应，理解3添1是4、4添1是5，按指定数量补齐物品。',
  prerequisite: '已经能逐一点数1～3个物体；准备5块积木、数字卡和练习本。',
  parentTip:
    '数字书写须对照教材或教师示范；本站数字和圆点不是描红或笔顺示范。看不清组别时先明确题目要求数哪一组。',
  steps: [
    {
      title: '从3接着数到4、5',
      text: '先摆3块积木，再添1块，数到4；再添1块，数到5。每块只数一次，最后报出的数表示总数。',
      activity: '孩子逐块移动并点数4块、5块；家长不要替孩子报结果。',
      visual: { kind: 'count', count: 4 },
    },
    {
      title: '同一个数量，不同的物品',
      text: '4块积木、4本书都可以用数字4表示；5张卡片、5个杯子都用5表示。物品种类改变，数字仍表示相同数量。',
      activity: '分别找4件或5件身边的小物品，配上数字卡。',
    },
    {
      title: '按需要补齐',
      text: '盒子上标着4，就需要4件。先数已有几件，再逐件添上去直到4。达到指定数量就停下，不多添也不少添。',
      activity: '家长先摆2块，请孩子添到4块；再换一个已有数量，添到5块。',
    },
    {
      title: '画数量，再练写数字',
      text: '在纸上分别画4个、5个圆，再在旁边写数字。书写4、5先观察教材第15页或教师示范，请家长查看落笔方向和形状。',
      activity: '用实际纸笔练习，不能用屏幕点选代替写数。',
    },
  ],
  questions: [
    ...countingTasks(false),
    {
      id: 'sj-upper-recognize-4-5-manual-write',
      knowledge: 'sj-upper-recognize-4-5-paper',
      prompt:
        '对照教材或教师示范，在纸上画4个、5个圆，并练写数字4、5，请家长查看。',
      rule: { kind: 'manual' },
      hint: '先点数画出的圆，再写对应数字。',
      explanation: '实际书写由人工查看，确认完成不等于已写正确。',
    },
    {
      id: 'sj-upper-recognize-4-5-manual-complete',
      knowledge: 'sj-upper-recognize-4-5-physical',
      prompt:
        '用积木做一次添1到4、添1到5，再把另一个盒子里的积木补齐到指定的4块或5块。',
      rule: { kind: 'manual' },
      hint: '每次只添1块，边添边数，达到指定数量时停止。',
      explanation: '实际操作与说明由孩子或家长确认。',
    },
  ],
  reviewQuestions: countingTasks(true),
  review: {
    date: sujiaoCountOrderSources.checkedAt,
    reviewer: '公开书页范围核验与原创课程草稿',
    notes: `依据上册印刷第14～15页：${sujiaoCountOrderSources.counting.join('；')}。草稿为原创活动，未复制原图或原题全文。完整版本身份仍待确认，不注册为正式教材。`,
  },
};

const mainQueue: QueueVisual = {
  kind: 'queue',
  labels: ['小禾', '小乐', '小林', '小安', '小宁'],
  front: 'left',
};
const reviewQueue: QueueVisual = {
  kind: 'queue',
  labels: ['小安', '小禾', '小林', '小乐'],
  front: 'right',
};

function queueTasks(review: boolean): Question[] {
  const id = 'sj-upper-cardinal-ordinal';
  const prefix = review ? 'r' : 'q';
  const queue = review ? reviewQueue : mainQueue;
  const targets = review ? ['小安', '小乐', '小林'] : ['小禾', '小林', '小宁'];
  const person = review ? '小林' : '小安';
  const neighbours = required(queueNeighbours(queue, person));
  const rank = review ? 2 : 4;
  const selected = required(
    queue.labels.find((label) => queuePosition(queue, label) === rank),
  );
  const shortened: QueueVisual = {
    ...queue,
    labels: queue.labels.filter((label) => queuePosition(queue, label) !== 1),
  };
  const afterPerson = review ? '小禾' : '小林';
  return [
    {
      id: `${id}-${prefix}-total`,
      knowledge: `${id}-quantity`,
      prompt: '这支队伍一共有几个人？',
      visual: queue,
      rule: { kind: 'number', value: queue.labels.length },
      hint: '每个人数一次；问一共有几人，是问总数量。',
      explanation: `共有${queue.labels.length}人，不是只找某一个位置。`,
    },
    ...targets.map((label, index): Question => ({
      id: `${id}-${prefix}-rank-${index}`,
      knowledge: `${id}-rank`,
      prompt: `从图上标明的队首开始数，${label}排第几？`,
      visual: queue,
      rule: { kind: 'number', value: required(queuePosition(queue, label)) },
      hint: '先找队首，按箭头方向依次数到这个人。',
      explanation: `${label}排第${queuePosition(queue, label)}；名字只用来指认，不是位置编号。`,
    })),
    {
      id: `${id}-${prefix}-before`,
      knowledge: `${id}-before-count`,
      prompt: `${person}前面有几个人？不包括${person}自己。`,
      visual: queue,
      rule: { kind: 'number', value: neighbours.before },
      hint: '从队首数到这个人之前就停下。',
      explanation: `${person}排第${queuePosition(queue, person)}，前面有${neighbours.before}人。`,
    },
    {
      id: `${id}-${prefix}-after`,
      knowledge: `${id}-after-count`,
      prompt: `${person}后面有几个人？不包括${person}自己。`,
      visual: queue,
      rule: { kind: 'number', value: neighbours.after },
      hint: '只数这个人到队尾之间的其他人。',
      explanation: `${person}后面有${neighbours.after}人。`,
    },
    {
      id: `${id}-${prefix}-identify`,
      knowledge: `${id}-identify-position`,
      prompt: `从队首数，第${rank}位是谁？`,
      visual: queue,
      choices: queue.labels.map((label) => ({ id: label, label })),
      rule: { kind: 'choice', value: selected },
      hint: '从队首逐个数，到指定位置停下并读名字。',
      explanation: `第${rank}位是${selected}。`,
    },
    {
      id: `${id}-${prefix}-changed`,
      knowledge: `${id}-changed-position`,
      prompt: `原来的第1位离开了。这是现在的队伍，${afterPerson}现在排第几？`,
      visual: shortened,
      rule: {
        kind: 'number',
        value: required(queuePosition(shortened, afterPerson)),
      },
      hint: '观察这幅已经改变的队列，重新从现在的队首数。',
      explanation: `现在有${shortened.labels.length}人，${afterPerson}排第${queuePosition(shortened, afterPerson)}。这是新位置，不能照抄原位置。`,
    },
    {
      id: `${id}-${prefix}-meaning`,
      knowledge: `${id}-quantity-versus-position`,
      prompt: review ? '“选第2张卡片”要选几张？' : '“选第4张卡片”要选几张？',
      choices: [
        { id: 'one', label: '只选指定位置的1张' },
        { id: 'many', label: review ? '选2张' : '选4张' },
      ],
      rule: { kind: 'choice', value: 'one' },
      hint: '有“第”表示指定位置；不表示选择这么多张。',
      explanation: '第几指定一个位置，几张表示数量，两种要求不同。',
    },
  ];
}

export const sujiaoOrdinalDraft: Lesson = {
  id: 'sj-upper-cardinal-ordinal',
  textbookTitle: '几和第几',
  title: '几和第几：队首、位置与前后人数',
  page: 16,
  version: 1,
  status: 'preparing',
  goal: '区分数量与位置；从明确的队首数第几，判断某人前后的人数，观察队首人员离开后的新位置。',
  prerequisite:
    '能数1～5。名字用于指认，不会读时可以请家长帮读；不因此替孩子数出答案。',
  parentTip:
    '示意图明确队首和队尾，人物名字不带位置编号。问前后人数时不包括自己；位置改变后应按新队列重新数。',
  steps: [
    {
      title: '几表示总数量',
      text: '数队伍里一共有几个人，必须把每个人数一次。这个数表示全队的数量，不是某个人的位置。',
      visual: mainQueue,
      activity: '拿5张不同的卡片排成一行，先数一共有几张。',
    },
    {
      title: '第几表示位置',
      text: '先约定哪一端是队首，从队首开始数1、2、3……数到指定人物，就得到他排第几。把队首换到另一端，同一人的位置可能改变，总人数不变。',
      visual: mainQueue,
      activity: '指定一张卡片，从左端和右端分别开始数，说出两次排第几。',
    },
    {
      title: '前面和后面分别数',
      text: '前面是这个人到队首之间的人，后面是这个人到队尾之间的人，两边都不包括他自己。只数题目问的一边，不能把排第几直接当作前面有几人。',
      activity: '指一张中间的卡片，分别数它前面和后面有几张。',
    },
    {
      title: '队伍变化，重新判断',
      text: '原来队首的1人离开后，队伍人数减少，后面的人成为新的位置。看新的队伍，重新从新的队首数；问选第4张是只选一个位置，问选4张则是选数量4。',
      activity:
        '把队首卡片拿走，再判断同一张卡片的新位置；另做一次取4张和取第4张的操作。',
    },
  ],
  questions: [
    ...queueTasks(false),
    {
      id: 'sj-upper-cardinal-ordinal-manual-direction',
      knowledge: 'sj-upper-cardinal-ordinal-physical-direction',
      prompt:
        '实际排5张不同卡片，明确队首。指定一张卡片，分别从两端开始数，说出位置和总数量怎样变化。',
      rule: { kind: 'manual' },
      hint: '改变数的起点，总张数不变；位置要重新判断。',
      explanation: '卡片操作与解释由孩子或家长确认，不自动给表达打分。',
    },
    {
      id: 'sj-upper-cardinal-ordinal-manual-card',
      knowledge: 'sj-upper-cardinal-ordinal-physical-meaning',
      prompt:
        '先取4张卡片，再放回；重新从约定的队首数，只取第4张，说出两次拿到的数量。',
      rule: { kind: 'manual' },
      hint: '4张是数量，第4张是一个指定位置。',
      explanation: '实际选取由人工确认，不能只用选择题答对代替操作。',
    },
  ],
  reviewQuestions: queueTasks(true),
  review: {
    date: sujiaoCountOrderSources.checkedAt,
    reviewer: '公开书页范围核验与原创课程草稿',
    notes: `依据上册印刷第16～17页：${sujiaoCountOrderSources.order.join('；')}。本站人物示意图、名字与问答为原创；复习换队首方向与人物顺序。完整版本身份仍待确认，不注册为正式教材。`,
  },
};

export const sujiaoUpperCountOrderDrafts = [
  sujiaoFourFiveDraft,
  sujiaoOrdinalDraft,
];
