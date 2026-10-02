import type { ArithmeticGridVisual, Lesson, Question } from '../learning/types';

import { arithmeticCell, sumFrequency } from '../learning/arithmetic-grid';
import { required } from '../learning/required';
import { sujiaoLowerSource as source } from './sujiao-lower-source';
const id = 'sj-lower-arithmetic-tables';
function tasks(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  const addPosition: [number, number] = review ? [4, 3] : [3, 2];
  const subtractPosition: [number, number] = review ? [4, 1] : [3, 2];
  const add: ArithmeticGridVisual = {
    kind: 'arithmetic-grid',
    mode: 'carry-add',
    hidden: [addPosition],
  };
  const subtract: ArithmeticGridVisual = {
    kind: 'arithmetic-grid',
    mode: 'borrow-subtract',
    hidden: [subtractPosition],
  };
  const sum: ArithmeticGridVisual = {
    kind: 'arithmetic-grid',
    mode: 'sum-grid',
    hidden: [],
    marked: [review ? 11 : 10],
  };
  const target = review ? 11 : 10;
  const otherTargets = review ? [7, 14] : [6, 13];
  function missing(
    suffix: string,
    model: ArithmeticGridVisual,
    wrong: string[],
  ): Question {
    const [r, c] = required(model.hidden[0]);
    const answer = required(arithmeticCell(model.mode, r, c)).expression;
    return {
      id: `${prefix}-${suffix}`,
      knowledge: `${id}-${suffix}`,
      prompt: `${review ? '复习' : '练习'}：按行头和列头，A格应填哪一个完整算式？这里填算式，不只填结果。`,
      visual: model,
      choices: [
        { id: 'correct', label: answer },
        ...wrong.map((label, i) => ({ id: `wrong${i}`, label })),
      ],
      rule: { kind: 'choice', value: 'correct' },
      hint:
        model.mode === 'carry-add'
          ? '列头是第一个加数，行头是第二个加数；按本表的顺序写。'
          : '行头是原有数，列头是拿走数；减法不能交换两个数。',
      explanation: `本格由两个表头共同确定，填${answer}。表中横线只是未纳入本次整理的格，不是0。`,
    };
  }
  return [
    missing(
      'missing-add',
      add,
      review ? ['6+5', '5+6', '6+7'] : ['5+7', '7+4', '6+5'],
    ),
    missing(
      'missing-subtract',
      subtract,
      review ? ['8−15', '15−7', '14−8'] : ['7−14', '14−6', '13−7'],
    ),
    {
      id: `${prefix}-add-row`,
      knowledge: `${id}-add-row`,
      prompt: review
        ? '沿加法表同一横行从左往右看（只看有算式的格），哪一个加数保持不变？'
        : '沿加法表同一横行从左往右看（只看有算式的格），哪一个加数保持不变？请按本表表头顺序判断。',
      visual: add,
      choices: [
        { id: 'second', label: '第二个加数，也就是行头' },
        { id: 'first', label: '第一个加数，也就是列头' },
      ],
      rule: { kind: 'choice', value: 'second' },
      hint: '同一行的行头不会改变，向右会换列头。',
      explanation: '第二个加数不变，第一个加数向右减少1，已列算式的和也减少1。',
    },
    {
      id: `${prefix}-subtract-column`,
      knowledge: `${id}-subtract-column`,
      prompt: review
        ? '复习减法表：沿同一列向下看有算式的格，哪个数不变？'
        : '沿减法表同一列从上往下看有算式的格，哪个数不变？',
      visual: subtract,
      choices: [
        { id: 'subtract', label: '减数，也就是列头' },
        { id: 'starting', label: '被减数，也就是行头' },
      ],
      rule: { kind: 'choice', value: 'subtract' },
      hint: '同一列沿用同一个拿走数。',
      explanation:
        '减数不变，被减数向下增加1，已列算式的差增加1；不把横线当成结果。',
    },
    {
      id: `${prefix}-add-result`,
      knowledge: `${id}-add-result`,
      prompt: review
        ? '表中列头9、行头6对应的算式，结果是几？'
        : '表中列头8、行头7对应的算式，结果是几？',
      visual: add,
      rule: { kind: 'number', value: 15 },
      hint: '先定位两个表头共同确定的格，再相加。',
      explanation: review
        ? '9+6=15。图中显示算式，结果需要自己计算。'
        : '8+7=15。图中显示算式，结果需要自己计算。',
    },
    {
      id: `${prefix}-subtract-result`,
      knowledge: `${id}-subtract-result`,
      prompt: review
        ? '表中行头14、列头9对应的算式，结果是几？'
        : '表中行头13、列头8对应的算式，结果是几？',
      visual: subtract,
      rule: { kind: 'number', value: 5 },
      hint: '行头是被减数，列头是减数。',
      explanation: review ? '14−9=5。' : '13−8=5。',
    },
    {
      id: `${prefix}-marked-count`,
      knowledge: `${id}-marked-count`,
      prompt: `1～9完整和表中，和为${target}的格已带圆点。共有几个这样的格？按格子数，不把交换加数后的两格合并。`,
      visual: sum,
      rule: { kind: 'number', value: sumFrequency(target) },
      hint: '逐行查找带圆点的格，一个格只记一次。',
      explanation: `和为${target}共有${sumFrequency(target)}格。每格代表一对有顺序的行、列加数，不能把不同位置的格合并。`,
    },
    {
      id: `${prefix}-two-counts`,
      knowledge: `${id}-two-counts`,
      prompt: `还是这张完整1～9和表，请依次填和为${otherTargets[0]}、${otherTargets[1]}的格子数。它们不一定是已经带圆点的格，要重新找。`,
      visual: sum,
      rule: {
        kind: 'steps',
        values: otherTargets.map((item) => sumFrequency(item)),
      },
      hint: '分别按所求的和查全表；不要只数当前标记。',
      explanation: `依次是${otherTargets.map((item) => sumFrequency(item)).join('、')}格。标记某个和不改变其他数出现次数。`,
    },
    {
      id: `${prefix}-most`,
      knowledge: `${id}-most`,
      prompt: review
        ? '全表仍是1～9与1～9组成的81格。带圆点的和不一定最多，哪一个和出现次数最多？'
        : '在完整1～9和表的所有格中，哪一个和出现次数最多？',
      visual: sum,
      choices: [9, 10, 11, 18].map((n) => ({
        id: String(n),
        label: String(n),
      })),
      rule: { kind: 'choice', value: '10' },
      hint: '检查整个表，不把选中的标记当作最大次数的结论。',
      explanation: '和10有9格，比其他和更多。和越大不表示出现次数越多。',
    },
    {
      id: `${prefix}-least`,
      knowledge: `${id}-least`,
      prompt: review
        ? '在复习全表中，下列候选哪些和出现次数最少？全部选出，不只看带圆点的和。'
        : '在完整1～9和表中，下列候选哪些和出现次数最少？全部选出。',
      visual: sum,
      choices: [2, 3, 9, 10, 17, 18].map((n) => ({
        id: String(n),
        label: String(n),
      })),
      rule: { kind: 'set', values: ['2', '18'] },
      hint: '查表的两端。可能有多个和同样最少，全部选出。',
      explanation:
        '和2只在1+1一格，和18只在9+9一格；都出现1次，不能只选其中一个。',
    },
    {
      id: `${prefix}-ordered`,
      knowledge: `${id}-ordered`,
      prompt: review
        ? '复习数格：行头2列头9与行头9列头2，虽然都得到11，应该数成几个格？'
        : '行头1列头9与行头9列头1，虽然都得到10，在这张表里应该数成几个格？',
      visual: sum,
      rule: { kind: 'number', value: 2 },
      hint: '两个位置不同，数的是格子，不是不同结果的种类。',
      explanation: '是2格。加数交换后和相同，但表中有顺序的位置不同。',
    },
    {
      id: `${prefix}-outside`,
      knowledge: `${id}-outside`,
      prompt: review
        ? '复习加法整理表：有些格显示横线，是否表示这些位置的计算结果为0？'
        : '进位加法整理表中有些格显示横线，是否表示这些位置的计算结果为0？',
      visual: add,
      choices: [
        { id: 'yes', label: '是，横线就是0' },
        { id: 'no', label: '不是，这些格不在本次进位算式整理范围' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '本表只纳入和大于10的算式，不是所有加法都显示。',
      explanation:
        '横线是未纳入范围，字母是待填算式，二者都不能当作0。完整和表另有1～9所有组合，不要混淆范围。',
    },
  ];
}
function reflections(review: boolean): Question[] {
  return [
    review
      ? '复习后，选一道进位加法或退位减法，用自己的话说这次用了什么方法。'
      : '这一单元你学会了哪些计算？选一道进位加法或退位减法，说说自己怎样算。',
    review
      ? '和上次比，哪一处还需要帮助？可以说出新的问题，不需要假装全部都会。'
      : '哪一类计算或解决问题还需要帮助？可以说“不知道怎么开始”，由家长按原话记录。',
    review
      ? '下一次你想怎样继续练？写一个可做到的小步骤，并说是否愿意向别人提问或说明。'
      : '下一次想再练什么？写一个小计划，可以是摆小棒、讲一个问题、检查一张表或大胆说出想法。',
  ].map((prompt, index): Question => ({
    id: `${id}-${review ? 'r' : 'q'}-reflection-${index}`,
    knowledge: `${id}-reflection-${index}`,
    prompt,
    rule: { kind: 'reflection' },
    hint: '可以口述，请家长按孩子的原话代写；学习反思不设置唯一正确答案。',
    explanation:
      '已按你的实际想法记录。自评不能代替计算或解决问题的证据，不自动判断表达水平或单元掌握。',
  }));
}
export const sujiaoArithmeticTablesDraft: Lesson = {
  id,
  title: '单元整理：算式表与和的分布',
  textbookTitle: '单元复习·算式表与方格探索',
  page: 18,
  version: 2,
  status: 'preparing',
  goal: '按表头定位进位与退位算式，观察行列变化，比较完整和表中的格子次数，并记录自己的收获、困难和下一步。',
  prerequisite: '能进行20以内加减，分清行与列、算式与结果。',
  parentTip:
    '先说明正在看哪一种表。进位与退位表只整理相应范围，完整和表有81个有顺序的组合；数出现次数时不能把交换加数后的两个格合并。反思按孩子原话记录，不代替孩子判断都会了。',
  steps: [
    {
      title: '按两个表头确定加法算式',
      text: '本站加法整理表列头是第一个加数，行头是第二个加数，列从9到2，行从2到9，只列和大于10的算式。必须以本表表头为准；横线表示不纳入，字母表示待填。',
      visual: { kind: 'arithmetic-grid', mode: 'carry-add', hidden: [[3, 2]] },
    },
    {
      title: '减法中的行列不能交换',
      text: '行头11～18是被减数，列头2～9是减数，只列需要退位的算式。同一列向下，被减数增加、减数不变，差也增加；同一行向右减数减少1，已列算式的差增加1。',
      visual: {
        kind: 'arithmetic-grid',
        mode: 'borrow-subtract',
        hidden: [[3, 2]],
      },
    },
    {
      title: '完整和表与同和格子',
      text: '另一个完整表是1～9与1～9的所有有顺序组合，每格显示和。行头不变、列头多1时，和多1；同一个和分布在斜着的格中。圆点和强调文字一起标记和为10的格，不只靠颜色。',
      visual: {
        kind: 'arithmetic-grid',
        mode: 'sum-grid',
        hidden: [],
        marked: [10],
      },
    },
    {
      title: '比较次数，说明范围',
      text: '全表中和10出现最多，和2与18各只一格、同样最少。标记不同的和不改变整个表的分布；图示结论需要孩子实际数格和说明，而不是按是否标色猜测。',
      visual: {
        kind: 'arithmetic-grid',
        mode: 'sum-grid',
        hidden: [],
        marked: [6, 13],
      },
      activity:
        '纸上画1～9和表，填写并分别圈和为10、6、13的格，数次数，再说明两端为什么少。',
    },
  ],
  questions: [
    ...tasks(false),
    ...reflections(false),
    ...[
      '纸面整理2～9两个加数中和大于10的全部算式，按自己明确的行列方向写出，抽查两行和两列并说变化。',
      '纸面整理11～18减去2～9中需要退位的全部算式，逐格检查是否在范围，不能把未列格当作0。',
      '实际画并填完1～9和表，圈和10、6、13的格，分别数次数，再比较最多与并列最少，解释交换加数后为什么有两个格。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '需要真实画表、填算式、圈格与口述，由孩子或家长确认。',
      explanation: '纸面活动单独人工记录，图示题答对不自动代表实际完成整表。',
    })),
  ],
  reviewQuestions: [...tasks(true), ...reflections(true)],
  review: {
    date: source.checkedAt,
    reviewer: '已读单元表格范围与原创数据检查',
    notes: `依据下册印刷第18页进位和退位算式整理、第21页1～9和表、次数探索及评价反思，ISBN ${source.isbn}。本站明确表头顺序、选择不同遮挡位置与问答，不复制原表图片或原题全文；三种表范围单列，版权日期待核验，保持未注册草稿。`,
  },
};
