import type {
  Lesson,
  Question,
  SolidBuildVisual,
  SolidShape,
} from '../learning/types';

import { solidBuildCount } from '../learning/solid-build';
const id = 'sj-upper-final-shapes';
export const sujiaoMainBuild: SolidBuildVisual = {
  kind: 'solid-build',
  shapes: [
    'sphere',
    'cylinder',
    'cuboid',
    'cylinder',
    'cylinder',
    'cylinder',
    'cylinder',
    'cube',
    'cube',
  ],
};
export const sujiaoReviewBuild: SolidBuildVisual = {
  kind: 'solid-build',
  shapes: [
    'cube',
    'cylinder',
    'cuboid',
    'cuboid',
    'cuboid',
    'cylinder',
    'cylinder',
    'cuboid',
    'cuboid',
  ],
};
const names: Record<SolidShape, string> = {
  cube: '正方体',
  cuboid: '长方体',
  cylinder: '圆柱',
  sphere: '球',
};
export function sujiaoBuildTasks(review: boolean): Question[] {
  const visual = review ? sujiaoReviewBuild : sujiaoMainBuild;
  const prefix = `${id}-${review ? 'r' : 'q'}-build`;
  return [
    ...(['cube', 'cuboid', 'cylinder', 'sphere'] as const).map(
      (shape): Question => ({
        id: `${prefix}-${shape}`,
        knowledge: `${id}-build-${shape}`,
        prompt: `看分解拼搭示意，${names[shape]}部件一共有几个？每个完整部件只数一次。`,
        visual,
        rule: { kind: 'number', value: solidBuildCount(visual, shape) },
        hint: '按上、中、下顺序逐个找同类，不数露出的面，也不补不存在的后排。',
        explanation: `${names[shape]}有${solidBuildCount(visual, shape)}个；没有这种形状时应填0。`,
      }),
    ),
    {
      id: `${prefix}-total`,
      knowledge: `${id}-build-total`,
      prompt: '这件作品的分解图一共显示几个立体部件？',
      visual,
      rule: { kind: 'number', value: 9 },
      hint: '逐个数部件，四种类型不等于四个部件；同一部件不能因为有几个面就重复计数。',
      explanation: '共9个部件。每个部件算1个，不把作品整体再加1。',
    },
    {
      id: `${prefix}-face`,
      knowledge: `${id}-build-face`,
      prompt: '一个正方体部件露出几个面，计数部件时应怎样算？',
      visual,
      choices: [
        { id: 'one', label: '仍算1个完整部件' },
        { id: 'many', label: '每个露出的面都算一个部件' },
      ],
      rule: { kind: 'choice', value: 'one' },
      hint: '数的是整个物体，不是物体表面。',
      explanation: '一个正方体的不同面属于同一个物体，不能重复计数。',
    },
    {
      id: `${prefix}-whole`,
      knowledge: `${id}-build-whole`,
      prompt: '身体部件是长方体，就能说整件组合作品也是一个长方体吗？',
      visual,
      choices: [
        { id: 'no', label: '不能，部件与整个组合的形状不同' },
        { id: 'yes', label: '能，身体是什么整体就一定是什么' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '观察头、四肢和身体的整个轮廓，不只看一个部件。',
      explanation:
        '这件组合作品包含不同部件，整体不是一个完整长方体；不能用局部替代整体。',
    },
  ];
}
export const sujiaoBuildSteps: Lesson['steps'] = [
  {
    title: '组合图，按部件分类计数',
    text: '这幅原创分解拼搭示意把部件留缝，全部部件可见，没有隐藏后排。按上、中、下找相同立体，每个完整部件只数一次；正方体露出多个面仍是一个部件。间隙只是便于观察，不是可以悬空的实际结构。',
    visual: sujiaoMainBuild,
    activity: '指着每个完整部件归类，实际用模型摆作品并核对。',
  },
  {
    title: '局部、整体与没有的形状',
    text: '部件归类后再合起来核对所有部件。整体作品不另加1，也不能只凭身体是长方体就说整个作品是长方体。另一幅图如果没有球，球的数量是0，不猜有看不见的球。实际自由拼搭可以有不同作品，要指实物说明。',
    visual: sujiaoReviewBuild,
    activity: '实际摆不同组合，逐类计数并比较单个部件与整个作品。',
  },
];
