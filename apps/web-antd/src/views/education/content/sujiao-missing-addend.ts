import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';

export const sujiaoMissingAddendSource = {
  checkedAt: '2026-10-01',
  page: 70,
  link: 'http://app.xxsx.cn/resources-detail/38192/63',
} as const;

function tasks(review: boolean): Question[] {
  const id = 'sj-upper-missing-addend';
  const prefix = review ? 'r' : 'q';
  const pairs = review
    ? [
        [3, 9],
        [4, 10],
        [7, 10],
        [6, 9],
        [5, 8],
        [8, 9],
        [8, 8],
      ]
    : [
        [2, 10],
        [5, 10],
        [8, 10],
        [4, 10],
        [7, 10],
        [9, 10],
        [10, 10],
      ];
  return [
    ...pairs.map(([existing, target], index): Question => ({
      id: `${id}-${prefix}-missing-${index}`,
      knowledge:
        index === 6 ? `${id}-already-complete` : `${id}-missing-quantity`,
      prompt: review
        ? `要准备${target}张卡片，已经有${existing}张，还要添几张？`
        : `盒里要有${target}块积木，已经有${existing}块，还要添几块？`,
      visual: {
        kind: 'number-line',
        minimum: 0,
        maximum: 10,
        value: required(existing),
      },
      rule: { kind: 'number', value: required(target) - required(existing) },
      hint: '从已有数量接着数到目标，数清新添的次数；也可以用目标减已有数量检查。已有够了就不用添。',
      explanation: `${target} - ${existing} = ${required(target) - required(existing)}，检查：${existing} + ${required(target) - required(existing)} = ${target}。只填新添数量，不填最后总数。`,
    })),
    {
      id: `${id}-${prefix}-path`,
      knowledge: `${id}-count-on`,
      prompt: review
        ? '从8开始接着数到10，按顺序填每次到达的数，不填起点。'
        : '从7开始接着数到10，按顺序填每次到达的数，不填起点。',
      visual: {
        kind: 'number-line',
        minimum: 0,
        maximum: 10,
        value: review ? 8 : 7,
      },
      rule: { kind: 'steps', values: review ? [9, 10] : [8, 9, 10] },
      hint: '起点表示已经有的数量，不是新添的第1次。',
      explanation: review
        ? '从8到9、10，共添2次，所以8 + 2 = 10。'
        : '从7到8、9、10，共添3次，所以7 + 3 = 10。',
    },
    {
      id: `${id}-${prefix}-check`,
      knowledge: `${id}-check-total`,
      prompt: review
        ? '要10块，已经有6块，小乐说还要添4块。怎样检查这个答案？'
        : '要10块，已经有3块，小乐说还要添7块。怎样检查这个答案？',
      choices: review
        ? [
            { id: 'combine', label: '检查6 + 4是否等于10' },
            { id: 'wrong', label: '检查10 + 4是多少' },
          ]
        : [
            { id: 'combine', label: '检查3 + 7是否等于10' },
            { id: 'wrong', label: '检查10 + 7是多少' },
          ],
      rule: { kind: 'choice', value: 'combine' },
      hint: '已有数量加上新添数量应刚好等于目标。',
      explanation: '检查的是已有与新增两部分合成目标，不把目标再加一次。',
    },
  ];
}

export const sujiaoMissingAddendDraft: Lesson = {
  id: 'sj-upper-missing-addend',
  textbookTitle: '还要添多少：求缺少的加数',
  title: '已经有一些，还要添几块？',
  page: 70,
  status: 'preparing',
  version: 1,
  goal: '根据已有数量和目标数量求缺少数量，用实际补齐、接着数和减法解释，再用加法检查。',
  prerequisite:
    '理解9以内加减法和含0运算；本课讲清目标10是接着9再添1；准备10块积木、盒子和纸笔。',
  parentTip:
    '先确认已有数量，再补到目标；孩子容易把目标总数填成新增数量。数线起点不算新增次数，已经达到目标时新增为0，空答案不是0。',
  steps: [
    {
      title: '目标、已有、新添分清楚',
      text: '盒里已有8块，目标是10块。先数清已有8块，再逐块添，9、10，每次只添1块，数清新添2块。10是最后总数，2才是还要添的数量。',
      visual: { kind: 'number-line', minimum: 0, maximum: 10, value: 8 },
      activity: '实际先摆8块，添到10，把原来的与新添的分开指出。',
    },
    {
      title: '接着数，不重数起点',
      text: '从7接着数到10，依次到8、9、10，共3次，说明要添3块。起点7表示已经有的数量，不再算作一次新增。',
      visual: { kind: 'number-line', minimum: 0, maximum: 10, value: 7 },
      activity: '每添1块就在纸上画一个记号，检查新添块数与记号数一致。',
    },
    {
      title: '减法求缺少，加法检查',
      text: '目标10，已有8，缺少数量可用10 - 8 = 2求出。把结果放回检查：8 + 2 = 10。同样方法也能处理目标6、已有4的补齐问题，不是每次都只求凑成10。',
      activity: '实际补齐一组目标不超过10的物品，写出减法和检查的加法。',
    },
    {
      title: '已经够了与自己讲故事',
      text: '已经有10块，目标也是10块，不必再添，新添数量是0。说清需要多少、已经多少、问还缺多少；暂时没有作答不能当成答案0。',
      activity:
        '自己讲一个补齐故事，再实际摆物与纸笔检查；也试一次已经刚好够的情况。',
    },
  ],
  questions: [
    ...tasks(false),
    {
      id: 'sj-upper-missing-addend-manual-complete',
      knowledge: 'sj-upper-missing-addend-physical',
      prompt:
        '实际先摆已有数量，再逐块补到目标10，每添1块画一个记号，指出已有、新添与最后总数，请家长查看。',
      rule: { kind: 'manual' },
      hint: '从已有数量继续添，不把已有物品又当新增。',
      explanation: '实际补齐与计数过程人工确认，数线答对不代替操作。',
    },
    {
      id: 'sj-upper-missing-addend-manual-story',
      knowledge: 'sj-upper-missing-addend-story-paper',
      prompt:
        '原创一个目标不超过10的补齐故事，实际摆物，在纸上写求缺少数量的减法与检查的加法；说明已有够时怎么办。',
      rule: { kind: 'manual' },
      hint: '核对已有加新增等于目标，已经够时不用添。',
      explanation: '故事、纸笔与说明人工确认，完成不等于掌握。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: sujiaoMissingAddendSource.checkedAt,
    reviewer: '公开书页范围核验与原创课程草稿',
    notes: `依据印刷第70页：${sujiaoMissingAddendSource.link}，已确认凑成10及目标6的求缺少数量活动；含0边界复用此前已读含0运算知识作原创补充。其它第62～74页本轮读取失败，不声明整个10单元或认识10整课完成。准确版次待确认，未注册正式课程。`,
  },
};
