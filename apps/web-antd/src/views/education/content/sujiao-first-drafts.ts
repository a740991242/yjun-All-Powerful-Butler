import type { Lesson, Question } from '../learning/types';

import { sujiaoArithmeticTablesDraft } from './sujiao-arithmetic-tables';
import { sujiaoEightSevenAddDraft } from './sujiao-eight-seven-add';
import {
  sujiaoCalculationApplicationsDraft,
  sujiaoConditionsPairsDraft,
} from './sujiao-lower-applications';
import {
  sujiaoEightSevenSubtractDraft,
  sujiaoSmallAddInverseDraft,
} from './sujiao-lower-next-arithmetic';
import { sujiaoLowerSource } from './sujiao-lower-source';
import { sujiaoLowerUnitPatternsDraft } from './sujiao-lower-unit-patterns';
import { sujiaoMagicGridDraft } from './sujiao-magic-grid';
import { sujiaoNineSubtractDraft } from './sujiao-nine-subtract';
import { sujiaoNumberTowersDraft } from './sujiao-number-towers';
import { sujiaoPeriodicFlagsDraft } from './sujiao-periodic-flags';

/** Observed printed pages in the compiler-associated site's public reader.
 * These prove a bounded teaching scope, not a complete edition identity.
 */
export const sujiaoDraftSources = {
  counting: {
    checkedAt: '2026-09-30',
    pages: [12, 13],
    links: [
      'http://app.xxsx.cn/resources-detail/38105/63',
      'http://app.xxsx.cn/resources-detail/38106/63',
    ],
  },
  carry: {
    checkedAt: sujiaoLowerSource.checkedAt,
    pages: [2, 3],
    links: [
      'http://app.xxsx.cn/resources-detail/38284/63',
      sujiaoLowerSource.preview,
    ],
  },
} as const;

function countTasks(review: boolean): Question[] {
  const id = 'sj-upper-recognize-1-3';
  const values = review ? [3, 1, 2] : [1, 2, 3];
  const prefix = review ? 'r' : 'q';
  return [
    ...values.map((value) => ({
      id: `${id}-${prefix}-count-${value}`,
      knowledge: `${id}-one-to-one`,
      prompt: review
        ? '只点数第一组圆点，第一组共有几个？第二组不用数。'
        : '一个一个地点数，这里共有几个圆点？',
      visual: {
        kind: 'count' as const,
        count: value,
        other: review ? (value % 3) + 1 : undefined,
      },
      rule: { kind: 'number' as const, value },
      hint: '每个圆点只数一次，最后说出的数表示总数。',
      explanation: `逐一点数，最后数到${value}，所以共有${value}个。`,
    })),
    ...values.map((value) => ({
      id: `${id}-${prefix}-match-${value}`,
      knowledge: `${id}-quantity-digit`,
      prompt: review
        ? '只看第二组圆点，为第二组选择对应的数字卡。'
        : '为图中的圆点选出表示数量的数字卡。',
      visual: {
        kind: 'count' as const,
        count: review ? (value % 3) + 1 : value,
        other: review ? value : undefined,
      },
      choices: ['1', '2', '3'].map((label) => ({ id: label, label })),
      rule: { kind: 'choice' as const, value: String(value) },
      hint: '先数清有几个，再找到对应的数字。',
      explanation: `数量是${value}，对应数字${value}。`,
    })),
    ...[1, 2].map((value) => ({
      id: `${id}-${prefix}-one-more-${value}`,
      knowledge: `${id}-one-more`,
      prompt: review
        ? `先拿${value}块积木，再拿1块，现在有几块？`
        : `先摆${value}个圆点，再添1个，现在有几个？`,
      rule: { kind: 'number' as const, value: value + 1 },
      hint: '每添一个，接着往后数一个。',
      explanation: `原来${value}个，再添1个，就是${value + 1}个。`,
    })),
  ];
}

export const sujiaoCountingDraft: Lesson = {
  id: 'sj-upper-recognize-1-3',
  textbookTitle: '认识1～5',
  title: '认识1～3：数物、认数与写数',
  page: 12,
  version: 1,
  status: 'preparing',
  goal: '逐一点数1～3个物体，把数量与数字对应；认识添1后的数量，并进行实际纸笔书写。',
  prerequisite: '请准备3块积木、数字1～3的卡片、铅笔与练习本。家长可以帮读题。',
  parentTip:
    '这里只覆盖已读到的第12～13页中1～3的内容，不代表认识1～5整课完成。书写请对照教材或教师示范；圆点和数字不是笔顺动画。',
  steps: [
    {
      title: '每个物体只数一次',
      text: '拿出3块积木，边移动边数，每移动一块说一个数。全部数完时，最后说出的数表示共有几块。换个方向再数，积木没有增减，总数仍相同。',
      visual: { kind: 'count', count: 3 },
      activity: '先拿1块，再分别拿2块、3块，每次边指边数。',
    },
    {
      title: '数量和数字卡配对',
      text: '有1个物体就用数字1表示，有2个就用2，有3个就用3。物体可以是积木、书或杯子，物体不同，表示相同数量的数字不变。',
      activity: '请家长摆出1～3件物品，孩子先数，再选择对应数字卡。',
    },
    {
      title: '再添一个',
      text: '原来1块，再放1块，接着数到2；原来2块，再放1块，接着数到3。亲手摆完并重新数一遍，看看数量怎样改变。',
      activity: '从1块开始，每次只添1块，到3块为止。',
    },
    {
      title: '用圆表示数量，再写数',
      text: '拿出1～3件物品，先在纸上每件画一个圆，再在旁边写表示数量的数字。写数时观察教材或教师示范；本站普通字体只用于认数，不代替标准书写示范。',
      activity: '对照教材第13页及教师示范，在练习本上写1、2、3。',
    },
  ],
  questions: [
    ...countTasks(false),
    {
      id: 'sj-upper-recognize-1-3-manual-touch',
      knowledge: 'sj-upper-recognize-1-3-actual-count',
      prompt:
        '拿出3件小物品，移动着数一次，再换方向数一次，说明为什么两次总数相同。',
      rule: { kind: 'manual' },
      hint: '每个物体只数一次，没有添上或拿走。',
      explanation: '实际点数和说明由孩子或家长确认，不自动判断动作是否正确。',
    },
    {
      id: 'sj-upper-recognize-1-3-manual-write',
      knowledge: 'sj-upper-recognize-1-3-paper-writing',
      prompt:
        '对照教材或教师示范，在纸上画1～3个圆并写对应数字1、2、3，请家长查看。',
      rule: { kind: 'manual' },
      hint: '先画圆，再数一数，最后写数。',
      explanation: '书写需要实际纸笔和人工查看；点击确认不等于正确掌握书写。',
    },
    {
      id: 'sj-upper-recognize-1-3-manual-life',
      knowledge: 'sj-upper-recognize-1-3-life-quantity',
      prompt:
        '在房间里分别找到数量为1、2、3的物品，每次指认并说清物品名称与数量。',
      rule: { kind: 'manual' },
      hint: '可以从书、杯子或积木中找，不需要物品都相同。',
      explanation: '生活中的表达由孩子或家长确认，允许不同例子。',
    },
  ],
  reviewQuestions: countTasks(true),
  review: {
    date: sujiaoDraftSources.counting.checkedAt,
    reviewer: '公开书页范围核验与原创课程草稿',
    notes: `依据上册印刷第12～13页：${sujiaoDraftSources.counting.links.join('；')}。课包为原创，未复制原图或题目全文；封面、版权页、完整版本身份及教师最终审校尚待确认，保持待开放，不接入已有人教版教材。`,
  },
};

function carryTasks(review: boolean): Question[] {
  const id = 'sj-lower-nine-add';
  const prefix = review ? 'r' : 'q';
  const right = review ? 5 : 3;
  return [
    {
      id: `${id}-${prefix}-next`,
      knowledge: `${id}-count-on`,
      prompt: `从9接着往后数${right}个数，最后数到几？`,
      visual: { kind: 'number-line', minimum: 8, maximum: 19, value: 9 },
      rule: { kind: 'number', value: 9 + right },
      hint: '9是起点，不算作接着数的第一个；从10开始数。',
      explanation: `从10开始接着数${right}个，最后到${9 + right}。`,
    },
    {
      id: `${id}-${prefix}-need-one`,
      knowledge: `${id}-make-ten`,
      prompt: review
        ? '准备把散棒换成一捆10根，现在只有9根，还需要补几根？'
        : '9个一再添几个一，正好成为10个一？',
      rule: { kind: 'number', value: 1 },
      hint: '从9接着数一个就是10。',
      explanation: '9还差1就是10，10个一可以换成1个十。',
    },
    {
      id: `${id}-${prefix}-split`,
      knowledge: `${id}-split-addend`,
      prompt: `算9加${right}时，先把${right}分成1和几，让9先加1凑成10？`,
      rule: { kind: 'number', value: right - 1 },
      hint: `从${right}里面先拿出1，还剩下几个？`,
      explanation: `${right}分成1和${right - 1}。先算9加1，再加剩下的${right - 1}。`,
    },
    {
      id: `${id}-${prefix}-zero`,
      knowledge: `${id}-add-zero`,
      prompt: review
        ? '0+9=几？空盒里放入9块后，共有几块？'
        : '9+0=几？9块积木没有添新块，共有几块？',
      rule: { kind: 'number', value: 9 },
      hint: '0表示这部分没有物品，合起来仍是原有的数量。',
      explanation: '9+0与0+9都等于9。加0不用拆出1去凑十。',
    },
    {
      id: `${id}-${prefix}-ten`,
      knowledge: `${id}-add-ten`,
      prompt: review
        ? '10+9=几？已有一捆10根，再加9根散棒。'
        : '9+10=几？9根散棒再添一捆10根。',
      rule: { kind: 'number', value: 19 },
      hint: '一捆已经是一个十，直接与9个一合起来。',
      explanation: '9+10与10+9都是19，即1个十和9个一，不必强行拆分凑十。',
    },
    ...[right, review ? 6 : 2, review ? 8 : 7].map((value) => ({
      id: `${id}-${prefix}-sum-${value}`,
      knowledge: `${id}-carry-sum`,
      prompt: `9 + ${value} = ？请先用接着数或凑十的方法想一想。`,
      visual: { kind: 'ten-frame' as const, left: 9, right: value },
      rule: { kind: 'number' as const, value: 9 + value },
      hint: `从${value}里拿1和9合成10，再加剩下的${value - 1}。`,
      explanation: `9+${value}=10+${value - 1}=${9 + value}。两种方法得到相同结果。`,
    })),
    {
      id: `${id}-${prefix}-story`,
      knowledge: `${id}-addition-story`,
      prompt: review
        ? '书架原有9本书，又放上5本，一共有几本？'
        : '盒子原有9块积木，又放进3块，一共有几块？',
      rule: { kind: 'number', value: 9 + right },
      hint: '把原有数量与新添数量合起来。',
      explanation: `原来9，添上${right}，合起来${9 + right}。`,
    },
  ];
}

export const sujiaoNineAddDraft: Lesson = {
  id: 'sj-lower-nine-add',
  textbookTitle: '进位加法和退位减法',
  title: '9加几：接着数与凑十',
  page: 2,
  version: 2,
  status: 'preparing',
  goal: '比较接着数与凑十的方法，用实物分拆说明9加几的进位过程，解决合起来的实际问题。',
  prerequisite: '能认读11～19，知道10个一可以换成1个十。准备小棒或积木。',
  parentTip:
    '不要求只使用一种算法。先操作再说明，家长提供的方法或答案需如实记录帮助；换捆不能改变总数量。',
  steps: [
    {
      title: '从9接着数',
      text: '先摆9块积木，再添3块。已经数到9，就从10开始，每添一块接着数一次，依次到10、11、12。原来的9不用重复数。',
      visual: { kind: 'number-line', minimum: 8, maximum: 19, value: 9 },
      activity: '自己摆9块，再逐一添3块，一边添一边说数。',
    },
    {
      title: '先凑成十',
      text: '9还差1就到10。把新添的3块分成1块和2块，先将1块放到原来的9块中，组成10块；再加剩下2块，仍然是12块。只是换了分组，没有增减。',
      visual: { kind: 'ten-frame', left: 9, right: 3 },
      activity: '在纸面十格图中移动1个圆片，再用真实积木操作同样的分拆。',
    },
    {
      title: '十个一换一个十',
      text: '把10根小棒捆成一捆，就是1个十。1捆和2根散棒共12根，换成一捆不是少了9根；总数量不变。再拆开这捆验证一次。',
      activity: '实际把10根小棒捆起来，再拆开，说明两次总数相同。',
    },
    {
      title: '解释两种办法',
      text: '接着数是逐个添上去，凑十是先把9补成10再加剩下部分。两种方法得到相同总数。9加0没有添物，仍是9；9加10已经有一个十，得到19，不强行照搬拆分凑十。用自己的话说明每一步，再编一个把两部分合起来的生活问题。',
      activity: '换成再添5块，选一种方法算，并用另一种方法检查。',
    },
  ],
  questions: [
    ...carryTasks(false),
    {
      id: 'sj-lower-nine-add-manual-strategies',
      knowledge: 'sj-lower-nine-add-strategy-expression',
      prompt: '实际摆9块积木，再添3块，分别用接着数、凑十说明总数为什么相同。',
      rule: { kind: 'manual' },
      hint: '说明从哪里开始数，以及凑十时从新添的一组拿了几块。',
      explanation: '操作与解释由孩子或家长确认，不用填对答案代替实际表达。',
    },
    {
      id: 'sj-lower-nine-add-manual-bundle',
      knowledge: 'sj-lower-nine-add-quantity-conservation',
      prompt: '把10根小棒捆成一捆，再拆开，说说为什么总数没有改变。',
      rule: { kind: 'manual' },
      hint: '只是换了分组，没有拿走或添上小棒。',
      explanation: '实际换捆和说明由人工确认，不自动评定理解程度。',
    },
    {
      id: 'sj-lower-nine-add-manual-story',
      knowledge: 'sj-lower-nine-add-own-story',
      prompt:
        '自己编一个原有9件物品、又添几件的生活问题，用小棒或积木说明结果。总数保持在19以内。',
      rule: { kind: 'manual' },
      hint: '说清原有几件、又添几件、要求什么。',
      explanation: '允许不同情境，由孩子或家长核对数量与解释。',
    },
  ],
  reviewQuestions: carryTasks(true),
  review: {
    date: sujiaoDraftSources.carry.checkedAt,
    reviewer: '公开书页范围核验与原创课程草稿',
    notes: `已实际核对下册印刷第2～3页：${sujiaoDraftSources.carry.links.join('；')}，同一公开扫描封底ISBN ${sujiaoLowerSource.isbn}。教材9加4的数学事实用于核对范围，本站改用原创物品情境、数量与问答；未复制教材插图。版权版次与印次仍待核验，保持待开放；第3页的加0与加10已补原创边界任务；整页覆盖审核仍需完成。`,
  },
};

/** Authored draft snapshots stay unchanged; reviewed releases use separate copies. */
export const sujiaoFirstDrafts = [
  sujiaoCountingDraft,
  sujiaoNineAddDraft,
  sujiaoNineSubtractDraft,
  sujiaoEightSevenAddDraft,
  sujiaoEightSevenSubtractDraft,
  sujiaoSmallAddInverseDraft,
  sujiaoCalculationApplicationsDraft,
  sujiaoConditionsPairsDraft,
  sujiaoNumberTowersDraft,
  sujiaoLowerUnitPatternsDraft,
  sujiaoMagicGridDraft,
  sujiaoArithmeticTablesDraft,
  sujiaoPeriodicFlagsDraft,
];
