import type { BeadChainVisual, Lesson, Question } from '../learning/types';

import { hiddenBeads } from '../learning/bead-chain';
const id = 'sj-upper-final-building';
export const sujiaoMainBeads: BeadChainVisual = {
  kind: 'bead-chain',
  firstB: 1,
  groups: 4,
  hidden: [2, 3],
};
export const sujiaoReviewBeads: BeadChainVisual = {
  kind: 'bead-chain',
  firstB: 2,
  groups: 4,
  hidden: [2, 3],
};
export function sujiaoBeadTasks(review: boolean): Question[] {
  const visual = review ? sujiaoReviewBeads : sujiaoMainBeads;
  const prefix = `${id}-${review ? 'r' : 'q'}-beads`;
  const [a, b] = hiddenBeads(visual);
  return [
    {
      id: `${prefix}-a`,
      knowledge: `${id}-beads-a`,
      prompt: '按图中明确规则，第2和第3组一起遮住了。被遮住的A珠一共有几颗？',
      visual,
      rule: { kind: 'number', value: a },
      hint: '每组都有1颗A珠。遮住两组，不是只遮住一组。',
      explanation: '第2、3组各1颗A珠，共2颗。',
    },
    {
      id: `${prefix}-b`,
      knowledge: `${id}-beads-b`,
      prompt: '按图中明确规则，第2和第3组被遮住的B珠合起来一共有几颗？',
      visual,
      rule: { kind: 'number', value: b },
      hint: '先分别推出第2和第3组B珠数，再合起来；不能只报其中一组。',
      explanation: review
        ? '第2组3颗、第3组4颗，3+4=7颗B珠。'
        : '第2组2颗、第3组3颗，2+3=5颗B珠。',
    },
    {
      id: `${prefix}-parts`,
      knowledge: `${id}-beads-parts`,
      prompt: '依次填被遮住的第2组、第3组各有几颗B珠。',
      visual,
      rule: { kind: 'steps', values: review ? [3, 4] : [2, 3] },
      hint: 'B珠从第一组开始，每一组比前一组多1。顺序按第2组再第3组。',
      explanation: review
        ? '依次3、4，不是合计7填两次。'
        : '依次2、3，不是合计5填两次。',
    },
    {
      id: `${prefix}-all`,
      knowledge: `${id}-beads-all`,
      prompt: '第2和第3组遮住的A珠与B珠全部合起来有几颗？',
      visual,
      rule: { kind: 'number', value: a + b },
      hint: '全部包含两类，先各数A与B，再相加。',
      explanation: `${a}+${b}=${a + b}颗。全部珠数与B珠数不同。`,
    },
    {
      id: `${prefix}-same-a`,
      knowledge: `${id}-beads-same-a`,
      prompt: '随着组数向后增加，每组A珠数量也会增加吗？',
      visual,
      choices: [
        { id: 'no', label: '不会，每组始终1颗A珠' },
        { id: 'yes', label: '会，A和B都每组增加1颗' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '规则分别说明A不变、B每组多1，不能把B的变化套到A。',
      explanation: '每组A珠固定1颗，变化的是B珠数量。',
    },
    {
      id: `${prefix}-check`,
      knowledge: `${id}-beads-check`,
      prompt: '怎样检查推出来的被遮部分是否符合规则？',
      visual,
      choices: [
        { id: 'rule', label: '看相邻每组B是否多1，A是否每组1颗' },
        { id: 'color', label: '只看露出部分颜色好不好看' },
      ],
      rule: { kind: 'choice', value: 'rule' },
      hint: '按已知规则逐组核对，包括遮挡两端的露出组。',
      explanation: '同时检查第一到第四组关系，不能只检查一端。',
    },
    {
      id: `${prefix}-uncertain`,
      knowledge: `${id}-beads-uncertain`,
      prompt:
        '另一串珠子没有给规则，也没有说明遮住几组，只看少量露出的珠子，能保证隐藏部分只有一种答案吗？',
      choices: [
        { id: 'no', label: '不能，需要更多条件或实际揭开检查' },
        { id: 'yes', label: '能，任何有限排列都有唯一规律' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '本题与有明确规则、组范围的图不同；不能把自己的猜测当确定事实。',
      explanation:
        '缺少规则和范围时可能有不同解释，应说明条件、摆一摆或揭开核对。',
    },
  ];
}
export const sujiaoBeadSteps: Lesson['steps'] = [
  {
    title: '遮住两组，先分别推再合起来',
    text: '这是原创例示：每组1颗A珠，B珠从1颗开始，每组多1颗。第2、3组遮住，分别有2、3颗B，共5颗B；A各1，共2颗。求所有珠子是2+5=7，不能混同B珠数量。',
    visual: sujiaoMainBeads,
    activity: '按给定规则实际摆四组，再遮住第2和第3组，分别说两类珠数。',
  },
  {
    title: '讲出条件，再揭开核对',
    text: '检查A每组固定1，B每组多1，包括前后露出的组。只有给出规则与遮挡范围，才能在这些条件下确定答案。另编规律时允许合理不同解释，不把少量排列的某种猜测称为唯一答案。',
    activity:
      '让家长遮住自己的排列，说明规则和范围后推测，实际揭开核对；另试不同规则。',
  },
];
