import type { Lesson, Question } from '../learning/types';

import { sujiaoLowerSource as source } from './sujiao-lower-source';

const id = 'sj-lower-eight-seven-add';

function tasks(review: boolean): Question[] {
  const prefix = review ? 'r' : 'q';
  const left = review ? 7 : 8;
  const right = review ? 6 : 5;
  const leftNeed = 10 - left;
  const rightNeed = 10 - right;
  const sums: [number, number][] = review
    ? [
        [8, 6],
        [7, 4],
        [7, 7],
      ]
    : [
        [8, 4],
        [7, 5],
        [8, 8],
      ];
  return [
    {
      id: `${id}-${prefix}-make-ten`,
      knowledge: `${id}-complement`,
      prompt: `${left}还差几就到10？`,
      rule: { kind: 'number', value: leftNeed },
      hint: `从${left}接着数到10，数一共接着走了几步。`,
      explanation: `${left}+${leftNeed}=10，所以还差${leftNeed}。`,
    },
    {
      id: `${id}-${prefix}-left-ten`,
      knowledge: `${id}-left-ten`,
      prompt: `算${left}+${right}，把${right}分成两部分，先拿一部分与${left}凑成10。依次填拿出的数、剩下的数。`,
      visual: { kind: 'ten-frame', left, right },
      rule: { kind: 'steps', values: [leftNeed, right - leftNeed] },
      hint: `先找${left}到10需要多少，再检查两部分合起来还是${right}。`,
      explanation: `${right}分成${leftNeed}和${right - leftNeed}；${left}+${leftNeed}=10，再加${right - leftNeed}得${left + right}。`,
    },
    {
      id: `${id}-${prefix}-right-ten`,
      knowledge: `${id}-right-ten`,
      prompt: `还是${left}+${right}，这次让${right}先凑成10。把${left}分开，依次填给${right}的数、${left}剩下的数。`,
      visual: { kind: 'ten-frame', left, right },
      rule: { kind: 'steps', values: [rightNeed, left - rightNeed] },
      hint: `从${left}里拿${rightNeed}与${right}合成10，不能拿新添的物品。`,
      explanation: `${left}分成${rightNeed}和${left - rightNeed}；${right}+${rightNeed}=10，再加${left - rightNeed}，同样得${left + right}。`,
    },
    ...sums.map(([a, b]) => ({
      id: `${id}-${prefix}-sum-${a}-${b}`,
      knowledge: `${id}-carry-sum`,
      prompt: `${a} + ${b} = ？先想一想把哪一组凑成10。`,
      visual: { kind: 'ten-frame' as const, left: a, right: b },
      rule: { kind: 'number' as const, value: a + b },
      hint: `${a}还差${10 - a}到10，从另一组中拿这么多后再加余下部分。`,
      explanation: `${a}+${b}=10+${a + b - 10}=${a + b}。分组改变，总数量不变。`,
    })),
    {
      id: `${id}-${prefix}-exchange`,
      knowledge: `${id}-exchange`,
      prompt: `已知${left}+${right}=13，${right}+${left}等于几？`,
      rule: { kind: 'number', value: 13 },
      hint: '只交换两组位置，没有添上或拿走物品。',
      explanation: `两组数量仍是${left}和${right}，合起来仍是13。不是交换后再增加一组。`,
    },
    {
      id: `${id}-${prefix}-check-split`,
      knowledge: `${id}-split-conservation`,
      prompt: `算${left}+${right}时，小禾把${right}分成${leftNeed}和${right - leftNeed + 1}，这样分对了吗？`,
      choices: [
        { id: 'yes', label: '对，只要第一部分能凑十就行' },
        { id: 'no', label: '不对，两部分合起来要等于原来的数' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '把拆出的两部分重新合起来，看看有没有多出物品。',
      explanation: `${leftNeed}+${right - leftNeed + 1}=${right + 1}，比原来的${right}多1；正确拆成${leftNeed}和${right - leftNeed}。凑十不能改变数量。`,
    },
    {
      id: `${id}-${prefix}-story`,
      knowledge: `${id}-addition-story`,
      prompt: review
        ? '桌上原有7张卡片，又放上6张，一共有几张？'
        : '盒子原有8块积木，又放进5块，一共有几块？',
      rule: { kind: 'number', value: left + right },
      hint: '把原有与新添的两部分合起来，不是拿走。',
      explanation: `${left}+${right}=13，共13${review ? '张' : '块'}。可以选择让任一组先凑成10。`,
    },
    {
      id: `${id}-${prefix}-zero`,
      knowledge: `${id}-zero`,
      prompt: `${left} + 0 = ？`,
      rule: { kind: 'number', value: left },
      hint: '新添的一组一个也没有，原来那组没有增减。',
      explanation: `加0没有添物，仍是${left}。这里不用从0里拿物品凑十。`,
    },
    {
      id: `${id}-${prefix}-ten`,
      knowledge: `${id}-ten`,
      prompt: `${left} + 10 = ？`,
      rule: { kind: 'number', value: left + 10 },
      hint: '已经有完整的一个十，合上另一组的一，不需要把十再凑一次。',
      explanation: `1个十与${left}个一合起来是${left + 10}。`,
    },
  ];
}

export const sujiaoEightSevenAddDraft: Lesson = {
  id,
  textbookTitle: '进位加法和退位减法',
  title: '8、7加几：选择一组凑十',
  page: 8,
  version: 1,
  status: 'preparing',
  goal: '知道8差2、7差3到十，选择不同加数凑十，检查拆分守恒及交换两组后的总数。',
  prerequisite: '会10的组成与9加几。准备19件小物品、两张纸面十格图和数字卡。',
  parentTip:
    '允许选择适合自己的凑十方向。先用实物说明拆的是哪一组，余下多少；不要求只背一种步骤。',
  steps: [
    {
      title: '找到离十还差几',
      text: '8再添2成为10，7再添3成为10。用十格图先摆8或7个圆片，观察空格，并实际补齐。先确定哪组凑十，不把两个补数都加进总数。',
      activity: '在纸面十格图分别摆8个、7个圆片，每次补到10，再恢复原数。',
    },
    {
      title: '让8先凑成十',
      text: '8块与5块合起来，可以把5分成2和3。把2块移到8块中，组成10块，再合上余下3块，共13块。只是移动和重新分组，没有新添物品。',
      visual: { kind: 'ten-frame', left: 8, right: 5 },
      activity: '亲手摆两组，移动2块，逐一点数检查仍是13块。',
    },
    {
      title: '也可以让另一组先凑成十',
      text: '仍算8加5：5差5到10，从8中拿5与原来的5合成10，8中剩3，再加这3，仍是13。两种方法拆的组不同，但没有增减任何物品。',
      visual: { kind: 'ten-frame', left: 8, right: 5 },
      activity: '恢复8块与5块，再尝试让5先到10，指出没移动的3块。',
    },
    {
      title: '交换两组、联系生活并检查特殊情况',
      text: '两组只交换位置，总数不变，8加5与5加8都是13。编一个合起来的生活问题，再换成7加6练习。加0没有添物；加10已经有一个十，不必照搬拆分步骤。',
      activity: '用7块与6块做两种凑十，再实际演示7加0与7加10。',
    },
  ],
  questions: [
    ...tasks(false),
    {
      id: `${id}-manual-two-ways`,
      knowledge: `${id}-physical-strategies`,
      prompt:
        '摆8块与5块，分别让8先凑十、让5先凑十；说出每次拆哪一组、余下多少，并检查总数。',
      rule: { kind: 'manual' },
      hint: '每次恢复原来的两组后再开始，移动不是新添。',
      explanation: '实际移动与口述需人工查看，填对拆分数不代替操作。',
    },
    {
      id: `${id}-manual-exchange`,
      knowledge: `${id}-physical-exchange`,
      prompt:
        '摆7块与6块，交换两组位置再数一遍；说明总数为什么不变，并选一种凑十方法检查。',
      rule: { kind: 'manual' },
      hint: '检查有无添物或拿走，再说明哪一组先凑成10。',
      explanation: '位置、分组与总数的说明由人工确认，不自动认定掌握。',
    },
    {
      id: `${id}-manual-story`,
      knowledge: `${id}-own-story`,
      prompt:
        '编一个一组有8或7件、另一组有几件的合起来问题，总数不超过19；画图或摆物并说出答句。',
      rule: { kind: 'manual' },
      hint: '说清两部分、问题和物品单位，允许不同生活情境。',
      explanation: '问题、实物方法和口述答句分别由人工查看。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '同一公开扫描正文范围核验与原创草稿检查',
    notes: `已实际读到${source.preview}下册印刷第8～9页，封底ISBN ${source.isbn}。原书8加7仅用于核对两种凑十范围，本站用8加5、7加6等原创情境。保留加0、加10与交换加数检查；未复制原图文。版权版次、印次尚待核验，保持草稿，不代表全页练习或第一单元完成。`,
  },
};
