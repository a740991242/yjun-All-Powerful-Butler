import type { Lesson, Question } from '../learning/types';

import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-estimation';
function tasks(review: boolean): Question[] {
  const ones = review ? 7 : 3;
  const tens = review ? 4 : 6;
  const total = tens * 10 + ones;
  const choice = (
    key: string,
    prompt: string,
    choices: Question['choices'],
    value: string,
    explanation: string,
  ): Question => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
    choices,
    rule: { kind: 'choice', value },
    hint: '区分估计与准确计数，核对对象和计数单位。',
    explanation,
  });
  return [
    choice(
      'order',
      review
        ? '想保留第一次估计，再核对一袋卡片数量，怎样做？'
        : '想保留第一次估计，再核对一盘积木数量，怎样做？',
      [
        { id: 'first', label: '先观察并记录估计，再数清并保留两次记录' },
        { id: 'rewrite', label: '先看准确数，再把原估计改成准确数' },
      ],
      'first',
      '记录原估计才能比较方法；事后改写不是第一次估计。',
    ),
    {
      id: `${id}-${review ? 'r' : 'q'}-group-total`,
      knowledge: `${id}-group-total`,
      prompt: `数清后得到${tens}组，每组10个，另有${ones}个散着的。一共有多少个？`,
      rule: { kind: 'number', value: total },
      hint: '组数不是物品数，每组10个，再加散着的。',
      explanation: `${tens}个十和${ones}个一是${total}。`,
    },
    {
      id: `${id}-${review ? 'r' : 'q'}-compose`,
      knowledge: `${id}-compose`,
      prompt: `${total}可以分成几个十和几个一？依次填组数和散个数。`,
      rule: { kind: 'steps', values: [tens, ones] },
      hint: '完整10个才是一组，剩下不足10个逐个计。',
      explanation: `${tens}个十和${ones}个一；总数不是${tens}个。`,
    },
    choice(
      'unit',
      `孩子把${total}个点分成${tens}组10个和${ones}个散点，说“共有${tens}个点”，该怎样核对？`,
      [
        {
          id: 'group',
          label: '他把完整组数当成了点的总数，应计每组10个再计散点',
        },
        { id: 'same', label: '组数就等于点数，不用再数' },
      ],
      'group',
      '一次计10个时，报的组数与点数单位不同。',
    ),
    choice(
      'density',
      review
        ? '同一批纸卡摆得更密，没有添加或拿走，数量会怎样？'
        : '同一批积木摆得更疏，没有添加或拿走，数量会怎样？',
      [
        { id: 'same', label: '数量不变，仍要按对象逐个或分组核对' },
        {
          id: 'change',
          label: review ? '变少了，因为面积更小' : '变多了，因为面积更大',
        },
      ],
      'same',
      '疏密和占地面积不是数量；没有添拿总数不变。',
    ),
    choice(
      'difference',
      review
        ? '小宁先估50个，数清是47个。怎样记录？'
        : '小禾先估60个，数清是63个。怎样记录？',
      [
        {
          id: 'keep',
          label: review
            ? '保留估计50和实数47，说明估多了3个'
            : '保留估计60和实数63，说明估少了3个',
        },
        { id: 'erase', label: '删去原估计，只留下实数' },
      ],
      'keep',
      '保留两个不同记录，估计不是必须与实数相等。',
    ),
    choice(
      'reference',
      review
        ? '用10张同样卡片作参照估一堆同样卡片，之后怎样核对？'
        : '用10块同样积木作参照估一堆同样积木，之后怎样核对？',
      [
        { id: 'count', label: '参照可帮助估计，最后仍逐个或分组数清' },
        { id: 'area', label: '只按面积，不必实际计数' },
      ],
      'count',
      '大小、摆放会影响观察，参照不能替代准确计数。',
    ),
    choice(
      'next',
      review
        ? '原估计40，实数47，想让下次估计更有依据，哪种做法合适？'
        : '原估计70，实数63，想让下次估计更有依据，哪种做法合适？',
      [
        {
          id: 'reason',
          label: '比较10个参照与整堆，检查疏密，再换一堆先估后数',
        },
        { id: 'copy', label: '以后所有物品都写这次实数' },
      ],
      'reason',
      '反思计数方法并换真实数量，不能把一次结果作为所有估计。',
    ),
  ];
}
export const sujiaoEstimationDraft: Lesson = {
  id,
  title: '先估再数：十个参照与原估计记录',
  textbookTitle: '认识20～99·估数与核对',
  page: 45,
  version: 1,
  status: 'preparing',
  goal: '用10个作参照先估再数，区分原估计与核对数量，按组与散个数准确计数。',
  prerequisite: '会按十和一计数；准备同样大小的安全积木或纸卡。',
  parentTip:
    '依据已读45、50页估数部分范围。点图与数量原创，框内10个用于参照；估计不设唯一正确答案或任意误差评分。网页原估计锁定后保留，数清记录与真实物品活动独立。尚不包含53页“50有多大”。',
  steps: [
    {
      title: '先观察，用10个作参照',
      text: '虚线框里已核对10个点，用它帮助判断整图大约有几个十。先观察，记录自己的估计，再点击保存原估计。允许与最后实数不同，不要求一开始猜准。',
      visual: { kind: 'estimate-dots', variant: 'main' },
      activity:
        '实际找一堆同样大小安全物品，先数出10个作参照，另在纸上写原估计。',
    },
    {
      title: '保存原估计后再数清',
      text: '网页保存后保留原估计，才开放数清输入。逐个数时不重不漏，或每10个分一组，剩下不足10个逐个计；在上一张点图填写数清数，不用改写原估计。点图是网页示例，不是实际物品活动证明。',
      activity:
        '回到上一张图数清，并填写核对数量；纸面记录也保留估计与实数两个栏。',
    },
    {
      title: '组数与总个数分开',
      text: '若数清为6组10个，另有3个，是63个而非6个。把物品摆得更疏或更密，只要没有添拿，总数不变。用参照估计要注意同样物品及摆放，最后仍数清核对。',
      activity: '实际把同一批物品改摆，重新数清并核对总数不变。',
    },
    {
      title: '比较两次记录，不改写历史',
      text: '估60而数清63，是估少3；估70而数清63，是估多7。这些差异可帮助改进观察方法，不说明估计必须等于实数。保留第一次记录，再换一堆练习，不能拿上次实数当本次答案。',
      activity: '实际口述估计依据、数清方法与两次记录，说明下次怎样改进。',
    },
  ],
  questions: [
    ...tasks(false),
    {
      id: `${id}-manual-web`,
      knowledge: `${id}-manual-web`,
      prompt:
        '这是另一张网页点图。先记录原估计并保存，再数清填写；口述两次记录的区别。此项只确认网页操作，不代表真实物品活动。',
      visual: { kind: 'estimate-dots', variant: 'review' },
      rule: { kind: 'manual' },
      hint: '保持第一次估计，不要求估计等于实数。操作与核对完成才人工确认。',
      explanation: '网页练习人工确认，不纳入客观正确率，不自动确认实物。',
    },
    ...[
      '实际准备一堆同样大小的安全物品，用10个参照，在纸上先记估计，再逐个或分组数清，分别保留两个数量。',
      '实际改摆同一批物品，不添不拿，重新数清；口述数量是否改变以及估计依据和下一次改进方法。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '实物与纸面确实完成后才确认，可留待做。',
      explanation: '网页记录不自动证明真实活动。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '你先怎样估计，后来怎样数清？保留原估计与实数，记录一个发现或待核对的问题。',
      rule: { kind: 'reflection' },
      hint: '写真实过程，不要求估计准确或唯一表述。',
      explanation: '开放反思null，不评分。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '参照估数与记录分离核验',
    notes: `依据ISBN ${source.isbn}已读45、50页相关部分，原创点图与不同复习数据。版次印次未知，不证明完整单元。`,
  },
};
