import type { Lesson, Question } from '../learning/types';

import { sujiaoLowerSource as source } from './sujiao-lower-source';

const id = 'sj-lower-unit-patterns';
function tasks(review: boolean): Question[] {
  const prefix = `${id}-${review ? 'r' : 'q'}`;
  const setTask = (
    suffix: string,
    prompt: string,
    expressions: [number, '+' | '-', number][],
    target: number,
    hint: string,
  ): Question => ({
    id: `${prefix}-${suffix}`,
    knowledge: `${id}-${suffix}`,
    prompt,
    choices: expressions.map(([a, op, b], i) => ({
      id: `e${i}`,
      label: `${a}${op}${b}`,
    })),
    rule: {
      kind: 'set',
      values: expressions.flatMap(([a, op, b], i) =>
        (op === '+' ? a + b : a - b) === target ? [`e${i}`] : [],
      ),
    },
    hint,
    explanation: `逐个算完整结果，只选结果为${target}的候选；可选不止一个，漏选或多选都需要重新检查。`,
  });
  const pattern = (
    suffix: string,
    expressions: [number, '+' | '-', number][],
    explanation: string,
  ): Question => ({
    id: `${prefix}-${suffix}`,
    knowledge: `${id}-${suffix}`,
    prompt: `按顺序填${expressions.map(([a, op, b]) => `${a}${op}${b}`).join('、')}的结果，再观察变化。`,
    rule: {
      kind: 'steps',
      values: expressions.map(([a, op, b]) => (op === '+' ? a + b : a - b)),
    },
    hint: '先计算每一项，再核对哪个数在变、哪个数保持不变；不要只猜结果排列。',
    explanation,
  });
  const target = review ? 14 : 13;
  const cards = review ? [3, 5, 6, 8] : [4, 6, 7, 9];
  const difference = review ? 7 : 8;
  const pairs = cards.flatMap((a) =>
    cards.filter((b) => a !== b).map((b) => ({ a, b })),
  );
  const cardChoices = pairs.map(({ a, b }) => ({
    id: `a${a}-b${b}`,
    label: `1${a}−${b}=${difference}`,
  }));
  const unavailable = review ? [4, 7] : [6, 8];
  cardChoices.push({
    id: 'missing-card',
    label: `1${unavailable[0]}−${unavailable[1]}=${difference}`,
  });
  const cardAnswers = pairs
    .filter(({ a, b }) => 10 + a - b === difference)
    .map(({ a, b }) => `a${a}-b${b}`);
  return [
    setTask(
      'equal-add',
      `选出下列候选中所有与${review ? '8+7' : '8+6'}结果相等的算式。`,
      review
        ? [
            [6, '+', 9],
            [7, '+', 8],
            [8, '+', 7],
            [6, '+', 8],
            [9, '+', 7],
          ]
        : [
            [5, '+', 9],
            [6, '+', 8],
            [7, '+', 7],
            [6, '+', 9],
            [7, '+', 6],
          ],
      review ? 15 : 14,
      '算式写法可以不同，比较的是算出的完整结果。',
    ),
    setTask(
      'equal-subtract',
      `选出下列候选中所有与${review ? '13−5' : '12−5'}结果相等的算式。`,
      review
        ? [
            [14, '-', 6],
            [15, '-', 7],
            [16, '-', 8],
            [13, '-', 6],
            [16, '-', 7],
          ]
        : [
            [13, '-', 6],
            [14, '-', 7],
            [15, '-', 8],
            [12, '-', 6],
            [15, '-', 7],
          ],
      review ? 8 : 7,
      '被减数与减数同时加1，拿走后剩下的数量不变；仍要逐个检查。',
    ),
    pattern(
      'add-increase',
      review
        ? [
            [5, '+', 8],
            [6, '+', 8],
            [7, '+', 8],
          ]
        : [
            [6, '+', 7],
            [7, '+', 7],
            [8, '+', 7],
          ],
      '一个加数不变，另一个加数每次多1，结果也每次多1。这里是已给出的三项，不能忽略加数条件。',
    ),
    pattern(
      'subtract-decrease',
      review
        ? [
            [16, '-', 7],
            [16, '-', 8],
            [16, '-', 9],
          ]
        : [
            [15, '-', 6],
            [15, '-', 7],
            [15, '-', 8],
          ],
      '原有数量不变，每次多拿走1，剩下数量少1。减数增加不是结果增加。',
    ),
    pattern(
      'subtract-increase',
      review
        ? [
            [13, '-', 7],
            [14, '-', 7],
            [15, '-', 7],
          ]
        : [
            [12, '-', 6],
            [13, '-', 6],
            [14, '-', 6],
          ],
      '拿走数量不变，原有数量每次多1，剩下数量也多1。',
    ),
    pattern(
      'shift-both',
      review
        ? [
            [13, '-', 5],
            [14, '-', 6],
            [15, '-', 7],
          ]
        : [
            [12, '-', 5],
            [13, '-', 6],
            [14, '-', 7],
          ],
      '原有数量与拿走数量一起多1，剩下不变。它与只改减数的规律不同。',
    ),
    {
      id: `${prefix}-missing-add`,
      knowledge: `${id}-missing-add`,
      prompt: review ? '8+□=9+5，□里填几？' : '7+□=8+6，□里填几？',
      rule: { kind: 'number', value: review ? 6 : 7 },
      hint: '先算已知的一边，再从这个总数减去另一边已知部分。',
      explanation: review
        ? '9+5=14，14−8=6，8+6=14。'
        : '8+6=14，14−7=7，7+7=14。',
    },
    {
      id: `${prefix}-missing-subtract`,
      knowledge: `${id}-missing-subtract`,
      prompt: review ? '14−6=15−□，□里填几？' : '15−7=16−□，□里填几？',
      rule: { kind: 'number', value: review ? 7 : 8 },
      hint: '先求剩下几，再由原有数和剩下数求拿走数。',
      explanation: review
        ? '14−6=8，15−7=8，所以填7。'
        : '15−7=8，16−8=8，所以填8。',
    },
    setTask(
      'many-additions',
      `下面哪些候选算式结果是${target}？选出所有符合的算式。交换加数后的不同写法也分别选。`,
      review
        ? [
            [5, '+', 9],
            [6, '+', 8],
            [7, '+', 7],
            [8, '+', 6],
            [9, '+', 5],
            [4, '+', 9],
            [6, '+', 9],
          ]
        : [
            [4, '+', 9],
            [5, '+', 8],
            [6, '+', 7],
            [7, '+', 6],
            [8, '+', 5],
            [9, '+', 4],
            [3, '+', 9],
            [6, '+', 8],
          ],
      target,
      '同一个和可以有不同的加数组合；这里只要求检查已列出的候选，不是只选一种。',
    ),
    setTask(
      'many-subtractions',
      `下面哪些候选算式结果是${review ? 7 : 6}？选出所有符合的算式。`,
      review
        ? [
            [11, '-', 4],
            [12, '-', 5],
            [13, '-', 6],
            [14, '-', 7],
            [15, '-', 8],
            [16, '-', 9],
            [12, '-', 6],
          ]
        : [
            [11, '-', 5],
            [12, '-', 6],
            [13, '-', 7],
            [14, '-', 8],
            [15, '-', 9],
            [13, '-', 6],
          ],
      review ? 7 : 6,
      '原有数与拿走数不同，剩下数量仍可能相同；需要检查完整候选。',
    ),
    {
      id: `${prefix}-cards`,
      knowledge: `${id}-cards`,
      prompt: `只有${cards.join('、')}四张不同数卡。十位的1已经写好，从四张卡中每次选两张不同的卡，分别放在1□−□里，组成结果为${difference}的算式。选出下列候选中所有既算对又满足数卡条件的写法。每种写法都重新使用这副卡，不要求几种写法同时摆。`,
      choices: cardChoices,
      rule: { kind: 'set', values: cardAnswers },
      hint: '先检查个位与减数都来自所给卡且不重复使用，再计算是否得到指定结果。不能借用没有的数卡。',
      explanation: `符合条件的写法是${pairs
        .filter(({ a, b }) => 10 + a - b === difference)
        .map(({ a, b }) => `1${a}−${b}=${difference}`)
        .join('、')}。候选中有算得对却用了未提供数卡的写法，这也不能选。`,
    },
    {
      id: `${prefix}-missing-card`,
      knowledge: `${id}-missing-card`,
      prompt: `还是只有${cards.join('、')}这副数卡。${review ? '14−7=7' : '16−8=8'}虽然计算正确，能按刚才的数卡要求摆出来吗？`,
      choices: [
        { id: 'yes', label: '能，算得对就可以' },
        { id: 'no', label: '不能，所需数卡没有提供' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '计算正确与符合给定材料条件是两个检查。',
      explanation: review
        ? '数卡里没有4和7，不能摆出14−7。'
        : '数卡里没有8，不能摆出16−8。',
    },
    {
      id: `${prefix}-claim`,
      knowledge: `${id}-claim`,
      prompt: review
        ? '16−7=9，16−8=8。有人说减数多1，结果也多1。这个说法对吗？'
        : '15−6=9，15−7=8。有人说减数多1，结果也多1。这个说法对吗？',
      choices: [
        { id: 'yes', label: '对，数变大结果总会变大' },
        { id: 'no', label: '不对，原有数不变，多拿走1就少剩1' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '用同一堆物品先拿走较少，再多拿走一个。',
      explanation: '结果从9变8，是少1。不能把加法的变化直接套给减法。',
    },
  ];
}
export const sujiaoLowerUnitPatternsDraft: Lesson = {
  id,
  title: '单元整理：等结果、变化规律与数卡条件',
  textbookTitle: '单元复习·算式整理与探索',
  page: 18,
  version: 1,
  status: 'preparing',
  goal: '比较完整结果，观察加减中的变化，补缺数并找出符合数卡条件的全部候选。',
  prerequisite: '能计算20以内进位加法和退位减法，理解等号两边结果相等。',
  parentTip:
    '让孩子先算再说哪个量变了。多选题要逐项核验，数卡题还要检查给定材料，不把发现一种写法当作找全。',
  steps: [
    {
      title: '不同算式也可以有相同结果',
      text: '5+9、6+8、7+7都得到14。13−6、14−7、15−8都得到7。等号表示两边完整结果相等，不是让右边重复左边的数字。',
    },
    {
      title: '分清哪个量改变',
      text: '6+7、7+7、8+7结果逐次多1；15−6、15−7、15−8结果逐次少1。12−5、13−6、14−7却都等于7，因为原有量和拿走量同时多1。',
    },
    {
      title: '多种答案逐个检查',
      text: '同一个和或差可以有多种算式。选题中所有符合的候选时，漏选与多选都需要重新检查；摆数卡还要满足只有给定卡、每次两张不同卡的条件。',
    },
    {
      title: '摆卡并说明你怎样找全',
      text: '从4、6、7、9中选个位卡和减数卡，十位1已写好。每次选不同两张，尝试让结果是8。固定个位后轮流检查其他减数，避免漏试；每种尝试后把卡放回。',
      activity:
        '实际制作四张数卡，按固定一张、轮换另一张的方法检查所有不同两卡组合，并向家长说明哪些不符合。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '拿物品表示15−6，再多拿走1，记录剩下数量怎样变化；不要只口头套规律。',
      '亲手制作4、6、7、9四张数卡，十位1先写好，逐一尝试不同两卡的12种有顺序摆法，找出结果为8的全部写法。',
      '自己写出两种结果为14的加法和两种结果为7的减法，算完后向家长解释不同写法为何结果相同。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '需要真实摆物、写算式或摆卡后由孩子与家长确认。',
      explanation: '实际活动与说明独立人工记录，不因客观题答对而自动完成。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '已读单元复习范围与原创课包检查',
    notes: `依据下册印刷第18～21页等结果、缺数、规律和数卡条件范围；ISBN ${source.isbn}。本站数字、候选与任务为原创，没有复制原题全文或插图。加法表、九宫格与完整单元覆盖仍未完成；版权日期待核验，保留未注册草稿。`,
  },
};
